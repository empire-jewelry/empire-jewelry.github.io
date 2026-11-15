/* Empire Jewelry – Namenskette (Studio), Baukasten, Glitzer, WhatsApp-Nachrichten,
   Menü, Kollektion-Filter und Relief-Ornamente.
   Läuft ohne Server: Anfragen gehen als vorbereitete WhatsApp-Nachricht raus.
   GSAP und Lenis sind optional; ohne sie (oder bei „weniger Bewegung“) wird alles still gezeichnet. */
(() => {
  'use strict';

  const LANG = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const WA_NUMBER = '96170894976'; // aus den Instagram-Texten (70894976), bitte bestätigen lassen
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ANIM = !!window.gsap && !REDUCE;
  const NS = 'http://www.w3.org/2000/svg';
  const wa = text => 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);

  const TXT = {
    en: {
      helloName: 'Hello Empire Jewelry, I designed this name necklace on your website:',
      hello: 'Hello Empire Jewelry, I designed this piece on your website:',
      ask: 'Can you make it? What would it cost?',
      askPiece: 'Hello Empire Jewelry, I saw this piece on your website: ',
      askPiece2: '. Is it available, and what does it cost?',
      idea: 'Hello Empire Jewelry, I have an idea for a custom piece: ',
      letter: 'Letter',
      chain: 'Chain length', ring: 'Ring size', bracelet: 'Bracelet length', notSure: 'Not sure',
      cm: n => n + ' cm', ringSize: n => 'EU ' + n,
      karat: ', 18k', similar: 'Similar to the photo:',
      fallbackName: 'Layla', amp: '&', sketch: 'Sketch:', menu: 'Menu', close: 'Close'
    },
    ar: {
      helloName: 'مرحباً Empire Jewelry، صممت هذه القلادة بالاسم على موقعكم:',
      hello: 'مرحباً Empire Jewelry، صممت هذه القطعة على موقعكم:',
      ask: 'هل يمكنكم تنفيذها؟ وكم السعر؟',
      askPiece: 'مرحباً Empire Jewelry، رأيت هذه القطعة على موقعكم: ',
      askPiece2: '. هل هي متوفرة، وكم سعرها؟',
      idea: 'مرحباً Empire Jewelry، عندي فكرة لقطعة خاصة: ',
      letter: 'الحرف',
      chain: 'طول السلسلة', ring: 'مقاس الخاتم', bracelet: 'طول الإسوارة', notSure: 'لا أعرف',
      cm: n => n + ' سم', ringSize: n => 'مقاس ' + n,
      karat: ' عيار ١٨', similar: 'مثل الصورة:',
      fallbackName: 'ليلى', amp: 'و', sketch: 'رسم:', menu: 'القائمة', close: 'إغلاق'
    }
  }[LANG];

  // Größen im Baukasten: Platzhalter, mit dem Geschäft abstimmen
  const SIZE_KIND = { pendant: 'chain', initial: 'chain', ring: 'ring', bracelet: 'bracelet', earrings: null };
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const SIZES = {
    chain: { list: [40, 42, 45, 50].map(TXT.cm), def: 2 },
    ring: { list: [TXT.notSure].concat(range(48, 62).map(TXT.ringSize)), def: 0 },
    bracelet: { list: [TXT.notSure].concat([15, 16, 17, 18, 19].map(TXT.cm)), def: 0 }
  };

  const METALS = {
    yellow: ['#6e5113', '#b98f2e', '#f5e2a2', '#d2aa4c', '#8a671c'],
    rose: ['#7a473a', '#c28674', '#f7d6ca', '#d59d8b', '#8d5848'],
    white: ['#6c7075', '#b6bac0', '#f8f8f6', '#cdd1d5', '#7e848a']
  };
  const ENAMEL = { none: null, red: '#c8313a', pink: '#f2a7bb', mint: '#9fd8c4', turquoise: '#3fb8c0', white: '#f7f5f0', black: '#232323' };
  const STONE = { none: null, clear: '#e6eefc', pink: '#f39bbb', blue: '#3f6fd1', green: '#2f9d63', red: '#c4243f' };

  // Schriften wie bei Namensketten üblich: Schreibschrift, Druckschrift, Old English, arabische Kalligrafie
  const FONTS = {
    script: { family: '"Great Vibes", "Aref Ruqaa", cursive', weight: 400, scale: 1.3, kind: 'script' },
    allura: { family: '"Allura", "Aref Ruqaa", cursive', weight: 400, scale: 1.32, kind: 'script' },
    sacramento: { family: '"Sacramento", "Aref Ruqaa", cursive', weight: 400, scale: 1.4, kind: 'script', thin: true },
    dancing: { family: '"Dancing Script", "Aref Ruqaa", cursive', weight: 700, scale: 1.05, kind: 'script' },
    pacifico: { family: '"Pacifico", "Aref Ruqaa", cursive', weight: 400, scale: 0.86, kind: 'script' },
    serif: { family: '"Playfair Display", "Amiri", serif', weight: 700, scale: 0.88, kind: 'print', spacing: -0.02 },
    block: { family: '"Montserrat", "Reem Kufi", sans-serif', weight: 700, scale: 0.72, kind: 'print', upper: true, spacing: -0.01 },
    bubble: { family: '"Fredoka", "Reem Kufi", sans-serif', weight: 600, scale: 0.86, kind: 'print', spacing: -0.05 },
    gothic: { family: '"UnifrakturMaguntia", "Aref Ruqaa", serif', weight: 400, scale: 0.95, kind: 'print', spacing: -0.02 },
    calligraphy: { family: '"Aref Ruqaa", serif', weight: 700, scale: 1.0, kind: 'arabic' },
    naskh: { family: '"Amiri", serif', weight: 700, scale: 0.95, kind: 'arabic' },
    modern: { family: '"Reem Kufi", "Alexandria", sans-serif', weight: 600, scale: 0.88, kind: 'arabic' },
    nastaliq: { family: '"Gulzar", "Aref Ruqaa", serif', weight: 400, scale: 0.9, kind: 'arabic' },
    katibeh: { family: '"Katibeh", "Aref Ruqaa", serif', weight: 400, scale: 1.2, kind: 'arabic' }
  };
  const font = () => FONTS[state.style] || FONTS.script;

  // Motive im Feld 0..100. hang = Aufhängepunkt, stone = Platz für den Stein, glints = Funkelpunkte
  const P = (d, r) => ({ t: 'path', a: { d }, r });
  const MOTIFS = {
    butterfly: {
      hang: [50, 38], stone: [50, 41], glints: [[28, 28], [72, 28], [27, 74], [72, 74], [50, 58]],
      shapes: [
        P('M48 46C38 20 14 12 8 22C2 34 18 48 48 50Z', 'body'),
        P('M48 53C30 54 14 64 18 78C22 90 40 80 48 59Z', 'body'),
        P('M52 46C62 20 86 12 92 22C98 34 82 48 52 50Z', 'body'),
        P('M52 53C70 54 86 64 82 78C78 90 60 80 52 59Z', 'body'),
        { t: 'ellipse', a: { cx: 50, cy: 56, rx: 3.2, ry: 15 }, r: 'dot' },
        P('M49 42C46 33 42 28 37 25M51 42C54 33 58 28 63 25', 'line')
      ]
    },
    flower: {
      hang: [50, 12], stone: [50, 50], glints: [[50, 22], [77, 42], [67, 75], [33, 75], [23, 42]],
      shapes: [0, 72, 144, 216, 288].map(a => ({ t: 'ellipse', a: { cx: 50, cy: 31, rx: 13, ry: 19, transform: 'rotate(' + a + ' 50 50)' }, r: 'body' }))
        .concat([{ t: 'circle', a: { cx: 50, cy: 50, r: 8 }, r: 'dot' }])
    },
    heart: {
      hang: [50, 31], stone: [50, 54], glints: [[30, 30], [70, 30], [50, 72], [22, 46], [78, 46]],
      shapes: [P('M50 86C20 64 6 46 14 30C22 14 42 16 50 32C58 16 78 14 86 30C94 46 80 64 50 86Z', 'body')]
    },
    leaf: {
      hang: [50, 8], stone: [50, 27], glints: [[50, 40], [38, 60], [62, 56], [50, 80]],
      shapes: [
        P('M50 8C78 26 84 64 50 92C16 64 22 26 50 8Z', 'body'),
        P('M50 20V86M50 42L37 32M50 42L63 32M50 60L34 50M50 60L66 50M50 76L39 68M50 76L61 68', 'line')
      ]
    },
    map: {
      // aus echten Koordinaten (Küste, Grenzen) vereinfacht; Stein sitzt bei Nabatieh
      hang: [62, 10], stone: [34, 76], glints: [[60, 20], [70, 30], [52, 45], [45, 60], [28, 80]],
      shapes: [P('M55 10L65 10L75 8L83 15L81 26L73 41L60 60L50 75L40 82L37 90L17 90L21 82L29 67L33 58L33 49L40 45L41 38L42 31L48 20L53 15Z', 'body')]
    },
    cedar: {
      hang: [50, 8], stone: [50, 22], glints: [[50, 32], [36, 56], [64, 56], [50, 70]],
      shapes: [P('M50 8L62 26H56L70 44H61L78 64H55V80H45V64H22L39 44H30L44 26H38Z', 'body')]
    }
  };

  // kleine Anhänger an der Namenskette (Einheitsfeld -0.5..0.5)
  const CHARMS = {
    heart: 'M0 .38C-.32 .14-.5-.06-.42-.24C-.34-.42-.12-.42 0-.24C.12-.42 .34-.42 .42-.24C.5-.06 .32 .14 0 .38Z',
    star: 'M0-.5L.12-.16L.48-.15L.19 .07L.3 .42L0 .21L-.3 .42L-.19 .07L-.48-.15L-.12-.16Z',
    crown: 'M-.5 .3L-.46-.22L-.22 .02L0-.36L.22 .02L.46-.22L.5 .3Z',
    butterfly: 'M-.04-.06C-.16-.4-.46-.46-.48-.28C-.5-.1-.3 0-.04 0C-.3 .02-.44 .2-.36 .34C-.26 .46-.08 .3-.04 .06ZM.04-.06C.16-.4 .46-.46 .48-.28C.5-.1 .3 0 .04 0C.3 .02 .44 .2 .36 .34C.26 .46 .08 .3 .04 .06Z',
    cedar: 'M0-.5L.16-.24H.08L.28 0H.14L.38 .28H.07V.46H-.07V.28H-.38L-.14 0H-.28L-.08-.24H-.16Z',
    sparkle: 'M0-.5C.04-.12 .12-.04 .5 0C.12 .04 .04 .12 0 .5C-.04 .12-.12 .04-.5 0C-.12-.04-.04-.12 0-.5Z',
    infinity: 'M-.46 0C-.46-.2-.2-.22 0 0C.2 .22 .46 .2 .46 0C.46-.2 .2-.22 0 0C-.2 .22-.46 .2-.46 0Z'
  };

  // Kettenarten, wie sie bei Namensketten angeboten werden
  const CHAINS = {
    cable: { step: 3.6, adv: 0.72, draw(g, len, i, tr) {
      if (i % 2 === 0) el('ellipse', { rx: len * 0.6, ry: len * 0.34, 'stroke-width': len * 0.19, transform: tr }, g);
      else el('line', { x1: -len * 0.55, x2: len * 0.55, y1: 0, y2: 0, 'stroke-width': len * 0.27, transform: tr }, g);
    } },
    rolo: { step: 3.4, adv: 0.82, draw(g, len, i, tr) { el('circle', { r: len * 0.42, 'stroke-width': len * 0.22, transform: tr }, g); } },
    box: { step: 3.0, adv: 1.0, draw(g, len, i, tr) { el('rect', { x: -len * 0.44, y: -len * 0.44, width: len * 0.88, height: len * 0.88, 'stroke-width': len * 0.2, transform: tr }, g); } },
    figaro: { pattern: [3.0, 3.0, 3.0, 6.8], adv: 0.84, draw(g, len, i, tr) { el('ellipse', { rx: len * 0.55, ry: 1.3, 'stroke-width': 0.8, transform: tr }, g); } },
    cuban: { step: 4.8, adv: 0.6, draw(g, len, i, tr, ctx) {
      el('ellipse', { rx: len * 0.62, ry: len * 0.46, fill: ctx.metal, stroke: ctx.dark, 'stroke-opacity': 0.5, 'stroke-width': 0.5, transform: tr }, g);
      el('line', { x1: -len * 0.3, x2: len * 0.3, y1: 0, y2: 0, stroke: ctx.dark, 'stroke-opacity': 0.55, 'stroke-width': 0.7, transform: tr }, g);
    } },
    snake: { solid: 2.2, mark: 1.1, ang: 90 },
    rope: { solid: 2.5, mark: 1.5, ang: 38 }
  };

  const STAR = 'M0-10C.9-2.2 2.2-.9 10 0C2.2.9.9 2.2 0 10C-.9 2.2-2.2.9-10 0C-2.2-.9-.9-2.2 0-10Z';

  // ---------- Zustand (Startwerte aus dem HTML) ----------
  const state = {
    piece: 'pendant', gold: 'yellow', text: TXT.fallbackName, text2: '', join: 'heart', style: 'script',
    accent: 'none', underline: 'none', thick: 'std', chain: 'cable', motif: 'butterfly', enamel: 'none',
    stone: 'none', size: '', len: '', notes: ''
  };
  const controls = Array.from(document.querySelectorAll('[data-sync] [data-key]'));
  const seen = new Set();
  controls.forEach(c => {
    const k = c.dataset.key;
    if (c.type === 'radio') {
      if (c.checked) state[k] = c.value;
    } else if (!seen.has(k) && !(c.tagName === 'SELECT' && !c.options.length)) {
      state[k] = c.value;
      seen.add(k);
    }
  });

  const forms = Array.from(document.querySelectorAll('[data-form]'));
  const builder = document.querySelector('[data-form="builder"]');
  const sizeSel = document.getElementById('b-size');
  const sizeLabel = document.getElementById('b-size-label');
  const previews = Array.from(document.querySelectorAll('svg.preview'));
  const heroSvg = document.querySelector('svg.preview[data-pid="h"]');

  // ---------- Hilfen ----------
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const isArabic = s => /[؀-ۿݐ-ݿ]/.test(s);
  const chars = s => Array.from(s);
  const nameText = s => chars(String(s || '').trim()).slice(0, 14).join('');
  function firstLetter(s) {
    const c = chars(s)[0] || '';
    return isArabic(c) ? c : c.toUpperCase();
  }
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const to = amt < 0 ? 0 : 255, p = Math.abs(amt);
    const ch = v => Math.round(v + (to - v) * p);
    const r = ch(n >> 16), g = ch((n >> 8) & 255), b = ch(n & 255);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // ---------- Zeichnen: Hintergrund, Filter ----------
  // Untergrund wie bei Produktfotos: heller Karton mit feiner Körnung (Farbverlauf kommt aus dem CSS der Bühne)
  function background(svg, id, defs) {
    const nf = el('filter', { id: id + '-grain', x: 0, y: 0, width: '100%', height: '100%' }, defs);
    el('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.85, numOctaves: 2, seed: 4, result: 'n' }, nf);
    el('feColorMatrix', { in: 'n', type: 'matrix', values: '0 0 0 0 .45 0 0 0 0 .4 0 0 0 0 .33 0 0 0 .08 0' }, nf);
    el('rect', { x: 0, y: 0, width: 400, height: 300, filter: 'url(#' + id + '-grain)' }, svg);
  }

  // Goldplatte: Kanten mit Licht (Relief), Glanz, weicher Schatten
  function plateFilter(ctx) {
    const thick = state.thick === 'thick';
    const f = el('filter', { id: ctx.id + '-plate', x: '-15%', y: '-45%', width: '130%', height: '200%', 'color-interpolation-filters': 'sRGB' }, ctx.defs);
    el('feGaussianBlur', { in: 'SourceAlpha', stdDeviation: thick ? 1.1 : 0.8, result: 'b' }, f);
    const sp = el('feSpecularLighting', { in: 'b', surfaceScale: thick ? 3.4 : 2.5, specularConstant: 1.0, specularExponent: 24, 'lighting-color': '#fff6dc', result: 's' }, f);
    el('feDistantLight', { azimuth: 225, elevation: 52 }, sp);
    el('feComposite', { in: 's', in2: 'SourceAlpha', operator: 'in', result: 's2' }, f);
    const df = el('feDiffuseLighting', { in: 'b', surfaceScale: thick ? 3.4 : 2.5, diffuseConstant: 1.18, 'lighting-color': '#ffffff', result: 'd' }, f);
    el('feDistantLight', { azimuth: 225, elevation: 58 }, df);
    el('feComposite', { in: 'SourceGraphic', in2: 'd', operator: 'arithmetic', k1: 1, k2: 0, k3: 0, k4: 0, result: 'lit' }, f);
    el('feComposite', { in: 'lit', in2: 's2', operator: 'arithmetic', k1: 0, k2: 1, k3: 0.8, k4: 0, result: 'shine' }, f);
    el('feComposite', { in: 'shine', in2: 'SourceAlpha', operator: 'in', result: 'metal' }, f);
    el('feGaussianBlur', { in: 'SourceAlpha', stdDeviation: 1.8, result: 'sb' }, f);
    el('feOffset', { in: 'sb', dx: 1.2, dy: 2.6, result: 'so' }, f);
    el('feFlood', { 'flood-color': '#2b2008', 'flood-opacity': 0.26, result: 'fc' }, f);
    el('feComposite', { in: 'fc', in2: 'so', operator: 'in', result: 'shadow' }, f);
    const mg = el('feMerge', null, f);
    el('feMergeNode', { in: 'shadow' }, mg);
    el('feMergeNode', { in: 'metal' }, mg);
  }

  // ---------- Kette Glied für Glied ----------
  function linkChain(ctx, d) {
    const T = CHAINS[state.chain] || CHAINS.cable;
    const guide = el('path', { d, fill: 'none', stroke: 'none' }, ctx.chainG);
    ctx.chains.push(guide);
    const L = guide.getTotalLength();
    const g = el('g', { fill: 'none', stroke: ctx.metal, 'stroke-linecap': 'round' }, ctx.chainG);
    const at = s => {
      const p = guide.getPointAtLength(Math.max(0, Math.min(L, s)));
      const a = guide.getPointAtLength(Math.max(0, s - 0.6)), b = guide.getPointAtLength(Math.min(L, s + 0.6));
      return 'translate(' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ') rotate(' + (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI).toFixed(1) + ')';
    };
    if (T.solid) {
      el('path', { d, stroke: ctx.dark, 'stroke-opacity': 0.4, 'stroke-width': T.solid + 0.7 }, g);
      el('path', { d, 'stroke-width': T.solid }, g);
      for (let s = T.mark / 2; s < L; s += T.mark) {
        el('line', { x1: 0, x2: 0, y1: -T.solid * 0.48, y2: T.solid * 0.48, stroke: ctx.dark, 'stroke-opacity': 0.45, 'stroke-width': 0.45, transform: at(s) + ' rotate(' + (T.ang - 90) + ')' }, g);
      }
      return;
    }
    let s = 0, i = 0;
    while (s < L) {
      const len = T.pattern ? T.pattern[i % T.pattern.length] : T.step;
      T.draw(g, len, i, at(s + len / 2), ctx);
      s += len * T.adv;
      i++;
    }
  }
  function jumpRing(ctx, x, y) {
    el('circle', { cx: x, cy: y, r: 2.3, fill: 'none', stroke: ctx.metal, 'stroke-width': 1.3 }, ctx.g);
  }
  function bail(ctx, x, y) {
    el('ellipse', { cx: x, cy: y, rx: 3.2, ry: 4.6, fill: 'none', stroke: ctx.metal, 'stroke-width': 1.8 }, ctx.g);
  }

  function stoneGrad(ctx) {
    const c = STONE[state.stone];
    if (!c) return null;
    if (!ctx.stoneId) {
      ctx.stoneId = ctx.id + '-stone';
      const rg = el('radialGradient', { id: ctx.stoneId, cx: '38%', cy: '34%', r: '70%' }, ctx.defs);
      el('stop', { offset: 0, 'stop-color': '#ffffff' }, rg);
      el('stop', { offset: 0.3, 'stop-color': shade(c, 0.3) }, rg);
      el('stop', { offset: 0.7, 'stop-color': c }, rg);
      el('stop', { offset: 1, 'stop-color': shade(c, -0.45) }, rg);
    }
    return 'url(#' + ctx.stoneId + ')';
  }
  function drawStone(ctx, x, y, r) {
    const fill = stoneGrad(ctx);
    if (!fill) return;
    el('circle', { cx: x, cy: y, r: r + 1.6, fill: ctx.metal, stroke: ctx.dark, 'stroke-opacity': 0.4, 'stroke-width': 0.6 }, ctx.g);
    el('circle', { cx: x, cy: y, r, fill }, ctx.g);
    el('circle', { cx: x - r * 0.35, cy: y - r * 0.38, r: r * 0.28, fill: '#fff', opacity: 0.85 }, ctx.g);
    ctx.glints.push([x - r * 0.2, y - r * 0.2]);
  }

  // ---------- Namensplatte ----------
  // Baut Name(n), Verbinder, Anhänger, Unterstrich und Krone als eine Goldplatte.
  // Rückgabe in SVG-Koordinaten: Box und die Punkte, an denen die Kette eingehängt wird.
  function namePlate(ctx, cx, baseY, maxW, maxSize, allowSecond) {
    const F = font();
    const raw1 = nameText(state.text);
    const raw2 = allowSecond ? nameText(state.text2) : '';
    const n1 = raw1 || TXT.fallbackName;
    const rtl = isArabic(n1);
    const S = 40;                       // Layout-Schriftgröße, danach skaliert
    const fs = S * F.scale;
    plateFilter(ctx);
    const fg = el('g', { filter: 'url(#' + ctx.id + '-plate)' }, ctx.g);
    if (!raw1) fg.setAttribute('opacity', 0.4);
    const outer = el('g', null, fg);
    const edge = el('use', { href: '#' + ctx.id + '-pi', fill: ctx.dark, stroke: ctx.dark }, outer);
    const main = el('g', { fill: ctx.metal, stroke: ctx.metal }, outer);
    const inner = el('g', { id: ctx.id + '-pi' }, main);

    const mkText = txt => {
      const t = el('text', { x: 0, y: 0, 'font-family': F.family, 'font-weight': F.weight, 'font-size': fs, 'stroke-width': F.thin ? 1.2 : 0.35, 'stroke-linejoin': 'round' }, inner);
      if (F.spacing) t.style.letterSpacing = F.spacing + 'em';
      t.textContent = F.upper && !isArabic(txt) ? txt.toUpperCase() : txt;
      return t;
    };
    const items = [];
    const t1 = mkText(n1);
    items.push({ kind: 'text', el: t1 });
    if (raw2) {
      if (state.join === 'amp') items.push({ kind: 'text', el: mkText(isArabic(raw2) || rtl ? TXT.amp : '&') });
      else items.push({ kind: 'charm', name: state.join === 'infinity' ? 'infinity' : 'heart', size: fs * 0.42 });
      items.push({ kind: 'text', el: mkText(raw2) });
    }
    const heartStone = state.accent === 'heart' && STONE[state.stone];
    if (state.accent !== 'none' && state.accent !== 'crown') items.push({ kind: 'charm', name: state.accent, size: fs * 0.46, stone: heartStone, accent: true });
    if (STONE[state.stone] && !heartStone) items.push({ kind: 'stone', size: fs * 0.3 });
    if (rtl) items.reverse();

    // nebeneinander anordnen
    const gap = fs * 0.12;
    let x = 0;
    const midY = -fs * 0.3;
    items.forEach(it => {
      if (it.kind === 'text') {
        const bb = it.el.getBBox();
        it.el.setAttribute('x', x - bb.x);
        it.w = bb.width;
      } else {
        it.w = it.size * 1.05;
        it.cx = x + it.w / 2;
        if (it.kind === 'charm') {
          const fill = it.stone ? stoneGrad(ctx) : null;
          const p = el('path', { d: CHARMS[it.name], transform: 'translate(' + it.cx + ' ' + midY + ') scale(' + it.size + ')', 'stroke-width': (it.stone ? 2.4 : 0.6) / it.size }, inner);
          if (it.name === 'infinity') { p.setAttribute('fill', 'none'); p.setAttribute('stroke-width', fs * 0.06 / it.size); }
          if (fill) p.setAttribute('fill', fill);
        }
      }
      x += it.w + gap;
    });
    const textEls = items.filter(it => it.kind === 'text').map(it => it.el);
    const left = 0, right = x - gap;

    // Krone über dem ersten Buchstaben
    if (state.accent === 'crown') {
      let r = null;
      try { r = t1.getExtentOfChar(0); } catch (e) { r = null; }
      const bb1 = t1.getBBox();
      const ccx = r ? r.x + r.width / 2 : bb1.x + fs * 0.3;
      el('path', { d: CHARMS.crown, transform: 'translate(' + ccx + ' ' + (bb1.y - fs * 0.05) + ') scale(' + fs * 0.42 + ')', 'stroke-width': 0.6 / (fs * 0.42) }, inner);
    }

    // Unterstrich: Schwung oder gerader Steg (Druckschrift braucht einen Steg, sonst halten die Buchstaben nicht)
    let ul = state.underline;
    if (F.kind === 'print' && ul === 'none') ul = 'bar';
    if (ul === 'swash') {
      const y0 = fs * 0.12, W = right - left;
      el('path', {
        d: 'M' + (left - fs * 0.04) + ' ' + (y0 - fs * 0.02) + 'C' + (left + W * 0.3) + ' ' + (y0 + fs * 0.12) + ' ' + (right - W * 0.3) + ' ' + (y0 + fs * 0.02) + ' ' + (right + fs * 0.08) + ' ' + (y0 - fs * 0.12),
        fill: 'none', 'stroke-width': fs * 0.07, 'stroke-linecap': 'round'
      }, inner);
    } else if (ul === 'bar') {
      el('rect', { x: left - fs * 0.02, y: -fs * 0.02, width: right - left + fs * 0.04, height: fs * 0.075, rx: fs * 0.03, 'stroke-width': 0.3 }, inner);
    }

    // auf Zielgröße bringen und zentrieren
    const bb = inner.getBBox();
    const k = Math.min(maxSize / S, maxW / Math.max(1, bb.width));
    const tx = cx - (bb.x + bb.width / 2) * k;
    outer.setAttribute('transform', 'translate(' + tx.toFixed(2) + ' ' + baseY + ') scale(' + k.toFixed(4) + ')');
    const off = state.thick === 'thick' ? 1.6 : 0.9;
    edge.setAttribute('transform', 'translate(' + (off * 0.6 / k).toFixed(3) + ' ' + (off / k).toFixed(3) + ')');

    // Stein (rund) als eigenes Teil oben drauf
    items.forEach(it => { if (it.kind === 'stone') drawStone(ctx, tx + it.cx * k, baseY + midY * k, it.size * 0.45 * k); });
    items.forEach(it => { if (it.kind === 'charm' && it.accent) ctx.glints.push([tx + it.cx * k, baseY + midY * k]); });

    const box = { x: tx + bb.x * k, y: baseY + bb.y * k, width: bb.width * k, height: bb.height * k };
    const t1bb = textEls[0].getBBox();
    const ym = baseY + (t1bb.y + t1bb.height * 0.55) * k;
    return { box, ym, left: box.x + 1.5, right: box.x + box.width - 1.5, textEls, k, tx };
  }

  // ---------- Motive ----------
  function placeMotif(ctx, mo, tx, ty, s, flip) {
    const g = el('g', {
      transform: flip === -1 ? 'translate(' + (tx + 100 * s) + ' ' + ty + ') scale(' + (-s) + ' ' + s + ')'
                             : 'translate(' + tx + ' ' + ty + ') scale(' + s + ')'
    }, ctx.g);
    const toSvg = p => [flip === -1 ? tx + (100 - p[0]) * s : tx + p[0] * s, ty + p[1] * s];
    const enamel = ENAMEL[state.enamel];
    mo.shapes.forEach(sh => {
      const a = Object.assign({}, sh.a);
      if (sh.r === 'body') {
        a.fill = enamel || ctx.metal;
        a.stroke = enamel ? ctx.metal : ctx.dark;
        a['stroke-width'] = enamel ? 3.4 : 1.1;
        if (!enamel) a['stroke-opacity'] = 0.5;
        a['stroke-linejoin'] = 'round';
      } else if (sh.r === 'line') {
        a.fill = 'none';
        a.stroke = enamel ? ctx.metal : ctx.dark;
        a['stroke-width'] = enamel ? 2.4 : 1.6;
        a['stroke-linecap'] = 'round';
        if (!enamel) a['stroke-opacity'] = 0.45;
      } else {
        a.fill = ctx.metal; a.stroke = ctx.dark; a['stroke-opacity'] = 0.4; a['stroke-width'] = 0.8;
      }
      el(sh.t, a, g);
    });
    mo.glints.forEach(p => ctx.glints.push(toSvg(p)));
    const sp = toSvg(mo.stone);
    drawStone(ctx, sp[0], sp[1], Math.max(3, 5.8 * s));
  }

  const DRAW = {
    necklace(ctx) {
      const pl = namePlate(ctx, 200, 196, 272, 76, true);
      chain2(ctx, pl);
      ctx.textBox = pl.box;
    },
    bracelet(ctx) {
      const pl = namePlate(ctx, 200, 170, 220, 60, false);
      linkChain(ctx, 'M6 112C42 150 ' + (pl.left - 60) + ' ' + (pl.ym + 8) + ' ' + pl.left + ' ' + pl.ym);
      linkChain(ctx, 'M394 112C358 150 ' + (pl.right + 60) + ' ' + (pl.ym + 8) + ' ' + pl.right + ' ' + pl.ym);
      jumpRing(ctx, pl.left, pl.ym); jumpRing(ctx, pl.right, pl.ym);
      ctx.textBox = pl.box;
    },
    pendant(ctx) {
      const mo = MOTIFS[state.motif], s = 0.95, hx = 200, hy = 160;
      linkChain(ctx, 'M48 -12C56 100 170 150 ' + (hx - 1.5) + ' ' + (hy - 4));
      linkChain(ctx, 'M352 -12C344 100 230 150 ' + (hx + 1.5) + ' ' + (hy - 4));
      bail(ctx, hx, hy);
      placeMotif(ctx, mo, hx - mo.hang[0] * s, hy + 4 - mo.hang[1] * s, s, 1);
    },
    initial(ctx) {
      const hx = 200, hy = 150, cy = 203, R = 42;
      linkChain(ctx, 'M48 -12C56 96 170 138 ' + (hx - 1.5) + ' ' + (hy - 4));
      linkChain(ctx, 'M352 -12C344 96 230 138 ' + (hx + 1.5) + ' ' + (hy - 4));
      bail(ctx, hx, hy);
      el('circle', { cx: hx, cy, r: R, fill: ctx.metal, stroke: ctx.dark, 'stroke-opacity': 0.35, 'stroke-width': 0.8 }, ctx.g);
      el('circle', { cx: hx, cy, r: R - 4, fill: 'none', stroke: '#fff', 'stroke-opacity': 0.3, 'stroke-width': 1 }, ctx.g);
      const raw = nameText(state.text);
      const letter = firstLetter(raw || TXT.fallbackName);
      const F = font();
      const a = {
        x: hx, y: cy, 'text-anchor': 'middle', 'dominant-baseline': 'central',
        'font-family': F.family, 'font-weight': F.weight, 'font-size': 50 * F.scale
      };
      el('text', Object.assign({}, a, { y: cy + 1.2, fill: '#fff', opacity: 0.45 }), ctx.g).textContent = letter;
      el('text', Object.assign({}, a, { fill: ctx.dark, opacity: raw ? 0.85 : 0.35 }), ctx.g).textContent = letter;
      if (STONE[state.stone]) drawStone(ctx, hx + 13, hy + 13, 5.4);
      ctx.glints.push([hx - 24, cy - 22], [hx + 22, cy + 22], [hx - 30, cy + 12]);
    },
    ring(ctx) {
      const cx = 200, cy = 160, rx = 112, ry = 50, w = 24;
      el('ellipse', { cx, cy: 238, rx: 120, ry: 10, fill: '#3b2c08', opacity: 0.08 }, ctx.under);
      const back = 'M' + (cx - rx) + ' ' + cy + 'A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + cy;
      const front = 'M' + (cx - rx) + ' ' + cy + 'A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + cy;
      el('path', { d: back, fill: 'none', stroke: ctx.metal, 'stroke-width': w * 0.55 }, ctx.g);
      el('path', { d: back, fill: 'none', stroke: ctx.dark, 'stroke-opacity': 0.35, 'stroke-width': w * 0.55 }, ctx.g);
      el('path', { d: front, fill: 'none', stroke: ctx.metal, 'stroke-width': w }, ctx.g);
      el('path', {
        d: 'M' + (cx - rx + 3) + ' ' + (cy - 7) + 'A' + (rx - 3) + ' ' + (ry - 3) + ' 0 0 0 ' + (cx + rx - 3) + ' ' + (cy - 7),
        fill: 'none', stroke: '#fff', 'stroke-opacity': 0.35, 'stroke-width': 1.4
      }, ctx.g);
      const hasStone = !!STONE[state.stone];
      const off = hasStone ? 3 : 0;
      const arcId = ctx.id + '-arc';
      el('path', {
        id: arcId, fill: 'none',
        d: 'M' + (cx - rx + 10) + ' ' + (cy + 1) + 'A' + (rx - 10) + ' ' + (ry + off) + ' 0 0 0 ' + (cx + rx - 10) + ' ' + (cy + 1)
      }, ctx.defs);
      const raw = nameText(state.text), F = font();
      const size = (hasStone ? 15 : 17) * F.scale;
      const t = el('text', {
        'font-family': F.family, 'font-weight': F.weight, 'font-size': size,
        fill: ctx.dark, opacity: raw ? 0.8 : 0.35, 'dominant-baseline': 'central'
      }, ctx.g);
      const tp = el('textPath', { href: '#' + arcId, startOffset: '50%', 'text-anchor': 'middle' }, t);
      tp.textContent = raw || TXT.fallbackName;
      const len = t.getComputedTextLength();
      if (len > 170) t.setAttribute('font-size', size * 170 / len);
      if (hasStone) drawStone(ctx, cx, cy + ry - w / 2, 7);
      ctx.glints.push([cx - 70, cy + 38], [cx + 62, cy + 40], [cx - 102, cy + 14], [cx + 104, cy + 12], [cx + 30, cy - ry]);
    },
    earrings(ctx) {
      const mo = MOTIFS[state.motif], s = 0.78;
      [-1, 1].forEach(side => {
        const cx = 200 + side * 76, top = 122;
        el('path', {
          d: 'M' + cx + ' ' + (top + 6) + 'V' + (top - 6) + 'C' + cx + ' ' + (top - 28) + ' ' + (cx + side * 22) + ' ' + (top - 32) + ' ' + (cx + side * 24) + ' ' + (top - 14),
          fill: 'none', stroke: ctx.metal, 'stroke-width': 1.8, 'stroke-linecap': 'round'
        }, ctx.g);
        const hx = side === -1 ? 100 - mo.hang[0] : mo.hang[0];
        placeMotif(ctx, mo, cx - hx * s, top + 6 - mo.hang[1] * s, s, side);
      });
    }
  };
  function chain2(ctx, pl) {
    linkChain(ctx, 'M44 -12C58 110 ' + (pl.left - 74) + ' ' + (pl.ym - 16) + ' ' + pl.left + ' ' + pl.ym);
    linkChain(ctx, 'M356 -12C342 110 ' + (pl.right + 74) + ' ' + (pl.ym - 16) + ' ' + pl.right + ' ' + pl.ym);
    jumpRing(ctx, pl.left, pl.ym); jumpRing(ctx, pl.right, pl.ym);
  }

  function render(svg) {
    const id = svg.dataset.pid;
    const piece = svg.dataset.piece || state.piece;
    const m = METALS[state.gold] || METALS.yellow;
    svg.replaceChildren();
    const defs = el('defs', null, svg);
    background(svg, id, defs);
    const grad = el('linearGradient', { id: id + '-metal', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 120, y2: 60, spreadMethod: 'reflect' }, defs);
    m.forEach((c, i) => el('stop', { offset: i / (m.length - 1), 'stop-color': c }, grad));
    const sh = el('filter', { id: id + '-sh', x: '-10%', y: '-10%', width: '120%', height: '130%' }, defs);
    el('feDropShadow', { dx: 0.8, dy: 1.8, stdDeviation: 1.2, 'flood-color': '#3b2c08', 'flood-opacity': 0.28 }, sh);
    const glow = el('filter', { id: id + '-glow', x: '-150%', y: '-150%', width: '400%', height: '400%' }, defs);
    el('feGaussianBlur', { stdDeviation: 1.6 }, glow);
    const clip = el('clipPath', { id: id + '-clip' }, defs);
    const waiting = ANIM && svg === heroSvg && !svg._seen;
    const clipRect = el('rect', { x: -20, y: -20, width: waiting ? 0 : 440, height: 340 }, clip);

    const ctx = { id, defs, metal: 'url(#' + id + '-metal)', dark: m[0], glints: [], chains: [], textBox: null };
    ctx.under = el('g', null, svg);
    const wrapG = el('g', { 'clip-path': 'url(#' + id + '-clip)' }, svg);
    ctx.chainG = el('g', { filter: 'url(#' + id + '-sh)' }, wrapG);
    ctx.g = el('g', null, wrapG);
    const shapeG = el('g', { filter: 'url(#' + id + '-sh)' }, ctx.g);
    const plainG = ctx.g;
    // Motive und Ringe bekommen den einfachen Schatten, die Namensplatte ihren eigenen Filter
    if (piece === 'necklace' || piece === 'bracelet') ctx.g = plainG; else ctx.g = shapeG;
    DRAW[piece](ctx);
    ctx.sparks = el('g', { 'pointer-events': 'none' }, svg);
    ctx.grad = grad;
    ctx.clipRect = clipRect;
    svg._ctx = ctx;
    const form = svg.closest('section').querySelector('[data-form]');
    if (form) svg.setAttribute('aria-label', TXT.sketch + ' ' + lines(form).map(l => l[1]).join(', '));
  }
  const renderAll = () => previews.forEach(render);

  // ---------- Glitzer ----------
  function pickPoint(c) {
    const r = Math.random();
    if (c.textBox && r < 0.55) {
      const b = c.textBox;
      return [b.x + b.width * (0.08 + Math.random() * 0.84), b.y + b.height * (0.2 + Math.random() * 0.45)];
    }
    if (c.chains.length && r < 0.75) {
      const p = c.chains[Math.floor(Math.random() * c.chains.length)];
      const q = p.getPointAtLength(p.getTotalLength() * (0.45 + Math.random() * 0.5));
      return [q.x, q.y];
    }
    if (c.glints.length) return c.glints[Math.floor(Math.random() * c.glints.length)];
    return [200, 150];
  }
  function spark(svg, x, y, size, delay) {
    const c = svg._ctx;
    if (!ANIM || !c) return;
    const g = el('g', { transform: 'translate(' + x + ' ' + y + ')' }, c.sparks);
    const inner = el('g', null, g);
    el('circle', { r: size * 0.7, fill: '#fff4cf', opacity: 0.65, filter: 'url(#' + c.id + '-glow)' }, inner);
    el('path', { d: STAR, fill: '#fffdf4', transform: 'scale(' + size / 10 + ')' }, inner);
    gsap.fromTo(inner,
      { scale: 0, rotation: -40, transformOrigin: '50% 50%' },
      { scale: 1, rotation: 10, duration: 0.3, delay, ease: 'power2.out', yoyo: true, repeat: 1, repeatDelay: 0.08, onComplete: () => g.remove() });
  }
  function burst(svg, n, gap) {
    for (let i = 0; i < n; i++) {
      const p = pickPoint(svg._ctx);
      spark(svg, p[0], p[1], 4 + Math.random() * 2.5, i * (gap || 0.14));
    }
  }
  function shine(svg, dur) {
    const c = svg._ctx;
    if (!ANIM || !c) return;
    const o = { t: 0 };
    gsap.to(o, { t: 1, duration: dur, ease: 'power1.inOut', onUpdate: () => c.grad.setAttribute('gradientTransform', 'translate(' + o.t * 240 + ' ' + o.t * 120 + ')') });
  }
  function fx(svg, n) {
    if (!ANIM || !svg._visible) return;
    const now = performance.now();
    if (now - (svg._lastFx || 0) < 450) return;
    svg._lastFx = now;
    shine(svg, 1.2);
    burst(svg, n);
  }
  function intro(svg) {
    svg._seen = true;
    if (!ANIM) return;
    const r = svg._ctx.clipRect;
    const rtl = isArabic(nameText(state.text) || TXT.fallbackName);
    const tl = gsap.timeline();
    if (rtl) tl.fromTo(r, { attr: { x: 420, width: 0 } }, { attr: { x: -20, width: 440 }, duration: 1.5, ease: 'power2.inOut' });
    else tl.fromTo(r, { attr: { width: 0 } }, { attr: { width: 440 }, duration: 1.5, ease: 'power2.inOut' });
    tl.add(() => shine(svg, 1.8), 0.2);
    tl.add(() => burst(svg, 5, 0.12), 1.2);
    // falls Animationen gebremst werden (Hintergrund-Tab): Kette trotzdem zeigen
    setTimeout(() => { if (svg._ctx && svg._ctx.clipRect === r) { tl.kill(); r.setAttribute('x', -20); r.setAttribute('width', 440); } }, 2600);
  }

  // ---------- Formulare ----------
  function updateSizes() {
    if (!sizeSel) return;
    const kind = SIZE_KIND[state.piece];
    if (!kind) { state.size = ''; sizeSel._kind = null; return; }
    if (kind !== sizeSel._kind) {
      sizeSel._kind = kind;
      const S = SIZES[kind];
      sizeSel.replaceChildren(...S.list.map(v => {
        const o = document.createElement('option');
        o.value = v; o.textContent = v;
        return o;
      }));
      state.size = S.list[S.def];
      sizeLabel.textContent = TXT[kind];
    }
  }
  function updateFields() {
    if (builder) builder.querySelectorAll('[data-show]').forEach(f => { f.hidden = !f.dataset.show.split(' ').includes(state.piece); });
    document.querySelectorAll('[data-needs]').forEach(f => { f.hidden = !String(state[f.dataset.needs] || '').trim(); });
  }
  function syncControls(source) {
    controls.forEach(c => {
      const k = c.dataset.key;
      if (c.type === 'radio') c.checked = c.value === state[k];
      else if (c !== source && c.value !== state[k]) c.value = state[k];
    });
  }
  function updateSamples() {
    const n = nameText(state.text) || TXT.fallbackName;
    const ar = isArabic(n);
    document.querySelectorAll('.font-sample').forEach(s => {
      const F = FONTS[s.dataset.font];
      if (!F) return;
      // passt die Schrift nicht zur Sprache des Namens, zeigt die Kachel ein Beispiel in ihrer Schrift
      let t = n;
      if (F.kind === 'arabic' && !ar) t = 'ليلى';
      if (F.kind !== 'arabic' && ar) t = 'Layla';
      s.textContent = F.upper && !isArabic(t) ? t.toUpperCase() : t;
    });
  }

  function lines(form) {
    const out = [];
    form.querySelectorAll('[data-field]').forEach(f => {
      if (f.hidden) return;
      const key = f.dataset.field;
      let label = f.dataset.label, v = '';
      const checked = f.querySelector('input[type=radio]:checked');
      if (checked) {
        const t = checked.closest('label').querySelector('.chip-t, .font-name');
        v = t ? t.textContent : checked.value;
      } else {
        const c = f.querySelector('input[type=text], textarea, select');
        if (c) v = c.tagName === 'SELECT' ? (c.options[c.selectedIndex] ? c.options[c.selectedIndex].textContent : '') : c.value;
      }
      v = (v || '').trim();
      if (key === 'gold' && v) v += TXT.karat;
      if (key === 'text' && form === builder && state.piece === 'initial') { label = TXT.letter; v = v ? firstLetter(v) : ''; }
      if (key === 'size' && sizeLabel) label = sizeLabel.textContent;
      if (v) out.push([label, v]);
    });
    return out;
  }
  function updateOutputs() {
    forms.forEach(form => {
      const L = lines(form);
      const dl = form.querySelector('[data-summary]');
      if (dl) dl.replaceChildren(...L.flatMap(([k, v]) => {
        const dt = document.createElement('dt'); dt.textContent = k;
        const dd = document.createElement('dd'); dd.textContent = v;
        return [dt, dd];
      }));
      const hello = form.dataset.form === 'studio' ? TXT.helloName : TXT.hello;
      const msg = hello + '\n\n' + L.map(([k, v]) => '• ' + k + ': ' + v).join('\n') + '\n\n' + TXT.ask;
      form.querySelectorAll('[data-wa]').forEach(a => { a.href = wa(msg); });
    });
  }

  let pending = null;
  function schedule(key) {
    if (pending) { pending.add(key); return; }
    pending = new Set([key]);
    requestAnimationFrame(() => {
      const keys = pending; pending = null;
      const visual = [...keys].some(k => k !== 'notes' && k !== 'size' && k !== 'len');
      if (visual) { renderAll(); previews.forEach(s => fx(s, keys.has('text') || keys.has('text2') ? 2 : 3)); }
      updateOutputs();
    });
  }
  function onChange(e) {
    const c = e.target;
    const k = c.dataset && c.dataset.key;
    if (!k || (c.type === 'radio' && !c.checked) || state[k] === c.value) return;
    state[k] = c.value;
    if (k === 'piece') updateSizes();
    if (k === 'piece' || k === 'text2') updateFields();
    if (k === 'text') updateSamples();
    syncControls(c);
    schedule(k);
  }
  document.querySelectorAll('[data-sync]').forEach(f => {
    f.addEventListener('input', onChange);
    f.addEventListener('change', onChange);
  });

  // Schriftkacheln in ihrer eigenen Schrift
  document.querySelectorAll('.font-sample').forEach(s => {
    const F = FONTS[s.dataset.font];
    if (F) { s.style.fontFamily = F.family; s.style.fontWeight = F.weight; }
  });

  // Motiv-Symbole in den Auswahlknöpfen
  document.querySelectorAll('.motif-ico').forEach(span => {
    const mo = MOTIFS[span.dataset.motif];
    const svg = el('svg', { viewBox: '-4 -4 108 108' });
    mo.shapes.forEach(sh => {
      const a = Object.assign({}, sh.a);
      if (sh.r === 'dot') a.fill = 'currentColor';
      else Object.assign(a, { fill: 'none', stroke: 'currentColor', 'stroke-width': sh.r === 'body' ? 6 : 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
      el(sh.t, a, svg);
    });
    span.appendChild(svg);
  });
  // Anhänger-Symbole (Namenskette)
  document.querySelectorAll('.charm-ico').forEach(span => {
    const d = CHARMS[span.dataset.charm];
    if (!d) return;
    const svg = el('svg', { viewBox: '-0.6 -0.6 1.2 1.2' });
    el('path', { d, fill: span.dataset.charm === 'infinity' ? 'none' : 'currentColor', stroke: 'currentColor', 'stroke-width': 0.06 }, svg);
    span.appendChild(svg);
  });

  // ---------- Relief-Ornamente im Startbereich ----------
  const orn = document.querySelector('.ornaments');
  const ringStage = document.querySelector('.ring-stage');
  const pts = list => list.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const star8 = R => pts(Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 ? R * 0.765 : R, a = Math.PI / 8 * i - Math.PI / 2;
    return [r * Math.cos(a), r * Math.sin(a)];
  }));
  const gem = s => pts([[-0.45, -0.36], [0.45, -0.36], [0.75, -0.04], [0, 0.62], [-0.75, -0.04]].map(p => [p[0] * s, p[1] * s]));
  let ornW = 0;
  function buildOrnaments() {
    if (!orn || !ringStage) return;
    const w = orn.clientWidth, h = orn.clientHeight;
    if (!w || !h || Math.abs(w - ornW) < 40) return;
    const first = ornW === 0;
    ornW = w;
    const box = orn.getBoundingClientRect(), rs = ringStage.getBoundingClientRect();
    const cx = rs.left - box.left + rs.width / 2, cy = rs.top - box.top + rs.height * 0.46;
    const rx = rs.width * 0.5, ry = rs.height * 0.42;
    const step = w < 700 ? 74 : 112;
    orn.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    orn.replaceChildren();
    const g = el('g', { class: 'orn-g' }, orn);
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let row = 0, y = step * 0.5; y < h + step; row++, y += step * 0.87) {
      for (let col = 0, x = (row % 2) * step / 2; x < w + step; col++, x += step) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry;
        const d = Math.sqrt(dx * dx + dy * dy);
        // Gruppen statt Tapete: ein Teil der Plätze bleibt leer
        const keep = 0.5 + 0.5 * Math.sin(x * 0.011 + 1.3) * Math.cos(y * 0.013 - 0.4);
        if (d < 1.1 || rnd() > keep + 0.15) continue;
        const o = Math.min(1, Math.max(0, 1.1 - (d - 1.1) * 0.55));
        if (o < 0.1) continue;
        const big = (row + col) % 2 === 0;
        const holder = el('g', { transform: 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' }, g);
        const p = el('polygon', { class: 'orn', points: big ? star8(step * 0.3) : gem(step * 0.26) }, holder);
        p.style.setProperty('--o', o.toFixed(2));
        p.style.setProperty('--d', (0.15 + (d - 1) * 0.35 + Math.random() * 0.2).toFixed(2) + 's');
      }
    }
    if (!first || REDUCE) orn.classList.add('no-anim');
  }
  if (orn) {
    buildOrnaments();
    let t;
    new ResizeObserver(() => { clearTimeout(t); t = setTimeout(buildOrnaments, 200); }).observe(orn);
  }

  // ---------- Kopfzeile: Menü am Handy, Hintergrund beim Scrollen, aktiver Menüpunkt ----------
  const top = document.querySelector('[data-top]');
  const menuBtn = document.querySelector('.menu-btn');
  function setMenu(open) {
    if (!top || !menuBtn) return;
    top.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.menu-t').textContent = open ? TXT.close : TXT.menu;
  }
  if (top && menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(!top.classList.contains('is-open')));
    top.querySelectorAll('.top-nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    const onScroll = () => top.classList.toggle('is-scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const navLinks = Array.from(top.querySelectorAll('.top-nav a[href^="#"]'));
    const secIO = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a => {
        if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }), { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) secIO.observe(s); });
  }

  // Schwebender WhatsApp-Knopf: ausblenden, solange ein eigener Senden-Knopf zu sehen ist
  const waFloat = document.querySelector('.wa-float');
  if (waFloat && 'IntersectionObserver' in window) {
    const near = new Set();
    const io2 = new IntersectionObserver(es => {
      es.forEach(en => { if (en.isIntersecting) near.add(en.target); else near.delete(en.target); });
      waFloat.classList.toggle('is-away', near.size > 0);
    }, { threshold: 0.1 });
    document.querySelectorAll('.ring-copy .actions, .custom .actions, .summary').forEach(x => io2.observe(x));
  }

  // ---------- Weiches Scrollen ----------
  const lenis = (window.Lenis && !REDUCE) ? new window.Lenis({ autoRaf: true, anchors: { offset: -72 } }) : null;
  const goTo = target => {
    if (lenis) lenis.scrollTo(target, { offset: -72 });
    else target.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' });
  };

  // ---------- Kollektion ----------
  document.querySelectorAll('[data-filter] input').forEach(inp => inp.addEventListener('change', () => {
    if (!inp.checked) return;
    document.querySelectorAll('.gallery > li').forEach(li => {
      li.hidden = inp.value !== 'all' && !(li.dataset.cat || '').split(' ').includes(inp.value);
    });
  }));
  document.querySelectorAll('.gallery > li').forEach(li => {
    const a = li.querySelector('[data-ask]');
    const cap = li.querySelector('.cap');
    if (a && cap) a.href = wa(TXT.askPiece + cap.textContent.trim() + TXT.askPiece2);
  });
  document.querySelectorAll('[data-wa-idea]').forEach(a => { a.href = wa(TXT.idea); });

  // „Make it custom“: Baukasten oder Namenskette mit dem Foto vorbelegen
  document.querySelectorAll('[data-like]').forEach(b => b.addEventListener('click', () => {
    const like = JSON.parse(b.dataset.like);
    const goal = like.goto || 'design';
    delete like.goto;
    Object.assign(state, like);
    const cap = b.closest('li').querySelector('.cap');
    if (goal === 'design') state.notes = TXT.similar + ' ' + cap.textContent.trim();
    updateSizes(); updateFields(); syncControls(null); updateSamples();
    renderAll(); updateOutputs();
    const target = document.getElementById(goal);
    goTo(target);
    const svg = target.querySelector('svg.preview');
    if (svg) setTimeout(() => { svg._lastFx = 0; fx(svg, 4); }, 1100);
  }));

  // ---------- Start ----------
  function fontsReady() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const sample = TXT.fallbackName + ' Layla ليلى';
    const loads = Object.values(FONTS).map(F => document.fonts.load(F.weight + ' 40px ' + F.family.split(',')[0], sample));
    return Promise.race([Promise.all(loads).catch(() => {}), new Promise(r => setTimeout(r, 3000))]);
  }

  updateSizes(); updateFields(); syncControls(null); updateSamples(); updateOutputs();

  const io = new IntersectionObserver(entries => entries.forEach(en => {
    const s = en.target;
    s._visible = en.isIntersecting;
    if (en.isIntersecting && !s._seen && s._ctx) {
      if (s === heroSvg) intro(s);
      else { s._seen = true; setTimeout(() => fx(s, 4), 250); }
    }
  }), { threshold: 0.4 });

  fontsReady().then(() => {
    renderAll();
    previews.forEach(s => io.observe(s));
    // später nachgeladene Schriften: neu zeichnen, damit Breiten stimmen
    if (document.fonts) document.fonts.addEventListener('loadingdone', () => renderAll());
    if (ANIM) {
      setInterval(() => {
        if (document.hidden) return;
        previews.forEach(s => {
          if (s._visible && s._ctx && Math.random() < 0.8) {
            const p = pickPoint(s._ctx);
            spark(s, p[0], p[1], 3.5 + Math.random() * 2.5, 0);
          }
        });
      }, 2400);
    }
  });
})();
