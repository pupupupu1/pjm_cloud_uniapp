<template>
	<view>
		<button @click="doJob">doJob</button>
		<button @click="deleteAll">deleteAll</button>
	</view>
</template>

<script>
import * as sqllite from '../../util/sqllite.js';
export default {
	data() {
		return {};
	},
	methods: {
		deleteAll() {
			sqllite.executeSql('delete from messageList').then(res => {
				console.log(res);
			});
		},
		doJob() {
			console.log(sqllite.isOpen());
			sqllite.executeSql('select * from messageList').then(res => {
				console.log(res);
			});
			console.log('sqlliteJob');
		}
	}
};
</script>

<style></style>
