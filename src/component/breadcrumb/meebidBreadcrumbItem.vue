<template>
  <span class="el-breadcrumb__item">
    <span
      :class="['el-breadcrumb__inner', to || redirectUrl ? 'is-link' : '']"
      ref="link"
      role="link">
      <slot></slot>
    </span>
    <i v-if="separatorClass" class="el-breadcrumb__separator" :class="separatorClass"></i>
    <span v-else class="el-breadcrumb__separator" role="presentation">{{separator}}</span>
  </span>
</template>
<script>
  import { BreadcrumbItem } from 'element-ui';

  export default {
    extends: BreadcrumbItem,
    name: 'meebid-breadcrumb-item',
    props: {
      redirectUrl: {
        type: Object
      }
    },
    mounted() {
      this.separator = this.elBreadcrumb.separator;
      this.separatorClass = this.elBreadcrumb.separatorClass;
      if (this.to) {
        let link = this.$refs.link;
        let to = this.to;
        link.setAttribute('role', 'link');
        link.addEventListener('click', _ => {
          this.replace ? this.$router.replace(to)
            : this.$router.push(to);
        });
      }
      if (this.redirectUrl) {
        let link = this.$refs.link;
        let redirectUrl = this.redirectUrl;
        link.setAttribute('role', 'link');
        link.addEventListener('click', _ => {
          window.location.href = redirectUrl.path;
        });
      }
    }
  };
</script>
