export type WidgetConfig = {
	source?: {
		type: 'polling';
		// resource where to fetch data from
		url: string;
		// optional auth token, for fetching data from private resources
		authToken?: string;
		// update interval in seconds
		interval?: number;
	};
	// initial data; will be overwritten, if a source is set
	data?: { [key: string]: any };
	primary_template: string;
	secondary_template?: string;
	// template for icons (font awesome)
	icon_template?: string;
	// content for a widget
	content?: {
		type: 'text' | 'image' | 'iframe';
		payload_template: string;
	};
	action?: {
		type: 'webhook';
		url: string;
		method?: 'GET' | 'POST';
		payload_template?: string;
		// optional auth token, for fetching data from private resources
		authToken?: string;
	};
};
