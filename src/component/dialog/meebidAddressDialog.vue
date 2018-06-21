<template>
  <el-dialog title="Address" width="800px" :close-on-click-modal="false" :visible.sync="addressDialogVisible">
    <el-form ref="addressForm" status-icon :rules="addressFormRules" :model="addressForm" label-width="180px" class="meebidHouseProfileForm">
                
      <el-form-item label="Country/City/District" prop="regions">
        <el-cascader change-on-select @change="handleAddressChange" :options="regionOptions" style="width: 300px;" :props="regionProp" v-model="addressForm.regions" placeholder="Select...">
        </el-cascader>
      </el-form-item>
      <el-form-item label="Address" prop="detail">
        <el-input v-model="addressForm.detail" placeholder="Please input address"></el-input>
      </el-form-item>
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
</template>

<script>
  import meebidUtils from './../../utils/meebidUtils'
  import $ from 'jquery'
  import loginUtils from './../../utils/loginUtils'

  export default {
    name: 'meebid-address-dialog',
    props: {
      items: {
        type: Array,
        'default': []
      }
    },
    data () {
      return {
        addressForm: {
          addressId: 0,
          regions: [],
          detail: '',
          type: meebidConstant.addressType.Shipping,
          isDefault: false
        },
        addressFormRules: {
          regions: [
            { required: true, message: 'Please select Country/City/District', trigger: 'input' },
            { validator: validateRegions, trigger: 'input' }
          ],
          detail: [
            { required: true, message: 'Please input address', trigger: 'change' }
          ]
        },
        addressDialogVisible: false
      }
    },
    computed: {
    },
    mounted () {

    },
    methods: {
      onEditAddress(address) {
        var me = this;
        this.addressDialogVisible = true;
        if (!this.checkRegionAvailable(this.buildRegionArr(address.regions), this.regionOptions)){
          if (this.$refs.addressFormBusyIndicator){
            this.$refs.addressFormBusyIndicator.show();
            this.fetchRegions(address);
          } else {
            setTimeout(function(){
              me.$refs.addressFormBusyIndicator.show();
              me.fetchRegions(address);
            }, 200);
          }
          
        } else {
          this.addressForm.addressId = address.id;
          this.addressForm.regions = this.buildRegionArr(address.regions);
          this.addressForm.detail = address.detail;
          this.addressForm.type = address.type;
          this.addressForm.isDefault = address.isDefault;
        }
      }
      onCancel() {

      },
      onUpdateAddress() {
        var me = this;
        var requestObj = {
          addressId: this.addressForm.addressId,
          regions: this.addressForm.regions,
          detail: this.addressForm.detail,
          type: this.addressForm.isDefault ? this.addressForm.type + 1 : this.addressForm.type
        };
        this.$refs.addressForm.validate(function(isValid){
          if (isValid){
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
                      regions: this.buildRegionWithLabelArr(this.addressForm.regions),
                      detail: this.addressForm.detail,
                      isDefault: this.addressForm.isDefault,
                      type: this.addressForm.type,
                      currencyId: data.content.currencyId
                    }
                    currentAddressId = data.content.id;
                    this.addresses[this.addressForm.type].push(addressObj);
                  } else {
                    this.addresses[this.addressForm.type].forEach(address => {
                      if (address.id === this.addressForm.addressId){
                        address.regions = this.buildRegionWithLabelArr(this.addressForm.regions);
                        address.detail = this.addressForm.detail;
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
                    regions: [],
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
      }
    }
  }
</script>
