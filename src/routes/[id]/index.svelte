<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { ChainReference } from 'socketdb/browser';
import type { WidgetConfig } from 'src/widget';
	import { onMount } from 'svelte';
	import yaml from 'yaml';
	import Button from '../../components/Button.svelte';
	import { exampleWidgets } from '../../examples/widgets';
	import type { Scene, ScreenConfiguration } from '../../screen';

	export async function load({ page }: LoadInput): Promise<LoadOutput> {
		// get the id of the screen (the last part of the url)
		const id = page.params['id'];
		return {
			status: 200,
			props: { id }
		};
	}
</script>

<script lang="ts">
	/**
	 * page for configuring a screen
	 * id, being the id of the screen that is going to be configured
	 *
	 * url: /[id]/
	 *
	 * NOTE: when we get the id from a qr code; this page can be moved into the root directory (routes/index.svelte)
	 * as we do not need the id to be apparent in the url
	 */

	export let id: string;

	// socketdb store, for synchonizing the screen configuration with the server
	let store: ChainReference = null;

	let screen: ScreenConfiguration = null;

	let selectedScene = 0;
	let shown = false;
	let configValue = '';
	$:{
		configValue = loadScene(selectedScene)
	} 

	onMount(async () => {
		// we need to dynamically load this module on mount, because we cannot load it on the server side
		const { SocketDBClient } = await import('socketdb/browser');
		const db = SocketDBClient({ url: `ws://localhost:8080` });
		store = db.get(id);

		return store.on((data: Partial<ScreenConfiguration>) => {
			// merge changes from the server with the local state whenever someone updates it
			if (data) {
				screen = { ...screen, ...data };
				configValue = loadScene(selectedScene)
			}
		});
	});

	function parseConfiguration(yamlString: string): Scene {
		return yaml.parse(yamlString);
	}
	function save() {
		screen.scenes[selectedScene] = parseConfiguration(configValue)
		store.set(screen)

	}
	function loadScene(scene) {
		return screen?.scenes ? stringifyConfiguration(screen.scenes[scene]): 'loading';
	}

	function stringifyConfiguration(screen: Scene): string {
		return yaml.stringify(screen);
	}

	function addExampleWidget(name) {
		// still need help with types :)
		let exampleWidget: any = exampleWidgets.find((example) => example.name == name);
		screen.scenes[selectedScene].widgets.push(exampleWidget.config);
		store.set(screen);
	}
	
	function removeExampleWidgets() {
		screen.scenes[selectedScene].widgets = [];
		store.set(screen)
	}
</script>

<main>
	{#if screen}
	<h1>Configure {screen.name}</h1>
	<label>Screen Name: <input type='text' bind:value={screen.name}></label>
		
		<div class='exampleWrapper'>
			<button on:click={() => shown = !shown}>Show</button>
			{#if shown}
				{#each exampleWidgets as example}
				<div id={example.name}>
					{example.name}
					<button on:click={() => {addExampleWidget(example.name)}} class='tryOut'>Add</button>
				</div>
				{/each}
			{/if}
		</div>
		{selectedScene}
		<select bind:value={selectedScene}>
			{#each screen.scenes as scene, index}
				<option value={index}>{scene.name}</option>
			{/each}
		</select>
		<Button on:click={removeExampleWidgets}>Remove example widgets</Button>
		<textarea bind:value={configValue} class='configWindow' />
		<Button on:click={save}>Save</Button>
	{:else}
		<h1>Screen does not exist.</h1>
	{/if}
</main>

<style lang="scss">
	main {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		padding: 20px;
	}
	.configWindow {
		font-size: 0.8em;
		width: 50%;
		height: 50%;
	}
</style>
