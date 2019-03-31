<template>
  <div style="width: 600px;height: 500px; overflow: hidden; border-radius: 3px; box-shadow: 3px 3px 3px #888888;"> 
    <div class="sidebar" style=" float: left;height: 100%;
      width: 160px;
      color: #f4f4f4;
      background-color: #FF5242;">
      <!--<meebidcard :headPortrait="headPortrait" :firstName="firstName"></meebidcard>-->
      <meebidroomlist :chatUsers="chatUsers" @getChatUserId='getChatUserId' @getChatRoom='getChatRoom'></meebidroomlist>
    </div>
    <div class="main" style="position: relative;height: 100%;
      overflow: hidden;
      background-color: #eee;">
        <meebidmessage style="height:360px" :messages="messages" :headPortrait="headPortrait" :chatUser="chatUser"></meebidmessage>
        <meebidtext  @sendMessage='sendMessage'></meebidtext>
    </div>
  </div>
</template>

<script>
import loginUtils from './../../utils/loginUtils'
import errorUtils from './../../utils/errorUtils'
import meebidUtils from './../../utils/meebidUtils'
import i18n from './../../i18n/i18n'
import $ from 'jquery'
export default {
  name:'meebidim',
  props: {
    profileData: Object,
    ws: Object,
    userId: {
      type: Number,
      default: -1
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
    }
  },
  beforeMount() {
    /*
    console.log("app ready");       
    if (this.$parent.$data && this.$parent.$data.user){
      this.userProfile = this.$parent.$data.user;
      this.userId = this.userProfile.id;
      if (this.userProfile.type === window.meebidConstant.userType.member){
        if (this.userProfile.firstName){
          this.firstName = this.userProfile.firstName;
        }
        this.userProfileForm = this.userProfile;
        if (this.userProfile.avatar){
          this.headPortrait = this.userProfile.avatar;
        }        

      } else if (this.userProfile.type === window.meebidConstant.userType.house){
        if (this.userProfile.name){
          this.firstName = this.userProfile.name;        
        }
        if(this.userProfile.bLogoUrl){
          this.headPortrait = this.userProfile.bLogoUrl;
        }
      }
    }
    if(this.headPortrait == null){
      if(this.userId == 22){
          this.headPortrait  = "./static/user1.jpg"
      }else{
        this.headPortrait  = "./static/user2.jpg"
      }
    }
    */
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
    
    sendMessage(message) {
      //尝试向服务端发送消息
      console.log(message);
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
        roomId:"22,23"
      }));
      this.messages.push({
         date:date ,
         sender:this.userId,
         content : message,
         self : true,
         ifshowtime :this.showChatTime,
      });
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
      this.messages.push({
         date:redata.sendAt ,
         sender:redata.sender,
         content : redata.content,
         self : false,
         ifshowtime :this.showChatTime,
      });
　　　 console.log(redata.content); 
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
                    console.log(num);
                    this.showChatTime=false;
                  }else{
                    console.log(num);
                    this.showChatTime=true;
                  }
                }
                this.lastChatTime = data.content.msgs[i].sendAt;
                console.log(this.lastChatTime);  
                var self = false;
                if(data.content.msgs[i].sender == this.userId){
                  self = true;
                }
                var message = {
                  date:data.content.msgs[i].sendAt ,
                  sender:data.content.msgs[i].sender,
                  content : data.content.msgs[i].content,
                  self : self,
                  ifshowtime :this.showChatTime,
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
                userId : 23
                }
            chatItems.push(chatItem);
          }else{
            var chatItem = {
                sendMessageRoomId : "22,23",
                firstName: "hhh 233",
                headPortrait : "./static/user2.jpg",
                userId : 22
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
