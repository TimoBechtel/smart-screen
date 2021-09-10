<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import '../lib/ejs.min.js';
	import type { WidgetConfig } from '../widget';

	// ejs is imported as global variable
	// @ts-ignore
	let render = ejs.render;

	export let config: WidgetConfig;
	export let theme: 'light' | 'dark' = 'dark';

	$: if (!config.size) config.size = 'small';

	$: updateInterval = 1000 * config.update_interval || 1000 * 60 * 15;

	let data = {};
	if (config.data) {
		data = { ...config.data };
	}

	let interval = null;
	$: if (config.url) {
		updateData();
		interval = setInterval(() => {
			updateData();
		}, updateInterval);
	}

	onMount(() => {
		return () => {
			if (interval) clearInterval(interval);
		};
	});

	async function updateData() {
		let options = {};
		if (config.authToken) {
			options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + config.authToken
				}
			};
		}
		try {
			let res;
			if (browser) {
				// fetch through proxy to prevent cors issues, when in browser
				res = await fetch(`/proxy.json?url=${encodeURIComponent(config.url)}`, options);
			} else {
				// on server we can fetch directly
				res = await fetch(config.url, options);
			}
			const updatedData = (await res.json()).data;
			if (updatedData) {
				data = { ...data, ...updatedData };
			}
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 * NOTE: this will render javascript as is (ejs engine)
	 * do we want to allow users to input their own? -> security risk
	 * Maybe we can render this in an iframe for sandboxing?
	 */
	function renderTemplate(template: string, data: { [key: string]: any }): string[] {
		if (!template) return [''];
		try {
			return render(template, data).split('\n');
		} catch (e) {
			// console.log(e);
			return [''];
		}
	}
</script>

<div class="wrapper" class:medium={config.size === 'medium'} class:light={theme === 'light'}>
	<div class="header">
		<div class="icon">
			<i class={renderTemplate(config.icon_template, data)} />
		</div>
		<div class="content">
			<div class="text primary">{renderTemplate(config.primary_template, data)}</div>
			{#if config.size === 'small'}
				<div class="text secondary">
					{#each renderTemplate(config.secondary_template, data) as line}
						<p>{line}</p>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	<div class="body">
		{#if config.size === 'medium'}
			<div class="text secondary">
				{#each renderTemplate(config.secondary_template, data) as line}
					<p>{line}</p>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.wrapper {
		--margin: 20px;
		&.light {
			background: rgba(255, 255, 255, 0.1);
			border: 2px solid rgba(255, 255, 255, 0.2);
		}
		background: rgba(43, 32, 61, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.2);
		width: 21em;
		/* min-height: 8em; */
		margin: 0 var(--margin) var(--margin) 0;
		backdrop-filter: blur(25px);
		padding: 0 7px;
		@media (max-width: 768px) {
			width: 100%;
		}

		&.medium {
			// 2x height of inner div + margin + 4x border (2x inner div)
			min-height: calc(14rem + var(--margin) + 4px);
			.header {
				padding: 2.5rem 0 1.5rem 0;
			}
		}
		.header {
			display: flex;
			align-items: center;
			padding: 2.5rem 0;
			/* min-height: 7rem; */
			.icon {
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0 25px 0 25px;
				i {
					font-size: 1.4em;
				}
			}
		}

		.body {
			margin: 0 25px 0 25px;
		}
		.primary {
			font-size: 1.12em;
			font-weight: bold;
		}
		.secondary {
			font-size: 0.9em;
		}
	}
</style>
