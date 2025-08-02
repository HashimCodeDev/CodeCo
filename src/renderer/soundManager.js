class SoundManager {
	constructor() {
		this.audioContext = null;
		this.sounds = {};
		this.init();
	}

	init() {
		try {
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
			this.generateSounds();
		} catch (error) {
			console.log('Audio not supported');
		}
	}

	generateSounds() {
		// Dramatic gasp sound
		this.sounds.gasp = this.createGaspSound();
		// Angry scream
		this.sounds.scream = this.createScreamSound();
		// Window slam
		this.sounds.slam = this.createSlamSound();
		// Heartbreak
		this.sounds.heartbreak = this.createHeartbreakSound();
		// Happy chime
		this.sounds.happy = this.createHappySound();
	}

	createGaspSound() {
		const duration = 0.8;
		const sampleRate = this.audioContext.sampleRate;
		const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < buffer.length; i++) {
			const t = i / sampleRate;
			const envelope = Math.exp(-t * 3);
			const freq = 800 - t * 400;
			data[i] = envelope * Math.sin(2 * Math.PI * freq * t) * 0.3;
		}
		return buffer;
	}

	createScreamSound() {
		const duration = 1.2;
		const sampleRate = this.audioContext.sampleRate;
		const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < buffer.length; i++) {
			const t = i / sampleRate;
			const envelope = Math.exp(-t * 2);
			const noise = (Math.random() - 0.5) * 0.5;
			const tone = Math.sin(2 * Math.PI * 600 * t) * 0.4;
			data[i] = envelope * (tone + noise);
		}
		return buffer;
	}

	createSlamSound() {
		const duration = 0.5;
		const sampleRate = this.audioContext.sampleRate;
		const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < buffer.length; i++) {
			const t = i / sampleRate;
			const envelope = Math.exp(-t * 8);
			const noise = (Math.random() - 0.5) * envelope;
			data[i] = noise * 0.6;
		}
		return buffer;
	}

	createHeartbreakSound() {
		const duration = 2.0;
		const sampleRate = this.audioContext.sampleRate;
		const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < buffer.length; i++) {
			const t = i / sampleRate;
			const envelope = Math.exp(-t * 1.5);
			const freq = 300 - t * 100;
			const vibrato = Math.sin(2 * Math.PI * 5 * t) * 0.1;
			data[i] = envelope * Math.sin(2 * Math.PI * (freq + vibrato) * t) * 0.4;
		}
		return buffer;
	}

	createHappySound() {
		const duration = 0.6;
		const sampleRate = this.audioContext.sampleRate;
		const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < buffer.length; i++) {
			const t = i / sampleRate;
			const envelope = Math.exp(-t * 2);
			const freq1 = 523; // C5
			const freq2 = 659; // E5
			const freq3 = 784; // G5
			data[i] = envelope * (
				Math.sin(2 * Math.PI * freq1 * t) +
				Math.sin(2 * Math.PI * freq2 * t) +
				Math.sin(2 * Math.PI * freq3 * t)
			) * 0.2;
		}
		return buffer;
	}

	play(soundName) {
		if (!this.audioContext || !this.sounds[soundName]) return;

		try {
			const source = this.audioContext.createBufferSource();
			source.buffer = this.sounds[soundName];
			source.connect(this.audioContext.destination);
			source.start();
		} catch (error) {
			console.log('Sound play failed:', error);
		}
	}
}