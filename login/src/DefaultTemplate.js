export const templateDefault = {
    template: `
        <div @click="doReadEvent(item['eventId'])" style="display: flex;cursor: pointer;">
            <div class="v-avatar white--text" style="height: 36px;width: 36px;margin-right: 8px;margin-top: 3px;">
                <img :src="item['avatar']" :alt="item['userName']">
            </div>
            <p style="margin-bottom: 0px;">
                <strong>{{item["userName"]}}</strong> {{item["title"]}}
                <a href="javascript:;" style="
                    color: #0072c2;
                    font-weight: bold;
                    border-bottom: 1px dotted;
                ">
                    {{dossier["dossierNo"]}}
                </a>
                <br/>
                <span style="color: rgb(90, 90, 90) !important;font-size: 11px;">
                    <i aria-hidden="true" class="v-icon material-icons theme--light" style="font-size: 15px; color: rgb(0, 114, 194);">event</i>
                        {{new Date(item["notificationDate"]).toLocaleString('vi-VN')}}
                </span>
            </p>
        </div>
    `,
    data: () => ({
        item: {},
        dossier: {}
    }),
    created: function() {
        let vm = this
        if (vm.$parent.item !== undefined && vm.$parent.item !== null) {
            vm.item = vm.$parent.item
            if (vm.item.hasOwnProperty('data')) {
                let dataObject = eval(' ( ' + vm.item['data'] + ' ) ')
                vm.dossier = dataObject['Dossier']
            }
        }
    },
    methods: {
        doReadEvent (eventId) {
            let vm = this
            /*
            axios
            .get('o/rest/v2/dossiers/' + vm.dossier['referenceUid'] + '/urlSiteInfo')
            .then(function(response) {
              let data = response.data;
              let configOBJ = {
                eventId: eventId,
                viewRootURI: data['url'],
                dossierId: data['dossierId'],
                originality: dossier['originality']
              }
              vm.$parent.markReadEventId(configOBJ)
            })
            .catch(function(error) {
              vm.avatarURL = "";
            });
            */
            vm.$parent.markReadEventId(eventId, vm.item['viewRootURI'], vm.dossier['dossierId'], vm.dossier['originality'])
        }
    }
}
export const testData = [
    {  
        "guestUrl":"",
        "data":"{\"Dossier\":{\"dossierTemplateNo\":\"MAU_SNGV_LSVK01\",\"cachedModel\":true,\"originality\":3,\"originalReferenceUid\":\"8f30c78e-a6ce-4a2f-bb22-ba5cb5282110\",\"delegateWardCode\":\"07897\",\"dossierStatus\":\"new\",\"dossierRegister\":\"\",\"durationCount\":7,\"referenceUid\":\"8f30c78e-a6ce-4a2f-bb22-ba5cb5282110\",\"sampleCount\":\"1\",\"applicantNote\":\"\",\"dossierSubStatus\":\"new_0\",\"password\":\"4656\",\"dossierNo\":\"09.H44.181214.00108\",\"govAgencyCode\":\"SNGV\",\"originalDossierActionId\":\"37801\",\"originalGovAgencyCode\":\"SNGV\",\"originalOriginality\":3,\"dossierNote\":\"\",\"finderCacheEnabled\":true,\"modelClass\":\"org.opencps.dossiermgt.model.Dossier\",\"endorsementDate\":null,\"originDossierId\":\"0\",\"processNo\":\"QT_SNGV_LSVK01\",\"dossierActionId\":\"37801\",\"wardName\":\"Phường Tân Dân\",\"correcttingDate\":null,\"postalTelNo\":\"\",\"originalServiceCode\":\"SNGV_LSVK01\",\"userUuid\":\"3071a2f7-3926-e6ca-dafa-676f91a70706\",\"postalDistrictName\":\"\",\"submitting\":false,\"originalUuid\":\"1577ffc9-a398-c144-4dc0-e9db730fb338\",\"serviceCode\":\"SNGV_LSVK01\",\"modelClassName\":\"org.opencps.dossiermgt.model.Dossier\",\"delegateEmail\":\"\",\"serverNo\":\"SERVER_DVC\",\"applicantIdNo\":\"131487417\",\"createDate\":1544782856576,\"originalViaPostal\":0,\"address\":\"\",\"registerBookName\":\"\",\"districtName\":\"Thành phố Việt Trì\",\"delegateCityName\":\"Tỉnh Phú Thọ\",\"entityCacheEnabled\":true,\"userId\":\"240262\",\"originalCompanyId\":\"20099\",\"escapedModel\":false,\"originalOriginDossierId\":\"0\",\"delegateDistrictName\":\"Thành phố Việt Trì\",\"contactTelNo\":\"0947006999\",\"delegateIdNo\":\"131487417\",\"applicantIdType\":\"citizen\",\"originalDossierStatus\":\"new\",\"finishDate\":null,\"dossierStatusText\":\"Hồ sơ mới nhận\",\"dossierSubStatusText\":\"Chờ bàn giao thụ lý\",\"viaPostal\":0,\"columnBitmask\":\"0\",\"dueDate\":1545733258736,\"govAgencyName\":\"Sở Ngoại vụ\",\"groupId\":\"53365\",\"dossierTemplateName\":\"Cấp visa, gia hạn visa.\",\"registerBookCode\":\"\",\"originalDossierId\":\"23601\",\"originDossierNo\":\"\",\"uuid\":\"1577ffc9-a398-c144-4dc0-e9db730fb338\",\"briefNote\":\"\",\"notification\":false,\"postalWardCode\":\"\",\"postalCityName\":\"\",\"originalUserId\":\"240262\",\"durationUnit\":0,\"wardCode\":\"07897\",\"new\":false,\"originalApplicantIdNo\":\"131487417\",\"contactName\":\"\",\"delegateName\":\"VI TRƯỜNG SƠN\",\"delegateTelNo\":\"0947006999\",\"receiveDate\":1544782858736,\"extendDate\":null,\"applicantName\":\"VI TRƯỜNG SƠN\",\"folderId\":\"0\",\"dossierName\":\"Cấp visa, gia hạn visa\",\"companyId\":\"20099\",\"postalAddress\":\"\",\"processDate\":null,\"modifiedDate\":1544782867802,\"postalServiceName\":\"\",\"dossierId\":\"23601\",\"delegateAddress\":\"\",\"districtCode\":\"227\",\"originalDossierTemplateNo\":\"MAU_SNGV_LSVK01\",\"cityCode\":\"25\",\"submitDate\":null,\"cancellingDate\":null,\"stagedModelType\":{\"classSimpleName\":\"Dossier\",\"referrerClassNameId\":\"0\",\"referrerClassName\":null,\"className\":\"org.opencps.dossiermgt.model.Dossier\",\"classNameId\":\"34906\"},\"lockState\":\"\",\"applicantIdDate\":null,\"delegateCityCode\":\"25\",\"cityName\":\"Tỉnh Phú Thọ\",\"postalServiceCode\":\"\",\"original\":false,\"contactEmail\":\"\",\"originalDossierNo\":\"09.H44.181214.00108\",\"releaseDate\":null,\"postalDistrictCode\":\"\",\"delegateDistrictCode\":\"227\",\"counter\":96,\"delegateWardName\":\"Phường Tân Dân\",\"serviceName\":\"Cấp visa, gia hạn visa\",\"userName\":\"Lê Phương Thảo\",\"postalCityCode\":\"\",\"primaryKeyObj\":\"23601\",\"originalGroupId\":\"53365\",\"postalWardName\":\"\",\"online\":false,\"primaryKey\":\"23601\"}}",
        "notificationText":"Thông báo tiếp nhận hồ sơ",
        "notifyMessage":"",
        "title":"Thông báo tiếp nhận hồ sơ",
        "userId":"0",
        "userUrl":""
    },
    {  
        "guestUrl":"",
        "data":"{\"Dossier\":{\"dossierTemplateNo\":\"MAU_SNGV_LSVK01\",\"cachedModel\":true,\"originality\":3,\"originalReferenceUid\":\"8f30c78e-a6ce-4a2f-bb22-ba5cb5282110\",\"delegateWardCode\":\"07897\",\"dossierStatus\":\"new\",\"dossierRegister\":\"\",\"durationCount\":7,\"referenceUid\":\"8f30c78e-a6ce-4a2f-bb22-ba5cb5282110\",\"sampleCount\":\"1\",\"applicantNote\":\"\",\"dossierSubStatus\":\"new_0\",\"password\":\"4656\",\"dossierNo\":\"09.H44.181214.00108\",\"govAgencyCode\":\"SNGV\",\"originalDossierActionId\":\"37801\",\"originalGovAgencyCode\":\"SNGV\",\"originalOriginality\":3,\"dossierNote\":\"\",\"finderCacheEnabled\":true,\"modelClass\":\"org.opencps.dossiermgt.model.Dossier\",\"endorsementDate\":null,\"originDossierId\":\"0\",\"processNo\":\"QT_SNGV_LSVK01\",\"dossierActionId\":\"37801\",\"wardName\":\"Phường Tân Dân\",\"correcttingDate\":null,\"postalTelNo\":\"\",\"originalServiceCode\":\"SNGV_LSVK01\",\"userUuid\":\"3071a2f7-3926-e6ca-dafa-676f91a70706\",\"postalDistrictName\":\"\",\"submitting\":false,\"originalUuid\":\"1577ffc9-a398-c144-4dc0-e9db730fb338\",\"serviceCode\":\"SNGV_LSVK01\",\"modelClassName\":\"org.opencps.dossiermgt.model.Dossier\",\"delegateEmail\":\"\",\"serverNo\":\"SERVER_DVC\",\"applicantIdNo\":\"131487417\",\"createDate\":1544782856576,\"originalViaPostal\":0,\"address\":\"\",\"registerBookName\":\"\",\"districtName\":\"Thành phố Việt Trì\",\"delegateCityName\":\"Tỉnh Phú Thọ\",\"entityCacheEnabled\":true,\"userId\":\"240262\",\"originalCompanyId\":\"20099\",\"escapedModel\":false,\"originalOriginDossierId\":\"0\",\"delegateDistrictName\":\"Thành phố Việt Trì\",\"contactTelNo\":\"0947006999\",\"delegateIdNo\":\"131487417\",\"applicantIdType\":\"citizen\",\"originalDossierStatus\":\"new\",\"finishDate\":null,\"dossierStatusText\":\"Hồ sơ mới nhận\",\"dossierSubStatusText\":\"Chờ bàn giao thụ lý\",\"viaPostal\":0,\"columnBitmask\":\"0\",\"dueDate\":1545733258736,\"govAgencyName\":\"Sở Ngoại vụ\",\"groupId\":\"53365\",\"dossierTemplateName\":\"Cấp visa, gia hạn visa.\",\"registerBookCode\":\"\",\"originalDossierId\":\"23601\",\"originDossierNo\":\"\",\"uuid\":\"1577ffc9-a398-c144-4dc0-e9db730fb338\",\"briefNote\":\"\",\"notification\":false,\"postalWardCode\":\"\",\"postalCityName\":\"\",\"originalUserId\":\"240262\",\"durationUnit\":0,\"wardCode\":\"07897\",\"new\":false,\"originalApplicantIdNo\":\"131487417\",\"contactName\":\"\",\"delegateName\":\"VI TRƯỜNG SƠN\",\"delegateTelNo\":\"0947006999\",\"receiveDate\":1544782858736,\"extendDate\":null,\"applicantName\":\"VI TRƯỜNG SƠN\",\"folderId\":\"0\",\"dossierName\":\"Cấp visa, gia hạn visa\",\"companyId\":\"20099\",\"postalAddress\":\"\",\"processDate\":null,\"modifiedDate\":1544782867802,\"postalServiceName\":\"\",\"dossierId\":\"23601\",\"delegateAddress\":\"\",\"districtCode\":\"227\",\"originalDossierTemplateNo\":\"MAU_SNGV_LSVK01\",\"cityCode\":\"25\",\"submitDate\":null,\"cancellingDate\":null,\"stagedModelType\":{\"classSimpleName\":\"Dossier\",\"referrerClassNameId\":\"0\",\"referrerClassName\":null,\"className\":\"org.opencps.dossiermgt.model.Dossier\",\"classNameId\":\"34906\"},\"lockState\":\"\",\"applicantIdDate\":null,\"delegateCityCode\":\"25\",\"cityName\":\"Tỉnh Phú Thọ\",\"postalServiceCode\":\"\",\"original\":false,\"contactEmail\":\"\",\"originalDossierNo\":\"09.H44.181214.00108\",\"releaseDate\":null,\"postalDistrictCode\":\"\",\"delegateDistrictCode\":\"227\",\"counter\":96,\"delegateWardName\":\"Phường Tân Dân\",\"serviceName\":\"Cấp visa, gia hạn visa\",\"userName\":\"Lê Phương Thảo\",\"postalCityCode\":\"\",\"primaryKeyObj\":\"23601\",\"originalGroupId\":\"53365\",\"postalWardName\":\"\",\"online\":false,\"primaryKey\":\"23601\"}}",
        "notificationText":"Thông báo tiếp nhận hồ sơ",
        "notifyMessage":"",
        "title":"Thông báo tiếp nhận hồ sơ",
        "userId":"0",
        "userUrl":""
    }
]