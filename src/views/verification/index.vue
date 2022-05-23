<template>
    <Subpage title="实名认证">
        <div class="verification">
            <div class="tips">
                您的信息仅用作实名认证，我们承诺保护您的隐私安全。
            </div>
            <div class="input-wrapper">
                <div class="label">真实姓名</div>
                <div class="input">
                    <input class="realinput" type="text" v-model="realname" />
                </div>
            </div>
            <div class="input-wrapper">
                <div class="label">身份证号</div>
                <div class="input">
                    <input class="realinput" type="text" v-model="realid" />
                </div>
            </div>
            <DangerBtn icon="lock" text="验证身份" @click="verify"></DangerBtn>
        </div>
    </Subpage>
</template>
<script lang="ts">
export default {
    name: "verification",
};
</script>
<script setup lang="ts">
import { ref } from "vue";
import { realnameTest, realidTest } from "../../utils";
import Subpage from "../../components/Subpage.vue";
import DangerBtn from "../../components/DangerBtn.vue";
import { Notify } from "vant";
import { idCheck } from "../../api/index";
import { useUserStore } from "../../stores/user";
import router from "../../routers";
const realname = ref("");
const realid = ref("");
const user = useUserStore();

const verify = async () => {
    // 正则检查realname和realid
    if (!realnameTest(realname.value)) {
        Notify({
            type: "danger",
            message: "请输入正确的姓名",
        });
        return;
    }
    if (!realidTest(realid.value)) {
        Notify({
            type: "danger",
            message: "请输入正确的身份证号",
        });
        return;
    }
    // 验证：
    // 如果通过验证，自动返回，没通过的话就警告用户
    const res = await idCheck(
        user.data.id as number,
        realname.value,
        realid.value
    );
    if (res) {
        Notify({
            type: "success",
            message: "验证成功",
        });
        user.data.real_name = realname.value;
        user.data.real_id = realid.value;
        router.replace('/user');
    } else {
        // 已处理
    }
};
</script>
<style lang="scss" scoped>
.verification {
    width: 100%;
    position: relative;

    .tips {
        border-radius: px2rem(8);
        padding: px2rem(16) px2rem(20);
        word-break: break-all;
        background-color: $lightRedColor;
        font-size: px2rem(16);
        line-height: px2rem(20);
        margin: px2rem(12) 0;
    }

    .input-wrapper {
        margin-top: px2rem(40);
        .label {
            font-size: px2rem(20);
            margin-bottom: px2rem(12);
        }

        .input {
            width: 100%;
            border-radius: px2rem(8);
            overflow: hidden;
            padding: px2rem(16) px2rem(20);
            box-sizing: border-box;
            background-color: $boxBgColor;
            box-shadow: inset 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);

            .realinput {
                width: 100%;
                display: block;
                // padding-right: 0;
                background-color: $boxBgColor;
                min-width: 50px;
                outline: none;
                border: 0px;
                margin: 0;
                box-sizing: border-box;
                font-size: px2rem(24);
            }
        }
    }
}
</style>
