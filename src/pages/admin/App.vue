<template>
  <div id="app">
    <div id="header" class="meebidHomeHeader">
      <meebid-search-typeahead class="meebidtypeahead"
             async-src="https://api.github.com/search/users?q="
             async-key="items"
             item-key="login"
             :force-select="true">
        <span class="glyphicon glyphicon-search meebidHeaderSearchIcon"></span>
        <input data-role="input" class="form-control" type="text" placeholder="Search">
        <template slot="item" scope="props">
          <li ref="props.typeaheadBusyIndicator"><meebid-busy-indicator size="Medium"></meebid-busy-indicator></li>
          <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
            <a href="javascript:void(0)" @click="props.select(item)">
              <div>
                <img width="36px" height="36px" :src="item.avatar_url"> 
                <span style="padding-left: 10px;">{{item.login}}</span>
              </div>
            </a>
          </li>
          <li v-show="props.noResult"><div class="noResult">No Data</div></li>
        </template>
      </meebid-search-typeahead>
      <div class="meebidHeaderButtonToolbar">
        <meebid-button wrapper-cls="homeWrapper" button-type="round" text="Home">
        </meebid-button>
        <meebid-button icon-type="user" button-type="round" text="Register/Login" :button-click="changeHintMessage">
        </meebid-button>
        <!--<meebid-button icon-type="user" button-type="round" text="User Test" :button-click="changeHintMessage">
        </meebid-button>-->
        
        <meebid-button icon-type="bell" button-type="round" ref="hintButton" data-role="trigger">
        </meebid-button>
        <meebid-button icon-type="menu-hamburger" button-type="round" :button-click="showAlert">
        </meebid-button>
      </div>
    </div>
    <div id="content" class="meebidHomeContent" height="">
      <meebid-homepage-list ref="homePageListContainer">
      </meebid-homepage-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Want something new?'
    }
  },
  mounted() {
    console.log("app ready");
    
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock1.jpg",
      avatarUrl: "./../static/user1.jpg",
      imageProvider: "Carrie Beth",
      imageName: "The big day ❤️",
      description: "Vintage French Clock | home antique clocks antique french…",
      favouriteCount: "729",
      meebidListItemClass: {
        transform: "translateX(0px) translateY(0px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock2.jpg",
      avatarUrl: "./../static/user2.jpg",
      imageProvider: "Here should be Auction",
      imageName: "Auction Item Name",
      description: ".would love to know the orgin of this pic. i bet our resto…",
      favouriteCount: "4.3k",
      meebidListItemClass: {
        transform: "translateX(260px) translateY(0px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock3.jpg",
      avatarUrl: "./../static/user3.jpg",
      imageProvider: "Melinda Earll",
      imageName: "antique French clocks",
      description: "French Porcelain Mounted Ormolu Calendar Mantel Clock by…",
      favouriteCount: "221",
      meebidListItemClass: {
        transform: "translateX(520px) translateY(0px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock4.jpg",
      avatarUrl: "./../static/user4.jpg",
      imageProvider: "Charlene Clouser",
      imageName: "Time pieces",
      description: "Late 18TH CENTURY FRENCH EMPIRE ORMOLU MANTEL CLOCK the dial…",
      favouriteCount: "84",
      meebidListItemClass: {
        transform: "translateX(780px) translateY(0px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock5.jpg",
      avatarUrl: "./../static/user5.jpg",
      imageProvider: "Catheryne Tope",
      imageName: "Baroque Tall Case Clock",
      description: "French Clock from the Baroque Period. This type of clock was…",
      favouriteCount: "513",
      meebidListItemClass: {
        transform: "translateX(1040px) translateY(0px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock6.jpg",
      avatarUrl: "./../static/user6.jpg",
      imageProvider: "Gaia Semerdjyan",
      imageName: "Clocks",
      description: "Eighteenth-Century French Clocks | The Frick Collection",
      favouriteCount: "22",
      meebidListItemClass: {
        transform: "translateX(0px) translateY(560px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock7.jpg",
      avatarUrl: "./../static/user7.jpg",
      imageProvider: "Garrett Bay",
      imageName: "projects",
      description: "Beautiful antique gilt figural clock.",
      favouriteCount: "813",
      meebidListItemClass: {
        transform: "translateX(260px) translateY(507px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock8.jpg",
      avatarUrl: "./../static/user8.jpg",
      imageProvider: "Belinda Vernon",
      imageName: "Victorian",
      description: "AN UNUSUAL 19TH CENTURY FRENCH CHAMPLEVE ENAMEL BRONZE…",
      favouriteCount: "164",
      meebidListItemClass: {
        transform: "translateX(520px) translateY(523px)"
      }
    });
    this.$refs.homePageListContainer.addItem({
      height: "",
      imageUrl: "./../static/clock9.jpg",
      avatarUrl: "./../static/user9.jpg",
      imageProvider: "Ed Clarke",
      imageName: "Lara's Design Inspiration",
      description: "Antique clock French 1800. A modern equivalent would look…",
      favouriteCount: "2.7k",
      meebidListItemClass: {
        transform: "translateX(780px) translateY(469px)"
      }
    });
  },

  methods: {
    startHacking () {
      this.$notify({
        title: 'Shhh',
        message: 'Just be patient...',
        duration: 6000
      })
    },
    changeHintMessage: function(){
      this.$refs.hintButton.hintNumber++;
      
    },
    showAlert : function(){
      /*if (vm1.$refs.busyIndicator.active){
        vm1.$refs.busyIndicator.hide()
      } else {
        vm1.$refs.busyIndicator.show()
      }*/
      
      //this.$set('alertIsOpen',true);
    }
  }
}
/**
    <popover title="Notification">
      <meebid-button icon-type="bell" button-type="round" ref="hintButton" data-role="trigger">
      </meebid-button>
      <div slot="popover">
        <h5 >Test Notification</h5>
      </div>
    </popover>
    */
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
