<template>
  <div>
    <b-dropdown-item
      variant="danger"
      @click="
        show = !show;
        fetchHardwareInfo();"
    >Просмотреть HardwareInfo</b-dropdown-item>
    <b-modal
      centered
      scrollable
      hide-footer
      size="md"
      v-model="show">
      <template #modal-title>
        HWID пользователя {{ user.username }}
      </template>
      <small>Данные запросил <strong>{{ this.$store.state.user.username }}</strong></small>
      <b-alert v-if="this.loading" variant="success" align="center" show>
        <h4>Подождите, получаем данные</h4>
      </b-alert>
      <b-alert v-if="!this.loading && !this.info" variant="danger" align="center" show>
        <h4>У пользователя отсутствует информация о железе</h4>
      </b-alert>
      <div v-if="!this.loading && this.info">
        <h4>Основные данные</h4>
        <b-table stacked :items="[this.info]" :fields="this.statisticFields">
          <template #cell(processorMaxFreq)="data">
            {{ ((data.item.processorMaxFreq) / (1000*1000)) / 1000 + "Ггц" }}
          </template>
          <template #cell(totalMemory)="data">
            {{ Math.floor(data.item.totalMemory / (1024*1024)) + "Мб" }}
          </template>
        </b-table>
        <h4>Идентификационные данные</h4>
        <b-table stacked :items="[this.info]" :fields="this.sensitiveFields">
          <template #cell(displayId)="data">
            <b-button size="sm" variant="success" @click="downloadFile(data.item.displayId, 'edid')">Скачать</b-button>
          </template>
          <template #cell(publicKey)>
            <b-button size="sm" variant="success" @click="downloadFile(publicKey, 'key')">Скачать</b-button>
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
              {label: "Частота ЦП", key: "processorMaxFreq"},
              {label: "Объем ОЗУ", key: "totalMemory"},
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
      a.href = "data:application/octet-stream;base64," + data.split("-").join("+").split("_").join("/"); //Image Base64 Goes here
      a.download = this.user.username+"."+name; //File name Here
      a.click(); //Downloaded file
    }
  },
};
</script>
