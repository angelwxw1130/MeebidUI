<template>
    <div class="meebidSwitchWrapper">
      <span class="meebidSwtichHelpText" v-if="showHelpText">{{helpText}}</span>
      <span class="weui-switch" :class="{'weui-switch-on' : me_checked}" :value="value" @click="toggle"></span>
    </div>
</template>

<script>
  export default {
    name: 'meebid-switch',
    props: {
      value: {
        type: Boolean,
        default: true
      },
      showHelpText: {
        type: Boolean,
        default: false
      },
      helpTextSwitchOn: {
        type: String
      },
      helpTextSwitchOff: {
        type: String
      }
    },
    data() {
      return {
        me_checked: this.value,
        helpText: this.helpTextSwitchOn
      }
    },
    watch: {
      me_checked(val) {
        this.$emit('input', val);
        if (this.showHelpText){
          this.helpText = val ? this.helpTextSwitchOn : this.helpTextSwitchOff;
        }        
      }
    },
    methods: {
      toggle() {
        this.me_checked = !this.me_checked;
        console.log(this.me_checked);
        this.$emit('switchChange', this.me_checked);
        
      }
    }
  }
</script>

<style>
  .weui-switch {
    display: block;
    position: relative;
    width: 42px;
    height: 22px;
    border: 1px solid #DFDFDF;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #DFDFDF;
    transition: background-color 0.1s, border 0.1s;
    cursor: pointer;
  }
  .weui-switch:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 20px;
    border-radius: 15px;
    background-color: #FDFDFD;
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  }
  .weui-switch:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 15px;
    background-color: #FFFFFF;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
  }
  .weui-switch-on {
    border-color: #FF5242;
    background-color: #FF5242;
  }
  .weui-switch-on:before {
    border-color: #FF5242;
    background-color: #FF5242;
  }
  .weui-switch-on:after {
    transform: translateX(20px);
  }
  .meebidSwitchWrapper {
    display: inline-block;
    position: relative;
  }
  .meebidSwtichHelpText {
    position: absolute;
    right: 55px;
    white-space: nowrap;
    top: 2px;
  }
</style>