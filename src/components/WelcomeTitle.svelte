<script lang="ts">
	export let name: string;
</script>

<h1>Willkommen, {name}.</h1>

<style lang="scss">
	h1 {
		font-size: 5em;
		font-weight: 300;
		@media (max-width: 768px) {
			font-size: 4em;
		}
	}
</style>
