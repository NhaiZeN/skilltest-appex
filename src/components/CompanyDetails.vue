<template>
  <div class="col-lg-9" v-for="info in companyInfo" :key="info.orgNo">
    <div v-if="!deletedCompanyInfo">
      <div class="d-flex justify-content-between">
        <h1>
          <span
            ><span>{{ info.companyName }}</span>
            <i
              class="bi-pencil-square hover ps-2 icon-size"
              @click="editMode = !editMode"
            ></i>
          </span>
        </h1>
        <i
          class="bi-trash hover icon-size my-auto"
          @click="deleteCompanyInfo"
        ></i>
      </div>
      <div>
        <ul class="nav">
          <li class="nav-item">
            <button
              class="btn btn-outline-primary"
              @click="setSelectedTab('general-info')"
            >
              Generell info
            </button>
          </li>
          <li class="nav-item ps-3">
            <button
              class="btn btn-outline-primary"
              @click="setSelectedTab('roles')"
            >
              Roller
            </button>
          </li>
        </ul>
      </div>
      <div class="mt-3">
        <div v-if="selectedTab === 'general-info'">
          <table class="table table-borderless">
            <tbody>
              <tr>
                <td><i class="bi-globe"></i> Nettside:</td>
                <td class="text-end">
                  <a :href="'https://' + info.homePage" target="_blank">
                    {{ info.homePage }}
                  </a>
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
                <td><i class="bi-people"></i> Antall ansatte:</td>
                <td class="text-end">{{ info.employees }}</td>
              </tr>
              <tr>
                <td><i class="bi-list-ol"></i> Org.nummer:</td>
                <td class="text-end">{{ info.orgNo }}</td>
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
          <div class="my-5">
            <h5>Tilleggsinformasjon</h5>
            <p v-if="!editMode">
              {{ editAdditionalInfo }}
            </p>
            <div v-else>
              <textarea
                class="form-control"
                rows="4"
                v-model="editAdditionalInfo"
              >
              </textarea>
              <button
                type="button"
                class="btn btn-primary float-end my-5"
                @click="editCompanyInfo"
              >
                Lagre endringer
              </button>
            </div>
          </div>
        </div>
        <div v-else-if="selectedTab === 'roles'">
          <roles-tab :orgNo="orgNo"></roles-tab>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RolesTab from "./RolesTab.vue";
export default {
  props: ["orgNo", "additionalInfo", "id", "loadCompanies", "showCompanyInfo"],
  components: {
    RolesTab,
  },
  data() {
    return {
      companyInfo: [],
      companyMembers: [],
      error: null,
      editMode: false,
      editAdditionalInfo: this.additionalInfo,
      deletedCompanyInfo: this.showCompanyInfo,
      selectedTab: "general-info",
    };
  },
  methods: {
    setSelectedTab(tab) {
      this.selectedTab = tab;
    },
    loadCompanyInfo() {
      fetch(
        "https://data.brreg.no/enhetsregisteret/api/enheter?organisasjonsnummer=" +
          this.orgNo
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
    },
    deleteCompanyInfo() {
      fetch(
        "https://vue-http-demo-6ea2f-default-rtdb.europe-west1.firebasedatabase.app/company/" +
          this.id +
          ".json",
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            this.deletedCompanyInfo = true;
            this.loadCompanies();
          } else {
            throw new Error("Kunne ikke slette data, prøv igjen senere");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editCompanyInfo() {
      fetch(
        "https://vue-http-demo-6ea2f-default-rtdb.europe-west1.firebasedatabase.app/company/" +
          this.id +
          ".json",

        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            additionalInfo: this.editAdditionalInfo,
          }),
        }
      )
        .then((res) => {
          if (res.ok) {
            this.editMode = false;
            this.loadCompanies();
          } else {
            throw new Error("Kunne ikke oppdatere data, prøv igjen senere");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.loadCompanyInfo();
  },
};
</script>

<style scoped>
.hover {
  cursor: pointer;
}
.table-borderless > :not(caption) > * > * {
  border-bottom-width: 2px !important;
  border-bottom-color: rgb(170, 170, 170);
}
.table-borderless > :not(caption) > * > th {
  border-bottom-width: 0px !important;
}
.icon-size {
  font-size: 25px;
}
</style>
