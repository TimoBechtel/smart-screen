<main>
	{#each new Array(1000).fill(404).map((i) => (Math.random() < 0.01 ? 420 : i)) as number}
		<p>
			{number}
		</p>
	{/each}
</main>

<style lang="scss">
	main {
		display: flex;
		max-width: 100vw;
		flex-wrap: wrap;
		opacity: 0.3;
		p {
			margin: 5px;
		}
	}
</style>
