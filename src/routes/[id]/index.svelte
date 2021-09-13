<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { ChainReference } from 'socketdb/browser';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import yaml from 'yaml';
	import Button from '../../components/Button.svelte';
	import Widget from '../../components/Widget.svelte';
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
	let selectedWidget;
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
	
	function removeAllWidgets() {
		screen.scenes[selectedScene].widgets = [];
		store.set(screen)
	}
</script>

<main style='--background-url: url({screen?.scenes[selectedScene].background.imageSrc}); --background-color: {screen?.scenes[selectedScene].background.color}'>
	{#if screen}
	
	<div class='leftpart'>
		
		<select class='selectedScene' bind:value={selectedScene}>
			{#each screen.scenes as scene, index}
			<option value={index}>{scene.name}</option>
			{/each}
		</select>
		<div class='examplewrapper'>
			<button class='button' on:click={() => shown = !shown}>{shown? "Hide": "Show"} examples</button>
			{#if shown}
			<div id="list" transition:slide={{ duration: 250 }}>
				{#each exampleWidgets as example}
				<div class='exampleentry' id={example.name}>
					{example.name}
					<button class='button tryout' on:click={() => {addExampleWidget(example.name)}}>Add</button>
				</div>
				{/each}
			</div>
			{/if}
		</div>
		<div class='widgetlist'>
			{#each screen.scenes[selectedScene].widgets as widget}
				<p class='widgetentry' on:click={() => {selectedWidget = widget}}>{widget.primary_template}</p>
			{/each}
		</div>
		<button class='button' on:click={removeAllWidgets}>Remove all Widgets in {screen?.scenes[selectedScene].name}</button>
		
	</div>
	<div class='rightpart'>
		<h1 class='heading'>Configure <span class='editable' contenteditable="true" on:input={(e) => {screen.name = e.currentTarget.textContent}}>{screen.name}</span></h1>
		{#if selectedWidget}
			<textarea bind:value={configValue} class='configWindow' />
			<div class='widget'>
				<Widget config={selectedWidget} />
			</div>
		{:else }
		<p>Select a widget to preview it here</p>
		{/if}

		<button class='button' on:click={save}>Save</button>
	</div>
	{:else}
		<h1>Screen does not exist.</h1>
	{/if}
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: row;
		width: 100vw;
		height: 100vh;
		background: linear-gradient(0deg, rgba(25, 3, 49, 0.5), rgba(25, 3, 49, 0.5)), var(--background-url);
		background-size: cover;
		background-attachment: fixed;
		background-position: center;
		flex: 1 2;
	}
	.selectedScene {
		background: rgba(255, 255, 255, 0.2);
		color: white;
    	backdrop-filter: blur(20px);
    	border: 1px solid rgba(255, 255, 255, 0.2);
		margin-bottom: 1rem;
	}
	.heading {
		margin-bottom: 2rem;
	}
	.widget {
		margin-top: 2rem;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	.configWindow {
		font-size: 0.8em;
		width: 100%;
		height: 50%;

	}
	.editable {
		text-decoration: underline;
	}
	.widgetlist {
		backdrop-filter: blur(100px);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		margin-bottom: 2rem;
	}
	.widgetentry {
		padding: 0.5rem;
		border-bottom: 2px solid rgba(255, 255, 255, 0.2);
		cursor: pointer;
		overflow: hidden;
		background-color: rgba(255, 255, 255, 0.0);
		&:hover {
			transition: background-color 0.3s ease-in-out;
			background-color: rgba(255, 255, 255, 0.2);
		}
	}
	.leftpart {
		border-right: 2px solid rgba(255, 255, 255, 0.2);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		max-width: 33%;
		max-height: 100%;
		overflow-x: scroll;
	}
	.rightpart {
		margin: 1.5rem;
		flex-grow: 1;
	}
	.button {
		all: unset;
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 0.2rem 0.5rem 0.2rem 0.5rem;
		backdrop-filter: blur(0.5rem);
		color: white;
		cursor: pointer;
		background-color: rgba(255, 255, 255, 0.0);

		&:hover {
			transition: background-color 0.3s ease-in-out;
			background-color: rgba(255, 255, 255, 0.3);
		}
	}
	.examplewrapper {
		padding-top: 0.5rem;
		margin-bottom: 1rem;

	}
	.exampleentry {
		padding-top: 0.2rem;
		padding-bottom: 0.2rem;
		text-align: center;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid rgba(255, 255, 255, 0.0);

		&:hover {
			transition: backdrop-filter 0.1s ease-in-out, border-bottom-color 0.3s ease-in-out;
			border-bottom: 1px solid rgba(255, 255, 255, 0.4);
			backdrop-filter: blur(20px);
		}
	}
</style>
