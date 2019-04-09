<template>
  <div style="width: 600px;height: 500px; overflow: hidden; border-radius: 3px; box-shadow: 3px 3px 3px #888888;"> 
    <div class="sidebar" style=" float: left;height: 100%;
      width: 160px;
      color: #f4f4f4;
      background-color: #DDDDDD;"><!-- #FF5242-->
      <!--<meebidcard :headPortrait="headPortrait" :firstName="firstName"></meebidcard>-->
      <meebidroomlist :chatUsers="chatUsers" @getChatRoom='getChatRoom'></meebidroomlist>
    </div>
    <div class="main" style="position: relative;height: 100%;overflow: hidden;background-color: #eee;">
        <div style="height:50px;border-bottom:1px solid #d4dde4;">
          <p style="font-size:20px;padding:5px 0px 0px 30px;height:15px;color:#FF5242;weight:10;">{{chatUser.firstName}}</p>
          <p style="font-size:13px;padding:5px 0px 0px 32px;color:#FF5242;">Lottery：{{lot.name}}</p>
          <a href="javascript:void(0)" @click='hideWindow'>
            <span class="fa fa-arrow-circle-o-right" style="display:inline-block;font-size:25px;color:#FF5242; position: absolute;  left: 390px;  top: 15px;cursor:pointer;" ></span>
          </a>
        </div>
        <meebidmessage style="height:310px" :allmessage="allmessage" :messages="messages" :headPortrait="headPortrait" :chatUser="chatUser" @showImage="showImage" @srcollToHistory="srcollToHistory" ></meebidmessage>
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
    lotId:'',
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
    userProfile:Object,
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
      finishReqs: {},
      lot:{},
      allmessage:true,
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
    // connection(){
    //   console.log("test connection");
    //   if ("WebSocket" in window) {
    //     this.ws = new WebSocket(this.wsUrl);
    //   }
    //   else if ("MozWebSocket" in window) {
    //     this.ws = new MozWebSocket(this.wsUrl);
    //   } else {
    //     console.log("当前浏览器不支持WebSocket");

    //   }

    //     //注册各类回调
    //     this.ws.onopen = this.websocketonopen;
    //     this.ws.onerror = this.websocketonerror;
    //     this.ws.onmessage = this.websocketonmessage; 
    //     this.ws.onclose = this.websocketclose;
            
            
            
    // },
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


    getChatRooms(){
      this.websocketunread();
      
      
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
        data: {},
        success(data) {
          if (data.code === 1){
            //console.log(this.userId);
            //console.log(this.chatUserId);
            var hasChated = false; 
            let biggerUserId;
            let smallerUserId;   
            // 获取最近未读信息
            //当前用户为普通用户
            if(this.userProfile.type === window.meebidConstant.userType.member){
              // console.log("memeber");
              //解析content
              //解析content
              if(data.content.count.length > 0){
                for (var i = 0; i < data.content.count.length; i++){
                  let key = data.content.count[i].key;
                  let value = data.content.count[i].value;
                  if(data.content.count[i].value > 99){
                    value = '99+';
                  }
                  let roomId = key.substring(0,key.indexOf(":"));
                  let lotId = key.substring(key.indexOf(":")+1,key.length); 
                    
                  
                  //判断lotId 为当前页面的lotId
                  if(this.lotId == lotId){
                    var roomPlaint = base64Utils.decode(roomId)                    
                    var userIds = roomPlaint.substring(roomPlaint.indexOf("@")+1,roomPlaint.indexOf("[")).split(",");
                    for(var j=0; j<userIds.length;j++){
                      //当前用户，不操作
                      if(userIds[j] == this.userId){
                        continue;
                      }
                      //非当前用户，是指定聊天用户
                      if(userIds[j] == this.chatUserId){
                        if(this.chatUserId > this.userId){
                          smallerUserId = this.userId;
                          biggerUserId = this.chatUserId;
                        }else{
                          smallerUserId = this.chatUserId;
                          biggerUserId = this.userId;
                        }
                        $.ajax(this.buildGetUserProfileReq(this.chatUserId,base64Utils.encode("Message@"+smallerUserId+","+biggerUserId+"[2]"),lotId,value));
                        //chatItems.unshift(chatItem);
                        hasChated = true;
                      }                      
                    }
                  }
                  else{//非当前页面lotId
                    var roomPlaint = base64Utils.decode(roomId)                    
                    var userIds = roomPlaint.substring(roomPlaint.indexOf("@")+1,roomPlaint.indexOf("[")).split(",");
                    for(var j=0; j<userIds.length;j++){
                      //当前用户，不操作
                      if(userIds[j] == this.userId){
                        continue;
                      }
                      if(userIds[j] > this.userId){
                        smallerUserId = this.userId;
                        biggerUserId = userIds[j];
                      }else{
                        smallerUserId = userIds[j];
                        biggerUserId = this.userId;
                      }
                      $.ajax(this.buildGetUserProfileReq(userIds[j],base64Utils.encode("Message@"+smallerUserId+","+biggerUserId+"[2]"),lotId,value));
                                           
                    }
                  }
                  
                }
                
              }
              //未读信息中无指定聊天用户
              if(hasChated == false){
                //获取用户信息
                if(this.chatUserId > this.userId){
                  smallerUserId = this.userId;
                  biggerUserId = this.chatUserId;
                }else{
                  smallerUserId = this.chatUserId;
                  biggerUserId = this.userId;
                }
                $.ajax(this.buildGetUserProfileReq(this.chatUserId,base64Utils.encode("Message@"+smallerUserId+","+biggerUserId+"[2]"),this.lotId,0));
                
              }
              
              
            }
            else if(this.userProfile.type === window.meebidConstant.userType.house){
              //解析content
              if(data.content.count.length > 0){
                for (var i = 0; i < data.content.count.length; i++){
                  let key = data.content.count[i].key;
                  let value = data.content.count[i].value;
                  let roomId = key.substring(0,key.indexOf(":"));
                  let lotId = key.substring(key.indexOf(":")+1,key.length); 
                                 
                  //判断lotId 为当前页面的lotId
                  if(this.lotId == lotId){
                    var roomPlaint = base64Utils.decode(roomId)                    
                    var userIds = roomPlaint.substring(roomPlaint.indexOf("@")+1,roomPlaint.indexOf("[")).split(",");
                    for(var j=0; j<userIds.length;j++){console.log(userIds[j]);
                      //当前用户，不操作
                      if(userIds[j] == this.userId){
                        continue;
                      }
                      //非当前用户，是指定聊天用户
                      if(userIds[j] == this.chatUserId){
                        if(this.chatUserId > this.userId){
                          smallerUserId = this.userId;
                          biggerUserId = this.chatUserId;
                        }else{
                          smallerUserId = this.chatUserId;
                          biggerUserId = this.userId;
                        }
                        $.ajax(this.buildGetUserProfileReq(this.chatUserId,base64Utils.encode("Message@"+smallerUserId+","+biggerUserId+"[2]"),lotId,value));
                        //chatItems.unshift(chatItem);
                        hasChated = true;
                      }
                      //非当前用户，非指定聊天用户
                      if(userIds[j] != this.chatUserId){
                        if(userIds[j]  > this.userId){
                          smallerUserId = this.userId;
                          biggerUserId = userIds[j] ;
                        }else{
                          smallerUserId = this.userId;
                          biggerUserId = userIds[j] ;
                        }
                        $.ajax(this.buildGetUserProfileReq(userIds[j],base64Utils.encode("Message@"+smallerUserId+","+biggerUserId+"[2]"),lotId,value));
                        //chatItems.push(chatItem);
                      }
                    }
                  }
                  
                }
                
              }
              //未读信息中无指定聊天用户
              if(hasChated == false){
                //获取用户信息
                if(this.chatUserId > this.userId){
                  smallerUserId = this.userId;
                  biggerUserId = this.chatUserId;
                }else{
                  smallerUserId = this.chatUserId;
                  biggerUserId = this.userId;
                }
                //console.log("Message@"+smallerUserId+","+biggerUserId+"[2]");
                $.ajax(this.buildGetUserProfileReq(this.chatUserId,base64Utils.encode("Message@"+smallerUserId+","+biggerUserId+"[2]"),this.lotId,0));
                
              }
              
            }
            this.chatUser = this.chatUsers[0];
            this.roomId = this.chatUser.roomId;
            //console.log(this.chatUsers[0].userId+","+this.chatUsers[0].firstName+",");
            
            //获取最近chats
            var request = this.buildGetLastChatsReq(20);
            $.ajax(request);              
            
            //获取当前聊天lot
            this.getLottery();
            //获取近期某个聊天室下的聊天记录
            this.websockethistory(this.chatUser.userId,0);

            //标记已读
            this.websocketread(this.roomId);
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      });
    },

    getLottery(){
       $.ajax({
        type: "GET",
        url: "/api/lot/simple",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: {lotId:this.lotId},
        success(data) {
          if (data.code === 1){
            this.lot = data.content;
          }
        }
       });
    },

    websocketread(roomId){
      $.ajax({
        type: "POST",
        url: "/api/socket/chat/read",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: {
          roomId : roomId
        },
        success(data) {
          if (data.code === 1){
            this.chatUser.unread = 0;
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      });
    },
    
    websockethistory(userId,offset){
      $.ajax({
        type: "Get",
        url: "/api/socket/chat/history",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: {
          roomId:base64Utils.encode("Message@"+this.userId+","+userId+"[2]"),
          offset:offset,
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
                if(offset == 0){
                  this.messages.push(message);
                }else {
                  this.messages.unshift(message);                  
                }                
              }
            }
            if(offset+20 > this.messages.length){
              this.allmessage = true;
            }else{
              this.allmessage = false;
            }
            this.newChatUser = false;
          }
          
        },
        error(data) {
          errorUtils.requestError(data);
        }
      });
    },

    buildGetUserProfileReq(userid,roomId,lotId,unreadcount){
      var req = {
        type: "Get",
        url: "/api/user/profile",
        contentType : "application/json", 
        async:false,
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: {
          userId:userid
        },
        success: function(data)  {
          var chatItem = {};
          if (data.code == '1'){
            var firstName = "";
            var headPortrait = "";   
            //var userId = "";  
            if (data.content.user.type === window.meebidConstant.userType.member){   
              if (data.content.user.firstName){
                    firstName = data.content.user.firstName;
                }
                
                if (data.content.user.avatar != null){
                    headPortrait = data.content.user.avatar;                    
                }
                else{
                  headPortrait = "http://tinygraphs.com/squares/"+firstName+"?theme=heatwave&numcolors=4"
                }      
              
            }else if(data.content.user.type === window.meebidConstant.userType.house){  
              if (data.content.user.name){
                    firstName = data.content.user.name;
                }
                
                if (data.content.user.bLogoUrl != null){
                    headPortrait = data.content.user.bLogoUrl;
                    
                }else{
                  headPortrait = "http://tinygraphs.com/squares/"+firstName+"?theme=heatwave&numcolors=4"
                } 
                
            }
            chatItem = {
                  roomId : roomId,
                  firstName: firstName,
                  headPortrait : headPortrait,
                  userId : userid,   
                  lotId:lotId,             
                  sendMessageRoomId:this.userid+","+this.chatUserId,
                  unread:unreadcount
                  }
            if(userid == this.chatUserId){
              //console.log("a");
              this.chatUsers.unshift(chatItem) ;
            }else{
              //console.log("b");
              this.chatUsers.push(chatItem) ;
            }
             //console.log("1:"+ this.chatUsers.length);
          }
        },
        error: function(data)  {
          errorUtils.requestError(data);
        }
        
      }
      return req;
    },


    buildGetLastChatsReq(offset){
      var request = {   
          type : 'GET', 
          context: this, 
          url : "/api/socket/chats",
          dataType : 'json' ,
          async:false,
          data : {
              nearN: 20,
              offset:offset,
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
                  headPortrait = "http://tinygraphs.com/squares/"+firstName+"?theme=heatwave&numcolors=4"
                }

               
              }else if (item.group[j].type === window.meebidConstant.userType.house){
                if (item.group[j].name){
                    firstName = item.group[j].name;
                }
                
                if (item.group[j].bLogoUrl != null){
                    headPortrait = item.group[j].bLogoUrl;
                    
                }else{
                  headPortrait = "http://tinygraphs.com/squares/"+firstName+"?theme=heatwave&numcolors=4"
                } 
                
              }
                
              var chatItem = {
                  roomId : roomId,
                  firstName: firstName,
                  headPortrait : headPortrait,
                  userId : userId,                
                  sendMessageRoomId:this.userId+","+this.chatUserId,
                  unread:0
                  }
              if(this.chatUserId == item.group[j].id){
                  // chatItems.unshift(chatItem);
                  //hasChated = true;
              }else if(this.chatUserId != item.group[j].id){
                  let c = chatItems.filter(v => v.userId == item.group[j].id);
                  if(c.length <= 0 ){
                    this.chatUsers.push(chatItem);
                  }
                  
              }
                
            }
        }
      }
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
      if(this.chatUser.lotId != null && this.chatUser.lotId !='' ){
        this.lotId = this.chatUser.lotId;
        this.lot = this.getLottery();
      }
      this.websockethistory(this.chatUser.userId,0);
      this.websocketread(this.roomId);
    },
    
    hideWindow(){
      this.$emit('hidewindow',false); 
    },
    showImage(url){
      this.$emit('showImage',url); 
    },
    srcollToHistory(messageSize){
      this.websockethistory(this.chatUser.userId,messageSize);
    }
  }
}
</script>

<style>
#app {
  font-family: "Gotham SSm A", "Gotham SSm B",  arial, sans-serif
}
</style>
