<template>
  <el-dialog title="Category" :visible.sync="categoryDialogVisible" width="800px" :show-close="isProfilePage" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="categoryDialogInfoLabel">Please select at least one interested category</div>
    <div class="categoryDialogItemsWrapper">
      <div v-for="(item,index) in categoryFirstLevelItems" :class="{selected:categoryFirstLevelItems[index].selected===true}" :title="item.description" class="meebidCategoryItem" @click="selectItem(item, index, $event)">
        <meebid-tooltip :disabled="item.kids.length === 0" popper-class="meebidCategorySecItemToolTip" placement="right" effect="light">
          <div slot="content">
            <div v-for="(secItem,secIndex) in item.kids" :class="{selected:item.kids[secIndex].selected===true}" :title="secItem.description" class="meebidCategorySecItem" @click="selectSecItem(secItem, secIndex, item)">
              <img class="meebidCategorySecItemImage" :src="secItem.imgUrl">
              <span class="meebidCategorySecItemLabel" >{{secItem.description}}</span>
              <div class="meebidCategorySecItemMask"></div>
            </div>
          </div>
          <div>
            <img class="meebidCategoryItemImage" :src="item.imgUrl">
            <span class="meebidCategoryItemLabel" >{{item.description}}</span>
            <div class="meebidCategoryItemMask"></div>
          </div>
        </meebid-tooltip>
      </div>
    </div>
    <div class="categoryDialogSecondItemsWrapper">

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
      },
      favorCategories: {
        type: Array,
        'default': []
      }
    },
    data () {
      return {
        categoryFirstLevelItems: [],
        categorySecondLevelItems: {},
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
      var categoryFirstLevelItems = [];
      for (var i = 0; i < this.items.length; i++){
        var item = this.items[i];
        var childrenItems = [];
        var favorCateObj = meebidUtils.findObject(this.favorCategories, "id", item.id);
        if (item.kids && item.kids.length){
          for (var j = 0; j < item.kids.length; j++){
            var kid = item.kids[j];
            childrenItems.push({
              id: kid.id,
              description: kid.description,
              imgUrl: kid.imgUrl,
              selected: favorCateObj ? (meebidUtils.findObject(favorCateObj.kids, "id", kid.id) ? true: false) : false
            });
          }
        }
        
        categoryFirstLevelItems.push({
          id: item.id,
          description: item.description,
          imgUrl: item.imgUrl,
          selected: favorCateObj ? true: false,
          kids: childrenItems
        });
      }
      this.categoryFirstLevelItems = categoryFirstLevelItems;


      /*var categorySecondLevelItems = {};
      for (var i = 0; i < this.items.length; i++){
        categorySecondLevelItems[this.items[i].id] = this.categoryFirstLevelItems;
      }
      this.categorySecondLevelItems = categorySecondLevelItems;*/
    },
    methods: {
      validateSelectedItem() {
        var hasItemSelected = false;
        this.categoryFirstLevelItems.forEach(function(value, index, array){
          if (value.selected){
            hasItemSelected = true;
          }
        });
        this.noItemSelected = !hasItemSelected;
      },
      selectItem(item, index, event) {
        item.selected = !item.selected;
        for (var i = 0; i < item.kids.length; i++){
          item.kids[i].selected = item.selected;
        }
        this.validateSelectedItem();
      },
      selectSecItem(secItem, secIndex, parentItem){
        secItem.selected = !secItem.selected;
        var selectedCount = 0;
        for (var i = 0; i < parentItem.kids.length; i++){
          if (parentItem.kids[i].selected){
            selectedCount++;
          }
        }
        if (selectedCount === 0){
          parentItem.selected = false;
        } else {
          parentItem.selected = true;
        }
        this.validateSelectedItem();
      },
      onCancel() {
        var me = this;
        this.categoryDialogVisible = false;
      },
      onSave() {
        var me = this;
        var favorCategories = [];
        for (var i = 0; i < this.categoryFirstLevelItems.length; i++){
          if (this.categoryFirstLevelItems[i].selected){
            var item = this.categoryFirstLevelItems[i];
            var selectedKids = [];
            for (var j = 0; j < this.categoryFirstLevelItems[i].kids.length; j++){
              if (this.categoryFirstLevelItems[i].kids[j].selected){
                var kid = this.categoryFirstLevelItems[i].kids[j];
                selectedKids.push({
                  id: kid.id,
                  description: kid.description,
                  imgUrl: kid.imgUrl,
                  selected: true
                });
              }
            }
            favorCategories.push({
              id: item.id,
              description: item.description,
              imgUrl: item.imgUrl,
              selected: true,
              kids: selectedKids
            });
          }
        }
        this.favorCategories = favorCategories;
        this.$emit('update', this.favorCategories);
        if (!this.noItemSelected) {
          if (this.isProfilePage){
            this.categoryDialogVisible = false;
          } else {
            $.ajax({  
              url : "/api/user/profile",  
              type : 'POST',  
              data : JSON.stringify({  
                favorCategories: this.favorCategories
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
