<template>
  <div class="container mt-5 py-5 bg-light rounded">
    <div class="row">
      <company-list
        @clicked-add-company="setSelectedTab"
        @clicked-company="setSelectedTab"
        v-if="selectedTab === 'company-details'"
      ></company-list>
      <company-details
        v-if="selectedTab === 'company-details' && showCompanyInfo"
        :key="id"
        :orgNo="orgNo"
        :additionalInfo="additionalInfo"
        :id="id"
        :loadCompanies="loadCompanies"
      ></company-details>
      <add-company
        v-if="selectedTab === 'add-company'"
        @close-add-company="setSelectedTab"
      ></add-company>
    </div>
  </div>
</template>

<script>
import CompanyList from "./CompanyList.vue";
import CompanyDetails from "./CompanyDetails.vue";
import AddCompany from "./AddCompany.vue";

export default {
  components: {
    CompanyList,
    CompanyDetails,
    AddCompany,
  },
  data() {
    return {
      selectedTab: "company-details",
      showCompanyInfo: false,
      orgNo: "",
      additionalInfo: "",
      id: "",
      loadCompanies: null,
    };
  },
  methods: {
    setSelectedTab(
      tab,
      showCompanyInfo,
      orgNo,
      additionalInfo,
      id,
      loadCompanies
    ) {
      this.showCompanyInfo = showCompanyInfo;
      this.selectedTab = tab;
      this.orgNo = orgNo;
      this.additionalInfo = additionalInfo;
      this.id = id;
      this.loadCompanies = loadCompanies;
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #ede3dd !important;
}
</style>
