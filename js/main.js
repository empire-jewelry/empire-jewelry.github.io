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
      fallbackName: 'Layla', amp: '&', sketch: 'Sketch:', menu: 'Menu', close: 'Close',
      altAr1: 'Name in Arabic letters', altAr2: 'Second name in Arabic letters',
      altEn1: 'Name in English letters', altEn2: 'Second name in English letters',
      linkLabel: 'See my design: ',
      making: 'Making the picture…',
      saved: 'Picture saved. You can attach it in WhatsApp.',
      saveFail: 'The picture could not be made. Send the message instead: it lists every detail of your design.',
      pastePhone: 'Picture copied. In WhatsApp, long-press the message box, tap Paste and send the picture.',
      pasteDesk: 'Picture copied. In WhatsApp, press Ctrl+V to add it, then send.',
      pasteFail: 'The picture could not be copied. Tap “Save as picture” and attach it in WhatsApp.'
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
      fallbackName: 'ليلى', amp: 'و', sketch: 'رسم:', menu: 'القائمة', close: 'إغلاق',
      altAr1: 'الاسم بالأحرف العربية', altAr2: 'الاسم الثاني بالأحرف العربية',
      altEn1: 'الاسم بالأحرف الإنجليزية', altEn2: 'الاسم الثاني بالأحرف الإنجليزية',
      linkLabel: 'شاهد تصميمي: ',
      making: 'جارٍ تجهيز الصورة…',
      saved: 'تم حفظ الصورة. يمكنك إرفاقها في واتساب.',
      saveFail: 'تعذّر تجهيز الصورة. أرسل الرسالة، فهي تحتوي على كل تفاصيل تصميمك.',
      pastePhone: 'تم نسخ الصورة. في واتساب اضغط مطولاً على خانة الكتابة، ثم «لصق»، وأرسل الصورة.',
      pasteDesk: 'تم نسخ الصورة. في واتساب اضغط Ctrl+V لإضافتها، ثم أرسل.',
      pasteFail: 'تعذّر نسخ الصورة. اضغط «احفظ كصورة» وأرفقها في واتساب.'
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
    yellow: ['#7d5c17', '#cfa443', '#fcecb6', '#e2bb5c', '#9c7726'],
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
    dancing: { family: '"Dancing Script", "Aref Ruqaa", cursive', weight: 500, scale: 1.05, kind: 'script' },
    pacifico: { family: '"Pacifico", "Aref Ruqaa", cursive', weight: 400, scale: 0.86, kind: 'script' },
    serif: { family: '"Playfair Display", "Amiri", serif', weight: 500, scale: 0.88, kind: 'print', spacing: -0.02 },
    block: { family: '"Montserrat", "Reem Kufi", sans-serif', weight: 500, scale: 0.72, kind: 'print', upper: true, spacing: -0.01 },
    bubble: { family: '"Fredoka", "Reem Kufi", sans-serif', weight: 500, scale: 0.86, kind: 'print', spacing: -0.05 },
    gothic: { family: '"UnifrakturMaguntia", "Aref Ruqaa", serif', weight: 400, scale: 0.95, kind: 'print', spacing: -0.02 },
    calligraphy: { family: '"Aref Ruqaa", serif', weight: 400, scale: 1.0, kind: 'arabic' },
    naskh: { family: '"Amiri", serif', weight: 400, scale: 0.95, kind: 'arabic' },
    modern: { family: '"Reem Kufi", "Alexandria", sans-serif', weight: 500, scale: 0.88, kind: 'arabic' },
    nastaliq: { family: '"Gulzar", "Aref Ruqaa", serif', weight: 400, scale: 0.9, kind: 'arabic' },
    katibeh: { family: '"Katibeh", "Aref Ruqaa", serif', weight: 400, scale: 1.2, kind: 'arabic' }
  };
  const font = () => FONTS[state.style] || FONTS.script;

  // ---------- Namen in die andere Schrift übertragen (nur als Vorschlag, der Kunde prüft) ----------
  const NAMES = {
    'layla laila leila leyla': 'ليلى', 'ali': 'علي', 'mohammad mohamad mohammed muhammad mohamed': 'محمد',
    'ahmad ahmed': 'أحمد', 'hassan': 'حسن', 'hussein hussain houssein': 'حسين', 'fatima fatme fatma': 'فاطمة',
    'zahraa zahra': 'زهراء', 'zeinab zainab zaynab': 'زينب', 'maryam mariam': 'مريم', 'malak': 'ملاك',
    'sara sarah': 'سارة', 'nour noor nur': 'نور', 'rania': 'رانيا', 'lina': 'لينا', 'lara': 'لارا', 'maya': 'مايا',
    'tala': 'تالا', 'dana': 'دانا', 'reem rim': 'ريم', 'rola roula': 'رولا', 'hiba': 'هبة', 'ghina': 'غنى',
    'batoul batool': 'بتول', 'kawthar kawsar': 'كوثر', 'nadine': 'نادين', 'celine': 'سيلين',
    'yasmine yasmin': 'ياسمين', 'aya': 'آية', 'joud jood': 'جود', 'hala': 'هلا', 'rayan rayyan': 'ريان',
    'jad': 'جاد', 'karim kareem': 'كريم', 'hadi': 'هادي', 'mahdi mehdi': 'مهدي', 'abbas': 'عباس',
    'khaled khalid': 'خالد', 'omar': 'عمر', 'youssef yousef yusuf': 'يوسف', 'ibrahim': 'إبراهيم',
    'mustafa moustafa': 'مصطفى', 'hamza': 'حمزة', 'kassem qassem qasim': 'قاسم', 'jaafar jafar': 'جعفر',
    'abdallah abdullah': 'عبدالله', 'elie': 'إيلي', 'georges george': 'جورج', 'charbel': 'شربل', 'rita': 'ريتا',
    'nadia': 'نادية', 'samira': 'سميرة', 'amira': 'أميرة', 'salma': 'سلمى', 'lamar': 'لمار', 'lynn lyn': 'لين',
    'maria': 'ماريا', 'mira': 'ميرا', 'rana': 'رنا', 'ruba': 'ربى', 'farah': 'فرح', 'ziad': 'زياد', 'rami': 'رامي',
    'bilal': 'بلال', 'adam': 'آدم', 'ayman': 'أيمن', 'tarek tarik': 'طارق', 'yara': 'يارا', 'zein zain': 'زين',
    'israa isra': 'إسراء', 'mohsen': 'محسن', 'jana': 'جنى', 'line': 'لين', 'ritaj': 'رتاج'
  };
  const LAT2AR = {}, AR2LAT = {};
  Object.keys(NAMES).forEach(k => {
    const ar = NAMES[k], first = k.split(' ')[0];
    k.split(' ').forEach(w => { LAT2AR[w] = ar; });
    if (!AR2LAT[ar]) AR2LAT[ar] = first.charAt(0).toUpperCase() + first.slice(1);
  });
  function toArabic(s) {
    return s.split(/\s+/).map(word => {
      const w = word.toLowerCase();
      if (LAT2AR[w]) return LAT2AR[w];
      let out = '';
      for (let i = 0; i < w.length; i++) {
        const two = w.slice(i, i + 2);
        const DG = { sh: 'ش', kh: 'خ', gh: 'غ', th: 'ث', dh: 'ذ', ch: 'ش', ou: 'و', oo: 'و', ee: 'ي', ei: 'ي', ai: 'اي', ay: 'اي', aa: 'ا' };
        if (DG[two]) { out += DG[two]; i++; continue; }
        const c = w[i];
        if (i === 0 && c === 'a') { out += 'أ'; continue; }
        if (i === 0 && (c === 'e' || c === 'i')) { out += 'إ'; continue; }
        const M = { a: 'ا', b: 'ب', c: 'ك', d: 'د', e: '', f: 'ف', g: 'ج', h: 'ه', i: 'ي', j: 'ج', k: 'ك', l: 'ل', m: 'م', n: 'ن', o: 'و', p: 'ب', q: 'ق', r: 'ر', s: 'س', t: 'ت', u: 'و', v: 'ف', w: 'و', x: 'كس', y: 'ي', z: 'ز' };
        out += M[c] !== undefined ? M[c] : c;
      }
      return out;
    }).join(' ');
  }
  function toLatin(s) {
    return s.split(/\s+/).map(word => {
      if (AR2LAT[word]) return AR2LAT[word];
      const M = { 'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'ou', 'ي': 'i', 'ى': 'a', 'ة': 'a', 'ء': '', 'ئ': '', 'ؤ': '' };
      const t = Array.from(word).map(c => (M[c] !== undefined ? M[c] : c)).join('');
      return t.charAt(0).toUpperCase() + t.slice(1);
    }).join(' ');
  }
  // Was auf die Kette kommt: passt die Schrift nicht zur Sprache des Namens, gilt der Name in der anderen Schrift
  function shownName(which) {
    const t = nameText(which === 2 ? state.text2 : state.text);
    if (!t) return '';
    if ((font().kind === 'arabic') === isArabic(t)) return t;
    return nameText(which === 2 ? state.text2Alt : state.textAlt) || t;
  }
  const fallbackName = () => (font().kind === 'arabic' ? 'ليلى' : 'Layla');
  const mismatch = () => { const t = nameText(state.text); return !!t && (font().kind === 'arabic') !== isArabic(t); };
  const altEdited = { textAlt: false, text2Alt: false };
  function refreshAlt() {
    const toAr = font().kind === 'arabic';
    [['text', 'textAlt'], ['text2', 'text2Alt']].forEach(([src, dst]) => {
      if (altEdited[dst]) return;
      const t = nameText(state[src]);
      state[dst] = t && toAr !== isArabic(t) ? (toAr ? toArabic(t) : toLatin(t)) : '';
    });
  }

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
    infinity: 'M-.46 0C-.46-.2-.2-.22 0 0C.2 .22 .46 .2 .46 0C.46-.2 .2-.22 0 0C-.2 .22-.46 .2-.46 0Z',
    hamsa: 'M0 .5C-.22 .5-.34 .34-.34 .16L-.44 .02C-.48-.06-.4-.12-.34-.06L-.27 .02L-.27-.3C-.27-.4-.11-.4-.11-.3L-.11-.02L-.08-.02L-.08-.4C-.08-.5 .08-.5 .08-.4L.08-.02L.11-.02L.11-.3C.11-.4 .27-.4 .27-.3L.27 .02L.34-.06C.4-.12 .48-.06 .44 .02L.34 .16C.34 .34 .22 .5 0 .5Z',
    flower: 'M0.200 -0.280a0.20 0.20 0 1 0 -0.40 0a0.20 0.20 0 1 0 0.40 0M0.466 -0.087a0.20 0.20 0 1 0 -0.40 0a0.20 0.20 0 1 0 0.40 0M0.365 0.227a0.20 0.20 0 1 0 -0.40 0a0.20 0.20 0 1 0 0.40 0M0.035 0.227a0.20 0.20 0 1 0 -0.40 0a0.20 0.20 0 1 0 0.40 0M-0.066 -0.087a0.20 0.20 0 1 0 -0.40 0a0.20 0.20 0 1 0 0.40 0',
    coin: 'M0-.5A.5 .5 0 1 1 0 .5A.5 .5 0 1 1 0-.5Z',
    eye: 'M0-.5A.5 .5 0 1 1 0 .5A.5 .5 0 1 1 0-.5Z'
  };
  // Aufhängepunkt oben am Anhänger (y im Einheitsfeld), dort sitzt der kleine Ring
  const CHARM_HANG = { heart: -0.24, star: -0.5, butterfly: -0.1, cedar: -0.5, hamsa: -0.48, flower: -0.48, coin: -0.5, eye: -0.5 };

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
    piece: 'pendant', gold: 'yellow', text: TXT.fallbackName, text2: '', textAlt: '', text2Alt: '', join: 'heart', style: 'script',
    accent: 'none', underline: 'none', thick: 'std', chain: 'cable', motif: 'butterfly', enamel: 'none',
    stone: 'none', size: '', len: '', notes: ''
  };
  let touched = false;   // erst nach der ersten Änderung Bilder vorbereiten
  const controls = Array.from(document.querySelectorAll('[data-sync] [data-key]'));
  const seen = new Set();
  const cbInit = {};
  controls.forEach(c => {
    const k = c.dataset.key;
    if (c.type === 'checkbox') {
      cbInit[k] = cbInit[k] || [];
      if (c.checked) cbInit[k].push(c.value);
    } else if (c.type === 'radio') {
      if (c.checked) state[k] = c.value;
    } else if (!seen.has(k) && !(c.tagName === 'SELECT' && !c.options.length)) {
      state[k] = c.value;
      seen.add(k);
    }
  });

  Object.keys(cbInit).forEach(k => { state[k] = cbInit[k].join(','); });
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
    el('feGaussianBlur', { in: 'SourceAlpha', stdDeviation: thick ? 0.9 : 0.6, result: 'b' }, f);
    const sp = el('feSpecularLighting', { in: 'b', surfaceScale: thick ? 2.6 : 1.8, specularConstant: 1.0, specularExponent: 24, 'lighting-color': '#fff6dc', result: 's' }, f);
    el('feDistantLight', { azimuth: 225, elevation: 52 }, sp);
    el('feComposite', { in: 's', in2: 'SourceAlpha', operator: 'in', result: 's2' }, f);
    const df = el('feDiffuseLighting', { in: 'b', surfaceScale: thick ? 2.6 : 1.8, diffuseConstant: 1.18, 'lighting-color': '#ffffff', result: 'd' }, f);
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
    const T0 = CHAINS[state.chain] || CHAINS.cable;
    const f = ctx.linkScale || 1;
    const T = Object.assign({}, T0, {
      step: T0.step && T0.step * f, solid: T0.solid && T0.solid * f, mark: T0.mark && T0.mark * f,
      pattern: T0.pattern && T0.pattern.map(v => v * f)
    });
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
  // Metall der Platte abtasten (im Layout, auf einer unsichtbaren Leinwand):
  // äußerste Punkte links/rechts (Ösen für die Kette), unterster Punkt an einer Stelle (Ringe für Anhänger),
  // oberster Punkt über dem ersten Buchstaben (Krone).
  const inkCanvas = document.createElement('canvas');
  function inkScan(draw, x0, x1, yTop, yBot, yCut) {
    const SC = 3, pad = 8;
    const w = Math.max(1, Math.ceil((x1 - x0 + pad * 2) * SC)), h = Math.max(1, Math.ceil((yBot - yTop + pad * 2) * SC));
    inkCanvas.width = w; inkCanvas.height = h;
    const c = inkCanvas.getContext('2d', { willReadFrequently: true });
    c.setTransform(SC, 0, 0, SC, (pad - x0) * SC, (pad - yTop) * SC);
    c.fillStyle = c.strokeStyle = '#000';
    c.direction = 'ltr'; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    draw(c);
    const data = c.getImageData(0, 0, w, h).data;
    const ink = (x, y) => data[(y * w + x) * 4 + 3] > 90;
    const px = ux => Math.round((ux - x0 + pad) * SC);
    const py = uy => Math.round((uy - yTop + pad) * SC);
    const back = q => q && [q[0] / SC - pad + x0, q[1] / SC - pad + yTop];
    const cutRow = Math.min(h, py(yCut));
    let L = null, R = null;
    for (let y = 0; y < cutRow; y++) {
      for (let x = 0; x < w; x++) if (ink(x, y)) { if (!L || x < L[0]) L = [x, y]; break; }
      for (let x = w - 1; x >= 0; x--) if (ink(x, y)) { if (!R || x > R[0]) R = [x, y]; break; }
    }
    function bottomAt(ux, half) {
      const xa = Math.max(0, px(ux - half)), xb = Math.min(w - 1, px(ux + half));
      let best = -1, bx = px(ux);
      for (let x = xa; x <= xb; x++) for (let y = h - 1; y > best; y--) if (ink(x, y)) { best = y; bx = x; break; }
      return best < 0 ? null : back([bx, best]);
    }
    function topAt(ua, ub) {
      const xa = Math.max(0, px(ua)), xb = Math.min(w - 1, px(ub));
      let best = h, bx = xa;
      for (let x = xa; x <= xb; x++) for (let y = 0; y < best; y++) if (ink(x, y)) { best = y; bx = x; break; }
      return best >= h ? null : back([bx, best]);
    }
    return { L: back(L), R: back(R), bottomAt, topAt };
  }

  // ein Anhänger (Herz, Hamsa, Auge …) im Layout zeichnen; topY = Aufhängepunkt
  function drawCharm(ctx, parent, name, cx, topY, size, stoneFill) {
    const cy = topY - CHARM_HANG[name] * size;
    const g = el('g', { transform: 'translate(' + cx + ' ' + cy + ') scale(' + size + ')' }, parent);
    if (name === 'eye') {
      el('circle', { r: 0.5, 'stroke-width': 0.03 }, g);
      el('circle', { r: 0.42, fill: '#1f4fa8', stroke: 'none' }, g);
      el('circle', { r: 0.27, fill: '#f6f4ee', stroke: 'none' }, g);
      el('circle', { r: 0.17, fill: '#57b0e3', stroke: 'none' }, g);
      el('circle', { r: 0.08, fill: '#14161a', stroke: 'none' }, g);
    } else if (name === 'coin') {
      el('circle', { r: 0.5, 'stroke-width': 0.03 }, g);
      el('circle', { r: 0.4, fill: 'none', stroke: ctx.dark, 'stroke-opacity': 0.7, 'stroke-width': 0.05 }, g);
      for (let i = -2; i <= 2; i++) {
        el('line', { x1: -0.24 + Math.abs(i) * 0.05, x2: 0.24 - Math.abs(i) * 0.05, y1: i * 0.11, y2: i * 0.11, stroke: ctx.dark, 'stroke-opacity': 0.65, 'stroke-width': 0.045, 'stroke-dasharray': '0.06 0.035' }, g);
      }
    } else {
      const p = el('path', { d: CHARMS[name], 'stroke-width': 0.03 }, g);
      if (stoneFill) { p.setAttribute('fill', stoneFill); p.setAttribute('stroke-width', 0.08); }
      if (name === 'hamsa') el('circle', { cy: 0.2, r: 0.07, fill: 'none', stroke: ctx.dark, 'stroke-opacity': 0.5, 'stroke-width': 0.03 }, g);
      if (name === 'flower') el('circle', { r: 0.12, fill: ctx.dark, 'fill-opacity': 0.25, stroke: 'none' }, g);
    }
    return cy;
  }

  // Baut Name(n), Verbinder, Unterstrich, Krone, Ösen und hängende Anhänger als eine Goldplatte.
  // fit(anchors) darf eine senkrechte Verschiebung liefern (Platte hängt an der Kette).
  // Rückgabe in SVG-Koordinaten: Box und die Einhängepunkte L/R.
  function namePlate(ctx, cx, baseY, maxW, maxSize, allowSecond, fit, maxH) {
    const F = font();
    const raw1 = shownName(1);
    const raw2 = allowSecond ? shownName(2) : '';
    const n1 = raw1 || fallbackName();
    const rtl = isArabic(n1);
    const S = 40;                       // Layout-Schriftgröße, danach skaliert
    const fs = S * F.scale;
    plateFilter(ctx);
    const pg = el('g', null, ctx.g);
    const fg = el('g', { filter: 'url(#' + ctx.id + '-plate)' }, pg);
    if (!raw1) fg.setAttribute('opacity', 0.4);
    const outer = el('g', null, fg);
    const edge = el('use', { href: '#' + ctx.id + '-pi', fill: ctx.dark, stroke: ctx.dark }, outer);
    const main = el('g', { fill: ctx.metal, stroke: ctx.metal }, outer);
    const inner = el('g', { id: ctx.id + '-pi' }, main);

    const mkText = txt => {
      const t = el('text', { x: 0, y: 0, 'font-family': F.family, 'font-weight': F.weight, 'font-size': fs, 'stroke-width': F.thin ? 0.5 : 0, 'stroke-linejoin': 'round' }, inner);
      if (F.spacing) t.style.letterSpacing = F.spacing + 'em';
      t.textContent = F.upper && !isArabic(txt) ? txt.toUpperCase() : txt;
      return t;
    };
    const items = [];
    const t1 = mkText(n1);
    items.push({ kind: 'text', el: t1 });
    if (raw2) {
      if (state.join === 'amp') items.push({ kind: 'text', el: mkText(isArabic(raw2) || rtl ? TXT.amp : '&') });
      else items.push({ kind: 'charm', name: state.join === 'infinity' ? 'infinity' : 'heart', size: fs * 0.4 });
      items.push({ kind: 'text', el: mkText(raw2) });
    }
    if (rtl) items.reverse();

    // gewählte Anhänger: hängen an Ringen unter dem Namen (wie bei Malaks Ketten); Krone sitzt auf dem ersten Buchstaben
    const picks = String(state.accent || '').split(',').filter(v => v && v !== 'none');
    const wantCrown = picks.includes('crown');
    const heartStone = picks.includes('heart') && !!STONE[state.stone];
    let dangles = picks.filter(v => CHARM_HANG[v] !== undefined);
    if (heartStone) dangles = ['heart'].concat(dangles.filter(v => v !== 'heart'));
    else if (STONE[state.stone]) dangles.unshift('stone');
    dangles = dangles.slice(0, 4);

    // nebeneinander anordnen; ein Herz/Unendlich zwischen zwei Namen berührt beide
    const gap = fs * 0.1;
    let x = 0;
    const midY = -fs * 0.3;
    items.forEach(it => {
      if (it.kind === 'charm') x -= gap + fs * 0.04;
      if (it.kind === 'text') {
        const bb = it.el.getBBox();
        it.el.setAttribute('x', x - bb.x);
        it.x = x - bb.x;
        it.w = bb.width;
      } else {
        it.w = it.size;
        it.cx = x + it.w / 2;
        const pth = el('path', { d: CHARMS[it.name], transform: 'translate(' + it.cx + ' ' + midY + ') scale(' + it.size + ')', 'stroke-width': 0.6 / it.size }, inner);
        if (it.name === 'infinity') { pth.setAttribute('fill', 'none'); pth.setAttribute('stroke-width', fs * 0.05 / it.size); }
      }
      x += it.w + (it.kind === 'charm' ? -fs * 0.04 : gap);
    });
    const textEls = items.filter(it => it.kind === 'text').map(it => it.el);
    const left = 0, right = x - gap;

    // Unterstrich: Schwung oder gerader Steg (Druckschrift braucht einen Steg, sonst halten die Buchstaben nicht)
    let ul = state.underline;
    if (F.kind === 'print' && ul === 'none') ul = 'bar';
    let ulPath = null, ulBar = null;
    if (ul === 'swash') {
      const y0 = fs * 0.12, W = right - left;
      ulPath = 'M' + (left - fs * 0.04) + ' ' + (y0 - fs * 0.02) + 'C' + (left + W * 0.3) + ' ' + (y0 + fs * 0.12) + ' ' + (right - W * 0.3) + ' ' + (y0 + fs * 0.02) + ' ' + (right + fs * 0.08) + ' ' + (y0 - fs * 0.12);
      el('path', { d: ulPath, fill: 'none', 'stroke-width': fs * 0.05, 'stroke-linecap': 'round' }, inner);
    } else if (ul === 'bar') {
      ulBar = [left - fs * 0.02, -fs * 0.02, right - left + fs * 0.04, fs * 0.06];
      el('rect', { x: ulBar[0], y: ulBar[1], width: ulBar[2], height: ulBar[3], rx: fs * 0.025, 'stroke-width': 0.3 }, inner);
    }

    // Metall abtasten (Schrift, Verbinder, Unterstrich)
    const pre = inner.getBBox();
    const ink = inkScan(c => {
      c.font = F.weight + ' ' + fs + 'px ' + F.family;
      try { c.letterSpacing = (F.spacing ? F.spacing * fs : 0) + 'px'; } catch (e) { /* ältere Browser */ }
      c.lineWidth = F.thin ? 0.5 : 0.01;
      items.forEach(it => {
        if (it.kind === 'text') {
          // linke Kante aus der SVG-Box (stimmt auch auf der arabischen Seite)
          const bx = it.el.getBBox().x;
          c.fillText(it.el.textContent, bx, 0);
          if (F.thin) c.strokeText(it.el.textContent, bx, 0);
        } else {
          c.save(); c.translate(it.cx, midY); c.scale(it.size, it.size);
          const p2 = new Path2D(CHARMS[it.name]);
          if (it.name === 'infinity') { c.lineWidth = fs * 0.05 / it.size; c.stroke(p2); } else c.fill(p2);
          c.restore();
        }
      });
      if (ulPath) { c.lineWidth = fs * 0.05; c.lineCap = 'round'; c.stroke(new Path2D(ulPath)); }
      if (ulBar) c.fillRect(ulBar[0], ulBar[1], ulBar[2], ulBar[3]);
    }, pre.x, pre.x + pre.width, pre.y - fs * 0.05, pre.y + pre.height + fs * 0.05, fs * 0.3);

    // Krone sitzt oben auf dem ersten Buchstaben
    if (wantCrown) {
      let r = null;
      try { r = t1.getExtentOfChar(0); } catch (e) { r = null; }
      const bb1 = t1.getBBox();
      const xa = r ? r.x : bb1.x, xb = r ? r.x + r.width : bb1.x + fs * 0.5;
      const top = ink.topAt(xa, xb) || [(xa + xb) / 2, bb1.y];
      const cs = fs * 0.34;
      el('path', { d: CHARMS.crown, transform: 'translate(' + top[0] + ' ' + (top[1] - 0.25 * cs) + ') scale(' + cs + ')', 'stroke-width': 0.6 / cs }, inner);
    }

    // Ösen an beiden Enden (Teil der Platte)
    const R = fs * 0.07;
    const aL = ink.L || [pre.x, midY], aR = ink.R || [pre.x + pre.width, midY];
    const eL = [aL[0] - R * 0.5, aL[1]], eR = [aR[0] + R * 0.5, aR[1]];
    [eL, eR].forEach(e => el('circle', { cx: e[0], cy: e[1], r: R * 0.6, fill: 'none', 'stroke-width': R * 0.42 }, inner));
    const hookL = [eL[0] - R * 0.6, eL[1]], hookR = [eR[0] + R * 0.6, eR[1]];

    // Größe aus Name und Ösen (die hängenden Anhänger zählen nicht mit)
    const bb = inner.getBBox();
    let k = Math.min(maxSize / S, maxW / Math.max(1, bb.width));
    if (maxH) k = Math.min(k, maxH / Math.max(1, bb.height));

    // hängende Anhänger: vom Ende des Namens (Leserichtung) nach innen, jeder an einem kleinen Ring
    const dir = rtl ? 1 : -1;
    const endX = rtl ? aL[0] : aR[0];
    const baseSize = n => (n === 'stone' ? fs * 0.17 : n === 'hamsa' ? fs * 0.48 : fs * 0.4);
    // Platz unter dem Namen: bei kurzen Namen werden die Anhänger kleiner, damit sie nebeneinander passen
    const avail = Math.abs(aR[0] - aL[0]) * 0.92;
    const need = dangles.reduce((sum, n) => sum + baseSize(n) * 1.15, 0);
    const shrink = need > avail ? Math.max(0.6, avail / need) : 1;
    let ax = endX + dir * fs * 0.18;
    let prevX = null;
    const hung = [];
    dangles.forEach(name => {
      const size = baseSize(name) * shrink;
      // nächste Stelle mit Metall darunter suchen, mit genug Abstand zum vorigen Anhänger
      let b = null;
      for (let t = 0; t < 40 && !b; t++) {
        const tryX = ax + dir * t * fs * 0.03;
        const hit = ink.bottomAt(tryX, fs * 0.04);
        if (hit && (prevX === null || Math.abs(hit[0] - prevX) >= size * 1.05)) { b = hit; ax = tryX; }
      }
      if (!b) return;
      prevX = b[0];
      const rr = fs * 0.048;
      const ringY = b[1] + rr * 0.6;
      el('circle', { cx: b[0], cy: ringY, r: rr, fill: 'none', 'stroke-width': rr * 0.42 }, inner);
      const topY = ringY + rr * 0.8;
      if (name === 'stone') hung.push({ stone: true, x: b[0], y: topY, r: size });
      else hung.push({ x: b[0], y: drawCharm(ctx, inner, name, b[0], topY, size, name === 'heart' && heartStone ? stoneGrad(ctx) : null) });
      ax = b[0] + dir * (size * 1.15);
    });

    // auf Zielgröße bringen und zentrieren
    const tx = cx - (bb.x + bb.width / 2) * k;
    outer.setAttribute('transform', 'translate(' + tx.toFixed(2) + ' ' + baseY + ') scale(' + k.toFixed(4) + ')');
    const off = state.thick === 'thick' ? 1.1 : 0.5;
    edge.setAttribute('transform', 'translate(' + (off * 0.6 / k).toFixed(3) + ' ' + (off / k).toFixed(3) + ')');
    const conv = q => [tx + q[0] * k, baseY + q[1] * k];
    let L = conv(hookL), Rr = conv(hookR);

    // an die Kette hängen: senkrecht verschieben
    let dy = 0;
    if (fit) {
      dy = fit({ L, R: Rr }) || 0;
      pg.setAttribute('transform', 'translate(0 ' + dy.toFixed(2) + ')');
      L = [L[0], L[1] + dy]; Rr = [Rr[0], Rr[1] + dy];
    }

    // Geburtsstein (rund, gefasst) hängt am Ring
    const keepG = ctx.g; ctx.g = pg;
    hung.forEach(h => {
      if (!h.stone) return;
      const p0 = conv([h.x, h.y]);
      const rs = h.r * k;
      drawStone(ctx, p0[0], p0[1] + rs + 1.4, rs);
    });
    ctx.g = keepG;
    if (dy) ctx.glints = ctx.glints.map(g => [g[0], g[1] + dy]);
    hung.forEach(h => { if (!h.stone) { const q = conv([h.x, h.y]); ctx.glints.push([q[0], q[1] + dy]); } });

    const box = { x: tx + bb.x * k, y: baseY + bb.y * k + dy, width: bb.width * k, height: bb.height * k };
    return { box, L, R: Rr, textEls, k, tx, eyeR: R * 0.6 * k };
  }

  // ---------- Hals-Foto (Pexels, cottonbro studio) und Kettenverlauf darauf ----------
  // neck.json: Kettenverlauf je Länge in SVG-Einheiten (Breite 400), festgelegt in Empire_Jewelry_Werkstatt\neck_photo.py
  const IMG = (LANG === 'ar' ? '../' : '') + 'img/';
  let BUST = null;
  const bustReady = fetch(IMG + 'neck.json').then(r => r.json()).then(j => { BUST = j; }).catch(() => {});
  const onBust = piece => !!BUST && (piece === 'necklace' || piece === 'pendant' || piece === 'initial');
  function bustCurve(lenText) {
    const n = parseInt(lenText, 10) || 45;
    const key = [40, 42, 45, 50].reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a), 45);
    return BUST.curves[String(key)];
  }
  function curveY(pts, x) {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      if ((x - a[0]) * (x - b[0]) <= 0 && a[0] !== b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
    }
    return pts[pts.length - 1][1];
  }
  // weicher Pfad vom Einhängepunkt durch die berechneten Kettenpunkte bis hinter den Hals
  function bustPath(pts, start, side) {
    let i0 = pts.findIndex(q => (side < 0 ? q[0] < start[0] - 4 : q[0] > start[0] + 4));
    if (i0 < 0) i0 = pts.length - 1;
    const rest = pts.slice(i0).filter((q, i, a) => i % 5 === 0 || i === a.length - 1);
    const P = [start].concat(rest);
    let d = 'M' + P[0][0].toFixed(2) + ' ' + P[0][1].toFixed(2);
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += 'C' + c1[0].toFixed(2) + ' ' + c1[1].toFixed(2) + ' ' + c2[0].toFixed(2) + ' ' + c2[1].toFixed(2) + ' ' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2);
    }
    return d;
  }
  // Biegering durch die Öse, daran die Kette
  function hook(ctx, at, side, path) {
    const jx = at[0] + side * 1.3, jy = at[1];
    el('ellipse', { cx: jx, cy: jy, rx: 1.15, ry: 2.3, fill: 'none', stroke: ctx.metal, 'stroke-width': 0.95, transform: 'rotate(' + (side * 25) + ' ' + jx + ' ' + jy + ')' }, ctx.g);
    linkChain(ctx, path([jx + side * 1.0, jy]));
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
      if (onBust('necklace')) {
        const C = bustCurve(state.len);
        const pl = namePlate(ctx, C.front[0], C.front[1] + 6, 112, 40, true, a =>
          ((curveY(C.left, a.L[0]) - a.L[1]) + (curveY(C.right, a.R[0]) - a.R[1])) / 2 + 1.4, 36);
        hook(ctx, pl.L, -1, st => bustPath(C.left, st, -1));
        hook(ctx, pl.R, 1, st => bustPath(C.right, st, 1));
        ctx.textBox = pl.box;
        return;
      }
      const pl = namePlate(ctx, 200, 196, 272, 76, true);
      hook(ctx, pl.L, -1, st => 'M44 -12C58 110 ' + (st[0] - 74) + ' ' + (st[1] - 16) + ' ' + st[0] + ' ' + st[1]);
      hook(ctx, pl.R, 1, st => 'M356 -12C342 110 ' + (st[0] + 74) + ' ' + (st[1] - 16) + ' ' + st[0] + ' ' + st[1]);
      ctx.textBox = pl.box;
    },
    bracelet(ctx) {
      const pl = namePlate(ctx, 200, 170, 220, 60, false);
      hook(ctx, pl.L, -1, st => 'M6 112C42 150 ' + (st[0] - 60) + ' ' + (st[1] + 8) + ' ' + st[0] + ' ' + st[1]);
      hook(ctx, pl.R, 1, st => 'M394 112C358 150 ' + (st[0] + 60) + ' ' + (st[1] + 8) + ' ' + st[0] + ' ' + st[1]);
      ctx.textBox = pl.box;
    },
    pendant(ctx) {
      const mo = MOTIFS[state.motif];
      if (onBust('pendant')) {
        const C = bustCurve(state.size), s = 0.5, hx = C.front[0], hy = C.front[1] + 2;
        linkChain(ctx, bustPath(C.left, [hx - 1.5, hy - 3], -1));
        linkChain(ctx, bustPath(C.right, [hx + 1.5, hy - 3], 1));
        bail(ctx, hx, hy);
        placeMotif(ctx, mo, hx - mo.hang[0] * s, hy + 4 - mo.hang[1] * s, s, 1);
        return;
      }
      const s = 0.95, hx = 200, hy = 160;
      linkChain(ctx, 'M48 -12C56 100 170 150 ' + (hx - 1.5) + ' ' + (hy - 4));
      linkChain(ctx, 'M352 -12C344 100 230 150 ' + (hx + 1.5) + ' ' + (hy - 4));
      bail(ctx, hx, hy);
      placeMotif(ctx, mo, hx - mo.hang[0] * s, hy + 4 - mo.hang[1] * s, s, 1);
    },
    initial(ctx) {
      let hx = 200, hy = 150, cy = 203, R = 42;
      if (onBust('initial')) {
        const C = bustCurve(state.size);
        R = 19; hx = C.front[0]; hy = C.front[1] + 2; cy = hy + R + 4;
        linkChain(ctx, bustPath(C.left, [hx - 1.5, hy - 3], -1));
        linkChain(ctx, bustPath(C.right, [hx + 1.5, hy - 3], 1));
      } else {
        linkChain(ctx, 'M48 -12C56 96 170 138 ' + (hx - 1.5) + ' ' + (hy - 4));
        linkChain(ctx, 'M352 -12C344 96 230 138 ' + (hx + 1.5) + ' ' + (hy - 4));
      }
      bail(ctx, hx, hy);
      el('circle', { cx: hx, cy, r: R, fill: ctx.metal, stroke: ctx.dark, 'stroke-opacity': 0.35, 'stroke-width': 0.8 }, ctx.g);
      el('circle', { cx: hx, cy, r: R - 4, fill: 'none', stroke: '#fff', 'stroke-opacity': 0.3, 'stroke-width': 1 }, ctx.g);
      const raw = shownName(1);
      const letter = firstLetter(raw || fallbackName());
      const F = font();
      const a = {
        x: hx, y: cy, 'text-anchor': 'middle', 'dominant-baseline': 'central',
        'font-family': F.family, 'font-weight': F.weight, 'font-size': R * 1.2 * F.scale
      };
      el('text', Object.assign({}, a, { y: cy + 1.2, fill: '#fff', opacity: 0.45 }), ctx.g).textContent = letter;
      el('text', Object.assign({}, a, { fill: ctx.dark, opacity: raw ? 0.85 : 0.35 }), ctx.g).textContent = letter;
      if (STONE[state.stone]) drawStone(ctx, hx + R * 0.31, hy + R * 0.31, R * 0.13);
      ctx.glints.push([hx - R * 0.57, cy - R * 0.52], [hx + R * 0.52, cy + R * 0.52], [hx - R * 0.71, cy + R * 0.29]);
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
      const raw = shownName(1), F = font();
      const size = (hasStone ? 15 : 17) * F.scale;
      const t = el('text', {
        'font-family': F.family, 'font-weight': F.weight, 'font-size': size,
        fill: ctx.dark, opacity: raw ? 0.8 : 0.35, 'dominant-baseline': 'central'
      }, ctx.g);
      const tp = el('textPath', { href: '#' + arcId, startOffset: '50%', 'text-anchor': 'middle' }, t);
      tp.textContent = raw || fallbackName();
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
  function render(svg) {
    const id = svg.dataset.pid;
    const piece = svg.dataset.piece || state.piece;
    const m = METALS[state.gold] || METALS.yellow;
    svg.replaceChildren();
    const defs = el('defs', null, svg);
    if (onBust(piece)) {
      el('image', { href: IMG + 'neck.webp', x: 0, y: 0, width: 400, height: BUST.h || 300, preserveAspectRatio: 'xMidYMid slice' }, svg);
    } else background(svg, id, defs);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    // auf der Büste näher heran (Kette und Anhänger in echter Größe, trotzdem gut lesbar)
    let vy = 0;
    if (onBust(piece)) {
      // Ausschnitt folgt der Kettenlänge (längere Kette = tiefer)
      const C = bustCurve(piece === 'necklace' ? state.len : state.size);
      vy = Math.max(0, Math.min((BUST.h || 300) - 300, C.front[1] - 212));
    }
    svg.setAttribute('viewBox', '0 ' + vy.toFixed(1) + ' 400 300');
    const grad = el('linearGradient', { id: id + '-metal', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 120, y2: 60, spreadMethod: 'reflect' }, defs);
    m.forEach((c, i) => el('stop', { offset: i / (m.length - 1), 'stop-color': c }, grad));
    const sh = el('filter', { id: id + '-sh', x: '-10%', y: '-10%', width: '120%', height: '130%' }, defs);
    el('feDropShadow', { dx: 0.7, dy: 1.4, stdDeviation: 0.9, 'flood-color': '#3a2412', 'flood-opacity': onBust(piece) ? 0.38 : 0.28 }, sh);
    const glow = el('filter', { id: id + '-glow', x: '-150%', y: '-150%', width: '400%', height: '400%' }, defs);
    el('feGaussianBlur', { stdDeviation: 1.6 }, glow);
    const clip = el('clipPath', { id: id + '-clip' }, defs);
    const waiting = ANIM && svg === heroSvg && !svg._seen;
    const clipRect = el('rect', { x: -20, y: vy - 20, width: waiting ? 0 : 440, height: 340 }, clip);

    const ctx = { id, defs, metal: 'url(#' + id + '-metal)', dark: m[0], glints: [], chains: [], textBox: null, linkScale: onBust(piece) ? 0.9 : 1 };
    ctx.under = el('g', null, svg);
    const wrapG = el('g', { 'clip-path': 'url(#' + id + '-clip)' }, svg);
    ctx.chainG = el('g', { filter: 'url(#' + id + '-sh)' }, wrapG);
    ctx.g = el('g', null, wrapG);
    const shapeG = el('g', { filter: 'url(#' + id + '-sh)' }, ctx.g);
    const plainG = ctx.g;
    // Motive und Ringe bekommen den einfachen Schatten, die Namensplatte ihren eigenen Filter
    if (piece === 'necklace' || piece === 'bracelet') ctx.g = plainG; else ctx.g = shapeG;
    DRAW[piece](ctx);
    ctx.sparks = el('g', { class: 'sparks', 'pointer-events': 'none' }, svg);
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
    const rtl = isArabic(shownName(1) || fallbackName());
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
  // Felder ein-/ausblenden: je nach Stück, zweitem Namen und ob der Name in die andere Schrift muss
  function updateFields() {
    const mm = mismatch(), toAr = font().kind === 'arabic';
    document.querySelectorAll('[data-form] fieldset').forEach(f => {
      let hide = false;
      if (f.dataset.show && f.closest('[data-form="builder"]')) hide = !f.dataset.show.split(' ').includes(state.piece);
      if (f.dataset.needs && !String(state[f.dataset.needs] || '').trim()) hide = true;
      if (f.dataset.alt) {
        if (!mm || (f.dataset.alt === '2' && !nameText(state.text2))) hide = true;
        const lab = f.dataset.alt === '2' ? (toAr ? TXT.altAr2 : TXT.altEn2) : (toAr ? TXT.altAr1 : TXT.altEn1);
        f.dataset.label = lab;
        const lg = f.querySelector('legend');
        if (lg) lg.textContent = lab;
      }
      f.hidden = hide;
    });
  }
  function syncControls(source) {
    controls.forEach(c => {
      const k = c.dataset.key;
      if (c.type === 'checkbox') c.checked = String(state[k] || '').split(',').includes(c.value);
      else if (c.type === 'radio') c.checked = c.value === state[k];
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
      const curAr = font().kind === 'arabic';
      if (F.kind === 'arabic' && !ar) t = (curAr && state.textAlt) || toArabic(n);
      if (F.kind !== 'arabic' && ar) t = (!curAr && state.textAlt) || toLatin(n);
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
      if (f.querySelector('input[type=checkbox]')) {
        v = Array.from(f.querySelectorAll('input[type=checkbox]:checked')).map(i => i.closest('label').querySelector('.chip-t').textContent.trim()).join(', ');
      } else if (checked) {
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
  // ---------- Entwurf als Link: öffnet genau diese Gestaltung wieder ----------
  const KEYS = {
    studio: ['text', 'text2', 'textAlt', 'text2Alt', 'join', 'style', 'accent', 'underline', 'thick', 'chain', 'gold', 'stone', 'len'],
    builder: ['piece', 'gold', 'text', 'textAlt', 'style', 'motif', 'enamel', 'stone', 'size']
  };
  function designUrl(kind) {
    const raw = (kind === 'studio' ? 's' : 'b') + '|' + KEYS[kind].map(k => String(state[k] || '').replace(/\|/g, ' ')).join('|');
    const bytes = new TextEncoder().encode(raw);
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    const d = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return location.origin + location.pathname + '?d=' + d + (kind === 'studio' ? '#name' : '#design');
  }
  function readDesign() {
    const d = new URLSearchParams(location.search).get('d');
    if (!d) return null;
    try {
      const bin = atob(d.replace(/-/g, '+').replace(/_/g, '/'));
      const txt = new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
      if (txt.charAt(0) === '{') {            // ältere, lange Links
        const o = JSON.parse(txt);
        return o && KEYS[o.f] ? o : null;
      }
      const parts = txt.split('|');
      const f = parts[0] === 's' ? 'studio' : parts[0] === 'b' ? 'builder' : null;
      if (!f) return null;
      const o = { f };
      KEYS[f].forEach((k, i) => { if (parts[i + 1]) o[k] = parts[i + 1]; });
      return o;
    } catch (e) { return null; }
  }
  function message(form) {
    const L = lines(form);
    const hello = form.dataset.form === 'studio' ? TXT.helloName : TXT.hello;
    return hello + '\n\n' + L.map(([k, v]) => '• ' + k + ': ' + v).join('\n') + '\n\n' + TXT.ask +
      '\n\n' + TXT.linkLabel + designUrl(form.dataset.form);
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
      const msg = message(form);
      form.querySelectorAll('[data-wa]').forEach(a => { a.href = wa(msg); });
    });
    if (touched) preparePng();
  }

  // ---------- Entwurf als Bild (PNG): Skizze + Angaben, Schrift wird eingebettet ----------
  const fontCache = {};
  function fontCss(family) {
    if (fontCache[family]) return fontCache[family];
    const link = Array.from(document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]'))
      .find(l => decodeURIComponent(l.href).replace(/\+/g, ' ').includes('family=' + family));
    if (!link) return Promise.resolve('');
    fontCache[family] = (async () => {
      const css = await (await fetch(link.href)).text();
      const blocks = (css.match(/@font-face\s*{[^}]*}/g) || []).filter(b => b.includes("'" + family + "'"));
      const parts = await Promise.all(blocks.map(async b => {
        const m = b.match(/url\((https:[^)]+)\)/);
        if (!m) return '';
        const bytes = new Uint8Array(await (await fetch(m[1])).arrayBuffer());
        let bin = '';
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
        return b.replace(m[1], 'data:font/woff2;base64,' + btoa(bin));
      }));
      return parts.join('\n');
    })().catch(() => '');
    return fontCache[family];
  }
  async function exportPng(form) {
    const svg = form.closest('section').querySelector('svg.preview');
    const fam = font().family.split(',')[0].replace(/"/g, '').trim();
    const css = await fontCss(fam);
    const W = 1200, H = 900;
    const clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', NS);
    clone.setAttribute('width', W);
    clone.setAttribute('height', H);
    clone.querySelectorAll('.sparks').forEach(n => n.remove());
    const cr = clone.querySelector('clipPath rect');
    if (cr) { cr.setAttribute('x', -20); cr.setAttribute('width', 440); }
    const defs = clone.querySelector('defs');
    const st = document.createElementNS(NS, 'style');
    st.textContent = css;
    defs.insertBefore(st, defs.firstChild);
    const rg = el('radialGradient', { id: 'x-bg', cx: '50%', cy: '42%', r: '75%' }, defs);
    [['0', '#fdfcf9'], ['0.62', '#f3f0ea'], ['1', '#e4dfd5']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, rg));
    const bgRect = el('rect', { x: -5, y: -5, width: 410, height: 310, fill: 'url(#x-bg)' });
    clone.insertBefore(bgRect, defs.nextSibling);
    for (const im of Array.from(clone.querySelectorAll('image'))) {
      const blob = await (await fetch(im.getAttribute('href'))).blob();
      im.setAttribute('href', await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); }));
    }
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
    const img = new Image();
    img.src = url;
    await img.decode();
    const L = lines(form);
    const pad = 56, lh = 42;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H + pad * 2 + 64 + L.length * lh;
    const x = c.getContext('2d');
    x.fillStyle = '#ffffff';
    x.fillRect(0, 0, c.width, c.height);
    x.drawImage(img, 0, 0, W, H);
    URL.revokeObjectURL(url);
    const rtl = LANG === 'ar';
    x.direction = rtl ? 'rtl' : 'ltr';
    x.textAlign = rtl ? 'right' : 'left';
    const X = rtl ? W - pad : pad;
    x.fillStyle = '#1d1f1e';
    x.font = '600 36px Alexandria, sans-serif';
    x.fillText('Empire Jewelry', X, H + pad + 22);
    x.font = '400 27px Alexandria, sans-serif';
    x.fillStyle = '#3d413f';
    L.forEach(([k, v], i) => x.fillText(k + ': ' + v, X, H + pad + 84 + i * lh));
    return new Promise(r => c.toBlob(r, 'image/png'));
  }
  window.__exportPng = exportPng;

  // Bild des Entwurfs vorbereiten, sobald sich nichts mehr ändert (dann ist es beim Tippen auf Senden sofort da)
  const pngCache = new Map();
  let pngTimer = null;
  function preparePng() {
    clearTimeout(pngTimer);
    pngTimer = setTimeout(() => {
      forms.forEach(form => {
        const key = message(form) + state.gold + state.chain + state.accent;
        const c = pngCache.get(form);
        if (c && c.key === key) return;
        const blob = exportPng(form).catch(() => null);
        pngCache.set(form, { key, blob });
      });
    }, 900);
  }
  function pngFor(form) {
    const key = message(form) + state.gold + state.chain + state.accent;
    const c = pngCache.get(form);
    if (c && c.key === key) return c.blob;
    const blob = exportPng(form);
    pngCache.set(form, { key, blob });
    return blob;
  }
  // WhatsApp kann über einen Link nur Text übernehmen. Darum: Bild kopieren, Chat öffnen, Kunde fügt es ein.
  forms.forEach(form => form.querySelectorAll('[data-wa]').forEach(a => a.addEventListener('click', async e => {
    if (!(navigator.clipboard && window.ClipboardItem)) return;   // dann nur Text, wie bisher
    e.preventDefault();
    const href = a.href;
    const status = form.querySelector('[data-save-status]');
    const phone = window.matchMedia('(pointer: coarse)').matches;
    try {
      const write = navigator.clipboard.write([new ClipboardItem({ 'image/png': Promise.resolve(pngFor(form)).then(b => b || Promise.reject(new Error('png'))) })]);
      await Promise.race([write, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 2500))]);
      if (status) status.textContent = phone ? TXT.pastePhone : TXT.pasteDesk;
    } catch (err) {
      if (status) status.textContent = TXT.pasteFail;
    }
    const w = window.open(href, '_blank');
    if (w) w.opener = null; else location.href = href;
  })));
  forms.forEach(form => {
    const btn = form.querySelector('[data-save]');
    const status = form.querySelector('[data-save-status]');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      if (status) status.textContent = TXT.making;
      try {
        const blob = await exportPng(form);
        const file = new File([blob], 'empire-jewelry-design.png', { type: 'image/png' });
        const phone = window.matchMedia('(pointer: coarse)').matches;
        if (phone && navigator.canShare && navigator.canShare({ files: [file] })) {
          // am Handy: Teilen-Menü (WhatsApp wählen) mit Bild und Text
          if (status) status.textContent = '';
          await navigator.share({ files: [file], text: message(form) });
        } else {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 5000);
          if (status) status.textContent = TXT.saved;
        }
      } catch (e) {
        if (status) status.textContent = e && e.name === 'AbortError' ? '' : TXT.saveFail;
      }
      btn.disabled = false;
    });
  });

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
  let lastKind = font().kind === 'arabic';
  function onChange(e) {
    const c = e.target;
    const k = c.dataset && c.dataset.key;
    if (!k) return;
    let val = c.value;
    if (c.type === 'checkbox') {
      const group = Array.from(c.closest('fieldset').querySelectorAll('input[type=checkbox][data-key="' + k + '"]'));
      let on = group.filter(i => i.checked).map(i => i.value);
      if (on.filter(v => v !== 'crown').length > 3) { c.checked = false; on = on.filter(v => v !== c.value); }
      val = on.join(',');
    }
    if ((c.type === 'radio' && !c.checked) || state[k] === val) return;
    state[k] = val;
    touched = true;
    if (k === 'textAlt' || k === 'text2Alt') altEdited[k] = !!c.value.trim();
    if (k === 'text') altEdited.textAlt = false;
    if (k === 'text2') altEdited.text2Alt = false;
    if (k === 'style') {
      const nowAr = font().kind === 'arabic';
      if (nowAr !== lastKind) { altEdited.textAlt = altEdited.text2Alt = false; lastKind = nowAr; }
    }
    if (k !== 'textAlt' && k !== 'text2Alt') refreshAlt();
    if (k === 'piece') updateSizes();
    updateFields();
    updateSamples();
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
    altEdited.textAlt = altEdited.text2Alt = false;
    refreshAlt(); updateSizes(); updateFields(); syncControls(null); updateSamples();
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

  const shared = readDesign();
  if (shared) {
    KEYS[shared.f].forEach(k => { if (typeof shared[k] === 'string') state[k] = shared[k].slice(0, 40); });
    if (shared.textAlt) altEdited.textAlt = true;
    if (shared.text2Alt) altEdited.text2Alt = true;
    lastKind = font().kind === 'arabic';
  }
  refreshAlt(); updateSizes();
  if (shared && shared.size) state.size = shared.size;
  updateFields(); syncControls(null); updateSamples(); updateOutputs();

  const io = new IntersectionObserver(entries => entries.forEach(en => {
    const s = en.target;
    s._visible = en.isIntersecting;
    if (en.isIntersecting && !s._seen && s._ctx) {
      if (s === heroSvg) intro(s);
      else { s._seen = true; setTimeout(() => fx(s, 4), 250); }
    }
  }), { threshold: 0.4 });

  Promise.all([fontsReady(), bustReady]).then(() => {
    renderAll();
    previews.forEach(s => io.observe(s));
    if (shared) {
      const target = document.getElementById(shared.f === 'studio' ? 'name' : 'design');
      if (target) setTimeout(() => goTo(target), 300);
    }
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
