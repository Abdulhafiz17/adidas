<template>
  <h3><i class="fa fa-box" /> Mahsulotlar qoldig'ini qayta ko'rib chiqish</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="btn-group btn-group-sm">
        <button
          class="btn btn-outline-success"
          :disabled="products_waiting.length || products_counted.length"
          @click="openControl()"
        >
          <i class="fa fa-plus"></i> Yangi tekshiruv qo'shish
        </button>
        <button
          class="btn btn-outline-danger"
          :disabled="!products_waiting.length || products_counted.length"
          @click="cancelControl()"
        >
          <i class="fa fa-ban"></i> Tekshiruvni yakunlash
        </button>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button class="btn btn-sm btn-outline-secondary">
        <i class="fa fa-history"></i> Tekshiruvlar tarixi
      </button>
    </div>
  </div>
  <hr />

  <div class="row">
    <div class="col-md-6">
      <form @submit.prevent="getProductsWaiting(0, 25)">
        <div class="input-group input-group-sm">
          <input
            type="search"
            class="form-control"
            placeholder="Qidiruv"
            v-model="code"
            @focusout="code ? false : getProductsWaiting(0, 25)"
          />
          <div class="input-group-text">
            <i class="fa fa-barcode" />
          </div>
        </div>
      </form>
      <div class="responsive" style="max-height: 80vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Mahsulot - Artikul - O'lcham - Code</th>
              <th>Hajm</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products_waiting" :key="item">
              <td>
                {{
                  item.category +
                  " - " +
                  item.pr_articul +
                  " - " +
                  item.pr_size +
                  " - " +
                  item.code
                }}
              </td>
              <td>
                <form @submit.prevent="putProduct(item)">
                  <div class="input-group input-group-sm">
                    <input
                      class="form-control"
                      type="number"
                      step="any"
                      min="0"
                      placeholder="miqdor"
                      required
                      v-model="item.real_quantity"
                      @click="
                        item.real_quantity = item.real_quantity
                          ? item.real_quantity
                          : null
                      "
                      @focusout="
                        item.real_quantity = item.real_quantity
                          ? item.real_quantity
                          : 0
                      "
                    />
                    <div class="input-group-text">dona</div>
                    <div class="input-group-append">
                      <button class="btn btn-outline-info">
                        <i class="fa fa-share"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">
                <Pagination
                  :page="page"
                  :pages="pages"
                  :limit="limit"
                  @get="getProductsWaiting"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div class="col-md-6">
      <form @submit.prevent="getProductsCounted(0, 25)">
        <div class="input-group input-group-sm">
          <input
            type="search"
            class="form-control"
            placeholder="Qidiruv"
            v-model="code_1"
            @focusout="code_1 ? false : getProductsCounted(0, 25)"
          />
          <div class="input-group-text">
            <i class="fa fa-barcode" />
          </div>
        </div>
      </form>
      <div class="responsive" style="max-height: 80vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  :checked="
                    products_for_accept.length &&
                    products_for_accept.length == products_counted.length
                      ? true
                      : false
                  "
                  @change="checkArray($event)"
                />
              </th>
              <th>Mahsulot - Artikul - O'lcham - Code</th>
              <th>Hajm</th>
              <th>
                <button
                  class="btn btn-sm btn-outline-success"
                  :disabled="!products_for_accept.length"
                  @click="acceptProducts(products_for_accept)"
                >
                  <i class="far fa-circle-check" /> Tasdiqlash
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products_counted" :key="item">
              <td>
                <input
                  type="checkbox"
                  v-model="products_for_accept"
                  :value="item"
                />
              </td>
              <td>
                {{
                  item.category +
                  " - " +
                  item.pr_articul +
                  " - " +
                  item.pr_size +
                  " - " +
                  item.code
                }}
              </td>
              <td>
                <form
                  @submit.prevent="
                    putProduct(item);
                    item.edit = false;
                  "
                >
                  <div class="input-group input-group-sm">
                    <input
                      class="form-control"
                      type="number"
                      step="any"
                      min="0"
                      placeholder="miqdor"
                      required
                      v-model="item.real_quantity"
                      :readonly="!item.edit"
                      @dblclick="item.edit = true"
                    />
                    <div class="input-group-text">dona</div>
                    <div class="input-group-append" v-if="item.edit">
                      <button class="btn btn-outline-warning">
                        <i class="far fa-edit"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </td>
              <td></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4">
                <Pagination
                  :page="page_1"
                  :pages="pages_1"
                  :limit="limit_1"
                  @get="getProductsCounted"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  changeControlProductQuantity,
  controlProducts,
  controls,
  createControl,
  removeControl,
  success,
  updateControlProduct,
} from "@/components/Api/Api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Revision",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      control_id: 0,
      code: null,
      page: 0,
      pages: 1,
      limit: 25,
      code_1: null,
      page_1: 0,
      pages_1: 1,
      limit_1: 25,
      products_waiting: [],
      products_counted: [],
      products_for_accept: [],
    };
  },
  created() {
    this.getProductsWaiting(0, 25);
    this.getProductsCounted(0, 25);
  },
  methods: {
    openControl() {
      this.$emit("setloading", true);
      createControl()
        .then((Response) => {
          success().then(() => {
            this.getProductsWaiting(0, 25);
            this.getProductsCounted(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    cancelControl() {
      this.$emit("setloading", true);
      removeControl()
        .then((Response) => {
          success().then(() => {
            this.getProductsWaiting(0, 25);
            this.getProductsCounted(0, 25);
            // this.products_waiting = [];
            // this.products_counted = [];
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getControls(page, limit) {
      controls(this.$route.params.id, page, limit)
        .then((Response) => {
          console.log(Response.data.data);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProductsWaiting(page, limit) {
      this.$emit("setloading", true);
      let code = this.code ? this.code : 0;
      controlProducts(0, "not_counted", code, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.products_waiting = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProductsCounted(page, limit) {
      this.$emit("setloading", true);
      this.products_for_accept = [];
      let code = this.code_1 ? this.code_1 : 0;
      controlProducts(0, "counted", code, page, limit)
        .then((Response) => {
          this.page_1 = Response.data.current_page;
          this.pages_1 = Response.data.pages;
          this.limit_1 = Response.data.limit;
          this.products_counted = Response.data.data;
          this.products_counted.forEach((product) => {
            product.edit = false;
          });
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    putProduct(product) {
      this.$emit("setloading", true);
      updateControlProduct(product)
        .then((Response) => {
          success().then(() => {
            this.getProductsWaiting(0, 25);
            this.getProductsCounted(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    checkArray(event) {
      if (event.target.checked) {
        this.products_for_accept = this.products_counted;
      } else {
        this.products_for_accept = [];
      }
    },
    acceptProducts(products) {
      this.$emit("setloading", true);
      let array = [];
      products.forEach((product, index) => {
        array.push({ id: product.id });
        if (index == products.length - 1) {
          changeControlProductQuantity(array)
            .then((Response) => {
              success().then(() => {
                this.getProductsCounted(0, 25);
              });
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      });
    },
  },
};
</script>
