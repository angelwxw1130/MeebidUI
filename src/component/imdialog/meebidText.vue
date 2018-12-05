<template>
    <div class="text" style="height: 100px;border-top: solid 1px #ddd;">
        <textarea placeholder="按 Enter 发送" v-model="content" @keyup="onKeyup" style="padding: 10px;
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
import $ from 'jquery'

export default {
    name:'meebidtext',
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
        }
    }
};
</script>



