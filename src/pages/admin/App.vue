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
        <!--<meebid-button icon-type="bell" button-type="round" ref="hintButton" data-role="trigger" :button-click="openCategoryDialog">
        </meebid-button>
        <meebid-button icon-type="menu-hamburger" button-type="round" >
        </meebid-button>-->
        <meebid-button icon-type="log-out" button-type="round" text="Logout" :button-click="onLogout" >
        </meebid-button>
      </div>
    </div>
    <div id="content" class="meebidAdminContentWrapper">
      <meebid-busy-indicator ref="busyIndicator" size="Medium"></meebid-busy-indicator>
      <div class="meebidAdminMenu">
        <el-menu
        :default-active="defaultActiveProfile"
        class="el-menu-vertical-demo"
        ref="navigationMenu"
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
              <span slot="title" class="meebidAdminMenuLabel">Basic Information</span>
            </el-menu-item>
          </template>
          <template v-if="userProfile.type === userType.house && userProfile.right === 2052">
            <el-menu-item index="houseDefaultSetting">
              <i class="el-icon-setting"></i>
              <span slot="title" class="meebidAdminMenuLabel">Basic Terms</span>
            </el-menu-item>
          </template>
          <template v-if="userProfile.type === userType.house && userProfile.right === 2052">
            <el-menu-item index="auctionManagement">
              <i class="el-icon-goods"></i>
              <span slot="title" class="meebidAdminMenuLabel">Auction Management</span>
            </el-menu-item>
          </template>
          <!--<template v-if="userProfile.type === userType.member && userProfile.right === 4098">
            <el-menu-item index="memberAddress">
              <i class="el-icon-menu"></i>
              <span slot="title" class="meebidAdminMenuLabel">Address Management</span>
            </el-menu-item>
          </template>
          <template v-if="userProfile.type === userType.house && userProfile.right === 2050">
            <el-menu-item index="houseAddress">
              <i class="el-icon-menu"></i>
              <span slot="title" class="meebidAdminMenuLabel">Address Management</span>
            </el-menu-item>
          </template>-->
          <el-menu-item index="message">
            <i class="el-icon-bell"></i>
            <span slot="title" class="meebidAdminMenuLabel">Messages</span>
          </el-menu-item>
          <!--<el-submenu index="settings">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span class="meebidAdminMenuLabel">Settings</span>
            </template>
            <el-menu-item-group>           
              <el-menu-item index="changePassword">Change Password</el-menu-item>
              <el-menu-item index="changeLanguage">Languages</el-menu-item>
            </el-menu-item-group>
          </el-submenu>-->
        </el-menu>
      </div>
      <div ref="meebidAdminContent" class="meebidAdminContent">
        <div class="meebidAdminFloatingAlert">
          <transition name="meebid-alert-top-in">
            <el-alert show-icon v-show="hasPendingChange" class="meebidUnsavedAlertMessage" :closable="false"
              :title="$t('meebid.alertMessage.MSG_UNSAVED_DATA')"
              type="warning">
            </el-alert>
          </transition>
        </div>
        <div v-if="active === 'memberProfile'" class="meebidProfileFormWrapper">
          <el-row>
            <el-col :span="24" class="meebidUserProfileFormWrapper">
              <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">User Profile</div>
              <div class="meebidRegisterHeaderLabel">You can update your Profile Information here.</div>
              <el-form ref="userProfileForm" :rules="userProfileFormRules" :model="userProfileForm" label-width="180px" class="meebidPaddingTopMedium">
                <el-form-item label="" v-if="userProfile.right === 4097">
                  <el-alert class="meebidAlertMessage" :closable="false"
                    :title="$t('meebid.alertMessage.MSG_PROFILE_ACCOUNT_NOT_ACTIVATE')"
                    type="warning">
                  </el-alert>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                  <el-input readonly v-model="userProfileForm.email" class="meebidFormFieldMediumLength" placeholder="Please input email address"></el-input>
                  <el-button v-if="userProfile.right === 4097" class="meebidFormFieldRevalidateButton" type="primary" size="small" ref="memberRevalidate" :disabled="memberRevalidateButtonDisabled" @click="onMemberRevalidate">{{revalidateMemberLabel}}</el-button>
                </el-form-item>
                <el-form-item label="First Name & Last Name">
                  <el-input v-model="userProfileForm.firstName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input First Name" @change="onFieldDataChange"></el-input>
                  <el-input v-model="userProfileForm.lastName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input Last Name" @change="onFieldDataChange"></el-input>
                </el-form-item>
                <el-form-item label="Title" prop="title">
                  <el-select v-model="userProfileForm.titleId" placeholder="Select..." @change="onFieldDataChange">
                    <el-option
                      v-for="item in titleOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Contact Cellphone">
                  <div v-for="(item,index) in userProfileForm.contact_users" :class="{meebidPaddingBottomSmall: index === userProfileForm.contact_users.length}">
                    <span style="display: inline-block; width: 180px;" >{{item.phone}}</span>
                    <span class="meebidPaddingLeftSmall">
                      <el-button size="small" class="meebidNoBorderButton" icon="el-icon-edit" @click="onEditPhoneNumber(index, item)"></el-button>
                      <el-button size="small" icon="el-icon-delete" class="meebidNoBorderButton" @click="onDeletePhoneNumber(index, item)"></el-button>
                    </span>
                  </div>
                  <div class="" v-if="userProfileForm.contact_users && userProfileForm.contact_users.length < 5"><el-button size="small" type="primary" @click="onAddPhoneNumber">Add Phone</el-button></div>
                  <div v-if="userProfileForm.contact_users.length === 5">You cannot have more than <b>5</b> phone numbers</div>
                  
                </el-form-item>     
                <!--<el-form-item label="Region" prop="topRegion">
                  <el-select v-model="userProfileForm.topRegion" placeholder="Select...">
                    <el-option
                      v-for="item in regionOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item label="Favourite Category">
                  <el-button size="small" type="primary" @click="openCategoryDialog"><i class="el-icon-edit"></i> Click to change Favourite Categories</el-button>
                  <div class="meebidCategorySelectItemInForm">
                    <div v-for="(item,index) in (userProfileForm.favorCategories && userProfileForm.favorCategories.length ? userProfileForm.favorCategories : [])" :title="item.description" class="meebidCategoryItem">
                      <meebid-tooltip :disabled="item.kids.length === 0" popper-class="meebidCategorySecItemToolTip" placement="bottom" effect="light">
                        <div slot="content">
                          <div v-for="(secItem,secIndex) in item.kids" :title="secItem.description" class="meebidCategorySecItem">
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
              
              <el-form ref="houseProfileForm" :model="houseProfileForm" :rules="houseProfileFormRules" label-width="180px" class="meebidHouseProfileForm">
                <el-form-item label="" v-if="userProfile.right === 2049">
                  <el-alert class="meebidAlertMessage" :closable="false"
                    :title="$t('meebid.alertMessage.MSG_PROFILE_ACCOUNT_NOT_ACTIVATE')"
                    type="warning">
                  </el-alert>
                </el-form-item>
                <el-form-item label="" v-if="userProfile.right === 2050">
                  <el-alert class="meebidAlertMessage" v-if="userProfile.state === 0" :closable="false"
                    :title="$t('meebid.alertMessage.MSG_PROFILE_ACCOUNT_NOT_APPROVE')"
                    type="warning">
                  </el-alert>
                  <el-alert class="meebidAlertMessage" v-if="userProfile.state === 1" :closable="false"
                    :title="$t('meebid.alertMessage.MSG_PROFILE_ACCOUNT_PENDING_APPROVE')"
                    type="warning">
                  </el-alert>
                </el-form-item>
                <el-form-item label="Email">
                  <el-input readonly v-model="houseProfileForm.email" class="meebidFormFieldMediumLength" placeholder="Please input email address"></el-input>
                  <el-button v-if="userProfile.right === 2049" class="meebidFormFieldRevalidateButton" type="primary" size="small" ref="houseRevalidate" :disabled="houseRevalidateButtonDisabled" @click="onHouseRevalidate">{{revalidateHouseLabel}}</el-button>
                </el-form-item>
                <el-form-item label="Auction House Name" prop="name">
                  <el-input v-model="houseProfileForm.name" @change="onFieldDataChange" placeholder="Please input Auction House Name"></el-input>
                </el-form-item>
                <el-form-item label="Auction Website Address">
                  <el-input v-model="houseProfileForm.website" @change="onFieldDataChange" placeholder="Please input Auction Website Address"></el-input>
                </el-form-item>
                <!--<el-form-item label="Contact Name">
                  <el-input v-model="houseProfileForm.firstName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input First Name"></el-input>
                  <el-input v-model="houseProfileForm.lastName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input Last Name"></el-input>
                </el-form-item>
                <el-form-item label="Auction Contact Number" class="">
                  <el-input v-model="houseProfileForm.contact_cellphone" placeholder="Please input Cellphone"></el-input>
                </el-form-item>-->
                <el-form-item label="Contact Users">
                  <div v-for="(item,index) in houseProfileForm.contact_users" :class="{meebidPaddingBottomSmall: index === houseProfileForm.contact_users.length}">
                    <span style="display: inline-block; width: 40px;" class="meebidVerticalAlignTop">{{getTitleLabel(item.titleId)}}</span>
                    <span style="display: inline-block; width: 150px;" class="meebidVerticalAlignTop">{{item.firstName}} {{item.lastName}}</span>
                    <span style="display: inline-block; width: 200px;" class="meebidVerticalAlignTop">
                      <span style="display: block">Phone 1: {{item.phone}}</span>
                      <span style="display: block" v-if="item.phone1 !== null && item.phone1 !== ''">Phone 2: {{item.phone1}}</span>
                      <span style="display: block" v-if="item.email !== null && item.email !== ''">Email: {{item.email}}</span>
                    </span>
                    <span class="meebidPaddingLeftSmall meebidVerticalAlignTop">
                      <el-button size="small" class="meebidNoBorderButton meebidVerticalAlignTop" icon="el-icon-edit" @click="onEditContactUser(index, item)"></el-button>
                      <el-button size="small" icon="el-icon-delete" class="meebidNoBorderButton meebidVerticalAlignTop" @click="onDeleteContactUser(index, item)"></el-button>
                    </span>
                  </div>
                  <div class="" v-if="houseProfileForm.contact_users.length < 5"><el-button size="small" type="primary" @click="onAddContactUser">Add Contact User</el-button></div>
                  <div v-if="houseProfileForm.contact_users.length === 5">You cannot have more than <b>5</b> contact users</div>
                  
                </el-form-item>
                <!--<el-form-item label="Region">
                  <el-select v-model="houseProfileForm.topRegion" placeholder="Select...">
                    <el-option
                      v-for="item in regionOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item label="Logo">
                  <meebid-upload
                    class="upload-demo"
                    ref="bLogoUpload"
                    field-name="bLogoUpload"
                    list-type="picture-card"
                    :multiple="false"
                    :limit="1"
                    :on-remove="handleUploadRemove"
                    :on-exceed="handleUploadExceed"
                    :on-success="handleUploadSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-error="handleUploadError"
                    :file-list="houseProfileForm.bLogoUpload"
                    >
                    <i class="el-icon-plus"></i>
                  </meebid-upload>
                </el-form-item>
                <el-form-item label="Bussiness License">
                  <meebid-upload
                    class="upload-demo"
                    ref="bLicenseUpload"
                    field-name="bLicenseUpload"
                    :multiple="false"
                    :limit="1"
                    :on-remove="handleUploadRemove"
                    :on-exceed="handleUploadExceed"
                    :on-success="handleUploadSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-error="handleUploadError"
                    :file-list="houseProfileForm.bLicenseUpload"
                    >
                    <el-button size="small" type="primary" icon="el-icon-plus">Click to upload</el-button>
                  </meebid-upload>
                </el-form-item>
                <el-form-item class="meebidUserProfileLongLabel" label="Certification of Registed Auction House">
                  <meebid-upload
                    class="upload-demo"
                    ref="qualiDocUpload"
                    field-name="qualiDocUpload"
                    :multiple="false"
                    :limit="1"
                    :on-remove="handleUploadRemove"
                    :on-exceed="handleUploadExceed"
                    :on-success="handleUploadSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-error="handleUploadError"
                    :file-list="houseProfileForm.qualiDocUpload"
                    >
                    <el-button size="small" type="primary" icon="el-icon-plus">Click to upload</el-button>
                  </meebid-upload>
                </el-form-item>
                <el-form-item class="meebidUserProfileLongLabel" label="Auction House Representative Legal ID">
                  <meebid-upload
                    class="upload-demo"
                    ref="idUpload"
                    field-name="idUpload"
                    :multiple="false"
                    :limit="1"
                    :on-remove="handleUploadRemove"
                    :on-exceed="handleUploadExceed"
                    :on-success="handleUploadSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-error="handleUploadError"
                    :file-list="houseProfileForm.idUpload"
                    >
                    <el-button size="small" type="primary" icon="el-icon-plus">Click to upload</el-button>
                  </meebid-upload>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="onUpdateHouseProfile">UPDATE AUCTION HOUSE INFORMATION</el-button>
                  <el-button type="primary" v-if="userProfile.right === 2050 && userProfile.state === 0" @click="onApprovalHouse">APPLY FOR APPROVAL</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="active === 'houseDefaultSetting'" class="meebidProfileFormWrapper">
          <el-row>
            <el-col :span="24" class="meebidHouseProfileFormWrapper">
              <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">Auction House Default Setting</div>
              <div class="meebidRegisterHeaderLabel">You can set default Terms and Condition, Payment Info and Shipping Info here.</div>
              <el-form ref="houseDefaultSettingForm" :model="houseDefaultSettingForm" label-width="180px" class="meebidHouseProfileForm">
                <el-form-item label="Terms and Condition">
                  <meebid-text-editor ref="termsEditor" compId="terms" v-model="houseDefaultSettingForm.terms" class="meebidFormFieldMediumLength meebidTextEditorInForm" placeholder="Please input Terms and Condition"></meebid-text-editor>
                </el-form-item>
                <el-form-item label="Payment Info">
                  <meebid-text-editor ref="paymentEditor" compId="paymentInfo" v-model="houseDefaultSettingForm.paymentInfo" class="meebidFormFieldMediumLength meebidTextEditorInForm" placeholder="Please input Payment Info"></meebid-text-editor>
                </el-form-item>
                <el-form-item label="Shipping Info">
                  <meebid-text-editor ref="shipingEditor" compId="shippingInfo" v-model="houseDefaultSettingForm.shippingInfo" class="meebidFormFieldMediumLength meebidTextEditorInForm" placeholder="Please input Shipping Info"></meebid-text-editor>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onUpdateDefaultSetting">UPDATE</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="active === 'auctionManagement'" class="meebidProfileFormWrapper">
          <el-row v-if="auctionManagementStep === 'auctionManagement'">
            <el-col :span="24" class="meebidHouseProfileFormWrapper" style="position: relative;">
              <div class="meebidLoginDialogLabel">Auction Management</div>
              <div class="">You can manage your auction here.</div>
              <div style="position: absolute; right: 0px; top: 0px;"> 
                <el-button class="meebidMarginTopMedium" type="primary" @click="onCreateAuction">CREATE AUCTION</el-button>
              </div>
              <div class="meebidMarginTopMedium" v-if="auctionList && auctionList.length > 0">

                <div v-for="(item,index) in auctionList" class="">
                  <div style="border-top: 1px solid #eeeeee;" class="meebidMarginBottomMedium meebidPaddingTopMedium">
                    <a class="meebidAuctionImageContainer">
                      <img :src="item.logo">
                    </a>
                    <div class="meebidPaddingLeftMedium" style="display: inline-block; width: calc(100% - 300px); vertical-align: top;">
                      <span style="font-size: 20px; display: block; font-weight: bolder;">{{item.name}}</span>
                      <span style="font-size: 16px; display: block;" class="meebidMarginTopSmall">{{formatDate(item.startAt)}}</span>
                      <span style="font-size: 16px; display: inline-block; font-weight: bolder;" class="meebidMarginTopSmall meebidPaddingRightSmall">{{getAuctionType(item.type)}}</span>
                      <span style="font-size: 16px; display: inline-block;" :style="{background: getStateColor(item.state)}" class="meebidPaddingLeftSmall meebidPaddingRightSmall meebidMarginTopSmall">{{getStateLabel(item.state)}}</span>
                      <span style="font-size: 16px; display: inline-block;" v-if="(item.state & 2) != 0" :style="{background: getStateColor(2)}" class="meebidPaddingLeftSmall meebidPaddingRightSmall meebidMarginTopSmall">{{getStateLabel(2)}}</span>
                    </div>
                    <div style="width: 100px; display: inline-block; float: right;">
                      <el-dropdown @command="handleAuctionItemCommand($event, item)" v-if="item.state != 0">
                        <el-button type="primary" size="small" class="meebidAuctionListButton">
                          Actions<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="edit">Edit</el-dropdown-item>
                          <el-dropdown-item command="delete">Delete</el-dropdown-item>
                          <el-dropdown-item v-if="(item.state & 1) != 0" command="announce">Announce</el-dropdown-item>
                          <el-dropdown-item v-if="(item.state & 16) != 0" command="deList">De-List</el-dropdown-item>
                          <el-dropdown-item v-if="(item.state & 32) == 0 && (item.state & 2) == 0" command="publish">Publish</el-dropdown-item>
                          <el-dropdown-item v-if="(item.state & 32) != 0" command="review">Review Lots</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <el-button type="primary" size="small" v-if="item.state != 0" class="meebidMarginTopMedium meebidAuctionListButton meebidMarginLeftClean" @click="onManageLots(item)">Manage Lots</el-button>
                    </div>
                  </div>
                </div>
                <el-pagination
                  @current-change="onAuctionCurrentPageChange"
                  :current-page.sync="currentPageForAuction"
                  :page-size="20"
                  layout="prev, pager, next, jumper"
                  :total="totalCountForAuction">
                </el-pagination>
              </div>
              <div class="meebidMarginTopLarge meebidNoAuctionLotText" v-else>
                <span>No Auction</span>
              </div>
            </el-col>
          </el-row>
          <el-row v-else-if="auctionManagementStep === 'auctionLotManagement'">
            <el-col :span="24" class="meebidHouseProfileFormWrapper" style="position: relative;">
              <div class="meebidLoginDialogLabel">Lots Management</div>
              <div class="">You can manage your lots here.</div>
              <div style="position: absolute; right: 0px; top: 0px;"> 
                <el-button class="meebidMarginTopMedium meebidSquareButton" icon="el-icon-back" @click="onBackToAuctionList">BACK</el-button>
                <el-button class="meebidMarginTopMedium" type="primary" @click="onCreateAuctionLot">CREATE LOT</el-button>
                <el-dropdown class="meebidMarginLeftSmall" @command="handleBatchCommand">
                  <el-button type="primary">
                    BATCH ACTIONS<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="batchUploadAuctionLot">Batch Upload Lots</el-dropdown-item>
                    <el-dropdown-item command="batchUploadAuctionLotImages">Batch Upload Images</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!--<el-button class="meebidMarginTopMedium" type="primary" @click="onBatchUploadAuctionLot">BATCH UPLOAD</el-button>-->
              </div>

              <div class="meebidMarginTopMedium" v-if="auctionLotList && auctionLotList.length > 0">

                <div v-for="(item,index) in auctionLotList" class="meebidAdminLotContainer">
                  <div style="" class="meebidMarginBottomMedium meebidPaddingTopMedium">
                    <a class="meebidLotImageContainer">
                      <img :src="item.imageUrls[0].url">
                    </a>
                    <div class="meebidLotTextContainer meebidPaddingLeftSmall meebidPaddingRightSmall">
                      <span class="meebidAdminLotName meebidMarginTopSmall" :title="item.name">{{getLotName(item.name)}}</span>
                      <span class="meebidAdminLotNumber" >Lot {{item.no}}</span>
                      <span class="meebidAdminLotEstimation" >{{getLotEstimationPrice(item)}}</span>
                      <span class="meebidAdminLotStartPrice" >{{getLotStartPrice(item)}}</span>
                      <span :style="{background: getLotStateColor(item.state)}" class="meebidAdminLotState meebidPaddingLeftSmall meebidPaddingRightSmall">{{getLotStateLabel(item.state)}}</span>
                      <div class="meebidLotActionButtonContainer">
                        <el-dropdown @command="handleLotItemCommand($event, item)" v-if="item.state != 0 && currentSceneState != 8 && currentSceneState != 64">
                          <el-button type="primary" size="super-mini">
                            <i class="el-icon-setting"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="edit">Edit</el-dropdown-item>
                            <el-dropdown-item command="delete">Delete</el-dropdown-item>
                            <el-dropdown-item v-if="(item.state & 1) == 1 && currentSceneState == 32" command="review">Review</el-dropdown-item>
                            <el-dropdown-item v-if="(item.state & 4) != 0 && currentSceneState == 32" command="online">Online</el-dropdown-item>
                            <el-dropdown-item v-if="(item.state & 8) != 0" command="offline">Offline</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                        
                      </div>
                    </div>
                  </div>
                </div>
                <el-pagination
                  @current-change="onAuctionLotCurrentPageChange"
                  :current-page.sync="currentPageForAuctionLot"
                  :page-size="20"
                  layout="prev, pager, next, jumper"
                  :total="totalCountForAuctionLot">
                </el-pagination>
              </div>
              <div class="meebidMarginTopLarge meebidNoAuctionLotText" v-else>
                <span>No Lot</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- Element UI Bug, when form doesn't rendered first time, rules check will not be applied correctly-->
        <div v-if="active === 'houseProfile' || active === 'memberProfile'" class="meebidPaddingTopMedium meebidMarginTopLarge meebidAddressWrapper">
          <el-row ref="meebidAddressHeader">
            <el-col :span="24" class="meebidUserProfileFormWrapper">
              <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">Address Management</div>
              <div class="meebidRegisterHeaderLabel" v-if="active === 'memberProfile'">You can manage your Billing Address and Shipping Address.</div>
              <div class="meebidRegisterHeaderLabel" v-if="active === 'houseProfile'">You can manage your Exhibition Address, Bidding Venue Address and Pick-up Warehouse Address.</div>
            </el-col>
          </el-row>
          <div v-if="active === 'memberProfile'">
            <el-button size="small" type="primary" v-if="this.addresses[16].length < 5" class="meebidSquareButton meebidMarginBottomSmall meebidMarginLeftSmall" @click="handleAddAddress(16)">Add</el-button>
            <span class="meebidAddressManagementTableHeader meebidPaddingLeftSmall meebidPaddingBottomSmall meebidPaddingTopMedium">Shipping Address</span>
            <!-- Shipping Address -->
            <el-alert show-icon v-if="this.addresses[16].length === 5" class="meebidMarginBottomSmall meebidMaximumAddressAlertMessage" :closable="false"
                title="You cannot have more than 5 same type addresses."
                type="warning">
            </el-alert>
            <el-table
              :data="addresses[16]"
              border
              style="width: 100%">
              <el-table-column
                label="Country" width="240" 
                >
                <template slot-scope="scope">
                  <span>{{getTopRegionLabel(scope.row.topRegion)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="detail"
                label="Address"
                >
                <template slot-scope="scope">
                  <span>{{getRegionDetail(scope.row.detail)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Actions"
                width="240"
                >
                <template slot-scope="scope">
                  <el-button size="small" class="meebidSquareButton" icon="el-icon-edit" @click="handleEditAddress(scope.row)"></el-button>
                  <el-button size="small" class="meebidSquareButton" icon="el-icon-delete" @click="handleDeleteAddress(scope.row)"></el-button>
                  <el-button size="small" v-if="scope.row.isDefault !== true" class="meebidSquareButton" @click="handleSetDefaultAddress(scope.row)">Set as Default</el-button>
                  <span v-else class="meebidAddressTableDefaultLabel">Default</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="active === 'memberProfile'" class="meebidPaddingTopMedium">
            <span class="meebidAddressManagementTableHeader meebidPaddingLeftSmall meebidPaddingBottomSmall meebidPaddingTopMedium">Billing Address</span>
            <el-button size="small" type="primary" v-if="this.addresses[8].length < 5" class="meebidSquareButton meebidMarginBottomSmall meebidMarginLeftSmall" @click="handleAddAddress(8)">Add</el-button>
            <el-alert show-icon v-if="this.addresses[8].length === 5" class="meebidMarginBottomSmall meebidMaximumAddressAlertMessage" :closable="false"
                title="You cannot have more than 5 same type addresses."
                type="warning">
            </el-alert>
            <el-table
              :data="addresses[8]"
              border
              style="width: 100%">
              <el-table-column
                label="Country" width="240" 
                >
                <template slot-scope="scope">
                  <span>{{getTopRegionLabel(scope.row.topRegion)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="detail"
                label="Address"
                >
                <template slot-scope="scope">
                  <span>{{getRegionDetail(scope.row.detail)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Actions"
                width="240"
                >
                <template slot-scope="scope">
                  <el-button size="small" class="meebidSquareButton" icon="el-icon-edit" @click="handleEditAddress(scope.row)"></el-button>
                  <el-button size="small" class="meebidSquareButton" icon="el-icon-delete" @click="handleDeleteAddress(scope.row)"></el-button>
                  <el-button size="small" v-if="scope.row.isDefault !== true" class="meebidSquareButton" @click="handleSetDefaultAddress(scope.row)">Set as Default</el-button>
                  <span v-else class="meebidAddressTableDefaultLabel">Default</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="active === 'houseProfile'">
            <span class="meebidAddressManagementTableHeader meebidPaddingLeftSmall meebidPaddingBottomSmall meebidPaddingTopMedium">Pick-up Warehouse Address</span>
            <el-button size="small" type="primary" v-if="this.addresses[128].length < 5" class="meebidSquareButton meebidMarginBottomSmall meebidMarginLeftSmall" @click="handleAddAddress(128)">Add</el-button>
            <span style="display: block;" class="meebidPaddingLeftSmall meebidPaddingBottomSmall" >You <b>cannot</b> create Auction without Pick-up Warehouse Address.</span>
            <el-alert show-icon v-if="this.addresses[128].length === 5" class="meebidMarginBottomSmall meebidMaximumAddressAlertMessage" :closable="false"
                title="You cannot have more than 5 same type addresses."
                type="warning">
            </el-alert>
            <el-table
              :data="addresses[128]"
              border
              style="width: 100%">
              <el-table-column
                label="Country" width="240" 
                >
                <template slot-scope="scope">
                  <span>{{getTopRegionLabel(scope.row.topRegion)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="detail"
                label="Address"
                >
                <template slot-scope="scope">
                  <span>{{getRegionDetail(scope.row.detail)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Actions"
                width="240"
                >
                <template slot-scope="scope">
                  <el-button size="small" class="meebidSquareButton" icon="el-icon-edit" @click="handleEditAddress(scope.row)"></el-button>
                  <el-button size="small" class="meebidSquareButton" icon="el-icon-delete" @click="handleDeleteAddress(scope.row)"></el-button>
                  <el-button size="small" v-if="scope.row.isDefault !== true" class="meebidSquareButton" @click="handleSetDefaultAddress(scope.row)">Set as Default</el-button>
                  <span v-else class="meebidAddressTableDefaultLabel">Default</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="active === 'houseProfile'" class="meebidPaddingTopMedium">
            <span class="meebidAddressManagementTableHeader meebidPaddingLeftSmall meebidPaddingBottomSmall meebidPaddingTopMedium">Exhibition Address</span>
            <el-button size="small" type="primary" v-if="this.addresses[32].length < 5" class="meebidSquareButton meebidMarginBottomSmall meebidMarginLeftSmall" @click="handleAddAddress(32)">Add</el-button>
            <el-alert show-icon v-if="this.addresses[32].length === 5" class="meebidMarginBottomSmall meebidMaximumAddressAlertMessage" :closable="false"
                title="You cannot have more than 5 same type addresses."
                type="warning">
            </el-alert>
            <el-table
              :data="addresses[32]"
              border
              style="width: 100%">
              <el-table-column
                label="Country" width="240" 
                >
                <template slot-scope="scope">
                  <span>{{getTopRegionLabel(scope.row.topRegion)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="detail"
                label="Address"
                >
                <template slot-scope="scope">
                  <span>{{getRegionDetail(scope.row.detail)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Actions"
                width="240"
                >
                <template slot-scope="scope">
                  <el-button size="small" class="meebidSquareButton" icon="el-icon-edit" @click="handleEditAddress(scope.row)"></el-button>
                  <el-button size="small" class="meebidSquareButton" icon="el-icon-delete" @click="handleDeleteAddress(scope.row)"></el-button>
                  <el-button size="small" v-if="scope.row.isDefault !== true" class="meebidSquareButton" @click="handleSetDefaultAddress(scope.row)">Set as Default</el-button>
                  <span v-else class="meebidAddressTableDefaultLabel">Default</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="active === 'houseProfile'" class="meebidPaddingTopMedium">
            <span class="meebidAddressManagementTableHeader meebidPaddingLeftSmall meebidPaddingBottomSmall meebidPaddingTopMedium">Bidding Venue Address</span>
            <el-button size="small" type="primary" v-if="this.addresses[64].length < 5" class="meebidSquareButton meebidMarginBottomSmall meebidMarginLeftSmall" @click="handleAddAddress(64)">Add</el-button>
            <el-alert show-icon v-if="this.addresses[64].length === 5" class="meebidMarginBottomSmall meebidMaximumAddressAlertMessage" :closable="false"
                title="You cannot have more than 5 same type addresses."
                type="warning">
            </el-alert>
            <el-table
              :data="addresses[64]"
              border
              style="width: 100%">
              <el-table-column
                label="Country" width="240" 
                >
                <template slot-scope="scope">
                  <span>{{getTopRegionLabel(scope.row.topRegion)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="detail"
                label="Address"
                >
                <template slot-scope="scope">
                  <span>{{getRegionDetail(scope.row.detail)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Actions"
                width="240"
                >
                <template slot-scope="scope">
                  <el-button size="small" class="meebidSquareButton" icon="el-icon-edit" @click="handleEditAddress(scope.row)"></el-button>
                  <el-button size="small" class="meebidSquareButton" icon="el-icon-delete" @click="handleDeleteAddress(scope.row)"></el-button>
                  <el-button size="small" v-if="scope.row.isDefault !== true" class="meebidSquareButton" @click="handleSetDefaultAddress(scope.row)">Set as Default</el-button>
                  <span v-else class="meebidAddressTableDefaultLabel">Default</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="height: 50px;"></div>
        </div>
        <div v-if="active === 'message'">
          Placeholder for Message Box
        </div>
      </div>
      <el-dialog :visible.sync="previewDialogVisible">
        <img width="100%" :src="previewDialogImageUrl" alt="">
      </el-dialog>

      <el-dialog :visible.sync="phoneNumberDialogVisible" class="meebidPhoneNumberDialog" title="Phone Number" width="500px" :close-on-click-modal="false">
        <el-form ref="phoneFormRef" :model="phoneForm" :rules="phoneFormRules" class="" label-width="0px">
          <el-form-item prop="phone">
            <el-input v-model="phoneForm.phone" placeholder="Please input phone number">
              <el-select v-model="phoneForm.region" style="width:110px;" slot="prepend" placeholder="Select...">
                <el-option
                  v-for="item in regionOptions"
                  :key="item.id"
                  :label="item.telCode"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="phoneNumberDialogVisible = false" class="">Cancel</el-button>
          <el-button type="primary" @click="onSavePhoneNumber" class="">Save</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="contactUserDialogVisible" class="meebidPhoneNumberDialog" title="Contact User" width="800px" :close-on-click-modal="false">
        <el-form ref="contactUserFormRef" :model="contactUserForm" :rules="contactUserFormRules" class="" label-width="190px">
          <el-form-item label="Title" prop="title">
            <el-select v-model="contactUserForm.titleId" placeholder="Select...">
              <el-option
                v-for="item in titleOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="First Name & Last Name" required>
            <el-col :span="11">
              <el-form-item prop="firstName">
                <el-input v-model="contactUserForm.firstName" class="meebidUserProfileUserName meebidFormFieldLargeLength" placeholder="Please input First Name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="lastName">
                <el-input v-model="contactUserForm.lastName" class="meebidUserProfileUserName meebidFormFieldLargeLength" placeholder="Please input Last Name"></el-input>
              </el-form-item>
            </el-col>
            
          </el-form-item>
          <el-form-item prop="phone" label="Phone Number 1">
            <el-input v-model="contactUserForm.phone" placeholder="Please input phone number">
              <el-select v-model="contactUserForm.region" style="width:110px;" slot="prepend" placeholder="Select...">
                <el-option
                  v-for="item in regionOptions"
                  :key="item.id"
                  :label="item.telCode"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item prop="phone1" label="Phone Number 2">
            <el-input v-model="contactUserForm.phone1" placeholder="Please input phone number">
              <el-select v-model="contactUserForm.region1" style="width:110px;" slot="prepend" placeholder="Select...">
                <el-option
                  v-for="item in regionOptions"
                  :key="item.id"
                  :label="item.telCode"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="contactUserForm.email" placeholder="Please input email address"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="contactUserDialogVisible = false" class="">Cancel</el-button>
          <el-button type="primary" @click="onSaveContactUser" class="">Save</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="addressDialogVisible" class="" title="Address" width="800px" :close-on-click-modal="false">
        <el-form ref="addressForm" status-icon :rules="addressFormRules" :model="addressForm" label-width="180px" class="meebidHouseProfileForm">
          
          <el-form-item label="Country" prop="topRegion">
            <el-select @change="handleAddressChange" :options="regionOptions" style="width: 300px;" v-model="addressForm.topRegion" placeholder="Select...">
              <el-option
                v-for="item in regionOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
            v-for="(item, index) in currentAddressRule" :label="$t(item.labelKey)" :prop="item.name" 
            :rules="item.validateFunc ? {
              required: item.isRequired, 
              trigger: 'change',
              validator: getAddressFieldValidator(item.validateFunc)
            } :  item.controlType !== 'label' ? {
              required: item.isRequired, 
              message: 'Please input ' + $t(item.labelKey), 
              trigger: 'change'
            } : {}">
            <el-input v-if="item.controlType === 'input'" v-model="addressForm[item.name]" :placeholder="'Please input ' + $t(item.labelKey)" @change="item.forwardFunc ? onAddressAfterChangeFunc($event, item.name, item.forwardFunc) : function(){}"></el-input>
            <el-select style="width: 300px;" v-else-if="item.controlType === 'select' && item.name === 'secRegion'" v-model="addressForm[item.name]" :placeholder="'Please input ' + $t(item.labelKey)" @change="handleSecondRegionChange">
              <el-option
                v-for="regionItem in getRegionOptions(regionOptions, [addressForm['topRegion']])"
                :key="regionItem.id"
                :label="regionItem.name"
                :value="regionItem.id">
              </el-option>
            </el-select>
            <el-select style="width: 300px;" v-else-if="item.controlType === 'select' && item.name === 'botRegion'" v-model="addressForm[item.name]" :placeholder="'Please input ' + $t(item.labelKey)" >
              <el-option
                v-for="regionItem in getRegionOptions(regionOptions, [addressForm['topRegion'], addressForm['secRegion']])"
                :key="regionItem.id"
                :label="regionItem.name"
                :value="regionItem.id">
              </el-option>
            </el-select>
            <el-select style="width: 300px;" v-else-if="item.controlType === 'select'" v-model="addressForm[item.name]" :placeholder="'Please input ' + $t(item.labelKey)">
              <el-option
                v-for="optionItem in (item.options || [])"
                :key="optionItem.id"
                :label="optionItem.label ? optionItem.label: optionItem.name"
                :value="optionItem.id">
              </el-option>
            </el-select>
            <el-input style="width: 100px;" v-else-if="item.controlType === 'label'" v-model="addressForm[item.name]" :disabled="true"></el-input>


          </el-form-item>
          <!--<el-form-item label="Address" prop="detail">
            <el-input v-model="addressForm.detail" placeholder="Please input address"></el-input>
          </el-form-item>-->
          <el-form-item label="Address Type">
            <el-select v-model="addressForm.type" placeholder="Select..." :disabled="true">
              <el-option
                v-for="item in (active === 'memberProfile' ? memberAddressOptions : houseAddressOptions)"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Set as default">
            <el-checkbox v-model="addressForm.isDefault"></el-checkbox>
          </el-form-item>
          <!--<el-form-item>
            <el-button type="primary" :disabled="isUpdateAddressButtonDisabled" @click="onUpdateAddress">SAVE</el-button>
            <el-button type="primary" :disabled="isUpdateAddressButtonDisabled" @click="onResetAddress">RESET</el-button>
            <div style="width: 100%; height: 34px; margin-top: 10px;">
              <el-alert show-icon v-if="isUpdateAddressButtonDisabled" class="meebidMarginTopSmall meebidMaximumAddressAlertMessage" :closable="false"
                title="You cannot have more than 5 same type addresses."
                type="warning">
              </el-alert>
            </div>
          </el-form-item>-->
          <meebid-busy-indicator ref="addressFormBusyIndicator" size="Medium"></meebid-busy-indicator>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addressDialogVisible = false" class="">Cancel</el-button>
          <el-button type="primary" @click="onUpdateAddress()" class="">Save</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="auctionDialogVisible" class="meebidAuctionDialog" title="Auction" width="800px" height="600px" :close-on-click-modal="false">
        <el-tabs type="border-card" v-model="auctionDialogActiveTab" @tab-click="handleAuctionDialogTabClick">
          <el-tab-pane name="auctionBasic">
            <span slot="label">Basic</span>
            <el-alert v-if="isAddAuction" show-icon class="meebidUnsavedAlertMessage" :closable="false"
              :title="$t('meebid.alertMessage.MSG_ADMIN_USING_DEFAULT_HOUSE_TERMS_TEXT')"
              type="info">
            </el-alert>
            <el-form ref="auctionForm" status-icon :rules="auctionFormRules" style="width: 80%;" :model="auctionForm" label-width="180px" class="meebidHouseProfileForm">        
              <el-form-item label="Name" prop="name">
                <el-input v-model="auctionForm.name" placeholder="Please input auction name"></el-input>
              </el-form-item>
              <el-form-item label="Description" prop="description">
                <el-input class="meebidAdminAuctionDescription" type="textarea" v-model="auctionForm.description" placeholder="Please input description"></el-input>
              </el-form-item>
              <el-form-item label="Auction Type" prop="type">
                <el-select v-model="auctionForm.type" placeholder="Select...">
                  <el-option
                    v-for="item in auctionTypeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Logo" prop="bLogo" required>
                <meebid-upload
                  class="upload-demo"
                  ref="bAuctionLogo"
                  field-name="bLogo"
                  list-type="picture-card"
                  :multiple="false"
                  :limit="1"
                  :on-exceed="handleUploadExceed"
                  :on-remove="handleUploadLogoSuccess"
                  :on-success="handleUploadLogoSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-error="handleUploadError"
                  :file-list="auctionForm.bLogo"
                  >
                  <i class="el-icon-plus"></i>
                </meebid-upload>
              </el-form-item>
              <el-form-item label="Auction Time" prop="startAt">
                <el-form-item >
                  <el-date-picker type="datetime" placeholder="Select date" v-model="auctionForm.startAt" style="width: 100%;" :format="$t('meebid.common.MSG_DATE_NO_SECOND_FORMAT')" default-time="09:00:00" ></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Currency Code" prop="currencyCode">
                <el-select v-model="auctionForm.currencyCode" filterable placeholder="Select...">
                  <el-option
                    v-for="item in currencyCodeOptions"
                    :key="item.id"
                    :label="item.alias"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Pick-up Warehouse Address" class="meebidUserProfileLongLabel" prop="pickupLocId">
                <el-select v-model="auctionForm.pickupLocId" placeholder="Select..." v-if="addresses[128] && addresses[128].length > 0">
                  <el-option
                    v-for="item in addresses[128]"
                    :key="item.id"
                    :label="getAddressLabel(item)"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-alert v-else show-icon class="meebidUnsavedAlertMessage" :closable="false"
                  :title="$t('meebid.alertMessage.MSG_ADMIN_NO_PICK_UP_WAREHOUSE_ADDRESS_SELECTABLE')"
                  type="error">
                </el-alert>
              </el-form-item>
              <el-form-item label="Bidding Venue Address" class="" prop="biddingLocId">
                <el-select v-model="auctionForm.biddingLocId" clearable placeholder="Select...">
                  <el-option
                    v-for="item in addresses[64].concat(onlineOnlyOption)"
                    :key="item.id"
                    :label="getAddressLabel(item)"
                    :value="item.id">
                  </el-option>
                </el-select>
                <!--<el-alert v-else show-icon class="meebidUnsavedAlertMessage" :closable="false"
                  :title="$t('meebid.alertMessage.MSG_ADMIN_NO_ADDRESS_SELECTABLE')"
                  type="warning">
                </el-alert>-->
              </el-form-item>
              <!--<el-form-item label="Exhibition Address" class="meebidUserProfileLongLabel" prop="exhLocId">
                <el-select v-model="auctionForm.exhLocId" clearable placeholder="Select..." v-if="addresses[32] && addresses[32].length > 0">
                  <el-option
                    v-for="item in addresses[32]"
                    :key="item.id"
                    :label="getAddressLabel(item)"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-alert v-else show-icon class="meebidUnsavedAlertMessage" :closable="false"
                  :title="$t('meebid.alertMessage.MSG_ADMIN_NO_ADDRESS_SELECTABLE')"
                  type="warning">
                </el-alert>
              </el-form-item>
              <el-form-item label="Exhibition Time" prop="exhTime">
                <el-form-item prop="exhTime" v-if="addresses[32] && addresses[32].length > 0">
                  <el-date-picker type="datetime" placeholder="Select date" v-model="auctionForm.exhTime" default-time="09:00:00" style="width: 100%;" :format="$t('meebid.common.MSG_DATE_NO_SECOND_FORMAT')"></el-date-picker>
                  <el-date-picker type="datetimerange" placeholder="Select date" v-model="auctionForm.exhTime" :default-time="['09:00:00', '17:00:00']" style="width: 100%;" :format="$t('meebid.common.MSG_DATE_NO_SECOND_FORMAT')"></el-date-picker>
                </el-form-item>
                <el-alert v-else show-icon class="meebidUnsavedAlertMessage" :closable="false"
                  :title="$t('meebid.alertMessage.MSG_ADMIN_NO_ADDRESS_SELECTABLE')"
                  type="warning">
                </el-alert>
              </el-form-item>-->
              <el-form-item label="Exhibitions">
                <div v-for="(item,index) in auctionForm.exhibitions" v-if="item.state !== 0" :class="{meebidPaddingBottomSmall: index === auctionForm.exhibitions.length}">
                  <span style="display: inline-block; width: 300px;" class="meebidVerticalAlignTop">{{formatDateWithoutSecond(item.startAt)}} - {{formatDateWithoutSecond(item.endAt)}}</span>
                  <span class="meebidPaddingLeftSmall meebidVerticalAlignTop">
                    <el-button size="small" class="meebidNoBorderButton meebidVerticalAlignTop" icon="el-icon-edit" @click="onEditExhibition(index, item)"></el-button>
                    <el-button size="small" icon="el-icon-delete" class="meebidNoBorderButton meebidVerticalAlignTop" @click="onDeleteExhibition(index, item)"></el-button>
                  </span>
                  <span style="display: inline-block; margin-top: -10px;" class="meebidVerticalAlignTop">{{getAddressLabelById(item.locId)}}</span>
                </div>
                <div class="" v-if="addresses[32] && addresses[32].length > 0"><el-button size="small" type="primary" @click="onAddExhibition">Add Exhibition</el-button></div>
                <el-alert v-else show-icon class="meebidUnsavedAlertMessage" :closable="false"
                  :title="$t('meebid.alertMessage.MSG_ADMIN_NO_ADDRESS_SELECTABLE')"
                  type="warning">
                </el-alert>
                
              </el-form-item>

              <meebid-busy-indicator ref="auctionFormBusyIndicator" size="Medium"></meebid-busy-indicator>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Terms" name="auctionTerms">
            <meebid-busy-indicator ref="auctionDialogTermsIndicator" size="Medium"></meebid-busy-indicator>
            <el-alert v-if="isAddAuction" show-icon class="meebidUnsavedAlertMessage" :closable="false"
              :title="$t('meebid.alertMessage.MSG_ADMIN_USING_DEFAULT_HOUSE_TERMS_TEXT')"
              type="info">
            </el-alert>
            <el-form label-width="180px" ref="auctionTermsForm" class="meebidHouseProfileForm" :model="auctionForm" :rules="auctionFormRules" status-icon>
              <el-form-item label="Terms and Condition" prop="termsAndCondition">
                <meebid-text-editor ref="termsEditorAuction" style="height: 200px;" compId="termsAuction" v-model="auctionForm.termsAndCondition" class="meebidFormFieldMediumLength" placeholder="Please input Terms and Condition"></meebid-text-editor>
              </el-form-item>
              <el-form-item label="Payment Info" prop="paymentInfo">
                <meebid-text-editor ref="paymentEditorAuction" compId="paymentInfoAuction" style="height: 200px;" v-model="auctionForm.paymentInfo" class="meebidFormFieldMediumLength" placeholder="Please input Payment Info"></meebid-text-editor>
              </el-form-item>
              <el-form-item label="Shipping Info" prop="shippingInfo">
                <meebid-text-editor ref="shipingEditorAuction" compId="shippingInfoAuction" style="height: 200px;" v-model="auctionForm.shippingInfo" class="meebidFormFieldMediumLength" placeholder="Please input Shipping Info"></meebid-text-editor>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer">
          <el-button @click="auctionDialogVisible = false" class="">Cancel</el-button>
          <el-button type="primary" @click="onUpdateAuction()" :disabled="!(addresses[128] && addresses[128].length > 0)">{{getAuctionDialogSubmitText(auctionForm.state)}}</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="lotDialogVisible" class="meebidLotDialog" title="Lot" width="820px" height="600px" :close-on-click-modal="false">
        <el-tabs type="border-card" v-model="lotDialogActiveTab" @tab-click="handleLotDialogTabClick">
          <el-tab-pane name="lotBasic">
            <span slot="label">Basic</span>
            <el-alert v-if="isAddLot" show-icon class="meebidUnsavedAlertMessage" :closable="false"
              :title="$t('meebid.alertMessage.MSG_ADMIN_USING_DEFAULT_AUCTION_TERMS_TEXT')"
              type="info">
            </el-alert>
            <el-form ref="lotForm" status-icon :rules="lotFormRules" style="width: 80%;" :model="lotForm" label-width="180px" class="meebidHouseProfileForm">        
              <el-form-item label="Name" prop="name">
                <el-input v-model="lotForm.name" placeholder="Please input lot name"></el-input>
              </el-form-item>
              <el-form-item label="Description" prop="description">
                <el-input type="textarea" class="meebidAdminAuctionDescription" v-model="lotForm.description" placeholder="Please input description"></el-input>
              </el-form-item>
              <el-form-item label="Lot No." prop="no">
                <el-input-number v-model="lotForm.no" :min="1" placeholder="Please input lot number"></el-input-number>
              </el-form-item>
              <el-form-item label="Category" prop="category">
                <el-cascader :options="categoryItems" v-model="lotForm.category" :props="categoryProp" placeholder="Select...">
                </el-cascader>
              </el-form-item>
              <!--<el-form-item label="Category" prop="category">
                <el-select v-model="lotForm.category" filterable placeholder="Select...">
                  <el-option
                    v-for="item in categoryItems"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item label="Min Est. Price" prop="estMinPrice">
                <meebid-number-input v-model="lotForm.estMinPrice" placeholder="Please input minimum estimation price"></meebid-number-input>
              </el-form-item>
              <el-form-item label="Max Est. Price" prop="estMaxPrice">
                <meebid-number-input v-model="lotForm.estMaxPrice" placeholder="Please input maximum estimation price"></meebid-number-input>
              </el-form-item>
              <el-form-item label="Start Bidding Price" prop="startingBid">
                <meebid-number-input v-model="lotForm.startingBid" placeholder="Please input start bidding price"></meebid-number-input>
              </el-form-item>
              <el-form-item label="Reserve Price" prop="reservePrice">
                <meebid-number-input v-model="lotForm.reservePrice" placeholder="Please input reserve price"></meebid-number-input>
              </el-form-item>
              <el-form-item label="Images" prop="imageUrls" required>
                <meebid-upload
                  class="meebidUploadSmallPicture"
                  ref="bImages"
                  field-name="imageUrls"
                  list-type="picture-card"
                  :multiple="true"
                  :limit="20"
                  :on-exceed="handleUploadExceed"
                  :on-remove="handleUploadLotImageSuccess"
                  :on-exchange="handleUploadLotImageSuccess"
                  :on-success="handleUploadLotImageSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-error="handleUploadError"
                  :file-list="lotForm.imageUrls"
                  >
                  <i class="el-icon-plus"></i>
                </meebid-upload>
              </el-form-item>
              
              <meebid-busy-indicator ref="auctionFormBusyIndicator" size="Medium"></meebid-busy-indicator>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Terms" name="lotTerms">
            <meebid-busy-indicator ref="lotDialogTermsIndicator" size="Medium"></meebid-busy-indicator>
            <el-alert v-if="isAddLot" show-icon class="meebidUnsavedAlertMessage" :closable="false"
              :title="$t('meebid.alertMessage.MSG_ADMIN_USING_DEFAULT_AUCTION_TERMS_TEXT')"
              type="info">
            </el-alert>
            <el-form label-width="180px" ref="lotTermsForm" class="meebidHouseProfileForm" :model="lotForm" :rules="lotFormRules" status-icon>
              <el-form-item label="Terms and Condition" prop="termsAndCondition">
                <meebid-text-editor ref="termsEditorAuction" style="height: 200px;" compId="termsAuction" v-model="lotForm.termsAndCondition" class="meebidFormFieldMediumLength" placeholder="Please input Terms and Condition"></meebid-text-editor>
              </el-form-item>
              <el-form-item label="Payment Info" prop="paymentInfo">
                <meebid-text-editor ref="paymentEditorAuction" compId="paymentInfoAuction" style="height: 200px;" v-model="lotForm.paymentInfo" class="meebidFormFieldMediumLength" placeholder="Please input Payment Info"></meebid-text-editor>
              </el-form-item>
              <el-form-item label="Shipping Info" prop="shippingInfo">
                <meebid-text-editor ref="shipingEditorAuction" compId="shippingInfoAuction" style="height: 200px;" v-model="lotForm.shippingInfo" class="meebidFormFieldMediumLength" placeholder="Please input Shipping Info"></meebid-text-editor>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer">
          <el-button @click="lotDialogVisible = false" class="">Cancel</el-button>
          <el-button type="primary" @click="onUpdateLot()">Save</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="batchLotDialogVisible" class="meebidBatchLotDialog" title="Batch Upload Lots" width="1100px" height="500px" :close-on-click-modal="false">
        <meebid-busy-indicator ref="batchLotDialogBusyIndicator" size="Medium"></meebid-busy-indicator>
        <el-steps :active="batchLotDialogStep" finish-status="success" align-center>
          <el-step title="Upload Template"></el-step>
          <el-step title="Upload Images"></el-step>
          <el-step title="Review and Save"></el-step>
        </el-steps>
        <div v-if="batchLotDialogStep == 0" class="meebidPaddingTopMedium" style="height: 100px;">
          <el-form ref="batchLotStep1Form" status-icon :rules="batchLotFormRules" style="" :model="batchLotForm" label-width="180px" class="meebidHouseProfileForm">
            <el-form-item label="Template" prop="batchTemplate" required>
              <el-col :span="11">
                <meebid-upload
                  field-name="batchTemplate"
                  :limit="1"
                  :on-exceed="handleUploadExceed"
                  :on-remove="handleUploadLotTemplateSuccess"
                  :on-success="handleUploadLotTemplateSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-error="handleUploadError"
                  :file-list="batchLotForm.batchTemplate"
                  >
                  <el-button size="small" type="primary">Click to upload template</el-button>
                </meebid-upload>
              </el-col>
              <el-col :span="11" style="text-align:right;">
                <el-dropdown @command="handleBatchUploadDialogCommand">
                  <el-button size="small" type="primary">
                    Actions<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="downloadSample">Download Sample Template</el-dropdown-item>
                    <el-dropdown-item command="exportLots">Export All Lots</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-form-item>
            
            
            
          </el-form>
        </div>
        <div v-if="batchLotDialogStep == 1" class="meebidPaddingTopMedium" style="">
          <el-form ref="batchLotStep2Form" status-icon :rules="batchLotFormRules" style="width: 90%; overflow: scroll;" :model="batchLotForm" label-width="180px" class="meebidHouseProfileForm">        
            <el-form-item label="Upload Images" prop="imageUrls" required>
              <meebid-upload
                class="meebidUploadMiniPicture"
                :allowSameFileName="false"
                field-name="imageUrls"
                :uploadKey="uploadKeyForBatchLotImages"
                :multiple="true"
                :on-exceed="handleUploadExceed"
                :on-remove="handleUploadLotsImageSuccess"
                :on-success="handleUploadLotsImageSuccess"
                :on-preview="handlePictureCardPreview"
                :on-error="handleUploadError"
                :file-list="batchLotForm.imageUrls"
                >
                <el-button size="small" type="primary">Click to upload images</el-button>
              </meebid-upload>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          border
          empty-text=" "
          :height="batchLotDialogStep <= 1 ? 350 : 450"
          class="meebidMarginTopLarge"
          v-loading="batchTemplateTableLoading"
          element-loading-text="Validating Template"
          element-loading-spinner="el-icon-loading"
          :data="batchLotTemplateResult"
          style="width: 90%; margin-left: 5%;">
          <el-table-column
            prop="no"
            fixed
            label="No."
            width="50">
            <template slot-scope="scope">
              <span>{{formatLotNo(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            fixed
            label="Name"
            width="160">
          </el-table-column>
          <el-table-column
            prop="category"
            width="180"
            label="Category">
          </el-table-column>
          <el-table-column
            prop="description"
            width="240"
            label="Description">
          </el-table-column>
          <el-table-column
            prop="estMinPrice"
            width="180"
            label="Min Est. Price">
            <template slot-scope="scope">
              <span>{{getFormattedCurrencyNumber(scope.row.estMinPrice)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="estMaxPrice"
            width="180"
            label="Max Est. Price">
            <template slot-scope="scope">
              <span>{{getFormattedCurrencyNumber(scope.row.estMaxPrice)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="startingBid"
            width="180"
            label="Start Bidding Price">
            <template slot-scope="scope">
              <span>{{getFormattedCurrencyNumber(scope.row.startingBid)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reservePrice"
            width="180"
            label="Reserve Price">
            <template slot-scope="scope">
              <span>{{getFormattedCurrencyNumber(scope.row.reservePrice)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="imageUrls"
            fixed="right"
            label="Lot Images"
            width="200"
            class-name="meebidBatchLotUploadedImageColumn"
            >
            <template slot-scope="scope">
              <div :style="{width: scope.row.imageUrls && scope.row.imageUrls.length ? (scope.row.imageUrls.length) * 68 + 'px' : 'auto'}">
                <div v-for="(item, index) in scope.row.imageUrls" class="meebidBatchLotUploadedImageContainer">
                  <img :src="item.url" class="meebidBatchLotUploadedImage">
                  </img>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <span class="meebidBatchUploadDialogHintLabel">{{batchUploadHintLabel}}</span>
          <el-button @click="batchLotDialogVisible = false" class="">Cancel</el-button>
          <!--<el-button type="primary" v-if="batchLotDialogStep > 0" @click="onBackBatchStep()">Back</el-button>-->
          <el-button type="primary" @click="onResetBatchStep()">Reset</el-button>
          <el-button type="primary" v-if="batchLotDialogStep < 2" :disabled="batchLotDialogStep === 0 ? !isBatchLotFormStep1Valid : !isBatchLotFormStep2Valid" @click="onNextBatchStep()">Next</el-button>
          <el-button type="primary" v-if="batchLotDialogStep == 2" @click="onUpdateLots()">Save</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="exhibitionDialogVisible" class="meebidExhibitionDialog" title="Exhibition Address" width="800px" height="500px" :close-on-click-modal="false">        
        <el-form ref="exhibitionForm" status-icon :rules="exhibitionFormRules" style="width: 90%;" :model="exhibitionForm" label-width="180px" class="meebidHouseProfileForm">
          <el-form-item label="Exhibition Location" class="" prop="locId">
            <el-select v-model="exhibitionForm.locId" clearable placeholder="Select..." v-if="addresses[32] && addresses[32].length > 0">
              <el-option
                v-for="item in addresses[32]"
                :key="item.id"
                :label="getAddressLabel(item)"
                :value="item.id">
              </el-option>
            </el-select>
            <el-alert v-else show-icon class="meebidUnsavedAlertMessage" :closable="false"
              :title="$t('meebid.alertMessage.MSG_ADMIN_NO_ADDRESS_SELECTABLE')"
              type="warning">
            </el-alert>
          </el-form-item>
          <el-form-item label="Exhibition Time" required>
            <el-col :span="11">
              <el-form-item prop="exhibitionDate">
                <el-date-picker type="date" placeholder="Exhibition Date" v-model="exhibitionForm.exhibitionDate" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" style="text-align: center;"></el-col>
            <el-col :span="11" class="meebidPaddingTopMedium">
              <el-form-item prop="exhibitionStartTime">
                <el-time-select
                  placeholder="Start Time"
                  v-model="exhibitionForm.exhibitionStartTime"
                  :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:45'
                  }">
                </el-time-select>
              </el-form-item>
            </el-col>
            <el-col class="line meebidPaddingTopMedium" :span="2" style="text-align: center; margin-left: -10px;">-</el-col>
            <el-col :span="11" class="meebidPaddingTopMedium">
              <el-form-item prop="exhibitionEndTime">
                <el-time-select
                  placeholder="End Time"
                  v-model="exhibitionForm.exhibitionEndTime"
                  :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:45',
                    minTime: exhibitionForm.exhibitionStartTime
                  }">
                </el-time-select>
              </el-form-item>
              <!--<el-time-picker ref="exhibitionTimePicker" is-range start-placeholder="Start Time" end-placeholder="End Time" v-model="exhibitionForm.exhibitionTime" style="width: 100%;"></el-time-picker>-->
            </el-col>
            
          </el-form-item>
          <!--<el-form-item label="Exhibition Time" prop="exhibitionTime">
            <el-date-picker type="datetimerange" placeholder="Select date" v-model="exhibitionForm.exhibitionTime" :default-time="['09:00:00', '22:00:00']" style="width: 100%;" :format="$t('meebid.common.MSG_DATE_NO_SECOND_FORMAT')"></el-date-picker>
          </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exhibitionDialogVisible = false" class="">Cancel</el-button>
          <el-button type="primary" @click="onUpdateExhibitions()">Save</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="batchLotImagesDialogVisible" class="meebidBatchLotImagesDialog" title="Batch Upload Images" width="900px" height="500px" :close-on-click-modal="false">
        <meebid-busy-indicator ref="batchLotDialogImagesBusyIndicator" size="Medium"></meebid-busy-indicator>
        <div class="" style="">
          <el-form ref="batchImagesForm" status-icon :rules="batchImagesFormRules" style="width: 90%; overflow: scroll;" :model="batchImagesForm" label-width="180px" class="meebidHouseProfileForm">        
            <el-form-item label="Upload Images" prop="imageUrls" required>
              <meebid-upload
                class="meebidUploadMiniPicture"
                :allowSameFileName="false"
                field-name="imageUrls"
                :uploadKey="uploadKeyForBatchImages"
                :multiple="true"
                :on-exceed="handleUploadExceed"
                :on-remove="handleUploadBatchImageSuccess"
                :on-success="handleUploadBatchImageSuccess"
                :on-preview="handlePictureCardPreview"
                :on-error="handleUploadError"
                :file-list="batchImagesForm.imageUrls"
                >
                <el-button size="small" type="primary">Click to upload images</el-button>
              </meebid-upload>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          border
          empty-text=" "
          height="350"
          class="meebidMarginTopLarge"
          :data="batchLotImages"
          style="width: 90%; margin-left: 5%;">
          <el-table-column
            prop="no"
            fixed
            label="No."
            width="80">
            <template slot-scope="scope">
              <span>{{formatLotNo(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="imageUrls"
            label="Lot Images"
            class-name="meebidBatchLotUploadedImageColumn"
            >
            <template slot-scope="scope">
              <div :style="{width: scope.row.imageUrls && scope.row.imageUrls.length ? (scope.row.imageUrls.length) * 68 + 'px' : 'auto'}">
                <div v-for="(item, index) in scope.row.imageUrls" class="meebidBatchLotUploadedImageContainer">
                  <img :src="item.url" class="meebidBatchLotUploadedImage">
                  </img>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <span class="meebidBatchUploadDialogHintLabel">{{batchUploadImagesHintLabel}}</span>
          <el-button @click="batchLotImagesDialogVisible = false" class="">Cancel</el-button>
          <el-button type="primary" :disabled="!isBatchLotImageFormValid" @click="onUpdateLotImages()">Update</el-button>
        </span>
      </el-dialog>
      <meebid-category-dialog :items="categoryItems" :favorCategories="userProfileForm && userProfileForm.favorCategories ? userProfileForm.favorCategories : []" :isProfilePage="isProfilePage" @update="onCategoryDialogUpdate" ref="categoryDialog">
      </meebid-category-dialog>
    </div>
  </div>
</template>

<script>
import loginUtils from './../../utils/loginUtils'
import errorUtils from './../../utils/errorUtils'
import meebidUtils from './../../utils/meebidUtils'
import i18n from './../../i18n/i18n'
import $ from 'jquery'

var addressValidator = {
  validateStateForUS: function(rule, value, callback) {
    var reg = /^\d{5}\b/;
    if (value) {
      if(reg.test(value)){
        callback();
      }else{
        callback(new Error('Please input correct Postal Code'));
      } 
    } else {
      callback(new Error('Please input Postal Code'));
    }
  }
}

export default {
  data () {
    var currentDate = new Date();
    var validateBatchTemplate = (rule, value, callback) => {
      var me = this;
      if (value && value.length > 0 && value[0].rUid) {
        this.batchTemplateTableLoading = true;
        $.ajax({
          type: "POST",
          url: "/api/lot/batch/info/prepare",
          contentType : "application/json", 
          context: this,
          headers: {
            token: this.loginUser.token
          },
          data: JSON.stringify({
            sceneId: this.currentSceneId,
            erUid: value[0].rUid
          }),
          success(data) {
            if (data.code === 1){
              this.isBatchLotFormStep1Valid = true;
              for (var i = 0; i < data.content.items.length; i++){
                data.content.items[i].imageUrls = [];
              }
              if (data.content && data.content.conflictItems && data.content.conflictItems.length){
                for (var j = 0; j < data.content.items.length; j++){
                  data.content.items[j].isConflict = false;
                  for (var i = 0; i < data.content.conflictItems.length; i++){
                    if(data.content.conflictItems[i].no === data.content.items[j].no){
                      data.content.items[j].isConflict = true;
                      break;
                    }
                  }
                }
              }
              this.batchLotTemplateResult = data.content.items;
              callback();
            } else {
              this.$notify.error({
                title: 'Failure',
                message: 'Validate Template failure',
                duration: 5000
              });
              this.batchLotTemplateResult = [];
              this.isBatchLotFormStep1Valid = false;
              callback(new Error('Validate template failed'));
            }

          },
          error(data) {
            errorUtils.requestError(data);
            me.batchLotTemplateResult = [];
            me.isBatchLotFormStep1Valid = false;
            callback(new Error('Error in validate template'));
          }
        }).done(function(){
          me.batchTemplateTableLoading = false;
        });
      } else {
        this.batchLotTemplateResult = [];
        this.isBatchLotFormStep1Valid = false;
        callback(new Error('Please upload lots template.'));
      }
    };
    var validateBatchLotsImages = (rule, value, callback) => {
      var me = this;
      if (value && value.length > 0) {
        var tempResult = this.batchLotTemplateResult.concat();
        for (var k = 0; k < tempResult.length; k++){
          tempResult[k].imageUrls = [];
        }
        for (var i = 0; i < value.length; i++){
          if (value[i].status !== "success"){
            continue;
          }
          var imagePrefix = value[i].name.split(".")[0];
          var imageArr = imagePrefix.split("-");
          if (imageArr && imageArr.length === 2 && meebidUtils.isNumber(parseInt(imageArr[0])) && meebidUtils.isNumber(parseInt(imageArr[1]))){
            var imageNo = imageArr[0];
            var imageIdx = imageArr[1];
            for (var j = 0; j < tempResult.length; j++){
              if (tempResult[j].no === parseInt(imageNo)){
                tempResult[j].imageUrls.push({
                  name: value[i].name,
                  rUid: value[i].rUid,
                  url: value[i].url
                });
              }
            }
          } else {
            this.isBatchLotFormStep2Valid = false;
            callback(new Error("Image file name must follow LotNo-Index.jpg/gif/png, like 1-1.jpg. Please remove invalid image file."));
            return;
          }
          
        }
        for (var k = 0; k < tempResult.length; k++){
          if(tempResult[k].imageUrls.length === 0 && !tempResult[k].isConflict){
            callback(new Error('You have new lot without image, please make sure every new lot contains at least one image.'));
            this.isBatchLotFormStep2Valid = false;
            return;
          }
        }
        this.batchLotTemplateResult = tempResult;
        this.isBatchLotFormStep2Valid = true;
        callback();
      } else {
        this.isBatchLotFormStep2Valid = false;
        callback(new Error('Please upload lots images.'));
      }
    };
    var validateBatchImages = (rule, value, callback) => {
      var me = this;
      if (value && value.length > 0) {
        var batchLotImages = [];

        for (var i = 0; i < value.length; i++){
          if (value[i].status !== "success"){
            continue;
          }
          var imagePrefix = value[i].name.split(".")[0];
          var imageArr = imagePrefix.split("-");
          if (imageArr && imageArr.length === 2 && meebidUtils.isNumber(parseInt(imageArr[0])) && meebidUtils.isNumber(parseInt(imageArr[1]))){
            var imageNo = imageArr[0];
            var imageIdx = imageArr[1];

            var batchLotObj = meebidUtils.findObject(batchLotImages, "no", parseInt(imageNo));
            if (!batchLotObj){
              batchLotObj = {
                no: parseInt(imageNo),
                imageUrls: []
              };
              batchLotImages.push(batchLotObj);
            }
            batchLotObj.imageUrls.push({
              name: value[i].name,
              rUid: value[i].rUid,
              url: value[i].url
            });
          } else {
            this.isBatchLotImageFormValid = false;
            callback(new Error("Image file name must follow LotNo-Index.jpg/gif/png, like 1-1.jpg. Please remove invalid image file."));
            return;
          }
        }
        this.batchLotImages = batchLotImages;
        this.isBatchLotImageFormValid = true;
        callback();
      } else {
        this.isBatchLotImageFormValid = false;
        callback(new Error('Please upload lot images.'));
      }
    };

    var validateRegions = (rule, value, callback) => {
      if (value && value.length > 0) {
        callback();
      } else {
        callback(new Error('Please select regions.'));
      }
    };

    var validateAuctionTerms = (rule, value, callback) => {
      if (value && value.ops && value.ops.length > 0 && value.ops[0].insert !== "\n") {
        callback();
      } else {
        callback(new Error('Please input Terms and Condition.'));
      }
    };
    var validateAuctionPaymentInfo = (rule, value, callback) => {
      if (value && value.ops && value.ops.length > 0 && value.ops[0].insert !== "\n") {
        callback();
      } else {
        callback(new Error('Please input Payment Info.'));
      }
    };
    var validateAuctionShippingInfo = (rule, value, callback) => {
      if (value && value.ops && value.ops.length > 0 && value.ops[0].insert !== "\n") {
        callback();
      } else {
        callback(new Error('Please input Shipping Info.'));
      }
    };
    var validateExhTime = (rule, value, callback) => {
      if (this.auctionForm.exhLocId){
        if (value) {
          callback();
        } else {
          callback(new Error('Please select Exhibition Time for Exhibition Address.'));
        }
      } else {
        callback();
      }
    };
    var validateExhibitionStartTime = (rule, value, callback) => {
      if (this.exhibitionForm.exhibitionStartTime !== '' && this.exhibitionForm.exhibitionEndTime !== '') {
        this.$refs.exhibitionForm.validateField('exhibitionEndTime');
      }
      callback();
    };
    var validateExhibitionEndTime = (rule, value, callback) => {
      if (this.exhibitionForm.exhibitionStartTime !== '' && this.exhibitionForm.exhibitionEndTime !== '') {
        if (new Date("01/01/1900 " + this.exhibitionForm.exhibitionStartTime) >= new Date("01/01/1900 " + this.exhibitionForm.exhibitionEndTime)){
          callback(new Error("End time cannot be late than start time."));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    
    var validateEstMinPrice = (rule, value, callback) => {
      if (this.lotForm.estMinPrice !== '' && this.lotForm.estMaxPrice !== '') {
        this.$refs.lotForm.validateField('estMaxPrice');
      }
      callback();
    };
    var validateEstMaxPrice = (rule, value, callback) => {
      var estMinPrice = parseFloat(this.lotForm.estMinPrice);
      var estMaxPrice = parseFloat(this.lotForm.estMaxPrice);
      if (!isNaN(estMinPrice) && !isNaN(estMaxPrice) && estMaxPrice < estMinPrice) {
        callback(new Error('Max Est. Price cannot less than Min Est. Price.'));
      } else {
        callback();
      }
    };
    var validateLotNo = (rule, value, callback) => {
      var me = this;
      if (value && value > 0) {
        $.ajax({
          type: "GET",
          url: "/api/lot/no/validate",
          contentType : "application/json", 
          context: this,
          headers: {
            token: this.loginUser.token
          },
          data: {
            lotId: this.lotForm.id ? this.lotForm.id : null,
            sceneId: this.currentSceneId,
            lotNo: value
          },
          success(data) {
            if (data.code === 1){
              callback();
            } else if (data.code === -4){
              var messageKey = 'meebid.alertMessage.' + data.msg;
              var replaceObj = {};
              if (data.content.length){
                for (var i = 0; i < data.content.length; i++){
                  replaceObj[i] = data.content[i];
                }
              }
              callback(new Error(i18n.t(messageKey, replaceObj)));
            } else {
              this.$notify.error({
                title: 'Failure',
                message: 'Validate Template failure',
                duration: 5000
              });
              callback(new Error('Validate Lot No. failed'));
            }

          },
          error(data) {
            errorUtils.requestError(data);
            callback(new Error('Error in validate Lot No.'));
          }
        });
      } else {
        callback(new Error('Please select Lot No.'));
      }
    };
    return {
      batchLotImagesDialogVisible: false,
      batchUploadHintLabel: i18n.t('meebid.batchUpload.MSG_BATCH_UPLOAD_HINT_LABEL'),
      batchUploadImagesHintLabel: i18n.t('meebid.batchUpload.MSG_BATCH_UPLOAD_IMAGES_HINT_LABEL'),
      exhibitionTimePickertInitialed: false,
      exhibitionDialogVisible: false,
      isAuctionBasicInvalid: false,
      isLotBasicInvalid: false,
      currentPageForAuction: 1,
      currentPageForAuctionLot: 1,
      totalCountForAuction: 0,
      totalCountForAuctionLot: 0,
      isAddAuction: true,
      isAddLot: true,
      auctionDialogActiveTab: "auctionBasic",
      lotDialogActiveTab: "lotBasic",
      auctionManagementStep: "auctionManagement",
      auctionDialogVisible: false,
      lotDialogVisible: false,
      batchLotDialogVisible: false,
      batchLotDialogStep: 0,
      isBatchLotFormStep1Valid: false,
      isBatchLotFormStep2Valid: false,
      isBatchLotImageFormValid: false,
      uploadKeyForBatchLotImages: "batchLotImages" + loginUtils.getLoginUser().token + currentDate.getTime(),
      uploadKeyForBatchImages: "batchImages" + loginUtils.getLoginUser().token + currentDate.getTime(),
      batchLotTemplateResult: [],
      batchTemplateTableLoading: false,
      addressDialogVisible: false,
      hasPendingChange: false,
      updatePhoneIndex: -1,
      phoneNumberDialogVisible: false,
      updateContactUserIndex: -1,
      contactUserDialogVisible: false,
      previewDialogVisible: false,
      previewDialogImageUrl: "",
      defaultActiveProfile: 'memberProfile',
      revalidateMemberLabel: "RE-VALIDATE",
      revalidateHouseLabel: "RE-VALIDATE",
      userType: window.meebidConstant.userType,
      loginUser: loginUtils.getLoginUser(),
      memberRevalidateButtonDisabled: false,
      houseRevalidateButtonDisabled: false,
      firstName: "User",
      active: "memberProfile",
      isProfilePage: true,
      regionOptions: [],
      titleOptions: [],
      addressRules: [],
      currentAddressRule: [],
      onlineOnlyOption: [{
        id: -1
      }],
      currencyCodeOptions: window.meebidConstant.currencyCode,
      auctionTypeOptions: [{
        id: window.meebidConstant.auctionType.Timed,
        name: i18n.t('meebid.auctionManagement.MSG_AUCTION_TYPE_TIMED_TEXT')
      }, {
        id: window.meebidConstant.auctionType.Live,
        name: i18n.t('meebid.auctionManagement.MSG_AUCTION_TYPE_LIVE_TEXT')
      }, {
        id: window.meebidConstant.auctionType.CategoryOnly,
        name: i18n.t('meebid.auctionManagement.MSG_AUCTION_TYPE_CATEGORY_ONLY_TEXT')
      }],
      regionProp: {
        value: 'id',
        label: 'name',
        children: 'childrens'
      },
      auctionLotList: [],
      currentSceneId: 0,
      currentSceneState: 0,
      currentCurrencyCode: "",
      auctionList: [],
      addressForm: {
        addressId: 0,
        regions: [],
        detail: '',
        type: meebidConstant.addressType.Shipping,
        isDefault: false
      },
      addressFormRules: {
        topRegion: [
          { required: true, message: 'Please select Country', trigger: 'change' }//,
          //{ validator: validateRegions, trigger: 'input' }
        ],
        detail: [
          { required: true, message: 'Please input address', trigger: 'change' }
        ]
      },
      memberAddressOptions: [{
        id: meebidConstant.addressType.Shipping,
        label: "Shipping Address"
      }, {
        id: meebidConstant.addressType.Billing,
        label: "Billing Address"
      }],
      houseAddressOptions: [{
        id: meebidConstant.addressType.Exhibition,
        label: "Exhibition Address"
      }, {
        id: meebidConstant.addressType.BiddingVenue,
        label: "Bidding Venue Address"
      }, {
        id: meebidConstant.addressType.PickupWarehouse,
        label: "Pick-up Warehouse Address"
      }],
      addresses: {
        //meebidConstant.addressType.Shipping
        16: [],
        //meebidConstant.addressType.Billing
        8: [],
        //meebidConstant.addressType.Exhibition
        32: [],
        //meebidConstant.addressType.BiddingVenue
        64: [],
        //meebidConstant.addressType.PickupWarehouse
        128: []
      },
      userProfile: {},
      phoneForm: {
        phone: "",
        //36 is for US
        region: 36
      },
      phoneFormRules: {
        phone: [
          { required: true, message: 'Please input Phone number', trigger: 'change' }          
        ]
      },
      contactUserForm: {
        firstName: "",
        lastName: "",
        email: "",
        //Mr.
        titleId: 2,
        phone: "",
        //36 is for US
        region: 36,
        phone1: "",
        region1: 36
      },
      contactUserFormRules: {
        firstName: [
          { required: true, message: 'Please input First Name', trigger: 'change' }
        ],
        lastName: [
          { required: true, message: 'Please input Last Name', trigger: 'change' }
        ],
        phone: [
          { required: true, message: 'Please input Phone number', trigger: 'change' }          
        ]
      },
      userProfileForm: {
      },
      userProfileFormRules: {
      },
      houseProfileForm: {
      },
      houseProfileFormRules: {
        name: [
          { required: true, message: 'Please input Auction House Name', trigger: 'change' }          
        ]
      },
      houseDefaultSettingForm: {

      },
      categoryItems: [],
      categoryProp: {
        value: 'id',
        label: 'description',
        children: 'kids'
      },
      auctionForm: {},
      auctionFormRules: {
        name: [
          { required: true, message: 'Please input Auction Name', trigger: 'change' }          
        ],
        description: [
          { required: true, message: 'Please input Description', trigger: 'change' }          
        ],
        currencyCode: [
          { required: true, message: 'Please select Currency Code', trigger: 'change' }
        ],
        startAt: [
          { type: "date", required: true, message: 'Please input Start Date', trigger: 'change' }          
        ],
        exhTime: [
          { validator: validateExhTime, trigger: 'change' }     
        ],
        type: [
          { required: true, message: 'Please select Auction Type', trigger: 'change' }          
        ],
        bLogo: [
          { required: true, message: 'Please upload Auction Logo', trigger: 'on-change' }          
        ],
        pickupLocId: [
          { required: true, message: 'Please select Pick-up Warehouse Address', trigger: 'change' }          
        ],
        termsAndCondition: [
          { validator: validateAuctionTerms, trigger: 'change' }     
        ],
        paymentInfo: [
          { validator: validateAuctionPaymentInfo, trigger: 'change' }     
        ],
        shippingInfo: [
          { validator: validateAuctionShippingInfo, trigger: 'change' }     
        ]
      },
      lotForm: {},
      lotFormRules: {
        name: [
          { required: true, message: 'Please input Auction Name', trigger: 'change' }          
        ],
        description: [
          { required: true, message: 'Please input Description', trigger: 'change' }          
        ],
        no: [
          { required: true, message: 'Please select Lot No.', trigger: 'change' },
          { validator: validateLotNo, trigger: 'change' }  
        ],
        estMinPrice: [
          { required: true, message: 'Please input Minimum Estimation Price', trigger: 'change' },
          { validator: validateEstMinPrice, trigger: 'change' }               
        ],
        estMaxPrice: [
          { required: true, message: 'Please input Maximum Estimation Price', trigger: 'change' },
          { validator: validateEstMaxPrice, trigger: 'change' }               
        ],
        imageurls: [
          { required: true, message: 'Please upload Lot Images', trigger: 'on-change' }          
        ],
        startingBid: [
          { required: true, message: 'Please input Start Bidding Price', trigger: 'change' }          
        ],
        reservePrice: [
          { required: true, message: 'Please input Reserve Price', trigger: 'change' }          
        ],
        category: [
          { required: true, message: 'Please select Category', trigger: 'change' }          
        ],
        termsAndCondition: [
          { validator: validateAuctionTerms, trigger: 'change' }     
        ],
        paymentInfo: [
          { validator: validateAuctionPaymentInfo, trigger: 'change' }     
        ],
        shippingInfo: [
          { validator: validateAuctionShippingInfo, trigger: 'change' }     
        ]
      },
      batchLotForm: {},
      batchLotFormRules: {
        batchTemplate: [
          { required: true, validator: validateBatchTemplate, trigger: 'change' }          
        ],
        imageUrls: [
          { required: true, validator: validateBatchLotsImages, trigger: 'change' }          
        ],
      },
      batchImagesForm: {},
      batchImagesFormRules: {
        imageUrls: [
          { required: true, validator: validateBatchImages, trigger: 'change' }          
        ],
      },
      exhibitionForm: {},
      exhibitionFormRules: {
        locId: [
          { required: true, message: 'Please select Exhibition Location', trigger: 'change' }          
        ],
        exhibitionDate: [
          { required: true, message: 'Please select Exhibition Date', trigger: 'change' }          
        ],
        exhibitionStartTime: [
          { required: true, message: 'Please select Start Time', trigger: 'change' },
          { validator: validateExhibitionStartTime, trigger: 'change' }
        ],
        exhibitionEndTime: [
          { required: true, message: 'Please select End Time', trigger: 'change' },
          { validator: validateExhibitionEndTime, trigger: 'change' }
        ],
      }
    }
  },
  computed: {
    isUpdateAddressButtonDisabled() {
      return this.addresses[this.addressForm.type].length === 5 && this.addressForm.addressId === 0;
    }
  },
  beforeMount() {
    if (this.$parent.$data && this.$parent.$data.regions && this.$parent.$data.regions.length){
      this.regionOptions = this.$parent.$data.regions;
    }
    if (this.$parent.$data && this.$parent.$data.addrRules && this.$parent.$data.addrRules.length){
      this.addressRules = this.$parent.$data.addrRules;
    }
    if (this.$parent.$data && this.$parent.$data.titles && this.$parent.$data.titles.length){
      this.titleOptions = this.$parent.$data.titles;
    }
    if (this.$parent.$data && this.$parent.$data.user){
      this._buildUserProfile(this.$parent.$data)
    }
  },
  mounted() {
    //this.$refs.meebidAddressHeader.$el.style = "display: none;";
  },

  methods: {
    _buildUserProfile(data){
      this.userProfile = data.user;
      
      if (this.userProfile.type === window.meebidConstant.userType.member){
        if (this.userProfile.firstName){
          this.firstName = this.userProfile.firstName;
        }
        this.userProfileForm = this.userProfile;
        var categoryItems = this.$parent.$data.categories;
        /*var selectedItems = this.userProfileForm && this.userProfileForm.favorCategories ? this.userProfileForm.favorCategories.split(";") : [];
        for (var i = 0; i < categoryItems.length; i++){
          for (var j = 0; j < selectedItems.length; j++){
            if (parseInt(selectedItems[j]) === categoryItems[i].id){
              categoryItems[i].selected = true;
              break;
            }
          }
        }*/
        this.categoryItems = categoryItems;


        this.addressForm = {
          addressId: 0,
          regions: [],
          detail: "",
          type: meebidConstant.addressType.Shipping,
          isDefault: false
        };
        this.addresses[meebidConstant.addressType.Shipping] = [];
        this.addresses[meebidConstant.addressType.Billing] = [];
        for (var i = 0; i < this.$parent.$data.addresses.length; i++){
          var address = this.$parent.$data.addresses[i];
          
          address.isDefault = address.type % 2 === 1;
          address.type = address.type - address.type % 2;
          this.addresses[address.type].push(address);
        }
          
      } else if (this.userProfile.type === window.meebidConstant.userType.house){
        if (this.userProfile.name){
          this.firstName = this.userProfile.name;
        }
        if (!this.userProfile.bLogoUrl) {
          this.userProfile.bLogoUpload = [];
        } else {
          this.userProfile.bLogoUpload = [{
              url: this.userProfile.bLogoUrl
          }];
        }
        if (!this.userProfile.blicenseUrl) {
          this.userProfile.bLicenseUpload = [];
        } else {
          this.userProfile.bLicenseUpload = [{
              url: this.userProfile.blicenseUrl,
              name: this.userProfile.blicenseName
          }];
        }
        this.categoryItems = this.$parent.$data.categories;
        if (!this.userProfile.qualiDocUrl) {
          this.userProfile.qualiDocUpload = [];
        } else {
          this.userProfile.qualiDocUpload = [{
              url: this.userProfile.qualiDocUrl,
              name: this.userProfile.qualiDocName
          }];
        }
        if (!this.userProfile.idUrl) {
          this.userProfile.idUpload = [];
        } else {
          this.userProfile.idUpload = [{
              url: this.userProfile.idUrl,
              name: this.userProfile.idName
          }];
        }
        this.houseProfileForm = this.userProfile;
        this.defaultActiveProfile = 'houseProfile';
        this.active = 'houseProfile';
        this.addressForm = {
          addressId: 0,
          regions: [],
          detail: "",
          type: meebidConstant.addressType.Exhibition,
          isDefault: false
        };
          
        this.addresses[meebidConstant.addressType.Exhibition] = [];
        this.addresses[meebidConstant.addressType.BiddingVenue] = [];
        this.addresses[meebidConstant.addressType.PickupWarehouse] = [];
        
        for (var i = 0; i < data.addresses.length; i++){
          var address = data.addresses[i];
          address.isDefault = address.type % 2 === 1;
          address.type = address.type - address.type % 2;
          this.addresses[address.type].push(address);
        }
      }
    },
    redirectToHome() {
      window.location.href = "./home.html";
    },
    onLogout () {
      this.$confirm(i18n.t('meebid.alertMessage.MSG_LOGOUT_CONFIRMATION_TEXT'), 'LOGOUT', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        loginUtils.setLoginUser()
        window.location.href = "./home.html";
      }).catch(() => {
        
      });
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
      if (this.hasPendingChange){
        this.$confirm(i18n.t('meebid.alertMessage.MSG_LEAVE_WITH_UNSAVED_DATA'), 'WARNING', {
          confirmButtonText: 'Leave',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.cleanFieldDChangeFlag();
          this.switchToView(key);
        }).catch(() => {
          this.$refs.navigationMenu.activeIndex = this.active;
        });
      } else {
        this.switchToView(key);
      }
    },
    switchToView(key) {
      var me = this;
      this.active = key;
      
      switch (key){
        
        case 'memberProfile':
        case 'houseProfile':
          this.$refs.meebidAdminContent.className = "meebidAdminContent meebidAdminContentInLoading";
          this.$refs.busyIndicator.show();
          $.ajax({  
            url : "/api/user/profile",  
            type : 'GET',
            headers: {
              token: this.loginUser.token
            },
            contentType : "application/json", 
            success : function(data) {

              if (data.code == 1){
                //var categoryItems = data.content.categories;
                /*for (var i = 0; i < categoryItems.length; i++){
                  categoryItems[i].selected = false;
                }*/
                var user = data.content.user;
                if (!user.contact_users) {
                  user.contact_users = [];
                }

                if (data.content.addresses && data.content.addresses.length){
                  for (var i = 0; i < data.content.addresses.length; i++){
                    data.content.addresses[i].isDefault = false;
                  }
                }
                user.originalContactUsers = [].concat(user.contact_users);
                me._buildUserProfile(data.content);
              } else {
                errorUtils.requestDataError(data)
              }
            },  
            error : function(data) {  
              errorUtils.requestError(data);
            },  
            dataType : 'json' 
          }).done(function(){
            me.$refs.busyIndicator.hide();
            me.$refs.meebidAdminContent.className = "meebidAdminContent";
          });
          break;
        case 'houseDefaultSetting':
          this.$refs.meebidAdminContent.className = "meebidAdminContent meebidAdminContentInLoading";
          this.$refs.busyIndicator.show();
          $.ajax({  
            url : "/api/public/pts/settings",  
            type : 'GET',
            headers: {
              token: this.loginUser.token
            },
            contentType : "application/json", 
            data: {
              houseId: this.userProfile.id
            },
            success : function(data) {
              if (data.code == 1){
                me.$refs.termsEditor.setValue(JSON.parse(data.content.termsAndCondition));
                me.$refs.paymentEditor.setValue(JSON.parse(data.content.paymentInfo));
                me.$refs.shipingEditor.setValue(JSON.parse(data.content.shippingInfo));
              } else {
                errorUtils.requestDataError(data)
              }
            },  
            error : function(data) {  
              errorUtils.requestError(data);
            },  
            dataType : 'json' 
          }).done(function(){
            me.$refs.busyIndicator.hide();
            me.$refs.meebidAdminContent.className = "meebidAdminContent";
          });
          break;
        case 'auctionManagement':
          this.auctionManagementStep = "auctionManagement";
          this.refreshAuctions();
          break;
        default:
          //this.$refs.meebidAddressHeader.$el.style = "display: none;";
          break;
      }
      
    },
    openUserProfile() {
      //window.open("./admin.html", '_blank');
    },
    onCategoryDialogUpdate(favorCategories) {
      this.userProfileForm.favorCategories = favorCategories;
      this.onFieldDataChange();
    },
    buildRequest() {
      var contactUsers = [];
      for (var i = 0; i < this.userProfile.contact_users.length; i++){
        contactUsers.push(this.userProfile.contact_users[i]);
      }
      if (this.userProfile.originalContactUsers && this.userProfile.originalContactUsers.length){
        for (var i = 0; i < this.userProfile.originalContactUsers.length; i++){
          var originalContactUser = this.userProfile.originalContactUsers[i];
          var isIncluded = false;
          for (var j = 0; j < this.userProfile.contact_users.length; j++){
            var contactUser = this.userProfile.contact_users[j];
            if (contactUser.id === originalContactUser.id){
              isIncluded = true;
              break;
            }
          }
          if (!isIncluded){
            originalContactUser.phone = "-1";
            contactUsers.push(originalContactUser);
          }
        }
      }
      if (this.userProfile.type === this.userType.member) {
        return {
          //topRegion: this.userProfile.topRegion,
          //avatar: this.userProfile.avatar,
          firstName: this.userProfile.firstName,
          lastName: this.userProfile.lastName,
          favorCategories: this.userProfile.favorCategories,
          contact_users: contactUsers,
          email: this.userProfile.email,
          titleId: this.userProfile.titleId
        }
      } else if (this.userProfile.type === this.userType.house) {
        var returnObj = {
          //topRegion: this.userProfile.topRegion,
          //firstName: this.userProfile.firstName,
          //lastName: this.userProfile.lastName,
          name: this.userProfile.name,
          website: this.userProfile.website,
          contact_users: contactUsers,
          //email: this.userProfile.email,
          //logo: this.userProfile.logo,
        };
        if (this.userProfile.bLogoUpload.length && this.userProfile.bLogoUpload[0] && this.userProfile.bLogoUpload[0].rUid){
          returnObj.bLogoUrl = this.userProfile.bLogoUpload[0].rUid;
        } else if (this.userProfile.bLogoUpload.length == 0){
          returnObj.bLogoUrl = "";
        }
        if (this.userProfile.bLicenseUpload.length && this.userProfile.bLicenseUpload[0] && this.userProfile.bLicenseUpload[0].rUid){
          returnObj.blicenseUrl = this.userProfile.bLicenseUpload[0].rUid;
          returnObj.blicenseName = this.userProfile.bLicenseUpload[0].name;
        } else if (this.userProfile.bLicenseUpload.length == 0){
          returnObj.blicenseUrl = "";
          returnObj.blicenseName = "";
        }
        if (this.userProfile.qualiDocUpload.length && this.userProfile.qualiDocUpload[0] && this.userProfile.qualiDocUpload[0].rUid){
          returnObj.qualiDocUrl = this.userProfile.qualiDocUpload[0].rUid;
          returnObj.qualiDocName = this.userProfile.qualiDocUpload[0].name;
        } else if (this.userProfile.qualiDocUpload.length == 0){
          returnObj.qualiDocUrl = "";
          returnObj.qualiDocName = "";
        }
        if (this.userProfile.idUpload.length && this.userProfile.idUpload[0] && this.userProfile.idUpload[0].rUid){
          returnObj.idUrl = this.userProfile.idUpload[0].rUid;
          returnObj.idName = this.userProfile.idUpload[0].name;
        } else if (this.userProfile.idUpload.length == 0){
          returnObj.idUrl = "";
          returnObj.idName = "";
        }
        return returnObj;
      }
    },
    onUpdateProfile() {
//      var favorCategories = meebidUtils.buildCategoryItemStr(this.categoryItems);
//      this.userProfile.favorCategories = favorCategories;
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
            this.$message({
              type: 'success',
              message: i18n.t('meebid.alertMessage.MSG_ADMIN_USER_UPDATE_PROFILE_SUCCESS')
            })
            this.firstName = this.userProfile.type === window.meebidConstant.userType.member ? this.userProfile.firstName : this.userProfile.name;
            this.cleanFieldDChangeFlag();
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Update failure',
              duration: 5000
            })
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      }).done(function(){
        console.log("Update Profile done");
      });
    },
    onUpdateHouseProfile() {
      var me = this;
      this.$refs.houseProfileForm.validate(function(isValid){
        if (isValid){
          $.ajax({
            type: "POST",
            url: "/api/user/profile",
            contentType : "application/json", 
            context: me,
            headers: {
              token: me.loginUser.token
            },
            data: JSON.stringify(me.buildRequest()),
            success(data) {
              if (data.code === 1){
                this.$message({
                  type: 'success',
                  message: i18n.t('meebid.alertMessage.MSG_ADMIN_USER_UPDATE_PROFILE_SUCCESS')
                })
                this.firstName = this.userProfile.firstName;
                this.cleanFieldDChangeFlag();
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'Update failure',
                  duration: 5000
                })
              }
              
            },
            error(data) {
              errorUtils.requestError(data);
            }
          })
        }
      })
      
    },
    onApprovalHouse() {
      $.ajax({
        type: "POST",
        url: "/api/user/audit",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        success(data) {
          if (data.code === 1){
            this.$message({
              type: 'success',
              message: i18n.t('meebid.alertMessage.MSG_PROFILE_ACCOUNT_APPLY_FOR_APPROVE_SUCCESS')
            })
            this.userProfile.state = 1;
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Apply for Approval failure',
              duration: 5000
            })
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      })
    },
    onMemberRevalidate() {
      this.memberRevalidateButtonDisabled = true;
      $.ajax({
        type: "POST",
        url: "/api/public/email/send",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify({
          type: meebidConstant.emailType.ValidateUrl,
          email: this.userProfile.email
        }),
        dataType : 'json',
        success(data) {
          if (data.code === 1){
            this.$message({
              type: 'success',
              message: i18n.t('meebid.alertMessage.MSG_REVALIDATE_EMAIL_SEND_SUCCESS')
            })
          } else {
            this.$notify.error({
              title: 'Failure',
              message: data.msg,
              duration: 5000
            })
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
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
    onHouseRevalidate() {
      this.houseRevalidateButtonDisabled = true;
      $.ajax({
        type: "POST",
        url: "/api/public/email/send",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        dataType : 'json',
        data: JSON.stringify({
          type: meebidConstant.emailType.ValidateUrl,
          email: this.userProfile.email
        }),
        success(data) {
          if (data.code === 1){
            this.$message({
              type: 'success',
              message: i18n.t('meebid.alertMessage.MSG_REVALIDATE_EMAIL_SEND_SUCCESS')
            })
          } else {
            this.$notify.error({
              title: 'Failure',
              message: data.msg,
              duration: 5000
            })
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      }).done(function(){
        console.log("Re-send Validation Email done");
      });
      var count = 60;
      var me = this;
      var interval = setInterval(function(){
        if (count === 0){
          me.revalidateHouseLabel = "RE-VALIDATE";
          me.houseRevalidateButtonDisabled = false;
          window.clearInterval(interval);
          return;
        }
        me.revalidateHouseLabel = (count-- - 1) + 's';
        
      }, 1000);
    },
    handleUploadRemove(file, fileList, fieldName){
      this.userProfile[fieldName] = fileList;
    },
    handleUploadSuccess(response, file, fileList, fieldName) {
      var res = response;
      this.userProfile[fieldName] = fileList;
    },
    handleUploadError(err, file, fileList) {
      this.$notify.error({
        title: 'Failure',
        message: err,
        duration: 5000
      })
    },
    handleUploadExceed() {
      this.$message.warning('You cannot upload more files.');
    },
    handlePictureCardPreview (file) {
      window.open(file.url, '_blank');
      //this.previewDialogVisible = true;
      //this.previewDialogImageUrl = file.url;
    },
    onAddPhoneNumber() {
      this.updatePhoneIndex = -1;
      this.phoneForm.phone = "";
      this.phoneForm.region = this.regionOptions[0].id;
      this.phoneNumberDialogVisible = true;
    },
    onEditPhoneNumber(index, item){
      var me = this;
      
      this.updatePhoneIndex = index;
      var phoneObj = meebidUtils.convertPhoneStrToObj(item.phone, this.regionOptions);
      this.phoneForm.phone = phoneObj.phone;
      this.phoneForm.region = phoneObj.region;
      this.phoneNumberDialogVisible = true;
    },
    onDeletePhoneNumber(index, item){
      this.userProfileForm.contact_users.splice(index, 1);
      this.onFieldDataChange();
    },
    onSavePhoneNumber() {
      var me = this;
      this.$refs.phoneFormRef.validate(function(isValid){
        if (isValid){
          if (me.updatePhoneIndex === -1){
            me.userProfileForm.contact_users.push({
              id: 0,
              phone: meebidUtils.convertPhoneObjToStr(me.phoneForm.region, me.phoneForm.phone, me.regionOptions)
            });
            me.phoneNumberDialogVisible = false;
          } else {
            me.userProfileForm.contact_users[this.updatePhoneIndex].phone = meebidUtils.convertPhoneObjToStr(me.phoneForm.region, me.phoneForm.phone, me.regionOptions);
            me.phoneNumberDialogVisible = false;
          }
          me.onFieldDataChange();
        }
      });
    },
    onAddContactUser() {
      this.updateContactUserIndex = -1;
      this.contactUserForm.phone = "";
      this.contactUserForm.region = this.regionOptions[0].id;
      this.contactUserForm.phone1 = "";
      this.contactUserForm.region1 = this.regionOptions[0].id;
      this.contactUserForm.titleId = this.titleOptions[0].id;
      this.contactUserForm.firstName = "";
      this.contactUserForm.lastName = "";
      this.contactUserForm.email = "";
      this.contactUserDialogVisible = true;
    },
    onEditContactUser(index, item){
      this.updateContactUserIndex = index;
      var phoneObj = meebidUtils.convertPhoneStrToObj(item.phone, this.regionOptions);
      var phoneObj1 = meebidUtils.convertPhoneStrToObj(item.phone1, this.regionOptions);
      this.contactUserForm.phone = phoneObj.phone;
      this.contactUserForm.region = phoneObj.region;
      this.contactUserForm.phone1 = phoneObj1.phone;
      this.contactUserForm.region1 = phoneObj1.region;
      this.contactUserForm.firstName = item.firstName;
      this.contactUserForm.lastName = item.lastName;
      this.contactUserForm.titleId = item.titleId || null;
      this.contactUserForm.email = item.email || "";
      this.contactUserDialogVisible = true;
    },
    onDeleteContactUser(index, item){
      this.houseProfileForm.contact_users.splice(index, 1);
      this.onFieldDataChange();
    },
    onSaveContactUser() {
      var me = this;
      this.$refs.contactUserFormRef.validate(function(isValid){
        if (isValid){
          if (me.updateContactUserIndex === -1){
            me.houseProfileForm.contact_users.push({
              id: 0,
              firstName: me.contactUserForm.firstName,
              lastName: me.contactUserForm.lastName,
              titleId: me.contactUserForm.titleId,
              email: me.contactUserForm.email,
              phone: meebidUtils.convertPhoneObjToStr(me.contactUserForm.region, me.contactUserForm.phone, me.regionOptions),
              phone1: meebidUtils.convertPhoneObjToStr(me.contactUserForm.region1, me.contactUserForm.phone1, me.regionOptions)
            });
            me.contactUserDialogVisible = false;
          } else {
            me.houseProfileForm.contact_users[me.updateContactUserIndex].phone = meebidUtils.convertPhoneObjToStr(me.contactUserForm.region, me.contactUserForm.phone, me.regionOptions);
            me.houseProfileForm.contact_users[me.updateContactUserIndex].phone1 = meebidUtils.convertPhoneObjToStr(me.contactUserForm.region1, me.contactUserForm.phone1, me.regionOptions);
            me.houseProfileForm.contact_users[me.updateContactUserIndex].firstName = me.contactUserForm.firstName;
            me.houseProfileForm.contact_users[me.updateContactUserIndex].lastName = me.contactUserForm.lastName;
            me.houseProfileForm.contact_users[me.updateContactUserIndex].titleId = me.contactUserForm.titleId;
            me.houseProfileForm.contact_users[me.updateContactUserIndex].email = me.contactUserForm.email || "";
            me.contactUserDialogVisible = false;
          }
          me.onFieldDataChange();
        }
      })
      
    },
    cleanFieldDChangeFlag() {
      this.hasPendingChange = false;
      window.onbeforeunload = null;
    },
    getTitleLabel(titleId){
      for (var i = 0; i < this.titleOptions.length; i++){
        if (titleId === this.titleOptions[i].id){
          return this.titleOptions[i].name;
        }
      }
      return "";
    },
    getTopRegionLabel(topRegion){
      var region = this.getSelectedRegionOptions([topRegion], this.regionOptions);
      return region.name;
    },
    getRegionDetail(detail){
      var detailLabel = "";
      var detailList = detail && detail.length ? detail : [];
      for (var i = 0; i < detailList.length; i++){
        if (detailList[i].controlType === 'select') {
          var detailOption = meebidUtils.findObject(detailList[i].options, "id", detailList[i].value);
          detailLabel += detailOption.label ? detailOption.label + " " : detailOption.name + " ";
        } else {
          detailLabel += detailList[i].value ? detailList[i].value + " " : "";
        }
      }
      return detailLabel;
    },
    getRegionLabel(regions){
      var regionLabel = "";
      for (var i = 0; i < regions.length; i++){
        if (i !== regions.length - 1){
          regionLabel += regions[i].label + "/";
        } else {
          regionLabel += regions[i].label;
        }
      }
      return regionLabel;
    },
    getAddressLabel(address){
      if (address.id === -1){
        return "Online Only";
      }
      return this.getTopRegionLabel(address.topRegion) + " " + this.getRegionDetail(address.detail);
    },
    onFieldDataChange() {
      var me = this;
      this.hasPendingChange = true;
      window.onbeforeunload = function(){
        return i18n.t('meebid.alertMessage.MSG_LEAVE_WITH_UNSAVED_DATA');
      }
    },
    getRegionOptions(regionOptions, regions){
      var regionOption = this.getSelectedRegionOptions(regions, regionOptions);
      return regionOption && regionOption.childrens ? regionOption.childrens : [];
    },
    getSelectedRegionOptions(regions, regionOptions){
      for (var i = 0; i < regionOptions.length; i++){
        var regionOption = regionOptions[i];
        if (regionOption.id === regions[0]){
          var nextRegions = regions.slice(1);
          if (nextRegions && nextRegions.length > 0 && regionOption.childrens){
            return this.getSelectedRegionOptions(nextRegions, regionOption.childrens);
          } else {
            return regionOption;
          }
        }
      }
      return [];
    },
    handleSecondRegionChange(val){
      if (val){
        var regionOption = this.getSelectedRegionOptions([this.addressForm.topRegion, val], this.regionOptions);
        if (regionOption.isLoaded === false && regionOption.hasMore === 1){
          this.fetchRegion(val, 2, regionOption);
        }
      }
    },
    handleAddressChange(val) {
      var me = this;
      if (val){
        var regionOption = this.getSelectedRegionOptions([val], this.regionOptions);
        var addressRule = meebidUtils.findObject(this.addressRules, "regionId", regionOption.id);
        this.currentAddressRule = addressRule.rule;
        var addressForm = {
          addressId: me.addressForm.addressId,
          topRegion: me.addressForm.topRegion,
          type: me.addressForm.type,
          isDefault: me.addressForm.isDefault
        }
        for (var i = 0; i < me.currentAddressRule.length; i++){
          addressForm[me.currentAddressRule[i].name] = null;
        }
        me.addressForm = addressForm;
        this.$nextTick(function () {
          me.$refs.addressForm.clearValidate();
        });
        if (regionOption.isLoaded === false && regionOption.hasMore === 1){
          this.fetchRegion(val, 1, regionOption);
        }
      }
    },
    fetchRegion(upperLevel, level, regionOption) {
      $.ajax({
        type: "GET",
        url: "/api/public/regions",
        contentType : "application/json", 
        context: this,
        data: {
          upperLevel: upperLevel,
          level: level
        },
        dataType: 'json',
        success(data) {
          if (data.code === 1){
            for (var i = 0; i < data.content.regions.length;i++){
              if (data.content.regions[i].hasMore === 1){
                data.content.regions[i].childrens = [];
                data.content.regions[i].isLoaded = false;
              }
            }
            regionOption.isLoaded = true;
            regionOption.childrens = data.content.regions;
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Get Region Data failure',
              duration: 5000
            })
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      });
    },
    getAddressFieldValidator(validator){
      return addressValidator[validator];
    },
    onAddressAfterChangeFunc(value, name, forwardFunc){
      this[forwardFunc].apply(this, arguments);
    },
    onStateChangeForUS(value, name){
      var me = this;
      this.$refs.addressForm.validateField(name, function(validateMessage, invalidFields){
        if (!invalidFields){
          $.ajax({
            type: "GET",
            url: "/api/public/regions",
            contentType : "application/json", 
            context: me,
            traditional: true,
            data: {
              "postalCode": value
            },
            success(data) {
              if (data.code === 1){
                var cityRule = meebidUtils.findObject(me.currentAddressRule, "name", "usCity");
                cityRule.options = data.content.regions;
                me.addressForm.usState = data.content.usState;
              } else {
                me.$notify.error({
                  title: 'Failure',
                  message: 'Fetch City for US failure',
                  duration: 5000
                })
              }
            },
            error(data) {
              errorUtils.requestError(data);
            }
          });
        }
        
      })
      
    },
    onUpdateAddress() {
      var me = this;
      var requestObj = {
        addressId: this.addressForm.addressId,
        rules: [],
        topRegion: this.addressForm.topRegion,
        type: this.addressForm.isDefault ? this.addressForm.type + 1 : this.addressForm.type
      };
      this.$refs.addressForm.validate(function(isValid){
        if (isValid){
          for (var i = 0; i < me.currentAddressRule.length; i++){
            var ruleObj = {
              name: me.currentAddressRule[i].name,
              value: me.addressForm[me.currentAddressRule[i].name]
            };
            if (me.currentAddressRule[i].controlType === 'select') {
              if (me.currentAddressRule[i].name === 'secRegion'){
                var regionOption = me.getSelectedRegionOptions([me.addressForm.topRegion], me.regionOptions);
                ruleObj.options = regionOption.childrens;
              } else if (me.currentAddressRule[i].name === 'botRegion'){
                var regionOption = me.getSelectedRegionOptions([me.addressForm.topRegion, me.addressForm.secRegion], me.regionOptions);
                ruleObj.options = regionOption.childrens;
              } else {
                ruleObj.options = me.currentAddressRule[i].options;
              }
              ruleObj.controlType = me.currentAddressRule[i].controlType;
            }
            
            requestObj.rules.push(ruleObj);
          }
          $.ajax({
            type: "POST",
            url: "/api/user/address/insupd",
            contentType : "application/json", 
            context: me,
            headers: {
              token: me.loginUser.token
            },
            data: JSON.stringify(requestObj),
            success(data) {
              if (data.code === 1){
                var currentAddressId;
                if (this.addressForm.addressId === 0){
                  var addressObj = {
                    id: data.content.id,
                    topRegion: this.addressForm.topRegion,
                    isDefault: this.addressForm.isDefault,
                    type: this.addressForm.type,
                    detail: requestObj.rules,
                    currencyId: data.content.currencyId
                  }
                  currentAddressId = data.content.id;
                  this.addresses[this.addressForm.type].push(addressObj);
                } else {
                  this.addresses[this.addressForm.type].forEach(address => {
                    if (address.id === this.addressForm.addressId){
                      address.topRegion = this.addressForm.topRegion;
                      address.detail = requestObj.rules;
                      address.isDefault = this.addressForm.isDefault;
                      address.currencyId = data.content.currencyId;
                    }
                  });
                  currentAddressId = this.addressForm.addressId;
                }
                if (this.addressForm.isDefault){
                  this.addresses[this.addressForm.type].forEach(addressObj => {
                    if (addressObj.id !== currentAddressId){
                      addressObj.isDefault = false;
                    }
                  });
                }
                this.$message({
                  type: 'success',
                  message: i18n.t('meebid.alertMessage.MSG_ADMIN_USER_UPDATE_ADDRESS_SUCCESS')
                })
                var currentType = this.addressForm.type;
                this.addressForm = {
                  addressId: 0,
                  topRegion: null,
                  detail: "",
                  type: currentType,
                  isDefault: false
                };
                this.$refs.addressForm.resetFields();
                this.addressDialogVisible = false;
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'Update Address failure',
                  duration: 5000
                })
              }
              
            },
            error(data) {
              errorUtils.requestError(data);
            }
          });
        }
      });
      
    },
    buildRegionOptions: function(regionsDataArr, regionOptions, regions){
      for (var i = 0; i < regionsDataArr[0].length; i++){
        var regionOption = meebidUtils.findObject(regionOptions, "id", regionsDataArr[0][i].id);
        if (!regionOption) {
          regionsDataArr[0][i].isLoaded = false;
          if (regionsDataArr[0][i].hasMore){
            regionsDataArr[0][i].childrens = [];
          }
          regionOptions.push(regionsDataArr[0][i]);
        }
      }

      var regionOption = meebidUtils.findObject(regionOptions, "id", regions[0].id);
      regionOption.isLoaded = true;
      if (regions.length > 1){
        this.buildRegionOptions(regionsDataArr.slice(1), regionOption.childrens, regions.slice(1));
      }
    },
    handleAddAddress(type){
      this.currentAddressRule = [];
      this.addressForm = {
        addressId: 0,
        regions: [],
        //detail: "",
        type: type,
        isDefault: this.addresses[type].length && this.addresses[type].length > 0 ? false : true
      };
      this.addressDialogVisible = true;
    },
    handleEditAddress(address) {
      var me = this;
      //this.$refs.meebidAddressHeader.$el.scrollIntoView();
      this.addressDialogVisible = true;
      this.$nextTick(function () {
        var addressRule = meebidUtils.findObject(me.addressRules, "regionId", address.topRegion);
        me.currentAddressRule = addressRule.rule;
        if (!me.checkRegionAvailable(me.buildRegionArr(address.regions), me.regionOptions)){
            me.$refs.addressFormBusyIndicator.show();
            me.fetchRegions(address);
        } else {
          var addressForm = {
            addressId: address.id,
            topRegion: address.topRegion,
            type: address.type,
            isDefault: address.isDefault,
          }
          for (var i = 0; i < me.currentAddressRule.length; i++){
            var addressDetail = meebidUtils.findObject(address.detail ? address.detail : [], "name", me.currentAddressRule[i].name);
            if (me.currentAddressRule[i].controlType === 'select'){
              me.currentAddressRule[i].options = addressDetail.options;
            }
            addressForm[me.currentAddressRule[i].name] = addressDetail.value;
          }
          this.$nextTick(function () {
            me.addressForm = addressForm;
          });
          
        }
      });
    },
    fetchRegions(address){
      var me = this;
      $.ajax({
        type: "GET",
        url: "/api/public/regions/list",
        contentType : "application/json", 
        context: this,
        traditional: true,
        data: {
          "regions": this.buildRegionArr(address.regions)
        },
        success(data) {
          if (data.code === 1){
            this.buildRegionOptions(data.content.list, this.regionOptions, address.regions);
            var addressForm = {
              addressId: address.id,
              topRegion: address.topRegion,
              type: address.type,
              isDefault: address.isDefault,
            }
            for (var i = 0; i < me.currentAddressRule.length; i++){
              var addressDetail = meebidUtils.findObject(address.detail ? address.detail : [], "name", me.currentAddressRule[i].name);
              if (me.currentAddressRule[i].controlType === 'select'){
                me.currentAddressRule[i].options = addressDetail.options;
              }
              addressForm[me.currentAddressRule[i].name] = addressDetail.value;
            }
            this.$nextTick(function () {
              me.addressForm = addressForm;
            });
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Fetch Address failure',
              duration: 5000
            })
          }
          this.$refs.addressFormBusyIndicator.hide();
          
        },
        error(data) {
          this.$refs.addressFormBusyIndicator.hide();
          errorUtils.requestError(data);
        }
      });
    },
    checkRegionAvailable(regions, regionOptions){
      for (var i = 0; i < regionOptions.length; i++){
        if (regionOptions[i].id === regions[0]){
          if (regionOptions[i].isLoaded){
            if (regions.slice(1).length === 0){
              return true;
            } else {
              if (regionOptions[i].childrens && regionOptions[i].childrens.length){
                return this.checkRegionAvailable(regions.slice(1), regionOptions[i].childrens);
              }
            }
          }
          break;
        }
      }
      return false;
    },
    generateRegionLabel(regions, regionOptions, regionArr){
      if (regions && regions.length > 0){
        for (var i = 0; i < regionOptions.length; i++){
          var regionOption = regionOptions[i];
          if (regionOption.id === regions[0]){
            regionArr.push({
              id: regionOption.id,
              label: regionOption.name
            })
            return this.generateRegionLabel(regions.slice(1), regionOption.childrens, regionArr);
          }
        }
      } else {
        return regionArr;
      }
    },
    buildRegionWithLabelArr(regions) {
      var regionArr = [];
      return this.generateRegionLabel(regions, this.regionOptions, regionArr);
    },
    buildRegionArr(regions){
      var regionArr = [];
      for (var i = 0; i < regions.length; i++){
        regionArr.push(regions[i].id);
      }
      return regionArr;
    },
    handleDeleteAddress(address){
      var me = this;
      this.$confirm(i18n.t('meebid.alertMessage.MSG_DELETE_ADDRESS_CONFIRMATION_TEXT'), 'Delete Address', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: "POST",
          url: "/api/user/address/insupd",
          contentType : "application/json", 
          headers: {
            token: me.loginUser.token
          },
          context: me,
          data: JSON.stringify({
            addressId: address.id,
            phone: '-1'
          }),
          success(data) {
            if (data.code === 1){
              var index = this.addresses[address.type].indexOf(address);
              this.addresses[address.type].splice(index, 1);
              //this.onResetAddress();
            } else {
              this.$notify.error({
                title: 'Failure',
                message: 'Update Address failure',
                duration: 5000
              })
            }
            
          },
          error(data) {
            errorUtils.requestError(data);
          }
        });
        
      }).catch(() => {
        
      });
    },
    handleSetDefaultAddress(address){
      var message;
      switch(address.type){
        case meebidConstant.addressType.Billing:
         message = i18n.t('meebid.alertMessage.MSG_SET_DEFAULT_BILLING_ADDRESS_CONFIRMATION_TEXT');
         break;
       case meebidConstant.addressType.Shipping:
         message = i18n.t('meebid.alertMessage.MSG_SET_DEFAULT_SHIPPING_ADDRESS_CONFIRMATION_TEXT');
         break;
       case meebidConstant.addressType.Exhibition:
         message = i18n.t('meebid.alertMessage.MSG_SET_DEFAULT_EXHIBITION_ADDRESS_CONFIRMATION_TEXT');
         break;
       case meebidConstant.addressType.BiddingVenue:
         message = i18n.t('meebid.alertMessage.MSG_SET_DEFAULT_BidDING_VENUE_ADDRESS_CONFIRMATION_TEXT');
         break;
       case meebidConstant.addressType.PickupWarehouse:
         message = i18n.t('meebid.alertMessage.MSG_SET_DEFAULT_PICKUP_WAREHOUSE_ADDRESS_CONFIRMATION_TEXT');
         break;
      }
      this.$confirm(message, 'Set default Address', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: "POST",
          url: "/api/user/address/insupd",
          contentType : "application/json", 
          context: this,
          headers: {
            token: this.loginUser.token
          },
          data: JSON.stringify({
            addressId: address.id,
            type: address.type + 1,
            isDefault: address.isDefault
          }),
          success(data) {
            if (data.code === 1){
              address.isDefault = true;
              this.addresses[address.type].forEach(addressObj => {
                if (addressObj.id !== address.id){
                  addressObj.isDefault = false;
                }
              });
              this.$message({
                type: 'success',
                message: i18n.t('meebid.alertMessage.MSG_ADMIN_USER_DEFAULT_ADDRESS_SUCCESS')
              })
              //this.onResetAddress();
            } else {
              this.$notify.error({
                title: 'Failure',
                message: 'Set as Default Address failure',
                duration: 5000
              })
            }
            
          },
          error(data) {
            errorUtils.requestError(data);
          }
        });
      }).catch(() => {

      });
    },
    getStateColor(state) {
      if (state !== window.meebidConstant.auctionState.Waiting && (state & window.meebidConstant.auctionState.Waiting) != 0){
        state -= 2;
      }
      return window.meebidConstant.auctionStateColor[state];
    },
    getStateLabel(state) {
      if (state !== window.meebidConstant.auctionState.Waiting && (state & window.meebidConstant.auctionState.Waiting) != 0){
        state -= 2;
      }
      return window.meebidConstant.auctionState[state];
    },
    onUpdateDefaultSetting() {
      var termsAndCondition = this.$refs.termsEditor.getValue();
      var paymentInfo = this.$refs.paymentEditor.getValue();
      var shippingInfo = this.$refs.shipingEditor.getValue();
      this.$refs.busyIndicator.show();
      $.ajax({
        type: "POST",
        url: "/api/public/pts/insupd",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify({
          houseId: this.userProfile.id,
          paymentInfo: JSON.stringify(paymentInfo),
          termsAndCondition: JSON.stringify(termsAndCondition),
          shippingInfo: JSON.stringify(shippingInfo)
        }),
        success(data) {
          if (data.code === 1){
            this.$refs.busyIndicator.hide();
            this.$message({
              type: 'success',
              message: i18n.t('meebid.alertMessage.MSG_ADMIN_USER_DEFAULT_SETTING_SUCCESS')
            })
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Update Default Setting failure',
              duration: 5000
            })
            this.$refs.busyIndicator.hide();
          }
          
        },
        error(data) {
          this.$refs.busyIndicator.hide();
          errorUtils.requestError(data);
        }
      });
    },
    handleAuctionDialogTabClick(tab, event) {
      var me = this;
      switch(tab.name){
        case 'auctionTerms':
          if (!this.auctionForm.isTermLoaded){
            this.$refs.auctionDialogTermsIndicator.show();
            var data = {};
            if (this.isAddAuction){
              data.houseId = this.userProfile.id;
            } else {
              data.sceneId = this.auctionForm.sceneId;
            }
            $.ajax({  
              url : "/api/public/pts/settings",  
              type : 'GET',
              headers: {
                token: this.loginUser.token
              },
              contentType : "application/json", 
              data: data,
              success : function(data) {

                if (data.code == 1){
                  me.auctionForm.termsAndCondition = JSON.parse(data.content.termsAndCondition);
                  me.auctionForm.paymentInfo = JSON.parse(data.content.paymentInfo);
                  me.auctionForm.shippingInfo = JSON.parse(data.content.shippingInfo);
                  me.auctionForm.isTermLoaded = true;
                } else {
                  errorUtils.requestDataError(data)
                }
                me.$refs.auctionDialogTermsIndicator.hide();
              },  
              error : function(data) {  
                errorUtils.requestError(data);
                me.$refs.auctionDialogTermsIndicator.hide();
              },  
              dataType : 'json' 
            }) 
          }
          break;
      }
    },
    handleLotDialogTabClick(tab, event) {
      var me = this;
      switch(tab.name){
        case 'lotTerms':
          if (!this.lotForm.isTermLoaded){
            this.$refs.lotDialogTermsIndicator.show();
            var data = {};
            if (this.isAddLot){
              data.sceneId = this.lotForm.sceneId;
            } else {
              data.lotId = this.lotForm.id;
            }
            $.ajax({  
              url : "/api/public/pts/settings",  
              type : 'GET',
              headers: {
                token: this.loginUser.token
              },
              contentType : "application/json", 
              data: data,
              success : function(data) {
                if (data.code == 1){
                  me.lotForm.termsAndCondition = JSON.parse(data.content.termsAndCondition);
                  me.lotForm.paymentInfo = JSON.parse(data.content.paymentInfo);
                  me.lotForm.shippingInfo = JSON.parse(data.content.shippingInfo);
                  me.lotForm.isTermLoaded = true;
                } else {
                  errorUtils.requestDataError(data)
                }
                me.$refs.lotDialogTermsIndicator.hide();
              },  
              error : function(data) {  
                errorUtils.requestError(data);
                me.$refs.auctionDialogTermsIndicator.hide();
              },  
              dataType : 'json' 
            }) 
          }
          break;
      }
    },
    handleUploadLogoSuccess(response, file, fileList, fieldName) {
      this.auctionForm[fieldName] = fileList;
      this.$refs.auctionForm.validateField(fieldName);
    },
    handleUploadLotImageSuccess(response, file, fileList, fieldName) {
      this.lotForm[fieldName] = fileList;
      this.$refs.lotForm.validateField(fieldName);
    },
    onCreateAuction() {
      var defaultBiddingAddress;
      if (this.addresses[64] && this.addresses[64].length){
        for (var i = 0; i < this.addresses[64].length; i++){
          var biddingAddress = this.addresses[64][i];
          if (biddingAddress.isDefault){
            defaultBiddingAddress = biddingAddress;
            break;
          }
        }
      
      }
      this.auctionDialogVisible = true;
      this.isAddAuction = true;
      this.auctionForm = {
        sceneId: "",
        name: "",
        description: "",
        bLogo: [],
        state: 1,
        currencyCode: defaultBiddingAddress && defaultBiddingAddress.currencyId ? defaultBiddingAddress.currencyId : 1,
        type: window.meebidConstant.auctionType.Timed,
        pickupLocId: this.addresses[128] && this.addresses[128].length ? this.addresses[128][0].id : null,
        biddingLocId: this.addresses[64] && this.addresses[64].length ? this.addresses[64][0].id : -1,
        //exhLocId: this.addresses[32] && this.addresses[32].length ? this.addresses[32][0].id : 0,
        //exhTime: null,
        startAt: null,
        termsAndCondition: "",
        paymentInfo: "",
        shippingInfo: "",
        exhibitions: [],
        isTermLoaded: false
      };
      if (this.$refs.auctionForm){
        var me = this;
        setTimeout(function(){
          me.$refs.auctionForm.clearValidate();
        }, 100);
      }
    },
    onCreateAuctionLot() {
      this.lotDialogVisible = true;
      this.isAddLot = true;

      this.lotForm = {
        id: "",
        sceneId: this.currentSceneId,
        name: "",
        description: "",
        state: 1,
        imageUrls: [],
        category: [],
        estMaxPrice: "0.00",
        estMinPrice: "0.00",
        startingBid: "0.00",
        reservePrice: "0.00",
        termsAndCondition: "",
        paymentInfo: "",
        shippingInfo: "",
        isTermLoaded: false
      };
      if (this.$refs.lotForm){
        var me = this;
        setTimeout(function(){
          me.$refs.lotForm.clearValidate();
        }, 100);
      }
    },
    onUpdateAuction() {
      var me = this;
      this.$refs.auctionForm.validate(function(isValid){
        if (isValid){
          if (me.auctionForm.isTermLoaded){
            me.$refs.auctionTermsForm.validate(function(isTermsValid){
              if (isTermsValid){
                me.saveAuction();
              } else {
                me.auctionDialogActiveTab = "auctionTerms";
              }
            });
          }
          else {
            me.saveAuction();
          }
        } else {
          me.auctionDialogActiveTab = "auctionBasic";
        }
      })
    },
    onUpdateLot() {
      var me = this;
      this.$refs.lotForm.validate(function(isValid){
        if (isValid){
          if (me.lotForm.isTermLoaded){
            me.$refs.lotTermsForm.validate(function(isTermsValid){
              if (isTermsValid){
                me.saveLot();
              } else {
                me.lotDialogActiveTab = "lotTerms";
              }
            });
          }
          else {
            me.saveLot();
          }
        } else {
          me.lotDialogActiveTab = "lotBasic";
        }
      })
    },
    checkExhibitionsStatus(){
      if (this.auctionForm.exhibitions && this.auctionForm.exhibitions.length){
        this.auctionForm.exhibitions.forEach(exhibition => {
          var exhibitionAddresses = this.addresses[32];
          var exhibitionAddress = meebidUtils.findObject(exhibitionAddresses, "id", exhibition.locId);
          if (!exhibitionAddress){
            exhibition.locId = -1;
          }
        });
      }
    },
    saveAuction() {
      this.checkExhibitionsStatus();
      var requestObj = {
        name: this.auctionForm.name,
        description: this.auctionForm.description,
        startAt: this.auctionForm.startAt,
        type: this.auctionForm.type,
        currencyId: this.auctionForm.currencyCode,
        pickupLocId: this.auctionForm.pickupLocId,
        biddingLocId: this.auctionForm.biddingLocId > 0 ? this.auctionForm.biddingLocId : "",
        exhibitions: this.auctionForm.exhibitions
      }

      if (this.auctionForm.bLogo && this.auctionForm.bLogo.length && this.auctionForm.bLogo[0].rUid){
        requestObj.logo = this.auctionForm.bLogo[0].rUid;
      } else if (this.auctionForm.bLogo.length == 0){
        requestObj.logo = "";
      }

      if (this.auctionForm.sceneId) {
        requestObj.sceneId = this.auctionForm.sceneId;
      }

      if (this.auctionForm.isTermLoaded) {
        requestObj.termsAndCondition = JSON.stringify(this.auctionForm.termsAndCondition);
        requestObj.paymentInfo = JSON.stringify(this.auctionForm.paymentInfo);
        requestObj.shippingInfo = JSON.stringify(this.auctionForm.shippingInfo);
      }
      
      $.ajax({
        type: "POST",
        url: "/api/scene/insupd",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify(requestObj),
        success(data) {
          if (data.code === 1){
            this.$message({
              type: 'success',
              message: i18n.t('meebid.alertMessage.MSG_ADMIN_USER_UPDATE_AUCTION_SUCCESS')
            });
            this.auctionDialogVisible = false;
            if (this.isAddAuction){
              this.currentPageForAuction = 1;
            }
            this.refreshAuctions();
          }else {
            this.$notify.error({
              title: 'Failure',
              message: 'Save Auction failure',
              duration: 5000
            })
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      });
    },
    saveLot() {
      var requestObj = {
        sceneId: this.lotForm.sceneId,
        name: this.lotForm.name,
        description: this.lotForm.description,
        no: this.lotForm.no,
        category: this.lotForm.category[this.lotForm.category.length - 1],
        estMaxPrice: parseFloat(this.lotForm.estMaxPrice),
        estMinPrice: parseFloat(this.lotForm.estMinPrice),
        startingBid: parseFloat(this.lotForm.startingBid),
        reservePrice: parseFloat(this.lotForm.reservePrice)
      }

      if (this.lotForm.imageUrls && this.lotForm.imageUrls.length){
        var imageUrlArr = [];
        for (var i = 0; i < this.lotForm.imageUrls.length; i++){
          imageUrlArr.push(this.lotForm.imageUrls[i].rUid ? this.lotForm.imageUrls[i].rUid : this.lotForm.imageUrls[i].url);
        }
        requestObj.imageUrls = imageUrlArr.join(";");
      } else if (this.lotForm.imageUrls.length == 0){
        requestObj.imageUrls = "";
      }

      if (this.lotForm.id) {
        requestObj.lotId = this.lotForm.id;
      }

      if (this.lotForm.isTermLoaded) {
        requestObj.termsAndCondition = JSON.stringify(this.lotForm.termsAndCondition);
        requestObj.paymentInfo = JSON.stringify(this.lotForm.paymentInfo);
        requestObj.shippingInfo = JSON.stringify(this.lotForm.shippingInfo);
      }
      
      $.ajax({
        type: "POST",
        url: "/api/lot/insupd",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify(requestObj),
        dataType: "json",
        success(data) {
          if (data.code === 1){
            this.$message({
              type: 'success',
              message: i18n.t('meebid.alertMessage.MSG_ADMIN_USER_UPDATE_LOT_SUCCESS')
            });
            this.lotDialogVisible = false;
            if (this.isAddLot){
              this.currentPageForAuctionLot = 1;
            }
            this.refreshAuctionLots();
          } else if (data.code === -4) {
            var messageKey = 'meebid.alertMessage.' + data.msg;
            var replaceObj = {};
            if (data.content.length){
              for (var i = 0; i < data.content.length; i++){
                replaceObj[i] = data.content[i];
              }
            }
            
            this.$message.error(i18n.t(messageKey, replaceObj));
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Save Lot failure',
              duration: 5000
            })
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      });
    },
    getAuctionType(type) {
      return window.meebidConstant.auctionType[type];
    },
    refreshAuctions() {
      var me = this;
      this.$refs.meebidAdminContent.className = "meebidAdminContent meebidAdminContentInLoading";
      this.$refs.busyIndicator.show();
      $.ajax({
        type: "GET",
        url: "/api/user/scenes",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: {
          offset: (this.currentPageForAuction - 1) * 20,
          count: 20
        },
        success(data) {
          if (data.code === 1){
            this.auctionList = data.content.items;
            this.totalCountForAuction = data.content.total;
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Fetch Auction List failure',
              duration: 5000
            })
          }
          
        },
        error(data) {
          me.$refs.busyIndicator.hide();
          errorUtils.requestError(data);
        }
      }).done(function(){
        me.$refs.busyIndicator.hide();
        me.$refs.meebidAdminContent.className = "meebidAdminContent";
      });
    },
    refreshAuctionLots() {
      var me = this;
      this.$refs.meebidAdminContent.className = "meebidAdminContent meebidAdminContentInLoading";
      this.$refs.busyIndicator.show();
      $.ajax({
        type: "GET",
        url: "/api/user/items",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: {
          offset: (this.currentPageForAuctionLot - 1) * 20,
          sceneId: this.currentSceneId,
          count: 20
        },
        success(data) {
          if (data.code === 1){
            for (var i = 0; i < data.content.items.length; i++){
              var urls = data.content.items[i].imageUrls.split(";");
              var urlArr = [];
              for (var j = 0; j < urls.length; j++){
                urlArr.push({
                  url: urls[j]
                });
              }
              data.content.items[i].imageUrls = urlArr;
            }
            this.auctionLotList = data.content.items;

            this.totalCountForAuctionLot = data.content.total;
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Fetch Lot List failure',
              duration: 5000
            })
          }
          
        },
        error(data) {
          me.$refs.busyIndicator.hide();
          errorUtils.requestError(data);
        }
      }).done(function(){
        me.$refs.busyIndicator.hide();
        me.$refs.meebidAdminContent.className = "meebidAdminContent";
      });
    },
    handleAuctionItemCommand(command, item) {
      switch(command){
        case 'edit':
          this.auctionDialogVisible = true;
          this.isAddAuction = false;
          this.auctionForm = {
            sceneId: item.id,
            name: item.name,
            description: item.description,
            type: item.type,
            bLogo: [{
              url: item.logo
            }],
            currencyCode: item.currencyId ? item.currencyId: 1,
            pickupLocId: item.pickupLocId ? item.pickupLocId : null,
            biddingLocId: item.biddingLocId ? item.biddingLocId : -1,
            //exhLocId: item.exhLocId ? item.exhLocId : null,
            //exhTime: item.exhTime ? new Date(item.exhTime) : null,
            startAt: item.startAt ? new Date(item.startAt) : null,
            termsAndCondition: "",
            paymentInfo: "",
            exhibitions: item.exhibitions ? item.exhibitions : [],
            shippingInfo: "",
            isTermLoaded: false,
            state: item.state
          };
          if (this.$refs.auctionForm){
            var me = this;
            setTimeout(function(){
              me.$refs.auctionForm.clearValidate()
            }, 100);
          }
          if (this.auctionDialogActiveTab !== "auctionBasic") {
            this.auctionDialogActiveTab = "auctionBasic";
          }
          break;
        case 'delete':
          var me = this;
          this.$confirm(i18n.t('meebid.alertMessage.MSG_ADMIN_DELETE_AUCTION_CONFIRMATION_TEXT'), 'Delete Auction', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            me.$refs.busyIndicator.show();
            $.ajax({
              type: "POST",
              url: "/api/scene/delete",
              contentType : "application/json", 
              context: me,
              headers: {
                token: me.loginUser.token
              },
              data: JSON.stringify({
                sceneId: item.id,
              }),
              success(data) {
                if (data.code === 1){
                  if (this.auctionList.length === 1){
                    this.currentPageForAuction = 1;
                  }
                  this.refreshAuctions();
                } else {
                  this.$notify.error({
                    title: 'Failure',
                    message: 'Delete Auction failure',
                    duration: 5000
                  });
                }
              },
              error(data) {
                errorUtils.requestError(data);
                me.$refs.busyIndicator.hide();
              }
            }).done(function(){
              me.$refs.busyIndicator.hide();
            });
          }).catch(() => {
            
          });
          break;
        case 'announce':
          var me = this;
          this.$refs.busyIndicator.show();
          $.ajax({
            type: "POST",
            url: "/api/scene/preview",
            contentType : "application/json", 
            context: this,
            headers: {
              token: this.loginUser.token
            },
            data: JSON.stringify({
              sceneId: item.id,
              online: true
            }),
            success(data) {
              if (data.code === 1){
                if ((item.state & 2) != 0){
                  item.state = window.meebidConstant.auctionState.Preview + window.meebidConstant.auctionState.Waiting;
                } else {
                  item.state = window.meebidConstant.auctionState.Preview;
                }
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'Announce Auction failure',
                  duration: 5000
                })
              }
            },
            error(data) {
              errorUtils.requestError(data);
              me.$refs.busyIndicator.hide();
            }
          }).done(function(){
            me.$refs.busyIndicator.hide();
          });
          break;
        case 'deList':
          var me = this;
          this.$refs.busyIndicator.show();
          $.ajax({
            type: "POST",
            url: "/api/scene/preview",
            contentType : "application/json", 
            context: this,
            headers: {
              token: this.loginUser.token
            },
            data: JSON.stringify({
              sceneId: item.id,
              online: false
            }),
            success(data) {
              if (data.code === 1){
                if ((item.state & 2) != 0){
                  item.state = window.meebidConstant.auctionState.Basic + window.meebidConstant.auctionState.Waiting;
                } else {
                  item.state = window.meebidConstant.auctionState.Basic;
                }
                
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'De-List Auction failure',
                  duration: 5000
                })
              }
            },
            error(data) {
              errorUtils.requestError(data);
              me.$refs.busyIndicator.hide();
            }
          }).done(function(){
            me.$refs.busyIndicator.hide();
          });
          break;
        case 'publish':
          var me = this;
          this.$refs.busyIndicator.show();
          $.ajax({
            type: "POST",
            url: "/api/scene/audit/submit",
            contentType : "application/json", 
            context: this,
            headers: {
              token: this.loginUser.token
            },
            data: JSON.stringify({
              sceneId: item.id
            }),
            success(data) {
              if (data.code === 1){
                item.state += window.meebidConstant.auctionState.Waiting;
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'Publish Auction failure',
                  duration: 5000
                })
              }
            },
            error(data) {
              errorUtils.requestError(data);
              me.$refs.busyIndicator.hide();
            }
          }).done(function(){
            me.$refs.busyIndicator.hide();
          });
          break;
        case 'review':
          var me = this;
          this.$refs.busyIndicator.show();
          $.ajax({
            type: "POST",
            url: "/api/lot/audit/submit",
            contentType : "application/json", 
            context: this,
            headers: {
              token: this.loginUser.token
            },
            data: JSON.stringify({
              sceneId: item.id
            }),
            success(data) {
              if (data.code === 1){
                this.$message({
                  type: 'success',
                  message: i18n.t('meebid.alertMessage.MSG_ADMIN_AUCTION_REVIEW_ALL_LOTS_TEXT')
                });
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'Publish Auction failure',
                  duration: 5000
                })
              }
            },
            error(data) {
              errorUtils.requestError(data);
              me.$refs.busyIndicator.show();
            }
          }).done(function(){
            me.$refs.busyIndicator.hide();
          });
          break;
      }
    },
    handleLotItemCommand(command, item){
      switch(command){
        case 'edit':
          this.lotDialogVisible = true;
          this.isAddLot = false;
          if (this.$refs.lotForm){
            this.$refs.lotForm.clearValidate();
          }
          this.lotForm = {
            id: item.id,
            sceneId: item.sceneId,
            name: item.name,
            no: item.no,
            description: item.description,
            category: item.category,
            imageUrls: item.imageUrls,
            estMaxPrice: meebidUtils.formatMoneyForNumberField("", item.estMaxPrice, true, 2),
            estMinPrice: meebidUtils.formatMoneyForNumberField("", item.estMinPrice, true, 2),
            startingBid: meebidUtils.formatMoneyForNumberField("", item.startingBid, true, 2),
            reservePrice: meebidUtils.formatMoneyForNumberField("", item.reservePrice, true, 2),
            termsAndCondition: "",
            paymentInfo: "",
            shippingInfo: "",
            isTermLoaded: false,
            state: item.state
          };
          if (this.$refs.lotForm){
            var me = this;
            setTimeout(function(){
              me.$refs.lotForm.clearValidate()
            }, 100);
          }
          if (this.lotDialogActiveTab !== "lotBasic") {
            this.lotDialogActiveTab = "lotBasic";
          }
          break;
        case 'delete':
          var me = this;
          this.$confirm(i18n.t('meebid.alertMessage.MSG_ADMIN_DELETE_LOT_CONFIRMATION_TEXT'), 'Delete Lot', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            me.$refs.busyIndicator.show();
            $.ajax({
              type: "POST",
              url: "/api/lot/delete",
              contentType : "application/json", 
              context: me,
              headers: {
                token: me.loginUser.token
              },
              data: JSON.stringify({
                lotId: item.id,
              }),
              success(data) {
                if (data.code === 1){
                  if (this.auctionLotList.length === 1){
                    this.currentPageForAuctionLot = 1;
                  }
                  this.refreshAuctionLots();
                } else {
                  this.$notify.error({
                    title: 'Failure',
                    message: 'Delete Lot failure',
                    duration: 5000
                  });
                }
              },
              error(data) {
                errorUtils.requestError(data);
                me.$refs.busyIndicator.hide();
              }
            }).done(function(){
              me.$refs.busyIndicator.hide();
            });
          }).catch(() => {
            
          });
          break;
        case 'review':
          var me = this;
          this.$refs.busyIndicator.show();
          $.ajax({
            type: "POST",
            url: "/api/lot/audit/submit",
            contentType : "application/json", 
            context: this,
            headers: {
              token: this.loginUser.token
            },
            data: JSON.stringify({
              itemIds: [item.id]
            }),
            success(data) {
              if (data.code === 1){
                item.state = window.meebidConstant.lotState.Waiting;
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'Review Lot failure',
                  duration: 5000
                })
              }
            },
            error(data) {
              errorUtils.requestError(data);
              me.$refs.busyIndicator.hide();
            }
          }).done(function(){
            me.$refs.busyIndicator.hide();
          });
          break;
        case 'online':
        case 'offline':
          var me = this;
          this.$refs.busyIndicator.show();
          $.ajax({
            type: "POST",
            url: "/api/lot/online",
            contentType : "application/json", 
            context: this,
            headers: {
              token: this.loginUser.token
            },
            data: JSON.stringify({
              lotId: item.id,
              online: command === "online"
            }),
            success(data) {
              if (data.code === 1){
                item.state = command === "online" ? window.meebidConstant.lotState.Online : window.meebidConstant.lotState.Offline;
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: command === "online" ? 'Online lot failure' : "Offline lot failure",
                  duration: 5000
                })
              }
            },
            error(data) {
              errorUtils.requestError(data);
              me.$refs.busyIndicator.hide();
            }
          }).done(function(){
            me.$refs.busyIndicator.hide();
          });
          break;

      }
    },
    getAuctionDialogSubmitText(state){
      if (state === window.meebidConstant.auctionState.Basic){
        return "Create Auction";
      } else {
        return "Update";
      }
    },
    onAuctionCurrentPageChange(page) {
      this.currentPageForAuction = page;
      this.refreshAuctions();
    },
    onManageLots(item) {
      this.auctionManagementStep = "auctionLotManagement";
      this.currentSceneId = item.id;
      this.currentSceneState = item.state;
      this.currentCurrencyCode = item.currencyId;
      this.currentPageForAuctionLot = 1;
      this.totalCountForAuctionLot = 0;
      this.refreshAuctionLots();
    },
    onBackToAuctionList() {
      this.auctionManagementStep = "auctionManagement";
    },
    onAuctionLotCurrentPageChange(page) {
      this.currentPageForAuctionLot = page;
      this.refreshAuctionLots();
    },
    getLotName(name){
      return meebidUtils.fitStringToHeightByRecursive(name, 50, "meebidAdminLotName", "...", "200px");
    },
    getLotEstimationPrice(item){
      return "Est: " + meebidUtils.formatMoney(item.currencyCode, item.estMinPrice) + " - " + meebidUtils.formatMoney(item.currencyCode, item.estMaxPrice);
    },
    getLotStartPrice(item){
      return "Start: " + meebidUtils.formatMoney(item.currencyCode, item.startingBid);
    },
    getLotStateColor(state) {
      return window.meebidConstant.lotStateColor[state];
    },
    getLotStateLabel(state) {
      return window.meebidConstant.lotState[state];
    },
    formatDate(date){
      return meebidUtils.formatDate(date, i18n.t('meebid.common.MSG_DATE_FORMAT'));
    },
    formatDateWithoutSecond(date){
      return meebidUtils.formatDate(date, i18n.t('meebid.common.MSG_DATE_WITH_A_NO_SECOND_FORMAT'));
    },
    onBatchUploadAuctionLot() {
      this.batchLotDialogVisible = true;
      this.batchLotDialogStep = 0;
      this.isBatchLotFormStep1Valid = false;
      this.isBatchLotFormStep2Valid = false;
      this.batchLotTemplateResult = [];
      this.batchLotForm = {
        batchTemplate: [],
        imageUrls: []
      };
    },
    onBackBatchStep() {
      this.batchLotDialogStep--;
    },
    onNextBatchStep() {
      this.batchLotDialogStep++;
    },
    onResetBatchStep() {
      this.batchLotDialogStep = 0;
      this.isBatchLotFormStep1Valid = false;
      this.isBatchLotFormStep2Valid = false;
      this.batchLotTemplateResult = [];
      this.batchLotForm = {
        batchTemplate: [],
        imageUrls: []
      };
    },
    handleUploadLotTemplateSuccess(response, file, fileList, fieldName) {
      this.batchLotForm[fieldName] = fileList;
      this.$refs.batchLotStep1Form.validateField(fieldName);
    },
    handleUploadLotsImageSuccess(response, file, fileList, fieldName) {
      this.batchLotForm[fieldName] = fileList;
      this.$refs.batchLotStep2Form.validateField(fieldName);
    },
    getFormattedCurrencyNumber(price) {
      return meebidUtils.formatMoneyForNumberField(this.currentCurrencyCode, price);
    },
    onUpdateLots() {
      var me = this;
      this.$refs.batchLotDialogBusyIndicator.show();
      var requestObj = {
        erUid: this.batchLotForm.batchTemplate[0].rUid,
        irUids: [],
        sceneId: this.currentSceneId
      };
      for (var i = 0; i < this.batchLotTemplateResult.length; i++){
        for (var j = 0; j < this.batchLotTemplateResult[i].imageUrls.length; j++){
          requestObj.irUids.push(this.batchLotTemplateResult[i].imageUrls[j].rUid);
        }
      }
      $.ajax({
        type: "POST",
        url: "/api/lot/batch/create",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify(requestObj),
        success(data) {
          if (data.code === 1){
            this.$message({
              type: 'success',
              message: i18n.t('meebid.alertMessage.MSG_ADMIN_BATCH_UPLOAD_SUCCESS', {
                0: this.batchLotTemplateResult.length
              })
            });
            this.batchLotDialogVisible = false;
            this.currentPageForAuctionLot = 1;
            this.refreshAuctionLots();
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Batch Upload Lots failure',
              duration: 5000
            });
          }
        },
        error(data) {
          errorUtils.requestError(data);
        }
      }).done(function(){
        this.$refs.batchLotDialogBusyIndicator.hide();
      });;
    },
    onAddExhibition() {
      var me = this;
      this.exhibitionDialogVisible = true;
      this.exhibitionForm = {
        state: window.meebidConstant.exhibitionState.Newing,
        exhibitionDate: null,
        exhibitionStartTime: '09:00',
        exhibitionEndTime: '22:00',
        locId: ""
      };
      this.$nextTick(function () {
        me.$refs.exhibitionForm.clearValidate();
      });
    },
    onEditExhibition(idx, item) {
      var me = this;
      this.exhibitionDialogVisible = true;
      var exhibitionAddresses = this.addresses[32];
      var exhibitionAddress = meebidUtils.findObject(exhibitionAddresses, "id", item.locId);
      var startAtDate = new Date(item.startAt);
      var endAtDate = new Date(item.endAt);
      
      this.exhibitionForm = {
        id: item.id,
        state: item.state,
        exhibitionDate: item.startAt,
        exhibitionStartTime: meebidUtils.formatDate(startAtDate, i18n.t('meebid.common.MSG_TIME_NO_SECOND_FORMAT')), 
        exhibitionEndTime: meebidUtils.formatDate(endAtDate, i18n.t('meebid.common.MSG_TIME_NO_SECOND_FORMAT')),
        locId: exhibitionAddress ? item.locId : ""
      };
      this.$nextTick(function () {
        me.$refs.exhibitionForm.clearValidate();
      });
    },
    onDeleteExhibition(idx, item) {
      item.state = window.meebidConstant.exhibitionState.Delete;
    },
    onUpdateExhibitions() {
      var me = this;
      this.$refs.exhibitionForm.validate(function(isValid){
        if (isValid){
          if (me.exhibitionForm.state === window.meebidConstant.exhibitionState.Newing){
            var exhibition = {
              state: window.meebidConstant.exhibitionState.New,
              locId: me.exhibitionForm.locId,
            }
            var startAtDate = new Date(me.exhibitionForm.exhibitionDate);
            var startTimeArr = me.exhibitionForm.exhibitionStartTime.split(":");
            startAtDate.setHours(parseInt(startTimeArr[0]));
            startAtDate.setMinutes(parseInt(startTimeArr[1]));
            var endAtDate = new Date(me.exhibitionForm.exhibitionDate);
            var endTimeArr = me.exhibitionForm.exhibitionEndTime.split(":");
            endAtDate.setHours(parseInt(endTimeArr[0]));
            endAtDate.setMinutes(parseInt(endTimeArr[1]));
            exhibition.startAt = startAtDate;
            exhibition.endAt = endAtDate;
            me.auctionForm.exhibitions.push(exhibition);
          } else {
            var exhibition = meebidUtils.findObject(me.auctionForm.exhibitions, "id", me.exhibitionForm.id);
            var startAtDate = new Date(me.exhibitionForm.exhibitionDate);
            var startTimeArr = me.exhibitionForm.exhibitionStartTime.split(":");
            startAtDate.setHours(parseInt(startTimeArr[0]));
            startAtDate.setMinutes(parseInt(startTimeArr[1]));
            var endAtDate = new Date(me.exhibitionForm.exhibitionDate);
            var endTimeArr = me.exhibitionForm.exhibitionEndTime.split(":");
            endAtDate.setHours(parseInt(endTimeArr[0]));
            endAtDate.setMinutes(parseInt(endTimeArr[1]));
            exhibition.startAt = startAtDate;
            exhibition.endAt = endAtDate;
            exhibition.locId = me.exhibitionForm.locId;
          }
          me.exhibitionDialogVisible = false;
        }
      });
    },
    getAddressLabelById(locId){
      var exhibitionAddresses = this.addresses[32];
      var exhibitionAddress = meebidUtils.findObject(exhibitionAddresses, "id", locId);

      return exhibitionAddress ? this.getTopRegionLabel(exhibitionAddress.topRegion) + " " + this.getRegionDetail(exhibitionAddress.detail) : "Selected Exhibition Address has been deleted.";
    },
    initialExhibitionTimePicker() {
      if (this.exhibitionTimePickertInitialed){
        return;
      }
      this.$refs.exhibitionTimePicker.format = i18n.t('meebid.common.MSG_TIME_NO_SECOND_FORMAT');
      //this.$refs.exhibitionTimePicker.defaultValue = ['09:00:00', '22:00:00'];
      this.exhibitionTimePickertInitialed = true;
    },
    formatLotNo(item){
      return item.isConflict ? item.no + "*" : item.no;
    },
    handleBatchUploadDialogCommand(command) {
      switch(command){
        case 'downloadSample':
          window.open("./../static/template_new.xlsx");
          break;
        case 'exportLots':
          break;
      }
    },
    handleBatchCommand(command){
      switch(command){
        case 'batchUploadAuctionLot':
          this.onBatchUploadAuctionLot();
          break;
        case 'batchUploadAuctionLotImages':
          this.onBatchUploadAuctionLotImages();
          break;
      }
    },
    handleUploadBatchImageSuccess(response, file, fileList, fieldName) {
      this.batchImagesForm[fieldName] = fileList;
      this.$refs.batchImagesForm.validateField(fieldName);
    },
    onBatchUploadAuctionLotImages() {
      this.batchLotImagesDialogVisible = true;
      this.isBatchLotImageFormValid = false;
      this.batchLotImages = [];
      this.batchImagesForm = {
        imageUrls: []
      };
    },
    onUpdateLotImages() {
      var me = this;
      this.$refs.batchImagesForm.validate(function(isValid){
        if (isValid){
          me.$refs.batchLotDialogImagesBusyIndicator.show();
          var requestObj = {
            irUids: [],
            sceneId: me.currentSceneId
          };
          for (var i = 0; i < me.batchLotImages.length; i++){
            for (var j = 0; j < me.batchLotImages[i].imageUrls.length; j++){
              requestObj.irUids.push(me.batchLotImages[i].imageUrls[j].rUid);
            }
          }
          $.ajax({
            type: "POST",
            url: "/api/lot/batch/image/update",
            contentType : "application/json", 
            context: me,
            headers: {
              token: me.loginUser.token
            },
            data: JSON.stringify(requestObj),
            success(data) {
              if (data.code === 1){
                me.$message({
                  type: 'success',
                  message: i18n.t('meebid.alertMessage.MSG_ADMIN_BATCH_UPLOAD_IMAGES_SUCCESS')
                });
                me.batchLotImagesDialogVisible = false;
                me.currentPageForAuctionLot = 1;
                me.refreshAuctionLots();
              } else {
                me.$notify.error({
                  title: 'Failure',
                  message: 'Batch Upload Lots Image failure',
                  duration: 5000
                });
              }
            },
            error(data) {
              me.$refs.batchLotDialogImagesBusyIndicator.hide();
              errorUtils.requestError(data);
            }
          }).done(function(){
            me.$refs.batchLotDialogImagesBusyIndicator.hide();
          });
        }
      })
      
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
