<script lang="ts">
	import type { Scene } from '../screen';

	export let scenes: Scene[] = [];

	export let selected = 1;
</script>

<div class="tabs">
	{#each scenes as scene, i}
		<input type="radio" name="tabs" id={scene.name} bind:group={selected} value={i} />
		<label for={scene.name}>{scene.name}</label>
	{/each}
</div>

<style lang="scss">
	.tabs {
		input {
			display: none;

			&:checked + label {
				/* font-weight: bold; */
				color: #000;
				background: rgba(255, 255, 255, 0.5);
			}
		}
		label {
			display: inline-block;
			font-size: 0.9rem;
			color: rgba(255, 255, 255, 0.7);
			margin: 0;
			cursor: pointer;
			padding: 5px 13px;
			background: rgba(255, 255, 255, 0.1);
			backdrop-filter: blur(5px);
		}
	}
</style>
