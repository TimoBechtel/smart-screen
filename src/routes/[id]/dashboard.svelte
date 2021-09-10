<script context="module" lang="ts">
	import '@fortawesome/fontawesome-free/css/all.css';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { ChainReference } from 'socketdb';
	import { onMount } from 'svelte';
	import QR from '../../components/QR.svelte';
	import Widget from '../../components/Widget.svelte';
	import type { ScreenConfiguration } from '../../screen';

	export async function load({ page }: LoadInput): Promise<LoadOutput> {
		// get the id of the screen (from the url)
		const id = page.params['id'];
		return {
			status: 200,
			props: { id }
		};
	}
</script>

<script lang="ts">
	/**
	 * A single Screen / Dashboard
	 * Config is loaded through using the id of the screen
	 *
	 * url: /[id]/dashboard
	 */

	export let id: string;

	let store: ChainReference;

	// initial configuration
	let screen: ScreenConfiguration = {
		name: 'My Screen',
		background: {
			color: 'teal'
		},
		scenes: {
			'1': {
				name: 'My Scene 1',
				widgets: []
			},
			'2': {
				name: 'My Scene 2',
				widgets: []
			},
			'3': {
				name: 'My Scene 3',
				widgets: []
			}
		}
	};

	onMount(async () => {
		// we need to dynamically load this module on mount, because we cannot load it on the server side
		const { SocketDBClient } = await import('socketdb/browser');
		const db = SocketDBClient({ url: `ws://localhost:8080` });
		store = db.get(id);
		return store.on((data: Partial<ScreenConfiguration>) => {
			if (data) {
				screen = { ...screen, ...data };
			} else {
				store.set(screen);
			}
		});
	});
</script>

<main
	class:has-wallpaper={screen.background.imageSrc}
	style={`--wallpaper: url('${screen.background.imageSrc}'); --background-color: ${screen.background.color}`}
>
	<h1>{screen.name} - {screen.scenes[1].name}</h1>
	<div class="widget-container">
		<div class="left-widgets">
			{#each screen?.scenes?.['1']?.widgets as widget}
				<Widget config={widget} />
			{/each}
		</div>
	</div>

	<div class="qr">
		<QR {id} />
	</div>
</main>

<style lang="scss">
	main {
		padding: 30px 50px;
		&.has-wallpaper {
			// background image with color overlay
			background: linear-gradient(0deg, rgba(25, 3, 49, 0.3), rgba(25, 3, 49, 0.3)),
				var(--wallpaper);
			background-size: cover;
			background-attachment: fixed;
			background-position: center;
		}
		background-color: var(--background-color, teal);
		min-height: 100vh;

		h1 {
			font-size: 1em;
			font-weight: normal;
		}

		.qr {
			position: absolute;
			right: 50px;
			bottom: 50px;
			@media (max-width: 768px) {
				position: static;
			}
		}
	}
	.widget-container {
		margin-top: 20px;
		display: flex;
		@media (max-width: 768px) {
			flex-direction: column;
		}
		.left-widgets {
			@media (min-width: 768px) {
				display: flex;
				max-height: 80vh;
				flex-flow: column wrap;
			}
		}
	}
</style>
