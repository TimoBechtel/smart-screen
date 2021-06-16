<main>
	{#each new Array(1000).fill(404).map((i) => (Math.random() < 0.01 ? 420 : i)) as number, index}
		<p style={`--delay: ${index}ms`}>
			{number}
		</p>
	{/each}
</main>

<style lang="scss">
	@keyframes breath {
		50% {
			opacity: 0.5;
			color: rgb(214, 90, 41);
		}
		100% {
			opacity: 0.5;
			color: green;
		}
	}

	main {
		display: flex;
		max-width: 100vw;
		max-height: 100vh;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		p {
			opacity: 0.3;
			animation: breath 2s var(--delay) alternate infinite ease-in-out;
			margin: 0.9vh 0.8vw;
		}
	}
</style>
