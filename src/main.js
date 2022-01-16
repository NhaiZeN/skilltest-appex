import { createApp } from "vue";
import App from "./App.vue";
import PageContainer from "./components/PageContainer.vue";

const app = createApp(App);

app.component("page-container", PageContainer);

app.mount("#app");
