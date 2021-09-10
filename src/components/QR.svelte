<script lang="ts">
	import QRCode from 'qrcode';

	export let id: string;

	function qr(node: HTMLCanvasElement) {
		const payload = `${location.protocol}//${location.host}/${id}`;
		QRCode.toCanvas(node, payload, {
			color: {
				light: '#d8d8d8',
				dark: '#000'
			},
			margin: 2,
			scale: 4
		});
	}
</script>

<main>
	<p>Konfigurieren:</p>
	<canvas use:qr />
</main>

<style>
	p {
		margin: 5px 0;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.6);
	}
	canvas {
		opacity: 0.6;
	}
</style>
