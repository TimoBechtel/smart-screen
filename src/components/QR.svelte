<script lang="ts">
	import QRCode from 'qrcode';

	export let id: string;

	function qr(node: HTMLCanvasElement) {
		const payload = `${location.protocol}//${location.host}/${id}`;
		QRCode.toCanvas(node, payload, {
			color: {
				light: '#000',
				dark: '#c0ccee'
			},
			scale: 5
		});
	}
</script>

<main>
	<canvas use:qr />
</main>

<style lang="scss">
	main {
		/* height: 100vh;
		width: 100vw; */
		/* position: relative; */
		canvas {
			position: absolute;
			bottom: 40px;
			right: 40px;
		}
	}
</style>
