<template>
    <Subpage title="藏品详情" back-to="/">
        <van-skeleton :loading="!product" :row="20">
            <img src="https://mall-1308324841.file.myqcloud.com/static/product_bg.png" class="product-bg" alt=""
                :style="{ opacity: bgLoaded ? 1 : 0 }" @load="bgLoaded = true" />
            <div class="product" v-if="product">
                <div class="product-preview">
                    <ProductViewer :src="product.preview_src" :rotate_mode="0" :backup_img="product.preview_img">
                    </ProductViewer>
                </div>
                <div class="timeline box" @click="onStepClick" v-if="product.attribute !== 'gift'">
                    <!-- todo: click 显示时间细则 -->
                    <van-config-provider :theme-vars="theme.product_timeline">
                        <van-steps active-color="#E5E798" :active="currentActive" inactive-color="#888">
                            <van-step>藏品上架</van-step>
                            <van-step v-if="product.attribute != 'notShowLottery'">抽签开放</van-step>
                            <van-step v-if="product.attribute != 'notShowLottery'">抽签结束</van-step>
                            <van-step>开放抢购</van-step>
                        </van-steps>
                    </van-config-provider>
                    <van-popup round closeable teleport="#app" v-model:show="popup_show" position="bottom"
                        :style="{ height: 'auto', padding: `${px2rem(40)} ${px2rem(10)}`, paddingBottom: `${px2rem(20)}`, boxSizing: 'border-box' }"
                        safe-area-inset-bottom>
                        <van-steps :active="currentActive" direction="vertical" active-icon="success">
                            <van-step style="background-color:white!important;">
                                <div>藏品上架</div>
                                <div>{{ productCreateTimeFormat }}</div>
                            </van-step>
                            <van-step v-if="product.attribute != 'notShowLottery'">
                                <div>抽签开放</div>
                                <div>{{ drawTimeFormat }}</div>
                            </van-step>
                            <van-step v-if="product.attribute != 'notShowLottery'">
                                <div>抽签结束</div>
                                <div>{{ drawEndTimeFormat }}</div>
                            </van-step>
                            <van-step>
                                <div>开放抢购</div>
                                <div>{{ saleTimeFormat }}</div>
                            </van-step>
                        </van-steps>
                    </van-popup>
                </div>
                <div class="product-price-limit box">
                    <Price :small-size="(px2rem(20) as string)" :integral-size="(px2rem(32) as string)" money-type="¥"
                        :price="product.price" />

                    <div class="limit" v-if="product.attribute !== 'gift'">
                        每人限购 <b color="gold">{{ product.limit }}</b> 份
                    </div>
                    <div class="limit" v-else>
                        仅符合条件的用户可获赠
                    </div>
                </div>
                <div class="product-info box">
                    <div class="left">
                        <div class="name">{{ product.name }}</div>
                        <div class="tags">
                            <Tag :data="tag" v-for="tag in product.tags"></Tag>
                        </div>
                    </div>
                    <div class="right">
                        <div class="type">
                            <TypeIcon :type="product.type"></TypeIcon>
                        </div>
                        <!-- <div class="limit"></div> -->
                    </div>
                </div>

                <div class="detail box creator-box">
                    <!-- <div class="title">创作者</div> -->
                    <!-- <div class="content"> -->
                    <div class="creator">
                        <van-image class="avatar" round :src="product.publisher?.avatar">
                            <template #loading>
                                <ImageLoader />
                            </template>
                        </van-image>
                        <div class="creator-text">创作者</div>
                        <div class="name">{{ product.publisher?.name }}</div>
                    </div>
                    <!-- </div> -->
                </div>
                <div class="detail box">
                    <div class="title">藏品故事</div>
                    <div class="content">
                        <!-- todo: 上COS后图像的地址可能需要映射一下 -->
                        <van-image class="img" v-for="item in product.details" :src="item">
                            <template #loading>
                                <ImageLoader />
                            </template>
                        </van-image>
                    </div>
                </div>
                <div class="must-know box">
                    <div class="title">权益须知</div>
                    <div class="content" v-html="previllageMustKnowHtml">
                    </div>
                </div>
                <div class="must-know box">
                    <div class="title">购买须知</div>
                    <div class="content" v-html="buyMustKnowHtml">
                    </div>
                </div>
                <div class="bottom-bar">
                    <div class="counter">
                        <div class="jian operation" @click="operateCount(-1)">
                            -
                        </div>
                        <div class="num">{{ count }}</div>
                        <div class="jia operation" @click="operateCount(1)">+</div>
                    </div>
                    <!-- todo 状态体现在按钮上 即将 ｜ 倒计时 ｜ 抽签 ｜ 购买 ｜ 已售罄 -->

                    <!-- 抽签前 -->
                    <div class="pay-btn" :class="{ disabled: !btnClickable }" @click="onBtnClick">
                        <!-- 敬请期待，倒计时 -->
                        <div v-if="isLoading">
                            <van-loading color="#333" size="18" v-if="btnClickable" />
                            <van-loading color="#ddd" size="18" v-else />
                        </div>
                        <div v-show="!isLoading" class="main-text" :class="{ noCountDown: !isCountdown }">
                            {{ statusText }}
                        </div>
                        <div v-if="isCountdown" class="countdown" v-show="!isLoading">
                            {{
                                    `${countDownRef.hours
                                        .toString()
                                        .padStart(2, "0")}:${countDownRef.minutes
                                            .toString()
                                            .padStart(2, "0")}:${countDownRef.seconds
                                                .toString()
                                                .padStart(2, "0")}`
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </van-skeleton>
    </Subpage>
</template>
<script lang="ts">
export default {
    name: "product",
};
</script>
<script setup lang="ts">
import Subpage from "../../components/Subpage.vue";
import Price from "../../components/Price.vue";
import Tag from "../../components/Tag.vue";
import TypeIcon from "../../components/TypeIcon.vue";
import { px2rem, redirectForOpenid, setupSharing, TIME_FORMAT } from "../../utils";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, toRef, watch, watchEffect } from "vue";
import { onMountedOrActivated, useCountDown } from "@vant/use";
import ProductViewer from "../../components/ProductViewer.vue";
import ImageLoader from "../../components/ImageLoader.vue";
import {
    fetchProduct,
    fetchIsDraw,
    participateDraw,
    fetchIsLucky,
    get_stock_count,
    seckill,
    fetchUnpaid,
    fetchProductBoughtCount,
    fetchDoc
} from "../../api";
import { Dialog, Notify, Toast } from "vant";
import dayjs from "dayjs";
import Dompurify from 'dompurify';
import { useUserStore } from "../../stores/user";
import { useThemeStore } from "../../stores/theme";
import { useAppStore } from "../../stores/app";
const app = useAppStore()

// 背景
const bgLoaded = ref(false)

const theme = useThemeStore()

// 拿到id获取藏品类别信息
const props = defineProps({
    id: {
        type: String,
        default: "",
    },
});

const user = useUserStore();
const id = toRef(props, "id");
const product = ref<Product>();
const route = useRoute();
const router = useRouter();
const popup_show = ref(false);

// for test
// if (app.isWx && app.openid === '') {
//     // 如果是微信且用户没有Openid，重定向
//     redirectForOpenid()
// }

const onStepClick = () => {
    // todo: 使用Popup实现展示效果
    // Toast({
    //     type: "text",
    //     message: "待实现：展示具体时间",
    // });
    popup_show.value = true
};

const productCreateTimeFormat = computed(() => {
    if (product.value) {
        return dayjs(product.value.create_date).format(TIME_FORMAT);
    }
})

const drawTimeFormat = computed(() => {
    if (product.value) {
        return dayjs(product.value.draw_timestamp).format(TIME_FORMAT);
    }
})

const drawEndTimeFormat = computed(() => {
    if (product.value) {
        return dayjs(product.value.draw_end_timestamp).format(TIME_FORMAT);
    }
})

const saleTimeFormat = computed(() => {
    if (product.value) {
        return dayjs(product.value.sale_timestamp).format(TIME_FORMAT);
    }
})

// 购物个数
const count = ref(1);
const operateCount = (payload: number) => {
    if (product.value) {
        if (count.value + payload < 1) {
            Toast({
                message: "购买数量不能小于1",
                duration: 1500,
                forbidClick: true,
                icon: "warning-o",
                iconSize: "1.6rem",
            });
            return;
        } else if (count.value + payload > 1) {
            // todo: 目前只支持一个，后期增加一次买多个
            Dialog.alert({
                title: "提示",
                message:
                    "目前一次只能购买<b>1</b>份!\n如需购买多份请完成付费后再回到本页购买。",
                allowHtml: true,
            });
            return;
        } else {
            count.value += payload;
        }
    }
    return;
    // todo: 3 is limit, change to limit
};

// 阶段
const currentStage = ref<0 | 1 | 2 | 3 | 4 | 5>(0);

const currentActive = computed(() => {
    if (currentStage.value === 0 || currentStage.value === 1) {
        return 0;
    } else if (currentStage.value === 2) {
        return 1;
    } else if (currentStage.value === 3 || currentStage.value === 4) {
        return 2;
    } else if (currentStage.value === 5) {
        return 3;
    }
});

// 倒计时
const countDown = useCountDown({
    time: 0, // time 后端生成
    onFinish: () => {
        isCountdown.value = false;
        // location.reload();
        // fetch next stage data
    },
});
const countDownRef = countDown.current;
const isCountdown = ref(false);
const isLoading = ref(false);
const btnClickable = ref(false); // 购买位按钮是否可点击
const isDrawn = ref(false);
const isLucky = ref<number>(-1); // 0 无资格 1 有资格 -1 未生成结果 -2 出错
const unpaid = ref<{ code: number; order_id?: string }>({ code: 0 });
const bounght_count = ref(0);
const stock_count = ref(0);
const statusText = ref("");
const buyMustKnow = ref("")
const previllageMustKnow = ref("")
const isResultShowed = ref(false)

const buyMustKnowHtml = computed(() => Dompurify.sanitize(buyMustKnow.value ?? ''))
const previllageMustKnowHtml = computed(() => Dompurify.sanitize(previllageMustKnow.value ?? ''))

const fetchDraw = async () => {
    isLoading.value = true;
    if (!user.isLogin) {
        Toast({
            message: "请先登录",
            duration: 1500,
            forbidClick: true,
            icon: "warning-o",
            iconSize: "1.6rem",
        });
        isLoading.value = false;
        return;
    }
    const data = await fetchIsDraw(user.data.id, id.value);
    isLoading.value = false;
    isDrawn.value = data;
};

const fetchLucky = async () => {
    isLoading.value = true;
    if (!user.isLogin) {
        Toast({
            message: "请先登录",
            duration: 1500,
            forbidClick: true,
            icon: "warning-o",
            iconSize: "1.6rem",
        });
        isLoading.value = false;
        return;
    }
    const data = await fetchIsLucky(user.data.id, id.value);
    isLoading.value = false;
    isLucky.value = data;
};

const fetchInit = async () => {
    isLoading.value = true;
    if (!user.isLogin) {
        // 不登陆也应获取到
        isLoading.value = false;
        const [stockRes, buyMustKnowRes, previllageMustKnowRes] = await Promise.all([
            get_stock_count(id.value, "redis"),
            fetchDoc('购买须知'),
            fetchDoc('权益须知')
        ])
        stock_count.value = stockRes;
        if (buyMustKnowRes) {
            buyMustKnow.value = buyMustKnowRes.content
        }
        if (previllageMustKnowRes) {
            previllageMustKnow.value = previllageMustKnowRes.content
        }
        return;
    }

    const [drawRes, luckyRes, unpaidRes, stockRes, bounghtCountRes, buyMustKnowRes, previllageMustKnowRes] =
        await Promise.all([
            fetchIsDraw(user.data.id, id.value),
            fetchIsLucky(user.data.id, id.value),
            fetchUnpaid(user.data.id, id.value),
            get_stock_count(id.value, "redis"),
            fetchProductBoughtCount(user.data.id, id.value),
            fetchDoc('购买须知'),
            fetchDoc('权益须知')
        ]);
    isLoading.value = false;
    isLucky.value = luckyRes;
    isDrawn.value = drawRes;
    unpaid.value = unpaidRes;
    stock_count.value = stockRes;
    bounght_count.value = bounghtCountRes ?? 0;
    if (buyMustKnowRes) {
        buyMustKnow.value = buyMustKnowRes.content
    }
    if (previllageMustKnowRes) {
        previllageMustKnow.value = previllageMustKnowRes.content
    }
    return;

};

onMountedOrActivated(async () => {
    if (id.value !== "") {
        const data = await fetchProduct(id.value, true);
        // console.log(data);
        if (data) {
            product.value = { ...data };
            if (app.isWx) {
                await setupSharing(
                    product.value.name,
                    product.value.description,
                    product.value.preview_img,
                    // `https://www.jinyuanshuzi.com/redirect?to=${window.location.toString()}`
                    window.location.href
                )
            }
        } else {
            // 404
            router.push("/404");
        }

    }
    await fetchInit();
})

watchEffect(() => {
    if (!product.value) {
        statusText.value = "请刷新页面";
        return;
    }
    if (product.value.attribute === 'gift') {
        if (!user.isLogin) {
            btnClickable.value = true;
            statusText.value = "请先登录";
        } else {
            btnClickable.value = false
            statusText.value = '赠品不支持购买'
        }
        return;
    }
    const now = dayjs().valueOf();
    const draw_timestamp = dayjs(product.value.draw_timestamp).valueOf();
    const draw_end_timestamp = dayjs(
        product.value.draw_end_timestamp
    ).valueOf();
    const sale_timestamp = dayjs(product.value.sale_timestamp).valueOf();
    if (draw_timestamp - now >= 24 * 60 * 60 * 1000) {
        currentStage.value = 0;
        btnClickable.value = false;
        statusText.value = "敬请期待";
    } else if (
        draw_timestamp - now >= 0 &&
        draw_timestamp - now < 24 * 60 * 60 * 1000
    ) {
        currentStage.value = 1;
        btnClickable.value = false;
        countDown.reset(draw_timestamp - now);
        countDown.start();
        isCountdown.value = true;
        statusText.value = "待抽签";
    } else if (draw_end_timestamp - now >= 0) {
        currentStage.value = 2;
        if (!user.isLogin) {
            btnClickable.value = true;
            statusText.value = "请先登录";
        } else {
            countDown.reset(draw_end_timestamp - now);
            countDown.start();
            isCountdown.value = true;
            if (isDrawn.value) {
                btnClickable.value = false;
                statusText.value = "已抽签";
            } else {
                btnClickable.value = true;
                statusText.value = "抽签";
            }
        }
    } else if (now - draw_end_timestamp < 1 * 60 * 1000) {
        // 5分钟内优先展示正在结算
        currentStage.value = 3;
        btnClickable.value = false;
        countDown.reset(draw_end_timestamp + 1 * 60 * 1000 - now);
        countDown.start();
        isCountdown.value = true;
        statusText.value = "正在统计"; // 本质上draw_end_timestamp时就应该已完成结算
    } else if (sale_timestamp - now >= 0) {
        currentStage.value = 4;
        if (!user.isLogin) {
            btnClickable.value = true;
            statusText.value = "请先登录";
        } else {
            if (isLucky.value === 1) {
                countDown.reset(sale_timestamp - now);
                countDown.start();
                isCountdown.value = true;
                btnClickable.value = false;
                statusText.value = "🎉您已中签";
                if (!isResultShowed.value) {
                    Dialog.alert({
                        title: '恭喜🎉',
                        message: '您已中签！请关注发售时间，准时前来购买哦！'
                    })
                    isResultShowed.value = true
                }
            } else if (isLucky.value === 0) {
                btnClickable.value = false;
                statusText.value = "您未中签";
                if (!isResultShowed.value) {
                    Dialog.alert({
                        title: '很遗憾🥀',
                        message: '您未中签，本藏品您无购买资格！'
                    })
                    isResultShowed.value = true
                }
            } else if (isLucky.value === -1) {
                btnClickable.value = true;
                statusText.value = "查看抽签结果";
            } else if (isLucky.value === -2) {
                btnClickable.value = true;
                statusText.value = "加载出错, 点此刷新";
            }
        }
    } else {
        currentStage.value = 5;
        // if (user.isLogin && unpaid.value) {
        //     btnClickable.value = false;
        //     statusText.value = "已购买";
        //     return;
        // }
        if (unpaid.value!.code === 1) {
            btnClickable.value = true;
            statusText.value = "待支付";
        } else {
            if (stock_count.value === 0 || product.value.is_soldout) {
                btnClickable.value = false;
                statusText.value = "已售罄";
            } else {
                if (!user.isLogin) {
                    btnClickable.value = true;
                    statusText.value = "请先登录";
                } else {
                    if (!isLucky.value) {
                        btnClickable.value = false;
                        statusText.value = "您无购买资格";
                    } else {
                        // 检测是否有未支付订单
                        if (unpaid.value!.code === 1) {
                            btnClickable.value = true;
                            statusText.value = "待支付";
                        } else if (unpaid.value!.code === 0) {
                            if (bounght_count.value >= product.value.limit) {
                                btnClickable.value = false;
                                statusText.value = "已达限购上限";
                            } else {
                                btnClickable.value = true;
                                statusText.value = "购买";
                            }
                        } else {
                            // 2
                            btnClickable.value = true;
                            statusText.value = "加载出错, 点此刷新";
                        }
                    }
                }
            }
        }
    }
});

watch(isDrawn, (val) => {
    if (val && currentStage.value === 2) {
        btnClickable.value = false;
        statusText.value = "已抽签";
        if (product.value) {
            const now = dayjs().valueOf();
            const draw_end_timestamp = dayjs(
                product.value.draw_end_timestamp
            ).valueOf();
            countDown.reset(draw_end_timestamp - now);
            countDown.start();
            isCountdown.value = true;
        }
    }
});

const onBtnClick = async () => {
    if (statusText.value === "抽签") {
        const res = await participateDraw(id.value);
        if (!res) {
            // Toast({
            //     message: "抽签失败",
            //     duration: 1500,
            //     forbidClick: true,
            //     icon: "warning-o",
            //     iconSize: "1.6rem",
            // });
            Dialog.alert({
                title: "抽签失败",
                message: "请稍后重试",
            });
            return;
        }
        if (res.code === 0) {
            Dialog.alert({
                title: "成功",
                message: "抽签成功",
            });
            await fetchDraw();
        } else {
            Dialog.alert({
                title: "抽签出错",
                message: res.message,
            });
        }
    } else if (statusText.value === "购买") {
        if (!user.data.is_verified) {
            Dialog.confirm({
                title: '提示',
                message: '应监管要求，您在购买前需完成实名认证。',
                confirmButtonText: '进行实名认证',
                cancelButtonColor: '暂不购买'
            }).then(() => {
                router.push('/verification')
            }).catch(() => {
                Toast({
                    type: 'text',
                    message: '稍后可在个人中心页面完成实名认证'
                })
            })
            return;
        }
        if (!user.data.bsn_address) {
            Dialog.confirm({
                title: '提示',
                message: '您在购买前需申请区块链账户。',
                confirmButtonText: '获取区块链账户',
                cancelButtonColor: '暂不购买'
            }).then(() => {
                router.push('/user')
            }).catch(() => {
                Toast({
                    type: 'text',
                    message: '稍后可在个人页面申请区块链账户'
                })
            })
            return;
        }
        isLoading.value = true;
        const res = await seckill(id.value);
        if (res) {
            if (res.order_id) {
                Toast({
                    message: "下单成功!",
                    duration: 1500,
                    forbidClick: true,
                    icon: "passed",
                    iconSize: "1.6rem",
                });
                // 生成一个500 - 1500ms的随机数
                const random =
                    Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
                setTimeout(() => {
                    isLoading.value = false;
                    router.push({
                        path: "/cashier",
                        query: { product_id: id.value, order_id: res.order_id },
                    });
                }, random);
            } else {
                isLoading.value = false;
                if (res.code === 6) {
                    Dialog.confirm({
                        title: '提示',
                        message: '应监管要求，您在购买前需完成实名认证。',
                        confirmButtonText: '进行实名认证',
                        cancelButtonColor: '暂不够卖'
                    }).then(() => {
                        router.push('/verification')
                    }).catch(() => {
                        Toast({
                            type: 'text',
                            message: '稍后可在个人中心页面完成实名认证'
                        })
                    })
                } else {
                    Dialog.alert({
                        title: "购买失败",
                        message: res.message,
                    });
                }
            }
        } else {
            isLoading.value = false;
            return null;
        }
    } else if (statusText.value === "请先登录") {
        // console.log(route.path)
        router.push({ name: "login", params: { backTo: route.path } });
    } else if (statusText.value === "待支付") {
        if (unpaid.value.order_id) {
            router.push({
                path: "/cashier",
                query: {
                    product_id: id.value,
                    order_id: unpaid.value?.order_id,
                },
            });
        } else {
            Toast({
                type: "fail",
                message: "出错: 待支付的订单ID未获取！",
            });
        }
    } else if (statusText.value === "查看抽签结果") {
        isLoading.value = true;
        isLucky.value = await fetchIsLucky(user.data.id, id.value);
        isResultShowed.value = true
        if (isLucky.value === 1) {
            Dialog.alert({
                title: '查看抽签结果',
                message: '🎉恭喜，您已中签！'
            })
        } else if (isLucky.value === 0) {
            Dialog.alert({
                title: '查看抽签结果',
                message: '非常可惜，您未中签！'
            })
        } else {
            Dialog.alert({
                title: '查看抽签结果',
                message: '出了点问题，请稍后刷新'
            })
        }
        isLoading.value = false;
    } else if (statusText.value === "加载出错, 点此刷新") {
        location.reload();
    }
};

//
</script>
<style lang="scss" scoped>
.product-bg {
    width: 100%;
    max-width: 550px;
    left: 50%;
    // max-height: 900px;
    transform: translate(-50%);
    position: absolute;
    top: px2rem(-60);
    transition: opacity 0.3s ease-in-out;
    z-index: 0;
    // z-index: 
}

.product {
    width: 100%;
    position: relative;
    display: flex;
    flex-flow: nowrap column;
    align-items: center;
    justify-content: center;
    margin-bottom: px2rem(72);

    .box {
        padding: px2rem(12) px2rem(16);
        box-sizing: border-box;
        border-radius: px2rem(8);
        box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);
        background-color: $boxBgColor;
        width: 100%;
        margin-bottom: px2rem(10);
    }

    .product-price-limit {
        display: flex;
        flex-flow: nowrap row;
        justify-content: space-between;
        align-items: center;

        .limit {
            color: $greyTextColor;
            font-size: px2rem(16);
        }
    }

    .product-info {
        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-start;
        align-items: flex-start;

        .left {
            flex: 1;
            display: flex;
            flex-flow: wrap column;
            justify-content: flex-start;
            align-items: flex-start;
            overflow: hidden;
            margin-right: px2rem(4);

            .name {
                font-size: px2rem(24);
                font-weight: bold;
                margin-bottom: px2rem(8);
                background: linear-gradient(94.63deg,
                        #e8d9a6 14.59%,
                        #dbc782 92.35%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                text-fill-color: transparent;
            }

            .tags {
                display: flex;
                flex-flow: wrap row;
                justify-content: flex-start;
                align-items: center;
                font-size: px2rem(12);
            }
        }

        .right {
            // align-self: flex-end;
            display: flex;
            flex-flow: nowrap column;
            justify-content: space-between;
            align-items: flex-end;

            .type {
                font-size: px2rem(18);
                color: $greyTextColor;
                padding: px2rem(4);
                box-sizing: border-box;
                background-color: $backgroundColor;
                border-radius: px2rem(4);
                margin-bottom: px2rem(8);
                box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);
            }

            .limit {
                font-size: px2rem(12);
                color: $greyTextColor;
            }
        }
    }

    .creator {
        width: 100%;
        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-start;
        align-items: center;


        .avatar {
            width: px2rem(24);
            height: px2rem(24);
            overflow: hidden;
            margin-right: px2rem(10);
            border: 1px solid #ddd;
        }

        .creator-text {
            font-size: px2rem(18);
            margin-right: 1em;
            // color: $greyTextColor;
        }


        .name {
            font-size: px2rem(18);
            // color: $greyTextColor;
        }
    }

    .detail,
    .must-know {
        display: flex;
        flex-flow: nowrap column;
        justify-content: flex-start;
        align-items: center;

        // &.creator-box {
        //     display: flex;
        //     flex-flow: nowrap row;
        //     justify-content: space-between;
        //     align-items: center;

        //     .title {
        //         font-size: px2rem(24);
        //         margin-bottom: 0;
        //     }

        //     .content {
        //         padding-bottom: 0;
        //         flex: unset;
        //     }

        // }

        .title {
            margin-bottom: px2rem(20);
            color: $glodTextColor;
            position: relative;
            font-size: px2rem(24);
            z-index: 0;
            font-weight: bold;

            &::after {
                content: "";
                position: absolute;
                bottom: px2rem(-6);
                left: calc(-5%);
                right: calc(-5%);
                background-color: #353535;
                height: px2rem(12);
                z-index: -1;
                // width: 110%;
            }
        }
    }

    .detail {
        .content {
            // width: 100%;
            flex: 1;
            padding-bottom: px2rem(8);
            box-sizing: border-box;

            .img {
                margin-bottom: 0;
                min-height: 100px;
                display: block;
                overflow: hidden;

                &:first-child {
                    border-top-left-radius: px2rem(8);
                    border-top-right-radius: px2rem(8);
                }

                &:last-child {
                    border-bottom-left-radius: px2rem(8);
                    border-bottom-right-radius: px2rem(8);
                }
            }
        }
    }

    .must-know {
        .content {
            font-size: px2rem(14);
            color: $greyTextColor;
            line-height: px2rem(18);
            padding-bottom: px2rem(8);
            box-sizing: border-box;
        }
    }

    .bottom-bar {
        position: fixed;
        padding: px2rem(10) px2rem(17);
        box-sizing: border-box;
        bottom: 0;
        left: 0;
        width: 100%;
        height: px2rem(60);
        right: 0;
        background-color: black;
        box-shadow: 0 px2rem(-4) px2rem(4) rgba(0, 0, 0, 0.25);

        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-end;
        align-items: center;

        .counter {
            margin-right: px2rem(20);
            display: flex;
            flex-flow: nowrap row;
            justify-content: center;
            align-items: center;
            height: px2rem(40);

            .operation {
                background-color: #353535;
                font-size: px2rem(16);
                height: 100%;
                color: white;
                padding: px2rem(8) px2rem(12);
                font-weight: bold;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .jian {
                border-top-left-radius: px2rem(8);
                border-bottom-left-radius: px2rem(8);
            }

            .jia {
                border-top-right-radius: px2rem(8);
                border-bottom-right-radius: px2rem(8);
            }

            .num {
                height: 100%;
                padding: px2rem(6) px2rem(12);
                // padding: px2rem(16);
                background-color: #c4c4c4;
                color: black;
                font-size: px2rem(18);
                box-sizing: border-box;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                width: px2rem(42);
            }
        }

        .pay-btn {
            // font-weight: bold;
            font-size: px2rem(18);
            background-color: #d8e0a3;
            color: black;
            padding: 0 px2rem(8);
            box-sizing: border-box;
            text-align: center;
            min-width: px2rem(120);
            border-radius: px2rem(8);
            height: 100%;
            display: flex;
            flex-flow: nowrap column;
            align-items: center;
            justify-content: center;

            .main-text {
                font-weight: bold;
                font-size: px2rem(16);
                letter-spacing: px2rem(4);
                text-indent: px2rem(4);
                // flex: 1;

                &.noCountDown {
                    font-size: px2rem(18);
                }
            }

            .countdown {
                font-size: px2rem(12);
            }

            &.disabled {
                .main-text {
                    font-weight: bold;
                }

                background-color: #444;
                color: #c4c4c4;
            }
        }
    }
}
</style>
