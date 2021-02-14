import Vue from 'vue'
import App from './App'

import store from './store'

import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false

Vue.prototype.$store = store


Vue.filter("formatDate",(value)=>{
	var date = new Date();
	date.setTime(value);
	var month = date.getMonth() + 1;
	var hours = date.getHours();
	if (hours < 10)
	    hours = "0" + hours;
	var minutes = date.getMinutes();
	if (minutes < 10)
	    minutes = "0" + minutes;
	var now =new Date()
	if(date.getFullYear()==now.getFullYear()){
		var time =  month + "-" + date.getDate() +
		    " " + hours + ":" + minutes;
		return time;	
	}
	var time = date.getFullYear() + "-" + month + "-" + date.getDate() +
	    " " + hours + ":" + minutes;
	return time;	
})
Vue.filter("strSub",(str)=>{
	if(str.length>13){
		return str.slice(0,13)+'...'
	}else{
		return str
	}
})

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
