<template>
  <button
    data-toggle="modal"
    data-target="#admin-check"
    v-show="false"
  ></button>
  <div class="modal fade" id="admin-check">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Admin hisoboti</h4>
        </div>
        <div class="modal-body">
          <div id="adminCheck">
            <div class="date">{{ date }}</div>
            <span>
              Umumiy savdo:
              <strong>
                {{ _.format(data?.trade_total_price) + " " + currency }}
              </strong>
            </span>
            <span>
              Umumiy chiqim:
              <strong>
                <span v-for="item in data?.expenses" :key="item">
                  {{ _.format(item.sum_price) + " " + item.currency }}
                </span>
              </strong>
            </span>
            <span>
              Maosh:
              <strong>
                {{ _.format(data?.total_profit) + " " + currency }}
              </strong>
            </span>
            <hr />
            <span>
              Adminga:
              <strong>
                {{ _.format(data?.admin_price) + " " + currency }}
              </strong>
            </span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" @click="printCheck()">
            <i class="fa fa-print"></i>
          </button>
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../Api/Api";
export default {
  name: "AdminChek",
  props: ["branchCurrency"],
  emits: ["setloading"],
  data() {
    return {
      _: Intl.NumberFormat(),
      date: new Date().toLocaleDateString("ru-RU"),
      data: null,
    };
  },
  computed: {
    currency() {
      return this.$props.branchCurrency;
    },
  },
  created() {},
  methods: {
    start() {
      this.get();
    },
    get() {
      this.$emit("setloading", true);
      api
        .distribute()
        .then((res) => {
          this.data = res.data;
          this.$emit("setloading", false);
          document.querySelector(`[data-target="#admin-check"]`).click();
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    printCheck() {
      let div = document.querySelector("#adminCheck").outerHTML;
      let winPrint = open("", "_balnk");
      winPrint.document.head.innerHTML += `
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          #adminCheck {
            width: 300px;
            padding: 10px;
          }
          @media print {
            #adminCheck {
              width: 100%;
            }
          }
          #adminCheck > span {
            padding: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .date {
            text-align: center;
          }
        </style>
      `;
      winPrint.document.body.innerHTML = div;
      setTimeout(() => {
        winPrint.print();
        winPrint.close();
      }, 100);
    },
  },
};
</script>

<style scoped>
#adminCheck > span {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
