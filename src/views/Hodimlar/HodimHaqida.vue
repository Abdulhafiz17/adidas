<template>
  <h3>
    <span class="fa fa-user" /> {{ user ? "Hodim " + user.name : "Hodim" }}
  </h3>
  <ul class="nav nav-pills nav-justified" id="pills-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        class="nav-link active"
        id="pills-home-tab"
        data-bs-toggle="pill"
        data-bs-target="#pills-home"
        type="button"
        role="tab"
        aria-controls="pills-home"
        aria-selected="true"
        @click="
          getExpenses(0, 100);
          page = 0;
          pages = 1;
          limit = 100;
        "
      >
        To'lovlar
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="pills-contact-tab"
        data-bs-toggle="pill"
        data-bs-target="#pills-contact"
        type="button"
        role="tab"
        aria-controls="pills-contact"
        aria-selected="false"
        @click="
          getOrders(0, 100);
          page = 0;
          pages = 1;
          limit = 100;
        "
      >
        Savdolar
      </button>
    </li>
  </ul>
  <hr />
  <div class="tab-content" id="pills-tabContent">
    <div
      class="tab-pane fade show active"
      id="pills-home"
      role="tabpanel"
      aria-labelledby="pills-home-tab"
    >
      <div class="row my-1">
        <div class="col-md-5">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_date"
          />
        </div>
        <div class="col-md-5">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_date"
          />
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getExpenses(0, 100)"
          >
            <i class="far fa-circle-check" />
          </button>
        </div>
      </div>
      <div class="table-responsive my-1" style="max-height: 65vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Summa</th>
              <th>Izoh</th>
              <th>Hodim</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in expenses" :key="item">
              <td>
                {{
                  Intl.NumberFormat().format(item.price) +
                  " " +
                  item.currency.currency
                }}
              </td>
              <td>{{ item.comment }}</td>
              <td>{{ item.user.name }}</td>
              <td>
                {{
                  item.time.replace("T", " ").substring(0, item.time.length - 3)
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4">
                <Pagination
                  :page="page"
                  :pages="pages"
                  :limit="limit"
                  @get="getExpenses"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <div
      class="tab-pane fade"
      id="pills-contact"
      role="tabpanel"
      aria-labelledby="pills-contact-tab"
    >
      <div class="row my-1">
        <div class="col-md-5">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_date_2"
          />
        </div>
        <div class="col-md-5">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_date_2"
          />
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getOrders(0, 100)"
          >
            <i class="far fa-circle-check" />
          </button>
        </div>
      </div>
      <div class="responsive" style="max-height: 65vh">
        <details v-for="item in orders" :key="item" :id="item.id">
          <summary @click="getLoan(item)">
            <h5>Buyurtma - {{ item.ordinal_number }}</h5>
            <h5>Mijoz: {{ item.customer ? item.customer.name : "Umumiy" }}</h5>
            <strong>{{ item.time.substring(0, item.time.length - 9) }}</strong>
          </summary>
          <div class="row my-1" v-if="order && income.length && balance">
            <div class="col-md-4">
              Buyurtma summasi
              <br />
              {{
                Intl.NumberFormat().format(balance.total_price) +
                " " +
                balance.currency
              }}
            </div>
            <div class="col-md-4">
              To'lov summa
              <br />
              <span v-for="(i, index) in income" :key="i">
                {{
                  i.Incomes.comment +
                  ": " +
                  Intl.NumberFormat().format(i.Incomes.money) +
                  " " +
                  i.currency +
                  (index !== income.length - 1 ? ", " : "")
                }}
                <br />
              </span>
            </div>
            <div class="col-md-4">
              Nasiya summa
              <br />
              {{
                Intl.NumberFormat().format(
                  balance.total_price -
                    (income[0].Incomes.money +
                      (income[1] ? income[1].Incomes.money : 0)) -
                    order.discount >
                    0
                    ? balance.total_price -
                        (income[0].Incomes.money +
                          (income[1] ? income[1].Incomes.money : 0)) -
                        order.discount
                    : 0
                ) +
                " " +
                balance.currency
              }}
            </div>
          </div>
          <div class="table-responsive my-1" v-if="trades.length">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>Narx</th>
                  <th>Chegirma</th>
                  <th>Miqdor</th>
                  <th>Qaytarilgan</th>
                  <th>Summa</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in trades" :key="i">
                  <td>
                    {{
                      i.Categories.name +
                      " - " +
                      i.Products.articul +
                      " - " +
                      i.Products.size
                    }}
                  </td>
                  <td>
                    {{
                      Intl.NumberFormat().format(i.Trades.price) +
                      " " +
                      i.Currencies.currency
                    }}
                  </td>
                  <td>
                    {{
                      Intl.NumberFormat().format(i.Trades.discount) +
                      " " +
                      i.Currencies.currency
                    }}
                  </td>
                  <td>
                    {{ i.sum_quantity + " dona" }}
                  </td>
                  <td>
                    {{
                      (returned_products.find((item) => {
                        return i.Trades.code == item.Returned_products.code;
                      })
                        ? returned_products.find((item) => {
                            return i.Trades.code == item.Returned_products.code;
                          }).sum_quantity
                        : "0") + " dona"
                    }}
                  </td>
                  <td>
                    {{
                      Intl.NumberFormat().format(
                        (i.Trades.price - i.Trades.discount) * i.sum_quantity
                      ) +
                      " " +
                      i.Currencies.currency
                    }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="6">
                    <Pagination
                      :page="page_2"
                      :pages="pages_2"
                      :limit="limit_2"
                      @get="getTrades"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </details>
      </div>
      <Pagination :page="page" :pages="pages" :limit="limit" @get="getOrders" />
    </div>
  </div>
</template>

<script>
import {
  catchError,
  incomes,
  loan,
  orders,
  returnedProducts,
  thisUser,
  tradeBalance,
  trades,
  userExpenses,
} from "@/components/Api/Api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Hodim",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 100,
      page_2: 0,
      pages_2: 1,
      limit_2: 100,
      user: null,
      from_date: "",
      to_date: "",
      expenses: [],
      from_date_2: "",
      to_date_2: "",
      orders: [],
      order: null,
      loan: null,
      income: [],
      balance: null,
      trades: [],
      returned_products: [],
    };
  },
  created() {
    this.getUser(0, 100);
  },
  methods: {
    getUser(page, limit) {
      thisUser(this.$route.params.id)
        .then((Response) => {
          this.user = Response.data;
          this.getExpenses(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getExpenses(page, limit) {
      this.$emit("setloading", true);
      userExpenses(
        this.$route.params.id,
        this.from_date,
        this.to_date,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.expenses = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getOrders(page, limit) {
      this.$emit("setloading", true);
      orders(
        this.from_date_2,
        this.to_date_2,
        true,
        this.$route.params.id,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.orders = Response.data.data;
          this.orders.forEach((item) => {
            item.trades = [];
          });
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getLoan(order) {
      this.$emit("setloading", true);
      this.loan = null;
      this.income = [];
      this.balance = null;
      this.trades = [];
      this.returned_products = [];
      document.querySelectorAll("details").forEach((details) => {
        if (Number(details.id) !== order.id) {
          details.removeAttribute("open");
        }
      });
      this.order = order;
      if (order.customer) {
        loan(order.customer.id)
          .then((Response) => {
            this.loan = Response.data;
            this.getIncome(order.id);
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      } else {
        this.getIncome(order.id);
      }
    },
    getIncome(id) {
      incomes(id, "order", 0, 100)
        .then((Response) => {
          this.income = Response.data.data;
          this.getBalance(id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBalance(id) {
      tradeBalance(id)
        .then((Response) => {
          this.balance = Response.data;
          this.getTrades(0, 100);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTrades(page, limit) {
      this.$emit("setloading", true);
      trades(this.order.id, page, limit)
        .then((Response) => {
          this.page_2 = Response.data.current_page;
          this.pages_2 = Response.data.pages;
          this.trades = Response.data.data;
          this.getReturnedProducts(this.order.id, page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getReturnedProducts(id, page, limit) {
      this.$emit("setloading", true);
      returnedProducts(id, page, limit)
        .then((Response) => {
          this.returned_products = Response.data.data;
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

<style scoped>
.input-group {
  justify-content: center;
}
</style>
