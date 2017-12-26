<template>
  <div class="meebidHomePageList" style="height: 1000px;">
    <meebid-homepage-list-item v-for="item in items" :key="item.id" :height="item.height" :image-url="item.imageUrl" :description="item.description" :favourite-count="item.favouriteCount" :meebid-list-item-class="item.meebidListItemClass" :avatar-url="item.avatarUrl" :image-name="item.imageName" :image-provider="item.imageProvider"></meebid-homepage-list-item>
  </div>
</template>

<script>
  import meebidHomePageListItem from './../homepage/meebidHomePageListItem.vue'
  export default {
    name: 'meebid-homepage-list',
    data() {
        return {
            items: []
        }
    },
    mounted() {
      console.log("page list ready");
    
    },
    methods: {
      addItem: function(itemComponent){

        this.items.push(itemComponent);
      },
      addItems: function(itemComponentArr){
        this.items.concat(itemComponentArr);
      }
    }
  }
</script>

<style>

</style>
