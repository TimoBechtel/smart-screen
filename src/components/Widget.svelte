<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { renderTemplate } from '../templateRenderer';
	import { request } from '../webRequest';
	import type { Action, WidgetConfig } from '../widget';

	const defaultIcon = 'fa fa-info-circle';

	export let config: WidgetConfig;
	export let theme: 'light' | 'dark' = 'dark';

	let iframe: HTMLIFrameElement = null;

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
		try {
			const res = await request({ url, authToken, useProxy: browser });
			if (res.status === 200) {
				const raw = await res.clone().text();
				const updatedData = (await res.json()).data;
				if (updatedData) {
					data = { ...data, ...updatedData, _raw: raw };
				}
			} else {
				console.error('error fetching data', res.status);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function publishData({
		url,
		authToken,
		method = 'POST',
		payload
	}: {
		url: string;
		method?: 'GET' | 'POST';
		payload?: string;
		// optional auth token, for fetching data from private resources
		authToken?: string;
	}) {
		if (!url) return;
		try {
			const res = await request({ url, authToken, method, payload, useProxy: false });
			if (res.status !== 200) {
				console.error('error publishing data', res.status);
			}
		} catch (error) {
			console.error(error);
		}
	}

	function multiLine(text: string, separator = '\n'): string[] {
		return text.split(separator);
	}

	function capLength(text: string, maxLength: number): string {
		if (text.length > maxLength) {
			return text.substring(0, maxLength) + '...';
		}
		return text;
	}

	function dispatchAction(action: Action) {
		if (action.type === 'multi') {
			action.steps.forEach(dispatchAction);
		} else if (action.type === 'webhook') {
			publishData({
				url: action.url,
				authToken: action.authToken,
				method: action.method,
				payload: renderTemplate(action.payload_template, data)
			});
			console.log('dispatching action', action.url);
		} else if (action?.type === 'iframe-message') {
			const message = renderTemplate(action.message_template, data);
			iframe?.contentWindow.postMessage(message, '*');
			console.log(message);
		} else if (action?.type === 'data') {
			Object.entries(action.data).forEach(([key, value]) => {
				data[key] = renderTemplate(value, data);
				console.log(data[key]);
			});
		} else {
			console.warn('unknown action type', action);
		}
	}
</script>

<div
	class="wrapper"
	class:medium={config.content}
	class:light={theme === 'light'}
	tabindex={config.action ? 0 : null}
	on:keydown={(e) => {
		if (e.key === 'Enter') {
			if (config.action) dispatchAction(config.action);
		}
	}}
>
	<div class="header">
		<div class="icon">
			<i class={renderTemplate(config.icon_template, data) || defaultIcon} />
		</div>
		<div class="content">
			<div class="text primary">{capLength(renderTemplate(config.primary_template, data), 20)}</div>
			<div class="text secondary">
				{capLength(renderTemplate(config.secondary_template, data), 30)}
			</div>
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
					bind:this={iframe}
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

		outline: none;
		&:focus {
			border-color: rgba(255, 255, 255, 0.7);
		}

		&.medium {
			// 2x height of inner div + margin
			height: calc(16rem + var(--margin));
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
