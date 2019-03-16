<template>
    <div class="meebidroomlist">
        <ul style="padding:0px;">
            <li v-for="item in chatUsers" :class="{ active: item.userId === currentId }" @click="getChatConn(item.userId,item.roomId)"  style="list-style-type:none; padding: 12px 15px; border-bottom: 1px solid #FF5242; cursor: pointer; transition: background-color .1s;" >
                <img class="avatar" style="vertical-align: middle; border-radius: 2px; width:30; height:30;"   :alt="item.firstName" :src="item.headPortrait">
                <p class="name"  style="vertical-align: middle; display: inline-block; margin: 0 0 0 15px;">{{item.firstName}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import loginUtils from './../../utils/loginUtils'
import errorUtils from './../../utils/errorUtils'
import $ from 'jquery'

export default {
    name:'meebidroomlist',
    props: {
      currentId:0,
      chatUsers: {
        type: Object,
        default: {}
      },
    },
    data(){
        return{
            loginUser: loginUtils.getLoginUser(),
            currentId:0,
            
        }
    },
    
    mouted(){
        this.currentId = chatUsers[0].userId;
        //获取用户信息
        //var request = this.buildGetLastChatsReq();
        //$.ajax(request);
      
    },
    methods:{
        /*
        buildGetLastChatsReq(){
            var request = {   
                type : 'GET', 
                context: this, 
                url : "/api/socket/chats",
                dataType : 'json' ,
                data : {
                    nearN: 5
                },
                success : function(data) {
                    if (data.code == '1'){
                    var items = this.buildChatItems(data.content.rooms.group ? data.content.rooms.group : []);
                        
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
            if (this.loginUser.token){
                request.header = {
                    token: this.loginUser.token
                }
            }
            return request;
        },
        buildChatItems(items){
            var chatItems = [];
            for (var i = 0; i < items.length; i++){
                var firstName = "";
                var headPortrait = "";                    
                var item = items[i];
                if (item.type === window.meebidConstant.userType.member){
                    if (item.firstName){
                        firstName = item.firstName;
                    }else{
                        firstName = email;
                    }
                    
                    if (item.avatar){
                        headPortrait = item.avatar;
                    
                } else if (item.type === window.meebidConstant.userType.house){
                    if (item.name){
                        firstName = item.name;        
                    }else{
                        firstName = email;
                    }
                    if(item.bLogoUrl){
                        headPortrait = item.bLogoUrl;
                    }
                }      
                var chatItem = {
                    firstName: firstName,
                    headPortrait : headPortrait,
                }
                chatItems.push(chatItem);
                }
            }
                
            this.chatUsers = chatItems;
        },*/
        getChatConn(userId,roomId){
            if(this.currentId == userId){
                return;
            }
            this.currentId = userId;
            this.$emit('getChatRoom',{chatUserId:userId,chatRoomId:roomId}); 
           
        }
    }
};
</script>

<style >
ul > li:hover {
    background-color: rgba(255, 255, 255, 0.03);
}
ul > li.active {
    background-color: rgba(255, 255, 255, 0.1);
        
}
    

</style>

