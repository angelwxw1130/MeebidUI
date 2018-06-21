<script>
  import { Tooltip } from 'element-ui';

  export default {
    extends: Tooltip,
    name: 'meebid-tooltip',
    methods: {
      handleBlur: function handleBlur() {
        this.focusing = false;
      },
    }
  };
</script>
