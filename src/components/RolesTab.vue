<template>
  <table
    class="table table-borderless table-striped table-success"
    v-if="companyMembers.length > 0 || ceo.length > 0"
  >
    <tbody>
      <tr v-for="ceo in ceo" :key="ceo.ceoID.kode">
        <td><i class="bi-person"></i> {{ ceo.ceoID.beskrivelse }}:</td>
        <td class="text-end">
          <span>{{ ceo.ceoFirstName }}</span>
          <span class="ps-1">{{ ceo.ceoLastName }}</span>
        </td>
      </tr>
      <tr v-for="member in companyMembers" :key="member.memberID.kode">
        <td><i class="bi-person"></i> {{ member.memberID.beskrivelse }}</td>
        <td class="text-end">
          <span>{{ member.memberFirstName }}</span>
          <span class="ps-1">{{ member.memberLastName }}</span>
        </td>
      </tr>
    </tbody>
  </table>
  <p v-else>Denne bedriften har ikke definert sine roller.</p>
</template>

<script>
export default {
  props: ["orgNo"],
  data() {
    return {
      ceo: [],
      companyMembers: [],
    };
  },
  methods: {
    getRoles() {
      fetch(
        "https://data.brreg.no/enhetsregisteret/api/enheter/" +
          this.orgNo +
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
  },
  mounted() {
    this.getRoles();
  },
};
</script>
