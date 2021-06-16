<script lang="ts">
	import QRCode from 'qrcode';

	export let id: string;

	function qr(node: HTMLCanvasElement) {
		QRCode.toCanvas(node, `${location.protocol}//${location.host}/${id}/login`, {
			color: {
				light: '#000',
				dark: '#c0ccee'
			},
			scale: 8
		});
	}
</script>

<main>
	<canvas use:qr />
	<p>
		ID:{id}
	</p>
</main>

<style lang="scss">
	main {
		height: 100vh;
		width: 100vw;
		position: relative;
		canvas {
			position: absolute;
			bottom: 50px;
			right: 50px;
		}
	}
</style>
