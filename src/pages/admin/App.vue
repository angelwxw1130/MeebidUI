<template>
  <div id="app" class="meebid">
    <div id="header" class="meebidAdminHeader">
      <meebid-search-typeahead class="meebidtypeahead"
             async-src="https://api.github.com/search/users?q="
             async-key="items"
             item-key="login"
             :force-select="true">
        <span class="glyphicon glyphicon-search meebidHeaderSearchIcon"></span>
        <input data-role="input" class="form-control" type="text" placeholder="Search">
        <template slot="item" slot-scope="props">
          <li ref="props.typeaheadBusyIndicator"><meebid-busy-indicator size="Medium"></meebid-busy-indicator></li>
          <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
            <a href="javascript:void(0)" @click="props.select(item)">
              <div>
                <img width="36px" height="36px" :src="item.avatar_url"> 
                <span style="padding-left: 10px;">{{item.login}}</span>
              </div>
            </a>
          </li>
          <li v-show="props.noResult"><div class="noResult">No Data</div></li>
        </template>
      </meebid-search-typeahead>
      <div class="meebidHeaderButtonToolbar">
        <meebid-button wrapper-cls="homeWrapper" button-type="round" text="Home" :button-click="redirectToHome">
        </meebid-button>
        <meebid-button icon-type="user" button-type="round" :text="firstName" :button-click="openUserProfile">
        </meebid-button>
        <meebid-button icon-type="bell" button-type="round" ref="hintButton" data-role="trigger" :button-click="openCategoryDialog">
        </meebid-button>
        <meebid-button icon-type="menu-hamburger" button-type="round" >
        </meebid-button>
        <meebid-button icon-type="log-out" button-type="round" text="Logout" :button-click="onLogout" >
        </meebid-button>
      </div>
    </div>
    <div id="content" class="meebidAdminContentWrapper">
      <div class="meebidAdminMenu">
        <el-menu
        :default-active="defaultActiveProfile"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        background-color="#e6e6e6"
        >
          <template v-if="userProfile.type === userType.member">
            <el-menu-item index="memberProfile">
              <i class="el-icon-menu"></i>
              <span slot="title" class="meebidAdminMenuLabel">User Profile</span>
            </el-menu-item>
          </template>
          <template v-if="userProfile.type === userType.house">
            <el-menu-item index="houseProfile">
              <i class="el-icon-menu"></i>
              <span slot="title" class="meebidAdminMenuLabel">House Auction Information</span>
            </el-menu-item>
          </template>
          <el-menu-item index="message">
            <i class="el-icon-setting"></i>
            <span slot="title" class="meebidAdminMenuLabel">Messages</span>
          </el-menu-item>
          <!--<el-submenu index="1">
            <i class="el-icon-location"></i>
            <template slot="title">             
              <span>Sub Menu</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>-->
        </el-menu>
      </div>
      <div class="meebidAdminContent">
        <div v-if="active === 'memberProfile'" class="meebidProfileFormWrapper">
          
          <el-row>
            <el-col :span="24" class="meebidUserProfileFormWrapper">
              <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">User Profile</div>
              <div class="meebidRegisterHeaderLabel">You can update your Profile Information here.</div>
              <el-form ref="userProfileForm" :rules="userProfileFormRules" :model="userProfileForm" label-width="180px" class="meebidPaddingTopMedium">
                <el-form-item label="Email" prop="email">
                  <el-input readonly v-model="userProfileForm.email" class="meebidFormFieldMediumLength" placeholder="Please input email address"></el-input>
                  <el-button class="meebidFormFieldRevalidateButton" type="primary" size="small" ref="memberRevalidate" :disabled="memberRevalidateButtonDisabled" @click="onMemberRevalidate">{{revalidateMemberLabel}}</el-button>
                </el-form-item>
                <el-form-item label="First Name & Last Name">
                  <el-input v-model="userProfileForm.firstName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input First Name"></el-input>
                  <el-input v-model="userProfileForm.lastName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input Last Name"></el-input>
                </el-form-item>
                <!--<el-form-item label="Contact Cellphone">
                  <el-input v-model="userProfileForm.cellphone" class="meebidFormFieldMediumLength" placeholder="Please input Cellphone"></el-input>
                </el-form-item>-->          
                <el-form-item label="Region" prop="topRegion">
                  <el-select v-model="userProfileForm.topRegion" placeholder="Select...">
                    <el-option
                      v-for="item in regionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Favourite Category">
                  <el-button size="small" type="primary" @click="openCategoryDialog"><i class="el-icon-edit"></i> Click to change Favourite Categories</el-button>
                  <div class="meebidCategorySelectItemInForm">
                    <div v-for="(item,index) in categoryItems" v-if="item.selected===true" :title="item.description" class="meebidCategoryItem">
                      <img class="meebidCategoryItemImage" :src="item.imgUrl">
                      <span class="meebidCategoryItemLabel">{{item.description}}</span>
                      <div class="meebidCategoryItemMask"></div>
                    </div>
                  </div>
                </el-form-item>                
                <el-form-item>
                  <el-button type="primary" @click="onUpdateProfile">UPDATE USER PROFILE</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="active === 'houseProfile'" class="meebidProfileFormWrapper">
          <el-row>
            <el-col :span="24" class="meebidHouseProfileFormWrapper">
              <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">Auction House Information</div>
              <div class="meebidRegisterHeaderLabel">You can update your Auction House Information here.</div>
              <el-form ref="houseProfileForm" :model="houseProfileForm" label-width="180px" class="meebidHouseProfileForm">
                <el-form-item label="Email">
                  <el-input readonly v-model="houseProfileForm.email" class="meebidFormFieldMediumLength" placeholder="Please input email address"></el-input>
                  <el-button type="primary" size="small" @click="onRevalidate">RE-VALIDATE</el-button>
                </el-form-item>
                <el-form-item label="First Name & Last Name">
                  <el-input v-model="houseProfileForm.firstName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input First Name"></el-input>
                  <el-input v-model="houseProfileForm.lastName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input Last Name"></el-input>
                </el-form-item>
                <el-form-item label="Contact Cellphone">
                  <el-input v-model="houseProfileForm.cellphone" placeholder="Please input Cellphone"></el-input>
                </el-form-item>
                
                <el-form-item label="Country">
                  <el-select v-model="houseProfileForm.country" placeholder="Select...">
                    <el-option
                      v-for="item in countryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Bussiness License">
                  <meebid-upload
                    class="upload-demo"
                    ref="bLicenseUpload"
                    field-name="bLicenseUpload"
                    :multiple="false"
                    :limit="1"
                    :on-exceed="handleUploadExceed"
                    :on-success="handleUploadSuccess"
                    :on-preview="handlePictureCardPreview"
                    list-type="picture-card"
                    :on-error="handleUploadError"
                    :file-list="houseProfileForm.bLicenseUpload"
                    >
                    <i class="el-icon-plus" ></i>
                  </meebid-upload>
                </el-form-item>
                <el-form-item class="meebidUserProfileLongLabel" label="Certification of Registed Auction House">
                  <meebid-upload
                    class="upload-demo"
                    ref="qualiDocUpload"
                    field-name="qualiDocUpload"
                    :multiple="false"
                    :limit="1"
                    :on-exceed="handleUploadExceed"
                    :on-success="handleUploadSuccess"
                    :on-preview="handlePictureCardPreview"
                    list-type="picture-card"
                    :on-error="handleUploadError"
                    :file-list="houseProfileForm.qualiDocUpload"
                    >
                    <i class="el-icon-plus" ></i>
                  </meebid-upload>
                </el-form-item>
                <el-form-item class="meebidUserProfileLongLabel" label="Auction House Representative">
                  <meebid-upload
                    class="upload-demo"
                    ref="idUpload"
                    field-name="idUpload"
                    :multiple="false"
                    :limit="1"
                    :on-exceed="handleUploadExceed"
                    :on-success="handleUploadSuccess"
                    :on-preview="handlePictureCardPreview"
                    list-type="picture-card"
                    :on-error="handleUploadError"
                    :file-list="houseProfileForm.idUpload"
                    >
                    <i class="el-icon-plus" ></i>
                  </meebid-upload>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="onUpdateProfile">UPDATE AUCTION HOUSE INFORMATION</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="active === 'message'">
          Message Box
        </div>
      </div>
      <el-dialog :visible.sync="previewDialogVisible">
        <img width="100%" :src="previewDialogImageUrl" alt="">
      </el-dialog>
      <meebid-category-dialog :items="categoryItems" :isProfilePage="isProfilePage" ref="categoryDialog">
      </meebid-category-dialog>
    </div>
  </div>
</template>

<script>
import loginUtils from './../../utils/loginUtils'
import meebidUtils from './../../utils/meebidUtils'
import $ from 'jquery'
export default {
  data () {
    return {
      previewDialogVisible: false,
      previewDialogImageUrl: "",
      defaultActiveProfile: 'memberProfile',
      revalidateMemberLabel: "RE-VALIDATE",
      userType: window.meebidConstant.userType,
      loginUser: loginUtils.getLoginUser(),
      memberRevalidateButtonDisabled: false,
      firstName: "User",
      active: "memberProfile",
      isProfilePage: true,
      regionOptions: [{
        value: 0,
        label: "China"
      },{
        value: 1,
        label: "United States"
      },{
        value: 2,
        label: "Canada"
      },{
        value: 3,
        label: "England"
      },{
        value: 4,
        label: "Franch"
      },{
        value: 5,
        label: "Germany"
      }],
      countryOptions: [{
        value: 0,
        label: "China"
      },{
        value: 1,
        label: "United States"
      },{
        value: 2,
        label: "Canada"
      },{
        value: 3,
        label: "England"
      },{
        value: 4,
        label: "Franch"
      },{
        value: 5,
        label: "Germany"
      }],
      userProfile: {},
      userProfileForm: {
      },
      userProfileFormRules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' }
        ],
        region: [
          { required: true, message: 'Please select region', trigger: 'change' }
        ]
      },
      houseProfileForm: {
      },
      categoryItems: []
    }
  },
  watch: {

  },
  beforeMount() {
    if (this.$parent.$data && this.$parent.$data.user){
      this.userProfile = this.$parent.$data.user;
      if (this.userProfile.firstName){
        this.firstName = this.userProfile.firstName;
      }
      if (this.userProfile.type === window.meebidConstant.userType.member){
        this.userProfileForm = this.userProfile;
        var categoryItems = this.$parent.$data.categories;
        var selectedItems = this.userProfileForm && this.userProfileForm.favorCategories ? this.userProfileForm.favorCategories.split(";") : [];
        for (var i = 0; i < categoryItems.length; i++){
          categoryItems[i].selected = false;
          for (var j = 0; j < selectedItems.length; j++){
            if (parseInt(selectedItems[j]) === categoryItems[i].id){
              categoryItems[i].selected = true;
              break;
            }
          }
        }
        this.categoryItems = categoryItems;
      } else if (this.userProfile.type === window.meebidConstant.userType.house){
        if (!this.userProfile.blicenseUrl) {
          this.userProfile.bLicenseUpload = [];
        } else {
          this.userProfile.bLicenseUpload = [{
              url: this.userProfile.blicenseUrl
          }];
        }
        if (!this.userProfile.qualiDocUrl) {
          this.userProfile.qualiDocUpload = [];
        } else {
          this.userProfile.qualiDocUpload = [{
              url: this.userProfile.qualiDocUrl
          }];
        }
        if (!this.userProfile.idUrl) {
          this.userProfile.idUpload = [];
        } else {
          this.userProfile.idUpload = [{
              url: this.userProfile.idUrl
          }];
        }
        this.houseProfileForm = this.userProfile;
        this.defaultActiveProfile = 'houseProfile';
        this.active = 'houseProfile';

      }
      
    }
  },
  mounted() {
    console.log("Profile App ready");
    
    

  },

  methods: {
    redirectToHome() {
      window.location.href = "./home.html";
    },
    onLogout () {
      loginUtils.setLoginUser()
      window.location.href = "./home.html";
    },
    openCategoryDialog() {
      this.$refs.categoryDialog.categoryDialogVisible = true;
      this.$refs.categoryDialog.validateSelectedItem();
    },
    handleOpen(key, keyPath) {
      
    },
    handleClose(key, keyPath) {
      
    },
    handleSelect(key, keyPath) {
      this.active = key;
      console.log(key, keyPath);
    },
    openUserProfile() {
      window.open("./admin.html", '_blank');
    },
    buildRequest() {
      if (this.userProfile.type === this.userType.member) {
        return {
          topRegion: this.userProfile.topRegion,
          avatar: this.userProfile.avatar,
          firstName: this.userProfile.firstName,
          lastName: this.userProfile.lastName,
          favorCategories: this.userProfile.favorCategories,
          cellphone: this.userProfile.cellphone,
          email: this.userProfile.email
        }
      } else if (this.userProfile.type === this.userType.house) {
        var returnObj = {
          topRegion: this.userProfile.topRegion,
          firstName: this.userProfile.firstName,
          lastName: this.userProfile.lastName,
          cellphone: this.userProfile.cellphone,
          //email: this.userProfile.email,
          //logo: this.userProfile.logo,
          //contact: this.userProfile.contact,
        };
        if (this.userProfile.bLicenseUpload.length && this.userProfile.bLicenseUpload[0] && this.userProfile.bLicenseUpload[0].rUid){
          returnObj.blicenseUrl = this.userProfile.bLicenseUpload[0].rUid;
        }
        if (this.userProfile.qualiDocUpload.length && this.userProfile.qualiDocUpload[0] && this.userProfile.qualiDocUpload[0].rUid){
          returnObj.qualiDocUrl = this.userProfile.qualiDocUpload[0].rUid;
        }
        if (this.userProfile.idUpload.length && this.userProfile.idUpload[0] && this.userProfile.idUpload[0].rUid){
          returnObj.idUrl = this.userProfile.idUpload[0].rUid;
        }
        return returnObj;
      }
    },
    onUpdateProfile() {
      var favorCategories = meebidUtils.buildCategoryItemStr(this.categoryItems);
      this.userProfile.favorCategories = favorCategories;
      $.ajax({
        type: "POST",
        url: "/api/user/profile",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify(this.buildRequest()),
        success(data) {
          if (data.code === 1){
            this.$notify({
              title: 'Success',
              type: 'success',
              message: 'Update successful',
              duration: 5000
            })
            this.firstName = this.userProfile.firstName;
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Update failure',
              duration: 5000
            })
          }
          
        },
        error() {
          this.$notify.error({
            title: 'Failure',
            message: 'Update failure',
            duration: 5000
          })
        }
      }).done(function(){
        console.log("Update Profile done");
      });
    },
    onMemberRevalidate() {
      this.memberRevalidateButtonDisabled = true;
      $.ajax({
        type: "POST",
        url: "/api/user/revalidate",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify({
          email: this.userProfile.email
        }),
        success(data) {
          if (data.code === 1){
            this.$notify({
              type: 'success',
              title: 'Success',
              message: data.msg,
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: 'Failure',
              message: data.msg,
              duration: 5000
            })
          }
          
        },
        error() {
          this.$notify.error({
            title: 'Failure',
            message: 'Re-send Validation Email failure',
            duration: 5000
          })
        }
      }).done(function(){
        console.log("Re-send Validation Email done");
      });
      var count = 60;
      var me = this;
      var interval = setInterval(function(){
        if (count === 0){
          me.revalidateMemberLabel = "RE-VALIDATE";
          me.memberRevalidateButtonDisabled = false;
          window.clearInterval(interval);
          return;
        }
        me.revalidateMemberLabel = (count-- - 1) + 's';
        
      }, 1000);
    },
    onRevalidate() {
      $.ajax({
        type: "POST",
        url: "/api/user/revalidate",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify({
          email: this.userProfile.email
        }),
        success(data) {
          if (data.code === 1){
            this.$notify({
              type: 'success',
              title: 'Success',
              message: data.msg,
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: 'Failure',
              message: data.msg,
              duration: 5000
            })
          }
          
        },
        error() {
          this.$notify.error({
            title: 'Failure',
            message: 'Re-send Validation Email failure',
            duration: 5000
          })
        }
      }).done(function(){
        console.log("Re-send Validation Email done");
      });
    },
    handleUploadSuccess(response, file, fileList, fieldName) {
      var res = response;
      this.userProfile[fieldName] = fileList;
    },
    handleUploadError(err, file, fileList) {
      this.$notify.error({
        title: 'Failure',
        message: error,
        duration: 5000
      })
    },
    handleUploadExceed() {
      this.$message.warning('You can only upload one image for this field.');
      
    },
    handlePictureCardPreview (file) {
      this.previewDialogVisible = true;
      this.previewDialogImageUrl = file.url;
    }
  }
}

</script>

<style>
html
{
  height:100%;
  margin:0;
}
body
{
  height:100%;
  margin:0; 
}
#app {
  height: 100%;
}
</style>
