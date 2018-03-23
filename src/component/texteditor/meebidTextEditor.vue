<template>
  <div>
    <div ref="editor" :id="compId"></div>
  </div>
</template>

<script>
  import emitter from './emitter';
  export default {
    name: 'meebid-text-editor',
    mixins: [emitter],
    inject: {
      elFormItem: {
        default: ''
      }
    },
    data () {
      return {
        currentValue: this.value,
        editor: null
      }
    },
    props: {
      compId: {
        type: String
      },
      placeholder: {
        type: String
      },
      value: [String, Number, Object],
      config: {
        type: Object
      }
    },
    watch: {
      'value'(val, oldValue) {
        this.setCurrentValue(val);
      }
    },
    mounted() {
      var me = this;
      this.editor = new Quill('#' + this.compId, {
        placeholder: this.placeholder,
        theme: 'snow'
      });
      this.editor.on('text-change', function(delta, oldDelta, source) {
        if (source == 'api') {
          //console.log("An API call triggered this change.");
          //me.$emit('input', me.editor.getContents());
          //me.dispatch('ElFormItem', 'el.form.change', [me.editor.getContents()]);
        } else if (source == 'user') {
          me.currentValue = me.editor.getContents();
          me.$emit('input', me.editor.getContents());
          me.dispatch('ElFormItem', 'el.form.change', [me.editor.getContents()]);
          //console.log("A user action triggered this change.");
        }
      });
    },
    methods: {
      
      getValue() {
        return this.editor.getContents();
      },
      
      setValue(delta) {
        this.editor.setContents(delta);
      },
      setCurrentValue(value) {
        if (JSON.stringify(value) === JSON.stringify(this.currentValue)) return;
        this.currentValue = value;
        this.editor.setContents(value);
        //this.dispatch('ElFormItem', 'el.form.change', [value]);
      },
    },
    destroyed() {
      this.editor = null;
    }
  }
</script>
