<template>
  <div>
    <v-layout justify-center>
      <v-flex xs12>
        <v-card flat class="px-2">
          <h3 class="text-xs-center py-2" style="color:#065694">ĐÁNH GIÁ CÁN BỘ</h3>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex
                v-for="employee in employeeItems"
                xs12 sm6 md4 lg3
                :key="employee.employeeId"
                class="px-2 py-2"
              >
                <v-card flat hover color="#1a571b21" @click="viewDetailEmployee(employee)" style="box-shadow: none;">
                  <v-card-text class="py-2 px-1" style="overflow:hidden">
                    <v-layout wrap>
                      <v-flex xs4 style="text-align: center!important;">
                        <div v-if="employee['imgSrc']" class="mt-1" :style="'background-image: url(' + employee['imgSrc'] + ');'" style="max-width: 100px;height: 150px;margin: 0 auto;background-position: center;background-size: cover;"></div>
                        <img v-else src="/o/opencps-store/js/cli/voting/app/img/contacts-icon.png" style="max-width: 100px;height: 150px;object-fit: contain;background: #ddd;opacity:0.6"/>
                      </v-flex>
                      <v-flex xs8 class="px-2" style="word-wrap: break-word;">
                        <div class="primary--text">{{employee.jobPosTitle}}</div>
                        <div class="text-bold primary--text mb-2">{{employee.fullName}}</div>
                        <div>{{employee.workingUnitName}}</div>
                        <div >Email: {{employee.email}}</div>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                  <v-divider light class="my-0"></v-divider>
                  <div class="py-2">
                    <!-- <v-layout wrap class="px-3">
                      <v-flex class="pt-2" style='max-width:100px'>
                        <span class="text-bold">Đánh giá:</span>
                      </v-flex>
                      <v-flex>
                        <star-rating read-only :rating="employee['score'] ? employee['score'] : 0" :increment="0.1" :max-rating="5" :show-rating="false" :star-size="30"></star-rating>
                      </v-flex>
                    </v-layout> -->
                    <v-layout wrap class="px-3">
                      <v-flex style='max-width:100px'>
                        <span class="text-bold">Kết quả:</span>
                      </v-flex>
                      <v-flex>
                        <span class="text-bold primary--text">{{employee['totalVoting'] ?employee['totalVoting'] : 0}} lượt đánh giá</span>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <div v-if="totalEmployee > numberPerPage" class="text-xs-center pt-2 pb-3" style="width: 100%; max-width:350px; margin: 0 auto">
            <v-pagination
              @input="changePage"
              v-model="employeePage"
              :length="lengthPage"
              circle
            ></v-pagination>
          </div>
          <div v-if="!totalEmployee">
            <v-alert class="mt-4 mx-3" :value="true" outline color="blue" icon="priority_high">
              Không có danh sách cán bộ
            </v-alert>
          </div>
          <v-flex xs12 sm12 class="text-xs-right mb-3">
            <v-btn @click="goBack" color="primary">
              <v-icon size="16">reply</v-icon>&nbsp;
              Quay lại 
            </v-btn>
          </v-flex>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import Vue from 'vue'
import toastr from 'toastr'
import Captcha from './Captcha.vue'
import StarRating from 'vue-star-rating'
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['itemCode'],
  components: {
    StarRating,
    'captcha': Captcha,
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    govAgencyName: {},
    itemName: '',
    employeeItems: [],
    btnLoading: false,
    dialog_voting: false,
    dialog_voting_result: false,
    dialogShowApplicantIdNo: false,
    applicantIdNo: '',
    dossierNo: '',
    employeeSelected: '',
    votingItems: [],
    lengthPage: 0,
    totalEmployee: 0,
    employeePage: 1,
    numberPerPage: 12,
    isDVC: false,
    currentSite: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    let vm = this
    try {
      if (isDVC) {
        vm.isDVC = isDVC
      }
    } catch (error) {
    }
    try {
      vm.currentSite = currentSite
    } catch (error) {
    }
    let currentQuery = vm.$router.history.current.query
    vm.employeePage = currentQuery.hasOwnProperty('page') ? Number(currentQuery.page) : 1
    vm.getEmployee()
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      vm.getEmployee()
    }
  },
  methods: {
    getEmployee () {
      let vm = this
      let sortEmployee = function (employeeList) {
        function compare(a, b) {
          if (a.employeeNo < b.employeeNo)
            return -1
          if (a.employeeNo > b.employeeNo)
            return 1
          return 0
        }
        return employeeList.sort(compare)
      }
      let filter = {
        start: vm.employeePage * vm.numberPerPage - vm.numberPerPage,
        end: vm.employeePage * vm.numberPerPage,
        itemCode: vm.itemCode
      }
      if (vm.isDVC) {
        vm.$store.dispatch('loadEmployeesMotcua', filter).then(result => {
          vm.totalEmployee = result[0]
          vm.employeeItems = sortEmployee(result[1])
          vm.lengthPage = Math.ceil(result[0] / vm.numberPerPage)

          if (vm.employeeItems && vm.employeeItems.length > 0) {
            for (let key in vm.employeeItems) {
              vm.getAvatar(vm.employeeItems[key], key)
              vm.getVotingEmployee(vm.employeeItems[key], key)
            }
          }
        }).catch(xhr => {
          vm.totalThuTuc = 0
          vm.thutucPage = 1
        })
      } else {
        if (vm.currentSite) {
          vm.$store.dispatch('loadEmployees', filter).then(result => {
            vm.totalEmployee = result[0]
            vm.employeeItems = sortEmployee(result[1])
            vm.lengthPage = Math.ceil(result[0] / vm.numberPerPage)

            vm.employeeItems = vm.employeeItems.slice(filter.start, filter.end)
            if (vm.employeeItems && vm.employeeItems.length > 0) {
              for (let key in vm.employeeItems) {
                // vm.getAvatar(vm.employeeItems[key], key)
                vm.getVotingEmployee(vm.employeeItems[key], key)
              }
            }
          }).catch(xhr => {
            vm.totalThuTuc = 0
            vm.thutucPage = 1
          })
        } else {
          vm.$store.dispatch('loadEmployeesProxy', filter).then(result => {
            vm.totalEmployee = result[0]
            vm.employeeItems = sortEmployee(result[1])
            vm.lengthPage = Math.ceil(result[0] / vm.numberPerPage)

            vm.employeeItems = vm.employeeItems.slice(filter.start, filter.end)
            if (vm.employeeItems && vm.employeeItems.length > 0) {
              for (let key in vm.employeeItems) {
                // vm.getAvatar(vm.employeeItems[key], key)
                vm.getVotingEmployee(vm.employeeItems[key], key)
              }
            }
          }).catch(xhr => {
            vm.totalThuTuc = 0
            vm.thutucPage = 1
          })
        }
        
      }
      
    },
    getAvatar (item, key) {
      let vm = this
      let filter = {
        employeeId: item.employeeId,
        itemCode: vm.itemCode
      }
      if (vm.isDVC) {
        vm.$store.dispatch('loadImageEmployee', filter).then(function (data) {
          if (data !== '' && data !== null) {
            let portalURL = ''
            if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
              portalURL = window.themeDisplay.getPortalURL()
            }
            vm.employeeItems[key]['imgSrc'] = portalURL + data
          }
        }).catch(function (data) {
          vm.employeeItems[key]['imgSrc'] = ''
        })
      } else {
        vm.$store.dispatch('loadImageEmployeeProxy', filter).then(function (data) {
          if (data !== '' && data !== null) {
            let portalURL = ''
            if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
              portalURL = window.themeDisplay.getPortalURL()
            }
            vm.employeeItems[key]['imgSrc'] = portalURL + data
          }
        }).catch(function (data) {
          vm.employeeItems[key]['imgSrc'] = ''
        })
      }
      
    },
    viewDetailEmployee (item) {
      var vm = this
      vm.$store.commit('setEmployeeSelected', item)
      vm.$router.push({
        path: '/danh-sach-can-bo/' + item.employeeId,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
          itemCode: vm.itemCode
        }
      })
    },
    getVotingEmployee (item, key) {
      let vm = this
      if (vm.isDVC) {
        vm.$store.dispatch('loadVoting', {
          className: 'employee',
          classPk: item.employeeId
        }).then(result => {
          let votingItems = result.data
          let votingCount = result.hasOwnProperty('votingCount') ? result.votingCount : 0
          vm.getScoreVoting(votingItems, key, votingCount)
        }).catch(xhr => {
        })
      } else {
        if (vm.currentSite) {
          vm.$store.dispatch('loadVoting', {
            className: 'employee',
            classPk: item.employeeId,
            itemCode: vm.itemCode
          }).then(result => {
            let votingItems = result.data
            let votingCount = result.hasOwnProperty('votingCount') ? result.votingCount : 0
            vm.getScoreVoting(votingItems, key, votingCount)
          }).catch(xhr => {
          })
        } else {
          vm.$store.dispatch('loadVotingMotcua', {
            className: 'employee',
            classPk: item.employeeId,
            itemCode: vm.itemCode
          }).then(result => {
            let votingItems = result.data
            let votingCount = result.hasOwnProperty('votingCount') ? result.votingCount : 0
            vm.getScoreVoting(votingItems, key, votingCount)
          }).catch(xhr => {
          })
        }
        
      }
      
    },
    getScoreVoting (votingItems, key, votingCount) {
      let vm = this
      if (votingItems && votingItems.length > 0) {
        let totalVoting = 0
        let totalScore = 0
        let lengthQuestion = votingItems.length
        let lengthAnswer = votingItems[0]['answers'].length
        for (var i = 0; i < lengthQuestion; i++) {
          totalVoting += votingItems[i]['answersCount']
          for (var j = 0; j < lengthAnswer; j++) {
            totalScore += votingItems[i]['answers'][j] * (lengthAnswer - j)
          }
        }
        if (totalVoting > 0) {
          vm.employeeItems[key]['score'] = Number(((totalScore * 5) / (totalVoting * lengthAnswer)).toFixed(1))
          // vm.employeeItems[key]['totalVoting'] = Number(totalVoting)
        }
        vm.employeeItems[key]['totalVoting'] = votingCount
      }
    },
    changePage () {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + vm.employeePage
      vm.$router.push({
        path: current.path + queryString
      })
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
