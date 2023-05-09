<template>
  <a-layout has-sider style="min-height: 100vh">
    <!-- 左侧部分 -->
    <a-layout-sider
      width="432px"
      :style="{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }"
    >
      <a-layout style="background-color: white; min-height: 90vh; margin: 32px">
        <!-- 头部 -->
        <a-page-header :title="projectName" @back="() => router.push('/home')">
        </a-page-header>

        <a-layout-content
          :style="{
            background: 'rgb(255,255,255)',
          }"
        >
          <!-- 分割线 -->
          <a-divider style="margin-top: 24px; border-radius: 10px" />

          <a-space :size="12">
            <!-- 查询框-->
            <div style="width: 332px">
              <a-input
                v-model:value="searchValue"
                placeholder="查找方案/案例"
                size="large"
                @pressEnter="searchCategories"
              >
                <template #prefix>
                  <search-outlined
                    style="font-size: 18px; color: rgb(207, 207, 207)"
                    @click="searchCategories"
                  />
                </template>
              </a-input>
            </div>
            <!-- 编辑类别按钮 -->
            <div>
              <!-- 编辑类别弹窗 -->
              <a-dropdown :overlayStyle="{ minWidth: 900 }">
                <plus-circle-outlined style="font-size: 20px" />
                <template #overlay>
                  <a-menu
                    :style="{
                      width: '140px',
                    }"
                  >
                    <a-menu-item
                      key="1"
                      style="font-size: 16px"
                      @click="showCreateCategory"
                    >
                      <plus-outlined style="font-size: 16px" />
                      新建类别
                    </a-menu-item>
                    <a-menu-item
                      key="2"
                      style="font-size: 16px"
                      @click="showDeleteCategory"
                    >
                      <delete-outlined style="font-size: 16px" />
                      删除类别
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <!-- 删除类别 -->
              <a-modal
                v-model:visible="deleteCategoryVisible"
                title="选择删除类别"
                ok-text="删除"
                cancel-text="取消"
                @ok="deleteCategoryOk"
              >
                <a-select
                  v-model:value="deleteCategoryValue"
                  mode="multiple"
                  style="width: 80%"
                  placeholder="选择要删除的类别"
                  :options="
                    categories.map((category) => ({
                      value: category.name,
                    }))
                  "
                ></a-select>
              </a-modal>
              <!-- 新建类别 -->
              <a-modal
                v-model:visible="createCategoryVisible"
                title="新建类别"
                ok-text="创建"
                cancel-text="取消"
                @ok="hideCreateCategory"
              >
                <a-form
                  ref="categoryFormRef"
                  :model="categoryForm"
                  :rules="categoryRules"
                >
                  <a-form-item label="项目名称" name="name">
                    <a-input
                      v-model:value="categoryForm.name"
                      placeholder="请输入名称"
                    />
                  </a-form-item>
                </a-form>
              </a-modal>
            </div>
          </a-space>
          <!-- 目录 -->
          <div style="overflow: hidden; margin-top: 16px; height: 496px">
            <a-menu
              mode="inline"
              style="
                height: 100%;
                font-size: 16px;
                overflow-x: hidden;
                overflow-y: scroll;
              "
            >
              <template v-for="category in categories">
                <a-menu-item
                  v-if="category.examples.length == 0"
                  :key="category.name"
                >
                  {{ category.name }}
                </a-menu-item>
                <a-sub-menu v-else :key="category.name">
                  <template #title
                    ><span>{{ category.name }}</span></template
                  >
                  <a-menu-item
                    v-for="example in category.examples"
                    :key="example.id"
                    @click="toExample(example)"
                  >
                    {{ example.name }}
                  </a-menu-item>
                </a-sub-menu>
              </template>
            </a-menu>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout-sider>
    <a-layout-content :style="{ marginLeft: '432px' }">
      <router-view> </router-view>
    </a-layout-content>
  </a-layout>
</template>
<script scoped>
import router from "@/router";
import { defineComponent, ref, reactive } from "vue";
import service from "@/api/request";
import { useProjectStore } from "@/store/project";
import { useUserStore } from "@/store/user";
// 图标
import {
  SearchOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";

export default defineComponent({
  components: {
    SearchOutlined,
    PlusOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
  },
  setup() {
    //所有类别数组
    const categories = ref(null);
    const pid = useProjectStore().project.id;
    const projectName = useProjectStore().project.name;

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
    // 删除类别确认框
    const deleteCategoryValue = ref([]);
    const deleteCategoryVisible = ref(false);
    const showDeleteCategory = () => {
      deleteCategoryVisible.value = true;
    };
    const deleteCategoryOk = async () => {
      let nameArr = deleteCategoryValue.value;
      let arr = categories.value.filter((category) => {
        return nameArr.includes(category.name);
      });

      await service.post("/categories/delete", arr);
      getAllCategories();

      deleteCategoryValue.value = [];
      deleteCategoryVisible.value = false;
    };

    //新建类别
    const createCategoryVisible = ref(false);
    const showCreateCategory = () => {
      createCategoryVisible.value = true;
    };
    const hideCreateCategory = () => {
      categoryFormRef.value
        .validateFields()
        .then(async () => {
          createCategoryVisible.value = false;

          await service.post("/categories/create", categoryForm);
          message.success("类别创建成功！");
          getAllCategories();

          categoryFormRef.value.resetFields();
        })
        .catch(() => {
          console.log("表单提交出错");
        });
    };
    const categoryFormRef = ref();
    const categoryForm = reactive({
      name: "",
      projectId: useProjectStore().project.id,
      userId: useUserStore().user.id,
    });
    const categoryRules = {
      name: [
        {
          required: true,
          message: "项目名称不能为空！",
        },
      ],
    };

    //获取类别
    const getAllCategories = async () => {
      var resp = await service.get("/categories/" + pid);
      if (resp === null) {
        categories.value = [];
      } else {
        categories.value = resp.data.data;
      }
    };

    //搜索类别和案例
    const searchValue = ref("");
    const searchCategories = async () => {
      let name = searchValue.value;
      if (name === null || name === "") return;
      var resp = await service.get("/search/" + pid + "&" + name);
      if (resp === null) {
        categories.value = [];
      } else {
        categories.value = resp.data.data;
      }
    };

    //转到案例页面
    const toExample = (example) => {
      router.push({
        name: "example",
        params: { exampleId: example.id },
      });
    };

    if (useProjectStore().project.id === "") {
      router.push("/home");
    } else {
      getAllCategories();
    }

    return {
      showConfirm,
      categories,
      projectName,
      // 删除类别确认
      deleteCategoryVisible,
      showDeleteCategory,
      deleteCategoryOk,
      deleteCategoryValue,

      //新建类别
      createCategoryVisible,
      showCreateCategory,
      hideCreateCategory,
      categoryForm,
      categoryFormRef,
      categoryRules,

      //搜索
      searchValue,
      searchCategories,

      toExample,

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
/* 左侧头部 */
.sider_header {
  height: 42px;
  font-size: 18px;
  text-align: left;
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
