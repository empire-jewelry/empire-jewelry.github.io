/* Leise Klaviermusik im Hintergrund: Erik Satie, Gymnopédie Nr. 1,
   gespielt von Robin Alciatore (Musopen, gemeinfrei, über Wikimedia Commons).
   Startet nur auf Knopfdruck, die Datei wird erst dann geladen. Die Wahl wird gemerkt:
   Wer die Musik eingeschaltet hat, hört sie beim nächsten Besuch nach dem ersten Tippen wieder. */
(function () {
  'use strict';
  const AC = window.AudioContext || window.webkitAudioContext;

  const AR = document.documentElement.lang === 'ar';
  const T = AR ? { on: 'تشغيل الموسيقى', off: 'إيقاف الموسيقى' } : { on: 'Play music', off: 'Stop music' };
  const KEY = 'ej-music';
  const SRC = (AR ? '../' : '') + 'audio/piano.mp3';
  const VOLUME = 1;      // Aufnahme ist selbst sehr leise (etwa -40 dB), so bleibt sie im Hintergrund
  const PAUSE = 4000;    // Pause in ms, bevor das Stück von vorn beginnt

  let audio = null, ctx = null, gain = null, playing = false, again = null;

  function setup() {
    audio = new Audio();
    audio.src = SRC;
    audio.preload = 'auto';
    audio.addEventListener('ended', () => {
      clearTimeout(again);
      again = setTimeout(() => {
        again = null;
        if (playing) { audio.currentTime = 0; audio.play().catch(() => {}); }
      }, PAUSE);
    });
    // Lautstärke über Web Audio (iPhones ignorieren audio.volume)
    if (AC) {
      try {
        ctx = new AC();
        gain = ctx.createGain();
        gain.gain.value = 0;
        ctx.createMediaElementSource(audio).connect(gain);
        gain.connect(ctx.destination);
      } catch (e) { ctx = null; }
    }
    if (!ctx) audio.volume = 0;
  }

  // weich ein- und ausblenden
  function fade(to, sec) {
    if (ctx) {
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(to, t + sec);
    } else {
      const from = audio.volume, t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / (sec * 1000));
        audio.volume = from + (to - from) * k;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }

  function start() {
    if (!audio) setup();
    playing = true;
    show();
    if (ctx) ctx.resume();
    audio.play().then(() => fade(VOLUME, 3)).catch(() => { playing = false; show(); });
  }

  function stop() {
    playing = false;
    show();
    clearTimeout(again);
    again = null;
    if (!audio) return;
    fade(0, 1.2);
    setTimeout(() => { if (!playing) audio.pause(); }, 1300);
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

  // Tab im Hintergrund: anhalten, beim Zurückkommen weiter
  document.addEventListener('visibilitychange', () => {
    if (!audio || !playing) return;
    if (document.hidden) audio.pause();
    else if (audio.paused && !again) audio.play().catch(() => {});
  });
})();
