<template>
  <v-app id="app_mapping_tracking" :style="!isMobile ? 'border: 1px solid #dedede;max-width:1300px;margin:0 auto' : 'max-width:1300px;margin:0 auto'">
    <v-content>
      <router-view></router-view>
    </v-content>
    <go-top v-if="isMobile" :size="42" bg-color="#0064c7"></go-top>
  </v-app>
</template>

<script>
  import axios from 'axios'
  import GoTop from '@inotom/vue-go-top'
  export default {
    data: () => ({
      active: null,
      activeAll: false,
      activeTab: 0,
      pathRouter: '/thu-tuc-hanh-chinh',
      currentAgency: '',
      currentAgencyTh: '',
      currentDomain: '',
      currentLevel: '',
      currentMethod: '',
      countAllService: 0,
      isDetail: false,
      text: '',
      menuServiceInfos: [
        {
          id: 1,
          name: 'Cơ quan quản lý',
          mappingName: 'administrationName',
          mappingCode: 'administrationCode',
          mappingCount: 'count',
          children: [],
          icon: 'account_balance'
        },
        {
          id: 2,
          name: 'Lĩnh vực',
          mappingName: 'domainName',
          mappingCode: 'domainCode',
          mappingCount: 'count',
          children: [],
          icon: 'domain'
        },
        {
          id: 3,
          name: 'Mức độ',
          mappingName: 'levelName',
          mappingCode: 'level',
          mappingCount: 'count',
          children: [],
          icon: 'sort'
        },
        {
          id: 4,
          name: 'Tất cả thủ tục',
          mappingName: 'all',
          mappingCode: 'all',
          mappingCount: 'count',
          children: [],
          icon: 'select_all'
        }
      ],
      hasCoQuanThucHien: false
    }),
    components: {
      GoTop
    },
    computed: {
      currentIndex () {
        return this.$store.getters.index
      },
      govAgencyList () {
        return this.$store.getters.getAgencyList
      },
      domainList () {
        return this.$store.getters.getDomainList
      },
      levelList () {
        return this.$store.getters.getLevelList
      },
      isMobile () {
        return this.$store.getters.getIsMobile
      }
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
      if (this.isMobile) {
        $('section#content').css('padding-left', '0px')
        $('.input-search input').css('margin-top', '5px')
        $('.input-search .v-input__slot').css('min-height', '36px')
        $('.input-search .v-input__append-inner').css('margin-top', '10px')
      }
    },
    beforeCreate() {
      console.log(this.message)
    },
    created () {
      var vm = this
      try {
        vm.hasCoQuanThucHien = hasCoQuanThucHien
      } catch (error) {
        vm.hasCoQuanThucHien = false
      }
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        if (vm.hasCoQuanThucHien) {
          vm.menuServiceInfos = [
            {
              id: 1,
              name: 'Cơ quan quản lý',
              mappingName: 'administrationName',
              mappingCode: 'administrationCode',
              mappingCount: 'count',
              children: [],
              icon: 'account_balance'
            },
            {
              id: 2,
              name: 'Cơ quan thực hiện',
              mappingName: 'govAgencyName',
              mappingCode: 'govAgencyCode',
              mappingCount: 'count',
              children: [],
              icon: 'fas fa fa-book'
            },
            {
              id: 3,
              name: 'Lĩnh vực',
              mappingName: 'domainName',
              mappingCode: 'domainCode',
              mappingCount: 'count',
              children: [],
              icon: 'domain'
            },
            {
              id: 4,
              name: 'Mức độ',
              mappingName: 'levelName',
              mappingCode: 'level',
              mappingCount: 'count',
              children: [],
              icon: 'sort'
            },
            {
              id: 5,
              name: 'Tất cả thủ tục',
              mappingName: 'all',
              mappingCode: 'all',
              mappingCount: 'count',
              children: [],
              icon: 'select_all'
            }
          ]
        }
        
        vm.$store.dispatch('getGovAgency').then(function (result) {
          vm.currentAgency = newQuery.hasOwnProperty('agency') ? newQuery.agency : ''
          vm.menuServiceInfos[0].children = result
          vm.$store.commit('setAgencyList', result)
          // console.log('run app',  current)
          if ((vm.govAgencyList.length > 0 && current.hasOwnProperty('name') && (current.name === 'Landing') && !newQuery.hasOwnProperty('agency')) ||
          (vm.govAgencyList.length > 0 && current.hasOwnProperty('name') && (current.name === 'NotFound') && !newQuery.hasOwnProperty('agency'))
          ) {
            vm.currentAgency = vm.govAgencyList[0].administrationCode
            let queryString = '?'
            newQuery['page'] = 1
            newQuery['agency'] = vm.govAgencyList[0].administrationCode
            for (let key in newQuery) {
              if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
                queryString += key + '=' + newQuery[key] + '&'
              }
            }
            let sortLevel = false
            try {
              if (sortLevelConfig !== undefined) {
                sortLevel = true
              }
            } catch (error) {
            }

            if (!sortLevel) {
              vm.$router.push({
                path: vm.pathRouter + queryString,
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
            } else {
              vm.$router.push({
                path: '/thu-tuc-hanh-chinh?page=1',
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
            }

          } else {
            vm.currentAgency = newQuery.hasOwnProperty('agency') ? newQuery.agency : ''
          }
        })
        // 
        if (vm.hasCoQuanThucHien) {
          vm.$store.dispatch('getGovAgencyThucHien').then(function (result) {
            vm.currentAgencyTh = newQuery.hasOwnProperty('agencyth') ? newQuery.agencyth : ''
            vm.menuServiceInfos[1].children = result
            vm.$store.commit('setAgencyListThucHien', result)
          }).catch(function(){})
        }
        // 
        let filterDomain = {
          agencyCode: ''
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          if (vm.hasCoQuanThucHien) {
            vm.menuServiceInfos[2].children = result
          } else {
            vm.menuServiceInfos[1].children = result
          }
          vm.$store.commit('setDomainList', result)
          vm.currentDomain = newQuery.hasOwnProperty('domain') ? newQuery.domain : ''
        })
        vm.$store.dispatch('getLevelList').then(function (result) {
          if (vm.hasCoQuanThucHien) {
            vm.menuServiceInfos[3].children = result
          } else {
            vm.menuServiceInfos[2].children = result
          }
          vm.$store.commit('setLevelList', result)
          vm.currentLevel = newQuery.hasOwnProperty('level') ? newQuery.level : ''
        })
        vm.currentMethod = newQuery.hasOwnProperty('level') && String(newQuery.level) === '2' ? 'MC' : newQuery.hasOwnProperty('level') && String(newQuery.level === '3,4') ? 'DVC' : ''
        vm.activeAll = newQuery.hasOwnProperty('all') && newQuery['all']
        vm.getCountAll()
        // 
        axios.get('/o/v1/opencps/users/' + window.themeDisplay.getUserId()).then(function(response) {
          let userData = response.data
          vm.$store.commit('setUserLogin', userData)
        })
        .catch(function(error) {
        })
      })
      // 
      
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        if (currentParams.hasOwnProperty('index') && currentParams['index']) {
          vm.isDetail = true
        } else {
          vm.isDetail = false
        }
        vm.currentAgency = currentQuery.hasOwnProperty('agency') ? currentQuery.agency : ''
        vm.currentAgencyTh = currentQuery.hasOwnProperty('agencyth') ? currentQuery.agencyth : ''
        vm.currentDomain = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
        vm.currentLevel = currentQuery.hasOwnProperty('level') ? currentQuery.level : ''
        vm.currentMethod = currentQuery.hasOwnProperty('level') && String(currentQuery.level) === '2' ? 'MC' : currentQuery.hasOwnProperty('level') && String(currentQuery.level === '3,4') ? 'DVC' : ''
        vm.activeAll = currentQuery.hasOwnProperty('all') && currentQuery['all']
      },
      levelList (list) {
        let vm = this
        let dossierMc = 0
        let dossierDvc = 0
        if (Array.isArray(list) && list.length > 0) {
          for (let index in list) {
            if (Number(list[index]['level']) > 2) {
              dossierDvc += Number(list[index]['count'])
            } else {
              dossierMc += Number(list[index]['count'])
            }
          }
          // vm.menuServiceInfos[3]['children'][0]['count'] = dossierMc
          // vm.menuServiceInfos[3]['children'][1]['count'] = dossierDvc
        }
      }
    },
    methods: {
      onResize () {
        let vm = this
        let isMobile = window.innerWidth < 1024
        vm.$store.commit('setIsMobile', isMobile)
      },
      filterAction (index, item1) {
        let vm = this
        if (!vm.hasCoQuanThucHien) {
          if (index === 0) {
            vm.filterAgency(item1)
          } else if (index === 1) {
            vm.filterDomain(item1)
          } else if (index === 2) {
            vm.filterLevel(item1)
          } else if (index === 3) {
            vm.filterMethod(item1)
          } else if (index === 5) {
            vm.filterAll()
          }
        } else {
          if (index === 0) {
            vm.filterAgency(item1)
          } else if (index === 1) {
            vm.filterAgencyThucHien(item1)
          } else if (index === 2) {
            vm.filterDomain(item1)
          } else if (index === 3) {
            vm.filterLevel(item1)
          } else if (index === 4) {
            vm.filterMethod(item1)
          } else if (index === 5) {
            vm.filterAll()
          }
        }
      },
      filterAgency (item) {
        var vm = this
        vm.currentAgency = item.administrationCode
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agency'] = item.administrationCode
        newQuery['agencyth'] = ''
        newQuery['domain'] = ''
        newQuery['level'] = ''
        newQuery['all'] = false
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterAgencyThucHien (item) {
        var vm = this
        vm.currentAgencyth = item.govAgencyCode
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agencyth'] = item.govAgencyCode
        newQuery['agency'] = ''
        newQuery['domain'] = ''
        newQuery['level'] = ''
        newQuery['all'] = false
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterDomain (item) {
        var vm = this
        vm.currentDomain = item.domainCode
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = item.domainCode
        newQuery['agency'] = ''
        newQuery['agencyth'] = ''
        newQuery['level'] = ''
        newQuery['all'] = false
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterLevel (item) {
        var vm = this
        vm.currentLevel = item.level
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = ''
        newQuery['agency'] = ''
        newQuery['agencyth'] = ''
        newQuery['all'] = false
        newQuery['level'] = item.level
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterMethod (item) {
        var vm = this
        vm.currentLevel = item.level
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = ''
        newQuery['agency'] = ''
        newQuery['agencyth'] = ''
        newQuery['all'] = false
        newQuery['level'] = item.level
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterAll () {
        var vm = this
        vm.activeAll = true
        vm.currentLevel = ''
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = ''
        newQuery['agency'] = ''
        newQuery['agencyth'] = ''
        newQuery['level'] = ''
        newQuery['all'] = true
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      getCountAll () {
        let vm = this
        let filter = {
          page: 1
        }
        vm.$store.dispatch('getServiceLists', filter).then(function (result) {
          if (result.data) {
            vm.countAllService = result.total
            console.log('countAllService', vm.countAllService)
          }
        }).catch(reject => {
        })
      },
      goBack () {
        window.history.back()
      }
    }
  }
</script>
<style>
  .service__info__menu .tabs__container {
    border-bottom: 1px solid #0072c0;
  }
</style>
