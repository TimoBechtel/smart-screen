import type { WidgetConfig } from './widget';

export type ScreenConfiguration = {
	name: string;
	scenes: Scene[];
};

export type Scene = {
	name: string;
	widgets: WidgetConfig[];
	background: {
		color: string;
		imageSrc?: string;
	};
};
