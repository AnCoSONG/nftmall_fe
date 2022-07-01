<template>
    <div class="product-viewer">
        <div id="product-model-viewer" v-if="webglSupport"
            :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
            <van-loading vertical style="justify-content: center; height: 100%" v-show="webglLoading">
                {{ loadProgress.toFixed(2) }}%</van-loading>
        </div>
        <van-image v-else class="img" :src="backup_img" :class="{ loop: notSupport }" :style="{
            transform: `rotateX(${xRotate}deg) rotateY(${yRotate}deg)`,
        }">
            <template #loading>
                <van-loading vertical>加载中</van-loading>
            </template>
        </van-image>
    </div>
</template>
<script lang="ts"></script>
<script setup lang="ts">
import WebGL from "../utils/webgl";
import * as Three from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";
import { onDeactivated, ref, toRefs } from "vue";
import { onMountedOrActivated } from "@vant/use";
import { px2rem, extract_suffix } from "../utils";
import { Dialog, Toast } from "vant";
import { AnimationMixer, Box3, Vector3, PMREMGenerator } from "three";
import { computed } from "@vue/reactivity";
import { authSrc } from "../plugins/cos-sdk";

type PropType = {
    src: string; // 3d model src
    backup_img: string; // 兜底的图像展示
    rotate_mode: RotateMode; // 摇摆样式
};

enum RotateMode {
    FULL = 0, // 完整
    SWAG = 1, // 摇摆
}

const MAP_NAMES = [
    'map',
    'aoMap',
    'emissiveMap',
    'glossinessMap',
    'metalnessMap',
    'normalMap',
    'roughnessMap',
    'specularMap',
];
const props = defineProps<PropType>();
const { src, backup_img, rotate_mode } = toRefs(props);

// 3D模型
const webglSupport = ref(WebGL.isWebGLAvailable());
const canvasWidth = ref(
    <number>px2rem(380, true) *
    parseFloat(
        document
            .getElementsByTagName("html")[0]
            .style.fontSize.split("px")[0]
    )
);
const MAX_CANVAS_WIDTH = 440;
canvasWidth.value = Math.min(canvasWidth.value, MAX_CANVAS_WIDTH)
const canvasHeight = computed(() => canvasWidth.value)
const webglLoading = ref(true);
const loadProgress = ref(0);
let productModel: Three.Group;
let gui: GUI;
let param;
let scene: Three.Scene | null;
let camera: Three.PerspectiveCamera | null;
let renderer: Three.WebGLRenderer | null;
let controls: OrbitControls | null;
let mixer: Three.AnimationMixer | null;
let object: Three.Group | null;
let clips: Three.AnimationClip[] = [];
let pmremGenerator: PMREMGenerator | null;
let period_delta = 0;
let clock: Three.Clock | null;

const loadModel = async (model_url: string) => {
    const loader = new GLTFLoader();
    const suffix = extract_suffix(model_url)
    if (['glb', 'gltf'].indexOf(suffix) !== -1) {
        console.log('true')
        const model = await loader.loadAsync(authSrc(model_url), (event) => {
            loadProgress.value = (event.loaded / event.total) * 100;
            console.log(`已加载: ${loadProgress.value}% `);
        });
        console.log(model_url, model);
        return model;
    } else if (['cjysc'].indexOf(suffix) !== -1) {
        // 加密文件，揭秘后使用
        alert('TODO: 文件解密')
        return null;
    }
};

const getCubeMapTexture = (environment: any): Promise<{ envMap: any }> => {
    const { path } = environment;
    // no envmap
    if (!path) return Promise.resolve({ envMap: null });
    pmremGenerator = new PMREMGenerator(renderer!)
    pmremGenerator.compileEquirectangularShader();
    return new Promise((resolve, reject) => {
        new RGBELoader()
            .load(path, (texture) => {
                if (pmremGenerator) {
                    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                    pmremGenerator.dispose();
                    resolve({ envMap });
                }

            }, undefined, reject);

    });

}

const setupEnvironment = async () => {
    const environment = { path: 'https://mall-1308324841.file.myqcloud.com/venice_sunset_1k.hdr' }
    const { envMap } = await getCubeMapTexture(environment)
    if (scene) {
        scene.environment = envMap;
    }
}

onMountedOrActivated(async () => {
    if (webglSupport.value) {
        webglLoading.value = true;
        //  加载资源
        if (!src.value) {
            Dialog.alert({
                title: "加载失败",
                message: "模型加载失败，将切换为交互图像展示。",
                messageAlign: "center",
            });
            webglSupport.value = false;
            return;
        }
        const model = await loadModel(src.value);
        if (!model) {
            Dialog.alert({
                title: "加载失败",
                message: "模型加载失败，将切换为交互图像展示。",
                messageAlign: "center",
            });
            webglSupport.value = false;
            return;
        }

        // 创建场景
        scene = new Three.Scene()

        // 创建相机
        camera = new Three.PerspectiveCamera(
            60,
            canvasWidth.value / canvasHeight.value,
            0.1,
            1000
        );

        // 创建渲染器
        renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
        renderer.physicallyCorrectLights = true
        renderer.outputEncoding = Three.sRGBEncoding
        renderer.setSize(canvasWidth.value, canvasHeight.value);
        renderer.setPixelRatio(window.devicePixelRatio);

        // 创建环境, 模拟光照
        await setupEnvironment()

        // 创建控制器
        controls = new OrbitControls(camera!, renderer!.domElement);
        // 加载模型
        object = model.scene || model.scenes[0]
        clips = model.animations || [];
        if (!object) {
            Dialog.alert({
                title: "加载失败",
                message: "模型加载失败，将切换为交互图像展示。",
                messageAlign: "center",
            });
            webglSupport.value = false;
            return;
        }
        // 获取模型大小
        const box = new Box3().setFromObject(object);
        const size = box.getSize(new Vector3()).length();
        const center = box.getCenter(new Vector3());
        controls?.reset();
        // object.position.x += (object.position.x - center.x)
        // object.position.y += (object.position.y - center.y)
        // object.position.z += (object.position.z - center.z)
        if (controls) {
            controls.maxDistance = size * 10
        }
        camera.near = size / 100
        camera.far = size * 100
        camera.updateProjectionMatrix()
        console.log(size, center)
        camera.position.copy(center)
        // camera.position.x += size / 2.0
        // camera.position.y += size / 5.0
        camera.position.z += size / 0.75
        console.log(camera.position)
        controls.maxDistance = size / 0.5
        controls.minDistance = size / 1.2
        controls.autoRotate = true
        controls.autoRotateSpeed = 5
        camera.lookAt(center)
        scene.add(object);
        productModel = object
        console.log(scene);

        // 创建动作渲染器
        mixer = new Three.AnimationMixer(object);
        clips.forEach((clip) => {
            // @ts-ignore
            mixer?.clipAction(clip).startAt(1).play()
        })

        // 添加环境光
        const ambientlight = new Three.AmbientLight(0xffffff, 0.8);
        scene.add(ambientlight);
        // // 添加平行光
        // // const dirlight = new Three.DirectionalLight(0xffffff, 0.2);
        // // dirlight.position.set(0, 10, 0);
        // // dirlight.lookAt(center);
        // // scene.add(dirlight);
        // // 添加点光源
        // const spotlight = new Three.SpotLight(0xf3f687, 1);
        // spotlight.position.set(center.x, center.y + size * 0.5, center.z + size * 1.5)
        // spotlight.castShadow = true;
        // spotlight.lookAt(center);
        // scene.add(spotlight)
        // // 添加 半球光
        const hemilight = new Three.HemisphereLight(0xffff66, 0x080820, 0.8)
        scene.add(hemilight)

        // 模拟环境

        // 控制器
        controls.update()

        // 创建时钟
        clock = new Three.Clock()
        function animate(time: number) {
            requestAnimationFrame(animate);
            controls!.update()
            mixer && mixer.update(clock!.getDelta())
            renderer!.render(scene!, camera!);
        }
        webglLoading.value = false;
        document
            .querySelector("#product-model-viewer")!
            .appendChild(renderer.domElement);
        // param = {
        //     ambientLightIntensity: ambientlight.intensity,
        //     x: camera.position.x,
        //     y: camera.position.y,
        //     z: camera.position.z
        // };
        // gui = new GUI()
        // gui.add(param, 'ambientLightIntensity', 0, 10, 0.01).onChange(v => {
        //     ambientlight.intensity = v
        //     // console.log(ambientlight.intensity)
        // })
        // gui.add(param, 'x', -5, 5, 0.01).onChange(v => {
        //     if (camera) camera.position.x = v;
        // })
        // gui.add(param, 'y', -5, 5, 0.01).onChange(v => {
        //     if (camera) camera.position.y = v;
        // })
        // gui.add(param, 'z', -5, 5, 0.01).onChange(v => {
        //     if (camera) camera.position.z = v;
        // })
        // gui.open()
        requestAnimationFrame(animate);
    } else {
        Toast({
            type: "fail",
            message: "您的设备不支持WebG,产品将以交互图像形式展示!",
        });
    }
});

function traverseMaterials(object: Three.Group, callback: Function) {
    object.traverse((node) => {
        // @ts-ignore
        if (!node.isMesh) return;
        // @ts-ignore
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach(callback);
    });
}

const clear = () => {
    if (!object) return;
    scene?.remove(object)

    object?.traverse((node) => {
        //@ts-ignore
        if (!node.isMesh) return;
        //@ts-ignore
        node.geomerty.dispose();
    })

    traverseMaterials(object!, (material: any) => {

        MAP_NAMES.forEach((map) => {

            if (material[map]) material[map].dispose();

        });

    });

}

onDeactivated(() => {
    if (gui) {
        gui.destroy()
    }
    clear()
    scene = null;
    controls?.dispose()
    controls = null;
    camera = null;
    renderer?.clear()
    renderer?.dispose()
    renderer = null;
    if (mixer) {
        mixer.stopAllAction()
        mixer.uncacheRoot(mixer.getRoot())
        mixer = null;
    }
    loadProgress.value = 0;
});



// 兜底展示
//* 图像展示是兜底方案
const xRotate = ref(0);
const yRotate = ref(0);
const notSupport = ref(false);
const handler = function (event: DeviceOrientationEvent) {
    // 只能在https或者localhost下使用
    // gamma: 从左到右
    // console.log(event)
    yRotate.value = event.gamma ?? 0;
    yRotate.value *= 0.4;
    // beta: 从前到后的运动
    xRotate.value = event.beta ?? 0;
    xRotate.value -= 45;
    xRotate.value *= 0.4;
    // console.log(xRotate.value, yRotate.value)
};

onMountedOrActivated(async () => {
    // 支持陀螺仪就让用户交互来实现藏品头图变化
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", handler, true);
    } else {
        notSupport.value = true;
    }
});

const onWindowResize = () => {
    canvasWidth.value =
        <number>px2rem(380, true) *
        parseFloat(
            document
                .getElementsByTagName("html")[0]
                .style.fontSize.split("px")[0]
        );
    canvasWidth.value = Math.min(canvasWidth.value, MAX_CANVAS_WIDTH);
    if (camera && renderer) {
        camera.aspect = canvasWidth.value / canvasHeight.value;
        camera.updateProjectionMatrix();

        renderer.setSize(canvasWidth.value, canvasHeight.value);
    }
};

onDeactivated(() => {
    window.removeEventListener("deviceorientation", handler);
    window.removeEventListener("resize", onWindowResize);
});

window.addEventListener("resize", onWindowResize);
</script>
<style lang="scss" scoped>
.product-viewer {
    margin-top: px2rem(50);
    margin-bottom: px2rem(50);
    // overflow: hidden;
    perspective: px2rem(500);
    transform-style: preserve-3d;
    perspective-origin: 50% 50%;

    .img {
        border: 2px solid #ddd;
        width: px2rem(300);
        min-height: px2rem(300);
        border-radius: px2rem(8);
        overflow: hidden;
        margin-bottom: px2rem(50);
        box-shadow: 0 px2rem(4) px2rem(20) rgba(210, 215, 112, 0.25);
        // transform: rotate3d(0, 1, 0, -30deg);
        // transform: rotateX(10deg);

        &.loop {
            animation: rotate 6s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
        }
    }

    @keyframes rotate {
        0% {
            transform: rotateY(-15deg) translateZ(0px);
        }

        // 25% {
        //     transform: rotateY(30deg);
        // }

        50% {
            transform: rotateY(15deg) translateZ(-30px);
        }

        // 75% {
        //     transform: rotateY(-30deg) translateZ(100px);
        // }

        100% {
            transform: rotateY(-15deg) translateZ(0px);
        }
    }
}
</style>
