/* Leise Hintergrundmusik, im Browser erzeugt (Web Audio, keine Musikdatei).
   Startet nur auf Knopfdruck. Die Wahl wird gemerkt: Wer sie eingeschaltet hat,
   hört sie beim nächsten Besuch nach dem ersten Tippen auf die Seite wieder. */
(function () {
  'use strict';
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;

  const AR = document.documentElement.lang === 'ar';
  const T = AR ? { on: 'تشغيل الموسيقى', off: 'إيقاف الموسيقى' } : { on: 'Play music', off: 'Stop music' };
  const KEY = 'ej-music';
  const VOLUME = 0.3;           // leise im Hintergrund (etwa -38 dB, Spitzen -30 dB)

  // Akkorde (MIDI-Noten): Dmaj9 – Bm7 – Gmaj7 – A6/9, je 8 Sekunden
  const CHORDS = [
    { pad: [50, 57, 61, 64, 66], mel: [74, 76, 78, 81, 83, 85] },
    { pad: [47, 54, 57, 62, 66], mel: [74, 76, 78, 81, 83, 86] },
    { pad: [43, 50, 54, 59, 62], mel: [74, 78, 79, 81, 83, 86] },
    { pad: [45, 52, 57, 59, 61], mel: [73, 76, 78, 81, 83, 85] }
  ];
  const BAR = 8;
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);

  let ctx = null, master = null, wet = null, dry = null, timer = null;
  let playing = false, nextBar = 0, bar = 0, nextNote = 0, lastNote = 78, t0 = 0;

  function setup() {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    // Hall: künstliche Raumantwort aus abklingendem Rauschen
    const len = ctx.sampleRate * 3.2;
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const verb = ctx.createConvolver();
    verb.buffer = ir;
    wet = ctx.createGain(); wet.gain.value = 0.55;
    dry = ctx.createGain(); dry.gain.value = 0.6;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass'; tone.frequency.value = 2600;
    wet.connect(verb); verb.connect(tone);
    dry.connect(tone); tone.connect(master);
  }

  // weicher Klangteppich: je Ton zwei leicht verstimmte Sinus-/Dreieckswellen
  function pad(notes, t) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 900; f.Q.value = 0.3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.11, t + 2.5);
    g.gain.setValueAtTime(0.11, t + BAR - 1.5);
    g.gain.linearRampToValueAtTime(0, t + BAR + 2);
    f.connect(g); g.connect(wet); g.connect(dry);
    notes.forEach((n, i) => {
      [-4, 4].forEach(cents => {
        const o = ctx.createOscillator();
        o.type = i === 0 ? 'sine' : 'triangle';
        o.frequency.value = hz(n);
        o.detune.value = cents;
        const v = ctx.createGain();
        v.gain.value = i === 0 ? 0.5 : 0.16;
        o.connect(v); v.connect(f);
        o.start(t); o.stop(t + BAR + 2.2);
      });
    });
  }

  // klavierähnlicher Ton: Grundton + Obertöne, schneller Anschlag, langes Ausklingen
  function bell(n, t, vel) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16 * vel, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.05 * vel, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 4);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(3800, t);
    f.frequency.exponentialRampToValueAtTime(900, t + 2.5);
    f.connect(g); g.connect(wet); g.connect(dry);
    [[1, 1], [2, 0.32], [3, 0.1], [4.01, 0.05]].forEach(([m, a]) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = hz(n) * m;
      const v = ctx.createGain(); v.gain.value = a;
      o.connect(v); v.connect(f);
      o.start(t); o.stop(t + 4.1);
    });
  }

  // Melodie: wenige Töne aus dem Akkord, meist kleine Schritte, mit Pausen
  function melody(until) {
    while (nextNote < until) {
      // Akkord, der zu diesem Zeitpunkt klingt
      const pool = CHORDS[Math.floor((nextNote - t0) / BAR) % CHORDS.length].mel;
      let i = pool.indexOf(lastNote);
      if (i < 0) i = Math.floor(pool.length / 2);
      i = Math.max(0, Math.min(pool.length - 1, i + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]));
      lastNote = pool[i];
      if (Math.random() < 0.82) bell(lastNote, nextNote, 0.6 + Math.random() * 0.4);
      if (Math.random() < 0.18) bell(lastNote - 12, nextNote + 0.02, 0.45);
      nextNote += [1.2, 1.6, 1.6, 2.4, 3.2][Math.floor(Math.random() * 5)];
    }
  }

  function schedule() {
    const ahead = ctx.currentTime + 1.5;
    while (nextBar < ahead) {
      pad(CHORDS[bar].pad, nextBar);
      bar = (bar + 1) % CHORDS.length;
      nextBar += BAR;
    }
    melody(ahead);
  }

  function start() {
    if (!ctx) setup();
    ctx.resume();
    const t = ctx.currentTime + 0.05;
    if (nextBar < t) { t0 = nextBar = t; bar = 0; nextNote = t + 1.5; }
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(VOLUME, t + 4);
    schedule();
    clearInterval(timer);
    timer = setInterval(schedule, 400);
    playing = true;
    show();
  }

  function stop() {
    playing = false;
    show();
    if (!ctx) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0, t + 1.2);
    setTimeout(() => {
      if (playing) return;
      clearInterval(timer);
      ctx.suspend();
      nextBar = 0; nextNote = 0;
    }, 1400);
  }

  // ---------- Knopf ----------
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'music-btn';
  btn.innerHTML =
    '<svg class="music-note" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>' +
    '<span class="music-bars" aria-hidden="true"><i></i><i></i><i></i></span>';
  document.body.appendChild(btn);
  function show() {
    btn.classList.toggle('is-on', playing);
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.setAttribute('aria-label', playing ? T.off : T.on);
    btn.title = playing ? T.off : T.on;
  }
  show();
  btn.addEventListener('click', () => {
    if (playing) { stop(); try { localStorage.setItem(KEY, 'off'); } catch (e) {} }
    else { start(); try { localStorage.setItem(KEY, 'on'); } catch (e) {} }
  });

  // Früher eingeschaltet: beim ersten Tippen/Klicken auf die Seite wieder starten
  let wanted = false;
  try { wanted = localStorage.getItem(KEY) === 'on'; } catch (e) {}
  if (wanted) {
    const resume = e => {
      window.removeEventListener('pointerdown', resume, true);
      window.removeEventListener('keydown', resume, true);
      if (!playing && !btn.contains(e.target)) start();
    };
    window.addEventListener('pointerdown', resume, true);
    window.addEventListener('keydown', resume, true);
  }

  // Tab im Hintergrund: Ton anhalten (spart Akku), beim Zurückkommen weiter
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !playing) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });
})();
