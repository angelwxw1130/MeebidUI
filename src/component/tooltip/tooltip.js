import { Tooltip } from 'element-ui';

export default {
  extends: Tooltip,
  name: 'meebid-tooltip',
  mounted() {
    this.referenceElm = this.$el;
    if (this.$el.nodeType === 1) {
      this.$el.setAttribute('aria-describedby', this.tooltipId);
      this.$el.setAttribute('tabindex', 0);
      on(this.referenceElm, 'mouseenter', this.show);
      on(this.referenceElm, 'mouseleave', this.hide);
      on(this.referenceElm, 'focus', () => {
        if (!this.$slots.default || !this.$slots.default.length) {
          this.handleFocus();
          return;
        }
        const instance = this.$slots.default[0].componentInstance;
        if (instance && instance.focus) {
          instance.focus();
        } else {
          this.handleFocus();
        }
      });
      on(this.referenceElm, 'click', this.removeFocusing);
    }
  },
  destroyed() {
    const reference = this.referenceElm;
    off(reference, 'mouseenter', this.show);
    off(reference, 'mouseleave', this.hide);
    off(reference, 'focus', this.handleFocus);
    off(reference, 'click', this.removeFocusing);
  }
};