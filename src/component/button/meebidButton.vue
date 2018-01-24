<template>
  <div :class="['meebidButtonWrapper', wrapperCls]" @mousedown="buttonClickEvent">
    <div :class="['meebidButton', iconType && text == null ? 'isIconOnly': '', buttonTypeCls]" >
      <span :class="['meebidButtonIcon', iconTypeCls]"></span>
      <span class="meebidButtonText">{{text}}</span>
      <div class="meebidButtonHintWrapper" v-show="hintNumber > 0 && iconType && text == null">
        <div class="meebidButtonHintContainer">
          <div class="meebidButtonHintText">{{hintMessage}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'meebid-button',
  props: {
    iconType: {
      type: String,
      default: null
    },
    buttonType: {
      type: String,
      default: "default"
    },
    active: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: null
    },
    wrapperCls: {
      type: String,
      default: null
    },
    buttonClick: {
      type: Function,
      default: function(){
      }
    }
  },
  data () {
    return {
      hintNumber: 0
    }
  },

  computed: {
    hintMessage() {
      if (this.hintNumber > 9){
        return "9+";
      } else {
        return this.hintNumber + "";
      }
    },
    buttonTypeCls () {
      switch (this.buttonType){
        case 'default':
          return "";
        case 'round': 
          return "meebidButtonRoundCorner";
        case 'red':
          return "meebidButtonRed"; 
        case 'white':
          return "meebidButtonWhite";
        case 'orange':
          return "meebidButtonOrange";
      }
    },
    iconTypeCls () {
      return this.iconType ? 'glyphicon glyphicon-' + this.iconType + (this.text ? ' meebidButtonWithText' : '') : '';
    }
  },
  methods: {
    buttonClickEvent (){
      this.buttonClick();
    }
  }
}
</script>

<style>

</style>
