<template>
    <div id="messagebox" class="message" >
        <ul v-if="messages" style="padding:0;">
            <li v-for="item in messages">
                <p class="time" v-if="item.ifshowtime">
                    <span>{{ item.date | time }}</span>
                </p>
                <div class="main" :class="{ self: item.self }">
                    <img class="avatar" width="30" height="30" :src="item.self ? headPortrait : chatUser.headPortrait" />
                    <!-- <div class="text">{{ item.content }}</div> -->
                    <div v-if="item.contentType=='text'" class="item-content common_chat_emoji-wrapper-global">
                        <p class="text" v-html="getqqemojiEmoji(item.content)"></p>
                    </div>
                    <!-- 2)图片类型 -->
                    <div v-else-if="item.contentType=='image'" class="imgmsg">
                        <img class="img" :src="item.content" @click="imgViewDialog_show(item.content)" />
                    </div>
                    <!-- 3)文件类型 -->
                    <div v-else-if="item.contentType=='file'" class="text">
                        <div class="file">
                            <!-- <i class="file-icon iconfont glyphicon glyphicon-file"></i> -->
                            <a :href="item.content" :download="item.content" style="text-decoration:none;color:black;">
                                <img v-if="item.fileName.indexOf('csv')>-1" src="../../assets/csv.png">
                                <img v-else-if="item.fileName.indexOf('pdf')>-1" src="../../assets/pdf.png">
                                <img v-else-if="item.fileName.indexOf('txt')>-1" src="../../assets/txt.png">
                                <img v-else-if="item.fileName.indexOf('doc')>-1 ||item.fileName.indexOf('docs')>-1" src="../../assets/word.png">
                                <img v-else-if="item.fileName.indexOf('xls')>-1 ||item.fileName.indexOf('xlsx')>-1" src="../../assets/xls.png">
                                <img v-else src="../../assets/txt.png">
                                <div class="file-info">
                                    <p class="file-name">{{getFileName(item.fileName)}}</p>
                                    <div class="file-opr">
                                        <!-- <div>
                                            <a class="file-download" :href="item.content" target='_blank' :download="item.content">Download
                                        </div> -->
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </li>
        </ul>        
    </div>    
</template>

<script>
import i18n from './../../i18n/i18n'
import bridgeUtils from './../../utils/BridgeUtils'
export default {
    name:'meebidmessage',
    props: {
      headPortrait: {
        type: String,
        default: ""
      },
      messages: Array,
      chatUser: {
        type: Object,
        default: {}
      },
    },
    data(){
        return{
            
        }
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
                var fulltime = date.getFullYear() +'/'+month +'/'+date.getDate()+ ' ' +(Array(2).join(0) + date.getHours()).slice(-2) + ':' + (Array(2).join(0) + date.getMinutes()).slice(-2);
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
        getqqemojiEmoji: function(value) {
            //console.log(value);
            if (value == undefined) {
                return;
            }
            var self = this;
            return value.replace(/\[(.+?)\]/g, function(item, value) {
                return bridgeUtils.$emit('demo',value);
            });
        },
        function(){

        this.$nextTick(function(){
        var div = document.getElementById('messagebox');
            div.scrollTop = div.scrollHeight;
        })
        },

        /**
         * 转换文件名，若文件名称超过9个字符，将进行截取处理
         * @param {String} fileName 文件名称
         */
        getFileName: function(fileName) {
            if (!fileName) {
                return;
            }
            var name = fileName.substring(0, fileName.lastIndexOf('.'));
            var extend = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (name.length > 9) {
                name = name.substring(0, 3) + '...' + name.substring(name.length - 3);
            }
            return name + '.' + extend;
        },
        /**
         * 图片查看dialog_显示
         */
        imgViewDialog_show: function(url) {
            this.$emit('showImage',url);
        },

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
    max-width:350px;
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
    background-color: #67c23a;
}
.message .self .text:before {
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #67c23a;
}
 
.message .imgmsg {
    display: inline-block;
    position: relative;
    padding: 0 0;
    
    min-height: 30px;
    line-height: 2.5;
    font-size: 12px;
    text-align: left;
    word-break: break-all;
    background-color: #67c23a;
    border-radius: 4px;
    max-width:350px;
}
.message .imgmsg:before {
    content: " ";
    position: absolute;
    top: 9px;
    right: 100%;
    border: 6px solid transparent;
    border-right-color: #67c23a;
}

.message .self .imgmsg:before {
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #67c23a;
}

.message .self .imgmsg .img {
    padding: 10px 0;
    max-width: 100px;
    max-height: 75px;
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
    padding: 5px;
    cursor: pointer;
    position: relative;
}        


.file {
        max-width: 220px;
        padding: 10px 0px 5px 0px;
        margin: 3px;
        float: left;
        overflow: hidden;
        background: #67c23a;
        border-radius: 5px;
}
/* .file .el-button {
            padding: 0px;
            font-size: 12px;
        } */
.file .file-info {
            
}
.file .file-info .file-name {
                max-width: 160px;                
                color: #333333;                
                text-overflow: ellipsis;
                overflow: hidden;
                padding: 0px;
                line-height: 1.5;
            }
        
.file .file-opr {
            margin-top: 0px;
            line-height: 1.5;
        }
.file .file-icon {
            float: left;
            color: #663399;
            font-size: 40px;
        }
.file .file-download {
            color: #00a8d7;
            cursor: pointer;
            text-decoration: blink;
            padding: 0px;
            line-height: 1.5;
        }
    

</style>