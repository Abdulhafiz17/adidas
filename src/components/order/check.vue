<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#modal-check"
    modal-check-button
  ></button>

  <div class="modal fade" id="modal-check">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div id="order-check">
            <div class="check-img">
              <img :src="`${api.url_to_files}/${logo}`" :alt="logo" />
            </div>
            <div class="news">
              Yangiliklardan <br />
              habardor bo'ling !
            </div>
            <div class="social">
              <div><i class="fab fa-telegram-plane"></i> adidas_andijon</div>
              <div><i class="fab fa-instagram"></i> adidas.navruzmall</div>
              <div>
                <i class="fa fa-phone"></i> +998 {{ formatPhoneNumber(phone) }}
              </div>
            </div>
            <div class="news">
              Будьте в курсе <br />
              новостей !
            </div>
            <div class="date-time">
              <b>{{ time }}</b>
              <b>{{ date }}</b>
            </div>
            <hr />
            <div class="mini-view">
              <div>
                <span>Sotuvchi:</span>
                <span>{{ order?.customer ? order?.customer : "Kassir" }}</span>
              </div>
              <div>
                <span>Mahsulotlar soni:</span>
                <span>{{ trades_quantity + " dona" }}</span>
              </div>
              <div>
                <span>Mijoz:</span>
                <span>{{ order?.customer ? order?.customer : "" }}</span>
              </div>
            </div>
            <hr />
            <div class="products" v-for="item in trades" :key="item">
              <div>
                {{
                  item.Categories.name +
                  " - " +
                  item.Products.articul +
                  " - " +
                  item.Products.size
                }}
              </div>
              <div>{{ item.Trades.quantity + " dona" }}</div>
              <div>
                <div class="discount" v-if="item.Trades.discount">
                  <div class="discount-price">
                    {{
                      _.format(item.Trades.price) +
                      " " +
                      item.Currencies.currency
                    }}
                  </div>
                  <div class="residual-price">
                    <i class="fa fa-tag"></i>
                    {{
                      _.format(item.Trades.price - item.Trades.discount) +
                      " " +
                      item.Currencies.currency
                    }}
                  </div>
                </div>
                <div v-else>
                  {{
                    _.format(item.Trades.price) + " " + item.Currencies.currency
                  }}
                </div>
              </div>
            </div>
            <hr />
            <div class="sum">
              <div>
                <span>Chegirmasiz summa:</span>
                <span>
                  {{
                    _.format(balance?.total_price + trades_discount) +
                    " " +
                    balance?.currency
                  }}
                </span>
              </div>
              <div>
                <span>Chegirma summa:</span>
                <span>
                  {{ _.format(trades_discount) + " " + balance?.currency }}
                </span>
              </div>
              <hr />
              <div v-for="item in incomes" :key="item">
                <span>
                  {{ item.Incomes.comment + ":" }}
                </span>
                <span>{{
                  _.format(item.Incomes.money) + " " + item.currency
                }}</span>
              </div>
              <hr />
              <div>
                <span>Jami summa:</span>
                <span>
                  {{ _.format(balance?.total_price) + " " + balance?.currency }}
                </span>
              </div>
            </div>
            <hr />
            <div class="footer">
              <div>Haridingiz uchun rahmat !</div>
              <div>Thank you for your purchase !</div>
              <div>Спасибо за покупку !</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../Api/Api";
export default {
  name: "check",
  props: {
    orderId: { required: true },
  },
  data() {
    return {
      _: Intl.NumberFormat(),
      logo: localStorage["branch_logo"],
      phone: localStorage["branch_phone"],
      date: new Date().toLocaleDateString("en-GB"),
      time: new Date().toLocaleTimeString({ hourCycle: "h23" }).substring(0, 4),
      order: null,
      trades: [],
      trades_quantity: null,
      balance: null,
      trades_discount: null,
      incomes: [],
    };
  },
  computed: {
    api() {
      return api;
    },
    id() {
      return this.$props.orderId;
    },
  },
  created() {
    console.clear();
  },
  methods: {
    formatPhoneNumber(number) {
      return String(
        "(" +
          String(number).substr(0, 2) +
          ") " +
          String(number).substr(2, 3) +
          " " +
          String(number).substr(5, 2) +
          " " +
          String(number).substr(7, 2)
      );
    },
    start() {
      this.getOrder();
    },
    getOrder() {
      api
        .order(this.id)
        .then((res) => {
          console.log(res.data);
          this.order = res.data;
          this.getTrades();
        })
        .catch((err) => {
          api.catchError(err);
        });
    },
    getTrades() {
      api
        .trades(this.id, 0, 50)
        .then((res) => {
          console.log(res.data.data);
          this.trades = res.data.data;
          let quantity = null,
            discount = null;
          this.trades.forEach((item) => {
            quantity += item.Trades.quantity;
            discount += item.Trades.discount * item.Trades.quantity;
          });
          this.trades_quantity = quantity;
          this.trades_discount = discount;
          this.getBalance();
        })
        .catch((err) => {
          api.catchError(err);
        });
    },
    getBalance() {
      api
        .tradeBalance(this.id)
        .then((res) => {
          console.log(res.data);
          this.balance = res.data;
          this.getIncomes();
        })
        .catch((err) => {
          api.catchError(err);
        });
    },
    getIncomes() {
      api
        .incomes(this.id, "order", 0, 50)
        .then((res) => {
          console.log(res.data.data);
          this.incomes = res.data.data;
          this.openModal();
        })
        .catch((err) => {
          api.catchError(err);
        });
    },
    openModal() {
      document.querySelector("[modal-check-button]").click();
    },
  },
};
</script>

<style scoped>
#order-check {
  width: 100%;
  text-align: center;
}

hr {
  margin: 5px;
}

.check-img {
  width: 30%;
  margin: auto;
}

.check-img > img {
  width: 100%;
}

.news {
  padding: 5px 20px;
  font-size: large;
}

.social {
  width: 50%;
  margin: auto;
  display: grid;
  gap: 5px;
  border: 2px solid black;
  border-radius: 5px;
}

.date-time {
  display: flex;
  justify-content: space-between;
}

.mini-view {
  display: grid;
  gap: 5px;
}

.mini-view > div,
.sum > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.products {
  display: flex;
}

.products > div {
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.products > div:nth-child(1) {
  width: 50%;
  justify-content: start;
}

.products > div:nth-child(2) {
  width: 15%;
}

.products > div:nth-child(3) {
  width: 35%;
  justify-content: end;
}

.products > div:nth-child(3) > .discount > .discount-price {
  text-decoration: line-through;
}

.products > div:nth-child(3) > .discount > .residual-price {
  font-size: small;
}
</style>
