(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-myNearby-myNearby"],{"0ac9":function(t,e,n){"use strict";n.r(e);var o=n("e633"),a=n.n(o);for(var i in o)"default"!==i&&function(t){n.d(e,t,(function(){return o[t]}))}(i);e["default"]=a.a},"57a8":function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return i})),n.d(e,"a",(function(){return o}));var o={uCellGroup:n("527a").default,uCellItem:n("f271").default,avatar:n("3c0c").default},a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",[n("v-uni-view",t._l(t.nearByPeopleList,(function(e){return n("u-cell-group",{key:e.content.name},[n("u-cell-item",{attrs:{arrow:!1,"use-label-slot":!0,"hover-class":"cell-hover-class"},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.togoUInfoCard(e.content.name)}}},[n("v-uni-view",{staticStyle:{position:"relative",top:"10rpx",width:"100rpx"},attrs:{slot:"icon"},slot:"icon"},[n("avatar",{attrs:{size:"80",mode:"square"}})],1),[n("v-uni-view",{staticStyle:{"font-size":"35rpx"},attrs:{slot:"title"},slot:"title"},[t._v(t._s(e.content.name))]),n("v-uni-view",{staticStyle:{"font-size":"26rpx"},attrs:{slot:"label"},slot:"label"},[t._v(t._s(t._f("strSub")(e.content.address)))]),n("v-uni-view",{attrs:{slot:"right-icon"},slot:"right-icon"},[[t._v("距离"+t._s(e.distance.value)+"米")]],2)]],2)],1)})),1)],1)},i=[]},e46d:function(t,e,n){"use strict";n.r(e);var o=n("57a8"),a=n("0ac9");for(var i in a)"default"!==i&&function(t){n.d(e,t,(function(){return a[t]}))}(i);var r,u=n("f0c5"),c=Object(u["a"])(a["default"],o["b"],o["c"],!1,null,"513535c9",null,!1,o["a"],r);e["default"]=c.exports},e633:function(t,e,n){"use strict";var o=n("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=o(n("7ef4")),i=o(n("312b")),r={data:function(){return{nearByPeopleList:[]}},methods:{getLocationPeopleList:function(){var t=this;uni.getLocation({type:"wgs84",geocode:!0,success:function(e){console.log(e);var n=[e.longitude,e.latitude];a.default.getNearbyPeopleByLoc(n).then((function(e){t.nearByPeopleList=e.data}))},fail:function(){uni.showToast({title:"获取地址失败",icon:"none"})}})},togoUInfoCard:function(t){i.default.navigateTo("../otherInfoCard/otherInfoCard?userAccount="+t)}},onLoad:function(){this.getLocationPeopleList()}};e.default=r}}]);