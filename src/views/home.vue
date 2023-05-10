<!-- <template>
  <a-layout has-sider style="min-height: 100vh">
    <a-layout-sider
      width="30%"
      :style="{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }"
    >
      <a-layout style="background-color: white; min-height: 90vh; margin: 10%">
        <a-layout-header class="sider_header">我的项目</a-layout-header>
        <a-layout-content
          style="background-color: white"
          :style="{ overflow: 'initial' }"
        >
          <a-divider />
          <a-input-search
            v-model:value="value"
            placeholder="输入项目名"
            enter-button="查询"
            size="large"
            style="margin: 0% 0% 5%"
            @search="onSearch"
          />
          <a-menu v-model:selectedKeys="selectedKeys" mode="inline">
            <template v-for="project of projects">
              <a-menu-item v-if="project.id" :key="project.id">
                <span class="nav-text">{{ project.name }}</span>
              </a-menu-item>
            </template>
          </a-menu>
        </a-layout-content>

        <a-layout-footer class="sider_footer">
          <a-button type="primary" size="large" @click="showDrawer">
            新建方案
          </a-button>
        </a-layout-footer>
      </a-layout>
    </a-layout-sider>
    <a-layout style="margin: 0% 5% 0%" :style="{ marginLeft: '35%' }">
      <!-- <template v-if="project !== null">
        <a-layout-header class="content_header">{{
          project.name
        }}</a-layout-header>
        <a-layout-content
          :style="{ margin: '24px 16px 0', overflow: 'initial' }"
        >
          <a-divider />
          <div
            :style="{
              padding: '24px',
              background: 'rgb(241, 241, 241)',
              textAlign: 'center',
            }"
          >
            {{ project.description }}
          </div>
        </a-layout-content>
        <a-layout-footer>
          <a-button
            type="primary"
            size="large"
            @click="() => router.push('/project')"
          >
            进入项目
          </a-button>
        </a-layout-footer>
      </template> -->
      <!-- <template v-else>
        <a-empty style="margin: 30%" :description="null" />
      </template> -->
      <template v-if="projects !== null">
        <a-list :grid="{ gutter: 16, column: 4 }" :data-source="projects">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card :title="item.name">
                <template #extra><a @click="toProject(item)">进入</a></template
                >{{ item.description }}
              </a-card>
            </a-list-item>
          </template>
        </a-list>
      </template>
    </a-layout>
  </a-layout>

  <a-drawer
    title="新建项目"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'rigth' }"
    @close="onClose"
  >
    <a-form
      :model="projectForm"
      :rules="rules"
      v-bind="layout"
      @finish="createProject"
    >
      <a-form-item label="项目名称" name="name">
        <a-input
          v-model:value="projectForm.name"
          placeholder="请输入项目名称"
        />
      </a-form-item>

      <a-form-item label="项目类型" name="type">
        <a-select v-model:value="projectForm.type" placeholder="请选择一个类型">
          <a-select-option value="0">0</a-select-option>
          <a-select-option value="1">1</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="项目详情" name="description">
        <a-textarea
          v-model:value="projectForm.description"
          :rows="4"
          placeholder="请输入项目详情"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 12 }">
        <a-button type="primary" html-type="submit">创建</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<script>
import router from "@/router";
import { defineComponent, ref, reactive } from "vue";
import service from "@/api/request";
import { useUserStore } from "@/store/user";
import { message } from "ant-design-vue";
export default defineComponent({
  components: {},
  setup() {
    const projectForm = reactive({
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
    const visible = ref(false);
    const showDrawer = () => {
      visible.value = true;
    };
    const onClose = () => {
      visible.value = false;
    };
    let projects = ref([]);
    const getProjects = async (name) => {
      var resp;
      if (name === null || name === "") {
        resp = await service.get("/projects");
      } else {
        resp = await service.get("/projects/search/" + name);
      }
      var arr;
      if (resp === null) {
        arr = [];
      } else {
        arr = resp.data.data;
      }
      projects.value = arr;
    };
    getProjects(null);
    const createProject = async () => {
      const resp = await service.post("/projects/create", projectForm);
      message.success("项目创建成功！");
      getProjects(null);
      visible.value = false;
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

    const test = (value) => {
      console.log(value);
    };

    const toProject = (project) => {
      router.push({ name: "project", params: { projectId: project.id } });
    };
    return {
      selectedKeys: ref(["4"]),
      projects,
      getProjects,
      createProject,
      value,
      onSearch,
      projectForm,
      rules,
      visible,
      showDrawer,
      onClose,
      layout,
      router,

      test,
      toProject,
    };
  },
});
</script>
<style scoped>
.sider_header {
  height: 42px;
  font-size: 20px;
  text-align: left;
  background-color: rgb(255, 255, 255);
}
.sider_footer {
  background-color: rgb(255, 255, 255);
}
.ant-divider {
  background-color: rgb(207, 207, 207);
}
.ant-layout-sider {
  background-color: rgb(255, 255, 255);
}
.ant-layout-content {
  background-color: rgb(255, 255, 255);
}
.content_header {
  background-color: rgb(255, 255, 255);
  text-align: left;
  font-size: 32px;
  margin: 5% 0% 0%;
}
</style>

 -->


 <template>
  <div class="box">
    <div class="content">
      <!-- 标题 -->
      <div class="head">
        <a-text style="font-weight: bold;font-size: 32px;padding: 8px;">欢迎,</a-text>
        <a-dropdown :placement="bottom" :overlayStyle="{ minWidth: 900 }">
          <!-- 用户名 -->
          <a-text style="color: #1684FC;font-weight: bold;font-size: 32px;padding: 8px;">
            <template v-for="item in user"> {{ item.id }} </template>
          </a-text>
          <!-- 登出框 -->
          <template #overlay>
            <a-menu :style="{width: '120px'}">
              <a-menu-item key="1" style="font-size: 16px;">
                <logout-outlined style="font-size: 16px;margin-right: 4px;" />
                登出
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-text style="font-weight: bold;font-size: 32px;">!</a-text>
      </div>
      <div class="project">
        <a-text style="font-size: 20px;background-color: #fff;padding: 8px;">
          我的项目库
        </a-text>
        <!-- 新建项目 -->
        <div class="addButton">
          <a-button type="primary" @click="showAddProject">
            <template #icon>
              <PlusOutlined />
            </template>
            新建项目
          </a-button>
          <a-modal v-model:visible="addProjectVisible" title="新建项目" ok-text="提交" cancel-text="取消" @ok="handleOk">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </a-modal>
        </div>
      </div>
      <div class="card">
        <a-row :gutter="[16, 16]" justify="space-around">
          <a-col v-for="n in 6">
            <a-card hoverable style="width: 300px">
              <template #cover>
                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
              </template>
              <a-card-meta>
                <template #title>Card title</template>
                <template #description>This is the description</template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script>
import { PlusOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  components: {
    PlusOutlined,
    LogoutOutlined
  },
  setup() {
    const addProjectVisible = ref(false);
    const showAddProject = () => {
      addProjectVisible.value = true;
    };
    const handleOk = e => {
      console.log(e);
      addProjectVisible.value = false;
    };
    const user = ref([{
      id: '干饭不排队',
      token: '',
    },
    ]);
    return {
      addProjectVisible,
      showAddProject,
      handleOk,
      user,
    };
  }
});
</script>
<style>
.box {
  display: flex;
  justify-content: center;
}

.box .content {
  width: 960px;
  margin-top: 84px;

}

.box .content .head {
  text-align: left;
}

.box .content .project {
  margin-top: 32px;
  text-align: left;
  justify-content: center;
  width: inherit;
}

.card {
  margin-top: 14px;
  text-align: left;
}

.addButton {
  float: right;
  margin-right: 8px;
}
</style>