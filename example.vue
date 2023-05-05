<template>
  <a-layout has-sider style="min-height: 100vh">
    <!-- 左侧部分 -->
    <a-layout-sider width="432px" :style="{
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
    }">
      <a-layout style="background-color: white; min-height: 90vh; margin: 32px">
        <!-- 头部 -->
        <a-page-header title="我的项目" @back="() => null" />

        <a-layout-content :style="{
            background: 'rgb(255,255,255)',
            marginTop: '-20px'
            // overflow: 'hidden'
          }">
          <!-- 分割线 -->
          <a-divider style="margin-top: 24px;border-radius: 10px;" />
          
          <a-space :size="12">
          <!-- 查询框-->
          <div style="width: 332px">
          <a-input
            v-model:value="value" 
            placeholder="查找方案/案例" 
            size="large" 
            @search="onSearch">
            <template #prefix>
              <search-outlined style="font-size: 18px;color: rgb(207,207,207);" />
            </template>
          </a-input>
          </div>
          <!-- 编辑类别按钮 -->
          <div>
            <a-dropdown :placement="bottom" :overlayStyle="{minWidth:900}">
              <plus-circle-outlined style="font-size: 20px"/>
              <template #overlay>
                <a-menu :style="{
                    width: '140px'
                  }">
                  <a-menu-item key="1" style="font-size: 16px;" >
                    <plus-outlined style="font-size: 16px;" />
                    新建类别
                  </a-menu-item>
                  <a-menu-item key="2" style="font-size: 16px;" @click="showClassConfirm">
                    <delete-outlined style="font-size: 16px;" />
                    删除类别
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-modal
              v-model:visible="classConfirmVisible"
              title="选择删除类别"
              ok-text="删除"
              cancel-text="取消"
              @ok="hideClassConfirm"
            >
              <p>Bla bla ...</p>
              <p>Bla bla ...</p>
              <p>Bla bla ...</p>
            </a-modal>
          </div>
          </a-space>
          <!-- 目录 -->
          <div style="
              overflow: hidden;
              margin-top: 16px;
              height: 496px;">
            <a-menu 
            v-model:selectedKeys="selectedKeys" 
            v-model:openKeys="openKeys" 
            mode="inline" 
            style="
                height: 100% ;
                font-size: 16px;
                overflow-x: hidden;
                overflow-y: scroll;
              ">
              <a-sub-menu key="sub1">
                <template #title>
                  <span>
                    类别1
                  </span>
                </template>
                <a-menu-item key="1">方案</a-menu-item>
                <a-menu-item @click="showCase" key="2">案例</a-menu-item>
                <a-menu-item key="3">option3</a-menu-item>
                <a-menu-item key="4">option2</a-menu-item>
                <a-menu-item key="5">option3</a-menu-item>
              </a-sub-menu>
              <a-sub-menu key="sub2">
                <template #title>
                  <span>
                    <laptop-outlined />
                    类别2
                  </span>
                </template>
                <a-menu-item key="5">option5</a-menu-item>
                <a-menu-item key="6">option6</a-menu-item>
                <a-menu-item key="7">option7</a-menu-item>
                <a-menu-item key="8">option8</a-menu-item>
              </a-sub-menu>
            </a-menu>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout-sider>

    <!-- 右侧内容 -->
    <a-layout :style="{ marginLeft: '432px' }">
      <!-- 头部 -->
      <a-layout-header class="right_header" :style="{background: '#fff'}">
        <!-- 顶部图标与按钮 -->
        <div class="box">
          <a-space :size="22">
            <div>
              <a-space :size="12">
            <a-button border-radius="100px">
              相似度比较
            </a-button>
            <a-button type="primary">
              <template #icon><edit-outlined /></template>编辑
            </a-button>
          </a-space>
            </div>
            <!-- 更多选项框 -->
            <a-dropdown :placement="bottom" :overlayStyle="{minWidth:900}">
              <ellipsis-outlined style="font-size: 18px;" />
              <template #overlay>
                <a-menu :style="{
                    width: '140px'
                  }">
                  <a-menu-item key="1" style="font-size: 16px;">
                    <download-outlined style="font-size: 16px;" />
                    下载到本地
                  </a-menu-item>
                  <a-menu-item key="2" style="font-size: 16px;">
                    <logout-outlined style="font-size: 16px;" />
                    移动
                  </a-menu-item>
                  <a-menu-item key="3" style="font-size: 16px;" @click="showConfirm">
                    <delete-outlined style="font-size: 16px;" />
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-divider type="vertical" style="height: 24px;"/>
            <!-- 搜索图标 -->
            <a-tooltip placement="bottom" title="搜索" overlayClassName="edit_tooltip">
              <search-outlined style="font-size: 18px" />
            </a-tooltip>
            <!-- 新建图标 -->
            <div>
            <a-tooltip placement="bottom" title="新建">
              <plus-outlined @click="showAddModal" style="font-size: 18px;" />
            </a-tooltip>
            <a-modal 
              v-model:visible="addModalVisible" 
              title="新建案例" 
              :width="760"
              :footer="null">
              <a-form 
                :model="projectForm" 
                :rules="rules" v-bind="layout" 
                @finish="createProject">
                
                <div :style="{ marginBottom: '24px' }">
                <a-radio-group v-model:value="chooseValue" size="large">
                  <a-radio-button value="new">新案例</a-radio-button>
                  <a-radio-button value="old">已有案例</a-radio-button>
                </a-radio-group>
                </div>
                
                <a-form-item label="案例id" name="id">
                  <a-input-number v-model:value="projectForm.id" :min="1" />
                </a-form-item>

                <a-form-item label="案例名称" name="name">
                  <a-input v-model:value="projectForm.name" placeholder="请输入项目名称" />
                </a-form-item>

                <a-form-item label="案例描述" name="description">
                  <a-textarea v-model:value="projectForm.description" :rows="4" placeholder="请输入项目详情" />
                </a-form-item>
                <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 11 }">
                  <a-button type="primary" html-type="submit">创建</a-button>
                </a-form-item>
              </a-form>
            </a-modal>
            </div>
            <!-- 上传文件框 -->
            <div>
              <a-tooltip placement="bottom" title="上传">
                <import-outlined @click="showUpLoadModal" style="font-size: 18px;" />
              </a-tooltip>
              <a-modal v-model:visible="upLoadModalVisible" title="上传案例资料" @ok="handleOk">
                <template #footer>
                  <a-button key="back" @click="upLoadCancelConfirm">取消</a-button>
                  <a-button key="submit" type="primary" @click="handleOk">完成</a-button>
                </template>
                <a-upload v-model:file-list="uploadFileList" list-type="picture"
                  action="//jsonplaceholder.typicode.com/posts/" :preview-file="previewFile">
                  <a-button>
                    <upload-outlined></upload-outlined>
                    点此上传文件
                  </a-button>
                </a-upload>
              </a-modal>
            </div>
            <!-- 用户头像 -->
            <a-divider type="vertical" style="height: 24px;"/>
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
          :visible="caseVisible"
          :style="{
          margin: '24px 16px 0',
          background: '#fff',
          overflow: 'initial'
        }">

        <div 
            :style="{
            margin: '64px 72px',
            background: '#fff'
          }">
          <a-typography>
            <a-typography-title>案例名称</a-typography-title>

            <!-- <a-typography-paragraph>
              <a-descriptions size="middle" bordered layout="vertical" :style="{ width: '45%' }">

                <a-descriptions-item label="作者">
                  Aris Cain
                </a-descriptions-item>
                <a-descriptions-item label="时间">
                  2023-5-2
                </a-descriptions-item>
              </a-descriptions>
            </a-typography-paragraph> -->

            <a-typography-title name="caseTitle" :level="2">案例描述</a-typography-title>
            <a-typography-paragraph>
              用户打开一个案例时，当前界面有“相似度计算”按钮，
              单击后弹出对话框，对话框中可以选择需要比较的两个案例。
            </a-typography-paragraph>
            <a-typography-paragraph>
              另一个为空，需要通过“浏览”按钮或者直接输入的方式来填入案例信息。
              然后单击“开始计算”按钮。
              <a-typography-text strong>
                比较成功则弹出“比较成功！”字样，并且显示相似度。
                在首页也可以设置批量比较模块，批量导入案例，并比较每一对
              </a-typography-text>
              <a-typography-text mark>相似度</a-typography-text>
            </a-typography-paragraph>
            <a-typography-title :level="2">Guidelines and Resources</a-typography-title>
            <a-typography-paragraph>
              We supply a series of design principles, practical patterns and high quality design resources
              (
              <a-typography-text code>Sketch</a-typography-text>
              and
              <a-typography-text code>Axure</a-typography-text>
              ), to help people create their product prototypes beautifully and efficiently.
            </a-typography-paragraph>

            <a-divider />

            <a-typography-title :level="2">设计资源</a-typography-title>

            <a-typography-paragraph>
              我们提供完善的设计原则、最佳实践和设计资源文件（
              <a-typography-text code>Sketch</a-typography-text>
              和
              <a-typography-text code>Axure</a-typography-text>
              ），来帮助业务快速设计出高质量的产品原型。
            </a-typography-paragraph>

            <a-typography-paragraph>
              <ul>
                <li>
                  <a-typography-link href="/docs/resources-cn">设计资源</a-typography-link>
                </li>
              </ul>
            </a-typography-paragraph>

            <a-typography-paragraph>
              <blockquote>{{ blockContent }}</blockquote>
              <pre>{{ blockContent }}</pre>
            </a-typography-paragraph>

            <a-typography-paragraph>
              按
              <a-typography-text keyboard>Esc</a-typography-text>
              键退出阅读……
            </a-typography-paragraph>
          </a-typography>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
  
</template>
<script scoped>
import router from "@/router";
import { defineComponent, ref, reactive, createVNode, onMounted } from "vue";
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
  PlusCircleOutlined,
} from '@ant-design/icons-vue';
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
    PlusCircleOutlined,
  },
  setup() {
    const chooseValue = ref('new');

    // 删除案例文件确认框
    const showConfirm = () => {
      Modal.confirm({
        title: '删除此案例文件?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后无法恢复',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('确认');
        },
        onCancel() {
          console.log('取消');
        },
        class: 'test',
      });
    };

    const classConfirmVisible = ref(false);
    const showClassConfirm = () => {
      classConfirmVisible.value = true;
    };
    const hideClassConfirm = () => {
      classConfirmVisible.value = false;
    };

    const caseVisible = ref(false);//???
    // const upLoadCancelConfirm = ref(false);
    const showCase = () => {
      caseVisible.value = true;
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
        title: '取消上传文件?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '未上传至案例库的文件将不保存',
        okText: '确认',
        okType: 'danger',
        cancelText: '继续上传',
        onOk() {
          upLoadModalVisible.value = false;
          console.log('确认');
        },
        onCancel() {
          console.log('继续');
        },
        class: 'test',
      });
    };
    // 上传文件预览，其中对文件类型的判定尚未修改，仅能上传word
    const previewFile = async file => {
      console.log('Your upload file:', file);
      // Your process logic. Here we just mock to the same file
      const res = await fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
        method: 'POST',
        body: file,
      });
      const {
        thumbnail,
      } = await res.json();
      return thumbnail;
    };
    // const fileList = ref<UploadProps['fileList']>([
    // {
    //   uid: '1',
    //   name: 'xxx.png',
    //   status: 'done',
    //   response: 'Server Error 500', // custom error message to show
    //   url: 'http://www.baidu.com/xxx.png',
    // },
    // ]);

    // const handleChange = ({ file, fileList }: UploadChangeParam) => {
    // if (file.status !== 'uploading') {
    //   console.log(file, fileList);
    //   }
    // };

    const projectForm = reactive({
      id: "",
      name: "",
      type: "",
      description: "",
      userId: useUserStore().user.id,
    });

    const rules = {
      id: [
        {
          required: true,
          message: "项目id不能为空！",
        },
      ],
      name: [
        {
          required: true,
          message: "项目名称不能为空！",
        },
      ],
      type: [
        {
          required: true,
          message: "项目类型不能为空！",
        },
      ],
      description: [
        {
          required: true,
          message: "项目描述不能为空！",
        },
      ],
    };

    // 新建案例框
    const addModalVisible = ref(false);
    const showAddModal = () => {
      addModalVisible.value = true;
    };
    const onCloseAddModal = () => {
      addModalVisible.value = false;
    };
    
    let projects = ref(null);
    useProjectStore().setProject(null);
    let show = ref(false);
    let project = ref(null);

    const getProjects = async (id) => {
      show.value = false;
      projects.value = [];
      if (id === null || id === "") {
        var resp = await service.get("/projects");
        var arr = resp.data.data;
        if (arr !== null) {
          for (var i = 0; i < arr.length; i++) {
            projects.value[i] = {
              key: i + 1,
              id: arr[i].id,
              name: arr[i].name,
              description: arr[i].description,
            };
          }
          show.value = true;
        }
      } else {
        var resp = await service.get("/projects/" + id);
        var data = resp.data.data;
        if (data !== null) {
          projects.value[0] = {
            key: 1,
            id: data.id,
            name: data.name,
            description: data.description,
          };
          show.value = true;
        }
      }
    };
    getProjects(null);

    const createProject = async () => {
      const resp = await service.post("/projects/create", projectForm);
      message.success("项目创建成功！");
      getProjects(null);
      addModalVisible.value = false;
    };

    const viewProject = (key) => {
      project.value = projects.value[key - 1];
      useProjectStore().setProject({
        id: project.id,
        name: project.name,
        description: project.description,
      });
    };
    //搜索
    const value = ref("");
    const onSearch = (searchValue) => {
      getProjects(searchValue);
    };
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 30,
      },
    };

    return {
      // 内容
      blockContent: `AntV 是蚂蚁金服全新一代数据可视化解决方案，不限可能的数据可视化最佳实践。
      得益于丰富的业务场景和用户需求挑战，AntV 经历多年积累与不断打磨，已支撑整个。`,

      chooseValue,

      // 查看某个案例
      caseVisible,
      showCase,

      showConfirm,
      // 删除类别确认
      classConfirmVisible,
      showClassConfirm,
      hideClassConfirm,

      // 上传框的处理
      upLoadModalVisible,
      showUpLoadModal,
      handleOk,
      handleCancel,
      previewFile,
      uploadFileList: ref([]),
      upLoadCancelConfirm,

      selectedKeys: ref(["4"]),
      projects,
      project,
      getProjects,
      viewProject,
      createProject,
      show,
      value,
      onSearch,
      projectForm,
      rules,
      addModalVisible,
      showAddModal,
      onCloseAddModal,
      layout,
    };
  },
});
</script>
<style scoped>
.edit_tooltip .ant-tooltip-inner
{
      color: #333;
      background-color: #fff!important;
}
.edit_tooltip .ant-tooltip-arrow::before {
      background-color: #fff!important;
}

/* 更多选择框 */
.demo-dropdown-wrap :deep(.ant-dropdown-button) {
  margin-right: 16px;
  margin-bottom: 16px;
}
/* 左侧头部 */
.sider_header {
  height: 42px;
  font-size: 18px;
  text-align: left;
  background-color: rgb(255, 255, 255);
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
  