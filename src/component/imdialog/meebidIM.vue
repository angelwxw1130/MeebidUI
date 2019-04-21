<template>
  <div style="width: 620px;height: 500px; overflow: hidden; border-radius: 3px; box-shadow: 3px 3px 3px #888888;"> 
    <div class="sidebar" style=" float: left;height: 500px;
      width: 180px;
      color: #f4f4f4;
      background-color: #DDDDDD;"><!-- #FF5242-->
      <!--<meebidcard :headPortrait="headPortrait" :firstName="firstName"></meebidcard>-->
      <meebidroomlist :chatUsers="chatUsers" @getChatRoom='getChatRoom'></meebidroomlist>
    </div>
    <div class="main" style="position: relative;height: 100%;overflow: hidden;background-color: #eee;">
        <div style="height:50px;border-bottom:1px solid #d4dde4;">
          <p style="font-size:20px;padding:5px 0px 0px 30px;height:15px;color:#FF5242;weight:10;">{{chatUser.firstName}}</p>
          <p style="font-size:13px;padding:5px 0px 0px 32px;color:#FF5242;" v-if="lotId > 0"><a :href="lotUrl">Lottery：{{lotname}}</a></p>
          <a href="javascript:void(0)" @click='hideWindow'>
            <span class="fa fa-arrow-circle-o-right" style="display:inline-block;font-size:25px;color:#FF5242; position: absolute;  left: 390px;  top: 15px;cursor:pointer;" ></span>
          </a>
        </div>
        <meebidmessage ref="message" style="height:310px" :allmessage="allmessage" :messages="messages" :headPortrait="headPortrait" :chatUser="chatUser" @showImage="showImage" @srcollToHistory="srcollToHistory" ></meebidmessage>
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
      lotname:"",
      //chatRoomLotId:'',
      //chatRoomRoomId:'',      
      chatRoomOffset:0,
      lotUrl:"",
    }
  },
  beforeMount() {    
    this.windowMinHeight = window.innerHeight - 85 + "px";
    
  },
  mounted(){
    //this.chatRoomLotId = this.roomId;
    //this.chatRoomLotId = this.lotId
    
  },

  methods: {
    sendMessageCtx(message) {
      //尝试向服务端发送控制消息
      
      this.ws.send(message);
      
    },
    sendMessage(message) {
      //尝试向服务端发送消息
      //console.log(message);
      this.$refs.message.moreMessage = false;
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
    
    websocketonopen() {
　　　　console.log("WebSocket连接成功");  
      this.$emit("reconnect");     
　　},
　　websocketonerror(e) { //错误
 　　　console.log("WebSocket连接发生错误");
      this.$emit("reconnect");  
　　},
　　websocketonmessage(e){       
      //数据接收       
      const redata = JSON.parse(e.data);
      let fileNameObject = null;     
      if(redata.type == 3){ // type=3 控制信息返回
        const content = JSON.parse(redata.content);
        
        if(this.$refs.textarea.Files){
          let fileNameObjects = this.$refs.textarea.Files;
          fileNameObjects.forEach(item => {
            if(item.id == redata.id){
              fileNameObject = item;
              if(fileNameObject.File){
                
              }
              
            }
          });
        }else{
            return;
        }
        //上传文件
        this.upload(fileNameObject.File, redata);

      }
      else {//正常消息
        if(this.chatUsers.length == 0){
          //当前用户roomlist长度为0，获取roomlist
          this.getChatRooms(false);
        }
        //console.log("thischatuserid:"+this.chatUserId+",lotid:"+this.lotId);
        if(redata.lotId == this.lotId && (redata.sender == this.chatUserId || redata.sender == this.userId)){
          //如果返回消息是当前对话框，则在当前对话框显示消息
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
          if(redata.type === 0){//消息类型为文本
            contentType = "text";
            content = redata.content;
            fileName = '';
          }else {//消息类型为图片或者文件，获取文件信息
            const jsoncontent = JSON.parse(redata.content);
          
            if(this.$refs.textarea.Files){
              let fileNameObjects = this.$refs.textarea.Files;
              fileNameObjects.forEach(item => {
                if(item.id == jsoncontent.id){
                  fileNameObject = item;
                }
              });
            }else{
                return;
            }
            if(redata.type === 1){//消息类型为图片
              contentType = "image";
              content = jsoncontent.rUid;
              fileName = jsoncontent.name;
            }else if(redata.type === 2){//消息类型为文件
              contentType = "file";
              content = jsoncontent.rUid;
              fileName = jsoncontent.name;
            }
            
          }
          if(this.userId == redata.sender){
            self = true;
          }
          this.$refs.message.moreMessage = false;              
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
        else{//如果消息不是当前对话框，则给相应chatUser添加未读信息
          var hasChatRoom = false;
          this.$emit("changeTotalUnread",1);
          this.chatUsers.forEach((item,index) => {
            if(item.userId == redata.sender && item.lotId == redata.lotId){//获取发送者
              item.unread ++;
              if(index > 0){
                this.chatUsers.splice(index,1);
                this.chatUsers.splice(1,0,item);
              }
              
              hasChatRoom = true;  
              //console.log(item.unread);
            }
            return; 
          });
          //this.chatUsers.splice(1, 0, chatUser);

          if(!hasChatRoom){//之前未有联系，新建chatUser
            //在指定位置添加元素,第一个参数指定位置,第二个参数指定要删除的元素,如果为0,则追加
            let roomId = "";//console.log("test");
            let userId = redata.sender;            
            if(userId > this.userId){
              $.ajax(this.buildGetUserProfileReq(userId,base64Utils.encode("Message@"+this.userId+","+userId+"[2]"),redata.lotId,1));
                        
              //roomId = base64Utils.encode("Message@"+this.userId+","+userId+"[2]")
            }else{
              $.ajax(this.buildGetUserProfileReq(userId,base64Utils.encode("Message@"+userId+","+this.userId+"[2]"),redata.lotId,1));
                        
              //roomId = base64Utils.encode("Message@"+userId+","+this.userId+"[2]")
            }
            

        }
      }

        
        
      }
　　}, 
    websocketclose(e){ //关闭       
　　　console.log("connection closed (" + e.code + ")"); 
　　},

    

    getChatRooms(targetCharUser,haschatuser){//获取聊天室
      if(this.chatUsers.length <= 0){//初始化chatusers
        this.chatUsers = [];      
        this.websocketunread(targetCharUser,haschatuser);
        return;
      }
      
      if(targetCharUser == true && this.chatUsers.length >0){  
        if(haschatuser){//指定当前用户
        console.log(this.chatUsers)
          console.log("chatUserid:"+this.chatUserId+",lotid:"+this.lotId+",roomid:"+this.roomId);
          var ifInchatusers = false;
          this.chatUsers.forEach((item,index) => {
            if(item.userId == this.chatUserId && item.lotId == this.lotId){console.log(index);
              this.chatUser = item;
              this.roomId = this.chatUser.roomId;
              this.lotId = this.chatUser.lotId;
              this.chatUserId = this.chatUser.userId;

              this.chatUsers.splice(index,1);
              this.chatUsers.unshift(item);
              ifInchatusers = true;
            }
          });
          if(!ifInchatusers){
            if(this.chatUserId > this.userId){
              $.ajax(this.buildGetUserProfileReq(this.chatUserId,base64Utils.encode("Message@"+this.userId+","+this.chatUserId+"[2]"),this.lotId,0));
                        
              //roomId = base64Utils.encode("Message@"+this.userId+","+userId+"[2]")
            }else{
              $.ajax(this.buildGetUserProfileReq(this.chatUserId,base64Utils.encode("Message@"+this.chatUserId+","+this.userId+"[2]"),this.lotId,0));
                        
              //roomId = base64Utils.encode("Message@"+userId+","+this.userId+"[2]")
            }
          }
          
          //this.chatUsers.unshift(item);
        }else{
          this.chatUser = this.chatUsers[0];
          this.roomId = this.chatUser.roomId;
          this.lotId = this.chatUser.lotId;
          this.chatUserId = this.chatUser.userId;
        }
        
        
      
        if(this.chatUser != null && this.chatUser.userId != null){
          //获取当前聊天lot
          this.getLottery();
          //获取近期某个聊天室下的聊天记录
          this.websockethistory(this.chatUser,0);
          //标记已读
          this.websocketread(this.chatUser.roomId,this.chatUser.lotId);              
            
            this.$emit("changeTotalUnread",(0-this.chatUser.unread));
            console.log("removeUnread:"+(0-this.chatUser.unread));
            console.log("unread:"+this.chatUser.unread);
            this.chatUser.unread = 0;
          
        }
      }
    },
    websocketunread(targetCharUser,haschatuser){      
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
                
                var roomPlaint = base64Utils.decode(roomId)                    
                  var userIds = roomPlaint.substring(roomPlaint.indexOf("@")+1,roomPlaint.indexOf("[")).split(",");
                  for(var j=0; j<userIds.length;j++){
                    //当前用户，不操作
                    if(userIds[j] == this.userId || userIds[j]<=0){
                      continue;
                    }
                    if(userIds[j] > this.userId){
                      smallerUserId = this.userId;
                      biggerUserId = userIds[j];
                    }else{
                      smallerUserId = userIds[j];
                      biggerUserId = this.userId;
                    }
                    //非当前用户，是指定聊天用户
                    if(userIds[j] == this.chatUserId && this.lotId == lotId){                        
                      // console.log("Message@"+smallerUserId+","+biggerUserId+"[2]");
                      hasChated = true;
                    }
                    $.ajax(this.buildGetUserProfileReq(userIds[j],base64Utils.encode("Message@"+smallerUserId+","+biggerUserId+"[2]"),lotId,value));
                                          
                  }
                
                
              }//end of for loop
              
            }
            
            //未读信息中无指定聊天用户,创建指定用户
            if(hasChated == false && this.lotId != '' && this.chatuserId > 0 ){
              
              if(this.chatUserId > this.userId){
                smallerUserId = this.userId;
                biggerUserId = this.chatUserId;
              }else{
                smallerUserId = this.chatUserId;
                biggerUserId = this.userId;
              }
              $.ajax(this.buildGetUserProfileReq(this.chatUserId,base64Utils.encode("Message@"+smallerUserId+","+biggerUserId+"[2]"),this.lotId,0));
              // console.log("Message@"+smallerUserId+","+biggerUserId+"[2]");
            }
            
            //获取最近chats
            var request = this.buildGetLastChatsReq(this.chatRoomOffset);
            $.ajax(request); 

            
            if(targetCharUser == true && this.chatUsers.length >0){  
              if(haschatuser){//指定聊天用户
                var ifInchatusers = false;
                //console.log("chatUserid:"+this.chatUserId+",lotid:"+this.lotId+",roomid:"+this.roomId);
                this.chatUsers.forEach((item,index) => {
                  if(item.userId == this.chatUserId && item.lotId == this.lotId){
                    this.chatUser = item;
                    this.roomId = this.chatUser.roomId;
                    this.lotId = this.chatUser.lotId;
                    this.chatUserId = this.chatUser.userId;

                    this.chatUsers.splice(index,1);
                    this.chatUsers.unshift(item);
                    ifInchatusers = true;
                  }
                });
                if(!ifInchatusers){
                  if(this.chatUserId > this.userId){
                    $.ajax(this.buildGetUserProfileReq(this.chatUserId,base64Utils.encode("Message@"+this.userId+","+this.chatUserId+"[2]"),this.lotId,0));
                              
                    //roomId = base64Utils.encode("Message@"+this.userId+","+userId+"[2]")
                  }else{
                    $.ajax(this.buildGetUserProfileReq(this.chatUserId,base64Utils.encode("Message@"+this.chatUserId+","+this.userId+"[2]"),this.lotId,0));
                              
                    //roomId = base64Utils.encode("Message@"+userId+","+this.userId+"[2]")
                  }
                }
                
                
              }else{//非指定聊天用户
                this.chatUser = this.chatUsers[0];
                this.roomId = this.chatUser.roomId;
                this.lotId = this.chatUser.lotId;
                this.chatUserId = this.chatUser.userId;
              }
            
              if(this.chatUser != null && this.chatUser.userId != null){
                //获取当前聊天lot
                this.getLottery();
                //获取近期某个聊天室下的聊天记录
                this.websockethistory(this.chatUser,0);
                //标记已读
                this.websocketread(this.chatUser.roomId,this.chatUser.lotId);              
                  
                  this.$emit("changeTotalUnread",(0-this.chatUser.unread));
                  console.log("removeUnread:"+(0-this.chatUser.unread));
                  console.log("unread:"+this.chatUser.unread);
                  this.chatUser.unread = 0;
                
              }
            }
          }
        },
        error(data) {
          errorUtils.requestError(data);
        }
      });
    },

    
    websocketread(roomId,lotId){
      $.ajax({
        type: "POST",
        url: "/api/socket/chat/read",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: {
          roomId : roomId,
          lotId:lotId
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
    
    websockethistory(chatuser,offset){
      if(offset == 0){
        this.messages = [];
      }
      $.ajax({
        type: "Get",
        url: "/api/socket/chat/history",
        contentType : "application/json", 
        context: this,
        headers: {
          token: this.loginUser.token
        },
        data: {
          roomId:chatuser.roomId,//base64Utils.encode("Message@"+smallerUserId+","+biggerUserId+"[2]"),
          offset:offset,
          count:20,
          lotId:chatuser.lotId//this.lotId
        },
        success(data) {
          if (data.code === 1){
            if(this.newChatUser){
              this.messages = [];
              this.lastChatTime = "";
              this.showChatTime=true;
            }
            if(offset >= 20){
              this.$refs.message.moreMessage = true;
            }else{
              this.$refs.message.moreMessage = false;
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
            let lotName = '';  
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
                //获取lot信息
                $.ajax({
                  type: "GET",
                  url: "/api/lot/simple",
                  contentType : "application/json", 
                  context: this,
                  headers: {
                    token: this.loginUser.token
                  },
                  async : false,
                  data: {lotId:lotId},
                  success(result) {
                    if (result.code === 1){
                      if(result.content == null){
                        lotName = "";    
                                          
                      }else{
                        lotName = result.content.name;               
                        
                      }
                      
                    }
                  },
                });
            }else if(data.content.user.type === window.meebidConstant.userType.house){  
              
              if (data.content.user.name){
                    firstName = data.content.user.name;
                }
                
                //获取lot信息
                $.ajax({
                  type: "GET",
                  url: "/api/lot/simple",
                  contentType : "application/json", 
                  context: this,
                  headers: {
                    token: this.loginUser.token
                  },
                  async : false,
                  data: {lotId:lotId},
                  success(result) {
                    if (result.code === 1){
                      if(result.content == null){
                        lotName = "";
                        headPortrait = "http://tinygraphs.com/squares/"+lotName+"?theme=heatwave&numcolors=4"
                      }else{
                        lotName = result.content.name;
                  
                        if (result.content.imageUrls != null){
                            headPortrait = result.content.imageUrls;                    
                        }
                        else{
                          headPortrait = "http://tinygraphs.com/squares/"+lotName+"?theme=heatwave&numcolors=4"
                        }
                      }
                      
                      
                      
                    }
                  },
                });
                
            }
            //console.log(headPortrait);
            chatItem = {
                  roomId : roomId,
                  firstName: firstName,
                  headPortrait : headPortrait,
                  userId : userid,   
                  lotId:lotId,             
                  sendMessageRoomId:this.userid+","+this.chatUserId,
                  unread:unreadcount,
                  lotName : lotName,
                  }
            if(userid == this.chatUserId && lotId == this.lotId){
              // 是当前聊天用户
              this.chatUsers.unshift(chatItem) ;
            }else{
              // 非当前用户
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
            if(data.content != null){
              this.lot = data.content;
              this.lotname = this.lot.name;
              this.lotUrl = "./lotDetail.html?" + window.btoa("lotId=" + this.lot.id)
            }
            
          }
        }
       });
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
          if(item.lotId <= 0){
            //console.log("item.lotId :"+item.lotId );
            continue;
          }
            
          for(var j = 0; j < item.group.length; j++){
            var firstName = "";
            var headPortrait = "";   
            var userId = "";  
            let lotName = "";       
            // 当前用户  
            if(item.group[j].id == this.userId){
              continue;
            }
            userId = item.group[j].id;// console.log("item.userId :"+this.chatUsers.length+item.group[j].id );
            
            var hasInChat = false;
            if(this.chatUsers.length > 0){
              this.chatUsers.forEach(chatItem => {
                if(chatItem.userId == item.group[j].id && chatItem.lotId == item.lotId){
                  hasInChat = true;
                }
              });
            }
            
            if(hasInChat){
              continue;
            }
            
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
              $.ajax({
                  type: "GET",
                  url: "/api/lot/simple",
                  contentType : "application/json", 
                  context: this,
                  headers: {
                    token: this.loginUser.token
                  },
                  async : false,
                  data: {lotId:item.lotId},
                  success(result) {
                    if (result.code === 1){
                      if(result.content == null){
                        lotName = "";                      
                      }else{
                        lotName = result.content.name;               
                        
                      }
                      
                    }
                  },
                });
            }
            else if (item.group[j].type === window.meebidConstant.userType.house){
              if (item.group[j].name){
                  firstName = item.group[j].name;
              }
              
              //获取lot信息
              $.ajax({
                type: "GET",
                url: "/api/lot/simple",
                contentType : "application/json", 
                context: this,
                headers: {
                  token: this.loginUser.token
                },
                async : false,
                data: {lotId:item.lotId},
                success(result) {
                  if (result.code === 1){
                    if(result.content == null){
                      lotName = "";
                      headPortrait = "http://tinygraphs.com/squares/"+lotName+"?theme=heatwave&numcolors=4"
                      
                    }else{
                      lotName = result.content.name;
                      if (result.content.imageUrls != null){
                          headPortrait = result.content.imageUrls;                    
                      }
                      else{
                        headPortrait = "http://tinygraphs.com/squares/"+lotName+"?theme=heatwave&numcolors=4"
                      }
                    }
                  }
                }
              });
             
              //headPortrait = tmp.headPortrait;
              //lotName = tmp.lotName;
            }
             //console.log(headPortrait);
            var chatItem = {
                roomId : roomId,
                firstName: firstName,
                headPortrait : headPortrait,
                userId : userId,                
                sendMessageRoomId:this.userId+","+userId,
                unread:0,
                lotId:item.lotId,
                lotName:lotName,
            }
            if(this.chatUserId == item.group[j].id && this.lotId == item.group[j].lotId){
                // chatItems.unshift(chatItem);
                //hasChated = true;
            }else if(this.chatUserId != item.group[j].id || (this.chatUserId == item.group[j].id && this.lotId != item.lotId)){
                let c = this.chatUsers.filter(v => v.userId == item.group[j].id && v.lotId == item.group[j].lotId);
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
        if(this.chatUsers[i].userId == wsConnection.chatUserId && this.chatUsers[i].lotId == wsConnection.lotId){
          this.chatUser = this.chatUsers[i];
          this.$emit("changeTotalUnread",(0-this.chatUser.unread));
          this.chatUser.unread = 0;          
        }
      }
      //this.$refs.textarea.getFocus();
      this.roomId = wsConnection.chatRoomId;
      this.newChatUser = true;
      if(this.chatUser.lotId != null && this.chatUser.lotId !='' ){
        this.lotId = this.chatUser.lotId;
        this.lot = this.getLottery();
        this.chatUserId = this.chatUser.userId
      }
      //console.log(this.lotId);
      //console.log(wsConnection.lotId)
      this.websockethistory(this.chatUser,0);
      this.websocketread(this.roomId,this.lotId);
    },
    
    //#region 上传文件
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
    //#endregion

    hideWindow(){
      this.$emit('hidewindow',false); 
    },
    showImage(url){
      this.$emit('showImage',url); 
    },
    srcollToHistory(messageSize){
      this.websockethistory(this.chatUser,messageSize);
    }
  }
}
</script>

<style>
#app {
  font-family: "Gotham SSm A", "Gotham SSm B",  arial, sans-serif
}
</style>
