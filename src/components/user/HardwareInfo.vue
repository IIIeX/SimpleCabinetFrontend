<template>
  <div>
    <b-dropdown-item
      variant="danger"
      @click="
        show = !show;
        fetchHardwareInfo();
      "
      >Просмотреть HardwareInfo</b-dropdown-item
    >
    <b-modal
      hide-header
      centered
      size="md"
      v-model="show"
      id="modal-admin-changepassword"
    >
      <b-row v-if="this.loading" class="justify-content-md-center">
        <b-col col md="6" class="my-4">
          <b-alert variant="success" align="center" show>
            <h4>Подождите, получаем данные</h4>
          </b-alert>
        </b-col>
      </b-row>
      <b-row
        v-if="!this.loading && !this.info"
        class="justify-content-md-center"
      >
        <b-col col md="6" class="my-4">
          <b-alert variant="danger" align="center" show>
            <h4>У пользователя отсутствует информация о железе</h4>
          </b-alert>
        </b-col>
      </b-row>
      <div v-if="!this.loading && this.info">
          <h4>Информация о железе пользователя {{ user.username }}</h4>
          <p>Данные запрошены {{ this.$store.state.user.username }}</p>
          <h2>Основные данные</h2>
      <b-table stacked :items="[this.info]" :fields="this.statisticFields">
        <template #cell(processorMaxFreq)="data">
        {{ ((data.item.processorMaxFreq) / (1000*1000)) / 1000 + "Ггц" }}
      </template>
      <template #cell(totalMemory)="data">
        {{ Math.floor(data.item.totalMemory / (1024*1024)) + "Мб" }}
      </template>
      </b-table>
      <h2>Идентификационные данные</h2>
      <b-table stacked :items="[this.info]" :fields="this.sensitiveFields">
          <template #cell(displayId)="data">
          <b-button variant="success" @click="downloadFile(data.item.displayId, 'edid')">Скачать</b-button>
      </template>
      <template #cell(publicKey)>
          <b-button variant="success" @click="downloadFile(publicKey, 'key')">Скачать</b-button>
      </template>
      </b-table>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: ["user"],
  data: function () {
    return {
      show: false,
      info: {
        baseboardSerialNumber: null,
        battery: null,
        bitness: null,
        displayId: null,
        hwDiskId: null,
        logicalProcessors: null,
        physicalProcessors: null,
        processorMaxFreq: null,
        totalMemory: null,
      },
      publicKey: null,
      loading: true,
    };
  },
  computed: {
      processorMaxFreqData: function(){
          return ((this.info.processorMaxFreq) / (1000*1000)) / 1000 + "Ггц";
      },
      statisticFields: function() {
          return [
              {label: "Разрядность", key: "bitness"},
              {label: "Число ядер", key: "physicalProcessors"},
              {label: "Число потоков", key: "logicalProcessors"},
              {label: "Частота процессора", key: "processorMaxFreq"},
              {label: "Объем оперативной памяти", key: "totalMemory"},
          ];
      },
      sensitiveFields: function() {
          return [
              {label: "Серийный номер материнской платы", key: "baseboardSerialNumber"},
              {label: "Серийный номер жесткого диска", key: "hwDiskId"},
              {label: "EDID дисплея", key: "displayId"},
              {label: "Публичный ключ", key: "publicKey"},
          ];
      },
  },
  methods: {
    fetchHardwareInfo: async function () {
      this.loading = true;
      var info = await this.$store.dispatch("request", {
        type: "lkUserHardwareInfo",
        userUsername: this.user.username,
      });
      console.log(info);
      this.loading = false;
      this.info = info.info;
      this.publicKey = info.publicKey;
    },
    downloadFile: function(data, name) {
    var a = document.createElement("a"); //Create <a>
    a.href = "data:application/octet-stream;base64," + data; //Image Base64 Goes here
    a.download = this.user.username+"."+name; //File name Here
    a.click(); //Downloaded file
    }
  },
};
</script>