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
	data?: { [key: string]: string };
	primary_template: string;
	secondary_template?: string;
	// template for icons (font awesome)
	icon_template?: string;
	// content for a widget
	content?: {
		type: 'text' | 'image' | 'iframe';
		payload_template: string;
	};
	action?: Action;
};

export type Action =
	| {
			type: 'webhook';
			url: string;
			method?: 'GET' | 'POST';
			payload_template?: string;
			// optional auth token, for fetching data from private resources
			authToken?: string;
	  }
	| {
			type: 'iframe-message';
			message_template: string;
	  }
	| {
			type: 'data';
			data: { [key: string]: string };
	  }
	| {
			type: 'multi';
			steps: Action[];
	  };
