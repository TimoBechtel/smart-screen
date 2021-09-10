<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import '../lib/ejs.min.js';
	import type { WidgetConfig } from '../widget';

	// ejs is imported as global variable
	// @ts-ignore
	let render = ejs.render;

	const defaultIcon = 'fa fa-info-circle';

	export let config: WidgetConfig;
	export let theme: 'light' | 'dark' = 'dark';

	let data = {};
	if (config.data) {
		data = { ...config.data };
	}

	let interval = null;
	$: if (config.source?.type === 'polling') {
		const updateInterval = 1000 * config.source?.interval || 1000 * 60 * 15;

		fetchData({ url: config.source.url, authToken: config.source.authToken });
		interval = setInterval(() => {
			fetchData({ url: config.source.url, authToken: config.source.authToken });
		}, updateInterval);
	}

	onMount(() => {
		return () => {
			if (interval) clearInterval(interval);
		};
	});

	async function fetchData({ url, authToken }: { url: string; authToken?: string }) {
		if (!url) return;
		let options = {};
		if (authToken) {
			options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + authToken
				}
			};
		}
		try {
			let res: Response;
			if (browser) {
				// fetch through proxy to prevent cors issues, when in browser
				res = await fetch(`/proxy.json?url=${encodeURIComponent(url)}`, options);
			} else {
				// on server we can fetch directly
				res = await fetch(url, options);
			}
			if (res.status === 200) {
				const updatedData = (await res.json()).data;
				if (updatedData) {
					data = { ...data, ...updatedData };
				}
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
	function renderTemplate(template: string, data: { [key: string]: any }): string {
		if (!template) return '';
		try {
			return render(template, data);
		} catch (e) {
			// console.log(e);
			return '';
		}
	}

	function multiLine(text: string, separator = '\n'): string[] {
		return text.split(separator);
	}
</script>

<div class="wrapper" class:medium={config.content} class:light={theme === 'light'}>
	<div class="header">
		<div class="icon">
			<i class={renderTemplate(config.icon_template, data) || defaultIcon} />
		</div>
		<div class="content">
			<div class="text primary">{renderTemplate(config.primary_template, data)}</div>
			<div class="text secondary">{renderTemplate(config.secondary_template, data)}</div>
		</div>
	</div>
	<div class="body">
		{#if config.content?.type === 'text'}
			<div class="text secondary">
				{#each multiLine(renderTemplate(config.content.payload_template, data)) as line}
					<p>{line}</p>
				{/each}
			</div>
		{:else if config.content?.type === 'image'}
			<div class="media">
				<img src={renderTemplate(config.content.payload_template, data)} alt="" />
			</div>
		{:else if config.content?.type === 'iframe'}
			<div class="media">
				<iframe
					frameBorder="0"
					allowtransparency
					allow="encrypted-media"
					src={renderTemplate(config.content.payload_template, data)}
					title=""
				/>
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
		height: 8em;
		margin: 0 var(--margin) var(--margin) 0;
		backdrop-filter: blur(25px);
		padding: 0 7px;
		@media (max-width: 768px) {
			width: 100%;
		}

		&.medium {
			// 2x height of inner div + margin + 4x border (2x inner div)
			height: calc(16rem + var(--margin) + 4px);
			.header {
				padding: 2.5rem 0 1.5rem 0;
			}
		}
		.header {
			display: flex;
			align-items: center;
			padding: 2.5rem 0;
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
			.media {
				img {
					display: block;
					width: 100%;
					max-height: 10rem;
					object-fit: cover;
					border: 1px solid rgba(255, 255, 255, 0.2);
				}
				iframe {
					width: 100%;
					height: 10rem;
					border: 1px solid rgba(255, 255, 255, 0.2);
				}
			}
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
