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

	let name: string;

	let isLoggedIn: boolean;

	function onLogin() {
		store.set({ loggedIn: true, name });
	}

	function onLogout() {
		store.set({ loggedIn: false });
	}
</script>

<main>
	{#if !isLoggedIn}
		<form
			class="wrapper"
			action="#"
			on:submit={(e) => {
				e.preventDefault();
				onLogin();
			}}
		>
			<input type="text" required placeholder="Name" bind:value={name} />
			<button>Login</button>
		</form>
	{:else}
		<div class="wrapper">
			<button
				on:click={() => {
					onLogout();
				}}>Logout</button
			>
		</div>
	{/if}
</main>

<style lang="scss">
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
		padding: 20px;
		form {
			display: block;
		}
		.wrapper {
			width: 100%;
			max-width: 500px;
		}
		input,
		button {
			display: block;
			width: 100%;
			margin: 10px 0;
		}

		input {
			padding: 15px 20px;
			border: none;
			border-radius: 7px;
			background: #aebdd4;
		}
		button {
			padding: 15px 20px;
			border: none;
			border-radius: 7px;
			background: #2f3d52;
			color: white;
			cursor: pointer;
		}
	}
</style>
