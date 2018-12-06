<template>
    <div class="meebidcard" style="padding: 12px; border-bottom: solid 1px #24272C;">
        <header>
            <img class="avatar" style="width:40px; height:40px;vertical-align: middle;border-radius: 2px;"  :alt="firstName" :src="headPortrait">
            <p class="name" style ="vertical-align: middle; display: inline-block; margin: 0 0 0 15px; font-size: 16px;">{{firstName}}</p>
        </header>
        <footer style="margin-top: 10px;">
            <!--<input class="search" style="padding: 0 10px; width: 100%; font-size: 12px; color: #fff; height: 30px; line-height: 30px; border: solid 1px #3a3a3a; border-radius: 4px; outline: none; background-color: #26292E;" type="text" placeholder="search user..." >-->
        </footer>
        <!--<div style="position: relative; width: 100%; height: 80px;" :style="{transform: busyIndicatorPosition}">
        <meebid-busy-indicator ref="auctionListItemsBusyIndicator" transparency="true" size="Medium"></meebid-busy-indicator>
        </div>-->
    </div>
</template>

<script>
import loginUtils from './../../utils/loginUtils'
import errorUtils from './../../utils/errorUtils'
import $ from 'jquery'

export default {
    name:'meebidcard',
    props: {
      headPortrait: {
        type: String,
        default: ""
      },
      firstName: {
        type: String,
        default: ""
      },
    },
    data(){
        return{
            
        }
    },
    
    mounted(){
        
    },
    methods: {
        onKeyup (e) {
            this.search(e.target.value);
        }
    }
};
</script>


