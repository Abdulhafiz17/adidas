<template>
  <h3>
    <i class="fa fa-code-branch" /> {{ branch ? branch.name + " tarixi" : "" }}
  </h3>
  <div class="row">
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4 my-1"></div>
  </div>
  <hr />
  <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        class="nav-link active"
        id="pills-taminot-tab"
        data-bs-toggle="pill"
        data-bs-target="#pills-taminot"
        type="button"
        role="tab"
        aria-controls="pills-taminot"
        aria-selected="true"
        @click="template = 'taminot'"
      >
        Taminot tarixi
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="pills-tolov-tab"
        data-bs-toggle="pill"
        data-bs-target="#pills-tolov"
        type="button"
        role="tab"
        aria-controls="pills-tolov"
        aria-selected="false"
        @click="template = 'tolov'"
      >
        To'lov
      </button>
    </li>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <div
      class="tab-pane fade show active"
      id="pills-taminot"
      role="tabpanel"
      aria-labelledby="pills-taminot-tab"
    >
      <Taminot @setloading="setloading" v-if="template == 'taminot'" />
    </div>
    <div
      class="tab-pane fade"
      id="pills-tolov"
      role="tabpanel"
      aria-labelledby="pills-tolov-tab"
    >
      <Tolov @setloading="setloading" v-if="template == 'tolov'" />
    </div>
  </div>
</template>

<script>
import { branch, catchError } from "@/components/Api/Api";
import Taminot from "./Taminot.vue";
import Tolov from "./Tolov.vue";
export default {
  name: "Filial",
  emits: ["setloading"],
  components: { Taminot, Tolov },
  data() {
    return {
      branch: null,
      template: "taminot",
    };
  },
  created() {
    this.get(this.$route.params.id);
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    get(id) {
      branch(id)
        .then((Response) => {
          this.branch = Response.data.branch;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>

<style>
</style>