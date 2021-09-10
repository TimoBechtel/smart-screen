# Smart / Mirror.. Something.. - SMS

## About

This is a hackable smart dashboard / display / screen, something (SMS).

### Set up a display

1. Setup the necessary hardware. You need:

   - a monitor
   - a camera
   - a computer (e.g. a raspberry pi)
   - optionally: hardware buttons that emulate following keys: "ArrowLeft", "ArrowRight", "Tab", "Shift+Tab", "1", "2", ...

2. Setup a SocketDB server (probably not on the same machine)
   See: <https://timobechtel.github.io/socketdb/guide/quick-start.html#setup-server>

3. Run this software on the computer

   1. Build the website: `yarn build`
   2. Then start the server: `node build`

4. Go to <http://localhost:3000/1/dashboard>
   (1 can be replaced with any number you want)

### Usage

#### Screensaver

Look at the mirror to deactivate the screensaver. Look away to activate.

#### Scenes

Use `ArrowLeft`/`ArrowRight` or the number keys to switch between profiles ('scenes').

#### Actions

Use `Tab`/`Shift+Tab` to select widgets and press enter to trigger widget specific actions (see: 'Create your own widgets');

### Configure a display

1. Scan the QR code or go to <http://YOURSERVERADDRESS:PORT/1> (`1` can be replaced by your screen id)

2. Configure widgets using yaml or choose a template (see: 'Create your own widgets')

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

Template for the primary text / title of a widget. See section: "Templates"

##### `secondary_template` string, _optional_

Template for the secondary text of a widget. See section: "Templates"

##### `icon_template` string, _optional_

Template that generates the icon name. This need to be rendered to a Font Awesome icon name, e.g. `fas fa-coffee`.
You can find all available icons [here](https://fontawesome.com/v5.15/icons?d=gallery&p=2&m=free).

Also see section: "Templates"

##### `content` _optional_

```ts
{
	type: 'text' | 'image' | 'iframe';
	payload_template: string;
}
```

Additional text or media content for widgets. Adding this will increase the size of the widget automatically.
`payload_template` will be rendered, see section: "Templates".

For `type = 'image'`, `payload_template` needs to be a url pointing to an image.

For `type = 'iframe'`, `payload_template` needs to be a url to a website to embed.

##### `action` _optional_

Actions that are triggered when a widget is activated (see: "Usage"-"Actions")

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

  `payload_template` is rendered (see: "Templates") and will be submitted as payload.

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

## Development

Once you've installed all dependencies with `yarn`, start a development server:

```bash
yarn dev
```
