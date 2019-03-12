<template>
    <div class="text" style="height: 120px;border-top: solid 1px #ddd;">
        <!-- 表情、文件选择等操作 -->
                    <div class="opr-wrapper">
                        <common-chat-emoji class="item" ref="qqemoji" @select="qqemoji_selectFace"></common-chat-emoji>
                        <a class="item" href="javascript:void(0)" @click="fileUpload_click('file')">
                            <!--<i class="iconfont glyphicon glyphicon-folder-open"></i>-->
                            <span class='glyphicon glyphicon-folder-open'></span>
                        </a>
                        <form method="post" enctype="multipart/form-data">
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
            content: ''
        };
    },
    methods: {
        onKeyup (e) {
            if (e.keyCode === 13 && this.content.length) {
                this.$emit('sendMessage',this.content)
                //this.sendMessage(this.content);
                this.content = '';
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
            var fileNameIndex = document.getElementById('common_chat_opr_fileUpload').value.lastIndexOf('\\') + 1;
            var fileName = document.getElementById('common_chat_opr_fileUpload').value.substr(fileNameIndex);
            var extend = fileName.substring(fileName.lastIndexOf('.') + 1);
            // 1.判断有效
            // 1)大小
            if (document.getElementById('common_chat_opr_fileUpload').files[0].size >= 1000 * 1000 * 10) {
                this.$ak.Msg.toast('文件大小不能超过10M', 'error');
                document.getElementById('common_chat_opr_fileUpload').value = '';
                return false;
            }

            // 2.文件上传
            let formData = new FormData();
            formData.append('uploadFile', document.getElementById('common_chat_opr_fileUpload').files[0]);
            this.$http.uploadFile({
                url: '/upload',
                params: formData,
                successCallback: (rs) => {
                    console.log(rs);
                    document.getElementById('common_chat_opr_fileUpload').value = '';
                    this.sendMsg({
                        contentType: ['png', 'jpg', 'jpeg', 'gif', 'bmp'].indexOf(extend) >= 0 ? 'image' : 'file',
                        fileName: fileName,
                        fileUrl: rs.fileUrl,
                        state: 'success'
                    });
                }
            });
        },

        /**
         * qqemoji选中表情
         */
        qqemoji_selectFace: function(rs) {
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
            if (this.$data.selectionRange == null) {
                document.getElementById('common_chat_input').focus();
                return;
            }
            // 1.设置selectionRange
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(this.$data.selectionRange);
            } else {
                this.$data.selectionRange && this.$data.selectionRange.select();
            }

            // 2.表情转换为img
            value = this.getqqemojiEmoji(value);

            // 3.填充内容
            var sel, range;
            if (window.getSelection) {
                // IE9 and non-IE
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
                height: 20px;
                padding: 10px;
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


