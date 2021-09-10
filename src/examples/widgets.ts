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
			source: {
				type: 'polling',
				url: 'https://goweather.herokuapp.com/weather/Cologne',
				interval: 3600
			}
		}
	},
	{
		name: 'VRS',
		config: {
			icon_template: 'fas fa-train',
			primary_template: '<%= events[0].departure.estimate %> Uhr',
			secondary_template: 'Haltestellte: Keupstraße',
			content: {
				type: 'text',
				payload_template:
					'Nächste Abfahrt: \nLinie: <%= events[0].line.number %> \n Richtung: <%= events[0].line.direction %>'
			},
			source: {
				type: 'polling',
				url:
					'https://www.vrs.de/index.php?eID=tx_vrsinfo_ass2_departuremonitor&i=d2a97d0106d4c806809ff4ecc00d8a47',
				interval: 180
			}
		}
	},
	{
		name: 'Bitcoin',
		config: {
			icon_template: 'fab fa-btc',
			primary_template: '$<%= Math.round(data.priceUsd) %>',
			secondary_template: 'Bitcoin Kurs',
			source: {
				type: 'polling',
				url: 'https://api.coincap.io/v2/assets/bitcoin'
			}
		}
	}
];
