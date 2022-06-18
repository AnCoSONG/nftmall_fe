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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";
import { onDeactivated, ref, toRefs } from "vue";
import { onMountedOrActivated } from "@vant/use";
import { px2rem } from "../utils";
import { Dialog, Toast } from "vant";

type PropType = {
    src: string; // 3d model src
    backup_img: string; // 兜底的图像展示
    rotate_mode: RotateMode; // 摇摆样式
};
enum RotateMode {
    FULL = 0, // 完整
    SWAG = 1, // 摇摆
}
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
const canvasHeight = ref(350);
const webglLoading = ref(true);
const loadProgress = ref(0);
let productModel: Three.Group;
let gui: GUI;
let param;
let scene: Three.Scene | null;
let camera: Three.PerspectiveCamera | null;
let renderer: Three.WebGLRenderer | null;
let controls: OrbitControls | null;
let period_delta = 0;

const loadModel = async (model_url: string) => {
    const loader = new GLTFLoader();
    const model = await loader.loadAsync(model_url, (event) => {
        loadProgress.value = (event.loaded / event.total) * 100;
        console.log(`已加载: ${loadProgress.value}% `);
    });
    console.log(model_url, model);
    return model;
};

onMountedOrActivated(async () => {
    if (webglSupport.value) {
        webglLoading.value = true;
        scene = new Three.Scene();
        camera = new Three.PerspectiveCamera(
            60,
            canvasWidth.value / canvasHeight.value,
            0.1,
            1000
        );
        renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(canvasWidth.value, canvasHeight.value);
        renderer.setPixelRatio(window.devicePixelRatio);
        // const geometry = new Three.BoxGeometry(1, 1, 1);
        // const material = new Three.MeshBasicMaterial({ color: 0xffff00 });
        // const cube = new Three.Mesh(geometry, material);
        // scene.add(cube);
        if (src.value) {
            const model = await loadModel(src.value);
            scene.add(model.scene);
            productModel = model.scene;
            console.log(scene);
        } else {
            Dialog.alert({
                title: "加载失败",
                message: "模型加载失败，将切换为交互图像展示。",
                messageAlign: "center",
            });
            webglSupport.value = false;
        }
        // 添加环境光
        const ambientlight = new Three.AmbientLight(0xffffff, 0.5);
        scene.add(ambientlight);
        // 添加平行光
        const dirlight = new Three.DirectionalLight(0xffffff, 1.3);
        dirlight.position.set(0, 0, 10);
        // dirlight.lookAt(0, 0, 0);
        scene.add(dirlight);
        // 添加 半球光
        // 添加控制器
        // controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 3.5);
        // controls.update()
        function animate() {
            requestAnimationFrame(animate);
            if (productModel) {
                if (rotate_mode.value === RotateMode.FULL) {
                    productModel!.rotation.y += 0.01;
                } else if (rotate_mode.value === RotateMode.SWAG) {
                    period_delta += 0.1;
                    productModel.rotation.y +=
                        0.005 * Math.sin(0.5 * period_delta);
                }
            }
            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;
            // controls!.update()
            renderer!.render(scene!, camera!);
        }
        webglLoading.value = false;
        document
            .querySelector("#product-model-viewer")!
            .appendChild(renderer.domElement);
        param = {
            ambientLightIntensity: ambientlight.intensity,
            dirlightX: dirlight.position.x,
            dirlightY: dirlight.position.y,
            dirlightZ: dirlight.position.z,
            dirlightIntensity: dirlight.intensity,
        };
        // gui = new GUI()
        // gui.add(param, 'ambientLightIntensity', 0, 10, 0.01).onChange(v => {
        //     ambientlight.intensity = v
        //     // console.log(ambientlight.intensity)
        // })
        // gui.add(param, 'dirlightX', -10, 10, 0.01).onChange(v => {
        //     dirlight.position.x = v
        // })
        // gui.add(param, 'dirlightY', -10, 10, 0.01).onChange(v => {
        //     dirlight.position.y = v
        // })
        // gui.add(param, 'dirlightZ', -10, 10, 0.01).onChange(v => {
        //     dirlight.position.z = v
        // })
        // gui.add(param, 'dirlightIntensity', 0, 10, 0.01).onChange(v => {
        //     dirlight.intensity = v
        // })
        // gui.open()
        animate();
    } else {
        Toast({
            type: "fail",
            message: "您的设备不支持WebG,产品将以交互图像形式展示!",
        });
    }
});

onDeactivated(() => {
    if (gui) {
        gui.close();
    }
    scene = null;
    controls = null;
    camera = null;
    renderer = null;
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
        min-height: px2rem(200);
        border-radius: px2rem(8);
        overflow: hidden;
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
