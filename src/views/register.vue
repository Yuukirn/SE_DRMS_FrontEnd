<template>
  <a-form
    ref="formRef"
    :model="formState"
    v-bind="layout"
    name="loginForm"
    :validate-messages="validateMessages"
    @finish="onFinish"
  >
    <a-form-item name="name" label="用户名" :rules="[{ required: true }]">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item name="password" label="密码" :rules="[{ required: true }]">
      <a-input v-model:value="formState.password" />
    </a-form-item>
    <a-form-item
      name="email"
      label="邮箱"
      :rules="[
        {
          required: true,
          type: 'email',
        },
      ]"
    >
      <a-input v-model:value="formState.email" />
    </a-form-item>
    <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
      <a-button type="primary" @click="sendcode">发送验证码</a-button>
    </a-form-item>
    <a-form-item
      name="code"
      label="验证码"
      :rules="[
        {
          required: true,
          len: 6,
        },
      ]"
    >
      <a-input v-model:value="formState.code" />
    </a-form-item>
    <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
      <a-button type="primary" html-type="submit">注册</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, reactive, ref } from "vue";
import { message } from "ant-design-vue";
import service from "@/api/request";
export default defineComponent({
  setup() {
    const formRef = ref();
    const sendcode = async () => {
      formRef.value.validateFields("email").then(
        async () => {
          const resp = await service.post("/register-code", {
            id: 0,
            name: "",
            email: formState.email,
            password: "",
          });
          console.log(resp.data.msg);
          if (resp.data.data === "registered") {
            message.warning("该邮箱已被注册！");
          } else {
            message.success("验证码发送成功！");
          }
        },
        () => {
          message.warning("验证码发送失败！");
        }
      );
    };
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const validateMessages = {
      required: "请您输入${label}!",
      types: {
        email: "${label}格式错误!",
      },
      string: {
        len: "${label}必须为6位数字",
      },
    };
    const formState = reactive({
      name: "",
      code: undefined,
      email: "",
      password: "",
    });
    const onFinish = async (values) => {
      const resp = await service.post("/register", {
        code: values.code,
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (resp.data.msg === "ok") {
        message.success("注册成功！");
      } else {
        message.error("验证码错误！");
      }
    };
    return {
      formState,
      onFinish,
      layout,
      validateMessages,
      sendcode,
      formRef,
    };
  },
});
</script>
