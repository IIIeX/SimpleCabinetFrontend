<template>
<div>
    <slot :handle="function() { isShow = !isShow }"></slot>
    <b-modal
      centered
      hide-header
      v-model="isShow"
      id="modal-2fa-disable"
      @ok="createProduct"
    >
        <h2>Создание нового товара</h2>
      <b-form-group
      label="Название товара"
      >
        <b-form-input
          type="text"
          v-model="name"
          placeholder="VIP"
        ></b-form-input>
        <b-form-invalid-feedback :state="name ? true : false"
          >Имя не может быть пустым</b-form-invalid-feedback
        >
      </b-form-group>
      <b-form-group
       label="Описание товара"
       label-for="input-1"
      >
          <b-form-textarea
          id="input-1"
          v-model="description"
          type="textarea"
          placeholder="Самый лучший товар"
        ></b-form-textarea>
      </b-form-group>
      <b-form-group
      label="Тип товара"
      >
          <b-form-select
          v-model="type"
          :options="types"
        ></b-form-select>
      </b-form-group>
      <b-form-group
       label="Цена за единицу товара"
      >
          <b-form-input
          type="text"
          v-model="price"
          placeholder="1.00"
        ></b-form-input>
        <b-form-invalid-feedback :state="price > 0"
          >Цена должна быть больше нуля</b-form-invalid-feedback
        >
      </b-form-group>
      <h3>Ограничения</h3>
      <b-form-group
       label="Колличество товаров"
      >
          <b-form-input
          type="number"
          v-model="count"
          placeholder="Неограничено"
        ></b-form-input>
      </b-form-group>
      <b-form-group
       label="Дата окончания продаж"
      >
          <b-form-input
          type="date"
          v-model="endDate"
        ></b-form-input>
        <b-form-input
          type="time"
          v-model="endTime"
        ></b-form-input>
      </b-form-group>
      <b-form-group
      label="Видимость"
      >
        <b-form-checkbox
        v-model="visible"
        >Товар отображается в списке</b-form-checkbox>
      </b-form-group>
      <b-form-group
      :label="type == 'GROUP' ? 'Продление группы' : type == 'ITEM' ? 'Покупка множества товаров' : 'Дополнительный параметр 0'"
      >
        <b-form-checkbox
        v-model="isStackable"
        >{{ type == 'GROUP' ? 'Продлевать группу при заказе' : type == 'ITEM' ? 'Разрешить покупку более 1 единицы за раз' : 'Дополнительный параметр 0' }}</b-form-checkbox>
      </b-form-group>
      <h3>Параметры доставки</h3>
      <b-form-group
      :label="type == 'GROUP' ? 'Название группы' : type == 'ITEM' ? 'ID предмета' : 'ID действия'"
      >
        <b-form-input
          type="text"
          v-model="sysId"
          :placeholder="type == 'GROUP' ? 'HD' : type == 'ITEM' ? 'minecraft:apple' : ''"
        ></b-form-input>
        <b-form-invalid-feedback :state="sysId ? true : false"
          >Это поле не может быть пустым</b-form-invalid-feedback
        >
      </b-form-group>
      <b-form-group
      :label="type == 'GROUP' ? 'Колличество дней при заказе 1шт' : type == 'ITEM' ? 'Колличество предметов при заказе 1шт' : 'Колличество действия'"
      >
        <b-form-input
          type="number"
          v-model="sysQuantity"
          :placeholder="type == 'GROUP' ? '30' : type == 'ITEM' ? '1' : ''"
        ></b-form-input>
      </b-form-group>
      <b-form-group
      :label="type == 'GROUP' ? 'Мир (LuckPerms)' : type == 'ITEM' ? 'Extra предмета' : 'Extra действия'"
      >
        <b-form-input
          type="text"
          v-model="sysExtra"
          :placeholder="type == 'GROUP' ? 'global' : type == 'ITEM' ? '2' : ''"
        ></b-form-input>
      </b-form-group>
      <b-form-group
      :label="type == 'GROUP' ? 'Сервер (LuckPerms)' : type == 'ITEM' ? 'NBT предмета' : 'Дополнительный параметр действия'"
      >
        <b-form-input
          type="text"
          v-model="sysNbt"
          :placeholder="type == 'GROUP' ? 'global' : type == 'ITEM' ? '{}' : ''"
        ></b-form-input>
      </b-form-group>
      <b-form-group
      label="Метод выдачи (deliveryProvider)"
      >
        <b-form-input
          type="text"
          v-model="sysDeliveryProvider"
          :placeholder="type == 'GROUP' ? 'luckperms' : type == 'ITEM' ? 'event' : 'event'"
        ></b-form-input>
        <b-form-invalid-feedback :state="sysDeliveryProvider ? true : false"
          >Метод выдачи не может быть пустым</b-form-invalid-feedback
        >
      </b-form-group>
    </b-modal>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            isShow: false,
            name: "",
            price: 1.00,
            count: null,
            description: "",
            type: "GROUP",
            types: ["ITEM", "GROUP", "SPECIAL"],
            visible: true,
            isStackable: true,
            sysId: null,
            sysExtra: null,
            sysNbt: null,
            sysQuantity: 1,
            endDate: null,
            endTime: null,
            sysDeliveryProvider: null
        };
    },
    computed: {
        endDateObject: function() {
          if(!this.endDate) return null;
          var date = new Date(this.endDate);
          return {
            date: {
              year: date.getFullYear(),
              month: date.getMonth()+1,
              day: date.getDate()
            },
            time: {
              hour: 0,
              minute: 0,
              second: 0
            }
          }
        }
    },
    methods: {
        show: function() {
            this.isShow = true;
        },
        createProduct: async function(evt) {
          evt.preventDefault();
          await this.$store.dispatch("request", {
                type: "lkCreateProduct",
                name : this.name, price: this.price, count: this.count ? this.count : -1,
                description: this.description,
                endDate: (this.endDate && this.endTime) ? this.endDateObject : null,
                productType: this.type, visible: this.visible, isAllowStack: this.isStackable,
                sysId: this.sysId, sysExtra: this.sysExtra, sysNbt: this.sysNbt, sysQuantity: this.sysQuantity,
                sysDeliveryProvider: this.sysDeliveryProvider
            });
          this.isShow = false;
        }
    }
}
</script>