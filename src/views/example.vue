<template>
  <a-layout>
    <!-- 案例内容 -->
    <a-layout-content
      :style="{
        background: 'rgb(245, 245, 245)',
        overflow: 'initial',
      }"
    >
      <div
        :style="{
          margin: '64px 72px',
          background: 'rgb(245, 245, 245)',
        }"
      >
        <a-typography>
          <a-typography-title
            >{{ example.name }}
            <div style="float: right">
              <!-- 下拉菜单 -->
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
                      @click="showEditExample"
                    >
                      <edit-outlined style="font-size: 16px" />
                      编辑案例
                    </a-menu-item>
                    <a-menu-item
                      key="2"
                      style="font-size: 16px"
                      @click="showMoveExample"
                    >
                      <export-outlined style="font-size: 16px" />
                      移动案例
                    </a-menu-item>
                    <a-menu-item
                      key="3"
                      style="font-size: 16px"
                      @click="deleteExampleConfirm"
                    >
                      <delete-outlined style="font-size: 16px" />
                      删除案例
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </a-typography-title>
          <a-divider />
          <template
            v-if="example.description !== null && example.description !== ''"
          >
            <a-typography-title name="caseTitle" :level="2">
              案例描述
            </a-typography-title>
            <a-typography-paragraph>
              {{ example.description }}
            </a-typography-paragraph>
          </template>

          <a-typography-title :level="2">
            资料
            <!-- 上传案例资料 -->
            <div style="float: right">
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
                  <a-button
                    key="submit"
                    type="primary"
                    :disabled="uploadFileList.length === 0"
                    :loading="uploading"
                    @click="handleUpload"
                    >{{ uploading ? "上传中" : "上传" }}</a-button
                  >
                </template>
                <a-upload
                  v-model:file-list="uploadFileList"
                  accept=".pdf, .doc, .docx"
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

          <a-menu
            mode="inline"
            style="font-size: 16px; overflow-x: hidden"
            :style="{
              background: 'rgb(245,245,245)',
            }"
          >
            <template v-for="document in example.documents">
              <a-menu-item
                style="width: 70%"
                v-if="document.id !== ''"
                :key="document.id"
                :style="{
                  background: '#fff',
                }"
              >
                <template #icon>
                  <template v-if="document.type === 1">
                    <file-word-outlined />
                  </template>
                  <template v-else>
                    <file-pdf-outlined />
                  </template>
                </template>
                <a-typography-text @click="toDocument(document.id)">{{
                  document.name
                }}</a-typography-text>

                <a-space size="middle" style="float: right">
                  <a-tooltip placement="bottom" title="下载">
                    <download-outlined @click="downloadDocument(document)" />
                  </a-tooltip>
                  <a-tooltip placement="bottom" title="删除">
                    <delete-outlined
                      @click="deleteDocumentConfirm(document.id)"
                    />
                  </a-tooltip>
                </a-space>
              </a-menu-item>
            </template>
          </a-menu>
        </a-typography>
      </div>
    </a-layout-content>
  </a-layout>
  <!-- 编辑案例 -->
  <a-modal
    v-model:visible="editExampleVisible"
    title="编辑案例"
    ok-text="编辑"
    cancel-text="取消"
    @ok="hideEditExample"
  >
    <a-form ref="exampleFormRef" :model="exampleForm" :rules="exampleRules">
      <a-form-item label="案例名称" name="name">
        <a-input
          v-model:value="exampleForm.name"
          placeholder="请输入案例名称"
        />
      </a-form-item>

      <a-form-item label="案例详情" name="description">
        <a-textarea
          v-model:value="exampleForm.description"
          :rows="4"
          placeholder="请输案例详情"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 移动案例 -->
  <a-modal
    v-model:visible="moveExampleVisible"
    title="移动案例"
    ok-text="移动"
    cancel-text="取消"
    @ok="moveExample"
  >
    <a-select
      ref="selectCategory"
      :options="categories"
      :field-names="{ label: 'name', value: 'id', options: 'children' }"
      v-model:value="selectCategoryValue"
      style="width: 120px"
    >
    </a-select>
  </a-modal>
</template>
<script scoped>
import router from "@/router";
import { useRoute } from "vue-router";
import { defineComponent, ref, watch, createVNode } from "vue";
import service from "@/api/request";
import {
  SearchOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  MoreOutlined,
  EditOutlined,
  UploadOutlined,
  ImportOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  ExportOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { useUserStore } from "@/store/user";
// 图标
import { Modal, message } from "ant-design-vue";
import { refreshProject } from "@/views/project.vue";

export default defineComponent({
  components: {
    SearchOutlined,
    PlusOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    MoreOutlined,
    EditOutlined,
    UploadOutlined,
    ImportOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    DownloadOutlined,
    ExportOutlined,
    ExclamationCircleOutlined,
  },
  setup() {
    //获取案例信息
    let exampleId = useRoute().params.exampleId;
    let projectId = useRoute().params.projectId;
    const example = ref({ name: "", description: "" });

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

    const beforeUpload = (file) => {
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
        getExample();
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

    const uploadFile = (file) => {
      var forms = new FormData();
      forms.append("file", file.originFileObj);
      return service
        .post("/documents/upload", forms, {
          params: {
            example_id: exampleId,
            user_id: example.value.userId,
          },
        })
        .then((resp) => {
          if (resp.data === undefined || resp.data.code !== 200)
            message.error(file.name + "上传失败！");
        });
    };

    //编辑案例
    const exampleFormRef = ref();
    const exampleRules = {
      name: [
        {
          required: true,
          message: "案例名称不能为空！",
        },
      ],
    };
    const exampleForm = ref({
      id: exampleId,
      name: "",
      description: "",
      categoryId: "",
      userId: useUserStore().user.id,
    });
    const updateExampleForm = () => {
      exampleForm.value.id = example.id;
      exampleForm.value.name = example.value.name;
      exampleForm.value.description = example.value.description;
      exampleForm.value.categoryId = example.value.categoryId;
      exampleForm.value.userId = example.value.userId;
    };
    const editExampleVisible = ref(false);
    const showEditExample = () => {
      updateExampleForm();
      editExampleVisible.value = true;
    };
    const hideEditExample = () => {
      exampleFormRef.value
        .validateFields()
        .then(async () => {
          exampleForm.value.id = exampleId;
          let resp = await service.put("/examples", exampleForm.value);
          if (resp === null || resp.data.code != 200) {
            message.error("编辑案例失败！");
          } else {
            refreshProject();

            example.value.name = exampleForm.value.name;
            example.value.description = exampleForm.value.description;
            editExampleVisible.value = false;
            exampleFormRef.value.resetFields();
          }
        })
        .catch(() => {
          console.log("表单提交出错");
        });
    };

    //删除案例
    const deleteExample = async () => {
      let resp = await service.delete("/examples/" + exampleId);
      if (resp !== null && resp.data.code === 200) {
        refreshProject();
        router.back();
      }
    };
    //删除案例确认
    const deleteExampleConfirm = () => {
      Modal.confirm({
        title: "删除本案例?",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          deleteExample();
        },
        onCancel() {},
        class: "test",
      });
    };

    //移动案例
    const categories = ref([]);
    const getAllCategories = async () => {
      var resp = await service.get("/categories/" + projectId);
      console.log(resp);
      if (resp === null) {
        categories.value = [];
      } else {
        categories.value = resp.data.data;
        selectCategoryValue.value = example.value.categoryId;
      }
    };
    const moveExampleVisible = ref(false);
    const selectCategoryValue = ref(null);
    const showMoveExample = () => {
      getAllCategories();
      moveExampleVisible.value = true;
    };
    const moveExample = () => {
      let oldCID = example.value.categoryId;
      example.value.categoryId = selectCategoryValue.value;
      if (selectCategoryValue.value === null) {
        moveExampleVisible.value = false;
        return;
      }

      service.put("/examples", example.value).then((resp) => {
        if (resp === null) {
          example.value.categoryId = oldCID;
          messgage.error("移动案例失败！");
        } else {
          refreshProject();
          moveExampleVisible.value = false;
        }
      });
    };

    //下载文件
    const downloadDocument = (doc) => {
      service
        .get("/documents/download/" + doc.id, { responseType: "blob" })
        .then((resp) => {
          const url = window.URL.createObjectURL(new Blob([resp.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", doc.name);
          document.body.appendChild(link);
          link.click();
        });
    };

    //删除文件
    const deleteDocument = async (did) => {
      let resp = await service.delete("/documents/" + did);
      if (resp !== null && resp.data.code === 200) {
        getExample();
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

    const getExample = async () => {
      service.get("/examples/" + exampleId);
      let resp = await service.get("/examples/" + exampleId);
      if (resp !== null) {
        example.value = resp.data.data;
        exampleId = example.value.id;
      }
    };
    if (exampleId !== "" && exampleId !== null) getExample();

    const toDocument = (id) => {
      router.push({
        name: "document",
        params: { documentId: id },
      });
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

    return {
      //基本数据
      example,

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

      //新建案例
      editExampleVisible,
      showEditExample,
      hideEditExample,
      exampleForm,
      exampleFormRef,
      exampleRules,

      //移动案例
      showMoveExample,
      moveExample,
      moveExampleVisible,
      categories,
      selectCategoryValue,

      //删除案例
      deleteExampleConfirm,

      //删除文件
      deleteDocumentConfirm,
      //下载文件
      downloadDocument,

      getExample,
      toDocument,
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
