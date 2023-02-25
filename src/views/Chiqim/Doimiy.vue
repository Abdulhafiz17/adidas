<template>
  <div class="row my-1">
    <div class="col-md-3 mb-1">
      <select
        class="form-select form-select-sm"
        v-model="id"
        @click="getExpenses()"
      >
        <option value="0">Barchasi</option>
        <option v-for="item in fixed_expenses" :key="item" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="col-md-4 mb-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="from_time"
      />
    </div>
    <div class="col-md-4 mb-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="to_time"
      />
    </div>
    <div class="col-md-1 mb-1">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="get(page, limit)"
      >
        <i class="far fa-circle-check" />
      </button>
    </div>
  </div>
  <div
    class="table-responsive"
    :style="`max-height: ${role == 'branch_admin' ? '74vh' : '79vh'}`"
  >
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Chiqim</th>
          <th>Summa</th>
          <th>Admin summa</th>
          <th>Izoh</th>
          <th>Kim tomonidan</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item">
          <td>{{ item.name }}</td>
          <td>
            {{ Intl.NumberFormat().format(item.Expenses.price) }}
            {{ item.Expenses.currency.currency }}
          </td>
          <td>
            {{ Intl.NumberFormat().format(item.Expenses.for_admin_price) }}
            {{ item.Currencies?.currency }}
          </td>
          <td>{{ item.Expenses.comment }}</td>
          <td>{{ item.Expenses.user.name }}</td>
          <td>{{ item.Expenses.time.replace("T", " ") }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6">
            <Pagination
              :page="page"
              :pages="pages"
              :limit="limit"
              @get="getFixedExpenses"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import {
  catchError,
  fixedExpense,
  variableExpenses,
} from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Fixed",
  props: ["expenses"],
  emits: ["setloading", "getExpenses"],
  components: { Pagination },
  data() {
    return {
      role: localStorage["role"],
      page: 0,
      pages: 1,
      limit: 50,
      id: 0,
      from_time: "",
      to_time: "",
      history: [],
    };
  },
  computed: {
    fixed_expenses() {
      return this.$props.expenses;
    },
  },
  created() {
    this.getFixedExpenses(this.page, this.limit);
  },
  methods: {
    getFixedExpenses(page, limit) {
      this.$emit("setloading", true);
      fixedExpense(
        page,
        limit,
        this.$route.params.id,
        this.id,
        this.from_time,
        this.to_time
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.history = Response.data.data;
          if (!this.id) this.getVaribaleExpenses(page, limit);
          else this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getVaribaleExpenses(page, limit) {
      this.$emit("setloading", true);
      variableExpenses(
        page,
        limit,
        this.$route.params.id,
        this.from_time,
        this.to_time
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.history = this.history.concat(Response.data.data);
          this.history = this.history.sort((a, b) => {
            let x = a.Expenses.time,
              y = b.Expenses.time;
            return x < y ? 1 : x > y ? -1 : 0;
          });
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getExpenses() {
      this.$emit("getExpenses");
    },
  },
};
</script>

<style scoped>
.input-group {
  justify-content: center;
}
.table-responsive {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
