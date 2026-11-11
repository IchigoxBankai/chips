// Web Audio API Procedural Snack Sound Effects + Real Audio Samples
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private crunchAudioPool: HTMLAudioElement[] = [];
  private poolIndex: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const audioUrl = `${import.meta.env.BASE_URL}crunch.mp3`;
      for (let i = 0; i < 4; i++) {
        const audio = new Audio(audioUrl);
        audio.preload = 'auto';
        this.crunchAudioPool.push(audio);
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playPop(600);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Authentic chip crunch bite sound using uploaded crunch.mp3 with fallback
  public playCrunch() {
    if (this.isMuted) return;

    if (this.crunchAudioPool.length > 0) {
      const audio = this.crunchAudioPool[this.poolIndex];
      this.poolIndex = (this.poolIndex + 1) % this.crunchAudioPool.length;
      audio.currentTime = 0;
      audio.play().catch(() => {
        this.playProceduralCrunch();
      });
      return;
    }

    this.playProceduralCrunch();
  }

  private playProceduralCrunch() {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 3 rapid micro-bursts of crunch noise
    const bursts = [0, 0.03, 0.07];
    bursts.forEach((delay, idx) => {
      const burstTime = now + delay;
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Procedural gritty crunchy noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to isolate crispy snack frequency
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2200 + idx * 800 + Math.random() * 400, burstTime);
      bandpass.Q.setValueAtTime(4.0, burstTime);

      // Gain envelope
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, burstTime);
      gain.gain.exponentialRampToValueAtTime(0.001, burstTime + 0.07);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      noise.start(burstTime);
      noise.stop(burstTime + 0.08);

      // Low end punch thump for thick kettle chip density
      if (idx === 0) {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, burstTime);
        osc.frequency.exponentialRampToValueAtTime(40, burstTime + 0.06);

        oscGain.gain.setValueAtTime(0.2, burstTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, burstTime + 0.06);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        osc.start(burstTime);
        osc.stop(burstTime + 0.07);
      }
    });
  }

  // Realistic foil packet opening tear sound
  public playFoilTear() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (0.8 + 0.2 * Math.sin(i / 10));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(3200, now);
    highpass.frequency.linearRampToValueAtTime(1800, now + 0.25);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    noise.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.25);
  }

  // Playful UI pop/click for buttons and add-to-cart
  public playPop(freq = 520) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.6, now + 0.04);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Subtle bag rustle
  public playRustle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4500, now);
    filter.Q.setValueAtTime(2.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.12);
  }
}

export const sounds = new SoundManager();

