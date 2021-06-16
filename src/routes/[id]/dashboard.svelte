<script context="module" lang="ts">
	import '@fortawesome/fontawesome-free/css/all.css';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { ChainReference } from 'socketdb';
	import { onMount } from 'svelte';
	import Events from '../../components/Events.svelte';
	import QR from '../../components/QR.svelte';
	import WelcomeTitle from '../../components/WelcomeTitle.svelte';
	import Widget from '../../components/Widget.svelte';
	import type { WidgetConfig } from '../../types';

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

	let store: ChainReference;

	let user: { name: string; loggedIn: boolean; wallpaper?: string } = {
		name: 'Anonymer Gnu',
		loggedIn: false,
		wallpaper: '/background.jpg'
	};

	onMount(async () => {
		const { SocketDBClient } = await import('socketdb/browser');
		const db = SocketDBClient({ url: `ws://localhost:8080` });
		store = db.get(id);
		return store.on((data) => {
			if (data && user) user = { ...user, ...data };
			else if (data) user = data;
		});
	});

	const widgets: WidgetConfig[] = [
		{
			icon_template: 'fas fa-<% if (condition === "sunny") { %>sun<% } else { %>cloud<% } %>',
			primary_template: '<%= temperature %> <%= location %>',
			secondary_template: '<%= description %>',
			data: { condition: 'rainy', location: 'Cologne' },
			url: 'https://goweather.herokuapp.com/weather/Cologne',
			update_interval: 60
		},
		{
			icon_template: 'fas fa-train',
			primary_template:
				'<%= events[0].departure.estimate %> Uhr - Linie <%= events[0].line.number %>, <%= events[0].line.direction %>',
			secondary_template: 'Haltestellte Keupstraße',
			update_interval: 5,
			url:
				'https://www.vrs.de/index.php?eID=tx_vrsinfo_ass2_departuremonitor&i=d2a97d0106d4c806809ff4ecc00d8a47'
		},
		{
			icon_template: 'fab fa-btc',
			primary_template: '$<%= Math.round(data.priceUsd) %>',
			secondary_template: 'Bitcoin Kurs',
			url: 'https://api.coincap.io/v2/assets/bitcoin'
		}
	];
</script>

{#if user?.loggedIn}
	<main style={`--wallpaper: url('${user.wallpaper}')`}>
		<WelcomeTitle name={user.name} />
		<div class="widget-container">
			<div class="left-widgets">
				{#each widgets as widget}
					<Widget config={widget} />
				{/each}
			</div>
			<div class="right-widgets">
				<Events />
			</div>
		</div>

		Session ID: {id}
	</main>
{:else}
	<QR {id} />
{/if}

<style lang="scss">
	main {
		padding: 30px 50px;
		background: var(--wallpaper);
		background-size: cover;
		background-attachment: fixed;
		min-height: 100vh;
	}
	.widget-container {
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
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
