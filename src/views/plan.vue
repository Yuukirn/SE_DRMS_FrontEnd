<template>
  <a-layout style="min-height: 100vh">
    <!-- 案例内容 -->
    <a-layout-content
      :style="{
        background: '#fff',
        overflow: 'initial',
      }"
    >
      <div
        :style="{
          margin: '64px 72px',
          background: '#fff',
        }"
      >
        <!-- 这里方案即plan -->
        <a-typography>
          <a-typography-title>
            <a-input
              v-if="nameInputVisible"
              ref="nameInputRef"
              v-model:value="nameInputValue"
              style="font-size: 32px; width: 80%"
              @blur="handleNameInputConfirm"
            >
            </a-input>
            <a-typography-text v-else @click="showNameInput">
              {{ plan.name }}
            </a-typography-text>

            <div style="float: right; font-size: 25px">
              <a-dropdown>
                <more-outlined />
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      style="font-size: 18px"
                      @click="exportPlan"
                      key="0"
                    >
                      <export-outlined />
                      导出方案
                    </a-menu-item>
                    <a-menu-item
                      style="font-size: 18px"
                      @click="deletePlanConfirm"
                      key="1"
                    >
                      <delete-outlined />
                      删除方案
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </a-typography-title>

          <a-divider />
          <a-typography-title :level="2">方案描述</a-typography-title>
          <a-textarea
            v-if="desInputVisible"
            ref="desInputRef"
            v-model:value="desInputValue"
            :rows="15"
            style="font-size: 16px; width: 80%; margin-bottom: 36px"
            @blur="handleDsConfirm"
          />
          <div v-else @click="showDescriptionInput">
            <template
              v-if="
                plan.description === null ||
                plan.description === undefined ||
                plan.description === ''
              "
            >
              <a-typography-paragraph style="font-size: 16px">
                方案没有描述</a-typography-paragraph
              ></template
            >
            <template v-else>
              <a-typography-paragraph
                style="font-s ize: 16px; white-space: pre-wrap"
              >
                {{ plan.description }}
              </a-typography-paragraph>
            </template>
          </div>
        </a-typography>
      </div>
    </a-layout-content>
  </a-layout>
</template>
<script scoped>
import router from "@/router";
import { useRoute } from "vue-router";
import { defineComponent, ref, watch, nextTick } from "vue";
import service from "@/api/request";
// 图标
import {
  DeleteOutlined,
  ExportOutlined,
  MoreOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";
import { refreshProject } from "./project.vue";

export default defineComponent({
  components: {
    DeleteOutlined,
    ExportOutlined,
    MoreOutlined,
    EditOutlined,
  },
  setup() {
    let planId = useRoute().params.planId;

    const plan = ref({
      name: "",
      description: "",
    });

    const getPlan = async () => {
      let resp = await service.get("/plans/" + planId);
      if (resp !== null && resp != undefined) {
        if (resp.data.data === null) {
          message.error("方案不存在！");
          router.back();
        } else {
          plan.value = resp.data.data;
          planId = plan.value.id;
        }
      }
    };

    getPlan();

    //删除案例
    const deletePlan = async () => {
      let resp = await service.delete("/plans/" + planId);
      if (resp !== null && resp !== undefined) {
        refreshProject();
        router.back();
      } else {
        message.error("删除方案失败！");
      }
    };

    const exportPlan = async () => {
      let resp = await service.get("/plans/export/" + planId, {
        responseType: "blob",
      });
      if (resp != null) {
        const url = window.URL.createObjectURL(new Blob([resp.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", plan.value.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    };

    const deletePlanConfirm = () => {
      Modal.confirm({
        title: "删除该方案?",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          deletePlan();
        },
        onCancel() {},
        class: "test",
      });
    };

    const updatePlan = async () => {
      let resp = await service.put("/plans", plan.value);
      if (resp !== null && resp !== undefined) {
        return true;
      } else {
        message.error("更改子项目失败！");
        return false;
      }
    };

    const nameInputRef = ref();
    const desInputRef = ref();
    const nameInputVisible = ref(false);
    const nameInputValue = ref("");
    const desInputVisible = ref(false);
    const desInputValue = ref("");

    const showNameInput = () => {
      nameInputVisible.value = true;
      nameInputValue.value = plan.value.name;
      nextTick(() => {
        nameInputRef.value.focus();
      });
    };

    const showDescriptionInput = () => {
      desInputVisible.value = true;
      desInputValue.value = plan.value.description;
      nextTick(() => {
        desInputRef.value.focus();
      });
    };
    const handleNameInputConfirm = async () => {
      let value = nameInputValue.value;
      let pre = plan.value.name;
      if (value && value.replace(/^\s*/, "") !== "") {
        plan.value.name = value;
      }

      let ret = await updatePlan();
      if (!ret) {
        plan.value.name = pre;
      } else {
        refreshProject();
      }

      nameInputValue.value = "";
      nameInputVisible.value = false;
    };

    const handleDsConfirm = async () => {
      let value = desInputValue.value;
      let pre = plan.value.description;
      if (value && value.replace(/^\s*/, "") !== "") {
        plan.value.description = value;
      }

      let ret = await updatePlan();

      if (!ret) {
        plan.value.description = pre;
      }

      desInputVisible.value = false;
      desInputValue.value = "";
    };

    watch(
      () => router.currentRoute.value,
      (newValue, oldValue) => {
        if (newValue.name === "plan") {
          planId = newValue.params.planId;
          getPlan();
        }
      }
    );

    return {
      plan,
      deletePlanConfirm,
      exportPlan,

      nameInputRef,
      showNameInput,
      handleNameInputConfirm,
      nameInputVisible,
      nameInputValue,
      desInputVisible,
      desInputValue,

      desInputRef,
      showDescriptionInput,
      handleDsConfirm,
    };
  },
});
</script>
<style scoped>
.edit_tooltip .ant-tooltip-inner {
  color: #333;
  background-color: #fff !important;
}
.edit_tooltip .ant-tooltip-arrow::before {
  background-color: #fff !important;
}

/* 更多选择框 */
.demo-dropdown-wrap :deep(.ant-dropdown-button) {
  margin-right: 16px;
  margin-bottom: 16px;
}
/* 右侧顶部图标与按钮 */
.right_header .box {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  float: right;
  /* height: 100px; */
  background-color: rgb(255, 255, 255);
}
/* 分割线 */
.ant-divider {
  background-color: rgb(207, 207, 207);
}

.ant-layout-sider {
  background-color: rgb(255, 255, 255);
  border-right: solid 1px rgb(245, 245, 245);
}

.ant-layout-content {
  /* background-color: rgb(241, 241, 241); */
  background-color: rgb(255, 255, 255);
  text-align: left;
}

.content_header {
  background-color: rgb(255, 255, 255);
  /* background-color: rgb(241, 241, 241); */
  text-align: left;
  font-size: 36px;
  font-weight: bold;
}

/* 左侧目录滚动条 */
.ant-layout-sider ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.ant-layout-sider ::-webkit-scrollbar-thumb {
  background-color: rgb(207, 207, 207);
  border-radius: 24px;
}

.ant-layout-sider ::-webkit-scrollbar-track {
  background-color: #fff;
  border-radius: 24px;
}
</style>
