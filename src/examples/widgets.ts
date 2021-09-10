import type { WidgetConfig } from 'src/widget';

type ExampleWidget = {
	name: string;
	config: WidgetConfig;
};

export const exampleWidgets: ExampleWidget[] = [
	{
		name: 'Wetter',
		config: {
			icon_template: 'fas fa-<% if (condition === "sunny") { %>sun<% } else { %>cloud<% } %>',
			primary_template: '<%= temperature %> <%= location %>',
			secondary_template: '<%= description %>',
			data: { condition: 'rainy', location: 'Cologne' },
			url: 'https://goweather.herokuapp.com/weather/Cologne',
			update_interval: 3600,
			size: 'small'
		}
	},
	{
		name: 'VRS',
		config: {
			icon_template: 'fas fa-train',
			primary_template: '<%= events[0].departure.estimate %> Uhr',
			secondary_template:
				'Nächste Abfahrt: \nLinie: <%= events[0].line.number %> \n Richtung: <%= events[0].line.direction %> \n Haltestellte: Keupstraße',
			update_interval: 180,
			url:
				'https://www.vrs.de/index.php?eID=tx_vrsinfo_ass2_departuremonitor&i=d2a97d0106d4c806809ff4ecc00d8a47',
			size: 'medium'
		}
	},
	{
		name: 'Bitcoin',
		config: {
			icon_template: 'fab fa-btc',
			primary_template: '$<%= Math.round(data.priceUsd) %>',
			secondary_template: 'Bitcoin Kurs',
			url: 'https://api.coincap.io/v2/assets/bitcoin'
		}
	}
];
