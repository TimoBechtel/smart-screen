import type { WidgetConfig } from 'src/widget';

type ExampleWidget = {
	name: string;
	config: WidgetConfig;
};

export const exampleWidgets: ExampleWidget[] = [
	{
		name: 'Wetter',
		config: {
			icon_template: 'fas fa-{% if condition == "sunny" %}sun{% else %}cloud{% endif %}',
			primary_template: '{{ temperature }} {{ location }}',
			secondary_template: '{{ description }}',
			data: { condition: 'rainy', location: 'Cologne' },
			source: {
				type: 'polling',
				url: 'https://goweather.herokuapp.com/weather/Cologne',
				interval: 3600
			},
			action: {
				type: 'webhook',
				url: 'my-url',
				payload_template: ''
			}
		}
	},
	{
		name: 'Bild',
		config: {
			icon_template: 'fas fa-camera',
			primary_template: 'Ein Bild',
			content: {
				type: 'image',
				payload_template:
					'https://images.unsplash.com/photo-1563089145-599997674d42?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
			}
		}
	},
	{
		name: 'VRS',
		config: {
			icon_template: 'fas fa-train',
			primary_template: '{{ events[0].departure.estimate }} Uhr',
			secondary_template: 'Haltestellte: Keupstraße',
			content: {
				type: 'text',
				payload_template:
					'Nächste Abfahrt: \nLinie: {{ events[0].line.number }} \n Richtung: {{ events[0].line.direction }}'
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
			primary_template: '${{ data.priceUsd | round: 4 }}',
			secondary_template: 'Bitcoin Kurs',
			source: {
				type: 'polling',
				url: 'https://api.coincap.io/v2/assets/bitcoin'
			}
		}
	},
	{
		name: 'Note',
		config: {
			icon_template: 'fas fa-sticky-note',
			primary_template: 'Note:',
			content: {
				type: 'text',
				payload_template: 'This background image is just a random one from unsplash.'
			}
		}
	},
	{
		name: 'Test',
		config: {
			primary_template: 'Counter',
			secondary_template: '{{ count }}',
			data: {
				count: '0'
			},
			action: {
				type: 'data',
				data: {
					count: '{{ count | plus: 1 }}'
				}
			}
		}
	},
	{
		name: 'Youtube',
		config: {
			primary_template: 'YoutubeVideo',
			content: {
				type: 'iframe',
				payload_template:
					'https://www.youtube.com/embed/5qap5aO4i9A?controls=0&enablejsapi=1&autoplay=0'
			},
			data: {
				playing: 'false'
			},
			action: {
				type: 'multi',
				steps: [
					{
						type: 'iframe-message',
						message_template:
							'{ "event": "command", "func": "{% if playing == "false" %}playVideo{% else %}pauseVideo{% endif %}" }'
					},
					{
						type: 'data',
						data: {
							playing: '{% if playing == "false" %}true{% else %}false{% endif %}'
						}
					}
				]
			}
		}
	}
];
