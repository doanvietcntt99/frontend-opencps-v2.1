<template>
  <v-layout row wrap>
    <v-flex xs12 class="py-2" style="
      display: flex;
      align-items: center;
      background: #dedede;
      justify-content: center;
    ">
      <img :src="chapchablob" alt="capcha" style="border-radius: 5px">
      <v-btn class="right ml-3 mx-0 my-0" title="refresh" flat icon v-on:click.native="makeImageCap">
        <v-icon color="primary" size="32">refresh</v-icon>
      </v-btn>
    </v-flex>
    <v-flex xs12 class="mt-2">
      <v-text-field
        box
        v-model="j_captcha_response"
        placeholder="Nhập mã captcha"
        :rules="[v => !!v || 'Vui lòng nhập mã captcha']"
        required
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
export default {
  props: ['index'],
  components: {
  },
  data: () => ({
    j_captcha_response: '',
    chapchablob: '',
    options: {},
    arrCaptcha: [],
    captcha: '',
    currentlyDragging: null,
    loggedEvent: '',
    images: [{name: 'Image 1', src: 'http://placehold.it/100/000000/ffffff'},
    {name: 'Image 2', src: 'http://placehold.it/100/C93742/ffffff'},
    {name: 'Image 3', src: 'http://placehold.it/100/6894D1/ffffff'}
    ]
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    vm.makeImageCap()
  },
  watch: {
  },
  methods: {
    makeImageCap () {
      var vm = this
      vm.chapchablob = ''
      vm.$store.dispatch('makeImageCap').then(function (result) {
        vm.chapchablob = result
      }).catch(function (reject) {
        vm.chapchablob = ''
      })
    },
    makeRandomString () {
      var vm = this
      var text = ''
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      if (text) {
        vm.arrCaptcha = vm.shuffleArrCaptcha(text.split(''))
      }
      vm.captcha = text
    },
    shuffleArrCaptcha (arra1) {
      var ctr = arra1.length
      var temp = null
      var index = 0
      while (ctr > 0) {
        index = Math.floor(Math.random() * ctr)
        ctr--
        temp = arra1[ctr]
        arra1[ctr] = arra1[index]
        arra1[index] = temp
      }
      return arra1
    },
    checkValidCaptcha () {
      var vm = this
      var str = ''
      let items = $('#captcha').children()
      console.log(items)
      for (var i = 0; i < items.length; i++) {
        str += items[i].innerHTML
      }
      if (vm.captcha === str) {
        return true
      } else {
        return false
      }
    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
      } else {
        return ''
      }
    }
  }
}
</script>
<style>
  ul#captcha li {
    display:inline;
  }
  ul#captcha li:focus {
    outline:none;
    box-shadow:0 0 0 2px #68b, inset 0 0 0 1px #ddd;
  }
  ul#captcha li:hover {
    box-shadow:0 0 0 2px #68b, inset 0 0 0 1px #ddd;
    cursor: pointer
  }
</style>
