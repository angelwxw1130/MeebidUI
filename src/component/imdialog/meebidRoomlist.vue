<template>
    <div class="meebidroomlist" id="roomlist">
        <ul style="padding:0px;">
            <li v-for="item in chatUsers" :class="{ active: item.userId === currentId && item.lotId == currentLotId}" @click="getChatConn(item.userId,item.roomId,item.lotId)"
            style="white-space:nowrap;list-style-type:none; padding: 10px 10px; border-bottom: 1px solid rgba(205, 205, 205); cursor: pointer; transition: background-color .1s;" >
                <img class="avatar" style="vertical-align: middle; border-radius: 2px; width:30px; height:30px;"  :src="item.headPortrait">
                <div style="vertical-align: middle; display: inline-block; margin: 0 0 0 5px;"> 
                    <p class="chatname"  style="width:113px;white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow:hidden;color:black;font-size:15px;margin: 0;">{{item.firstName}}</p>
                    <p class="lotName"  style="width:113px;white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow:hidden;color:gray;font-size:12px;margin: 0;">{{item.lotName}}</p>
                </div>
                <div class="showIf" v-if="item.unread != '' || item.unread != 0"  v-cloak>
                    <span class="num">{{item.unread}}</span>
                </div>
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
      chatUsers:Array,
    },
    data(){
        return{
            loginUser: loginUtils.getLoginUser(),
            currentId:0,
            currentLotId:0,
        }
    },
    
    mouted(){
        this.currentId = chatUsers[0].userId;
        this.currentLotId = chatUsers[0].lotId;
        //获取用户信息
        //var request = this.buildGetLastChatsReq();
        //$.ajax(request);
      var div = document.getElementById('roomlist');
        div.addEventListener('scroll', this.onWindwoScroll);
    },
    methods:{
        
        getChatConn(userId,roomId,lotId){
            // console.log("lotid_roomlist:"+lotId)
            if(this.currentId == userId && this.currentLotId == lotId){
                return;
            }
            
            this.currentId = userId;
            this.currentLotId = lotId;
            this.$emit('getChatRoom',{chatUserId:userId,chatRoomId:roomId,lotId:lotId}); 
           
        },
        onWindwoScroll() {
            var me = this;
            var scrollTop = window.pageYOffset
                  || document.documentElement.scrollTop
                  || document.body.scrollTop
                  || 0;
            
        },
        setChatUser(chatUser){
            this.chatUser = chatUser;
            this.currentId = chatUser.userId;
            this.currentLotId = chatUser.lotId;
            this.roomId = chatUser.roomId;
        }
    }
};
</script>

<style >
.meebidroomlist {
    height:500px;
    overflow-y: scroll;
}
ul > li:hover {
    background-color: rgba(0, 0, 0, 0.03);
}
ul > li.active {
    background-color: rgba(0, 0, 0, 0.1);
        
}
.showIf {
        display: inline-block;
        float: left;
        height: 15px;
        width: 15px;
        background-color: #F64D32;
        margin-left: 135px;
        margin-top: -40px;
        border-radius: 10px;
        z-index: 99;
}
        

.showIf .num {
          font-size: 12px;
          line-height: 10px;
          color: #ffffff;
          text-align: center;
          margin-left: 3px;
          margin-bottom: 3px;

        }
         

</style>

