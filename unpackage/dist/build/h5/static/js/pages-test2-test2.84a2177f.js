(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-test2-test2"],{"07ba":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=n("2f62"),u={computed:(0,r.mapState)(["accessToken"]),data:function(){return{url:"rtmp://39.105.78.171:7777/rtmplive/f9a5ae91a27e4efcb47b960f5705b42e",enableCamera:!1,context:null}},onReady:function(){this.url=this.url+this.accessToken,console.log(this.url)}};e.default=u},"51bf":function(t,e,n){"use strict";n.r(e);var r=n("07ba"),u=n.n(r);for(var a in r)"default"!==a&&function(t){n.d(e,t,(function(){return r[t]}))}(a);e["default"]=u.a},e92b:function(t,e,n){"use strict";var r;n.d(e,"b",(function(){return u})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return r}));var u=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",[n("v-uni-video",{staticStyle:{width:"100vw",height:"400rpx"},attrs:{src:t.url,autoplay:!0,controls:!0}})],1)},a=[]},fa64:function(t,e,n){"use strict";n.r(e);var r=n("e92b"),u=n("51bf");for(var a in u)"default"!==a&&function(t){n.d(e,t,(function(){return u[t]}))}(a);var c,i=n("f0c5"),o=Object(i["a"])(u["default"],r["b"],r["c"],!1,null,"5318deb9",null,!1,r["a"],c);e["default"]=o.exports}}]);