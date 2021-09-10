import type { WidgetConfig } from './widget';

export type ScreenConfiguration = {
	name: string;
	scenes: Scene[];
};

type Scene = {
	name: string;
	widgets: WidgetConfig[];
	background: {
		color: string;
		imageSrc?: string;
	};
};
