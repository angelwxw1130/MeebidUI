<template>
  <div :class="['meebidButtonWrapper', wrapperCls]" @mousedown="buttonClickEvent" :title="text ? text : title">
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
    title: {
      type: String,
      default: ""
    },
    buttonClick: {
      type: Function,
      default: function(){
      }
    },
    hintNumber: {
      type: Number,
      default: 0
    },
  },
  data () {
    return {
      
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
      var buttonTypeCls = "";
      var buttonTypeArr = this.buttonType.split(" ");
      for (var i = 0; i < buttonTypeArr.length; i++){
        switch (buttonTypeArr[i]){
          case 'default':
            buttonTypeCls += "";
            break;
          case 'round': 
            buttonTypeCls += "meebidButtonRoundCorner ";
            break;
          case 'red':
            buttonTypeCls += "meebidButtonRed "; 
            break;
          case 'white':
            buttonTypeCls += "meebidButtonWhite ";
            break;
          case 'orange':
            buttonTypeCls += "meebidButtonOrange ";
            break;
          case 'grey':
            buttonTypeCls += "meebidButtonGrey ";
            break;
        }
      }
      return buttonTypeCls;
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
