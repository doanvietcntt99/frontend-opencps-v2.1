<template>
  <v-form ref="form" v-model="valid" lazy-validation class="px-3 py-2 grid-list">
    <v-layout v-if="detailForm !== null && detailForm.length > 0" row wrap>
      <v-flex v-for="(item, index) in detailForm" v-bind:key="index" :class="item['class']">
        <v-flex v-if="checkVisible(item, data)">
          <v-text-field :class="item['class_component']" v-if="item.type === 'date'"
            :value="item['valueFormData'] ? dataForm[item.model] : parseDate(data[item.model])"
            box
            style="pointer-events: none"
          >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
          </v-text-field>
          <attached-file-avatar v-if="item.type === 'avatar'" :pk="data[item.model]" :pick-item="item" :current-data="data"></attached-file-avatar>
          <!-- <datetime-picker :class="item['class_component']" v-if="item.type === 'date'" v-model="data[item.model]" :item="item" :data-value="data[item.model]"></datetime-picker> -->
          <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['link'] && ((item.dependency && String(id) !== '0') || !item.dependency)" :to="item.url + '?pk=' + data[item.pk] + '&col=' + item.pk">
            <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
            <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
            {{item.label}}
          </v-btn>
          <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['account'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAccount(item)">
            <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
            <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
            {{item.label}}
          </v-btn>
          <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['attached'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAttached(item)">
            <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
            <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
            {{item.label}}
          </v-btn>
          <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['fileform'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAttached(item)">
            <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
            <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
            {{item.label}}
          </v-btn>
          <content-placeholders v-if="item.type === 'selects' && !pullOk && item.hasOwnProperty('datasource_key')">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-combobox :class="item['class_component']" v-if="item.type === 'combobox' && pullOk && item.hasOwnProperty('datasource_key')"
            v-model="data[item.model]"
            :items="dataSocket[item['datasource_key']]"
            :item-text="item.itemText"
            :item-value="item.itemValue"
            box
            :label="item.required ? item['label'] + ' *': item['label']" 
            :rules="processRules(item.rules)"
            :no-data-text="'Không tìm thấy dữ liệu ' + item['label']"
            @change="processChangeDataSource($event, item)"
            :chips="item['chips']"
            :multiple="item['multiple']"
            clearable
          ></v-combobox>
          <v-autocomplete :class="item['class_component']" v-if="item.type === 'selects' && pullOk && item.hasOwnProperty('datasource_key')"
            v-model="data[item['model']]"
            :items="data[item['datasource_key']]"
            :item-text="item.itemText"
            :item-value="item.itemValue"
            box
            :rules="processRules(item.rules)"
            :no-data-text="'Không tìm thấy dữ liệu ' + item['label']"
            @change="processChangeDataSource($event, item)"
            :chips="item['chips']"
            :multiple="item['multiple']"
            :style="item['disable'] ? 'pointer-events: none' : ''"
          >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
          </v-autocomplete>
          <v-autocomplete :class="item['class_component']" v-if="item.type === 'selects' && !item.hasOwnProperty('datasource_key')"
            v-model="data[item.model]"
            :items="item.datasource"
            :item-text="item.itemText"
            :item-value="item.itemValue"
            box
            :rules="processRules(item.rules)"
            :no-data-text="'Không tìm thấy dữ liệu ' + item['label']"
            @change="processChangeDataSource($event, item)"
            :chips="item['chips']"
            :multiple="item['multiple']"
            clearable
          >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
          </v-autocomplete>
          <v-text-field :class="item['class_component']" v-if="item.type === 'text-fields'"
            :value="item['valueFormData'] ? dataForm[item.model] : data[item.model]"
            :rules="processRules(item.rules)"
            :placeholder="item['placeholder']"
            box
            style="pointer-events: none"
          >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
          </v-text-field>
          <v-textarea :class="item['class_component']" v-if="item.type === 'textarea'"
            :value="item['valueFormData'] ? dataForm[item.model] : data[item.model]"
            :rules="processRules(item.rules)"
            :placeholder="item['placeholder']"
            box 
            style="pointer-events: none"
            :rows="item['rows'] ? item['rows'] : 5"
          >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
          </v-textarea>
          <v-subheader class="px-0" v-if="item.type === 'codemirror'">{{item['label']}}</v-subheader>
          <codemirror v-if="item.type === 'codemirror'" v-model="data[item.model]" :options="cmOptions"></codemirror>
          <v-switch :class="item['class_component']" v-if="item.type === 'v-switch'"
            :label="item['label']" 
            v-model="data[item.model]"
          ></v-switch>
          <div v-if="item.hasOwnProperty('alongside')" v-for="(itemChild, indexChild) in item['alongside']" v-bind:key="indexChild">
            <attached-file-avatar :class="itemChild['class_component']" v-if="itemChild.type === 'avatar'" :pk="data[itemChild.model]" :pick-item="itemChild"></attached-file-avatar>
            <datetime-picker :class="itemChild['class_component']" v-if="itemChild.type === 'date'" v-model="data[itemChild.model]" :item="itemChild" :data-value="data[itemChild.model]"></datetime-picker>
            <v-btn :class="itemChild['class_component']" color="blue darken-3" dark v-if="itemChild.type === 'button' && itemChild['link'] && ((itemChild.dependency && String(id) !== '0') || !itemChild.dependency)" :to="itemChild.url + '?pk=' + data[itemChild.pk] + '&col=' + itemChild.pk">
              <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'link'">how_to_vote</v-icon>
              <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'popup'">flip_to_back</v-icon>
              {{itemChild.label}}
            </v-btn>
            <v-btn :class="itemChild['class_component']" color="blue darken-3" dark v-if="itemChild.type === 'button' && itemChild['account'] && ((itemChild.dependency && String(id) !== '0') || !itemChild.dependency)" v-on:click.native="showAccount(itemChild)">
              <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'link'">how_to_vote</v-icon>
              <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'popup'">flip_to_back</v-icon>
              {{itemChild.label}}
            </v-btn>
            <v-btn :class="itemChild['class_component']" color="blue darken-3" dark v-if="itemChild.type === 'button' && itemChild['attached'] && ((itemChild.dependency && String(id) !== '0') || !itemChild.dependency)" v-on:click.native="showAttached(itemChild)">
              <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'link'">how_to_vote</v-icon>
              <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'popup'">flip_to_back</v-icon>
              {{itemChild.label}}
            </v-btn>
            <content-placeholders v-if="itemChild.type === 'selects' && !pullOk && itemChild.hasOwnProperty('datasource_key')">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-autocomplete :class="itemChild['class_component']" v-if="itemChild.type === 'selects' && pullOk && itemChild.hasOwnProperty('datasource_key')"
              v-model="data[itemChild.model]"
              :items="dataSocket[itemChild['datasource_key']]"
              :item-text="itemChild.itemText"
              :item-value="itemChild.itemValue"
              box
              :label="itemChild.required ? itemChild['label'] + ' *': itemChild['label']" 
              :rules="processRules(itemChild.rules)"
              :no-data-text="'Không tìm thấy dữ liệu ' + itemChild['label']"
              @change="processChangeDataSource($event, itemChild)"
              :chips="item['chips']"
              :multiple="item['multiple']"
              clearable
            ></v-autocomplete>
            <v-autocomplete :class="itemChild['class_component']" v-if="itemChild.type === 'selects' && !itemChild.hasOwnProperty('datasource_key')"
              v-model="data[itemChild.model]"
              :items="itemChild.datasource"
              :item-text="itemChild.itemText"
              :item-value="itemChild.itemValue"
              box
              :label="itemChild.required ? itemChild['label'] + ' *': itemChild['label']" 
              :rules="processRules(itemChild.rules)"
              :no-data-text="'Không tìm thấy dữ liệu ' + itemChild['label']"
              @change="processChangeDataSource($event, itemChild)"
              :chips="item['chips']"
              :multiple="item['multiple']"
              clearable
            ></v-autocomplete>
            <v-text-field :class="itemChild['class_component']" v-if="itemChild.type === 'text-fields'"
              v-model="data[itemChild.model]"
              :label="itemChild.required ? itemChild['label'] + ' *': itemChild['label']" 
              :rules="processRules(itemChild.rules)"
              :placeholder="itemChild['placeholder']"
              box
            >
            </v-text-field>
            <v-textarea :class="itemChild['class_component']" v-if="itemChild.type === 'textarea'"
              v-model="data[itemChild.model]"
              :label="itemChild.required ? itemChild['label'] + ' *': itemChild['label']" 
              :rules="processRules(itemChild.rules)"
              :placeholder="itemChild['placeholder']"
              box
              clearable
            ></v-textarea>
            <v-subheader class="px-0" v-if="itemChild.type === 'codemirror'">{{itemChild['label']}}</v-subheader>
            <codemirror v-if="itemChild.type === 'codemirror'" v-model="data[itemChild.model]" :options="cmOptions"></codemirror>
            <v-switch :class="itemChild['class_component']" v-if="itemChild.type === 'v-switch'"
              :label="itemChild['label']" 
              v-model="data[itemChild.model]"
            ></v-switch>
          </div>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
  import DatetimePicker from './DatetimePicker.vue'
  import axios from 'axios'

  export default {
    props: ['id', 'datainput'],
    components: {
      DatetimePicker
    },
    data() {
      return {
        isCallBack: true,
        config: {},
        pullOk: true,
        pullCounter: 0,
        valid: true,
        loading: false,
        data: {},
        cmOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'base16-light',
          lineNumbers: true,
          line: true,
        },
        rules: {
          required: value => !!value || 'Bắt buộc phải nhập.',
          number: value => {
            const pattern = /^\d+$/
            return pattern.test(value) || 'Bắt buộc phải nhập kiểu số.'
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Sai định dạng thư điện tử.'
          }
        },
        dataForm: ''
      }
    },
    created () {
      let vm = this
      if (String(vm.id) !== '0') {
        vm.data = vm.datainput
        try {
          vm.dataForm = JSON.parse(vm.data['formData'])
        } catch (error) {
        }
      } else {
        vm.processDataSource()
      }
    },
    computed: {
      detailForm () {
        let detailDynamic = this.$store.getters.getContentFileSimple
        // console.log('detailDynamicSimple', detailDynamic)
        if (detailDynamic === '') {
          return []
        } else {
          return detailDynamic
        }
      },
      dataSocket: {
        // getter
        get: function() {
          return this.$store.getters.dataSocket
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setdataSocket', newValue)
        }
      },
      pullCounterOrg () {
        return this.$store.getters.pullCounter
      },
      activeBindFormData () {
        return this.$store.getters.getActiveBindFormData
      }
    },
    updated () {
      var vm = this
      vm.$nextTick(function () {
        if (vm.isCallBack) {
          vm.isCallBack = false
          vm.processDataSource()
          setTimeout(() => {
            if (String(vm.id) !== '0') {
              vm.data = vm.datainput
              try {
                vm.dataForm = JSON.parse(vm.data['formData'])
              } catch (error) {
              }
            }
            if (vm.pullCounterOrg === 0) {
              vm.pullOk = true
            }
            setTimeout(() => {
              vm.pullOk = true
            }, 1000)
          }, 500)
        }
      })
    },
    mounted () {
      let vm = this
      vm.processDataSource()
    },
    watch: {
      data: {
        handler (val) {
          // console.log('watch data', val)
          let vm = this
          vm.$store.commit('setChangeFormData', val)
          vm.$store.commit('setActiveBindFormData', !vm.activeBindFormData)
        },
        deep: true
      },
      datainput (val) {
        let vm = this
        // console.log('val DataInput', val)
        if (String(vm.id) !== '0') {
          vm.data = val
          try {
            vm.dataForm = JSON.parse(vm.data['formData'])
          } catch (error) {
          }
        }
      }
    },
    methods: {
      clearLoading () {
        this.loading = false
      },
      processRules (rulesStr) {
        return eval('( ' + rulesStr + ' )')
      },
      processChangeDataSource (data, item) {
        let vm = this
        if (item.hasOwnProperty('concatina')) {
          vm.pullOk = false
          vm.pullCounter = vm.pullCounter + 1
        }
      },
      processDataSourceVerify () {
        let vm = this
        for (let key in vm.detailForm) {
          if (vm.detailForm[key].hasOwnProperty('datasource_api') && vm.detailForm[key].hasOwnProperty('datasource_key')) {
            if (vm.data.hasOwnProperty(vm.detailForm[key]['model']) && String(vm.data[vm.detailForm[key]['model']]).startsWith("[")) {
              vm.data[vm.detailForm[key]['model']] = JSON.parse(vm.data[vm.detailForm[key]['model']])
            }
          }
          if (String(vm.id) === '0' && vm.detailForm[key]['model'] === 'subject') {
            vm.detailForm[key]['model'] = '  '
            setTimeout (function () {
              vm.detailForm[key]['model'] = 'subject'
            }, 200)
          }
        }
      },
      processDataSource () {
        let vm = this
        for (let key in vm.detailForm) {
          if (vm.detailForm[key].hasOwnProperty('datasource_api') && vm.detailForm[key].hasOwnProperty('datasource_key')) {
            // vm.pullOk = false
            vm.pullCounter = vm.pullCounter + 1
            // console.log('vm.pullCounter 1', vm.pullCounter)
            let apiURL = vm.detailForm[key]['datasource_api']
            if (vm.detailForm[key]['dependency'] && vm.detailForm[key].hasOwnProperty('pk')) {
              apiURL = apiURL + '?pk' + '=' + vm.id + '&col=' + vm.detailForm[key]['pk']
            }
            let param = {
              headers: {
                groupId: vm.getScopeGroupId()
              }
            }
            axios.get(apiURL, param).then(function (response) {
              let seriable = response.data
              if (seriable['data']) {
                vm.data[vm.detailForm[key]['datasource_key']] = seriable['data']
              } else {
                vm.data[vm.detailForm[key]['datasource_key']] = seriable
              }
              if (vm.detailForm[key]['value'] && String(vm.id) === '0') {
                vm.data[vm.detailForm[key]['model']] = vm.detailForm[key]['value']
              }
              vm.processDataSourceVerify()
            }).catch(function (xhr) {
            })
          }
        }
      },
      parseDate (arg) {
        if (arg) {
          let date = new Date(Number(arg))
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
        } else {
          return ''
        }
      },
      checkVisible (item, data) {
        if (item['visible']) {
          let visibleItems = String(item['visible']).split(',')
          return visibleItems.filter(function (i) {
            return i === data['deliverableType']
          }).length > 0
        } else {
          return true
        }
      }
    },
    filters: {
      parseDateFilter (arg) {
        if (arg) {
          let date = new Date(Number(arg))
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
        } else {
          return ''
        }
      }
    }
  }
</script>