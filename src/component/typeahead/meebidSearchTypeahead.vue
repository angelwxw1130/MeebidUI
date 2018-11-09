<template>
  <div>
    <slot>
      <input data-role="input" class="form-control" type="text" placeholder="Type to search...">
    </slot>
    <meebid-dropdown ref="dropdown"
              v-model="openDropdown"
              :append-to-body="appendToBody"
              :not-close-elements="elements"
              :position-element="inputEl">
      <template slot="dropdown">
        <li v-show="isLoading"><meebid-busy-indicator size="Medium" ref="typeaheadBusyIndicator"></meebid-busy-indicator></li>
        <li v-for="(item, index) in wordItems">
          <a href="javascript:void(0)" @click="selectWord(item)">
            <span class="meebidPaddingLeftSmall meebidHeaderLotLabel" >{{item}}</span>
          </a>
        </li>
        <li v-if="categoryItems.length > 0">
          <span style="font-size: 10px; font-weight: bolder; padding-left: 15px; color: #444">Category</span>
        </li>
        <li v-for="(item, index) in categoryItems">
          <a href="javascript:void(0)" @click="selectCategory(item)">
            <div class="meebidPaddingLeftSmall meebidHeaderCategoryImageWrapper">
              <img class="meebidHeaderCategoryImage" :src="item.imgUrl">
            </div>
            <span class="meebidPaddingLeftSmall meebidHeaderCategoryLabel">{{item.name}}</span>
          </a>
        </li>
        <li v-if="houseItems.length > 0">
          <span style="font-size: 10px; font-weight: bolder; padding-left: 15px; color: #444">Auction House</span>
        </li>
        <li v-for="(item, index) in houseItems">
          <a href="javascript:void(0)" @click="selectHouse(item)">
            <div class="meebidPaddingLeftSmall meebidHeaderHouseImageWrapper">
              <img class="meebidHeaderHouseImage" :src="item.bLogoUrl">
            </div>
            <div class="meebidPaddingLeftSmall meebidHeaderAuctionHouseDetailWrapper">
              <span class="meebidHeaderAuctionHouseNameLabel">{{item.name}}</span>
              <span class="meebidHeaderAuctionHouseWebsiteLabel">{{item.website}}</span>
            </div>
          </a>
        </li>
        <li v-show="noResult"><div class="noResult">No Data</div></li>
      </template>
      
    </meebid-dropdown>
  </div>
</template>

<script>
  import httpUtils from './../../utils/httpUtils'
  import domUtils from './../../utils/domUtils'
  import Dropdown from './../dropdown/meebidDropdown.vue'
  import Typeahead from './../typeahead/meebidTypeahead.vue'

  export default {
    extends: Typeahead,
    name: 'meebid-search-typeahead',
    data () {
      return {
        isLoading: true,
        noResult: false,
        wordItems: [],
        categoryItems: [],
        houseItems: []
      }
    },
    methods: {
      prepareItems (data) {
        this.$refs.typeaheadBusyIndicator.hide();
        /*if (data && data.length){
          this.$children[0].$children[0].active = false;
        }*/
        this.wordItems = []
        this.categoryItems = []
        this.houseItems = []
        //this.activeIndex = 0
        if (data.words && data.words.length){
          for (var i = 0; i < data.words.length && i <= 4; i++){
            this.wordItems.push(data.words[i]);
          }          
        }
        if (data.categorys.items && data.categorys.items.length){
          for (var i = 0; i < data.categorys.items.length && i <= 2; i++){
            this.categoryItems.push(data.categorys.items[i]);
          }
        }
        if (data.houses.items && data.houses.items.length){
          for (var i = 0; i < data.houses.items.length && i <= 2; i++){
            this.houseItems.push(data.houses.items[i]);
          }
        }
        
      },
      inputKeyPressed (event) {
        var value = this.inputEl.value;
        switch (event.keyCode) {
          case 13:
            this.$emit('search', value)
            this.openDropdown = false
            break
        }
      },
      /*prepareItems () {
        this.items = []
        this.activeIndex = 0
        for (let i = 0, l = 10; i < l; i++) {
          if (i < 7){
            let item = {
              isCharacter: true,
              key: "Clock" + i
            }
            this.items.push(item)
          } else {
            let item = {
              isHouse: true,
              houseName: "House " + i,
              imageUrl: "./../static/user" + i + ".jpg"
            }
            this.items.push(item)
          }
        }
      },*/
      inputFocused () {
        /*
        if (this.openOnFocus) {
          let value = this.inputEl.value
          this.openDropdown = true;
          this.$children[0].$children[0].active = true;
          this.fetchItems(value, 0)
        }
        */
      },
      inputChanged () {
        var value = this.inputEl.value;
        this.wordItems = []
        this.categoryItems = []
        this.houseItems = []
        this.openDropdown = true;
        //this.$children[0].$children[0].active = true;
        this.$refs.typeaheadBusyIndicator.show();
        this.fetchItems(value, this.debounce);
        this.$emit('input', this.forceSelect ? null : value);
        
      },
      selectWord(item) {
        this.$emit('search', item);
        this.openDropdown = false;
      },
      selectCategory(item){
        this.$emit('selectCategory', item.id);
        this.openDropdown = false;
      },
      selectHouse(item){
        window.location.href = window.location.origin + "/auctionHouseDetail.html?" + window.btoa("auctionHouseId=" + item.houseId);
      }
    }
  }
</script>
