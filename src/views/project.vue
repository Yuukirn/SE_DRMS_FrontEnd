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
              <plus-circle-outlined
                style="font-size: 20px"
                @click="showCreateCategory"
              />
              <!-- 新建/编辑类别 -->
              <a-modal
                v-model:visible="createCategoryVisible"
                :title="isEditCategory ? '编辑类别' : '创建类别'"
                :ok-text="isEditCategory ? '编辑' : '创建'"
                cancel-text="取消"
                @ok="isEditCategory ? hideEditCategory() : hideCreateCategory()"
              >
                <a-form
                  ref="categoryFormRef"
                  :model="categoryForm"
                  :rules="categoryRules"
                >
                  <a-form-item label="案例名称" name="name">
                    <a-input
                      v-model:value="categoryForm.name"
                      placeholder="请输入名称"
                    />
                  </a-form-item>
                </a-form>
              </a-modal>
            </div>
            <!-- 新建案例 -->
            <a-modal
              v-model:visible="createExampleVisible"
              title="创建案例"
              ok-text="创建"
              cancel-text="取消"
              @ok="hideCreateExample"
            >
              <a-form
                ref="exampleFormRef"
                :model="exampleForm"
                :rules="exampleRules"
              >
                <a-form-item label="案例名称" name="name">
                  <a-input
                    v-model:value="exampleForm.name"
                    placeholder="请输入名称"
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
                            @click="showCreateExample(category.id)"
                          >
                            <plus-outlined style="font-size: 16px" />
                            新建案例
                          </a-menu-item>
                          <a-menu-item
                            key="2"
                            style="font-size: 16px"
                            @click="showEditCategory(category)"
                          >
                            <edit-outlined style="font-size: 16px" />
                            编辑类别
                          </a-menu-item>
                          <a-menu-item
                            key="3"
                            style="font-size: 16px"
                            @click="deleteCategory(category.id)"
                          >
                            <delete-outlined style="font-size: 16px" />
                            删除类别
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </div>
                </a-menu-item>
                <a-sub-menu v-else :key="category.name">
                  <template #title>
                    <span>{{ category.name }}</span>
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
                              @click="showCreateExample(category.id)"
                            >
                              <plus-outlined style="font-size: 16px" />
                              新建案例
                            </a-menu-item>
                            <a-menu-item
                              key="2"
                              style="font-size: 16px"
                              @click="showEditCategory(category)"
                            >
                              <edit-outlined style="font-size: 16px" />
                              编辑类别
                            </a-menu-item>
                            <a-menu-item
                              key="3"
                              style="font-size: 16px"
                              @click="deleteCategory(category.id)"
                            >
                              <delete-outlined style="font-size: 16px" />
                              删除类别
                            </a-menu-item>
                          </a-menu>
                        </template>
                      </a-dropdown>
                    </div>
                  </template>
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
import { useRoute } from "vue-router";
import { defineComponent, ref, reactive, watch } from "vue";
import service from "@/api/request";
import { useUserStore } from "@/store/user";
// 图标
import {
  SearchOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  MoreOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
export let refreshProject;

export default defineComponent({
  components: {
    SearchOutlined,
    PlusOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    MoreOutlined,
    EditOutlined,
  },
  setup() {
    //所有类别数组
    const categories = ref(null);
    let pid = useRoute().params.projectId;
    const projectName = ref("");

    const deleteCategory = async (id) => {
      await service.delete("/categories/" + id);
      searchCategories();
    };

    //新建类别
    const createCategoryVisible = ref(false);
    const showCreateCategory = () => {
      isEditCategory.value = false;
      resetCategoryForm();
      createCategoryVisible.value = true;
    };
    const hideCreateCategory = () => {
      categoryFormRef.value
        .validateFields()
        .then(async () => {
          createCategoryVisible.value = false;

          await service.post("/categories/create", categoryForm.value);
          message.success("类别创建成功！");
          searchCategories();

          resetCategoryForm();
        })
        .catch(() => {
          console.log("表单提交出错");
        });
    };
    const categoryFormRef = ref();
    const categoryForm = ref({
      name: "",
      projectId: pid,
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
      if (name === null || name === "") {
        getAllCategories();
        return;
      }
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

    if (pid === "" && pid === null) {
      router.push("/home");
    } else {
      getAllCategories();
    }

    //获取项目信息
    const getProject = async () => {
      pid = useRoute().params.projectId;
      let resp = await service.get("/projects/" + pid);
      projectName.value = resp.data.data.name;
    };
    getProject();

    //新建案例
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
      name: "",
      description: "",
      categoryId: "",
      userId: useUserStore().user.id,
    });
    const createExampleVisible = ref(false);
    const showCreateExample = (id) => {
      exampleForm.value.categoryId = id;
      createExampleVisible.value = true;
    };
    const hideCreateExample = () => {
      exampleFormRef.value
        .validateFields()
        .then(async () => {
          createExampleVisible.value = false;
          await service.post("/examples/create", exampleForm.value);
          message.success("案例创建成功！");
          searchCategories();

          exampleFormRef.value.resetFields();
        })
        .catch(() => {
          console.log("表单提交出错");
        });
    };

    const resetCategoryForm = () => {
      categoryForm.value = {
        name: "",
        projectId: pid,
        userId: useUserStore().user.id,
      };
    };

    //编辑类别
    const isEditCategory = ref(false);
    let editCategoryId;
    const showEditCategory = (category) => {
      isEditCategory.value = true;
      editCategoryId = category.id;
      categoryForm.value.name = category.name;
      createCategoryVisible.value = true;
    };
    const hideEditCategory = () => {
      categoryFormRef.value
        .validateFields()
        .then(async () => {
          await service.put("/categories", {
            id: editCategoryId,
            name: categoryForm.name,
            projectId: categoryForm.projectId,
            userId: categoryForm.userId,
          });
          searchCategories();
          resetCategoryForm();
          createCategoryVisible.value = false;
        })
        .catch(() => {
          console.log("表单提交出错");
        });
    };

    refreshProject = () => {
      searchCategories();
    };

    return {
      categories,
      projectName,
      // 删除类别
      deleteCategory,

      //新建类别
      createCategoryVisible,
      showCreateCategory,
      hideCreateCategory,
      categoryForm,
      categoryFormRef,
      categoryRules,

      //新建案例
      createExampleVisible,
      showCreateExample,
      hideCreateExample,
      exampleForm,
      exampleFormRef,
      exampleRules,

      //搜索
      searchValue,
      searchCategories,

      //编辑类别
      isEditCategory,
      showEditCategory,
      hideEditCategory,

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
