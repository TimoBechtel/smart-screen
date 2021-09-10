import * as tmImage from '@teachablemachine/image';

type Event = 'detected' | 'lost';

/**
 * A class that detects when the user is looking at the screen.
 */
export class AttentionDetector {
	private MODEL_URL = '/tfmodel/model.json';
	private METADATA_URL = '/tfmodel/metadata.json';

	// minimum confidence value to consider the attention is lost
	private MIN_PROBABILITY = 0.8;

	// minimum time to stay in "attention" state (reduces flickering)
	private MIN_ATTENTION_DURATION_IN_SECONDS = 4;

	// targeted number of predictions per second
	private PREDICTIONS_PER_SECOND = 20;

	private running = false;
	private callbacks: { [key in Event]: (() => void)[] } = {
		detected: [],
		lost: []
	};

	private notify(event: Event) {
		this.callbacks[event].forEach((cb) => cb());
	}

	on(event: Event, callback: () => void) {
		this.callbacks[event].push(callback);
		return () => {
			this.callbacks[event].splice(this.callbacks[event].indexOf(callback), 1);
		};
	}
	async listen() {
		let lastState: Event = 'lost';
		let detectedStateTimestamp = new Date().getTime();
		const webcam = new tmImage.Webcam();

		try {
			await webcam.setup();
		} catch (e) {
			this.notify('detected');
			console.error(e);
			console.warn('Disabled attention detection.');
			return;
		}

		const model = await tmImage.load(this.MODEL_URL, this.METADATA_URL);

		webcam.play();
		this.running = true;

		const loop = async () => {
			if (!this.running) {
				return;
			}

			webcam.update();
			await predict();

			// dont predict too often
			setTimeout(() => requestAnimationFrame(loop), 1000 / this.PREDICTIONS_PER_SECOND);
		};

		requestAnimationFrame(loop);

		const predict = async () => {
			if (
				lastState === 'detected' &&
				new Date().getTime() <
					detectedStateTimestamp + this.MIN_ATTENTION_DURATION_IN_SECONDS * 1000
			)
				return;

			const prediction = await model.predict(webcam.canvas);
			const detectedClass = prediction[0].className;
			const lostClass = prediction[1].className;

			// get the index of the highest probability
			const max = prediction.sort((a, b) => {
				return b.probability - a.probability;
			})[0];

			const state =
				max.className === lostClass && max.probability > this.MIN_PROBABILITY ? 'lost' : 'detected';

			if (state !== lastState) {
				this.notify(state);
				lastState = state;
			}

			if (state === 'detected') detectedStateTimestamp = new Date().getTime();
		};

		return () => {
			this.running = false;
			webcam.stop();
		};
	}
}
