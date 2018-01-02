<template>
  <div id="app" class="meebid">
    <div id="header" class="meebidAdminHeader">
      <div class="meebidHeaderButtonToolbar">
        <meebid-button wrapper-cls="homeWrapper" button-type="round" text="Home" :button-click="redirectToHome">
        </meebid-button>
        <meebid-button icon-type="user" button-type="round" text="User Test" :button-click="openUserProfile">
        </meebid-button>
        
        <meebid-button icon-type="bell" button-type="round" ref="hintButton" data-role="trigger" >
        </meebid-button>
        <meebid-button icon-type="menu-hamburger" button-type="round" >
        </meebid-button>
      </div>
    </div>
    <div id="content" class="meebidAdminContentWrapper">
      <div class="meebidAdminMenu">
        <el-menu
        default-active="memberProfile"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
          <el-menu-item index="memberProfile">
            <i class="el-icon-menu"></i>
            <span slot="title" class="meebidAdminMenuLabel">User Profile</span>
          </el-menu-item>
          <el-menu-item index="houseProfile">
            <i class="el-icon-menu"></i>
            <span slot="title" class="meebidAdminMenuLabel">House Auction Information</span>
          </el-menu-item>
          <el-menu-item index="message">
            <i class="el-icon-setting"></i>
            <span slot="title" class="meebidAdminMenuLabel">Messages</span>
          </el-menu-item>
          <el-submenu index="1">
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
          </el-submenu>
        </el-menu>
      </div>
      <div class="meebidAdminContent">
        <div v-if="active === 'memberProfile'" class="meebidProfileFormWrapper">
          
          <el-row>
            <el-col :span="24" class="meebidUserProfileFormWrapper">
              <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">User Profile</div>
              <div class="meebidRegisterHeaderLabel">You can update your Profile Information here.</div>
              <el-form ref="userProfileForm" :model="userProfileForm" label-width="150px" class="meebidUserProfileForm">
                <el-form-item label="Contact User Name">
                  <el-input v-model="userProfileForm.firstName" class="meebidUserProfileUserName" placeholder="Please input First Name"></el-input>
                  <el-input v-model="userProfileForm.lastName" class="meebidUserProfileUserName" placeholder="Please input Last Name"></el-input>
                </el-form-item>
                <el-form-item label="Contact Cellphone">
                  <el-input v-model="userProfileForm.cellphone" placeholder="Please input Cellphone"></el-input>
                </el-form-item>
                <el-form-item label="Email">
                  <el-input v-model="userProfileForm.email" placeholder="Please input email address"></el-input>
                </el-form-item>
                <el-form-item label="Region">
                  <el-select v-model="userProfileForm.region" placeholder="Select...">
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
                    <div v-for="(item,index) in categoryItems" v-if="item.selected===true" class="meebidCategoryItem">
                      <img class="meebidCategoryItemImage" :src="item.imageUrl">
                      <span class="meebidCategoryItemLabel">{{item.label}}</span>
                      <div class="meebidCategoryItemMask"></div>
                    </div>
                  </div>
                </el-form-item>                
                <el-form-item>
                  <el-button type="primary" @click="onLogin">UPDATE USER PROFILE</el-button>
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
              <el-form ref="houseProfileForm" :model="houseProfileForm" label-width="150px" class="meebidHouseProfileForm">
                <el-form-item label="Contact User Name">
                  <el-input v-model="houseProfileForm.firstName" class="meebidUserProfileUserName" placeholder="Please input First Name"></el-input>
                  <el-input v-model="houseProfileForm.lastName" class="meebidUserProfileUserName" placeholder="Please input Last Name"></el-input>
                </el-form-item>
                <el-form-item label="Contact Cellphone">
                  <el-input v-model="houseProfileForm.cellphone" placeholder="Please input Cellphone"></el-input>
                </el-form-item>
                <el-form-item label="Email">
                  <el-input v-model="houseProfileForm.email" placeholder="Please input email address"></el-input>
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
                  <el-upload
                    class="upload-demo"
                    list-type="picture"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="houseProfileForm.bussinessLicense" multiple
                    >
                    <el-button size="small" type="primary"><i class="el-icon-upload"></i> Click to upload</el-button>
                    <div class="el-upload__tip" slot="tip">Please upload a file no larger than 1mb</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="Certification of Registed Auction House">
                  <el-upload
                    class="upload-demo"
                    list-type="picture"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="houseProfileForm.certification"
                    >
                    <el-button size="small" type="primary"><i class="el-icon-upload"></i> Click to upload</el-button>
                    <div class="el-upload__tip" slot="tip">Please upload a file no larger than 1mb</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="Auction House Representative">
                  <el-upload
                    class="upload-demo"
                    list-type="picture"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="houseProfileForm.representative"
                    >
                    <el-button size="small" type="primary"><i class="el-icon-upload"></i> Click to upload</el-button>
                    <div class="el-upload__tip" slot="tip">Please upload a file no larger than 1mb</div>
                  </el-upload>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="onLogin">UPDATE AUCTION HOUSE INFORMATION</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="active === 'message'">
          Message Box
        </div>
      </div>
      <meebid-category-dialog :items="categoryItems" ref="categoryDialog">
      </meebid-category-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: "memberProfile",
      regionOptions: [{
        value: "CN",
        label: "China"
      },{
        value: "US",
        label: "United States"
      },{
        value: "CA",
        label: "Canada"
      },{
        value: "EN",
        label: "England"
      },{
        value: "FR",
        label: "Franch"
      },{
        value: "GR",
        label: "Germany"
      }],
      countryOptions: [{
        value: "CN",
        label: "China"
      },{
        value: "US",
        label: "United States"
      },{
        value: "CA",
        label: "Canada"
      },{
        value: "EN",
        label: "England"
      },{
        value: "FR",
        label: "Franch"
      },{
        value: "GR",
        label: "Germany"
      }],
      userProfileForm: {
        region: ''
      },
      houseProfileForm: {
        country: '',
        bussinessLicense: [{
          name: 'test.jpeg',
          url: './../static/diy_crafts.jpg',
          status: 'finished'
        }]
      },
      categoryItems: [{
        imageUrl: "./../static/animals.jpg",
        label: "Animals",
        selected: true
      }, {
        imageUrl: "./../static/architecture.jpg",
        label: "Architecture",
        selected: true
      }, {
        imageUrl: "./../static/art.jpg",
        label: "Art",
        selected: false
      }, {
        imageUrl: "./../static/cars_motorcycles.jpg",
        label: "Cars and Motocycles",
        selected: false
      }, {
        imageUrl: "./../static/design.jpg",
        label: "Design",
        selected: false
      }, {
        imageUrl: "./../static/diy_crafts.jpg",
        label: "DIY and Crafts",
        selected: false
      }, {
        imageUrl: "./../static/education.jpg",
        label: "Education",
        selected: false
      }, {
        imageUrl: "./../static/everything.jpg",
        label: "Everything",
        selected: false
      }, {
        imageUrl: "./../static/film_music_books.jpg",
        label: "Film, Music and Books",
        selected: false
      }, {
        imageUrl: "./../static/food_drink.jpg",
        label: "Food and drink",
        selected: false
      }]
    }
  },
  mounted() {
    
  },

  methods: {
    redirectToHome() {
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
