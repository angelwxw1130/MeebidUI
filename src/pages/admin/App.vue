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
              <span slot="title" class="meebidAdminMenuLabel">House Auction Information</span>
            </el-menu-item>
          </template>
          <template v-if="userProfile.type === userType.member">
            <el-menu-item index="memberAddress">
              <i class="el-icon-menu"></i>
              <span slot="title" class="meebidAdminMenuLabel">Address Management</span>
            </el-menu-item>
          </template>
          <template v-if="userProfile.type === userType.house">
            <el-menu-item index="houseAddress">
              <i class="el-icon-menu"></i>
              <span slot="title" class="meebidAdminMenuLabel">Address Management</span>
            </el-menu-item>
          </template>
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
      <div class="meebidAdminContent">
        <meebid-busy-indicator ref="busyIndicator" size="Medium"></meebid-busy-indicator>
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
                  <div v-for="(item,index) in userProfileForm.contact_users" class="{meebidPaddingBottomSmall: index === userProfileForm.contact_users.length}">
                    <span style="display: inline-block; width: 180px;" >{{item.phone}}</span>
                    <span class="meebidPaddingLeftSmall">
                      <el-button size="small" class="meebidNoBorderButton" icon="el-icon-edit" @click="onEditPhoneNumber(index, item)"></el-button>
                      <el-button size="small" icon="el-icon-delete" class="meebidNoBorderButton" @click="onDeletePhoneNumber(index, item)"></el-button>
                    </span>
                  </div>
                  <div class="" v-if="userProfileForm.contact_users.length < 5"><el-button size="small" type="primary" @click="onAddPhoneNumber">Add Phone</el-button></div>
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
              
              <el-form ref="houseProfileForm" :model="houseProfileForm" :rules="houseProfileFormRules" label-width="180px" class="meebidHouseProfileForm">
                <el-form-item label="" v-if="userProfile.right === 4097">
                  <el-alert class="meebidAlertMessage" :closable="false"
                    :title="$t('meebid.alertMessage.MSG_PROFILE_ACCOUNT_NOT_ACTIVATE')"
                    type="warning">
                  </el-alert>
                </el-form-item>
                <el-form-item label="" v-if="userProfile.right === 4098">
                  <el-alert class="meebidAlertMessage" :closable="false"
                    :title="$t('meebid.alertMessage.MSG_PROFILE_ACCOUNT_NOT_APPROVE')"
                    type="warning">
                  </el-alert>
                </el-form-item>
                <el-form-item label="Email">
                  <el-input readonly v-model="houseProfileForm.email" class="meebidFormFieldMediumLength" placeholder="Please input email address"></el-input>
                  <el-button v-if="userProfile.right === 4097" class="meebidFormFieldRevalidateButton" type="primary" size="small" ref="houseRevalidate" :disabled="houseRevalidateButtonDisabled" @click="onHouseRevalidate">{{revalidateHouseLabel}}</el-button>
                </el-form-item>
                <el-form-item label="Auction House Name" prop="name">
                  <el-input v-model="houseProfileForm.name" placeholder="Please input Auction House Name"></el-input>
                </el-form-item>
                <el-form-item label="Auction Website Address">
                  <el-input v-model="houseProfileForm.website" placeholder="Please input Auction Website Address"></el-input>
                </el-form-item>
                <!--<el-form-item label="Contact Name">
                  <el-input v-model="houseProfileForm.firstName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input First Name"></el-input>
                  <el-input v-model="houseProfileForm.lastName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input Last Name"></el-input>
                </el-form-item>
                <el-form-item label="Auction Contact Number" class="">
                  <el-input v-model="houseProfileForm.contact_cellphone" placeholder="Please input Cellphone"></el-input>
                </el-form-item>-->
                <el-form-item label="Contact Users">
                  <div v-for="(item,index) in houseProfileForm.contact_users" class="{meebidPaddingBottomSmall: index === houseProfileForm.contact_users.length}">
                    <span style="display: inline-block; width: 40px;" >{{getTitleLabel(item.titleId)}}</span>
                    <span style="display: inline-block; width: 150px;" >{{item.firstName}} {{item.lastName}}</span>
                    <span style="display: inline-block; width: 150px;" >{{item.phone}}</span>
                    <span class="meebidPaddingLeftSmall">
                      <el-button size="small" class="meebidNoBorderButton" icon="el-icon-edit" @click="onEditContactUser(index, item)"></el-button>
                      <el-button size="small" icon="el-icon-delete" class="meebidNoBorderButton" @click="onDeleteContactUser(index, item)"></el-button>
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
                <el-form-item class="meebidUserProfileLongLabel" label="Auction House Representative Legal ID">
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
                  <el-button type="primary" @click="onUpdateHouseProfile">UPDATE AUCTION HOUSE INFORMATION</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div v-if="active === 'memberAddress' || active === 'houseAddress'" class="meebidPaddingTopSmall meebidAddressWrapper">
          <el-row ref="meebidAddressHeader">
            <el-col :span="24" class="meebidUserProfileFormWrapper">
              <div class="meebidLoginDialogLabel meebidRegisterHeaderLabel">Address Management</div>
              <div class="meebidRegisterHeaderLabel" v-if="active === 'memberAddress'">You can manage your Billing Address and Shipping Address.</div>
              <div class="meebidRegisterHeaderLabel" v-if="active === 'houseAddress'">You can manage your Exhibition Address, Bidding Venue Address and Pick-up Warehouse Address.</div>
              <el-form ref="addressFormRef" :model="addressForm" :rules="addressFormRules" label-width="180px" class="meebidHouseProfileForm">
                <meebid-busy-indicator ref="addressFormBusyIndicator" size="Medium"></meebid-busy-indicator>
                <el-form-item label="Country/City/District">
                  <el-cascader change-on-select @change="handleAddressChange" :options="regionOptions" style="width: 300px;" :props="regionProp" v-model="addressForm.regions" placeholder="Select...">
                  </el-cascader>
                  
                </el-form-item>
                <el-form-item label="Address">
                  <el-input v-model="addressForm.detail" placeholder="Please input address">
                    
                  </el-input>
                </el-form-item>
                <el-form-item label="Address Type">
                  <el-select v-model="addressForm.type" placeholder="Select..." :disabled="addressForm.addressId > 0">
                    <el-option
                      v-for="item in (active === 'memberAddress' ? memberAddressOptions : houseAddressOptions)"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Set as default">
                  <el-checkbox v-model="addressForm.isDefault"></el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :disabled="isUpdateAddressButtonDisabled" @click="onUpdateAddress">SAVE</el-button>
                  <el-button type="primary" :disabled="isUpdateAddressButtonDisabled" @click="onResetAddress">RESET</el-button>
                  <div style="width: 100%; height: 34px; margin-top: 10px;">
                    <el-alert show-icon v-if="isUpdateAddressButtonDisabled" class="meebidMarginTopSmall meebidMaximumAddressAlertMessage" :closable="false"
                      title="You cannot have more than 5 same type addresses."
                      type="warning">
                    </el-alert>
                  </div>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <div v-if="active === 'memberAddress'">
            <span class="meebidAddressManagementTableHeader meebidPaddingLeftSmall meebidPaddingBottomSmall meebidPaddingTopMedium">Shipping Address</span>
            <el-table
              :data="addresses[16]"
              border
              style="width: 100%">
              <el-table-column
                label="Country/City/District" width="240"
                >
                <template slot-scope="scope">
                  <span>{{getRegionLabel(scope.row.regions)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="detail"
                label="Address"
                >
              </el-table-column>
              <el-table-column
                label="Actions"
                width="240"
                >
                <template slot-scope="scope">
                  <el-button size="small" class="meebidNoBorderButton" icon="el-icon-edit" @click="handleEditAddress(scope.row)"></el-button>
                  <el-button size="small" class="meebidNoBorderButton" icon="el-icon-delete" @click="handleDeleteAddress(scope.row)"></el-button>
                  <el-button size="small" v-if="scope.row.isDefault !== true" class="meebidNoBorderButton" @click="handleSetDefaultAddress(scope.row)">Set as Default</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="active === 'memberAddress'" class="meebidPaddingTopMedium">
            <span class="meebidAddressManagementTableHeader meebidPaddingLeftSmall meebidPaddingBottomSmall meebidPaddingTopMedium">Billing Address</span>
            <el-table
              :data="addresses[8]"
              border
              style="width: 100%">
              <el-table-column
                label="Country/City/District"
                width="240">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{getRegionLabel(scope.row.regions)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="detail"
                label="Address"
                >
              </el-table-column>
              <el-table-column
                label="Actions"
                width="240"
                >
                <template slot-scope="scope">
                  <el-button size="small" class="meebidNoBorderButton" icon="el-icon-edit" @click="handleEditAddress(scope.row)"></el-button>
                  <el-button size="small" class="meebidNoBorderButton" icon="el-icon-delete" @click="handleDeleteAddress(scope.row)"></el-button>
                  <el-button size="small" v-if="scope.row.isDefault !== true" class="meebidNoBorderButton" @click="handleSetDefaultAddress(scope.row)">Set as Default</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="active === 'houseAddress'">
            <span class="meebidAddressManagementTableHeader meebidPaddingLeftSmall meebidPaddingBottomSmall meebidPaddingTopMedium">Pick-up Warehouse Address</span>
            <span style="display: block;" class="meebidPaddingLeftSmall meebidPaddingBottomSmall" >You <b>cannot</b> create Auction without Pick-up Warehouse Address.</span>
            <el-table
              :data="addresses[128]"
              border
              style="width: 100%">
              <el-table-column
                label="Country/City/District"
                width="240">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{getRegionLabel(scope.row.regions)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="detail"
                label="Address"
                >
              </el-table-column>
              <el-table-column
                label="Actions"
                width="240"
                >
                <template slot-scope="scope">
                  <el-button size="small" class="meebidNoBorderButton" icon="el-icon-edit" @click="handleEditAddress(scope.row)"></el-button>
                  <el-button size="small" class="meebidNoBorderButton" icon="el-icon-delete" @click="handleDeleteAddress(scope.row)"></el-button>
                  <el-button size="small" v-if="scope.row.isDefault !== true" class="meebidNoBorderButton" @click="handleSetDefaultAddress(scope.row)">Set as Default</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="active === 'houseAddress'" class="meebidPaddingTopMedium">
            <span class="meebidAddressManagementTableHeader meebidPaddingLeftSmall meebidPaddingBottomSmall meebidPaddingTopMedium">Exhibition Address</span>
            <el-table
              :data="addresses[32]"
              border
              style="width: 100%">
              <el-table-column
                label="Country/City/District"
                width="240">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{getRegionLabel(scope.row.regions)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="detail"
                label="Address"
                >
              </el-table-column>
              <el-table-column
                label="Actions"
                width="240"
                >
                <template slot-scope="scope">
                  <el-button size="small" class="meebidNoBorderButton" icon="el-icon-edit" @click="handleEditAddress(scope.row)"></el-button>
                  <el-button size="small" class="meebidNoBorderButton" icon="el-icon-delete" @click="handleDeleteAddress(scope.row)"></el-button>
                  <el-button size="small" v-if="scope.row.isDefault !== true" class="meebidNoBorderButton" @click="handleSetDefaultAddress(scope.row)">Set as Default</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="active === 'houseAddress'" class="meebidPaddingTopMedium">
            <span class="meebidAddressManagementTableHeader meebidPaddingLeftSmall meebidPaddingBottomSmall meebidPaddingTopMedium">Bidding Venue Address</span>
            <el-table
              :data="addresses[64]"
              border
              style="width: 100%">
              <el-table-column
                label="Country/City/District"
                width="240">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{getRegionLabel(scope.row.regions)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="detail"
                label="Address"
                >
              </el-table-column>
              <el-table-column
                label="Actions"
                width="240"
                >
                <template slot-scope="scope">
                  <el-button size="small" class="meebidNoBorderButton" icon="el-icon-edit" @click="handleEditAddress(scope.row)"></el-button>
                  <el-button size="small" class="meebidNoBorderButton" icon="el-icon-delete" @click="handleDeleteAddress(scope.row)"></el-button>
                  <el-button size="small" v-if="scope.row.isDefault !== true" class="meebidNoBorderButton" @click="handleSetDefaultAddress(scope.row)">Set as Default</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="height: 50px;"></div>
        </div>
        <div v-else-if="active === 'message'">
          Placeholder for Message Box
        </div>
      </div>
      <el-dialog :visible.sync="previewDialogVisible">
        <img width="100%" :src="previewDialogImageUrl" alt="">
      </el-dialog>

      <el-dialog :visible.sync="phoneNumberDialogVisible" class="meebidPhoneNumberDialog" title="Phone Number" width="500px">
        <el-form ref="phoneFormRef" :model="phoneForm" class="" label-width="0px">
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

      <el-dialog :visible.sync="contactUserDialogVisible" class="meebidPhoneNumberDialog" title="Contact User" width="800px">
        <el-form ref="contactUserFormRef" :model="contactUserForm" class="" label-width="180px">
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
          <el-form-item label="First Name & Last Name">
            <el-input v-model="contactUserForm.firstName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input First Name"></el-input>
            <el-input v-model="contactUserForm.lastName" class="meebidUserProfileUserName meebidFormFieldSmallLength" placeholder="Please input Last Name"></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="Phone Number">
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
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="contactUserDialogVisible = false" class="">Cancel</el-button>
          <el-button type="primary" @click="onSaveContactUser" class="">Save</el-button>
        </span>
      </el-dialog>

      <meebid-category-dialog :items="categoryItems" :isProfilePage="isProfilePage" @update="onFieldDataChange" ref="categoryDialog">
      </meebid-category-dialog>
    </div>
  </div>
</template>

<script>
import loginUtils from './../../utils/loginUtils'
import meebidUtils from './../../utils/meebidUtils'
import i18n from './../../i18n/i18n'
import $ from 'jquery'
export default {
  data () {
    return {
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
      regionProp: {
        value: 'id',
        label: 'name',
        children: 'childrens'
      },
      addressForm: {
        addressId: 0,
        regions: [],
        detail: "",
        type: meebidConstant.addressType.Shipping,
        isDefault: false
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
      contactUserForm: {
        firstName: "",
        lastName: "",
        //Mr.
        titleId: 2,
        phone: "",
        //36 is for US
        region: 36
      },
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
      houseProfileFormRules: {
        name: [
          { required: true, message: 'Please input Auction House Name', trigger: 'blur' }          
        ]
      },
      addressFormRules: {

      },
      categoryItems: []
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
    if (this.$parent.$data && this.$parent.$data.titles && this.$parent.$data.titles.length){
      this.titleOptions = this.$parent.$data.titles;
    }
    if (this.$parent.$data && this.$parent.$data.user){
      this.userProfile = this.$parent.$data.user;
      
      if (this.userProfile.type === window.meebidConstant.userType.member){
        if (this.userProfile.firstName){
          this.firstName = this.userProfile.firstName;
        }
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
        if (this.userProfile.name){
          this.firstName = this.userProfile.name;
        }
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
    
  },

  methods: {
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
          confirmButtonText: 'Confirm',
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
      this.active = key;
      switch (key){
        case 'memberAddress':
          this.addressForm = {
            addressId: 0,
            regions: [],
            detail: "",
            type: meebidConstant.addressType.Shipping,
            isDefault: false
          };
          this.$refs.busyIndicator.show();
          $.ajax({
            type: "GET",
            url: "/api/user/addresses",
            contentType : "application/json", 
            headers: {
              token: this.loginUser.token
            },
            context: this,
            data: {
              type: meebidConstant.addressType.Shipping|meebidConstant.addressType.Billing,
              offset: 0,
              count: 20
            },
            dataType: 'json',
            success(data) {
              this.$refs.busyIndicator.hide();
              this.addresses[meebidConstant.addressType.Shipping] = [];
              this.addresses[meebidConstant.addressType.Billing] = [];
              if (data.code === 1){
                for (var i = 0; i < data.content.addresses.length; i++){
                  var address = data.content.addresses[i];
                  
                  address.isDefault = address.type % 2 === 1;
                  address.type = address.type - address.type % 2;
                  this.addresses[address.type].push(address);
                }
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'Fetch Address Data failure',
                  duration: 5000
                })
              }
              
            },
            error() {
              this.$refs.busyIndicator.hide();
              this.$notify.error({
                title: 'Failure',
                message: 'Fetch Address Data failure',
                duration: 5000
              })
            }
          });
          break;
        case 'houseAddress':
          this.addressForm = {
            addressId: 0,
            regions: [],
            detail: "",
            type: meebidConstant.addressType.Exhibition,
            isDefault: false
          };
          this.$refs.busyIndicator.show();
          $.ajax({
            type: "GET",
            url: "/api/user/addresses",
            contentType : "application/json", 
            headers: {
              token: this.loginUser.token
            },
            context: this,
            data: {
              type: meebidConstant.addressType.Exhibition|meebidConstant.addressType.BiddingVenue|meebidConstant.addressType.PickupWarehouse,
              offset: 0,
              count: 20
            },
            dataType: 'json',
            success(data) {
              this.$refs.busyIndicator.hide();
              this.addresses[meebidConstant.addressType.Exhibition] = [];
              this.addresses[meebidConstant.addressType.BiddingVenue] = [];
              this.addresses[meebidConstant.addressType.PickupWarehouse] = [];
              if (data.code === 1){
                for (var i = 0; i < data.content.addresses.length; i++){
                  var address = data.content.addresses[i];
                  
                  address.isDefault = address.type % 2 === 1;
                  address.type = address.type - address.type % 2;
                  this.addresses[address.type].push(address);
                }
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'Fetch Address Data failure',
                  duration: 5000
                })
              }
            },
            error() {
              this.$refs.busyIndicator.hide();
              this.$notify.error({
                title: 'Failure',
                message: 'Fetch Address Data failure',
                duration: 5000
              })
            }
          });
          break;
      }
    },
    openUserProfile() {
      //window.open("./admin.html", '_blank');
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
            error() {
              this.$notify.error({
                title: 'Failure',
                message: 'Update failure',
                duration: 5000
              })
            }
          })
        }
      })
      
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
        dataType : 'json',
        success(data) {
          if (data.code === 1){
            this.$message({
              type: 'success',
              message: data.msg
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
    onHouseRevalidate() {
      this.houseRevalidateButtonDisabled = true;
      $.ajax({
        type: "POST",
        url: "/api/user/revalidate",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        dataType : 'json',
        data: JSON.stringify({
          email: this.userProfile.email
        }),
        success(data) {
          if (data.code === 1){
            this.$message({
              type: 'success',
              message: data.msg
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
          me.revalidateHouseLabel = "RE-VALIDATE";
          me.houseRevalidateButtonDisabled = false;
          window.clearInterval(interval);
          return;
        }
        me.revalidateHouseLabel = (count-- - 1) + 's';
        
      }, 1000);
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
    },
    onAddPhoneNumber() {
      this.updatePhoneIndex = -1;
      this.phoneForm.phone = "";
      this.phoneForm.region = this.regionOptions[0].id;
      this.phoneNumberDialogVisible = true;
    },
    onEditPhoneNumber(index, item){
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
      if (this.updatePhoneIndex === -1){
        this.userProfileForm.contact_users.push({
          id: 0,
          phone: meebidUtils.convertPhoneObjToStr(this.phoneForm.region, this.phoneForm.phone, this.regionOptions)
        });
        this.phoneNumberDialogVisible = false;
      } else {
        this.userProfileForm.contact_users[this.updatePhoneIndex].phone = meebidUtils.convertPhoneObjToStr(this.phoneForm.region, this.phoneForm.phone, this.regionOptions);
        this.phoneNumberDialogVisible = false;
      }
      this.onFieldDataChange();
    },
    onAddContactUser() {
      this.updateContactUserIndex = -1;
      this.contactUserForm.phone = "";
      this.contactUserForm.region = this.regionOptions[0].id;
      this.contactUserForm.titleId = this.titleOptions[0].id;
      this.contactUserForm.firstName = "";
      this.contactUserForm.lastName = "";
      this.contactUserDialogVisible = true;
    },
    onEditContactUser(index, item){
      this.updateContactUserIndex = index;
      var phoneObj = meebidUtils.convertPhoneStrToObj(item.phone, this.regionOptions);
      this.contactUserForm.phone = phoneObj.phone;
      this.contactUserForm.region = phoneObj.region;
      this.contactUserForm.firstName = item.firstName;
      this.contactUserForm.lastName = item.lastName;
      this.contactUserForm.titleId = item.titleId || null;
      this.contactUserDialogVisible = true;
    },
    onDeleteContactUser(index, item){
      this.houseProfileForm.contact_users.splice(index, 1);
      this.onFieldDataChange();
    },
    onSaveContactUser() {
      if (this.updateContactUserIndex === -1){
        this.houseProfileForm.contact_users.push({
          id: 0,
          firstName: this.contactUserForm.firstName,
          lastName: this.contactUserForm.lastName,
          titleId: this.contactUserForm.titleId,
          phone: meebidUtils.convertPhoneObjToStr(this.contactUserForm.region, this.contactUserForm.phone, this.regionOptions)
        });
        this.contactUserDialogVisible = false;
      } else {
        this.houseProfileForm.contact_users[this.updateContactUserIndex].phone = meebidUtils.convertPhoneObjToStr(this.contactUserForm.region, this.contactUserForm.phone, this.regionOptions);
        this.houseProfileForm.contact_users[this.updateContactUserIndex].firstName = this.contactUserForm.firstName;
        this.houseProfileForm.contact_users[this.updateContactUserIndex].lastName = this.contactUserForm.lastName;
        this.houseProfileForm.contact_users[this.updateContactUserIndex].titleId = this.contactUserForm.titleId;
        this.contactUserDialogVisible = false;
      }
      this.onFieldDataChange();
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
    onFieldDataChange() {
      var me = this;
      this.hasPendingChange = true;
      window.onbeforeunload = function(){
        return i18n.t('meebid.alertMessage.MSG_LEAVE_WITH_UNSAVED_DATA');
      }
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
    },
    handleAddressChange(val) {
      if (val && val.length > 0){
        var regionOption = this.getSelectedRegionOptions(val, this.regionOptions);
        if (regionOption.hasMore === 1 && regionOption.isLoaded === false){
          $.ajax({
            type: "GET",
            url: "/api/public/regions",
            contentType : "application/json", 
            context: this,
            data: {
              upperLevel: val[val.length - 1],
              level: val.length
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
            error() {
              this.$notify.error({
                title: 'Failure',
                message: 'Get Region Data failure',
                duration: 5000
              })
            }
          });
        }
      }
    },
    onResetAddress() {
      var currentType = this.addressForm.type;
      switch (this.active){
        case 'memberAddress':
          this.addressForm = {
            addressId: 0,
            regions: [],
            detail: "",
            type: currentType,
            isDefault: false
          };
          break;
        case 'houseAddress':
          this.addressForm = {
            addressId: 0,
            regions: [],
            detail: "",
            type: currentType,
            isDefault: false
          };
          break;
      }
    },
    onUpdateAddress() {
      var me = this;
      var requestObj = {
        addressId: this.addressForm.addressId,
        regions: this.addressForm.regions,
        detail: this.addressForm.detail,
        type: this.addressForm.isDefault ? this.addressForm.type + 1 : this.addressForm.type
      };
      $.ajax({
        type: "POST",
        url: "/api/user/address/insupd",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify(requestObj),
        success(data) {
          if (data.code === 1){
            if (this.addressForm.addressId === 0){
              var addressObj = {
                ID: data.content.addressId.addressId,
                regions: this.buildRegionWithLabelArr(this.addressForm.regions),
                detail: this.addressForm.detail,
                isDefault: this.addressForm.isDefault,
                type: this.addressForm.type
              }
              this.addresses[this.addressForm.type].push(addressObj);
            } else {
              this.addresses[this.addressForm.type].forEach(address => {
                if (address.ID === this.addressForm.addressId){
                  address.regions = this.buildRegionWithLabelArr(this.addressForm.regions);
                  address.detail = this.addressForm.detail;
                  address.isDefault = this.addressForm.isDefault;
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
              regions: [],
              detail: "",
              type: currentType,
              isDefault: false
            };
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Update Address failure',
              duration: 5000
            })
          }
          
        },
        error() {
          this.$notify.error({
            title: 'Failure',
            message: 'Update Address failure',
            duration: 5000
          })
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
    handleEditAddress(address) {
      this.$refs.meebidAddressHeader.$el.scrollIntoView();
      if (!this.checkRegionAvailable(this.buildRegionArr(address.regions), this.regionOptions)){
        this.$refs.addressFormBusyIndicator.show();
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
              this.addressForm.addressId = address.ID;
              this.addressForm.regions = this.buildRegionArr(address.regions);
              this.addressForm.detail = address.detail;
              this.addressForm.type = address.type;
              this.addressForm.isDefault = address.isDefault;
            } else {
              this.$notify.error({
                title: 'Failure',
                message: 'Fetch Address failure',
                duration: 5000
              })
            }
            this.$refs.addressFormBusyIndicator.hide();
            
          },
          error() {
            this.$refs.addressFormBusyIndicator.hide();
            me.$notify.error({
              title: 'Failure',
              message: 'Fetch Address failure',
              duration: 5000
            })
          }
        });
      } else {
        this.addressForm.addressId = address.ID;
        this.addressForm.regions = this.buildRegionArr(address.regions);
        this.addressForm.detail = address.detail;
        this.addressForm.type = address.type;
        this.addressForm.isDefault = address.isDefault;
      }
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
            addressId: address.ID,
            phone: '-1'
          }),
          success(data) {
            if (data.code === 1){
              var index = this.addresses[address.type].indexOf(address);
              this.addresses[address.type].splice(index, 1);
            } else {
              this.$notify.error({
                title: 'Failure',
                message: 'Update Address failure',
                duration: 5000
              })
            }
            
          },
          error() {
            me.$notify.error({
              title: 'Failure',
              message: 'Update Address failure',
              duration: 5000
            })
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
         message = i18n.t('meebid.alertMessage.MSG_SET_DEFAULT_BIDDING_VENUE_ADDRESS_CONFIRMATION_TEXT');
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
            addressId: address.ID,
            regions: this.buildRegionArr(address.regions),
            detail: address.detail,
            type: address.type + 1,
            isDefault: address.isDefault
          }),
          success(data) {
            if (data.code === 1){
              address.isDefault = true;
              this.addresses[address.type].forEach(addressObj => {
                if (addressObj.ID !== address.ID){
                  addressObj.isDefault = false;
                }
              });
              this.$message({
                type: 'success',
                message: i18n.t('meebid.alertMessage.MSG_ADMIN_USER_DEFAULT_ADDRESS_SUCCESS')
              })
            } else {
              this.$notify.error({
                title: 'Failure',
                message: 'Set as Default Address failure',
                duration: 5000
              })
            }
            
          },
          error() {
            this.$notify.error({
              title: 'Failure',
              message: 'Set as Default Address failure',
              duration: 5000
            })
          }
        });
      }).catch(() => {

      });
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
