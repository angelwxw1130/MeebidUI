<template>
  <div style="width: 600px;height: 500px; overflow: hidden; border-radius: 3px; box-shadow: 3px 3px 3px #888888;"> 
    <div class="sidebar" style=" float: left;height: 100%;
      width: 160px;
      color: #f4f4f4;
      background-color: #FF5242;">
      <!--<meebidcard :headPortrait="headPortrait" :firstName="firstName"></meebidcard>-->
      <meebidroomlist :chatUsers="chatUsers" @getChatRoom='getChatRoom'></meebidroomlist>
    </div>
    <div class="main" style="position: relative;height: 100%;overflow: hidden;background-color: #eee;">
        <div style="height:50px;border-bottom:1px solid #d4dde4;">
          <p style="font-size:20px;padding:10px 0px 0px 40px;">{{chatUser.firstName}}</p>
          <a href="javascript:void(0)" @click='hideWindow'>
            <span class="fa fa-arrow-circle-o-right" style="display:inline-block;font-size:25px;color:#FF5242; position: absolute;  left: 390px;  top: 15px;cursor:pointer;" ></span>
          </a>
        </div>
        <meebidmessage style="height:310px" :messages="messages" :headPortrait="headPortrait" :chatUser="chatUser" @showImage="showImage" ></meebidmessage>
        <meebidtext ref="textarea"  @sendMessage='sendMessage' @sendMessageCtx='sendMessageCtx'></meebidtext>
    </div>
  </div>
</template>

<script>
import ajax from './ajax';
import loginUtils from './../../utils/loginUtils'
import errorUtils from './../../utils/errorUtils'
import meebidUtils from './../../utils/meebidUtils'
import base64Utils from './../../utils/base64Utils'
import meebidConstant from './../../constant/meebidConstants';
import i18n from './../../i18n/i18n'
import $ from 'jquery'
export default {
  name:'meebidim',
  props: {
    profileData: Object,
    ws: WebSocket,
    userId:{
      type:Number,
      default:-1
    },
    lotId:"",
    chatUserId:{
      type:Number,
      default:-1
    },
    
    headPortrait: {
      type: String,
      default: ""
    },
    firstName: {
      type: String,
      default: ""
    },
    headers: Object,
    withCredentials: Boolean,
    multiple: {
      type:Boolean,
      default :false
    },
    socketRoomId: {
      type: String,
      default: ""
    },
    roomId: {
      type: String,
      default: ""
    },
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
  data () {
    return {
      loginUser: loginUtils.getLoginUser(),
      userProfile: {
      },
      //firstName: "User",
      windowMinHeight: 0,       
      //ws:null,
      wsUrl:"",
      socketId:"",
      chatUsers:[],
      messages:[],
      chatUser:{},
      newChatUser:false,
      lastChatTime:"",
      showChatTime:true,
      reqs: {},
      finishReqs: {}
    }
  },
  beforeMount() {    
    this.windowMinHeight = window.innerHeight - 85 + "px";
    
  },
  mounted(){

    
  },

  methods: {
    sendMessageCtx(message) {
      //尝试向服务端发送控制消息
      
      this.ws.send(message);
      
    },
    sendMessage(message) {
      //尝试向服务端发送消息
      //console.log(message);
      var date = new Date();
      if(this.lastChatTime == ""){
        this.showChatTime=true;
      }else{
        var num = (date.getTime()-new Date(this.lastChatTime).getTime())/(1000*60);
        if(num <= 5){
          this.showChatTime=false;
        }else{
          this.showChatTime=true;
        }
      }
      this.lastChatTime = date;

      this.ws.send(JSON.stringify({
        id:date.getTime(),
        content: message,
        sender : this.userId,   
        roomId:this.userId+","+this.chatUserId,     
        type:0,
        lotId:this.lotId
      }));
      this.messages.push({
         date:date ,
         sender:this.userId,
         content : message,
         self : true,
         ifshowtime :this.showChatTime,
         contentType : "text",
         fileName:"",
      });
    },
    sendFileMessage(message,type) {
      //尝试向服务端发送消息
      //console.log(message);
      var fileType = 0;
      if(type == 'FILE')
      {
        fileType = 2;
      }
      if(type == 'IMAGE')
      {
        fileType = 1;
      }
      var date = new Date();
      if(this.lastChatTime == ""){
        this.showChatTime=true;
      }else{
        var num = (date.getTime()-new Date(this.lastChatTime).getTime())/(1000*60);
        if(num <= 5){
          this.showChatTime=false;
        }else{
          this.showChatTime=true;
        }
      }
      this.lastChatTime = date;

      this.ws.send(JSON.stringify({
        id:date.getTime(),
        content: message,
        sender : this.userId,
        roomId:this.userId+","+this.chatUserId,
        type:fileType,
        lotId:this.lotId,
      }));
      
    },
    connection(){
      console.log("test connection");
      if ("WebSocket" in window) {
        this.ws = new WebSocket(this.wsUrl);
      }
      else if ("MozWebSocket" in window) {
        this.ws = new MozWebSocket(this.wsUrl);
      } else {
        console.log("当前浏览器不支持WebSocket");

      }

        //注册各类回调
        this.ws.onopen = this.websocketonopen;
        this.ws.onerror = this.websocketonerror;
        this.ws.onmessage = this.websocketonmessage; 
        this.ws.onclose = this.websocketclose;
            
            
            
    },
    websocketonopen() {
　　　　console.log("WebSocket连接成功");       
　　},
　　websocketonerror(e) { //错误
 　　　console.log("WebSocket连接发生错误");
　　},
　　websocketonmessage(e){       
      //数据接收 
      
      const redata = JSON.parse(e.data);
      let fileNameObject = null;
      // type=3 控制信息返回
      if(redata.type == 3)
      {
        const content = JSON.parse(redata.content);
        
        if(this.$refs.textarea.Files){
          let fileNameObjects = this.$refs.textarea.Files;
          fileNameObjects.forEach(item => {
            if(item.id == redata.id){
              fileNameObject = item;
              if(fileNameObject.File){
                //console.log(fileNameObject.File.name);
              }
              
                //console.log("file:"+fileNameObject.File.name);
            }
          });
        }else{
            return;
        }
        //上传文件
        this.upload(fileNameObject.File, redata);

      }
      else {
        if(this.lastChatTime == ""){
          this.showChatTime=true;
        }else{
          var num = (new Date(redata.sendAt).getTime()-new Date(this.lastChatTime).getTime())/(1000*60);
          if(num <= 5){
            this.showChatTime=false;
          }else{
            this.showChatTime=true;
          }
        }
        this.lastChatTime = redata.sendAt;

        let contentType = '';
        let content = '';
        let self = false;
        let jsoncontent
        let fileName;
        if(redata.type === 0){
          contentType = "text";
          content = redata.content;
          fileName = '';
        }else {
          const jsoncontent = JSON.parse(redata.content);
        
          if(this.$refs.textarea.Files){
            let fileNameObjects = this.$refs.textarea.Files;
            // console.log("length:"+fileNameObjects.length);
            fileNameObjects.forEach(item => {
              if(item.id == jsoncontent.id){
                fileNameObject = item;
                //console.log("file:"+fileNameObject.FileName);
              }
            });
          }else{
              return;
          }
          if(redata.type === 1){
            contentType = "image";
            content = jsoncontent.rUid;
            fileName = fileNameObject.FileName;
          }else if(redata.type === 2){
            contentType = "file";
            content = jsoncontent.rUid;
            fileName = fileNameObject.FileName;
          }
          
        }
        if(this.userId == redata.sender){
          self = true;
        }
                
        this.messages.push({
          date:redata.sendAt ,
          sender:redata.sender,
          content : content,
          self : self,
          ifshowtime :this.showChatTime,
          contentType:contentType,
          fileName:fileName,
        });
      }
　　}, 
    
    //上传文件
    upload(rawFile, redata) {
       const content = JSON.parse(redata.content);
          if (!this.beforeUpload) {
              return this.post(rawFile, redata);
          }
          const before = this.beforeUpload(rawFile);
          if (before && before.then) {
              before.then(processedFile => {
              const fileType = Object.prototype.toString.call(processedFile);
              if (fileType === '[object File]' || fileType === '[object Blob]') {
                  this.post(processedFile, redata);
              } else {
                  this.post(rawFile, redata);
              }
              }, () => {
              this.onRemove(null, rawFile);
              });
          } else if (before !== false) {
              this.post(rawFile, redata);
          } else {
              this.onRemove(null, rawFile);
          }
    },
    // abort(file) {
    //     const { reqs } = this;
    //     if (file) {
    //         let uid = file;
    //         if (file.uid) uid = file.uid;
    //         if (reqs[uid]) {
    //         reqs[uid].abort();
    //         }
    //     } else {
    //         Object.keys(reqs).forEach((uid) => {
    //         if (reqs[uid]) reqs[uid].abort();
    //         delete reqs[uid];
    //         });
    //     }
    // },
    post(rawFile, redata) {
        this.doPost(rawFile, redata);      
    },
    doPost(rawFile, redata){
      const content = JSON.parse(redata.content);
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
            // onProgress: e => {
            // this.onProgress(e, rawFile);
            // },
            onSuccess: res => {
              
              me.finishReqs[uid] = rawFile;
              delete me.reqs[uid];              
              if (Object.keys(me.reqs).length === 0){
                  me.confirmPost(res, redata);
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
    confirmPost(res, redata) {
      const content = JSON.parse(redata.content);
        var fileKeys = [];
        if (this.multiple){
            for (var key in this.finishReqs){
            fileKeys.push(content.fileKey + this.finishReqs[key].name);
            }
        } else {
            fileKeys.push(content.fileKey);
        }
        let fileNameObject = null;        
        if(this.$refs.textarea.Files){
          let fileNameObjects = this.$refs.textarea.Files;
          fileNameObjects.forEach(item => {
            if(item.id == redata.id){
              fileNameObject = item;
              
            }
          });
        }else{
          return;
        }
        
        var MessageCtx = {id:fileNameObject.id,suffix:fileNameObject.Extend,name:fileNameObject.FileName,rUid:content.rUid};        
        
        
        this.sendFileMessage(JSON.stringify(MessageCtx),fileNameObject.type);//File 2
        
    },


    websocketclose(e){ //关闭       
　　　console.log("connection closed (" + e.code + ")"); 
　　},
    websocketunread(){
      $.ajax({
        type: "GET",
        url: "/api/socket/chat/unread/count",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        //data: JSON.stringify({
          
        //}),
        success(data) {
          if (data.code === 1){
            //console.log(data.content.count);
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      });
    },
    websocketread(){
      $.ajax({
        type: "POST",
        url: "/api/socket/chat/read",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        //data: JSON.stringify({
          
        //}),
        success(data) {
          if (data.code === 1){
            //console.log(data.msg);
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      });
    },
    
    websockethistory(){
      $.ajax({
        type: "Get",
        url: "/api/socket/chat/history",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: {
          roomId:this.roomId,
          offset:0,
          count:20,
          lotId:this.lotId
        },
        success(data) {
          if (data.code === 1){
            if(this.newChatUser){
              this.messages = [];
              this.lastChatTime = "";
              this.showChatTime=true;
            }
            
            if(data.content.msgs.length > 0){
              for(var i = data.content.msgs.length - 1;i>=0; i--){
                //如果上一个message时间为空 则记录时间
                if(this.lastChatTime == ""){
                  this.showChatTime=true;
                }else{
                  var num = (new Date(data.content.msgs[i].sendAt).getTime()-new Date(this.lastChatTime).getTime())/(1000*60);
                  if(num <= 5){
                    //console.log(num);
                    this.showChatTime=false;
                  }else{
                    //console.log(num);
                    this.showChatTime=true;
                  }
                }
                this.lastChatTime = data.content.msgs[i].sendAt;
                //console.log(this.lastChatTime);  
                var self = false;
                if(data.content.msgs[i].sender == this.userId){
                  self = true;
                }
                let contentType;
                let content;
                let fileName;
                if(data.content.msgs[i].type === 0){
                  contentType = "text";
                  content = data.content.msgs[i].content;
                  fileName = '';
                }else if(data.content.msgs[i].type === 1){
                  contentType = "image";
                  let contentArray = JSON.parse(data.content.msgs[i].content);
                  content = contentArray.rUid;
                  fileName = contentArray.name;
                }else if(data.content.msgs[i].type === 2){
                  contentType = "file";
                  let contentArray = JSON.parse(data.content.msgs[i].content);
                  content = contentArray.rUid;
                  fileName = contentArray.name;
                }
                
                var message = {
                  date:data.content.msgs[i].sendAt ,
                  sender:data.content.msgs[i].sender,
                  content : content,
                  self : self,
                  ifshowtime :this.showChatTime,
                  contentType:contentType,
                  fileName : fileName,
                }
                this.messages.push(message);
              }
            }
            this.newChatUser = false;
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      });
    },
    buildGetLastChatsReq(){
      var request = {   
          type : 'GET', 
          context: this, 
          url : "/api/socket/chats",
          dataType : 'json' ,
          data : {
              nearN: 10
          },
          headers: {
              token: this.loginUser.token
          },
          success : function(data) {
              if (data.code == '1'){
                var items = this.buildChatItems(data.content.rooms ? data.content.rooms : []);
                  
              } else {  
              this.$notify({
                  title: 'Failure',
                  message: 'Fetch Online Items failed',
                  duration: 5000
                  })
              }
              //me.inLoadingAuctionItems = false; 
          },  
          error : function(data) {  
              errorUtils.requestError(data);
              //me.inLoadingAuctionItems = false;
          },  
      
      };
      
      return request;
    },
    buildChatItems(items){
      var chatItems = [];
      var hasChated = false;       
      // console.log("chatUserId:"+this.chatUserId);
      if(items.length > 0){
        for (var i = 0; i < items.length; i++){
            var item = items[i];
            var roomId = item.roomId;
            for(var j = 0; j < item.group.length; j++){
              var firstName = "";
              var headPortrait = "";   
              var userId = "";           
              if(item.group[j].id == this.userId){
                continue;
              }
              
              userId = item.group[j].id;
              if (item.group[j].type === window.meebidConstant.userType.member){
                if (item.group[j].firstName){
                    firstName = item.group[j].firstName;
                }
                
                if (item.group[j].avatar != null){
                    headPortrait = item.group[j].avatar;                    
                }
                else{
                  headPortrait = "/src/assets/user9.png"
                }

               
              }else if (item.group[j].type === window.meebidConstant.userType.house){
                if (item.group[j].firstName){
                    firstName = item.group[j].firstName;
                }
                
                if (item.group[j].avatar != null){
                    headPortrait = item.group[j].avatar;
                    
                }else{
                  headPortrait = "/src/assets/user9.png"
                } 
                
              }
                
                var chatItem = {
                  roomId : roomId,
                  firstName: firstName,
                  headPortrait : headPortrait,
                  userId : userId,                
                  sendMessageRoomId:this.userId+","+this.chatUserId
                  }
                if(this.chatUserId == item.group[j].id){
                  chatItems.unshift(chatItem);
                  hasChated = true;
                }else if(this.chatUserId != item.group[j].id){
                  chatItems.push(chatItem);
                }
                
              }
            }
      }
      
      if(hasChated == false){   
        // TODO:roomId有问题     
        // 无最近聊天室记录 创建本chatuserid为对象的聊天室
        // 调用接口，获取chatUserId 对应用户信息
        $.ajax({
          type: "Get",
          url: "/api/user/profile",
          contentType : "application/json", 
          context: this,
          headers: {
            token: this.loginUser.token
          },
          data: {
            userId:this.chatUserId
          },
          success(data) {
            var chatItem = {};
            if (data.code == '1'){
              if (data.content.user.type === window.meebidConstant.userType.member){                
                chatItem = {
                      roomId : this.roomId,
                      firstName: data.content.user.firstName,
                      headPortrait : data.content.user.avatar,
                      userId : data.content.user.id,                
                      sendMessageRoomId:this.userId+","+this.chatUserId
                  }
              }else if(data.content.user.type === window.meebidConstant.userType.house){
                  chatItem = {
                      roomId : this.roomId,
                      firstName: data.content.user.name,
                      headPortrait : data.content.user.bLogoUrl,
                      userId : data.content.user.id,                
                      sendMessageRoomId:this.userId+","+this.chatUserId
                  }
              }
              
              chatItems.unshift(chatItem);
            }
          },
          error(data) {
            errorUtils.requestError(data);
          }
        });
      }
          
      this.chatUsers = chatItems;
      //默认激活第一个对象聊天
      this.chatUser = this.chatUsers[0];
      this.roomId = this.chatUsers[0].roomId;

      //获取未读信息数
      this.websocketunread();
       
       //获取近期的聊天室信息
       //this.websocketchats();
       //获取近期某个聊天室下的聊天记录
       this.websockethistory();
      // console.log("chats-roomid:"+this.roomId);
    },
    getChatRoom(wsConnection){
      for(var i =0;i<this.chatUsers.length;i++){
        if(this.chatUsers[i].userId == wsConnection.chatUserId){
          this.chatUser = this.chatUsers[i];
        }
      }
      this.$refs.textarea.getFocus();
      this.roomId = wsConnection.chatRoomId;
      this.newChatUser = true;
      this.websockethistory();
      this.websocketread();
    },
    getChatRooms(){
      var request = this.buildGetLastChatsReq();
      $.ajax(request);

      //注册各类回调
      // if(this.ws != null){
      //   this.ws.onopen = this.websocketonopen;
      //   this.ws.onerror = this.websocketonerror;
      //   this.ws.onmessage = this.websocketonmessage; 
      //   this.ws.onclose = this.websocketclose;
      // }
    },
    hideWindow(){
      this.$emit('hidewindow',false); 
    },
    showImage(url){
      this.$emit('showImage',url); 
    }
  }
}
</script>

<style>
#app {
  font-family: "Gotham SSm A", "Gotham SSm B",  arial, sans-serif
}
</style>
