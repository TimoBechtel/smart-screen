export type WidgetConfig = {
	// resource where to fetch data from
	url?: string;
	// optional auth token, for fetching data from private resources
	authToken?: string;
	// update interval in seconds
	update_interval?: number;
	// initial data / or additional data (optional)
	data?: { [key: string]: any };
	primary_template: string;
	secondary_template?: string;
	// template for icons (font awesome)
	icon_template: string;
	size?: 'small' | 'medium';
};
