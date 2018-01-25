<template>
  <el-dialog title="Category" :visible.sync="categoryDialogVisible" width="800px" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="categoryDialogInfoLabel">Please select at least one interested category</div>
    <div class="categoryDialogItemsWrapper">
      <div v-for="(item,index) in items" :class="{selected:items[index].selected===true}" :title="item.description" class="meebidCategoryItem" @click="selectItem(item, index)">
        <img class="meebidCategoryItemImage" :src="item.imgUrl">
        <span class="meebidCategoryItemLabel" >{{item.description}}</span>
        <div class="meebidCategoryItemMask"></div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="isProfilePage" @click="onCancel">Cancel</el-button>
      <el-button type="primary" @click="onSave" :disabled="noItemSelected">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import meebidUtils from './../../utils/meebidUtils'
  import $ from 'jquery'
  import loginUtils from './../../utils/loginUtils'
  export default {
    name: 'meebid-category-dialog',
    props: {
      isProfilePage: {
        type: Boolean,
        'default': false
      },
      items: {
        type: Array,
        'default': []
      }
    },
    data () {
      return {
        categoryDialogVisible: false,
        noItemSelected: true
      }
    },
    computed: {
    },
    //watch: {
    //  items (newValue, oldValue) {
    //    this.validateSelectedItem();
    //  }
    //},
    mounted () {
      if (this.isProfilePage){
        var originalItem = [];
        for (var i = 0; i < this.items.length; i++){
          const item = this.items[i];
          originalItem.push({
            selected: item.selected,
            description: item.description,
            imgUrl: item.imgUrl
          })
        }
      }
    },
    methods: {
      validateSelectedItem() {
        var hasItemSelected = false;
        this.items.forEach(function(value, index, array){
          if (value.selected){
            hasItemSelected = true;
          }
        });
        this.noItemSelected = !hasItemSelected;
      },
      selectItem(item, index) {
        item.selected = !item.selected;
        this.validateSelectedItem();
      },
      onCancel() {

      },
      onSave() {
        if (!this.noItemSelected) {
          if (this.isProfilePage){
            this.categoryDialogVisible = false;
          } else {
            var favorCategories = meebidUtils.buildCategoryItemStr(this.items);
            $.ajax({  
              url : "/api/user/profile",  
              type : 'POST',  
              data : JSON.stringify({  
                favorCategories: favorCategories
              }),
              headers: {
                token: loginUtils.getLoginUser().token
              },
              context: this,
              contentType : "application/json", 
              success : function(data) {
                /** if (data.code == '1'){
                  this.$notify({
                    title: 'Success',
                    message: 'Update Favor Categories successful',
                    duration: 5000
                  })
                  this.categoryDialogVisible = false;
                } else {  
                  this.$notify({
                    title: 'Failure',
                    message: 'Update Favor Categories failed',
                    duration: 5000
                  })
                }*/

              },  
              error : function(data) {  
                this.$notify({
                  title: 'Failure',
                  message: 'Update Favor Categories failed',
                  duration: 5000
                })  
              },  
              dataType : 'json' 
            })  
            
          }
        }         
      }
    }
  }
</script>
