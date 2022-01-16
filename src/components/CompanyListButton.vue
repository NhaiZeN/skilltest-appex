<template>
  <button type="button" class="list-group-item list-group-item-action">
    <h5>{{ companyName }}</h5>
    <p class="mb-1">
      <span>Organisasjonsnummer: </span><span>{{ orgNo }}</span>
    </p>
  </button>
</template>

<script>
export default {
  props: ["orgNo", "companyName"],
};
</script>

<style scoped>
button {
  background-color: #ebe9e9;
}
</style>
