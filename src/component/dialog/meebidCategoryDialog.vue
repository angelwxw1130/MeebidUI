<template>
  <el-dialog title="Category" :visible.sync="categoryDialogVisible" width="800px" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="categoryDialogInfoLabel">Please select at least one interested category</div>
    <div class="categoryDialogItemsWrapper">
      <div v-for="(item,index) in items" :class="{selected:items[index].selected===true}" class="meebidCategoryItem" @click="selectItem(item, index)">
        <img class="meebidCategoryItemImage" :src="item.imgUrl">
        <span class="meebidCategoryItemLabel">{{item.name}}</span>
        <div class="meebidCategoryItemMask"></div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <!--<el-button @click="categoryDialogVisible = false">Cancel</el-button>-->
      <el-button type="primary" @click="onSave" :disabled="noItemSelected">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
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
      onSave() {
        if (!this.noItemSelected) {
          if (this.isProfilePage){
            this.categoryDialogVisible = false;
          } else {
            /**
            $.ajax({  
              url : "/api/user/login",  
              type : 'POST',  
              data : JSON.stringify({  
                email : email,  
                password : password  
              }),
              context: this,
              contentType : "application/json", 
              success : function(data) {
                if (data.code == '1'){
                  let currentDate = new Date()
                  currentDate.setTime(currentDate.getTime() + data.content.expiredAt * 1000)
                  loginUtils.setLoginUser({
                    expireTime: currentDate.getTime(),
                    token: data.content.token
                  })
                  this.$refs.loginFormRef.resetFields()
                } else {  
                  this.$notify({
                    title: 'Failure',
                    message: 'Login failed',
                    duration: 5000
                  })
                }
                window.location.reload()

              },  
              error : function(data) {  
                alert(data);  
              },  
              dataType : 'json' 
            })  
            */
          }
        }         
      }
    }
  }
</script>
