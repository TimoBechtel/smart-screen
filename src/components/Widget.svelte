<script lang="ts">
	import type { WidgetConfig } from '../types';

	export let config: WidgetConfig;

	function renderTemplate(template: string, data: { [key: string]: any }): string {
		if (!template) return '';
		const variables = template.match(/{[^}]+}/g);
		let rendered = template;
		if (variables && variables.length > 0)
			variables.forEach((varString) => {
				const variable = varString.replace('{', '').replace('}', '');
				rendered = rendered.replace(varString, data[variable] || '');
			});
		return rendered;
	}
</script>

<div class="wrapper">
	<div class="icon">
		<i class={renderTemplate(config.icon_template, config.testData)} />
	</div>
	<div class="content">
		<div class="text primary">{renderTemplate(config.primary_template, config.testData)}</div>
		<div class="text secondary">{renderTemplate(config.secondary_template, config.testData)}</div>
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
		margin: 17px 0;
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
				font-size: 1.3em;
			}
			.secondary {
				font-size: 0.9em;
			}
		}
	}
</style>
