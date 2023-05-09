<template>
  <!-- 右侧内容 -->
  <a-layout style="min-height: 100vh">
    <!-- 头部 -->
    <a-layout-header class="right_header" :style="{ background: '#fff' }">
      <!-- 顶部图标与按钮 -->
      <div class="box">
        <a-space :size="22">
          <div>
            <a-space :size="12">
              <a-button border-radius="100px"> 相似度比较 </a-button>
              <a-button type="primary">
                <template #icon><edit-outlined /></template>编辑
              </a-button>
            </a-space>
          </div>
          <!-- 更多选项框 -->
          <a-dropdown :overlayStyle="{ minWidth: 900 }">
            <ellipsis-outlined style="font-size: 18px" />
            <template #overlay>
              <a-menu
                :style="{
                  width: '140px',
                }"
              >
                <a-menu-item key="1" style="font-size: 16px">
                  <download-outlined style="font-size: 16px" />
                  下载到本地
                </a-menu-item>
                <a-menu-item key="2" style="font-size: 16px">
                  <logout-outlined style="font-size: 16px" />
                  移动
                </a-menu-item>
                <a-menu-item
                  key="3"
                  style="font-size: 16px"
                  @click="getExample"
                >
                  <delete-outlined style="font-size: 16px" />
                  删除
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-divider type="vertical" style="height: 24px" />
          <!-- 搜索图标 -->
          <a-tooltip
            placement="bottom"
            title="搜索"
            overlayClassName="edit_tooltip"
          >
            <search-outlined style="font-size: 18px" />
          </a-tooltip>
          <!-- 新建图标 -->
          <div>
            <a-tooltip placement="bottom" title="新建">
              <plus-outlined @click="showAddModal" style="font-size: 18px" />
            </a-tooltip>
            <a-modal
              v-model:visible="addModalVisible"
              :width="960"
              :footer="null"
            >
              <a-tabs v-model:activeKey="activeKey" :size="large" centered>
                <a-tab-pane key="active1" tab="新案例">
                  <a-form
                    :model="projectForm"
                    :rules="rules"
                    v-bind="layout"
                    :style="{ marginLeft: '48px', marginRight: '48px' }"
                    @finish="createProject"
                  >
                    <a-form-item label="案例名称" name="name">
                      <a-input
                        v-model:value="projectForm.name"
                        placeholder="软院装修计划"
                      />
                    </a-form-item>

                    <a-form-item label="案例描述" name="description">
                      <a-textarea
                        v-model:value="projectForm.description"
                        auto-size
                        placeholder="详细介绍软院的装修计划，包括外形建造、软装等"
                      />
                    </a-form-item>

                    <a-form-item label="案例成员/分工" name="member">
                      <a-textarea
                        v-model:value="projectForm.member"
                        auto-size
                        placeholder="张小唐：总体运营"
                      />
                    </a-form-item>

                    <a-form-item label="案例目标" name="target">
                      <a-textarea
                        v-model:value="projectForm.target"
                        auto-size
                        placeholder="- 日活达到 1,000 人以上..."
                      />
                    </a-form-item>

                    <a-form-item label="案例详情" name="detail">
                      <a-textarea
                        v-model:value="projectForm.detail"
                        auto-size
                        placeholder="1、项目启动... 2、项目开始..."
                      />
                    </a-form-item>

                    <a-form-item
                      :wrapper-col="{ ...layout.wrapperCol, offset: 11 }"
                    >
                      <a-button type="primary" html-type="submit"
                        >创建</a-button
                      >
                    </a-form-item>
                  </a-form>
                </a-tab-pane>
                <a-tab-pane key="active2" tab="已有案例" force-render>
                  <a-form
                    :model="projectForm"
                    :rules="rules"
                    v-bind="layout"
                    :style="{ marginLeft: '48px', marginRight: '48px' }"
                    @finish="createProject"
                  >
                    <a-form-item label="案例名称" name="name">
                      <a-select
                        v-model:value="searchCaseValue"
                        show-search
                        placeholder="软院装修计划"
                        :options="caseOptions"
                        :filter-option="filterOption"
                        @focus="handleCaseFocus"
                        @blur="handleCaseBlur"
                        @change="handleCaseChange"
                      ></a-select>
                    </a-form-item>

                    <a-form-item label="案例描述" name="description">
                      <a-textarea
                        v-model:value="projectForm.description"
                        auto-size
                        placeholder="详细介绍软院的装修计划，包括外形建造、软装等"
                      />
                    </a-form-item>

                    <a-form-item
                      :wrapper-col="{ ...layout.wrapperCol, offset: 11 }"
                    >
                      <a-button type="primary" html-type="submit"
                        >创建</a-button
                      >
                    </a-form-item>
                  </a-form>
                </a-tab-pane>
              </a-tabs>
            </a-modal>
          </div>
          <!-- 上传文件框 -->
          <div>
            <a-tooltip placement="bottom" title="上传">
              <import-outlined
                @click="showUpLoadModal"
                style="font-size: 18px"
              />
            </a-tooltip>
            <a-modal
              v-model:visible="upLoadModalVisible"
              title="上传案例资料"
              @ok="handleOk"
            >
              <template #footer>
                <a-button key="back" @click="upLoadCancelConfirm"
                  >取消</a-button
                >
                <a-button key="submit" type="primary" @click="handleOk"
                  >完成</a-button
                >
              </template>
              <a-upload
                v-model:file-list="uploadFileList"
                list-type="picture"
                accept=".pdf, .doc, .docx"
                action="//jsonplaceholder.typicode.com/posts/"
                :preview-file="previewFile"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  点此上传文件
                </a-button>
              </a-upload>
            </a-modal>
          </div>
          <!-- 用户头像 -->
          <a-divider type="vertical" style="height: 24px" />
          <a-avatar :size="32">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </a-space>
      </div>
    </a-layout-header>

    <!-- 案例内容 -->
    <a-layout-content
      :style="{
        margin: '24px 16px 0',
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
        <a-typography>
          <a-typography-title>{{ example.name }}</a-typography-title>

          <a-typography-title name="caseTitle" :level="2"
            >案例描述</a-typography-title
          >
          <a-typography-paragraph>
            {{ example.description }}
          </a-typography-paragraph>
          <a-divider />

          <a-typography-title :level="2">资料</a-typography-title>
        </a-typography>
      </div>
    </a-layout-content>
  </a-layout>
</template>
<script scoped>
import router from "@/router";
import { useRoute } from "vue-router";
import { defineComponent, ref, watch } from "vue";
import service from "@/api/request";
import { useProjectStore } from "@/store/project";
import { useUserStore } from "@/store/user";
// 图标
import {
  UserOutlined,
  EllipsisOutlined,
  SearchOutlined,
  PlusOutlined,
  ToTopOutlined,
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
  DeleteOutlined,
  ImportOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";

export default defineComponent({
  components: {
    UserOutlined,
    EllipsisOutlined,
    SearchOutlined,
    PlusOutlined,
    ToTopOutlined,
    UploadOutlined,
    DownloadOutlined,
    DownOutlined,
    DeleteOutlined,
    ImportOutlined,
    LogoutOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
  },
  setup() {
    //获取案例信息
    let exampleId = useRoute().params.exampleId;
    const example = ref({ name: "", description: "" });

    const getExample = async () => {
      let resp = await service.get("/examples/" + exampleId);
      if (resp !== null) {
        example.value = resp.data.data;
      }
    };

    const handleCaseChange = (searchCaseValue) => {
      console.log(`selected ${searchCaseValue}`);
    };
    const handleCaseBlur = () => {
      console.log("blur");
    };
    const handleCaseFocus = () => {
      console.log("focus");
    };
    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const chooseValue = ref("new");

    // 删除案例文件确认框
    const showConfirm = () => {
      Modal.confirm({
        title: "删除此案例文件?",
        icon: createVNode(ExclamationCircleOutlined),
        content: "删除后无法恢复",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          console.log("确认");
        },
        onCancel() {
          console.log("取消");
        },
        class: "test",
      });
    };

    // 上传文件框
    const upLoadModalVisible = ref(false);
    const showUpLoadModal = () => {
      upLoadModalVisible.value = true;
    };
    // 上传文件确认
    const handleOk = () => {
      upLoadModalVisible.value = false;
    };
    // 取消上传
    const handleCancel = () => {
      // upLoadModalVisible.value = false;
      upLoadCancelConfirm.value = true;
    };
    // 取消上传确认
    const upLoadCancelConfirm = () => {
      // upLoadModalVisible.value = false;
      Modal.confirm({
        title: "取消上传文件?",
        icon: createVNode(ExclamationCircleOutlined),
        content: "未上传至案例库的文件将不保存",
        okText: "确认",
        okType: "danger",
        cancelText: "继续上传",
        onOk() {
          upLoadModalVisible.value = false;
          console.log("确认");
        },
        onCancel() {
          console.log("继续");
        },
        class: "test",
      });
    };
    // 上传文件预览
    const previewFile = async (file) => {
      console.log("Your upload file:", file);
      // Your process logic. Here we just mock to the same file
      const res = await fetch(
        "https://next.json-generator.com/api/json/get/4ytyBoLK8",
        {
          method: "POST",
          body: file,
        }
      );
      const { thumbnail } = await res.json();
      return thumbnail;
    };

    // 新建案例框
    const addModalVisible = ref(false);
    const showAddModal = () => {
      addModalVisible.value = true;
    };
    const onCloseAddModal = () => {
      addModalVisible.value = false;
    };

    useProjectStore().setProject(null);

    //搜索
    const value = ref("");
    const onSearch = (searchValue) => {
      getProjects(searchValue);
    };

    //监听router参数变化
    watch(
      () => router.currentRoute.value,
      (newValue, oldValue) => {
        if (newValue.name === "example") {
          exampleId = newValue.params.exampleId;
          getExample();
        }
      }
    );
    if (exampleId !== "") {
      getExample();
    }

    return {
      //基本数据
      example,

      searchCaseValue: ref(undefined),
      filterOption,
      handleCaseBlur,
      handleCaseFocus,
      handleCaseChange,

      chooseValue,

      activeKey: ref("active1"),

      // 上传框的处理
      upLoadModalVisible,
      showUpLoadModal,
      handleOk,
      handleCancel,
      previewFile,
      // 已经上传的文件
      uploadFileList: ref([]),
      upLoadCancelConfirm,

      addModalVisible,
      showAddModal,
      onCloseAddModal,

      getExample,
      router,
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
