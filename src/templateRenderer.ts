import { Liquid } from 'liquidjs';

const renderer = new Liquid();

export function renderTemplate(template: string, data: { [key: string]: any }): string {
	if (!template) return '';
	try {
		return renderer.parseAndRenderSync(template, data);
	} catch (e) {
		console.log(e);
		return '';
	}
}
