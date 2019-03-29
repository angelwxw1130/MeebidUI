<template>
    <div id="messagebox" class="message" >
        <ul v-if="messages" style="padding:0;">
            <li v-for="item in messages">
                <p class="time" v-if="item.ifshowtime">
                    <span>{{ item.date | time }}</span>
                </p>
                <div class="main" :class="{ self: item.self }">
                    <img class="avatar" width="30" height="30" :src="item.self ? headPortrait : chatUser.headPortrait" />
                    <div class="text">{{ item.content }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name:'meebidmessage',
    props: {
      headPortrait: {
        type: String,
        default: ""
      },
      messages: {
        type: Object,
        default: {}
      },
      chatUser: {
        type: Object,
        default: {}
      },
    },
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if (typeof date === 'string') {
                date = new Date(date);
            }
            var nowdate = new Date();
            if(nowdate.getFullYear() === date.getFullYear() && nowdate.getMonth() === date.getMonth() && nowdate.getDate() === date.getDate()){
                return (Array(2).join(0) + date.getHours()).slice(-2) + ':' + (Array(2).join(0) + date.getMinutes()).slice(-2);
            }else{
                var month = date.getMonth() +1;
                var fulltime = date.getFullYear() +'年'+month +'月'+date.getDate()+ '日 ' +(Array(2).join(0) + date.getHours()).slice(-2) + ':' + (Array(2).join(0) + date.getMinutes()).slice(-2);
                return fulltime;
            }
            
            
        }
    },
    directives: {
        // 发送消息后滚动到底部
        
        'scroll-bottom' () {
            this.$nextTick(() => {
                this.el.scrollTop = this.el.scrollHeight - this.el.clientHeight;
            });
        }
    },
    updated:function(){
      this.$nextTick(function(){
      var div = document.getElementById('messagebox');
        div.scrollTop = div.scrollHeight;
      })
    },
    methods:{
        getDate(date, sceneEx){
            if (date){
                var dateStr = meebidUtils.formatDate(date, i18n.t('meebid.common.MSG_DATE_TIME_DETAIL_FORMAT'));
                if (sceneEx && sceneEx.timeZone !== null){
                var timeZoneStr = window.meebidConstant.regionTimeZone[sceneEx.timeZone + ""];
                if (timeZoneStr){
                    dateStr += " " + timeZoneStr;
                } else {
                    dateStr += " UTC " + sceneEx.timeZone + ":00 " + i18n.t('meebid.common.MSG_HOURS');
                }
                }
                return dateStr;
            } else {
                return "";
            }
        },
        function(){

        this.$nextTick(function(){
        var div = document.getElementById('messagebox');
            div.scrollTop = div.scrollHeight;
        })
        }
    }
};
</script>



<style>
.message {
    padding: 10px 15px;
    overflow-y: scroll;
}
.message li {
    margin-bottom: 15px;
    list-style-type :none;
}
.message .time {
    margin: 7px 0;
    text-align: center;
}
 .message .time > span {
    display: inline-block;
    padding: 0 18px;
    font-size: 12px;
    color: #fff;
    border-radius: 2px;
    background-color: #dcdcdc;
}
    
.message .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
}
.message .text {
    display: inline-block;
    position: relative;
    padding: 0 10px;
    
    min-height: 30px;
    line-height: 2.5;
    font-size: 12px;
    text-align: left;
    word-break: break-all;
    background-color: #fafafa;
    border-radius: 4px;
}
.message .text:before {
    content: " ";
    position: absolute;
    top: 9px;
    right: 100%;
    border: 6px solid transparent;
    border-right-color: #fafafa;
}
    

.message .self {
    text-align: right;
}
.message .self .avatar {
    float: right;
    margin: 0 0 0 10px;
}
.message .self .text {
    background-color: #fafafa;
}
.message .self .text:before {
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #fafafa;
}
        
    

</style>