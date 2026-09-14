/**
 * Procedural Web Audio API sound generator for study focus & ambient noise.
 * No external media assets needed!
 */

class SoundscapesEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentMode: 'white' | 'pink' | 'brown' | 'binaural' | 'rain' = 'brown';

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public play(mode: 'white' | 'pink' | 'brown' | 'binaural' | 'rain', volume = 0.5) {
    this.stop();
    const ctx = this.getAudioContext();
    this.currentMode = mode;

    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    this.gainNode.connect(ctx.destination);

    if (mode === 'binaural') {
      // Create binaural alpha beat (200Hz Left, 210Hz Right -> 10Hz Alpha Waves)
      const merger = ctx.createChannelMerger(2);
      
      const oscL = ctx.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(200, ctx.currentTime);

      const oscR = ctx.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(210, ctx.currentTime);

      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(this.gainNode);

      oscL.start();
      oscR.start();
      this.noiseNode = merger;
    } else {
      // Buffer based noise generation (2 seconds looped buffer)
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;

        if (mode === 'white') {
          data[i] = white * 0.1;
        } else if (mode === 'brown' || mode === 'rain') {
          // Brown noise (integrated white noise with filter)
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else if (mode === 'pink') {
          // Pink noise filter (Paul Kellet's filtered white noise algorithm)
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      if (mode === 'rain') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        noiseSource.connect(filter);
        filter.connect(this.gainNode);
      } else {
        noiseSource.connect(this.gainNode);
      }

      noiseSource.start();
      this.noiseNode = noiseSource;
    }

    this.isPlaying = true;
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)) * 0.3, this.ctx.currentTime);
    }
  }

  public stop() {
    if (this.noiseNode) {
      try {
        if ('stop' in this.noiseNode && typeof (this.noiseNode as AudioScheduledSourceNode).stop === 'function') {
          (this.noiseNode as AudioScheduledSourceNode).stop();
        }
        this.noiseNode.disconnect();
      } catch {
        // Safe catch on double stop
      }
      this.noiseNode = null;
    }
    this.isPlaying = false;
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      mode: this.currentMode,
    };
  }
}

export const soundscapes = new SoundscapesEngine();
