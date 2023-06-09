<template>
  <a-layout>
    <a-page-header :title="document.name" @back="() => router.back()">
    </a-page-header>
    <a-layout-content>
      <template v-if="document.type === 1 || document.type === 2">
        <vue-office-docx :src="src" />
      </template>
      <template v-if="document.type === 3">
        <vue-office-pdf :src="src" />
      </template>
      <template v-else>
        <div style="white-space: pre-wrap">{{ src }}</div>
      </template>
      <a-back-top />
    </a-layout-content>
  </a-layout>
</template>

<script>
import VueOfficeDocx from "@vue-office/docx";
import VueOfficePdf from "@vue-office/pdf";
import service from "@/api/request";
import router from "@/router";
import { useRoute } from "vue-router";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    VueOfficeDocx,
    VueOfficePdf,
    router,
  },
  setup() {
    const document = ref({ name: "", type: "" });
    const src = ref("");
    const getDocument = () => {
      service.get("/documents/" + useRoute().params.documentId).then((resp) => {
        document.value = resp.data.data;
        let type = document.value.type;
        if (type === 4) {
          service
            .get("/documents/download/" + document.value.id, {
              responseType: "text",
            })
            .then((resp) => {
              src.value = resp.data;
            });
        } else {
          src.value =
            service.defaults.baseURL +
            "/documents/download/" +
            document.value.id;
        }
      });
    };
    getDocument();
    return {
      document,
      src,
      router,
    };
  },
});
</script>
