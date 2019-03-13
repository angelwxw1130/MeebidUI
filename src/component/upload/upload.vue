<script>
import ajax from './ajax';
import UploadDragger from './upload-dragger.vue';
import loginUtils from './../../utils/loginUtils';
import meebidConstant from './../../constant/meebidConstants';
import $ from 'jquery';
import i18n from './../../i18n/i18n'

export default {
  inject: ['uploader'],
  components: {
    UploadDragger
  },
  props: {
    type: String,
    action: {
      type: String
      //required: true
    },
    name: {
      type: String,
      default: 'file'
    },
    fieldName: String,
    allowSameFileName: {
      type: Boolean,
      default: true
    },
    data: Object,
    uploadKey: String,
    headers: Object,
    withCredentials: Boolean,
    multiple: Boolean,
    accept: String,
    onStart: Function,
    onProgress: Function,
    onSuccess: Function,
    onError: Function,
    beforeUpload: Function,
    drag: Boolean,
    onPreview: {
      type: Function,
      default: function() {}
    },
    onRemove: {
      type: Function,
      default: function() {}
    },
    fileList: Array,
    overlimit: Boolean,
    autoUpload: Boolean,
    listType: String,
    httpRequest: {
      type: Function,
      default: ajax
    },
    disabled: Boolean,
    limit: Number,
    onExceed: Function
  },

  data() {
    return {
      loginUser: loginUtils.getLoginUser(),
      mouseover: false,
      reqs: {},
      finishReqs: {}
    };
  },

  methods: {
    isImage(str) {
      return str.indexOf('image') !== -1;
    },
    handleChange(ev) {
      var me = this;
      const files = ev.target.files;

      if (!files) return;

      if (!this.allowSameFileName){
        var pendingRemovedFiles = [];
        var fileNameArr = [];
        for (var i = 0; i < this.fileList.length; i++){
          for (var j = 0; j < files.length; j++){
            if (files[j].name === this.fileList[i].name){
              pendingRemovedFiles.push(this.fileList[i]);
              fileNameArr.push(this.fileList[i].name);
            }
          }
        }

        if (pendingRemovedFiles.length > 0) {
          this.$confirm(i18n.t('meebid.alertMessage.MSG_ADMIN_BATCH_UPLOAD_NAME_CONFLICT_TEXT', {
            0: fileNameArr.join(",")
          }), 'WARNING', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            for (var i = 0; i < pendingRemovedFiles.length; i++){
              me.onRemove(pendingRemovedFiles[i]);
            }
            me.uploadFiles(files);
          });
        } else {
          this.uploadFiles(files);
        }
      } else {
        this.uploadFiles(files);
      }
    },
    uploadFiles(files) {
      var me = this;
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList);
        return;
      }

      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) { postFiles = postFiles.slice(0, 1); }

      if (postFiles.length === 0) { return; }
      var requestObj = {
        type: this.fieldName === "batchTemplate" ? window.meebidConstant.uploadType.LotExcel : this.multiple ? window.meebidConstant.uploadType.LotImages : window.meebidConstant.uploadType.Image
      };
      if (this.uploadKey) {
        requestObj.key = this.uploadKey;
      }
      $.ajax({
        type: "POST",
        url: "/api/public/resource/create",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify(requestObj),
        success(data) {
          if (data.code === 1){
            postFiles.forEach(rawFile => {
              me.onStart(rawFile);
              if (this.autoUpload) me.upload(rawFile, data.content);
            });
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Upload initialization failure',
              duration: 5000
            })
          }
          
        },
        error() {
          this.$notify.error({
            title: 'Failure',
            message: 'Upload initialization failure',
            duration: 5000
          })
        }
      });
      
    },
    upload(rawFile, content) {
      this.$refs.input.value = null;

      if (!this.beforeUpload) {
        return this.post(rawFile, content);
      }

      const before = this.beforeUpload(rawFile);
      if (before && before.then) {
        before.then(processedFile => {
          const fileType = Object.prototype.toString.call(processedFile);
          if (fileType === '[object File]' || fileType === '[object Blob]') {
            this.post(processedFile, content);
          } else {
            this.post(rawFile, content);
          }
        }, () => {
          this.onRemove(null, rawFile);
        });
      } else if (before !== false) {
        this.post(rawFile, content);
      } else {
        this.onRemove(null, rawFile);
      }
    },
    abort(file) {
      const { reqs } = this;
      if (file) {
        let uid = file;
        if (file.uid) uid = file.uid;
        if (reqs[uid]) {
          reqs[uid].abort();
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort();
          delete reqs[uid];
        });
      }
    },
    post(rawFile, content) {
      this.doPost(rawFile, content);
      /** $.ajax({
        type: "POST",
        url: "/api/public/resource/create",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify({
          type: window.meebidConstant.uploadType.Image
        }),
        success(data) {
          if (data.code === 1){
            this.doPost(rawFile, data.content);
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Upload initialization failure',
              duration: 5000
            })
          }
          
        },
        error() {
          this.$notify.error({
            title: 'Failure',
            message: 'Upload initialization failure',
            duration: 5000
          })
        }
      });*/
    },
    doPost(rawFile, content){
      var me = this;
      const { uid } = rawFile;
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        //contentData: content,
        data: {
          OSSAccessKeyId: content.accessid,
          policy: content.policy,
          Signature: content.signature,
          key: this.multiple ? content.fileKey + rawFile.name : content.fileKey,
          success_action_status: 200
        },
        filename: "file",
        action: content.ossUrl,
        onProgress: e => {
          this.onProgress(e, rawFile);
        },
        onSuccess: res => {
          me.finishReqs[uid] = rawFile;
          delete me.reqs[uid];
          if (Object.keys(me.reqs).length === 0){
            me.confirmPost(res, content);
          }
        },
        onError: err => {
          this.onError(err, rawFile);
          delete me.reqs[uid];
        }
      };
      const req = this.httpRequest(options);
      this.reqs[uid] = req;
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    },
    confirmPost(res, content) {
      var fileKeys = [];
      if (this.multiple){
        for (var key in this.finishReqs){
          fileKeys.push(content.fileKey + this.finishReqs[key].name);
        }
      } else {
        fileKeys.push(content.fileKey);
      }
      
      $.ajax({
        type: "POST",
        url: "/api/public/resource/confirm",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: JSON.stringify({
          rUid: content.rUid,
          fileKeys: fileKeys,
          type: this.fieldName === "batchTemplate" ? window.meebidConstant.uploadType.LotExcel : this.multiple ? window.meebidConstant.uploadType.LotImages : window.meebidConstant.uploadType.Image
        }),
        success(data) {
          if (data.code === 1){
            this.onSuccess(data.content, this.multiple ? this.finishReqs : this.finishReqs[Object.keys(this.finishReqs)[0]]);
            this.finishReqs = {};
          } else {
            this.$notify.error({
              title: 'Failure',
              message: 'Upload confirmation failure',
              duration: 5000
            });
            this.finishReqs = {};
          }
          
        },
        error() {
          this.$notify.error({
            title: 'Failure',
            message: 'Upload confirmation failure',
            duration: 5000
          });
          this.finishReqs = {};
        }
      })
    },
    handleClick() {
      if (!this.disabled) {
        this.$refs.input.value = null;
        this.$refs.input.click();
      }
    },
    handleKeydown(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleClick();
      }
    }
  },

  render(h) {
    let {
      handleClick,
      drag,
      name,
      handleChange,
      multiple,
      accept,
      listType,
      uploadFiles,
      overlimit,
      disabled,
      handleKeydown
    } = this;
    const data = {
      class: {
        'el-upload': true,
        'meebid-upload-overlimit': overlimit
      },
      on: {
        click: handleClick,
        keydown: handleKeydown
      }
    };
    data.class[`el-upload--${listType}`] = true;
    if (disabled){
      data.class['is-disabled'] = true;
    }
    
    return (
      <div {...data} tabindex="0" >
        {
          drag
          ? <upload-dragger disabled={disabled} on-file={uploadFiles}>{this.$slots.default}</upload-dragger>
          : this.$slots.default
        }
        <input class="el-upload__input" type="file" ref="input" name={name} on-change={handleChange} multiple={multiple} accept={accept}></input>
      </div>
    );
  }
};
</script>
