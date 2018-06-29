<template>
  <div :class="['meebidUiLocalBusyIndicator meebidUiLocalBusyIndicatorFade', busyIndicatorSize, backgroundTransparency]" v-show="active" tabindex="-1">
    <div class="meebidUiLocalBusyIndicatorAnimation meebidUiLocalBusyIndicatorAnimStandard">
      <div></div><div></div><div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'meebid-busy-indicator',
  props: {
    size: {
      type: String,
      default: 'Medium'
    },
    transparency: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    busyIndicatorSize () {
      return this.size ? 'meebidUiLocalBusyIndicatorSize' + this.size : 'meebidUiLocalBusyIndicatorSizeMedium'
    },
    backgroundTransparency () {
      return this.transparency ? 'meebidUiLocalBusyIndicatorTransparency' : ''
    }
  },
  methods: {
    getMinWait (delay) {
      delay = delay || 0
      return new Date().getTime() - this._started.getTime() < 500 ? 500 - parseInt(new Date().getTime() - this._started.getTime(), 10) + delay : 0 + delay
    },
    show (options) {
      this._started = new Date()
      this.active = true
    },
    hide () {
      const delay = 0
      this._spinnerAnimation = setTimeout(() => {
        this.active = false
      }, this.getMinWait(delay))
    }
  }
}
</script>

<style>

</style>
