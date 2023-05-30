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
        <a-typography>
          <div style="display: flex; position: relative; height: 48px">
            <a-input
              v-if="nameInputVisible"
              ref="nameInputRef"
              v-model:value="nameInputValue"
              style="font-size: 32px; width: 80%"
              @blur="handleNameInputConfirm"
            >
            </a-input>
            <div v-else @click="showNameInput">
              <a-typography-title>{{ subprojectForm.name }}</a-typography-title>
            </div>
            <div
              style="font-size: 24px; position: absolute; bottom: 0px; right: 0"
            >
              <a-tooltip title="删除子项目">
                <delete-outlined
                  placement="bottom"
                  @click="deleteSubprojectConfirm"
                  style="font-size: 20px"
                />
              </a-tooltip>
            </div>
          </div>
          <a-divider style="margin-top: 24px" />
          <a-typography-title name="subporjectTitle" :level="2"
            >关键词
          </a-typography-title>
          <a-typography-paragraph>
            <div style="display: flex; align-items: center">
              <a-row :gutter="[16, 16]" justify="start">
                <a-col v-for="keyword in subprojectForm.keywords">
                  <div style="font-size: 16px; margin-right: 24px">
                    <tag-outlined style="font-size: 20px" />
                    {{ keyword.name }}
                    <close-outlined
                      style="font-size: 16px; color: #999"
                      @click="handleKeywordClose(keyword.name)"
                    />
                  </div>
                </a-col>
              </a-row>
            </div>
            <br />
            <a-input
              v-if="keywordInputVisible"
              ref="KeywordInputRef"
              v-model:value="keywordInputValue.name"
              type="text"
              :style="{ width: '84px' }"
              @blur="handleKeywordInputConfirm"
            />
            <a-button
              v-else
              style="background: #fff; border-style: dashed; font-size: 16px"
              @click="showKeywordInput"
            >
              <plus-outlined />
              添加关键词
            </a-button>
          </a-typography-paragraph>
          <a-typography-title :level="2">简介</a-typography-title>
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
                subprojectForm.description === null ||
                subprojectForm.description === undefined ||
                subprojectForm.description === ''
              "
            >
              <a-typography-paragraph style="font-size: 16px">
                子项目没有描述</a-typography-paragraph
              ></template
            >
            <template v-else>
              <a-typography-paragraph
                style="font-size: 16px; white-space: pre-wrap"
              >
                {{ subprojectForm.description }}</a-typography-paragraph
              >
            </template>
          </div>
          <a-typography-title :level="2">
            资料
            <!-- 上传案例资料 -->
            <div style="float: right">
              <a-tooltip placement="bottom" title="上传">
                <import-outlined
                  @click="showUpLoadModal"
                  style="font-size: 20px"
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
                  <a-button
                    key="submit"
                    type="primary"
                    :disabled="uploadFileList.length === 0"
                    :loading="uploading"
                    @click="handleUpload"
                    >{{ uploading ? "上传中" : "上传" }}</a-button
                  >
                </template>
                <!-- 上传样式：图片 -->
                <a-upload
                  v-model:file-list="uploadFileList"
                  list-type="picture"
                  accept=".txt, .doc, .docx,.pdf"
                  @remove="handleRemove"
                  :beforeUpload="beforeUpload"
                >
                  <a-button>
                    <upload-outlined></upload-outlined>
                    选择文件
                  </a-button>
                </a-upload>
              </a-modal>
            </div>
          </a-typography-title>

          <!-- 文件预览列表 -->
          <a-menu mode="inline" style="font-size: 18px; overflow-x: hidden">
            <template v-for="document in subprojectForm.documents">
              <a-menu-item
                style="width: 70%"
                v-if="document.id !== ''"
                :key="document.id"
                @click="toDocument(document.id)"
              >
                <template #icon>
                  <template v-if="document.type === 1 || document.type === 2">
                    <file-word-outlined style="font-size: 20px" />
                  </template>
                  <template v-if="document.type === 3">
                    <file-pdf-outlined style="font-size: 20px" />
                  </template>
                  <template v-else>
                    <file-text-outlined style="font-size: 20px" />
                  </template>
                </template>
                {{ document.name }}

                <div style="float: right">
                  <a-dropdown :overlayStyle="{ minWidth: 900 }">
                    <more-outlined style="font-size: 20px" />
                    <template #overlay>
                      <a-menu
                        :style="{
                          width: '140px',
                        }"
                      >
                        <a-menu-item
                          key="1"
                          style="font-size: 16px"
                          @click="downloadDocument(document)"
                        >
                          <download-outlined />
                          下载文件
                        </a-menu-item>
                        <a-menu-item
                          key="2"
                          style="font-size: 16px"
                          @click="deleteDocumentConfirm(document.id)"
                        >
                          <delete-outlined />
                          删除文件
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </a-menu-item>
            </template>
          </a-menu>
        </a-typography>
        <!-- 生成方案按钮 -->
        <template v-if="subprojectForm.plan === null">
          <div style="float: right">
            <a-button type="primary" size="large" @click="createPlanModal"
              >生成方案</a-button
            >
            <a-modal
              v-model:visible="createPlanModalVisible"
              title="方案选型"
              style="width: 760px"
              @ok="handleCreatePlanOk"
              cancel-text="取消"
            >
              <template #footer>
                <a-button key="cancel" @click="createPlanModalVisible = false"
                  >取消</a-button
                >
                <a-button
                  key="submit"
                  type="primary"
                  :loading="createPlanLoading"
                  @click="handleCreatePlanOk"
                  >生成</a-button
                >
              </template>
              <p>根据相似度计算，为您推荐以下相似方案：</p>

              <a-row :gutter="[16, 16]">
                <a-col :span="8" v-for="plan in similarPlanList">
                  <a-card @click="selectPlan(plan)" hoverable>
                    <template #extra
                      ><a-checkbox
                        :checked="
                          selectedPlanList.find(
                            (value) => value.id === plan.id
                          ) !== undefined
                        "
                    /></template>
                    <template #title>
                      {{ plan.name }}
                    </template>
                    <a-typography-paragraph>
                      {{ plan.description }}
                    </a-typography-paragraph>
                  </a-card>
                </a-col>
              </a-row>
            </a-modal>
          </div>
        </template>
      </div>
    </a-layout-content>
  </a-layout>
</template>
<script scoped>
import router from "@/router";
import { useRoute } from "vue-router";
import { defineComponent, ref, watch, nextTick, createVNode } from "vue";
import service from "@/api/request";
import { useUserStore } from "@/store/user";
// 图标
import {
  TagOutlined,
  EditOutlined,
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
  FileWordOutlined,
  FilePdfOutlined,
  UploadOutlined,
  ImportOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { Modal, TypographyText, message, Upload } from "ant-design-vue";
import { refreshProject } from "./project.vue";
export default defineComponent({
  components: {
    TagOutlined,
    EditOutlined,
    PlusOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
    MoreOutlined,
    FileWordOutlined,
    UploadOutlined,
    ImportOutlined,
    FilePdfOutlined,
    FileTextOutlined,
    ExclamationCircleOutlined,
  },
  setup() {
    let pid = useRoute().params.projectId;
    let subprojectId = useRoute().params.subprojectId;
    // 标题、描述参数,点击可修改
    const nameInputRef = ref();
    const desInputRef = ref();
    const nameInputVisible = ref(false);
    const nameInputValue = ref("");
    const desInputVisible = ref(false);
    const desInputValue = ref("");
    const subprojectForm = ref({
      name: "",
      description: "",
      projectId: pid,
      userId: useUserStore().user.id,
      keywords: [],
      documents: [],
    });

    const getSubproject = async () => {
      let resp = await service.get("/subprojects/" + subprojectId);
      if (resp !== null && resp != undefined) {
        if (resp.data.data === null) {
          message.error("子项目不存在！");
          router.back();
        } else {
          subprojectForm.value = resp.data.data;
          subprojectId = subprojectForm.value.id;
        }
      }
    };

    getSubproject();

    const updateSubproject = async () => {
      let resp = await service.put("/subprojects", subprojectForm.value);
      if (resp !== null && resp !== undefined) {
        return true;
      } else {
        message.error("更改子项目失败！");
        return false;
      }
    };

    const KeywordInputRef = ref();
    const keywordInputValue = ref({ name: "" });
    const keywordInputVisible = ref(false);
    const handleKeywordClose = async (name) => {
      let pre = subprojectForm.value.keywords;
      subprojectForm.value.keywords = subprojectForm.value.keywords.filter(
        (keyword) => keyword.name !== name
      );

      let ret = await updateSubproject();

      if (!ret) {
        subprojectForm.value.keywords = pre;
      }
    };
    const handleKeywordInputConfirm = async () => {
      const inputValue = keywordInputValue.value.name;
      if (inputValue && inputValue.replace(/^\s*/, "") !== "") {
        let keywords = subprojectForm.value.keywords;

        if (keywords === undefined) {
          subprojectForm.value.keywords = [{ name: inputValue }];
        } else if (
          keywords.find((keyword) => keyword.name === inputValue) === undefined
        ) {
          subprojectForm.value.keywords = [...keywords, { name: inputValue }];
        }

        let ret = await updateSubproject();

        if (!ret) {
          subprojectForm.value.keywords = keywords;
        }
      }

      keywordInputVisible.value = false;
      keywordInputValue.value.name = "";
    };
    const showKeywordInput = () => {
      keywordInputVisible.value = true;
      nextTick(() => {
        KeywordInputRef.value.focus();
      });
    };
    const showNameInput = () => {
      nameInputVisible.value = true;
      nameInputValue.value = subprojectForm.value.name;
      nextTick(() => {
        nameInputRef.value.focus();
      });
    };

    const showDescriptionInput = () => {
      desInputVisible.value = true;
      desInputValue.value = subprojectForm.value.description;
      nextTick(() => {
        desInputRef.value.focus();
      });
    };
    const handleNameInputConfirm = async () => {
      let value = nameInputValue.value;
      let pre = subprojectForm.value.name;
      if (value && value.replace(/^\s*/, "") !== "") {
        subprojectForm.value.name = value;
      }

      let ret = await updateSubproject();
      if (!ret) {
        subprojectForm.value.name = pre;
      } else {
        refreshProject();
      }

      nameInputValue.value = "";
      nameInputVisible.value = false;
    };

    const handleDsConfirm = async () => {
      let value = desInputValue.value;
      let pre = subprojectForm.value.description;
      if (value && value.replace(/^\s*/, "") !== "") {
        subprojectForm.value.description = value;
      }

      let ret = await updateSubproject();

      if (!ret) {
        subprojectForm.value.description = pre;
      }

      desInputVisible.value = false;
      desInputValue.value = "";
    };

    const deletesubproject = async (id) => {
      await service.delete("/subprojects/" + id);
      router.back();
      refreshProject();
    };
    const deleteSubprojectConfirm = () => {
      Modal.confirm({
        title: "删除该子项目?",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          deletesubproject(subprojectId);
        },
        onCancel() {},
        class: "test",
      });
    };
    //下载文件
    const downloadDocument = async (doc) => {
      let resp = await service.get("/documents/download/" + doc.id, {
        responseType: "blob",
      });
      if (resp != null) {
        const url = window.URL.createObjectURL(new Blob([resp.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", doc.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    };

    // 根据相似度生成方案
    const createPlanModalVisible = ref(false);
    const createPlanModal = async () => {
      let resp = await service.get("/plans/similar/" + subprojectId);
      if (resp) {
        selectedPlanList.value = [];
        similarPlanList.value = resp.data.data;
        createPlanModalVisible.value = true;
      }
    };
    const createPlanLoading = ref(false);
    const handleCreatePlanOk = async () => {
      createPlanLoading.value = true;
      let resp = await service.post(
        `/plans/create/${subprojectId}&${subprojectForm.value.userId}`,
        selectedPlanList.value
      );
      if (!resp) {
        message.error("创建方案失败！");
      } else {
        refreshProject();
        subprojectForm.value.plan = { name: " " };
      }
      selectedPlanList.value = [];
      createPlanModalVisible.value = false;
      createPlanLoading.value = false;
    };
    const selectPlan = (plan) => {
      if (
        selectedPlanList.value.find((value) => value.id === plan.id) ===
        undefined
      ) {
        selectedPlanList.value = [...selectedPlanList.value, plan];
      } else {
        selectedPlanList.value = selectedPlanList.value.filter(
          (value) => value.id !== plan.id
        );
      }
    };
    const similarPlanList = ref([]);
    const selectedPlanList = ref([]);

    const uploadFileList = ref([]);
    // 上传文件框
    const upLoadModalVisible = ref(false);
    const uploading = ref(false);
    const showUpLoadModal = () => {
      upLoadModalVisible.value = true;
    };
    // 上传文件确认
    const handleOk = () => {
      upLoadModalVisible.value = false;
    };

    const handleRemove = (file) => {
      const index = uploadFileList.value.indexOf(file);
      const newFileList = uploadFileList.value.slice();
      newFileList.splice(index, 1);
      uploadFileList.value = newFileList;
    };
    const whiteList = ["txt", "doc", "docx", "pdf"];
    const beforeUpload = (file) => {
      var index = file.name.lastIndexOf(".");
      var ext = file.name.substr(index + 1);
      if (whiteList.indexOf(ext) == -1) {
        message.error("文件类型错误！");
        return Upload.LIST_IGNORE;
      }
      if (file.size / 1024 / 1024 > 20) {
        message.error("文件大于20M！");
        return Upload.LIST_IGNORE;
      }
      uploadFileList.value = [...uploadFileList.value, file];
      return false;
    };
    const handleUpload = () => {
      uploading.value = true;
      let resps = [];
      uploadFileList.value.forEach((file) => {
        resps.push(uploadFile(file));
      });

      Promise.all(resps).then((values) => {
        getSubproject();
        uploadFileList.value = [];
        uploading.value = false;
        upLoadModalVisible.value = false;
      });
    };
    // 取消上传确认
    const upLoadCancelConfirm = () => {
      Modal.confirm({
        title: "取消上传文件?",
        icon: createVNode(ExclamationCircleOutlined),
        content: "未上传至案例库的文件将不保存",
        okText: "确认",
        okType: "danger",
        cancelText: "继续上传",
        onOk() {
          uploadFileList.value = [];
          upLoadModalVisible.value = false;
        },
        onCancel() {},
        class: "test",
      });
    };

    //删除文件
    const deleteDocument = async (did) => {
      let resp = await service.delete("/documents/" + did);
      if (resp !== null && resp != undefined) {
        getSubproject();
      }
    };
    //删除文件确认
    const deleteDocumentConfirm = (did) => {
      Modal.confirm({
        title: "删除该文件?",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          deleteDocument(did);
        },
        onCancel() {},
        class: "test",
      });
    };

    const uploadFile = (file) => {
      var forms = new FormData();
      forms.append("file", file.originFileObj);
      return service
        .post("/documents/upload", forms, {
          params: {
            subproject_id: subprojectId,
            user_id: subprojectForm.value.userId,
          },
        })
        .then((resp) => {
          if (resp.data === undefined || resp.data.code !== 200)
            message.error(file.name + "上传失败！");
        });
    };
    const toDocument = (id) => {
      router.push({
        name: "document",
        params: { documentId: id },
      });
    };

    watch(
      () => router.currentRoute.value,
      (newValue, oldValue) => {
        if (newValue.name === "subproject") {
          subprojectId = newValue.params.subprojectId;
          getSubproject();
        }
      }
    );

    return {
      nameInputRef,
      showNameInput,
      handleNameInputConfirm,
      nameInputVisible,
      nameInputValue,
      desInputVisible,
      desInputValue,

      subprojectForm,

      handleKeywordInputConfirm,
      handleKeywordClose,
      keywordInputVisible,
      keywordInputValue,
      showKeywordInput,
      KeywordInputRef,

      desInputRef,
      showDescriptionInput,
      handleDsConfirm,

      deleteSubprojectConfirm,

      // 上传框的处理
      upLoadModalVisible,
      uploading,
      showUpLoadModal,
      handleOk,
      handleRemove,
      handleUpload,
      beforeUpload,
      // 已经上传的文件
      uploadFileList,
      upLoadCancelConfirm,
      //删除文件
      deleteDocumentConfirm,
      //下载文件
      downloadDocument,
      toDocument,

      selectPlan,
      createPlanModalVisible,
      createPlanModal,
      createPlanLoading,
      handleCreatePlanOk,
      similarPlanList,
      selectedPlanList,
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
