# Smart Screen

## About

This is a hackable smart screen that displays information from third party sources and allows you to interact with third party services.

### Set up a display

1. Setup the necessary hardware. You need:

   - a monitor
   - a camera
   - a computer running either Linux, MacOS or Windows (e.g. a raspberry pi)
   - optionally: hardware buttons that emulate following keys: "ArrowLeft", "ArrowRight", "Tab", "Shift+Tab", "1", "2", ...

2. Setup a SocketDB server (probably not on the same machine)
   See: <https://timobechtel.github.io/socketdb/guide/quick-start.html#setup-server>

3. Run the software in this repo on the computer

   1. Make sure you have NodeJS installed. (see: <https://nodejs.org/>)
      For the Raspberry Pi, the easiest way is to use nvm: <https://github.com/nvm-sh/nvm>
      `nvm install node`
   2. Make sure you have yarn installed: `npm install --global yarn`
   3. Build the website: `yarn build`
   4. Then start the server: `node build`

4. Run it as a service (optional)  
   You may want to run it as a service whenever your computer (e.g. Raspberry PI) boots. For this you can use pm2:

   1. Install: `npm i -g pm2`
   2. Initialize a startup configuration: `pm2 startup`
   3. Start the dashboard as a service: `pm2 start build/index.js --name dashboard`
   4. Save currently running services to restore on the next boot: `pm2 save`

5. Go to <http://localhost:3000/[YOUR_SCREEN_ID]/dashboard>
   (`[YOUR_SCREEN_ID]` can be replaced with any number you want)

6. Launch Chrome on boot in kiosk mode (optional)  
   We've set up our Raspberry Pi to launch into a Chrome instance running in kiosk mode.  
   To do this, add `@chromium-browser --kiosk http://localhost:3000/YOUR_SCREEN_ID/dashboard` to `~/.config/lxsession/LXDE-pi/autostart` (create if not existent)

7. Connect hardware buttons (optional)  
   For a better user experience (or when running without a mouse and keyboard) you can add push buttons to the GPIO pins on the Raspberry PI.

   Checkout this tutorial on how to connect a button to a Raspberry PI: <https://raspberrypihq.com/use-a-push-button-with-raspberry-pi-gpio/>

8. Map Hardware Buttons to Keys (optional)
   To control the SmartScreen with hardware buttons, you can map these to keyboard events.
   When the button is connected to the 3.3V pin, active_low has to be set to 1, otherwise 0.
   Also make sure to set the initial state (gpio_pull=down, when active_low=1, otherwise =up).

   Add this to `/boot/config.txt`:

   ```
   dtoverlay=gpio-key,gpio=14,active_low=1,gpio_pull=down,keycode=15
   dtoverlay=gpio-key,gpio=15,active_low=1,gpio_pull=down,keycode=28
   dtoverlay=gpio-key,gpio=18,active_low=1,gpio_pull=down,keycode=106
   ```

### Usage

#### Screensaver

Look at the mirror to deactivate the screensaver. Look away to activate.

#### Scenes

Use `ArrowLeft`/`ArrowRight` or the number keys to switch between profiles ('scenes').

#### Actions

Use `Tab`/`Shift+Tab` to select widgets and press enter to trigger widget specific actions (see: [Create your own widgets](#create-your-own-widgets));

### Configure a display

1. Scan the QR code or go to <http://YOURSERVERADDRESS:PORT/[YOUR_SCREEN_ID]> (`[YOUR_SCREEN_ID]` can be replaced by your screen id)

2. Configure widgets using yaml or choose a template (see: [Create your own widgets](#create-your-own-widgets))

### Create your own widgets

Widgets are configured through JSON/YAML.

#### Templates

Parameters that end in `_template` are rendered with [Liquidjs](https://liquidjs.com/).
This allows you to render widgets dynamically. See: <https://shopify.github.io/liquid/> for all available functions.
A data object, storing data fetched from a server or set in the `data` parameter, is available in the render string.

Examples:

Render icons based on the weather condition:

```
icon_template: fas fa-{% if condition == "sunny" %}sun{% else %}cloud{% endif %}
```

Get the latest entry in a list:

```
primary_template: '{% assign next = data | sort: "day" | reverse | first %}{{next.day}}.{{next.month}}'
```

#### Available parameters

##### `source` _optional_

Sources for data.

Available sources:

- Polling:

  ```ts
  {
    type: 'polling';
    // resource where to fetch data from
    url: string;
    // optional auth token, for fetching data from private resources
    authToken?: string;
    // update interval in seconds
    interval?: number;
  }
  ```

  Fetches json data in given intervals.

##### `data` _optional_

```ts
{ [key: string]: any };
```

Object that stores any predefined data. This data is available in any template strings.
Properties are overwritten when fetched from a source. You can use this for initializing data before fetching.

##### `primary_template` string

Template for the primary text / title of a widget. See section: [Templates](#templates)

##### `secondary_template` string, _optional_

Template for the secondary text of a widget. See section: [Templates](#templates)

##### `icon_template` string, _optional_

Template that generates the icon name. This need to be rendered to a Font Awesome icon name, e.g. `fas fa-coffee`.
You can find all available icons [here](https://fontawesome.com/v5.15/icons?d=gallery&p=2&m=free).

Also see section: [Templates](#templates)

##### `content` _optional_

```ts
{
	type: 'text' | 'image' | 'iframe';
	payload_template: string;
}
```

Additional text or media content for widgets. Adding this will increase the size of the widget automatically.
`payload_template` will be rendered, see section: [Templates](#templates).

For `type = 'image'`, `payload_template` needs to be a url pointing to an image.

For `type = 'iframe'`, `payload_template` needs to be a url to a website to embed.

##### `action` _optional_

Actions that are triggered when a widget is activated (see: [Actions](#actions))

Available actions:

- `webhook`:

  ```ts
  {
    type: 'webhook';
    url: string;
    method?: 'GET' | 'POST'; // default: 'GET'
    payload_template?: string;
    // optional auth token, for fetching data from private resources
    authToken?: string;
  }
  ```

  Triggers a webhook.

  `payload_template` is rendered (see: [Templates](#templates)) and will be submitted as payload.

- `data`:

  ```ts
  {
     type: 'data';
     data: { [key: string]: string };
  }
  ```

  Allows you to manipulate values inside the data store. Values have to be strings and are rendered as templates (see: [Templates](#templates)).

- `iframe-message`:

  ```ts
  {
  	type: 'iframe-message';
  	message_template: string;
  }
  ```

  Allows you to send messages to an iframe (when content is set to an iframe). Message will be rendered.
  Example message for youtube videos: `{ "event": "command", "func": "playVideo" }`

- `multi`:

  ```ts
  {
     type: 'multi';
     steps: Action[];
  }
  ```

  Allows you to define multiple actions, that are executed in the order you define them. (Action can be anything above)

#### Examples (as yaml):

##### Large widget with text

```yaml
icon_template: fas fa-sticky-note
  primary_template: "Note:"
  content:
    type: text
    payload_template: This background image is just a random one from unsplash.
```

##### Weather widget

```yaml
icon_template: fas fa-{% if condition == "sunny" %}sun{% else %}cloud{% endif %}
  primary_template: "{{ temperature }} {{ location }}"
  secondary_template: "{{ description }}"
  data:
    location: Cologne
  source:
    type: polling
    url: https://goweather.herokuapp.com/weather/Cologne
    interval: 3600
```

See: [src/examples/widgets.ts](https://github.com/TimoBechtel/smart-screen/blob/main/src/examples/widgets.ts) for more examples.

## Development

Once you've installed all dependencies with `yarn`, start a development server:

```bash
yarn dev
```
