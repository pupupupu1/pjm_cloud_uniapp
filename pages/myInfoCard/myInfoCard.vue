<template>
	<view>
		<infoCard></infoCard>
	</view>
</template>

<script>
	import infoCard from '../../components/infoCard/infoCard.vue'

export default {
	components: {
		infoCard:infoCard
	},
	computed: {
	},
	data() {
		return {

		};
	},
	onLoad() {
		
	},
	methods: {
		
	}
};
</script>

<style>
/**点击反馈**/
.cell-hover-class {
	opacity: 0.5;
}
</style>
