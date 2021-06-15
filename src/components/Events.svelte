<script lang="ts">
	const events = [
		{
			from: '10:00',
			to: '16:00',
			title: 'Vorlesung Interaction Design'
		},
		{
			from: '10:00',
			to: '16:00',
			title: 'Vorlesung Interaction Design'
		}
	];
</script>

<div class="wrapper">
	<h2>Termine heute</h2>
	<div class="events">
		{#each events as event, i}
			<div class="event" class:marked={i === 0}>
				<div class="time">{event.from}-{event.to}</div>
				<div class="title">{event.title}</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.wrapper {
		background: #2f3d52;
		border-radius: 13px;
		padding: 15px 0;
		min-width: 23em;
		min-height: 6em;
		display: flex;
		flex-direction: column;
		margin: 17px 0;
		h2 {
			text-align: center;
			font-weight: lighter;
			width: 100%;
			font-size: 1.3em;
			margin: 10px 0 30px 0;
		}
		.event {
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 13px 0;
			&.marked {
				background: #4d596d;
			}
			.time {
				width: 4em;
			}
		}
	}
</style>
