<template>
  <h5 class="mb-3 hover text-primary" @click="showCompanyDetails">
    <i class="bi-arrow-left"></i> Tilbake
  </h5>
  <h3>Bedrifter</h3>
  <div class="form-group my-3">
    <input
      class="form-control"
      placeholder="Søk"
      v-model.trim="searchInput"
      @keyup.enter="searchCompanies"
    />
  </div>
  <div class="col-lg-3">
    <ul class="list-group">
      <button
        class="list-group-item list-group-item-action list-group-item-light"
        v-for="company in companies"
        :key="company.orgNo"
        @click="chosenCompany(company.orgNo)"
      >
        <p>
          <span>{{ company.companyName }}</span
          >, org.nr. <span>{{ company.orgNo }}</span>
        </p>
      </button>
    </ul>
    <div>
      <ul class="pagination d-flex justify-content-between mt-3">
        <button
          class="btn btn-success page-item"
          @click="getCompanies(pageNumber > 0 ? pageNumber-- : null)"
        >
          <i class="bi-arrow-left-square"></i>
        </button>
        <span class="btn btn-success page-item noHover">{{ pageNumber }}</span>
        <button
          class="btn btn-success page-item"
          @click="getCompanies(pageNumber++)"
        >
          <i class="bi-arrow-right-square"></i>
        </button>
      </ul>
    </div>
  </div>
  <form class="col-lg-9" v-if="showCompanyInfo" @submit.prevent="addCompany">
    <div class="row mt-3" v-for="info in companyInfo" :key="info.orgNo">
      <h1>{{ info.companyName }}</h1>
      <div class="col-lg-6 border-end border-dark">
        <table class="table table-borderless">
          <tbody>
            <tr>
              <td><i class="bi-person"></i> Daglig leder:</td>
              <td class="text-end" v-for="ceo in ceo" :key="ceo.type">
                <span>{{ ceo.ceoFirstName }}</span>
                <span class="ps-1">{{ ceo.ceoLastName }}</span>
              </td>
            </tr>
            <tr>
              <td><i class="bi-people"></i> Styremedlemmer:</td>
              <td class="text-end">
                <p v-for="member in companyMembers" :key="member.type">
                  <span>{{ member.memberFirstName }}</span>
                  <span class="ps-1">{{ member.memberLastName }}</span>
                  (<span>{{ member.memberID.beskrivelse }}</span
                  >)
                </p>
              </td>
            </tr>
            <tr>
              <td><i class="bi-people"></i> Antall ansatte:</td>
              <td class="text-end">{{ info.employees }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-lg-6">
        <table class="table table-borderless">
          <tbody>
            <tr>
              <td><i class="bi-globe"></i> Nettside:</td>
              <td class="text-end">
                <a :href="info.homePage"> {{ info.homePage }} </a>
              </td>
            </tr>
            <tr>
              <td><i class="bi-building"></i> Adresse:</td>
              <td class="text-end">
                <span>{{ info.address.adresse[0] }}</span
                ><br />
                <span v-if="info.address.adresse.length > 1"
                  ><span> {{ info.address.adresse[1] }} </span><br
                /></span>
                <span> {{ info.address.postnummer }} </span>
                <span class="ps-1"> {{ info.address.poststed }} </span>
              </td>
            </tr>
            <tr>
              <td><i class="bi-list-ol"></i> Org.nummer:</td>
              <td class="text-end">
                {{ info.orgNo }}
              </td>
            </tr>
            <tr>
              <td><i class="bi-diagram-3"></i> Organisasjonsform:</td>
              <td class="text-end">{{ info.orgForm.beskrivelse }}</td>
            </tr>
            <tr>
              <td><i class="bi-upc"></i> Næringskode(r):</td>
              <td class="text-end">
                <span>{{ info.industryCode.kode }}</span> -
                <span>{{ info.industryCode.beskrivelse }}</span>
              </td>
            </tr>
            <tr>
              <td><i class="bi-calendar-event"></i> Stiftelsesdato:</td>
              <td class="text-end">{{ info.dateCreated }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="form-group">
      <label for="additionalInformation">Tilleggsinformasjon(frivillig):</label>
      <textarea
        id="additionalInformation"
        class="form-control"
        rows="4"
        v-model="additionalInfo"
      ></textarea>
    </div>
    <button type="submit" class="btn btn-primary my-5 float-end">
      Legg til
    </button>
    <button
      type="button"
      class="btn btn-primary my-5 me-3 float-end"
      @click="showCompanyDetails"
    >
      Lukk
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      companies: [],
      searchInput: "",
      pageNumber: 0,
      closeAddCompany: "company-details",
      companyInfo: [],
      showCompanyInfo: false,
      companyMembers: [],
      ceo: [],
      additionalInfo: "",
      error: null,
    };
  },
  emits: ["close-add-company"],
  methods: {
    showCompanyDetails() {
      this.$emit("close-add-company", this.closeAddCompany);
    },
    getCompanies() {
      if (this.pageNumber >= 0) {
        fetch(
          "https://data.brreg.no/enhetsregisteret/api/enheter?size=10&page=" +
            this.pageNumber
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((data) => {
            const results = [];
            const companies = data._embedded.enheter;
            for (let i = 0; i < companies.length; i++) {
              results.push({
                orgNo: companies[i].organisasjonsnummer,
                companyName: companies[i].navn,
                employees: companies[i].antallAnsatte,
              });
            }
            this.companies = results;
          });
      }
    },
    searchCompanies() {
      this.companies = [];

      if (parseInt(this.searchInput)) {
        fetch(
          "https://data.brreg.no/enhetsregisteret/api/enheter?size=10&organisasjonsnummer=" +
            parseInt(this.searchInput.replace(/\s+/g, ""))
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((data) => {
            const results = [];
            const companies = data._embedded.enheter;
            for (let i = 0; i < companies.length; i++) {
              results.push({
                orgNo: companies[i].organisasjonsnummer,
                companyName: companies[i].navn,
                employees: companies[i].antallAnsatte,
              });
            }
            this.companies = results;
          });
      } else if (!parseInt(this.searchInput) && this.searchInput != "") {
        fetch(
          "https://data.brreg.no/enhetsregisteret/api/enheter?size=10&navn=" +
            this.searchInput
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((data) => {
            const results = [];
            const companies = data._embedded.enheter;
            for (let i = 0; i < companies.length; i++) {
              results.push({
                orgNo: companies[i].organisasjonsnummer,
                companyName: companies[i].navn,
                employees: companies[i].antallAnsatte,
              });
            }
            this.companies = results;
          });
      } else {
        this.getCompanies(0);
      }
    },
    chosenCompany(orgNo) {
      this.companyInfo = [];
      this.companyMembers = [];
      this.ceo = [];
      this.showCompanyInfo = true;
      fetch(
        "https://data.brreg.no/enhetsregisteret/api/enheter?organisasjonsnummer=" +
          orgNo
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          const results = [];
          const company = data._embedded.enheter[0];

          results.push({
            orgNo: company.organisasjonsnummer,
            companyName: company.navn,
            employees: company.antallAnsatte,
            industryCode: company.naeringskode1,
            orgForm: company.organisasjonsform,
            address: company.forretningsadresse,
            dateCreated: company.stiftelsesdato,
            homePage: company.hjemmeside,
          });
          this.companyInfo = results;
        });

      fetch(
        "https://data.brreg.no/enhetsregisteret/api/enheter/" +
          orgNo +
          "/roller",
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          const companyMembers = [];
          const ceo = [];
          const roles = data.rollegrupper[1].roller;
          const ceoAPI = data.rollegrupper[0].roller;

          for (let i = 0; i < roles.length; i++) {
            companyMembers.push({
              memberID: roles[i].type,
              memberFirstName: roles[i].person.navn.fornavn,
              memberLastName: roles[i].person.navn.etternavn,
            });
          }

          for (let i = 0; i < ceoAPI.length; i++) {
            ceo.push({
              ceoID: ceoAPI[i].type,
              ceoFirstName: ceoAPI[i].person.navn.fornavn,
              ceoLastName: ceoAPI[i].person.navn.etternavn,
            });
          }

          this.companyMembers = companyMembers;
          this.ceo = ceo;
        });
    },
    addCompany() {
      const that = this;
      fetch(
        "https://vue-http-demo-6ea2f-default-rtdb.europe-west1.firebasedatabase.app/company.json",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            orgNo: that.companyInfo[0].orgNo,
            companyName: that.companyInfo[0].companyName,
            additionalInfo: that.additionalInfo,
          }),
        }
      )
        .then((res) => {
          if (res.ok) {
            that.additionalInfo = "";
            that.showCompanyDetails();
          } else {
            throw new Error("Kunne ikke lagre data, prøv igjen senere.");
          }
        })
        .catch((err) => {
          that.error = err.message;
        });
    },
  },
  mounted() {
    this.getCompanies(0);
  },
};
</script>

<style scoped>
.noHover {
  cursor: default;
}
.noHover:hover {
  background-color: #198754;
  border-color: #198754;
}
.hover {
  cursor: pointer;
}
</style>
