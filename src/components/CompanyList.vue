<template>
  <div class="col-lg-3 mb-5">
    <h3 class="d-flex justify-content-between">
      <span
        >Bedrifter
        <i @click="loadCompanies" class="bi-arrow-clockwise hover"></i></span
      ><i class="bi-plus-square hover" @click="addCompany"></i>
    </h3>
    <p v-if="isLoading"></p>
    <p v-else-if="!isLoading && error">{{ error }}</p>
    <p v-else-if="!isLoading && (!results || results.length === 0)">
      Ingen data funnet. Legg til data.
    </p>
    <div id="companies" class="list-group rounded-3" v-else>
      <company-list-button
        @click="showCompanyDetails(index)"
        v-for="(result, index) in results"
        :key="result.id"
        :orgNo="result.orgNo"
        :companyName="result.companyName"
        :id="result.id"
        :showCompanyInfo="showCompanyInfo"
      ></company-list-button>
    </div>
  </div>
</template>

<script>
import CompanyListButton from "./CompanyListButton.vue";
export default {
  components: {
    CompanyListButton,
  },
  data() {
    return {
      addCompanyClicked: "add-company",
      selectedCompany: "company-details",
      results: [],
      error: null,
      isLoading: false,
      showCompanyInfo: false,
    };
  },
  emits: ["clicked-company", "clicked-add-company"],
  methods: {
    addCompany() {
      this.$emit("clicked-add-company", this.addCompanyClicked);
    },
    showCompanyDetails(index) {
      this.showCompanyInfo = true;
      this.$emit(
        "clicked-company",
        this.selectedCompany,
        this.showCompanyInfo,
        this.results[index].orgNo,
        this.results[index].additionalInfo,
        this.results[index].id,
        this.loadCompanies
      );
    },
    loadCompanies() {
      this.isLoading = true;
      this.error = null;
      fetch(
        "https://vue-http-demo-6ea2f-default-rtdb.europe-west1.firebasedatabase.app/company.json"
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          this.isLoading = false;
          const results = [];
          for (const id in data) {
            results.push({
              id: id,
              orgNo: data[id].orgNo,
              companyName: data[id].companyName,
              additionalInfo: data[id].additionalInfo,
            });
          }
          this.results = results;
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.error = "Problemer med å laste inn data, prøv igjen senere.";
        });
    },
  },
  mounted() {
    this.loadCompanies();
  },
};
</script>

<style scoped>
#companies {
  overflow: hidden;
  overflow-y: scroll;
  max-height: 700px;
}
.hover:hover {
  cursor: pointer;
}
</style>
