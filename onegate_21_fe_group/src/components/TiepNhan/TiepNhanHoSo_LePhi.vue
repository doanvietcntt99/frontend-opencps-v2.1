<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 sm2>
          <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          <v-subheader v-else class="pl-0 text-right">Tổng tiền: </v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-text-field
            v-else
            v-model.lazy="lePhi.paymentFee"
            v-money="money"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6>

        </v-flex>
        <!-- <v-flex xs12 sm6 class="pl-4 pt-2 hidden-xs-and-down">Hạn mức: {{lePhi.request|currency}} đ</v-flex> -->
        <v-flex xs12 sm12>
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-textarea
            v-else
            v-model="lePhi.paymentNote"
            box
            label="Ghi chú ..."
            rows="2"
          ></v-textarea>
          <!-- <span v-else>{{lePhi.paymentNote}}</span> -->
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
// import * as utils from '../store/onegate_utils'
import {VMoney} from 'v-money'
export default {
  data: () => ({
    money: {
      decimal: '',
      thousands: '.',
      prefix: '',
      suffix: '',
      precision: 0,
      masked: false
    },
    lePhi: {
    }
  }),
  directives: {money: VMoney},
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    clearTotalMoney () {
      var vm = this
      console.log(vm.lePhi.fee)
    },
    initData (data) {
      var vm = this
      vm.lePhi = data
    }
  },
  filters: {
    currency (val) {
      // return utils.currency(val)
    }
  }
}
</script>
