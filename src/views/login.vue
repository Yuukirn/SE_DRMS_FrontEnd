<template>
  <a-form
    :model="formState"
    name="normal_login"
    class="login-form"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="邮箱"
      name="email"
      :rules="[{ required: true, message: '请输入您的邮箱!' }]"
    >
      <a-input v-model:value="formState.email">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      label="密码"
      name="password"
      :rules="[{ required: true, message: '请输入您的密码!' }]"
    >
      <a-input-password v-model:value="formState.password">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item>
      <a-button
        :disabled="disabled"
        type="primary"
        html-type="submit"
        class="login-form-button"
      >
        登录
      </a-button>
      如果没有账户，
      <router-link to="/register">注册</router-link>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, reactive, computed } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import router from "@/router";
import service from "@/api/request";
import { useJWT } from "@/store/JWT";
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    router,
  },
  setup() {
    const formState = reactive({
      email: "",
      password: "",
    });
    const onFinish = async (values) => {
      const resp = await service.post("/login", {
        id: 0,
        name: "",
        email: values.email,
        password: values.password,
      });
      if (resp.data.msg !== "ok") message.error(resp.data.msg);
      else {
        var token = resp.data.data;
        if (token !== null) {
          useJWT().token = token;
        }
        message.success("登陆成功！");
      }
    };
    const onFinishFailed = (errorInfo) => {
      message.error("Failed:", errorInfo);
    };
    const disabled = computed(() => {
      return !(formState.email && formState.password);
    });
    return {
      formState,
      onFinish,
      onFinishFailed,
      disabled,
    };
  },
});
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
