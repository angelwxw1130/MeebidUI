<template>
  <el-dialog title="Register to Bid" class="meebidRegisterDialog" :visible.sync="registerDialogVisible" width="800px" :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="registerDialogWrapper">
      <div v-if="step == 0">
        <div>
          <span>Your registration:</span>
        </div>
        <div class="meebidLink meebidRegisterDialogAddNewLink" @click="onRegisterNew"><span class="glyphicon glyphicon-registration-mark"></span> Register another bid</div>
        <div v-for="apply in lotItem.applys">
          <span style="display: inline-block; width: 200px;">{{getRegisterType(apply)}}</span>
          <span style="display: inline-block;" v-if="apply.type === 1">Maximum Bid Price: {{getPrice(apply.maxBidPrice)}}</span>
          <span style="display: inline-block;" v-if="apply.type === 2">
            <span>{{getPhone(apply.telephone1)}}</span>
            <span v-if="apply.telephone2">{{getPhone(apply.telephone2)}}</span>
            <span v-if="apply.telephone3">{{getPhone(apply.telephone3)}}</span>
          </span>
        </div>
      </div>
      <div v-if="step == 1">
        <el-form ref="bidForm" label-width="180px" :model="bidForm" class="meebidPaddingRightMedium">
          <el-form-item label="Register Type" class="meebidFormNoMarginBottom">
            <el-radio-group v-model="bidForm.type" @change="onRegisterTypeChange">
              <el-radio :label="1" v-if="!isTelBidRegistered">Telephone Bid</el-radio>
              <el-radio :label="2" v-if="!isAbsentBidRegistered">Absent Bid</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Lot No." prop="lotNo" class="meebidFormNoMarginBottom">
            <span>{{lotItem.no}}</span>
          </el-form-item>
        </el-form>
        <el-form ref="telBidForm" label-width="180px" v-if="isTelBidFormVisible" :model="telBidForm" :rules="telBidFormRules" class="meebidPaddingRightMedium meebidPaddingBottomMedium">
          <el-form-item label="Maxium Bid Price"  prop="maxBidPrice">
            <meebid-number-input v-model="telBidForm.maxBidPrice" placeholder="Please input maxium bid price"></meebid-number-input>
          </el-form-item>
        </el-form>
        <el-form ref="absentBidForm" label-width="180px" v-if="isAbsentBidFormVisible" :model="absentBidForm" :rules="absentBidFormRules" class="meebidPaddingRightMedium meebidPaddingBottomMedium">
          <el-form-item prop="telephone1" label="Phone Number 1" v-if="bidForm.type === 2">
            <el-input v-model="absentBidForm.telephone1" placeholder="Please input phone number">
              <el-select v-model="absentBidForm.region1" style="width:110px;" slot="prepend" placeholder="Select...">
                <el-option
                  v-for="item in regionOptions"
                  :key="item.id"
                  :label="item.telCode"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item prop="telephone2" label="Phone Number 2" v-if="bidForm.type === 2">
            <el-input v-model="absentBidForm.telephone2" placeholder="Please input phone number">
              <el-select v-model="absentBidForm.region2" style="width:110px;" slot="prepend" placeholder="Select...">
                <el-option
                  v-for="item in regionOptions"
                  :key="item.id"
                  :label="item.telCode"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item prop="telephone3" label="Phone Number 3" v-if="bidForm.type === 2">
            <el-input v-model="absentBidForm.telephone3" placeholder="Please input phone number">
              <el-select v-model="absentBidForm.region3" style="width:110px;" slot="prepend" placeholder="Select...">
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
      <el-button v-if="lotItem.applys > 0" @click="onBack">Back</el-button>
      <el-button type="primary" v-if="step == 1" @click="onSave" :disabled="noItemSelected">Register</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import meebidUtils from './../../utils/meebidUtils'
  import errorUtils from './../../utils/errorUtils'
  import $ from 'jquery'
  import loginUtils from './../../utils/loginUtils'
  export default {
    name: 'meebid-register-dialog',
    props: {

    },
    data () {
      return {
        step: 1,
        registerDialogVisible: false,
        isTelBidRegistered: false,
        isAbsentBidRegistered: false,
        loginUser: loginUtils.getLoginUser(),
        isTelBidFormVisible: true,
        isAbsentBidFormVisible: false,
        bidForm: {
          type: 1
        },
        telBidForm: {},
        absentBidForm: {},
        telBidFormRules: {
          maxBidPrice: [
            { required: true, message: 'Please input Maxium Bid Price', trigger: 'change' }          
          ]
        },
        absentBidFormRules: {
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
        if (type === 1){
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
          var telBidObj = meebidUtils.findObject(this.lotItem.applys, 'type', 1);
          var absentBidObj = meebidUtils.findObject(this.lotItem.applys, 'type', 2);
          this.isTelBidRegistered = telBidObj != null;
          this.isAbsentBidRegistered = absentBidObj != null;
        } else {
          this.bidForm = {
            type: 1
          };
          this.absentBidForm = {
            //default region US
            region1: 36,
            region2: 36,
            region3: 36
          }
          this.step = 1;
          this.isTelBidFormVisible = true;
          this.isAbsentBidFormVisible = false;
        }
      },
      onRegisterNew() {

      },
      onCancel() {
        var me = this;
        this.registerDialogVisible = false;
      },
      buildRequest(){
        var requestObj = {
          lotId: this.lotItem.id,
          type: this.bidForm.type
        }
        if (this.bidForm.type === 1){
          requestObj.maxBidPrice = this.telBidForm.maxBidPrice;
        } else if (this.bidForm.type === 2){
          requestObj.telephone1 = meebidUtils.convertPhoneObjToStr(this.absentBidForm.region1, this.absentBidForm.telephone1, this.regionOptions);
          requestObj.telephone2 = meebidUtils.convertPhoneObjToStr(this.absentBidForm.region2, this.absentBidForm.telephone2, this.regionOptions);
          requestObj.telephone3 = meebidUtils.convertPhoneObjToStr(this.absentBidForm.region3, this.absentBidForm.telephone3, this.regionOptions);
        }
      },
      onSave() {
        var me = this;
        var needValidForm = this.bidForm.type === 1 ? this.$refs.telBidForm : this.$refs.absentBidForm;
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
        });
      },
      getRegisterType(apply){
        return apply.type === 1 ? "Telephone Bid" : "Absent Bid";
      },
      getPrice(price){
        return meebidUtils.formatMoney(this.lotItem.currencyCode, price);
      },
      getPhone(phone){
        return meebidUtils.convertPhoneStrToObj(phone, this.regionOptions);
      }
    }
  }
</script>
