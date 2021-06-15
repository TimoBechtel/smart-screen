export type WidgetConfig = {
	url?: string;
	authToken?: string;
	update_interval?: number;
	data?: { [key: string]: any };
	primary_template: string;
	secondary_template?: string;
	icon_template: string;
};
