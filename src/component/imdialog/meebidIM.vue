<template>
  <div style="width: 600px;height: 500px; overflow: hidden; border-radius: 3px; box-shadow: 3px 3px 3px #888888;"> 
    <div class="sidebar" style=" float: left;height: 100%;
      width: 160px;
      color: #f4f4f4;
      background-color: #FF5242;">
      <!--<meebidcard :headPortrait="headPortrait" :firstName="firstName"></meebidcard>-->
      <meebidroomlist :chatUsers="chatUsers" @getChatUserId='getChatUserId' @getChatRoom='getChatRoom'></meebidroomlist>
    </div>
    <div class="main" style="position: relative;height: 100%;overflow: hidden;background-color: #eee;">
        <div style="height:50px;border-bottom:1px solid #d4dde4;"><p style="font-size:20px;padding:10px 0px 0px 40px;">{{chatUser.firstName}}</p></div>
        <meebidmessage style="height:310px" :messages="messages" :headPortrait="headPortrait" :chatUser="chatUser"></meebidmessage>
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
    ws: Object,
    userId:{
      type:Number,
      default:-1
    },
    panelShow: {
            type: Boolean
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
      roomId:"",
      ws:null,
      wsUrl:"",
      socketId:"",
      chatUsers:[],
      messages:[],
      chatUser:[],
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

    if(this.firstName != 'User'){

      console.log("getchatuser");
      var request = this.buildGetLastChatsReq();
      $.ajax(request);

      //注册各类回调
      if(this.ws != null){
        this.ws.onopen = this.websocketonopen;
        this.ws.onerror = this.websocketonerror;
        this.ws.onmessage = this.websocketonmessage; 
        this.ws.onclose = this.websocketclose;
      }
      
    }
    
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
        roomId:"22,23",     
        type:0,
      }));
      this.messages.push({
         date:date ,
         sender:this.userId,
         content : message,
         self : true,
         ifshowtime :this.showChatTime,
         contentType : "text"
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
        roomId:"22,23",
        type:fileType
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
       //获取未读信息数
       this.websocketunread();
       
       //获取近期的聊天室信息
       //this.websocketchats();
       //获取近期某个聊天室下的聊天记录
       this.websockethistory();
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
                console.log(fileNameObject.File.name);
              }
              
                console.log("file:"+fileNameObject.File.name);
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
        if(redata.type === 0){
          contentType = "text";
          content = redata.content;
        }else if(redata.type === 1){
          contentType = "image";
          content = redata.content.rUid;
        }else if(redata.type === 2){
          contentType = "file";
          content = redata.content.rUid;
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
          contentType:contentType
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
              // console.log(Object.keys(me.finishReqs).length);
              // console.log(Object.keys(me.reqs).length);
              me.finishReqs[uid] = rawFile;
              delete me.reqs[uid];
              // console.log(Object.keys(me.reqs).length);
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
              if(fileNameObject.File){
                console.log(fileNameObject.File.name);
              }
              
                console.log("file:"+fileNameObject.File.name);
            }
          });
        }else{
          return;
        }

        var ctxType = fileNameObject.type;        
        var fileName = File.name;           
        var extend = fileName.substring(fileName.lastIndexOf('.') + 1);
        var MessageCtx = {id:fileNameObject.id,suffix:extend,name:fileName,rUid:content.rUid};        
        
        
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
            console.log(data.content.count);
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
            console.log(data.msg);
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
                if(data.content.msgs[i].type === 0){
                  contentType = "text";
                  content = data.content.msgs[i].content;
                }else if(data.content.msgs[i].type === 1){
                  contentType = "image";
                  let contentArray = JSON.parse(data.content.msgs[i].content);
                  content = contentArray.rUid;
                }else if(data.content.msgs[i].type === 2){
                  contentType = "file";
                  let contentArray = JSON.parse(data.content.msgs[i].content);
                  content = contentArray.rUid;
                }
                var message = {
                  date:data.content.msgs[i].sendAt ,
                  sender:data.content.msgs[i].sender,
                  content : data.content.msgs[i].content,
                  self : self,
                  ifshowtime :this.showChatTime,
                  contentType:contentType,
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
              nearN: 5
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
                
                if (item.group[j].avatar){
                    headPortrait = item.group[j].avatar;
                
                } 
                //临时头像
                if(headPortrait == null || headPortrait == '' && item.group[j].id == 22){
                  headPortrait = "./static/user1.jpg"
                }
                if(headPortrait == null  || headPortrait == ''&& item.group[j].id == 23){
                  headPortrait = "./static/user2.jpg"
                }
                //临时名字
                if(firstName == null || firstName == '' && item.group[j].id == 22){
                  firstName = "hhh   233"
                }
                if(firstName == null  || firstName == ''&& item.group[j].id == 23){
                  firstName = "zzz"
                }
              }else if (item.group[j].type === window.meebidConstant.userType.house){
                if (item.group[j].name){
                    firstName = item.group[j].name;        
                }
                if(item.group[j].bLogoUrl){
                    headPortrait = item.group[j].bLogoUrl;
                }
                //临时头像
                if(headPortrait == null || headPortrait == '' && item.group[j].id == 22){
                  headPortrait = "./static/user1.jpg"
                }
                if(headPortrait == null  || headPortrait == '' && item.group[j].id == 23){
                  headPortrait = "./static/user2.jpg"
                }
                //临时名字
                if(firstName == null || firstName == '' && item.group[j].id == 22){
                  firstName = "hhh   233"
                }
                if(firstName == null  || firstName == ''&& item.group[j].id == 23){
                  firstName = "zzz"
                }
              }
                
                var chatItem = {
                  roomId : roomId,
                  firstName: firstName,
                  headPortrait : headPortrait,
                  userId : userId,                
                  sendMessageRoomId:"22,23"
                  }
                  
                chatItems.push(chatItem);
              }

            
        
              
            }
      }if(items.length == 0){
        console.log("无最近聊天室记录");
          if(this.userId == 22){
            var chatItem = {
                sendMessageRoomId : "22,23",
                firstName: "zzz",
                headPortrait : "./static/user1.jpg",
                userId : 23,
                //roomId: "22,23",
                }
            chatItems.push(chatItem);
          }else{
            var chatItem = {
                sendMessageRoomId : "22,23",
                firstName: "hhh 233",
                headPortrait : "./static/user2.jpg",
                userId : 22,
                //roomId: "22,23",
                }
            chatItems.push(chatItem);
          }
          
                
              
      }
          
      this.chatUsers = chatItems;
      //默认激活第一个对象聊天
      this.chatUser = this.chatUsers[0];
      this.roomId = this.chatUsers[0].roomId;
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

  }
}
</script>

<style>
#app {
  font-family: "Gotham SSm A", "Gotham SSm B",  arial, sans-serif
}
</style>
