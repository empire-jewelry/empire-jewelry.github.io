/* Empire Jewelry – Startseite: fotorealistischer Ring (in Blender mit Cycles gerendert)
   und kleine Lichtpunkte, die über die Steine wandern, wie im Juwelier-Schaufenster.
   Die Positionen der Steine kommen aus img/ring-points.json (beim Rendern berechnet).
   Steine nur noch grün (img/ring-emerald.webp). */
(() => {
  'use strict';
  const stage = document.querySelector('[data-ring]');
  if (!stage) return;
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const base = stage.dataset.src;                       // z. B. "img/ring-"
  const canvas = stage.querySelector('.ring-glints');
  const ctx = canvas.getContext('2d');

  if (REDUCE) return;

  // ---------- Lichtpunkte ----------
  let pts = [], gemRel = 0.025;
  const glints = [];
  let w = 0, h = 0, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = stage.clientWidth; h = stage.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  function spawn(i) {
    const p = pts[i];
    glints.push({ x: p[0], y: p[1], t0: performance.now(), life: 650 + Math.random() * 500, k: 0.55 + 0.45 * p[2] * Math.random() + 0.2, rot: (Math.random() - 0.5) * 0.5 });
  }
  function burst(n) {
    for (let i = 0; i < n && pts.length; i++) setTimeout(() => spawn(Math.floor(Math.random() * pts.length)), i * 60);
  }

  function star(x, y, size, a, rot) {
    // feiner Kern + vier dünne Strahlen + zwei kürzere schräge
    const g = ctx.createRadialGradient(x, y, 0, x, y, size * 0.55);
    g.addColorStop(0, 'rgba(255,255,255,' + a + ')');
    g.addColorStop(0.25, 'rgba(255,250,235,' + a * 0.55 + ')');
    g.addColorStop(1, 'rgba(255,245,220,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, size * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    const ray = (len, wid, alpha) => {
      const lg = ctx.createLinearGradient(-len, 0, len, 0);
      lg.addColorStop(0, 'rgba(255,255,255,0)');
      lg.addColorStop(0.5, 'rgba(255,255,255,' + alpha + ')');
      lg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = lg;
      ctx.fillRect(-len, -wid / 2, len * 2, wid);
    };
    ray(size * 1.6, Math.max(1, size * 0.07), a);
    ctx.rotate(Math.PI / 2); ray(size * 1.6, Math.max(1, size * 0.07), a);
    ctx.rotate(Math.PI / 4); ray(size * 0.7, Math.max(0.8, size * 0.05), a * 0.5);
    ctx.rotate(Math.PI / 2); ray(size * 0.7, Math.max(0.8, size * 0.05), a * 0.5);
    ctx.restore();
  }

  // Ein „Lichtband“ wandert langsam über den Ring; dort funkeln Steine öfter auf, dazwischen einzelne zufällig
  let lastSpawn = 0, running = false, visible = true;
  function frame(now) {
    running = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (pts.length && now - lastSpawn > 140) {
      lastSpawn = now;
      const sweep = 0.5 + 0.38 * Math.sin(now / 2600);
      const near = [];
      for (let i = 0; i < pts.length; i++) if (Math.abs(pts[i][0] - sweep) < 0.05) near.push(i);
      if (near.length && Math.random() < 0.75) spawn(near[Math.floor(Math.random() * near.length)]);
      if (Math.random() < 0.3) spawn(Math.floor(Math.random() * pts.length));
    }
    ctx.globalCompositeOperation = 'lighter';
    const gem = gemRel * w * dpr;
    for (let i = glints.length - 1; i >= 0; i--) {
      const g = glints[i];
      const t = (now - g.t0) / g.life;
      if (t >= 1) { glints.splice(i, 1); continue; }
      const a = Math.pow(Math.sin(Math.PI * t), 2) * g.k;
      star(g.x * w * dpr, g.y * h * dpr, gem * (0.5 + 0.6 * a), Math.min(1, a), g.rot + t * 0.4);
    }
    ctx.globalCompositeOperation = 'source-over';
    if (visible && !document.hidden) { running = true; requestAnimationFrame(frame); }
  }
  function start() { if (!running && visible) { running = true; requestAnimationFrame(frame); } }

  new IntersectionObserver(es => { visible = es[0].isIntersecting; start(); }, { threshold: 0.05 }).observe(stage);
  document.addEventListener('visibilitychange', start);

  fetch(base + 'points.json')
    .then(r => r.json())
    .then(d => { pts = d.points || []; gemRel = d.gem_px_rel || gemRel; burst(6); start(); })
    .catch(() => {});
})();
