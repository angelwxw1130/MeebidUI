webpackJsonp([3],{10:function(e,t,o){"use strict";var n=o(8);t.a={name:"meebid-dropdown",render:function(e){return e(this.tag,{class:{dropdown:!this.dropup,dropup:this.dropup,open:this.show}},[this.$slots.default,e("ul",{class:{"dropdown-menu":!0,"dropdown-menu-right":this.menuRight},ref:"dropdown"},[this.$slots.dropdown])])},props:{tag:{type:String,default:"div"},appendToBody:{type:Boolean,default:!1},value:{type:Boolean},dropup:{type:Boolean,default:!1},menuRight:{type:Boolean,default:!1},notCloseElements:{type:Array},positionElement:{}},data:function(){return{show:!1,triggerEl:void 0}},watch:{value:function(e){this.toggle(e)}},mounted:function(){this.triggerEl=this.$el.querySelector('[data-role="trigger"]'),this.triggerEl&&n.a.on(this.triggerEl,n.a.events.CLICK,this.toggle),n.a.on(window,n.a.events.CLICK,this.windowClicked),this.value&&this.toggle(!0)},beforeDestroy:function(){this.removeDropdownFromBody(),this.triggerEl&&n.a.off(this.triggerEl,n.a.events.CLICK,this.toggle),n.a.off(window,n.a.events.CLICK,this.windowClicked)},methods:{toggle:function(e){this.show="boolean"==typeof e?e:!this.show,this.appendToBody&&(e?this.appendDropdownToBody():this.removeDropdownFromBody()),this.$emit("input",this.show)},windowClicked:function(e){var t=e.target;if(this.show&&t){var o=!1;if(this.notCloseElements)for(var n=0,i=this.notCloseElements.length;n<i;n++)if(this.notCloseElements[n].contains(t)){o=!0;break}var l=this.$refs.dropdown.contains(t);this.$el.contains(t)&&!l||o||this.toggle(!1)}},appendDropdownToBody:function(){try{var e=this.$refs.dropdown;e.style.display="block",document.body.appendChild(e);var t=this.positionElement||this.$el;n.a.setDropdownPosition(e,t,this)}catch(e){}},removeDropdownFromBody:function(){try{var e=this.$refs.dropdown;e.removeAttribute("style"),this.$el.appendChild(e)}catch(e){}}}}},113:function(e,t,o){"use strict";var n=o(14),i=o.n(n),l=o(3),a=o.n(l),s=o(11),r=o(41);t.a={data:function(){return{loading:!1,loadingText:"We are validating your account, please wait...",validateionForm:{code:""},loginUser:s.a.getLoginUser()}},mounted:function(){console.log("Email Validateion Page Ready"),this.loading=!0;var e=(window.location.search,r.a.getUrlParameter("code"));a.a.ajax({url:"/api/user/activate",type:"POST",data:i()({code:e}),context:this,contentType:"application/json",success:function(e){if("1"==e.code){var t=new Date;t.setTime(t.getTime()+1e3*e.content.expiredAt),s.a.setLoginUser({expireTime:t.getTime(),token:e.content.token}),this.loadingText="Validation Successful, will redirect to Home page in 3 seconds",setTimeout(function(){window.location.href="./home.html"},3e3)}else this.loading=!1,this.$notify.error({title:"Failure",message:"Validation failure, please check your validation url.",duration:5e3})},error:function(e){this.validateionForm.code="",this.$notify.error({title:"Failed",message:"Validation failure, please check your validation url.",duration:5e3})},dataType:"json"})},methods:{onValidate:function(){},redirectToHome:function(){window.location.href="./home.html"}}}},238:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o(2),i=o(7),l=o.n(i),a=o(3),s=(o.n(a),o(26)),r=(o.n(s),o(27)),d=(o.n(r),o(28)),c=(o.n(d),o(29)),h=(o.n(c),o(31)),u=o(9),p=o(32),m=o(239),f=o(6);n.default.use(l.a),n.default.component(h.a.name,h.a),n.default.component(u.a.name,u.a),n.default.component(p.a.name,p.a);new n.default({el:"#app",i18n:f.a,render:function(e){return e(m.a)}})},239:function(e,t,o){"use strict";function n(e){o(240)}var i=o(113),l=o(242),a=o(0),s=n,r=a(i.a,l.a,!1,s,null,null);t.a=r.exports},240:function(e,t,o){var n=o(241);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);o(12)("6bf8fc50",n,!0)},241:function(e,t,o){t=e.exports=o(5)(!1),t.push([e.i,"body,html{margin:0}#app,body,html{height:100%}",""])},242:function(e,t,o){"use strict";var n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"meebid",attrs:{id:"app"}},[o("div",{staticClass:"meebidAdminHeader",attrs:{id:"header"}},[o("div",{staticClass:"meebidHeaderButtonToolbar"},[o("meebid-button",{attrs:{"wrapper-cls":"homeWrapper","button-type":"round",text:"Home","button-click":e.redirectToHome}})],1)]),e._v(" "),o("div",{staticClass:"meebidAdminContentWrapper",attrs:{id:"content"}},[o("el-container",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"meebidValidationPageContainer meebidPaddingTopMedium",attrs:{"element-loading-text":e.loadingText,"element-loading-spinner":"el-icon-loading"}},[o("el-main")],1)],1)])},i=[],l={render:n,staticRenderFns:i};t.a=l},41:function(e,t,o){"use strict";t.a={getUrlParameter:function(e){return decodeURIComponent((new RegExp("[?|&]"+e+"=([^&;]+?)(&|#|;|$)").exec(window.location.search)||[null,""])[1].replace(/\+/g,"%20"))||null}}},8:function(e,t,o){"use strict";var n={MOUSE_ENTER:"mouseenter",MOUSE_LEAVE:"mouseleave",FOCUS:"focus",BLUR:"blur",CLICK:"click",INPUT:"input",KEY_DOWN:"keydown",KEY_UP:"keyup",KEY_PRESS:"keypress"},i={CLICK:"click",HOVER:"hover",FOCUS:"focus",HOVER_FOCUS:"hover-focus",OUTSIDE_CLICK:"outside-click",MANUAL:"manual"},l={TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},a=function(){return{width:Math.max(document.documentElement.clientWidth,window.innerWidth||0),height:Math.max(document.documentElement.clientHeight,window.innerHeight||0)}},s=null,r=null,d=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=a();if(null!==s&&!e&&t.height===r.height&&t.width===r.width)return s;if("loading"===document.readyState)return null;var o=document.createElement("div"),n=document.createElement("div");return o.style.width=n.style.width=o.style.height=n.style.height="100px",o.style.overflow="scroll",n.style.overflow="hidden",document.body.appendChild(o),document.body.appendChild(n),s=Math.abs(o.scrollHeight-n.scrollHeight),document.body.removeChild(o),document.body.removeChild(n),r=t,s};t.a={events:n,triggers:i,placements:l,on:function(e,t,o){e.addEventListener(t,o)},off:function(e,t,o){e.removeEventListener(t,o)},removeFromDom:function(e){try{e.parentNode.removeChild(e)}catch(e){}},ensureElementMatchesFunction:function(){Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(e){for(var t=(this.document||this.ownerDocument).querySelectorAll(e),o=t.length;--o>=0&&t.item(o)!==this;);return o>-1})},addClass:function(e,t){if(e.className){var o=e.className.split(" ");o.indexOf(t)<0&&(o.push(t),e.className=o.join(" "))}else e.className=t},removeClass:function(e,t){if(e.className){for(var o=e.className.split(" "),n=[],i=0,l=o.length;i<l;i++)o[i]!==t&&n.push(o[i]);e.className=n.join(" ")}},hasClass:function(e,t){for(var o=e.className.split(" "),n=0,i=o.length;n<i;n++)if(o[n]===t)return!0;return!1},setDropdownPosition:function(e,t){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=document.documentElement,i=(window.pageXOffset||n.scrollLeft)-(n.clientLeft||0),l=(window.pageYOffset||n.scrollTop)-(n.clientTop||0),a=t.getBoundingClientRect(),s=e.getBoundingClientRect();e.style.right="auto",e.style.bottom="auto",o.menuRight?e.style.left=i+a.left+a.width-s.width+"px":e.style.left=i+a.left+"px",o.dropup?e.style.top=l+a.top-s.height-4+"px":e.style.top=l+a.top+a.height+"px"},isAvailableAtPosition:function(e,t,o){var n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),s=a(),r=void 0;switch(o){case l.TOP:r=n.top>=i.height;break;case l.RIGHT:var d=n.right+i.width<=s.width,c=n.top+n.height/2>=i.height/2;r=d&&c;break;case l.BOTTOM:r=n.bottom+i.height<=s.height;break;case l.LEFT:var h=n.left-i.width>=0,u=n.top+n.height/2>=i.height/2;r=h&&u}return r},setTooltipPosition:function(e,t,o,n,i){var a=void 0,s=void 0,r=void 0;if(void 0===i||"body"===i){a=document.body;var d=document.documentElement;r=(window.pageXOffset||d.scrollLeft)-(d.clientLeft||0),s=(window.pageYOffset||d.scrollTop)-(d.clientTop||0)}else a=document.querySelector(i),r=a.scrollLeft,s=a.scrollTop;if(n){var c=[l.TOP,l.RIGHT,l.BOTTOM,l.LEFT];if(!this.isAvailableAtPosition(t,e,o))for(var h=0,u=c.length;h<u;h++){for(var p=0;p<u;p++)this.removeClass(e,c[p]);if(this.addClass(e,c[h]),this.isAvailableAtPosition(t,e,c[h])){o=c[h];break}}}var m=t.getBoundingClientRect(),f=e.getBoundingClientRect();o===l.BOTTOM?(e.style.top=s+m.top+m.height+"px",e.style.left=r+m.left+m.width/2-f.width/2+"px"):o===l.LEFT?(e.style.top=s+m.top+m.height/2-f.height/2+"px",e.style.left=r+m.left-f.width+"px"):o===l.RIGHT?(e.style.top=s+m.top+m.height/2-f.height/2+"px",e.style.left=r+m.left+m.width+"px"):(e.style.top=s+m.top-f.height+"px",e.style.left=r+m.left+m.width/2-f.width/2+"px")},hasScrollbar:function(e){return e.scrollHeight>e.clientHeight},toggleBodyOverflow:function(e){e?document.body.style.paddingRight=null:this.hasScrollbar(document.documentElement)&&(document.body.style.paddingRight=d()+"px")}}},9:function(e,t,o){"use strict";var n=o(10),i=o(0),l=i(n.a,null,!1,null,null,null);t.a=l.exports}},[238]);
//# sourceMappingURL=emailValidation.js.map?9a9bbaf02a0920a0da29