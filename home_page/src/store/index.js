import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
// 

Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    endPoint: '/o/rest/v2',
    // endPoint: 'http://127.0.0.1:8081/api',
    initData: support.initData,
    totalEmployee: 0,
    filterDossierKey: {
      dossierNo: '',
      applicantIdNo: '',
      secretCode: ''
    },
    workingUnitSelect: null,
    loading: false,
    dossierDetail: {},
    index: 0,
    activeDetailService: false,
    applicantIdNoSearch: '',
    dossierNoSearch: '',
    fullScreen: false,
    drawer: false,
    ism: false
  },
  actions: {
    loadInitResource ({commit, state}) {
      return new Promise((resolve, reject) => {
        if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
          state.initData['groupId'] = window.themeDisplay.getScopeGroupId()
          state.initData['user'] = {
            'userName': window.themeDisplay.getUserName(),
            'userEmail': '',
            'userId': window.themeDisplay.getUserId()
          }
        } else {
          state.initData['groupId'] = 0
          state.initData['user'] = {
            'userName': '',
            'userEmail': '',
            'userId': 20103
          }
        }
        resolve(state.initData)
      })
    },
    getAgencyReportLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            },
            params: {
              year: filter.year,
              month: filter.month,
              group: filter.group,
              agency: filter['agency']
            }
          }
          if (filter['report']) {
            param.params['domain'] = 'total'
          }
          if (filter['report'] === 'linemonth') {
            param.params['domain'] = ''
          }
          axios.get('/o/rest/statistics', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve(null)
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getAgencyReportLists6 ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            }
          }
          let promises = []
          let currentMonth = (new Date()).getMonth() + 1
          for (let i = 0; i < 6; i++) {
            let qMonth = currentMonth - i
            let qYear = (new Date()).getFullYear()
            if (qMonth <= 0) {
              qMonth = qMonth + 12
              qYear = qYear - 1
            }
            console.log('currentMonth', currentMonth)
            console.log('qMonth', qMonth)
            let requestURL = '/o/rest/statistics?agency=total&domain=total&year=' + qYear + '&month=' + qMonth
            console.log('requestURL', requestURL)
            promises.push(axios.get(requestURL, param))
          }
          axios.all(promises)
          .then(axios.spread((...args) => {
            let myObject = []
            for (let i = 0; i < args.length; i++) {
              if (args[i]['data']['total'] > 0) {
                myObject = myObject.concat(args[i]['data']['data'])
              }
            }
            if (myObject.length > 0) {
              resolve(myObject)
            } else {
              resolve(null)
            }
          }))
        })
      })
    },
    getAgencyReportListsHomePage ({commit, state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            }
          }
          axios.get('o/rest/statistics?year=' + (new Date()).getFullYear() + '&domain=total&agency=total&month=0', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data[0]
              resolve(dataReturn)
            } else {
              resolve(null)
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    goSignIn ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          axios
          .post(
            "/o/v1/opencps/login",
            {},
            {
              headers: {
                Authorization:
                  "BASIC " + window.btoa(filter.applicantName + ':' + filter.password)
              }
            }
          )
          .then(function(response) {
            if (
              response.data !== "" &&
              response.data !== "ok" &&
              response.data !== "captcha"
            ) {
              if (response.data === "pending") {
                window.location.href =
                  window.themeDisplay.getURLHome() +
                  "/register#/xac-thuc-tai-khoan?active_user_id=" +
                  window.themeDisplay.getUserId() +
                  "&redirectURL=" +
                  window.themeDisplay.getURLHome();
              } else {
                window.location.href = response.data;
              }
            } else if (response.data === "ok") {
              window.location.href = window.themeDisplay.getURLHome();
            } else if (response.data === "captcha") {
              let redirectURL = themeDisplay
                .getLayoutRelativeURL()
                .substring(
                  0,
                  themeDisplay.getLayoutRelativeURL().lastIndexOf("/")
                );
              if (redirectURL !== "") {
                window.location.href = redirectURL + "/register#/login";
              } else {
                window.location.href =
                  themeDisplay.getURLHome() + "/register#/login";
              }
            } else {
              toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.");
            }
          })
          .catch(function(error) {
            toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.");
          })
        })
      })
    },
    loadingDataHoSo ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 10 - 10,
              end: filter.page * 10,
              dossierNo: filter.dossierNo ? filter.dossierNo : '',
              applicantIdNo: filter.applicantIdNo ? filter.applicantIdNo : ''
            }
          }
          axios.get(state.endPoint + '/dossiers', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadingDataHoSoKQ ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              step: '300,310,400',
              fromReleaseDate: filter.fromDate,
              toReleaseDate: filter.toDate
            }
          }
          // test local
          axios.get(state.endPoint + '/dossiers/publish/searchDossiers', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/dossiers', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getDomainLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/serviceinfos/statistics/domains', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getDomainListsPublic ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 10 - 10,
              end: filter.page * 10
            }
          }
          // test local
          axios.get(state.endPoint + '/serviceconfigs/pubish/' + filter.administrationCode + '/domains', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/domains', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getGovAgency ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/serviceinfos/statistics/agencies', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
          })
        })
      })
    },
    getGovAgencyDictItem ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/dictcollections/GOVERNMENT_AGENCY/dictitems', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
          })
        })
      })
    },
    getLevelLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/serviceinfos/statistics/levels', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 10 - 10,
              end: filter.page * 10,
              administration: filter.administration ? filter.administration : '',
              keyword: filter.keyword ? filter.keyword : '',
              level: filter.level ? filter.level : 0,
              domain: filter.domain ? filter.domain : ''
            }
          }
          axios.get(state.endPoint + '/serviceinfos', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/serviceinfos/' + filter.index, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getDossierDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/dossiers/' + filter.dossierId, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getDossierDetailPass ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          // test local
          let param = {
            headers: {
              groupId: state.initData.groupId,
              secretCode: filter.password
            },
            params: {}
          }
          axios.get(state.endPoint + '/dossiers/' + filter.dossierId, param).then(function (response) {
            let serializable = response.data
            console.log('response', response)
            resolve(response)
          }).catch(function (error) {
            console.log('error', error)
            reject(error)
          })
        })
      })
    },
    getDetailDossierQR ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              secretKey: filter.secretKey
            }
          }
          axios.get(state.endPoint + '/dossiers/' + filter.dossierId, param).then(function (response) {
            let serializable = response.data
            console.log('response', response)
            resolve(response)
          }).catch(function (error) {
            console.log('error', error)
            reject(error)
          })
        })
      })
    },
    getListHistoryProcessingItems ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          var listHistoryProcessing = []
          axios.get(state.endPoint + '/dossierlogs/' + filter.dossierId + '/logs', param).then(function (response) {
            var serializable = response.data
            for (var key in serializable.data) {
              if (serializable.data[key].notificationType === 'PROCESS_TYPE') {
                listHistoryProcessing.push(serializable.data[key])
              }
            }
            resolve(listHistoryProcessing)
          })
          .catch(function (error) {
            reject(error)
          })
        })
      })
    },
    loadDossierActions ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/dossiers/' + data.dossierId + '/sequences', config).then(function (response) {
            resolve(response.data)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    loadDossierTemplates ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/dossiertemplates/' + filter.dossierTemplateNo, param).then(function (response) {
            let serializable = response.data
            resolve(serializable.dossierParts)
          }).catch(function (reject) {
            console.log(reject)
          })
        })
      })
    },
    // voting
    loadVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/postal/votings/' + data.className + '/' + data.classPK, param).then(result => {
            if (result.data) {
              resolve(result.data.data)
            } else {
              resolve([])
            }
            commit('setLoading', false)
          }).catch(xhr => {
            reject(xhr)
            commit('setLoading', false)
          })
        })
      })
    },
    submitVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          var params = new URLSearchParams()
          const config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          params.append('className', data.className)
          params.append('classPk', data.classPk)
          params.append('selected', data.selected)
          if (data.className === 'dossier') {
            params.append('votingCode', data.votingCode ? data.votingCode : '')
          }
          axios.post(state.endPoint + '/postal/votings/' + data.votingId + '/results', params, config).then(result => {
            resolve(result.data)
          }).catch(xhr => {
            toastr.error('Gửi đánh giá thất bại')
            reject(xhr)
          })
        })
      })
    },
    checkPermisionVoting ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          const config = {
            headers: {
              'groupId': state.initData.groupId
            },
            params: {
              applicantIdNo: filter.applicantIdNo,
              dossierNo: filter.dossierNo
            }
          }
          axios.get(state.endPoint + '/votings/checkpermission', config).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    }
  },
  mutations: {
    setIndex (state, payload) {
      state.index = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    setDossierDetail (state, payload) {
      state.dossierDetail = payload
    },
    setFilterDossierKey (state, payload) {
      state.filterDossierKey = {
        dossierNo: payload.dossierNo ? payload.dossierNo : '',
        applicantIdNo: payload.applicantIdNo ? payload.applicantIdNo : '',
        secretCode: payload.secretCode ? payload.secretCode : ''
      }
    },
    setTotalEmployee (state, payload) {
      state.totalEmployee = payload
    },
    setWorkingUnitSelect (state, payload) {
      state.workingUnitSelect = payload
    },
    setActiveDetailService (state, payload) {
      state.activeDetailService = payload
    },
    setActiveDetailDossier (state, payload) {
      state.activeDetailDossier = payload
    },
    setApplicantIdNoSearch (state, payload) {
      state.applicantIdNoSearch = payload
    },
    setDossierNoSearch (state, payload) {
      state.dossierNoSearch = payload
    },
    setdrawer (state, payload) {
      state.drawer = payload
    },
    setism (state, payload) {
      state.ism = payload
    }
  },
  getters: {
    index (state) {
      return state.index
    },
    getTotalEmployee (state) {
      return state.totalEmployee
    },
    getDetailDossier (state) {
      return state.dossierDetail
    },
    getFilterDossierKey (state) {
      return state.filterDossierKey
    },
    getActiveDetailService (state) {
      return state.activeDetailService
    },
    getApplicantIdNoSearch (state) {
      return state.applicantIdNoSearch
    },
    getDossierNoSearch (state) {
      return state.dossierNoSearch
    },
    getdrawer (state) {
      return state.drawer
    },
    getism (state) {
      return state.ism
    }
  }
})
