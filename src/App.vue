<template>
  <page-container></page-container>
  <div class="fixed-bottom text-center text-white py-3">
    Appex Skilltest 2022 - Nhien Phung
  </div>
</template>

<script>
import PageContainer from "./components/PageContainer.vue";
export default {
  components: {
    PageContainer,
  },
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.css";
@import "~bootstrap-icons/font/bootstrap-icons.css";
body {
  background-color: #edece9;
}
.fixed-bottom {
  background-color: #221e20;
}
</style>
