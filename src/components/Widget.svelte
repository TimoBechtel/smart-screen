<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import '../lib/ejs.min.js';
	import type { WidgetConfig } from '../widget';

	// ejs is imported as global variable
	// @ts-ignore
	let render = ejs.render;

	export let config: WidgetConfig;

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
	function renderTemplate(template: string, data: { [key: string]: any }): string {
		if (!template) return '';
		try {
			return render(template, data);
		} catch (e) {
			// console.log(e);
			return '';
		}
	}
</script>

<div class="wrapper">
	<div class="icon">
		<i class={renderTemplate(config.icon_template, data)} />
	</div>
	<div class="content">
		<div class="text primary">{renderTemplate(config.primary_template, data)}</div>
		<div class="text secondary">{renderTemplate(config.secondary_template, data)}</div>
	</div>
</div>

<style lang="scss">
	.wrapper {
		background: #2f3d52;
		border-radius: 13px;
		padding: 15px 15px;
		width: 17em;
		min-height: 6em;
		display: flex;
		margin: 0 23px 23px 0;
		@media (max-width: 768px) {
			width: 100%;
		}
		.icon {
			width: 3em;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 7px;
			i {
				font-size: 1.5em;
			}
		}
		.content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			.primary {
				font-size: 1.2em;
			}
			.secondary {
				font-size: 0.9em;
			}
		}
	}
</style>
