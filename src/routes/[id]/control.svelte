<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { ChainReference } from 'socketdb';
	import { onMount } from 'svelte';

	export async function load({ page }: LoadInput): Promise<LoadOutput> {
		const id = page.params['id'];
		return {
			status: 200,
			props: { id }
		};
	}
</script>

<script lang="ts">
	export let id: string;

	let store: ChainReference = null;

	onMount(async () => {
		const { SocketDBClient } = await import('socketdb/browser');
		const db = SocketDBClient({ url: `ws://localhost:8080` });
		store = db.get(id);
		return store.on((data) => {
			isLoggedIn = data?.loggedIn || false;
		});
	});

	let isLoggedIn: boolean;

	function onLogin() {
		store.set({ loggedIn: true });
	}

	function onLogout() {
		store.set({ loggedIn: false });
	}
</script>

<main>
	<div class="wrapper">
		{#if !isLoggedIn}
			<button
				on:click={() => {
					onLogin();
				}}>Show</button
			>
		{:else}
			<button
				on:click={() => {
					onLogout();
				}}>Hide</button
			>
		{/if}
	</div>
</main>

<style lang="scss">
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
		padding: 20px;
		.wrapper {
			width: 100%;
			max-width: 500px;
		}
		button {
			display: block;
			width: 100%;
			margin: 10px 0;
			padding: 15px 20px;
			border: none;
			border-radius: 7px;
			background: #2f3d52;
			color: white;
			cursor: pointer;
		}
	}
</style>
