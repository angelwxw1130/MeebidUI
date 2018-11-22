<template>
  <el-dialog title="Register to Bid" class="meebidRegisterDialog" :visible.sync="registerDialogVisible" width="800px" :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="registerDialogWrapper meebidPaddingBottomMedium">
      <div v-if="step == 0">
        <div>
          <span style="font-size: 18px;">Your registration:</span>
        </div>
        <div class="meebidLink meebidRegisterDialogAddNewLink" v-if="showRegisterLink" @click="onRegisterNew"><span class="glyphicon glyphicon-registration-mark"></span> Register another bid</div>
        <div class="meebidPaddingTopMedium meebidPaddingLeftMedium" v-for="apply in lotItem.applys">
          <span style="display: inline-block; width: 150px; vertical-align: top;">{{getRegisterType(apply)}}</span>
          <span style="display: inline-block; width: 200px; vertical-align: top;" v-if="apply.type === applyType.Absent">{{getPrice(apply.maxBidPrice)}}</span>
          <span style="display: inline-block; width: 200px; vertical-align: top;" v-if="apply.type === applyType.Telephone">
            <span>{{getPhone(apply.telephone1)}}<br></span>
            <span v-if="apply.telephone2">{{getPhone(apply.telephone2)}}<br></span>
            <span v-if="apply.telephone3">{{getPhone(apply.telephone3)}}</span>
          </span>
          <span style="display: inline-block; width: 200px; vertical-align: top;" >
            <span class="meebidPaddingLeftSmall meebidPaddingRightSmall meebidApplyLotStateLabel" :style="{background: getStateColor(apply.state)}">{{getStateLabel(apply.state)}}</span>
          </span>
          <span class="meebidPaddingLeftSmall">
            <el-button size="small" type="primary" class="meebidNoBorderButton" icon="el-icon-edit" @click="onEditApply(apply)"></el-button>
            <el-button size="small" type="primary" icon="el-icon-delete" class="meebidNoBorderButton" @click="onDeleteApply(apply)"></el-button>
          </span>
        </div>
      </div>
      <div v-if="step == 1">
        <el-form ref="bidForm" label-width="180px" :model="bidForm" class="meebidPaddingRightMedium">
          <el-form-item label="Register Type" class="meebidFormNoMarginBottom">
            <el-radio-group v-model="bidForm.type" @change="onRegisterTypeChange">
              <el-radio :label="applyType.Telephone" v-if="!isTelBidRegistered">Telephone Bid</el-radio>
              <el-radio :label="applyType.Absent" v-if="!isAbsentBidRegistered">Absent Bid</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Lot No." prop="lotNo" class="meebidFormNoMarginBottom">
            <span>{{lotItem.no}}</span>
          </el-form-item>
        </el-form>
        <el-form ref="absentBidForm" label-width="180px" v-if="isAbsentBidFormVisible" :model="absentBidForm" :rules="absentBidFormRules" class="meebidPaddingRightMedium meebidPaddingBottomMedium">
          <el-form-item label="Maxium Bid Price"  prop="maxBidPrice">
            <meebid-number-input v-model="absentBidForm.maxBidPrice" placeholder="Please input maxium bid price"></meebid-number-input>
          </el-form-item>
        </el-form>
        <el-form ref="telBidForm" label-width="180px" v-if="isTelBidFormVisible" :model="telBidForm" :rules="telBidFormRules" class="meebidPaddingRightMedium meebidPaddingBottomMedium">
          <el-form-item prop="telephone1" label="Phone Number 1">
            <el-input v-model="telBidForm.telephone1" placeholder="Please input phone number">
              <el-select v-model="telBidForm.region1" style="width:110px;" slot="prepend" placeholder="Select...">
                <el-option
                  v-for="item in regionOptions"
                  :key="item.id"
                  :label="item.telCode"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item prop="telephone2" label="Phone Number 2">
            <el-input v-model="telBidForm.telephone2" placeholder="Please input phone number">
              <el-select v-model="telBidForm.region2" style="width:110px;" slot="prepend" placeholder="Select...">
                <el-option
                  v-for="item in regionOptions"
                  :key="item.id"
                  :label="item.telCode"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item prop="telephone3" label="Phone Number 3">
            <el-input v-model="telBidForm.telephone3" placeholder="Please input phone number">
              <el-select v-model="telBidForm.region3" style="width:110px;" slot="prepend" placeholder="Select...">
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
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">Cancel</el-button>
      <el-button v-if="showBackButton" @click="onBack">Back</el-button>
      <el-button type="primary" v-if="step == 1" @click="onSave" :disabled="noItemSelected">{{saveButtonText}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import meebidUtils from './../../utils/meebidUtils'
  import errorUtils from './../../utils/errorUtils'
  import $ from 'jquery'
  import loginUtils from './../../utils/loginUtils'
  import i18n from './../../i18n/i18n'
  export default {
    name: 'meebid-register-dialog',
    props: {

    },
    data () {
      return {
        step: 1,
        showBackButton: false,
        showRegisterLink: true,
        registerDialogVisible: false,
        isTelBidRegistered: false,
        isAbsentBidRegistered: false,
        loginUser: loginUtils.getLoginUser(),
        isTelBidFormVisible: true,
        isAbsentBidFormVisible: false,
        saveButtonText: "Register",
        applyType: window.meebidConstant.applyType,
        bidForm: {
          type: 1
        },
        telBidForm: {},
        absentBidForm: {},
        absentBidFormRules: {
          maxBidPrice: [
            { required: true, message: 'Please input Maxium Bid Price', trigger: 'change' }          
          ]
        },
        telBidFormRules: {
          telephone1: [
            { required: true, message: 'Please provide at least 1 phone number', trigger: 'change' }
          ]
        },
        regionOptions: [],
        lotItem: {
          applys: []
        },
      }
    },
    computed: {
    },
    beforeMount(){
      var me = this;
      $.ajax({
        type: "GET",
        url: "/api/public/regions",
        contentType : "application/json", 
        context: this,
        data: {
          level: 1
        },
        dataType: 'json',
        success(data) {
          if (data.code === 1){
            me.regionOptions = data.content.regions;
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

    mounted () {
      
    },
    methods: {
      onRegisterTypeChange(type){
        if (type === window.meebidConstant.applyType.Telephone){
          this.isTelBidFormVisible = true;
          this.isAbsentBidFormVisible = false;
        } else {
          this.isTelBidFormVisible = false;
          this.isAbsentBidFormVisible = true;
        }
      },
      openDialog(lotItem){
        this.registerDialogVisible = true;
        this.lotItem = lotItem;
        if (this.lotItem.applys.length){
          this.step = 0;
          var telBidObj = meebidUtils.findObject(this.lotItem.applys, 'type', window.meebidConstant.applyType.Telephone);
          var absentBidObj = meebidUtils.findObject(this.lotItem.applys, 'type', window.meebidConstant.applyType.Absent);
          this.isTelBidRegistered = telBidObj != null;
          this.isAbsentBidRegistered = absentBidObj != null;
          if (this.isTelBidRegistered && this.isAbsentBidRegistered) {
            this.showRegisterLink = false;
          } else {
            this.showRegisterLink = true;
          }
          this.showBackButton = false;
        } else {
          this.bidForm = {
            type: window.meebidConstant.applyType.Telephone
          };
          this.telBidForm = {
            //default region US
            region1: 36,
            region2: 36,
            region3: 36
          }
          this.step = 1;
          this.isTelBidFormVisible = true;
          this.isAbsentBidFormVisible = false;
          this.saveButtonText = "Register";
        }
      },
      onEditApply(apply){
        this.bidForm.type = apply.type;
        if (this.bidForm.type === window.meebidConstant.applyType.Telephone){
          var addressObj1 = meebidUtils.convertPhoneStrToObj(apply.telephone1 || "", this.regionOptions);
          this.telBidForm.telephone1 = addressObj1.phone;
          this.telBidForm.region1 = addressObj1.region;
          var addressObj2 = meebidUtils.convertPhoneStrToObj(apply.telephone2 || "", this.regionOptions);
          this.telBidForm.telephone2 = addressObj2.phone;
          this.telBidForm.region2 = addressObj2.region;
          var addressObj3 = meebidUtils.convertPhoneStrToObj(apply.telephone3 || "", this.regionOptions);
          this.telBidForm.telephone3 = addressObj3.phone;
          this.telBidForm.region3 = addressObj3.region;
          this.isTelBidFormVisible = true;
          this.isAbsentBidFormVisible = false;
          this.isTelBidRegistered = false;
          this.isAbsentBidRegistered = true;
        } else {
          this.absentBidForm.maxBidPrice = apply.maxBidPrice;
          this.isTelBidFormVisible = false;
          this.isAbsentBidFormVisible = true;
          this.isTelBidRegistered = true;
          this.isAbsentBidRegistered = false;
        }
        this.step = 1;
        this.showBackButton = true;
        this.saveButtonText = "Update";
      },
      onDeleteApply(apply){
        var me = this;
        var applyObj = {
          lotId: apply.lotId,
          type: apply.type
        }
        this.$confirm(i18n.t('meebid.alertMessage.MSG_LOT_DETAIL_DELETE_APPLY_CONFIRM_TEXT'), 'Cancel Registration', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          $.ajax({
            type: "POST",
            url: "/api/bid/apply/del",
            contentType : "application/json", 
            context: me,
            headers: {
              token: me.loginUser.token
            },
            data: JSON.stringify(applyObj),
            success(data) {
              if (data.code === 1){
                this.$message({
                  type: 'success',
                  message: i18n.t('meebid.alertMessage.MSG_LOT_DETAIL_CANCEL_SUCCESS')
                })
                var idx = meebidUtils.findIndex(this.lotItem.applys, "type", applyObj.type);
                this.lotItem.applys.splice(idx, 1);
                this.showRegisterLink = true;
              } else {
                this.$notify.error({
                  title: 'Failure',
                  message: 'Cancel Registration failure',
                  duration: 5000
                })
              }
              
            },
            error(data) {
              errorUtils.requestError(data);
            }
          })
        })
      },
      onRegisterNew() {
        if (this.lotItem.applys[0].type === 1){
          this.isTelBidRegistered = true;
          this.isAbsentBidRegistered = false;
          this.isTelBidFormVisible = false;
          this.isAbsentBidFormVisible = true;
          this.bidForm.type = window.meebidConstant.applyType.Absent;
        } else {
          this.isTelBidRegistered = false;
          this.isAbsentBidRegistered = true;
          this.isTelBidFormVisible = true;
          this.isAbsentBidFormVisible = false;
          this.bidForm.type = window.meebidConstant.applyType.Telephone;
          this.telBidForm = {
            //default region US
            region1: 36,
            region2: 36,
            region3: 36
          }
        }
        this.step = 1;
        this.showBackButton = true;
        this.saveButtonText = "Register";
      },
      onCancel() {
        var me = this;
        this.registerDialogVisible = false;
      },
      onBack() {
        this.step = 0;
        this.showBackButton = false;
      },
      buildRequest(){
        var requestObj = {
          lotId: this.lotItem.id,
          type: this.bidForm.type
        }
        if (this.bidForm.type === window.meebidConstant.applyType.Telephone){
          requestObj.telephone1 = meebidUtils.convertPhoneObjToStr(this.telBidForm.region1, this.telBidForm.telephone1, this.regionOptions);
          requestObj.telephone2 = meebidUtils.convertPhoneObjToStr(this.telBidForm.region2, this.telBidForm.telephone2, this.regionOptions);
          requestObj.telephone3 = meebidUtils.convertPhoneObjToStr(this.telBidForm.region3, this.telBidForm.telephone3, this.regionOptions);
        } else if (this.bidForm.type === window.meebidConstant.applyType.Absent){
          requestObj.maxBidPrice = this.absentBidForm.maxBidPrice;
        }
        return requestObj;
      },
      onSave() {
        var me = this;
        var needValidForm = this.bidForm.type === window.meebidConstant.applyType.Telephone ? this.$refs.telBidForm : this.$refs.absentBidForm;
        var applyObj = this.buildRequest();
        needValidForm.validate(function(isValid){
          if (isValid){
            $.ajax({
              type: "POST",
              url: "/api/bid/applys",
              contentType : "application/json", 
              context: me,
              headers: {
                token: me.loginUser.token
              },
              data: JSON.stringify(applyObj),
              success(data) {
                if (data.code === 1){
                  this.$message({
                    type: 'success',
                    message: i18n.t('meebid.alertMessage.MSG_LOT_DETAIL_REGISTER_SUCCESS')
                  })
                  this.registerDialogVisible = false;
                  this.updateApply(applyObj);
                } else {
                  this.$notify.error({
                    title: 'Failure',
                    message: 'Register Lot failure',
                    duration: 5000
                  })
                }
                
              },
              error(data) {
                errorUtils.requestError(data);
              }
            })
          }
        });
      },
      updateApply(apply){
        var isApplyExisting = false;
        for (var i = 0; i < this.lotItem.applys.length; i++){
          if (this.lotItem.applys[i].type === apply.type){
            isApplyExisting = true;
            this.lotItem.applys[i].maxBidPrice = apply.maxBidPrice;
            this.lotItem.applys[i].telephone1 = apply.telephone1;
            this.lotItem.applys[i].telephone2 = apply.telephone2;
            this.lotItem.applys[i].telephone3 = apply.telephone3;
            return;
          }
        }
        apply.state = window.meebidConstant.applyState['Pending'];
        this.lotItem.applys.push(apply);
      },
      getRegisterType(apply){
        return apply.type === 1 ? "Telephone Bid" : "Absent Bid";
      },
      getPrice(price){
        return meebidUtils.formatMoney(this.lotItem.currencyCode, price || 0);
      },
      getPhone(phone){
        var phoneObj = meebidUtils.convertPhoneStrToObj(phone || "", this.regionOptions);
        return phone;
      },
      getStateColor(state){
        return state >= 0 ? window.meebidConstant.applyStateColor[state] : "";
      },
      getStateLabel(state){
        return state >=0 ? window.meebidConstant.applyState[state] : "";
      }
    }
  }
</script>
