import type { WidgetConfig } from './widget';

export type ScreenConfiguration = {
	name: string;
	background: {
		color: string;
		imageSrc?: string;
	};
	scenes: {
		1: {
			name: string;
			widgets: WidgetConfig[];
		};
		2: {
			name: string;
			widgets: WidgetConfig[];
		};
		3: {
			name: string;
			widgets: WidgetConfig[];
		};
	};
};
