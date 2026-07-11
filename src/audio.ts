// Web Audio API Synthesizer and SFX Library for El Qilin Negro
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMutedSetting = false;
let volumeSetting = 0.5;

// Background Music State
let bgMusicGain: GainNode | null = null;
let bgMusicDrone1: OscillatorNode | null = null;
let bgMusicDrone2: OscillatorNode | null = null;
let bgMusicLfo: OscillatorNode | null = null;
let bgMusicInterval: any = null;
let bgMusicStarted = false;

// Multi-track ambient music system
let currentTrackType: 'fight' | 'hexing' | 'singular' | 'void' = 'singular';
let htmlAudioElement: HTMLAudioElement | null = null;
let synthInterval: any = null;
let activeSynthNodes: any[] = [];

export function getCurrentTrackType() {
  return currentTrackType;
}

export function stopAllAmbientMusic() {
  // Stop procedural synthesis
  if (bgMusicInterval) {
    clearTimeout(bgMusicInterval);
    bgMusicInterval = null;
  }
  if (synthInterval) {
    clearTimeout(synthInterval);
    synthInterval = null;
  }
  if (bgMusicDrone1) {
    try { bgMusicDrone1.stop(); } catch (e) {}
    bgMusicDrone1 = null;
  }
  if (bgMusicDrone2) {
    try { bgMusicDrone2.stop(); } catch (e) {}
    bgMusicDrone2 = null;
  }
  if (bgMusicLfo) {
    try { bgMusicLfo.stop(); } catch (e) {}
    bgMusicLfo = null;
  }
  
  activeSynthNodes.forEach(node => {
    try { node.stop(); } catch (e) {}
  });
  activeSynthNodes = [];

  // Stop HTML Audio element
  if (htmlAudioElement) {
    try {
      htmlAudioElement.pause();
      htmlAudioElement.src = '';
    } catch (e) {}
    htmlAudioElement = null;
  }
  
  bgMusicStarted = false;
}

export function playAmbientMusicTrack(track: 'fight' | 'hexing' | 'singular' | 'void') {
  currentTrackType = track;
  stopAllAmbientMusic();
  
  const ctx = getAudioContext();
  if (!ctx) return;

  if (track === 'singular') {
    startAmbientMusic();
    return;
  }

  if (track === 'void') {
    bgMusicStarted = true;
    startProceduralVoidMusic(ctx);
    return;
  }

  bgMusicStarted = true;
  const fileName = track === 'fight' ? 'fight1.mp3' : 'Hexing1.mp3';
  
  // Create HTML Audio element
  htmlAudioElement = new Audio(fileName);
  htmlAudioElement.loop = true;
  
  // Connect the media element source to Web Audio to respect our gain and volume sliders
  try {
    const source = ctx.createMediaElementSource(htmlAudioElement);
    const destination = setupRouting(ctx);
    
    bgMusicGain = ctx.createGain();
    bgMusicGain.gain.setValueAtTime(0.5, ctx.currentTime);
    source.connect(bgMusicGain);
    bgMusicGain.connect(destination);
  } catch (err) {
    console.warn("MediaElementSource connection failed or already connected. Playing directly.", err);
  }
  
  // Try to play the MP3 file
  htmlAudioElement.play().catch(err => {
    console.warn(`Could not play ${fileName} (file may not be present in server). Activating theme-appropriate procedural synthesis fallback instead.`, err);
    if (track === 'fight') {
      startProceduralFightMusic(ctx);
    } else {
      startProceduralHexingMusic(ctx);
    }
  });
}

function startProceduralFightMusic(ctx: AudioContext) {
  if (synthInterval) clearTimeout(synthInterval);
  const destination = setupRouting(ctx);

  // Fast-paced fight bass notes (D minor / pentatónico)
  const notes = [73.42, 87.31, 98.00, 110.00, 130.81]; // D2, F2, G2, A2, C3
  let beatCount = 0;

  const playFightBeat = () => {
    if (isMutedSetting || !bgMusicStarted) return;
    const now = ctx.currentTime;

    // Simulated kick drum
    if (beatCount % 2 === 0) {
      const kickOsc = ctx.createOscillator();
      kickOsc.type = 'triangle';
      kickOsc.frequency.setValueAtTime(150, now);
      kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

      const kickGain = ctx.createGain();
      kickGain.gain.setValueAtTime(0.18, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      kickOsc.connect(kickGain);
      kickGain.connect(destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.18);
    }

    // Simulated high hat / snare noise burst
    if (beatCount % 4 === 2) {
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(destination);

      noise.start(now);
      noise.stop(now + 0.12);
    }

    // Fast aggressive synth bass pulse
    if (beatCount % 2 === 0 || Math.random() > 0.45) {
      const bassOsc = ctx.createOscillator();
      bassOsc.type = 'sawtooth';
      const freq = notes[Math.floor(Math.random() * notes.length)];
      bassOsc.frequency.setValueAtTime(freq, now);

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(160, now);

      const bassGain = ctx.createGain();
      bassGain.gain.setValueAtTime(0.07, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      bassOsc.connect(lp);
      lp.connect(bassGain);
      bassGain.connect(destination);

      bassOsc.start(now);
      bassOsc.stop(now + 0.25);
    }

    beatCount = (beatCount + 1) % 8;
    synthInterval = setTimeout(playFightBeat, 210); // Fast combat pacing (~142 BPM)
  };

  playFightBeat();
}

function startProceduralHexingMusic(ctx: AudioContext) {
  if (synthInterval) clearTimeout(synthInterval);
  const destination = setupRouting(ctx);

  // Deep dark occult drones
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const lp = ctx.createBiquadFilter();

  osc1.type = 'sawtooth';
  osc2.type = 'triangle';
  osc1.frequency.setValueAtTime(65.41, ctx.currentTime); // C2
  osc2.frequency.setValueAtTime(69.30, ctx.currentTime); // C#2 (sinister dissonance)

  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(85, ctx.currentTime);

  const droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0.1, ctx.currentTime);

  osc1.connect(lp);
  osc2.connect(lp);
  lp.connect(droneGain);
  droneGain.connect(destination);

  osc1.start();
  osc2.start();

  activeSynthNodes.push(osc1, osc2);

  // Eerie dark chime notes
  const hexNotes = [220.00, 233.08, 277.18, 311.13, 349.23, 440.00];

  const playHexChime = () => {
    if (isMutedSetting || !bgMusicStarted) return;
    const now = ctx.currentTime;

    const chimeOsc = ctx.createOscillator();
    chimeOsc.type = 'sine';
    const freq = hexNotes[Math.floor(Math.random() * hexNotes.length)];
    chimeOsc.frequency.setValueAtTime(freq, now);

    // Dark pitch tremolo modulation
    const tremolo = ctx.createOscillator();
    tremolo.frequency.setValueAtTime(4.2, now);
    const tremGain = ctx.createGain();
    tremGain.gain.setValueAtTime(freq * 0.015, now);
    tremolo.connect(tremGain);
    tremGain.connect(chimeOsc.frequency);

    // Ethereal cavernous echo feedback loop
    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.6, now);
    const delayFb = ctx.createGain();
    delayFb.gain.setValueAtTime(0.45, now);
    delay.connect(delayFb);
    delayFb.connect(delay);

    const chimeGain = ctx.createGain();
    chimeGain.gain.setValueAtTime(0, now);
    chimeGain.gain.linearRampToValueAtTime(0.07, now + 0.12);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(destination);
    chimeGain.connect(delay);
    delay.connect(destination);

    tremolo.start(now);
    chimeOsc.start(now);

    tremolo.stop(now + 3.0);
    chimeOsc.stop(now + 3.0);

    synthInterval = setTimeout(playHexChime, 2400 + Math.random() * 2200);
  };

  playHexChime();
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  // Resume context if suspended (browser security policy)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  return audioCtx;
}

export function setAudioMute(mute: boolean) {
  isMutedSetting = mute;
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(mute ? 0 : volumeSetting, audioCtx.currentTime);
  }
}

export function setAudioVolume(vol: number) {
  volumeSetting = Math.max(0, Math.min(1, vol));
  if (masterGain && audioCtx && !isMutedSetting) {
    masterGain.gain.setValueAtTime(volumeSetting, audioCtx.currentTime);
  }
}

export function getAudioSettings() {
  return {
    isMuted: isMutedSetting,
    volume: volumeSetting
  };
}

// Set up routing graph
function setupRouting(ctx: AudioContext): GainNode {
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMutedSetting ? 0 : volumeSetting, ctx.currentTime);
    masterGain.connect(ctx.destination);
  }
  return masterGain;
}

/**
 * Fade background music dynamically to implement crossfading
 * @param targetVolume target relative volume level (0.0 to 1.0)
 * @param fadeTime duration of transition in seconds
 */
export function fadeBgMusic(targetVolume: number, fadeTime: number) {
  const ctx = getAudioContext();
  if (!ctx || !bgMusicGain) return;
  const now = ctx.currentTime;
  bgMusicGain.gain.cancelScheduledValues(now);
  bgMusicGain.gain.setValueAtTime(bgMusicGain.gain.value, now);
  bgMusicGain.gain.linearRampToValueAtTime(targetVolume, now + fadeTime);
}

/**
 * Initializes and loops a meditative, occult traditional Chinese melody
 * using an ambient drone and random pentatonic plucks (Pipa/Guzheng/Flute style)
 */
export function startAmbientMusic() {
  const ctx = getAudioContext();
  if (!ctx || bgMusicStarted) return;
  bgMusicStarted = true;

  const destination = setupRouting(ctx);

  // Background music sub-master gain node
  bgMusicGain = ctx.createGain();
  // Set default comfortable relative volume level for ambient music
  bgMusicGain.gain.setValueAtTime(0.5, ctx.currentTime);
  bgMusicGain.connect(destination);

  // 1. ANCIENT RITUAL HORN / CHINESE MONASTERY LOW DRONE
  const drone1 = ctx.createOscillator();
  const drone2 = ctx.createOscillator();
  const droneFilter = ctx.createBiquadFilter();

  drone1.type = 'sawtooth';
  drone2.type = 'triangle';

  // Chinese Pentatonic base low tones (Low D at 73.42Hz and Low A at 110.00Hz)
  drone1.frequency.setValueAtTime(73.42, ctx.currentTime);
  drone2.frequency.setValueAtTime(110.00, ctx.currentTime);

  droneFilter.type = 'lowpass';
  droneFilter.frequency.setValueAtTime(120, ctx.currentTime);

  // Very slow LFO for wave modulation (simulating cold wind blowing through the temple)
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.06, ctx.currentTime); // 0.06 Hz
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(35, ctx.currentTime);

  lfo.connect(lfoGain);
  lfoGain.connect(droneFilter.frequency);

  const droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0.18, ctx.currentTime);

  drone1.connect(droneFilter);
  drone2.connect(droneFilter);
  droneFilter.connect(droneGain);
  droneGain.connect(bgMusicGain);

  lfo.start();
  drone1.start();
  drone2.start();

  bgMusicDrone1 = drone1;
  bgMusicDrone2 = drone2;
  bgMusicLfo = lfo;

  // 2. CAVERNOUS DELAY LINE FOR INSTRUMENTAL PLUCKS
  const delayNode = ctx.createDelay();
  delayNode.delayTime.setValueAtTime(0.7, ctx.currentTime); // 700ms echo
  const delayFeedback = ctx.createGain();
  delayFeedback.gain.setValueAtTime(0.42, ctx.currentTime);

  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);
  delayNode.connect(bgMusicGain);

  // 3. PROCEDURAL TRADITIONAL PENTATONIC PLUCKS (Guzheng & Pipa simulation)
  const pentatonicScale = [
    110.00, // A2 (宫/Gong style)
    146.83, // D3 (商/Shang)
    164.81, // E3 (角/Jiao)
    196.00, // G3 (徵/Zhi)
    220.00, // A3 (羽/Yu)
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    587.33, // D5
    659.25, // E5
    880.00  // A5
  ];

  const triggerInstrumentPluck = () => {
    if (isMutedSetting || !bgMusicGain) return;
    const now = ctx.currentTime;

    // Pick a random frequency from our pentatonic scale
    const freq = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];

    const pluckOsc = ctx.createOscillator();
    // Alternating between soft sine and slightly metallic triangle waves
    pluckOsc.type = Math.random() > 0.4 ? 'triangle' : 'sine';
    pluckOsc.frequency.setValueAtTime(freq, now);

    // Apply traditional sliding/vibrato embellishment
    if (Math.random() > 0.6) {
      const slideFreq = freq * (Math.random() > 0.5 ? 1.12 : 0.89);
      pluckOsc.frequency.exponentialRampToValueAtTime(slideFreq, now + 0.18);
    }

    const pluckGain = ctx.createGain();
    pluckGain.gain.setValueAtTime(0, now);
    pluckGain.gain.linearRampToValueAtTime(0.12, now + 0.008);
    pluckGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    pluckOsc.connect(pluckGain);
    pluckGain.connect(bgMusicGain);
    pluckGain.connect(delayNode);

    pluckOsc.start(now);
    pluckOsc.stop(now + 1.5);

    // Occasional breathing Dizi (Flute) sweep notes
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const fluteNow = ctx.currentTime;
        const fluteOsc = ctx.createOscillator();
        fluteOsc.type = 'sine';
        
        // High register pentatonic note
        const fluteFreq = pentatonicScale[6 + Math.floor(Math.random() * 5)];
        fluteOsc.frequency.setValueAtTime(fluteFreq, fluteNow);

        // Flute pitch vibrato
        const vibrato = ctx.createOscillator();
        vibrato.frequency.setValueAtTime(5.8, fluteNow); // 5.8Hz natural vibrato
        const vibratoGain = ctx.createGain();
        vibratoGain.gain.setValueAtTime(fluteFreq * 0.012, fluteNow);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(fluteOsc.frequency);

        const fluteGain = ctx.createGain();
        fluteGain.gain.setValueAtTime(0, fluteNow);
        fluteGain.gain.linearRampToValueAtTime(0.05, fluteNow + 0.3); // Breath attack
        fluteGain.gain.linearRampToValueAtTime(0.03, fluteNow + 0.8);
        fluteGain.gain.exponentialRampToValueAtTime(0.001, fluteNow + 2.0);

        fluteOsc.connect(fluteGain);
        fluteGain.connect(bgMusicGain!);
        fluteGain.connect(delayNode);

        vibrato.start(fluteNow);
        fluteOsc.start(fluteNow);

        vibrato.stop(fluteNow + 2.2);
        fluteOsc.stop(fluteNow + 2.2);
      }, 500);
    }
  };

  // Setup loop for procedural musical events
  const runScheduler = () => {
    const nextTickDelay = 2200 + Math.random() * 2600; // random rhythm pacing
    bgMusicInterval = setTimeout(() => {
      triggerInstrumentPluck();
      runScheduler();
    }, nextTickDelay);
  };

  triggerInstrumentPluck();
  runScheduler();
}

// Automatically bind gesture listeners to play music seamlessly
if (typeof window !== 'undefined') {
  const initMusicOnGesture = () => {
    const ctx = getAudioContext();
    if (ctx) {
      playAmbientMusicTrack(currentTrackType);
    }
    window.removeEventListener('click', initMusicOnGesture);
    window.removeEventListener('keydown', initMusicOnGesture);
  };
  window.addEventListener('click', initMusicOnGesture);
  window.addEventListener('keydown', initMusicOnGesture);
}

/**
 * Procedural Combustion Sound (火)
 * Simulates deep roaring fire with cracking embers.
 */
export function playFireSound() {
  const ctx = getAudioContext();
  if (!ctx || isMutedSetting) return;
  
  // Dip background music over 0.2s for high-priority spell effects (crossfade)
  fadeBgMusic(0.12, 0.2);

  const destination = setupRouting(ctx);
  const duration = 2.0;
  const now = ctx.currentTime;

  // 1. Fire rumble (White noise + low pass filter)
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(180, now);
  lowpass.frequency.exponentialRampToValueAtTime(80, now + duration);
  lowpass.Q.setValueAtTime(5, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.4, now + 0.1);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Modulation to simulate leaping flames
  const modulator = ctx.createOscillator();
  modulator.type = 'sine';
  modulator.frequency.setValueAtTime(8, now); // 8 Hz lick
  const modGain = ctx.createGain();
  modGain.gain.setValueAtTime(0.15, now);

  modulator.connect(modGain);
  modGain.connect(noiseGain.gain);
  
  noiseNode.connect(lowpass);
  lowpass.connect(noiseGain);
  noiseGain.connect(destination);

  // 2. Combustion burst (Slightly pitched low frequency wave with smooth ramp)
  const flameOsc = ctx.createOscillator();
  flameOsc.type = 'triangle';
  flameOsc.frequency.setValueAtTime(65, now);
  flameOsc.frequency.exponentialRampToValueAtTime(40, now + 0.6);

  const flameGain = ctx.createGain();
  flameGain.gain.setValueAtTime(0, now);
  flameGain.gain.linearRampToValueAtTime(0.6, now + 0.04);
  flameGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  flameOsc.connect(flameGain);
  flameGain.connect(destination);

  // 3. Crackling Embers (random popping clicks)
  const numberOfCracks = 12;
  for (let i = 0; i < numberOfCracks; i++) {
    const crackTime = now + 0.1 + Math.random() * (duration - 0.5);
    
    // High-pitched short burst
    const crackOsc = ctx.createOscillator();
    crackOsc.type = 'sine';
    crackOsc.frequency.setValueAtTime(1500 + Math.random() * 2000, crackTime);
    
    const crackGain = ctx.createGain();
    crackGain.gain.setValueAtTime(0, crackTime);
    crackGain.gain.linearRampToValueAtTime(0.12, crackTime + 0.002);
    crackGain.gain.exponentialRampToValueAtTime(0.0001, crackTime + 0.015 + Math.random() * 0.02);
    
    crackOsc.connect(crackGain);
    crackGain.connect(destination);
    
    crackOsc.start(crackTime);
    crackOsc.stop(crackTime + 0.05);
  }

  // Start sound
  noiseNode.start(now);
  modulator.start(now);
  flameOsc.start(now);

  noiseNode.stop(now + duration);
  modulator.stop(now + duration);
  flameOsc.stop(now + 0.8);

  // Smoothly restore background music volume when spell concludes
  setTimeout(() => {
    fadeBgMusic(0.5, 1.4);
  }, duration * 1000);
}

/**
 * Procedural Ethereal Dripping Water Sound (水)
 * Simulates multiple soft cavernous drop echoes.
 */
export function playWaterSound() {
  const ctx = getAudioContext();
  if (!ctx || isMutedSetting) return;

  // Dip background music over 0.2s for high-priority spell effects (crossfade)
  fadeBgMusic(0.15, 0.2);

  const destination = setupRouting(ctx);
  const now = ctx.currentTime;
  const dropsCount = 4;

  for (let i = 0; i < dropsCount; i++) {
    const delay = i * 0.35 + Math.random() * 0.1;
    const dropTime = now + delay;
    const baseFreq = 750 + Math.random() * 300;

    // Pitch sweep (sine wave going quickly up then down, resembling bubble/drip)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, dropTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, dropTime + 0.04);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, dropTime + 0.12);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, dropTime);
    gain.gain.linearRampToValueAtTime(0.35, dropTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.3);

    // Cavern echo (feedback-less simulated delay line)
    const echoGain = ctx.createGain();
    echoGain.gain.setValueAtTime(0.12, dropTime + 0.15);
    echoGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.5);

    osc.connect(gain);
    gain.connect(destination);

    // Staggered echo drop
    const echoOsc = ctx.createOscillator();
    echoOsc.type = 'sine';
    echoOsc.frequency.setValueAtTime(baseFreq * 0.9, dropTime + 0.15);
    echoOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, dropTime + 0.19);
    echoOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, dropTime + 0.27);

    echoOsc.connect(echoGain);
    echoGain.connect(destination);

    osc.start(dropTime);
    osc.stop(dropTime + 0.35);

    echoOsc.start(dropTime + 0.15);
    echoOsc.stop(dropTime + 0.5);
  }

  // Smoothly restore background music volume
  setTimeout(() => {
    fadeBgMusic(0.5, 1.4);
  }, 1800);
}

/**
 * Discordant Buzz/Shock Sound (SCARLET colapso)
 * Instantly conveys unstable failure and danger.
 */
export function playScarletSound() {
  const ctx = getAudioContext();
  if (!ctx || isMutedSetting) return;

  // Dip background music deeply during dramatic failure
  fadeBgMusic(0.05, 0.15);

  const destination = setupRouting(ctx);
  const now = ctx.currentTime;
  const duration = 1.8;

  // Detuned sawtooth oscillators for unstable, vibrating rumble
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  
  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';

  osc1.frequency.setValueAtTime(58, now); // Low A#
  osc2.frequency.setValueAtTime(61.5, now); // highly detuned beat frequency

  // Modulate pitch dynamically for a siren/distortion effect
  osc1.frequency.linearRampToValueAtTime(45, now + 0.3);
  osc2.frequency.linearRampToValueAtTime(47, now + 0.3);

  // Bandpass filter to make it sound sharp, metallic, and resonant
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(250, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
  filter.frequency.exponentialRampToValueAtTime(100, now + 0.8);
  filter.Q.setValueAtTime(8, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.75, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  // Harsh white noise blast for static splash
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(1800, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.3, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(destination);

  // Start all
  osc1.start(now);
  osc2.start(now);
  noise.start(now);

  osc1.stop(now + duration);
  osc2.stop(now + duration);
  noise.stop(now + 0.4);

  // Restore background music smoothly
  setTimeout(() => {
    fadeBgMusic(0.5, 2.0);
  }, duration * 1000);
}

/**
 * Violet True Formula Sound (VIOLET)
 * Heavenly celestial arpeggio (magical chime)
 */
export function playVioletSound() {
  const ctx = getAudioContext();
  if (!ctx || isMutedSetting) return;

  fadeBgMusic(0.1, 0.25);

  const destination = setupRouting(ctx);
  const now = ctx.currentTime;
  
  // Magical Pentatonic / Major 9 chord cascade: F3, C4, G4, C5, E5
  const notes = [174.61, 261.63, 392.00, 523.25, 659.25];
  const delayStep = 0.09;

  notes.forEach((freq, idx) => {
    const playTime = now + (idx * delayStep);
    
    // Combine Sine (purity) and Triangle (body)
    const sineOsc = ctx.createOscillator();
    sineOsc.type = 'sine';
    sineOsc.frequency.setValueAtTime(freq, playTime);

    // High shimmer octave for a touch of stardust sparkle
    const sparkleOsc = ctx.createOscillator();
    sparkleOsc.type = 'triangle';
    sparkleOsc.frequency.setValueAtTime(freq * 2, playTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, playTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, playTime);
    gainNode.gain.linearRampToValueAtTime(0.24, playTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, playTime + 1.8);

    const sparkleGain = ctx.createGain();
    sparkleGain.gain.setValueAtTime(0, playTime);
    sparkleGain.gain.linearRampToValueAtTime(0.08, playTime + 0.02);
    sparkleGain.gain.exponentialRampToValueAtTime(0.0001, playTime + 0.6);

    sineOsc.connect(gainNode);
    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(gainNode);

    gainNode.connect(filter);
    filter.connect(destination);

    sineOsc.start(playTime);
    sparkleOsc.start(playTime);

    sineOsc.stop(playTime + 2.0);
    sparkleOsc.stop(playTime + 1.0);
  });

  // Restore music background volume
  setTimeout(() => {
    fadeBgMusic(0.5, 1.8);
  }, 2600);
}

/**
 * Gold Novel Spell Sound (GOLD)
 * Resonant metallic bell or deep chime
 */
export function playGoldSound() {
  const ctx = getAudioContext();
  if (!ctx || isMutedSetting) return;

  fadeBgMusic(0.12, 0.2);

  const destination = setupRouting(ctx);
  const now = ctx.currentTime;
  const duration = 2.0;

  // Inharmonic frequencies resembling an old monastery bell
  const frequencies = [142, 285, 428, 570, 712, 950];
  const weights = [1.0, 0.6, 0.45, 0.3, 0.2, 0.1];

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    osc.type = idx === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    const gainNode = ctx.createGain();
    const wt = weights[idx] * 0.15;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(wt, now + 0.015);
    // Higher partials decay faster
    const partialDecay = duration / (idx * 0.5 + 1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + partialDecay);

    osc.connect(gainNode);
    gainNode.connect(destination);

    osc.start(now);
    osc.stop(now + duration);
  });

  // Restore ambient music smoothly
  setTimeout(() => {
    fadeBgMusic(0.5, 1.6);
  }, duration * 1000);
}

/**
 * Rest sound effect (Sopa Caliente or Sleeping)
 * A soft, comforting acoustic hum.
 */
export function playRestSound() {
  const ctx = getAudioContext();
  if (!ctx || isMutedSetting) return;

  fadeBgMusic(0.05, 0.4); // Deep dip in background music for deep rest sleep

  const destination = setupRouting(ctx);
  const now = ctx.currentTime;
  const duration = 1.2;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();

  osc1.type = 'sine';
  osc2.type = 'sine';

  osc1.frequency.setValueAtTime(220, now); // A3 (comfortable resonance)
  osc2.frequency.setValueAtTime(330, now); // E4 (perfect fifth)

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(destination);

  osc1.start(now);
  osc2.start(now);

  osc1.stop(now + duration);
  osc2.stop(now + duration);

  // Restore music background volume
  setTimeout(() => {
    fadeBgMusic(0.5, 2.0);
  }, duration * 1000);
}

/**
 * Procedural Celestial Void Soundscape (空 / 🎴)
 * Deep breathing drone with long-decay echoing high chimes and subtle wind noise.
 */
export function startProceduralVoidMusic(ctx: AudioContext) {
  if (synthInterval) clearTimeout(synthInterval);
  const destination = setupRouting(ctx);

  // Background music sub-master gain node
  bgMusicGain = ctx.createGain();
  bgMusicGain.gain.setValueAtTime(0.45, ctx.currentTime);
  bgMusicGain.connect(destination);

  // 1. COSMIC DEEP VOID DRONES (A1 @ 55.00Hz, E2 @ 82.41Hz, C#2 @ 69.30Hz)
  const drone1 = ctx.createOscillator();
  const drone2 = ctx.createOscillator();
  const drone3 = ctx.createOscillator();
  const droneFilter = ctx.createBiquadFilter();

  drone1.type = 'triangle';
  drone2.type = 'sine';
  drone3.type = 'triangle';

  drone1.frequency.setValueAtTime(55.00, ctx.currentTime);  // Deep A1
  drone2.frequency.setValueAtTime(82.41, ctx.currentTime);  // Deep E2
  drone3.frequency.setValueAtTime(69.30, ctx.currentTime);  // SINISTER C#2

  droneFilter.type = 'lowpass';
  droneFilter.frequency.setValueAtTime(90, ctx.currentTime);

  // Slow LFO for sweeping filter cutoffs (wind-tunnel effect)
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.04, ctx.currentTime); // 0.04Hz (very slow)
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(25, ctx.currentTime);

  lfo.connect(lfoGain);
  lfoGain.connect(droneFilter.frequency);

  const droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0.22, ctx.currentTime);

  drone1.connect(droneFilter);
  drone2.connect(droneFilter);
  drone3.connect(droneFilter);
  droneFilter.connect(droneGain);
  droneGain.connect(bgMusicGain);

  lfo.start();
  drone1.start();
  drone2.start();
  drone3.start();

  bgMusicDrone1 = drone1;
  bgMusicDrone2 = drone2;
  bgMusicLfo = lfo;
  activeSynthNodes.push(drone3);

  // 2. CAVERNOUS SPACE DELAY LINE
  const delayNode = ctx.createDelay();
  delayNode.delayTime.setValueAtTime(0.85, ctx.currentTime); // very slow echo
  const delayFeedback = ctx.createGain();
  delayFeedback.gain.setValueAtTime(0.55, ctx.currentTime); // high feedback

  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);
  delayNode.connect(bgMusicGain);

  // 3. CELESTIAL SPIRITUAL CHIMES (High Pitch Pentatonic)
  const voidScale = [
    587.33,  // D5
    659.25,  // E5
    783.99,  // G5
    880.00,  // A5
    1046.50, // C6
    1174.66, // D6
    1318.51  // E6
  ];

  const triggerVoidChime = () => {
    if (isMutedSetting || !bgMusicGain) return;
    const now = ctx.currentTime;

    const freq = voidScale[Math.floor(Math.random() * voidScale.length)];

    const chimeOsc = ctx.createOscillator();
    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(freq, now);

    // Subtle pitch wobble (shimmering)
    const vibrato = ctx.createOscillator();
    vibrato.frequency.setValueAtTime(3.5 + Math.random() * 2, now);
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.setValueAtTime(freq * 0.008, now);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(chimeOsc.frequency);

    const chimeGain = ctx.createGain();
    chimeGain.gain.setValueAtTime(0, now);
    chimeGain.gain.linearRampToValueAtTime(0.06, now + 0.15); // soft swell
    chimeGain.gain.exponentialRampToValueAtTime(0.0005, now + 3.0); // very long decay

    chimeOsc.connect(chimeGain);
    chimeGain.connect(bgMusicGain);
    chimeGain.connect(delayNode);

    vibrato.start(now);
    chimeOsc.start(now);

    vibrato.stop(now + 3.5);
    chimeOsc.stop(now + 3.5);

    // Schedule next chime event
    const nextChimeDelay = 3200 + Math.random() * 3800;
    synthInterval = setTimeout(triggerVoidChime, nextChimeDelay);
  };

  triggerVoidChime();
}


