import type { WidgetConfig } from './widget';

export type ScreenConfiguration = {
	name: string;
	scenes: {
		1: Scene;
		2: Scene;
		3: Scene;
	};
};

type Scene = {
	name: string;
	widgets: WidgetConfig[];
	background: {
		color: string;
		imageSrc?: string;
	};
};
