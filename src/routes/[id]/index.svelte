<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { ChainReference } from 'socketdb/browser';
	import { onMount } from 'svelte';
	import Button from '../../components/Button.svelte';
	import { exampleWidgets } from '../../examples/widgets';
	import type { ScreenConfiguration } from '../../screen';

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

	onMount(async () => {
		// we need to dynamically load this module on mount, because we cannot load it on the server side
		const { SocketDBClient } = await import('socketdb/browser');
		const db = SocketDBClient({ url: `ws://localhost:8080` });
		store = db.get(id);

		return store.on((data: Partial<ScreenConfiguration>) => {
			// merge changes from the server with the local state whenever someone updates it
			if (data) {
				screen = { ...screen, ...data };
			}
		});
	});

	// a few demo functions that just add/remove example widgets to the scene 1
	function setExampleWidgets() {
		screen.scenes[1].widgets = exampleWidgets.map((example) => example.config);
		screen.background.color = 'black';
		screen.background.imageSrc =
			'https://source.unsplash.com/random/?wallpaper,dark?r=' + Math.random();
		store.set(screen);
	}
	function removeExampleWidgets() {
		screen.scenes[1].widgets = [];
		store.set(screen);
	}
</script>

<main>
	{#if screen}
		<h1>{screen.name}</h1>
		<Button on:click={setExampleWidgets}>Add example widgets</Button>
		<Button on:click={removeExampleWidgets}>Remove example widgets</Button>
		<pre style="font-size: 0.7em;">{JSON.stringify(screen, undefined, 2)}</pre>
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
</style>
