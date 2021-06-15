<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.css';
	import Events from '../components/Events.svelte';
	import WelcomeTitle from '../components/WelcomeTitle.svelte';
	import Widget from '../components/Widget.svelte';
	import type { WidgetConfig } from '../types';

	const user = {
		name: 'Testi',
		id: '13374269'
	};

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

<main>
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

	Session ID: {user.id}
</main>

<style lang="scss">
	main {
		padding: 30px 50px;
		background: url('/background.jpg');
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
