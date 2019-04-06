<template>
    <div class="text" style="height: 120px;border-top: solid 1px #ddd;">
        <!-- 表情、文件选择等操作 -->
                    <div class="opr-wrapper">
                        <common-chat-emoji class="item" ref="qqemoji" @select="qqemoji_selectFace"></common-chat-emoji>
                        <a class="item" href="javascript:void(0)" @click="fileUpload_click('file')">
                            <!--<i class="iconfont glyphicon glyphicon-folder-open"></i>-->
                            <i class='fa fa-folder-open' style="font-size:20px;color:#FF5242;vertical-align: middle;"></i>
                        </a>
                        <form method="post" enctype="multipart/form-data" id="cp_upload">
                            <input type="file" name="uploadFile" id="common_chat_opr_fileUpload" style="display:none;position:absolute;left:0;top:0;width:0%;height:0%;opacity:0;">
                        </form>
                    </div>
     
        <textarea placeholder="按 Enter 发送" id="common_chat_input" v-model="content" @keyup="onKeyup" style="padding: 10px;
        height: 100%;
        width: 100%;
        border: none;
        outline: none;
        font-family: 'Micrsofot Yahei';
        resize: none;"></textarea>
    </div>
</template>

<script>
import loginUtils from './../../utils/loginUtils'
import errorUtils from './../../utils/errorUtils'
import base64Utils from './../../utils/base64Utils'
import common_chat_emoji from './common_chat_emoji.vue';
import $ from 'jquery'

export default {
    name:'meebidtext',
    components: {
        commonChatEmoji: common_chat_emoji
    },
    props: {

     
    },
    data () {
        return {
            content: '',
            inputContent_setTimeout: null, // 输入文字时在输入结束才修改具体内容
            selectionRange: null, // 输入框选中的区域
            shortcutMsgList: [], // 聊天区域的快捷回复列表
            imgViewDialogVisible: false, // 图片查看dialog的显示
            imgViewDialog_imgSrc: '', // 图片查看dialog的图片地址
            Files:[],//文件待上传列表
        };
    },
    methods: {
        onKeyup (e) {
            if (e.keyCode === 13 && this.content.length) {
                this.$emit('sendMessage',this.content)
                this.content = '';
            }
        },
        

        /**
         * 设置input输入框的选择焦点
         */
        setInputContentSelectRange: function() {
            if (window.getSelection && window.getSelection().rangeCount > 0) {
                var selectRange = window.getSelection().getRangeAt(0);
                if (
                    selectRange.commonAncestorContainer.nodeName == '#text' &&
                    selectRange.commonAncestorContainer.parentElement &&
                    selectRange.commonAncestorContainer.parentElement.id == 'common_chat_input'
                ) {
                    // 选中了输入框内的文本
                    this.$data.selectionRange = selectRange;
                } else if (selectRange.commonAncestorContainer.id == 'common_chat_input') {
                    // 选中了输入框
                    this.$data.selectionRange = selectRange;
                }
            }
        },

        /**
         * 输入框的mouseup
         */
        inputContent_mouseup: function(e) {
            this.setInputContentSelectRange();
        },

        /**
         * 输入框的keydown
         */
        inputContent_keydown: function(e) {
            // 1.快捷键判断
            if (e.keyCode == 13) {
                // 回车直接发送
                this.sendText();
                e.returnValue = false;
                return;
            }

            this.setInputContentSelectRange();
            var self = this;
            // keyup触发时，绑定的数据还没有被变更，需要进行延后访问
            clearTimeout(this.$data.inputContent_setTimeout);
            this.$data.inputContent_setTimeout = setTimeout(function() {
                self.setInputContentByDiv();
            }, 200);
        },

        /**
         * 输入框的粘贴
         */
        inputContent_paste: function(e) {
            var self = this;
            var isImage = false;
            if (e.clipboardData && e.clipboardData.items.length > 0) {
                // 1.上传图片
                for (var i = 0; i < e.clipboardData.items.length; i++) {
                    var item = e.clipboardData.items[i];
                    if (item.kind == 'file' && item.type.indexOf('image') >= 0) {
                        // 粘贴板为图片类型
                        var file = item.getAsFile();
                        let formData = new FormData();
                        formData.append('uploadFile', file);
                        this.$http.uploadFile({
                            url: '/upload',
                            params: formData,
                            successCallback: (rs) => {
                                console.log(file);
                                console.log(rs);
                                document.getElementById('common_chat_opr_fileUpload').value = '';
                                this.sendMsg({
                                    contentType: 'image',
                                    fileName: rs.fileName,
                                    fileUrl: rs.fileUrl,
                                    state: 'success'
                                });
                            }
                        });
                        isImage = true;
                    }
                }

                // 2.非图片，粘贴纯文本
                if (!isImage) {
                    e.stopPropagation();
                    e.preventDefault();
                    var str = e.clipboardData.getData('text/plain');
                    // 转化为纯文字
                    var span = document.createElement('span');
                    span.innerHTML = str;
                    var txt = span.innerText;
                    this.setInputDiv(
                        txt
                            .replace(/\n/g, '')
                            .replace(/\r/g, '')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                    );
                }
            }
        },


        /**
         * 文件上传_点击
         */
        fileUpload_click: function(fileType) {
            document.getElementById('common_chat_opr_fileUpload').onchange = this.fileUpload_change;
            document.getElementById('common_chat_opr_fileUpload').click();
        },

        /**
         * 文件上传_选中文件
         */
        fileUpload_change: function(e) {
            const files = e.target.files;
            let postFiles = Array.prototype.slice.call(files);
            postFiles = postFiles.slice(0, 1);
            
            
            var fileNameIndex = document.getElementById('common_chat_opr_fileUpload').value.lastIndexOf('\\') + 1;
            var fileName = document.getElementById('common_chat_opr_fileUpload').value.substr(fileNameIndex);
            var extend = fileName.substring(fileName.lastIndexOf('.') + 1);
            var ctxType = ['png', 'jpg', 'jpeg', 'gif', 'bmp','ico'].indexOf(extend) >= 0 ? 'IMAGE' : 'FILE';
            var MessageCtx = {id:new Date().getTime(),suffix:extend,name:fileName,rUid:""};
            var base64Str = base64Utils.encode(JSON.stringify(MessageCtx));            

            this.Files.push({id:MessageCtx.id,type:ctxType,File:postFiles[0],FileName:fileName,Extend:extend});
            
            //console.log("fileName:"+ fileName+",extend:"+extend);
            this.$emit('sendMessageCtx',"msgctx://"+ctxType+"/"+base64Str);
            // 1.判断有效
            // 1)大小
            // if (document.getElementById('common_chat_opr_fileUpload').files[0].size >= 1000 * 1000 * 10) {
            //     this.$ak.Msg.toast('文件大小不能超过10M', 'error');
            //     document.getElementById('common_chat_opr_fileUpload').value = '';
            //     return false;
            // }

            // 2.文件上传
            // let formData = new FormData();
            // formData.append('uploadFile', document.getElementById('common_chat_opr_fileUpload').files[0]);
            // this.$http.uploadFile({
            //     url: '/upload',
            //     params: formData,
            //     successCallback: (rs) => {
            //         console.log(rs);
            //         document.getElementById('common_chat_opr_fileUpload').value = '';
            //         this.sendMsg({
            //             contentType: ['png', 'jpg', 'jpeg', 'gif', 'bmp'].indexOf(extend) >= 0 ? 'image' : 'file',
            //             fileName: fileName,
            //             fileUrl: rs.fileUrl,
            //             state: 'success'
            //         });
            //     }
            // });
        },

        
        
        /**
         * qqemoji选中表情
         */
        qqemoji_selectFace: function(rs) {
            //console.log(rs.imgStr);
            var imgStr = rs.imgStr;
            this.setInputDiv(imgStr);
            
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
         * 设置输入内容
         * 根据input输入框innerHTML转换为纯文本
         */
        setInputContentByDiv: function() {
            var self = this;
            var htmlStr = document.getElementById('common_chat_input').innerHTML;
            console.log(htmlStr);
            // 1.转换表情为纯文本：<img textanme="[笑]"/> => [笑]
            var tmpInputContent = htmlStr.replace(/<img.+text=\"(.+?)\".+>/g, '[$1]').replace(/<.+?>/g, '');

            // 2.设置最长长度
            if (tmpInputContent.length > 500) {
                document.getElementById('common_chat_input').innerHTML = '';
                var value = tmpInputContent.substr(0, 499).replace(/\[(.+?)\]/g, function(item, value) {
                    return self.$refs.qqemoji.getImgByFaceName(value);
                });
                this.setInputDiv(value);
            }

            // 3.修改store
            //this.chatInfoEn.inputContent = tmpInputContent;
        },

        /**
         * 设置input输入框内容
         * @param {String} vlaue 设置的值
         */
        setInputDiv: function(value) {
            //console.log(value);
            if (this.$data.selectionRange == null) {
                console.log("if1");
                document.getElementById('common_chat_input').focus();
                return;
            }
            // 1.设置selectionRange
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(this.$data.selectionRange);
                console.log("if2");
            } else {
                this.$data.selectionRange && this.$data.selectionRange.select();
                console.log("if3");
            }

            // 2.表情转换为img
            value = this.getqqemojiEmoji(value);
            console.log(value);
            // 3.填充内容
            var sel, range;
            if (window.getSelection) {
                // IE9 and non-IE
                console.log("CHROME");
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();

                    var elemnet;
                    if (range.createContextualFragment) elemnet = range.createContextualFragment(value);
                    else {
                        var o = document.createElement('div');
                        o.innerHTML = value;
                        elemnet = document.createDocumentFragment();
                        for (var r, c; (r = o.firstChild); ) c = elemnet.appendChild(r);
                    }
                    var lastNode = elemnet.lastChild;
                    range.insertNode(elemnet);
                    range.setStartAfter(lastNode);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            } else if (document.selection && document.selection.type != 'Control') {
                // IE < 9
                document.selection.createRange().pasteHTML(imgStr);
            }

            // 4.修改inputContent
            this.setInputContentByDiv();
        },

        /**
         * 转换为QQ表情
         */
        getqqemojiEmoji: function(value) {
            if (value == undefined) {
                return;
            }
            var self = this;
            return value.replace(/\[(.+?)\]/g, function(item, value) {
                return self.$refs.qqemoji.getImgByFaceName(value);
            });
        },

        getFocus:function(){
            //console.log("getFocus");
            document.getElementById('common_chat_input').innerHTML='';
            document.getElementById('common_chat_input').focus();
        },

        
    }
};
</script>

<style>
.iconfont {
    font-family: iconfont!important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.ul li
{
    height: 30px;width: 30px;line-height: 30px;margin-right: 10px;text-align: center;margin:0;padding:0; display:inline-block;
}

.icon-face:before {
    content: "\E6AE";
}

.icon-cut:before {
    content: "\E63C";
}
.icon-file:before {
    content: "\E64C";
}

.opr-wrapper {
                height: 0px;
                padding: 0px 0px 0px 10px;
                text-align: left;
}
               .opr-wrapper > .item {
                    margin-right: 12px;
                    float: left;
                    font-weight: normal;
                    text-decoration: blink;
               }
                    .opr-wrapper > .item  > .iconfont {
                        color: #aaa;
                        font-size: 20px;
                    }
                

</style>


