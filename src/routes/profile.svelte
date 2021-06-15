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
			icon_template: 'fas fa-sun',
			primary_template: '{deg}°C, Cologne',
			testData: { deg: 27 }
		},
		{
			icon_template: 'fas fa-train',
			primary_template: 'in {minutes} Minuten',
			secondary_template: 'nach Hause mit {train}',
			testData: { minutes: 25, train: 'S4' }
		},
		{
			icon_template: 'fas fa-mug-hot',
			primary_template: '{status}',
			testData: { status: 'warm' }
		},
		{
			icon_template: 'fas fa-wine-bottle',
			primary_template: 'Mate heute: {count} Flaschen',
			testData: { count: 20 }
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
		height: 100vh;
	}
	.widget-container {
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
		@media (max-width: 768px) {
			flex-direction: column;
		}
	}
</style>
