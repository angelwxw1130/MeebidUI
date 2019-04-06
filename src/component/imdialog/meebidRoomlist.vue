<template>
    <div class="meebidroomlist">
        <ul style="padding:0px;">
            <li v-for="item in chatUsers" :class="{ active: item.userId === currentId }" @click="getChatConn(item.userId,item.roomId)"  
            style="white-space:nowrap;list-style-type:none; padding: 10px 10px; border-bottom: 1px solid #FF5242; cursor: pointer; transition: background-color .1s;" >
                <img class="avatar" style="vertical-align: middle; border-radius: 2px; max-width:30px; max-height:30px;"   :alt="item.firstName" :src="item.headPortrait">
                <p class="name"  style="vertical-align: middle; display: inline-block; margin: 0 0 0 5px;">{{item.firstName}}</p>
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
            
        }
    },
    
    mouted(){
        this.currentId = chatUsers[0].userId;
        //获取用户信息
        //var request = this.buildGetLastChatsReq();
        //$.ajax(request);
      
    },
    methods:{
        
        getChatConn(userId,roomId){
            
            if(this.currentId == userId){
                return;
            }
            console.log("roomId:"+roomId);
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

