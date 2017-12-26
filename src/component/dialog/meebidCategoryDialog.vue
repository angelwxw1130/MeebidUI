<template>
  <el-dialog title="Category" :visible.sync="categoryDialogVisible" width="800px">
    <div class="categoryDialogInfoLabel">Please select at least one interested category</div>
    <div v-for="(item,index) in items" :class="{selected:item.selected===true}" class="meebidCategoryItem" @click="selectItem(item)">
      <img class="meebidCategoryItemImage" :src="item.imageUrl">
      <span class="meebidCategoryItemLabel">{{item.label}}</span>
      <div class="meebidCategoryItemMask"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="categoryDialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="onSave" :disabled="noItemSelected">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'meebid-category-dialog',
    props: {
      categoryDialogVisible: {
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
      selectItem(item) {
        item.selected = !item.selected;
        this.validateSelectedItem();
      },
      onSave() {
        
        if (hasItemSelected) {
          this.categoryDialogVisible = false;
        } else {

        }

        
      }
    }
  }
</script>
