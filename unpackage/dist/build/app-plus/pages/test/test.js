!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=15)}([function(t,e){t.exports={"@VERSION":2}},function(t,e,n){"use strict";function r(t,e,n,r,o,i,u,s,a,c){var l,f="function"==typeof t?t.options:t;if(a){f.components||(f.components={});var p=Object.prototype.hasOwnProperty;for(var d in a)p.call(a,d)&&!p.call(f.components,d)&&(f.components[d]=a[d])}if(c&&((c.beforeCreate||(c.beforeCreate=[])).unshift((function(){this[c.__module]=this})),(f.mixins||(f.mixins=[])).push(c)),e&&(f.render=e,f.staticRenderFns=n,f._compiled=!0),r&&(f.functional=!0),i&&(f._scopeId="data-v-"+i),u?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),o&&o.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(u)},f._ssrRegister=l):o&&(l=s?function(){o.call(this,this.$root.$options.shadowRoot)}:o),l)if(f.functional){f._injectStyles=l;var v=f.render;f.render=function(t,e){return l.call(e),v(t,e)}}else{var _=f.beforeCreate;f.beforeCreate=_?[].concat(_,l):[l]}return{exports:t,options:f}}n.d(e,"a",(function(){return r}))},,function(t,e,n){"use strict";var r=n(9),o=n(6),i=n(1),u=Object(i.a)(o.default,r.b,r.c,!1,null,null,"4db83077",!1,r.a,void 0);e.default=u.exports},,,function(t,e,n){"use strict";var r=n(7),o=n.n(r);e.default=o.a},function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={data:function(){return{url:"rtmp://39.105.78.171:7777/rtmplive/f9a5ae91a27e4efcb47b960f5705b42e",enableCamera:!1,context:null}},onReady:function(){this.context=uni.createLivePusherContext("livePusher",this)},methods:{EnableCamera:function(){this.enableCamera=!0},startLive:function(){this.context.start({success:function(e){t("log","livePusher.start:"+JSON.stringify(e)," at pages/test/test.nvue:28")}})},stopLive:function(){this.context.stop({success:function(e){t("log",JSON.stringify(e)," at pages/test/test.nvue:35")}})}}};e.default=n}).call(this,n(12).default)},,function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){}));var r=function(){var t=this.$createElement,e=this._self._c||t;return e("scroll-view",{staticStyle:{flexDirection:"column"},attrs:{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true"}},[e("view",[e("live-pusher",{attrs:{id:"livePusher",url:this.url,mode:"FHD"}}),e("button",{on:{click:this.startLive}},[this._v("\u5f00\u59cb\u63a8\u6d41\uff08\u5f00\u59cb\u76f4\u64ad\uff09")]),e("button",{on:{click:this.stopLive}},[this._v("\u7ed3\u675f\u63a8\u6d41")])],1)])},o=[]},function(t,e,n){Vue.prototype.__$appStyle__={},Vue.prototype.__merge_style&&Vue.prototype.__merge_style(n(11).default,Vue.prototype.__$appStyle__)},function(t,e,n){"use strict";n.r(e);var r=n(0),o=n.n(r);for(var i in r)"default"!==i&&function(t){n.d(e,t,(function(){return r[t]}))}(i);e.default=o.a},function(t,e,n){"use strict";function r(t){var e=Object.prototype.toString.call(t);return e.substring(8,e.length-1)}function o(){return"string"==typeof __channelId__&&__channelId__}function i(t,e){switch(r(e)){case"Function":return"function() { [native code] }";default:return e}}Object.defineProperty(e,"__esModule",{value:!0}),e.log=function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];console[t].apply(console,n)},e.default=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var u=e.shift();if(o())return e.push(e.pop().replace("at ","uni-app:///")),console[u].apply(console,e);var s=e.map((function(t){var e=Object.prototype.toString.call(t).toLowerCase();if("[object object]"===e||"[object array]"===e)try{t="---BEGIN:JSON---"+JSON.stringify(t,i)+"---END:JSON---"}catch(n){t=e}else if(null===t)t="---NULL---";else if(void 0===t)t="---UNDEFINED---";else{var n=r(t).toUpperCase();t="NUMBER"===n||"BOOLEAN"===n?"---BEGIN:"+n+"---"+t+"---END:"+n+"---":String(t)}return t})),a="";if(s.length>1){var c=s.pop();a=s.join("---COMMA---"),0===c.indexOf(" at ")?a+=c:a+="---COMMA---"+c}else a=s[0];console[u](a)}},,,function(t,e,n){"use strict";n.r(e);n(10);var r=n(3);"undefined"==typeof Promise||Promise.prototype.finally||(Promise.prototype.finally=function(t){var e=this.constructor;return this.then((function(n){return e.resolve(t()).then((function(){return n}))}),(function(n){return e.resolve(t()).then((function(){throw n}))}))}),r.default.mpType="page",r.default.route="pages/test/test",r.default.el="#root",new Vue(r.default)}]);