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
        <slot name="item" :items="items" :select="selectItem" :highlight="highlight">
          <li ref="typeaheadBusyIndicator" v-show="isLoading"><meebid-busy-indicator size="Medium"></meebid-busy-indicator></li>
          <li v-for="(item, index) in items" class="meebidSearchTypeaheadOptionItem">
            <a href="javascript:void(0)" @click="select(item)">
              <div>
                <img width="36px" height="36px" :src="item.avatar_url"> 
                <span style="padding-left: 10px;">{{item.login}}</span>
              </div>
            </a>
          </li>
          <li v-show="noResult"><div class="noResult">No Data</div></li>
        </slot>
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
      }
    },
    methods: {
      prepareItems (data) {
        if (data && data.length){
          this.$children[0].$children[0].active = false;
        }
        this.items = []
        //this.activeIndex = 0
        for (let i = 0, l = data.length; i < l; i++) {
          let item = data[i]
          let key = this.itemKey ? item[this.itemKey] : item
          key = key.toString()
          let index = -1
          if (this.ignoreCase) {
            index = key.toLowerCase().indexOf(this.inputEl.value.toLowerCase())
          } else {
            index = key.indexOf(this.inputEl.value)
          }
          if (this.matchStart ? index === 0 : index >= 0) {
            this.items.push(item)
          }
          if (this.items.length >= this.limit) {
            break
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
        /*var value = this.inputEl.value;
        this.items = [];
        this.openDropdown = true;
        this.$children[0].$children[0].active = true;
        this.fetchItems(value, this.debounce);
        this.$emit('input', this.forceSelect ? null : value);
        */
      }
    }
  }
</script>
