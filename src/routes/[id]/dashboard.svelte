<script context="module" lang="ts">
	import '@fortawesome/fontawesome-free/css/all.css';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { ChainReference } from 'socketdb';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { AttentionDetector } from '../../attentionDetector';
	import QR from '../../components/QR.svelte';
	import SceneIndicator from '../../components/SceneIndicator.svelte';
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
		scenes: [
			{
				name: 'My Scene 1',
				widgets: [],
				background: {
					color: 'darkslategrey'
				}
			},
			{
				name: 'My Scene 2',
				widgets: [],
				background: {
					color: 'peru'
				}
			},
			{
				name: 'My Scene 3',
				widgets: [],
				background: {
					color: 'darkslateblue'
				}
			}
		]
	};

	let currentSceneIndex = 0;

	let screensaver = true;
	let time = new Date();
	let clockTimer = null;
	$: if (screensaver) {
		clockTimer = setInterval(() => {
			time = new Date();
		}, 1000 * 30);
	} else {
		clearInterval(clockTimer);
	}

	let attentionDetector = new AttentionDetector();
	attentionDetector.on('detected', () => {
		screensaver = false;
	});
	attentionDetector.on('lost', () => {
		screensaver = true;
	});

	onMount(async () => {
		// we need to dynamically load this module on mount, because we cannot load it on the server side
		const { SocketDBClient } = await import('socketdb/browser');
		const db = SocketDBClient({ url: `ws://localhost:8080` });
		store = db.get(id);

		const unsubscribe = store.on((data: Partial<ScreenConfiguration>) => {
			if (data) {
				screen = { ...screen, ...data };
			} else {
				store.set(screen);
			}
		});

		const stopAttentionDetector = await attentionDetector.listen();

		return () => {
			unsubscribe();
			stopAttentionDetector();
			clearInterval(clockTimer);
		};
	});

	function onKeyDown(e: KeyboardEvent) {
		if (screensaver) {
			screensaver = false;
			return;
		}

		// cycle through scenes with the arrow keys
		if (e.key === 'ArrowLeft') {
			currentSceneIndex =
				currentSceneIndex - 1 < 0 ? screen.scenes.length - 1 : currentSceneIndex - 1;
		} else if (e.key === 'ArrowRight') {
			currentSceneIndex =
				currentSceneIndex + 1 > screen.scenes.length - 1 ? 0 : currentSceneIndex + 1;
		}

		// select scene by using the number keys
		if (e.key.length === 1 && e.key.match(/[0-9]/)) {
			const selection = parseInt(e.key, 10) - 1;
			if (screen.scenes[selection]) currentSceneIndex = selection;
		}
	}
</script>

<svelte:head>
	<title>{screen.name} - {screen.scenes[currentSceneIndex].name}</title>
</svelte:head>

<svelte:window on:keydown={onKeyDown} />

<main
	class:has-wallpaper={screen.scenes[currentSceneIndex]?.background?.imageSrc}
	style={`--wallpaper: url('${screen.scenes[currentSceneIndex]?.background?.imageSrc}'); --background-color: ${screen.scenes[currentSceneIndex]?.background?.color}`}
>
	{#if !screensaver}
		<div transition:fade>
			<h1>
				{screen.name}
				<SceneIndicator scenes={screen.scenes} bind:selected={currentSceneIndex} />
			</h1>
			<div class="widget-container">
				<div class="left-widgets">
					{#each screen.scenes[currentSceneIndex]?.widgets as widget}
						<div transition:fade={{ duration: 250 }}>
							<Widget config={widget} />
						</div>
					{/each}
				</div>
			</div>

			<div class="qr">
				<QR {id} />
			</div>
		</div>
	{:else}
		<div class="screensaver" transition:fade>
			{time.toLocaleTimeString(undefined, {
				timeStyle: 'short'
			})}
		</div>
	{/if}
</main>

<style lang="scss">
	main {
		padding: 30px 50px;

		background-color: var(--background-color, teal);
		&.has-wallpaper {
			// background image with color overlay
			background: linear-gradient(0deg, rgba(25, 3, 49, 0.5), rgba(25, 3, 49, 0.5)),
				var(--wallpaper);
			background-size: cover;
			background-attachment: fixed;
			background-position: center;
		}

		transition: background-color 0.5s ease;

		min-height: 100vh;

		h1 {
			font-size: 1.8rem;
			font-weight: lighter;
		}

		.qr {
			position: absolute;
			right: 50px;
			bottom: 50px;
			@media (max-width: 768px) {
				position: static;
			}
		}

		.screensaver {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 9rem;
			font-weight: bold;
			color: rgba(255, 255, 255, 0.5);
			backdrop-filter: blur(35px);
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
