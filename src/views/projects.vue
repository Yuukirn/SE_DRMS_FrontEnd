<template>
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
          <div class="logo" />
          <a-input-search
            v-model:value="value"
            placeholder="输入项目id号"
            enter-button="查询"
            size="large"
            style="margin: 0% 0% 5%"
            @search="onSearch"
          />
          <a-menu v-model:selectedKeys="selectedKeys" mode="inline">
            <template v-if="show" v-for="project of projects">
              <a-menu-item
                v-if="show"
                :key="project.key"
                @click="viewProject(project.key)"
              >
                <span class="nav-text">{{ project.name }}</span>
              </a-menu-item>
            </template>
          </a-menu>
        </a-layout-content>
        <a-layout-footer class="sider_footer">
          <a-button type="primary" size="large" @click="createProject">
            新建方案
          </a-button>
        </a-layout-footer>
      </a-layout>
    </a-layout-sider>
    <a-layout style="margin: 0% 5% 0%" :style="{ marginLeft: '35%' }">
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <template v-if="project !== null">
          <a-layout>
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
          </a-layout>
        </template>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import router from "@/router";
import { defineComponent, ref } from "vue";
import service from "@/api/request";
import { useProjectStore } from "@/store/project";
export default defineComponent({
  components: {},
  setup() {
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
    const createProject = () => {};
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
    return {
      selectedKeys: ref(["4"]),
      projects,
      project,
      getProjects,
      viewProject,
      createProject,
      show,
      value,
      onSearch,
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
  background-color: rgb(241, 241, 241);
}
.content_header {
  background-color: rgb(241, 241, 241);
  text-align: left;
  font-size: 32px;
  margin: 5% 0% 0%;
}
</style>
