<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      name="file"
      :multiple="true"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      :headers="headers"
      @change="handleFileChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        点击上传文件
      </a-button>
    </a-upload>

    <a-modal
      title="文件预览"
      v-model:visible="previewVisible"
      @cancel="handleFileCancel"
    >
      <a-document
        :src="previewUrl"
        v-if="previewType === 'doc' || previewType === 'docx'"
      />
      <a-pdf :src="previewUrl" v-else-if="previewType === 'pdf'" />
    </a-modal>
  </div>
</template>
<script>
import { message, Upload, Button, Document, PDF } from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
export default defineComponent({
  components: {
    UploadOutlined,
    Document,
    PDF,
  },
  setup() {
    const handleFileChange = (info) => {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} 文件上传成功`);
        // 预览上传的文件
        const type = info.file.type;
        if (
          type === "application/msword" ||
          type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          previewDoc(info.file);
        } else if (type === "application/pdf") {
          previewPDF(info.file);
        } else {
          message.warning("该文件格式暂不支持预览");
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 文件上传失败.`);
      }
    };
    const fileList = ref([]);
    const headers = {
      authorization: "authorization-text",
    };
    const previewVisible = ref(false);
    const previewUrl = ref("");
    const previewType = ref("");
    const handleFileCancel = () => {
      previewVisible.value = false;
    };
    const previewDoc = (file) => {
      previewType.value = file.type === "application/msword" ? "doc" : "docx";
      previewUrl.value = URL.createObjectURL(file);
      previewVisible.value = true;
    };
    const previewPDF = (file) => {
      previewType.value = "pdf";
      previewUrl.value = URL.createObjectURL(file);
      previewVisible.value = true;
    };
    return {
      fileList,
      headers,
      previewVisible,
      previewUrl,
      previewType,
      handleFileChange,
      handleFileCancel,
      previewDoc,
      previewPDF,
    };
  },
});
</script>
