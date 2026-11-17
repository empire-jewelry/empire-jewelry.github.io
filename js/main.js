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
  // Handy/Tablet: keine Glanz- und Glitzer-Effekte an der Kette (die Licht-Filter der Goldschrift
  // müssten dafür in jedem Bild neu berechnet werden, das ruckelt auf Handys)
  const LITE = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
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
      similar: 'Similar to the photo:',
      fallbackName: 'Layla', amp: '&', sketch: 'Sketch:', menu: 'Menu', close: 'Close',
      altAr1: 'Name in Arabic letters', altAr2: 'Second name in Arabic letters',
      altEn1: 'Name in English letters', altEn2: 'Second name in English letters',
      linkLabel: 'See my design: ',
      making: 'Making the picture…',
      saved: 'Picture saved. You can attach it in WhatsApp.',
      saveFail: 'The picture could not be made. Send the message instead: it lists every detail of your design.',
      pastePhone: 'Picture copied. In WhatsApp, long-press the message box, tap Paste and send the picture.',
      pasteDesk: 'Picture copied. In WhatsApp, press Ctrl+V to add it, then send.',
      pasteFail: 'The picture could not be copied. Tap “Save as picture” and attach it in WhatsApp.',
      zoomOpen: 'Enlarge', zoomClose: 'Close', zoomIn: 'Zoom in', zoomOut: 'Zoom out',
      zoomHint: 'Tap the picture to zoom in, drag to move.',
      helloMap: 'Hello Empire Jewelry, I designed this Lebanon map pendant on your website:',
      helloBracelet: 'Hello Empire Jewelry, I designed this name bracelet on your website:',
      helloPin: 'Hello Empire Jewelry, I designed this name pin on your website:',
      sum: { necklace: 'Your name necklace', bracelet: 'Your name bracelet', pin: 'Your name pin' },
      spotUnder: (l, n) => 'below “' + l + '” in ' + n, spotOn: (l, n) => 'on top of “' + l + '” in ' + n,
      spotChainL: 'on the chain, left', spotChainR: 'on the chain, right', spotSlot: n => ' (spot ' + n + ' from the name)',
      spotPick: n => 'Now tap the spot for the ' + n.toLowerCase() + ' (a dot on the picture).',
      dragHint: 'Tap a charm for colours, drag to move it',
      popHint: 'Tap a dot to move it, or drag it.',
      ccTitle: 'Choose a colour for each charm',
      heroOpen: 'Design this piece yourself',
      colsLabel: 'Charm colours',
      mapText: 'Lebanon', mapName: 'LEBANON',
      mapCities: { tripoli: 'TRIPOLI', beirut: 'BEIRUT', saida: 'SAIDA', tyre: 'TYRE' }
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
      similar: 'مثل الصورة:',
      fallbackName: 'ليلى', amp: 'و', sketch: 'رسم:', menu: 'القائمة', close: 'إغلاق',
      altAr1: 'الاسم بالأحرف العربية', altAr2: 'الاسم الثاني بالأحرف العربية',
      altEn1: 'الاسم بالأحرف الإنجليزية', altEn2: 'الاسم الثاني بالأحرف الإنجليزية',
      linkLabel: 'شاهد تصميمي: ',
      making: 'جارٍ تجهيز الصورة…',
      saved: 'تم حفظ الصورة. يمكنك إرفاقها في واتساب.',
      saveFail: 'تعذّر تجهيز الصورة. أرسل الرسالة، فهي تحتوي على كل تفاصيل تصميمك.',
      pastePhone: 'تم نسخ الصورة. في واتساب اضغط مطولاً على خانة الكتابة، ثم «لصق»، وأرسل الصورة.',
      pasteDesk: 'تم نسخ الصورة. في واتساب اضغط Ctrl+V لإضافتها، ثم أرسل.',
      pasteFail: 'تعذّر نسخ الصورة. اضغط «احفظ كصورة» وأرفقها في واتساب.',
      zoomOpen: 'تكبير', zoomClose: 'إغلاق', zoomIn: 'تكبير', zoomOut: 'تصغير',
      zoomHint: 'اضغط على الصورة للتكبير، واسحب لتحريكها.',
      helloMap: 'مرحباً Empire Jewelry، صممت قلادة خريطة لبنان هذه على موقعكم:',
      helloBracelet: 'مرحباً Empire Jewelry، صممت هذه الإسوارة بالاسم على موقعكم:',
      helloPin: 'مرحباً Empire Jewelry، صممت هذا الدبوس بالاسم على موقعكم:',
      sum: { necklace: 'قلادتك بالاسم', bracelet: 'إسوارتك بالاسم', pin: 'دبوسك بالاسم' },
      spotUnder: (l, n) => 'تحت «' + l + '» في ' + n, spotOn: (l, n) => 'فوق «' + l + '» في ' + n,
      spotChainL: 'على السلسلة، يسار', spotChainR: 'على السلسلة، يمين', spotSlot: n => ' (المكان ' + n + ' من الاسم)',
      spotPick: n => 'اضغط الآن على مكان «' + n + '» (إحدى النقاط على الصورة).',
      dragHint: 'اضغط على التعليقة للألوان، واسحبها لتحريكها',
      popHint: 'اضغط على نقطة لتحريكها، أو اسحبها.',
      ccTitle: 'اختر لوناً لكل تعليقة',
      heroOpen: 'صمّم هذه القطعة بنفسك',
      colsLabel: 'ألوان التعاليق',
      mapText: 'لبنان', mapName: 'لبنان',
      mapCities: { tripoli: 'طرابلس', beirut: 'بيروت', saida: 'صيدا', tyre: 'صور' }
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

  // Schriften wie bei Namensketten üblich: Schreibschrift, Druckschrift, arabische Kalligrafie
  const FONTS = {
    script: { family: '"Great Vibes", "Aref Ruqaa", cursive', weight: 400, scale: 1.3, kind: 'script' },
    allura: { family: '"Allura", "Aref Ruqaa", cursive', weight: 400, scale: 1.32, kind: 'script' },
    sacramento: { family: '"Sacramento", "Aref Ruqaa", cursive', weight: 400, scale: 1.4, kind: 'script', thin: true },
    dancing: { family: '"Dancing Script", "Aref Ruqaa", cursive', weight: 500, scale: 1.05, kind: 'script' },
    pacifico: { family: '"Pacifico", "Aref Ruqaa", cursive', weight: 400, scale: 0.86, kind: 'script' },
    serif: { family: '"Playfair Display", "Amiri", serif', weight: 500, scale: 0.88, kind: 'print', spacing: -0.02 },
    block: { family: '"Montserrat", "Reem Kufi", sans-serif', weight: 500, scale: 0.72, kind: 'print', upper: true, spacing: -0.01 },
    bubble: { family: '"Fredoka", "Reem Kufi", sans-serif', weight: 500, scale: 0.86, kind: 'print', spacing: -0.05 },
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

  // Libanon-Umriss aus Natural Earth 1:10m (gemeinfrei), vereinfacht mit Empire_Jewelry_Werkstatt\karte_libanon.py.
  // Feld: Höhe 100, Breite 76,5, Norden oben. top = nördlichster Punkt (dort sitzt die Öse), center = Schwerpunkt.
  const LEB = (() => {
    const d = 'M61.5 0L64.5 3.6L65.7 4L68.2 3.6L68 5.5L67.6 5.8L66.3 5.1L65.6 5.6L65.3 8.2L62.1 10.6L62.9 11.9L65.8 11.5L67.8 11.8L68.7 13.7L72.5 16.2L72.7 17.4L72.2 20.5L74.1 23.1L75.4 23.8L74.4 26L75 28.1L76.5 29.9L73.9 33.5L70.6 36.7L70 38.9L68.4 39.3L66.8 38.8L65.7 39.4L60.5 45.4L59.5 47.8L61.6 50L64.5 50.9L64.6 52.1L64 52.9L61.1 52.6L57.6 51.2L55.3 52.5L54.2 52.6L52.8 51.3L48.4 53.4L43.2 59.9L43.1 62.2L42 62.9L41.8 64.2L47.3 66.8L47.8 67.5L47.6 68.6L45.8 70.2L42.4 71.1L41.8 71.9L42.5 73.1L41.7 75.1L36.7 78.5L34.1 82.4L30.5 83.6L28.1 86.5L26.5 86.9L25.6 88.7L23.5 86.1L22.9 86.2L21.4 89.8L21 94.4L19.4 98.1L12.5 100L11.8 99.9L10.5 97.9L9.4 97.2L6.9 97.8L5.5 97.6L4.4 98.3L0.3 98L0 97.2L1.3 95.3L2.4 94.8L3.5 93L3.2 92.6L3.8 93L5.3 89.6L5.6 87.8L4.5 86.2L6.4 84.3L7.3 81.6L7.7 78.3L8.9 76.1L8.7 75.4L12.7 71.9L15.3 64L15 63.6L15.8 62.9L16.4 60.4L17.2 59.8L19.2 54.1L19.5 49.9L18.9 48.1L19.7 47.5L21.2 48.1L24 47.6L26.1 42.5L27.5 42.2L26.8 40.9L26.8 39.4L27.9 34.8L27 32.8L26.8 29.8L27.9 28.5L28.1 24.7L28.8 23.1L30 22L30.8 22.7L33.1 18.2L35.9 16.7L36.8 15.5L35.9 13.6L36.8 13.9L40.9 12.8L44.9 9.1L45.3 5.4L44.3 2.3L47.7 3.6L53.7 3.7L54.9 3.2L56 3.9L59.1 3.7L60.1 3L60.5 0.7Z';
    const n = d.match(/-?\d+(\.\d+)?/g).map(Number);
    const pts = [];
    for (let i = 0; i < n.length; i += 2) pts.push([n[i], n[i + 1]]);
    const top = [61.5, 0], center = [39.7, 47.0];
    // frei hängend dreht sich die Karte, bis der Schwerpunkt genau unter der Öse liegt
    const rot = Math.atan2(center[0] - top[0], center[1] - top[1]) * 180 / Math.PI;
    // Orte und Flüsse (aus Länge/Breite mit derselben Projektion, grob, nur für Herz und Gravur)
    const cities = { beirut: [20.4, 48.9], tripoli: [37.7, 15.2], saida: [13.8, 69.1], tyre: [5.1, 86.9], nabatieh: [19.3, 80.1],
      zahle: [40.7, 51.3], baalbek: [56.5, 41.5], jbeil: [28.0, 34.8], jounieh: [26.5, 43.4], batroun: [28.5, 26.8],
      zgharta: [40.7, 17.6], halba: [49.9, 9.0], hermel: [65.1, 18.2], aley: [25.5, 53.8], baabda: [22.4, 52.5],
      beiteddine: [24.4, 60.5], jezzine: [24.4, 70.3], marjayoun: [24.9, 81.3], bintjbeil: [16.8, 96.1], rashaya: [37.7, 72.8] };
    const rivers = [[[52.4, 43.4], [48.3, 48.3], [43.3, 54.4], [38.2, 60.5], [31.6, 67.9], [28.5, 72.8], [25.5, 78.9], [22.9, 83.2], [18.8, 83.2], [13.2, 83.2], [7.6, 82.6]],
      [[62.6, 23.7], [65.1, 18.8], [68.7, 13.3], [71.2, 8.4]], [[40.2, 37.8], [35.6, 37.2], [31.6, 37.8], [27.5, 37.8]],
      [[35.6, 44.0], [30.5, 44.6], [25.5, 44.6]], [[30.5, 51.3], [25.5, 50.7], [21.9, 48.3]], [[28.0, 59.3], [22.9, 59.9], [17.8, 60.5]],
      [[26.5, 61.7], [21.4, 65.4], [14.8, 67.9]], [[20.4, 74.6], [16.3, 74.0], [11.2, 73.4]], [[47.3, 26.8], [43.3, 21.9], [39.2, 17.6], [37.7, 15.2]],
      [[50.9, 17.6], [46.8, 14.6], [43.3, 10.9]], [[35.6, 75.8], [30.5, 85.0], [27.0, 89.9]]];
    // Punkt innerhalb des Umrisses? (für das Herz, damit es nicht über den Rand geht)
    const inside = (x, y) => {
      let c = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
    return { d, pts, top, center, rot, axis: -57.2, cities, rivers, inside };
  })();
  // Zeder wie auf der Flagge (Einheitsfeld, Breite 1)
  const CEDAR_FLAG = 'M0-.5L.09-.38L.04-.37L.19-.24L.08-.23L.31-.08L.12-.07L.43 .1L.16 .11L.5 .29L.06 .29L.06 .48L-.06 .48L-.06 .29L-.5 .29L-.16 .11L-.43 .1L-.12-.07L-.31-.08L-.08-.23L-.19-.24L-.04-.37L-.09-.38Z';

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
      // echter Umriss (LEB), mittig ins Feld geschoben; Stein sitzt bei Nabatieh
      hang: [LEB.top[0] + 11.8, 1], stone: [LEB.cities.nabatieh[0] + 11.8, LEB.cities.nabatieh[1]],
      glints: ['tripoli', 'beirut', 'zahle', 'saida', 'baalbek'].map(c => [LEB.cities[c][0] + 11.8, LEB.cities[c][1]]),
      shapes: [P('M' + LEB.pts.map(p => (p[0] + 11.8).toFixed(1) + ' ' + p[1]).join('L') + 'Z', 'body')]
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
    eye: 'M0-.5A.5 .5 0 1 1 0 .5A.5 .5 0 1 1 0-.5Z',
    // Kinder-Anhänger wie auf Malaks Fotos (Umriss = Metall, Farben kommen als Emaille darüber)
    teddy: ring(-.27, -.36, .12) + ring(.27, -.36, .12) + ring(0, -.2, .25) + ring(0, .2, .27, .25) +
      ring(-.29, .13, .1) + ring(.29, .13, .1) + ring(-.15, .41, .09) + ring(.15, .41, .09),
    car: 'M-.48 .14V0C-.48-.08-.42-.12-.34-.13L-.24-.14C-.18-.3-.08-.36 .04-.36C.18-.36 .24-.28 .28-.14L.38-.13C.46-.12 .48-.06 .48 0V.14Z' +
      ring(-.25, .16, .13) + ring(.26, .16, .13),
    allah: 'M0-.5C.12-.3 .36-.1 .36 .14C.36 .36 .2 .48 0 .48C-.2 .48-.36 .36-.36 .14C-.36-.1-.12-.3 0-.5Z',
    stone: 'M-.32-.4H.32L.5-.1 0 .48-.5-.1Z'          // Geburtsstein (Symbol in der Liste)
  };
  // Kreis bzw. Ellipse als Pfadstück (für zusammengesetzte Anhänger)
  function ring(cx, cy, rx, ry) {
    ry = ry || rx;
    return 'M' + (cx - rx) + ' ' + cy + 'a' + rx + ' ' + ry + ' 0 1 0 ' + 2 * rx + ' 0a' + rx + ' ' + ry + ' 0 1 0 ' + (-2 * rx) + ' 0Z';
  }
  // Aufhängepunkt oben am Anhänger (y im Einheitsfeld), dort sitzt der kleine Ring
  const CHARM_HANG = { heart: -0.24, star: -0.5, butterfly: -0.1, cedar: -0.5, hamsa: -0.48, flower: -0.48, coin: -0.5, eye: -0.5,
    teddy: -0.47, car: -0.37, allah: -0.5, stone: -0.5 };
  // Emaille-Farben für den Namen und für Herz, Stern, Schmetterling, Blume (metal = ohne Farbe)
  const PAINT = { metal: null, blue: '#4ea8e2', turquoise: '#33b3bd', pink: '#f29bbb', red: '#d0263a', white: '#f6f4ef', black: '#222326' };
  const PAINTABLE = ['heart', 'star', 'butterfly', 'flower'];
  const MAX_CHARMS = 5;     // so viele Anhänger darf der Kunde wählen (die Krone zählt nicht mit)
  // Farben je Anhänger (Banner beim Antippen im Bild): Schlüssel, Farbe (null = nur Gold), Name EN / AR
  const CHARM_COLS = [
    ['metal', null, 'Gold', 'ذهبي'], ['clear', '#e6eefc', 'Clear', 'شفاف'], ['red', '#d0263a', 'Red', 'أحمر'], ['pink', '#f29bbb', 'Pink', 'زهري'],
    ['rose', '#f8c9d4', 'Light pink', 'زهري فاتح'], ['purple', '#8a5bd1', 'Purple', 'بنفسجي'], ['lilac', '#c6a9ec', 'Lilac', 'ليلكي'],
    ['blue', '#2f6fd0', 'Blue', 'أزرق'], ['lightblue', '#6fbfec', 'Light blue', 'أزرق فاتح'], ['turquoise', '#33b3bd', 'Turquoise', 'فيروزي'],
    ['mint', '#97d8bf', 'Mint', 'نعناعي'], ['green', '#2f9d63', 'Green', 'أخضر'], ['yellow', '#f2c53d', 'Yellow', 'أصفر'],
    ['orange', '#ef8a3a', 'Orange', 'برتقالي'], ['white', '#f6f4ef', 'White', 'أبيض'], ['black', '#222326', 'Black', 'أسود']
  ];
  const CHARM_HEX = {};
  CHARM_COLS.forEach(c => { CHARM_HEX[c[0]] = c[1]; });
  // Startfarben wie auf Malaks Fotos (Teddy mit hellblauem Hemd, blaues Auto, Auge und „الله“ blau), sonst Gold
  const CHARM_DEFAULT = { teddy: 'lightblue', car: 'lightblue', eye: 'blue', allah: 'blue', stone: 'clear' };
  // state.charmCols = "heart=red,teddy=pink"
  function charmColsMap() {
    const m = {};
    String(state.charmCols || '').split(',').forEach(p => { const [n, c] = p.split('='); if (n && c in CHARM_HEX) m[n] = c; });
    return m;
  }
  // der Geburtsstein hat immer eine Steinfarbe (Standard klar), die anderen kein „Klar“
  const charmColKey = name => {
    const k = charmColsMap()[name];
    if (name === 'stone') return k && k !== 'metal' ? k : 'clear';
    return k && k !== 'clear' ? k : CHARM_DEFAULT[name] || 'metal';
  };
  const charmHex = name => CHARM_HEX[charmColKey(name)];
  const colName = key => { const c = CHARM_COLS.find(x => x[0] === key); return c ? c[LANG === 'ar' ? 3 : 2] : key; };
  // Selbst platzierte Anhänger: state.spots = "heart=u1.3,teddy=cL,star=o1.0"
  // u = hängt unter dem Buchstaben (Name 1 oder 2, Zeichen-Nr.), o = klein oben auf dem Buchstaben, cL/cR = an der Kette
  const ON_LETTER = ['heart', 'star', 'butterfly', 'flower', 'stone'];
  function spotsMap() {
    const m = {};
    String(state.spots || '').split(',').forEach(p => {
      const [n, c] = p.split('=');
      if (n && c && /^(?:[uo][12]\.\d+|c[LR]\d?)$/.test(c)) m[n] = c;
    });
    return m;
  }

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
    piece: 'pendant', gold: 'yellow', karat: '18k', text: TXT.fallbackName, text2: '', textAlt: '', text2Alt: '', join: 'heart', style: 'script',
    accent: 'none', underline: 'none', thick: 'std', chain: 'cable', motif: 'butterfly', enamel: 'none',
    stone: 'none', size: '', len: '', notes: '', mapDesign: 'flag', mapText: '', mapHeart: 'none',
    item: 'necklace', nameColor: 'metal', charmColor: 'metal', charmPos: 'below', wrist: '', chainHeart: 'none', spots: '', charmCols: ''
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
  let zoomBox = null, zoomSvg = null;  // Vergrößerung (Vollbild), siehe unten

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

  // Steinfarbe als glänzender Verlauf (Geburtsstein-Anhänger), je Farbe einmal pro Zeichnung
  function gemFill(ctx, c) {
    ctx.stoneG = ctx.stoneG || {};
    if (!ctx.stoneG[c]) {
      const id = ctx.id + '-st' + Object.keys(ctx.stoneG).length;
      const rg = el('radialGradient', { id, cx: '38%', cy: '34%', r: '70%' }, ctx.defs);
      el('stop', { offset: 0, 'stop-color': '#ffffff' }, rg);
      el('stop', { offset: 0.3, 'stop-color': shade(c, 0.3) }, rg);
      el('stop', { offset: 0.7, 'stop-color': c }, rg);
      el('stop', { offset: 1, 'stop-color': shade(c, -0.45) }, rg);
      ctx.stoneG[c] = 'url(#' + id + ')';
    }
    return ctx.stoneG[c];
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
  function inkScan(draw, x0, x1, yTop, yBot, yCut, fs) {
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
    // zusammenhängende Metallstücke suchen: Punkte und kleine Zeichen (z. B. die Punkte unter ي) hängen lose
    // und dürfen keine Öse tragen, die Kette gehört an den ersten bzw. letzten Buchstaben
    const lab = new Int32Array(w * h), area = [0], box = [null];
    const stack = [];
    for (let i = 0; i < w * h; i++) {
      if (lab[i] || data[i * 4 + 3] <= 90) continue;
      const id = area.length;
      let n = 0, xa = w, xb = 0, ya = h, yb = 0;
      lab[i] = id; stack.push(i);
      while (stack.length) {
        const j = stack.pop(), x = j % w, y = (j - x) / w;
        n++;
        if (x < xa) xa = x; if (x > xb) xb = x; if (y < ya) ya = y; if (y > yb) yb = y;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const k = ny * w + nx;
          if (!lab[k] && data[k * 4 + 3] > 90) { lab[k] = id; stack.push(k); }
        }
      }
      area.push(n); box.push([xa, xb, ya, yb]);
    }
    // lose = schmaler als 0,36 und flacher als 0,22 Schriftgrößen (Buchstaben wie ر oder ز sind größer)
    const loose = box.map(bx => !!bx && (bx[1] - bx[0] + 1) / SC < 0.36 * fs && (bx[3] - bx[2] + 1) / SC < 0.22 * fs);
    const holds = (x, y) => { const id = lab[y * w + x]; return id > 0 && !loose[id]; };
    let L = null, R = null;
    for (let y = 0; y < cutRow; y++) {
      for (let x = 0; x < w; x++) if (holds(x, y)) { if (!L || x < L[0]) L = [x, y]; break; }
      for (let x = w - 1; x >= 0; x--) if (holds(x, y)) { if (!R || x > R[0]) R = [x, y]; break; }
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

  // glänzende Emaille: Verlauf von hell nach dunkel, je Farbe einmal pro Zeichnung
  function enamelFill(ctx, c) {
    ctx.enamel = ctx.enamel || {};
    if (!ctx.enamel[c]) {
      const id = ctx.id + '-en' + Object.keys(ctx.enamel).length;
      const lg = el('linearGradient', { id, x1: 0, y1: 0, x2: 0.3, y2: 1 }, ctx.defs);
      el('stop', { offset: 0, 'stop-color': shade(c, 0.38) }, lg);
      el('stop', { offset: 0.45, 'stop-color': c }, lg);
      el('stop', { offset: 1, 'stop-color': shade(c, -0.2) }, lg);
      ctx.enamel[c] = 'url(#' + id + ')';
    }
    return ctx.enamel[c];
  }

  // ein Anhänger (Herz, Hamsa, Auge …) im Layout zeichnen; topY = Aufhängepunkt.
  // parent bekommt das Metall (mit Licht-Filter), enParent die Emaille-Farben (ohne Filter, sonst werden sie blass)
  function drawCharm(ctx, parent, name, cx, topY, size, stoneFill, enParent) {
    const cy = topY - CHARM_HANG[name] * size;
    const tf = 'translate(' + cx + ' ' + cy + ') scale(' + size + ')';
    const g = el('g', { transform: tf, 'data-charm': name }, parent);
    // unsichtbare Greiffläche: auch die Lücke zwischen Flügeln oder Blütenblättern lässt sich anfassen
    if (ctx.studio) el('circle', { r: 0.56, fill: '#000', 'fill-opacity': 0, stroke: 'none', 'pointer-events': 'all' }, g);
    const en = enParent ? el('g', { transform: tf, stroke: 'none', 'data-charm': name }, enParent) : g;
    const dot = (x, y, r, fill, ry) => el(ry ? 'ellipse' : 'circle', ry ? { cx: x, cy: y, rx: r, ry, fill, stroke: 'none' } : { cx: x, cy: y, r, fill, stroke: 'none' }, en);
    const hex = charmHex(name);          // gewählte Farbe dieses Anhängers, null = nur Gold
    if (name === 'stone') {
      // Geburtsstein: rund in Gold gefasst, mit Lichtpunkt
      el('circle', { r: 0.5, 'stroke-width': 0.03 }, g);
      dot(0, 0, 0.39, gemFill(ctx, hex || '#e6eefc'));
      el('circle', { cx: -0.13, cy: -0.14, r: 0.11, fill: '#fff', opacity: 0.85, stroke: 'none' }, en);
    } else if (name === 'eye') {
      el('circle', { r: 0.5, 'stroke-width': 0.03 }, g);
      if (hex) {
        dot(0, 0, 0.42, enamelFill(ctx, hex));
        dot(0, 0, 0.27, '#f6f4ee');
        dot(0, 0, 0.17, '#57b0e3');
        dot(0, 0, 0.08, '#14161a');
      } else {
        el('circle', { r: 0.28, fill: 'none', stroke: ctx.dark, 'stroke-opacity': 0.6, 'stroke-width': 0.045 }, g);
        dot(0, 0, 0.09, '#14161a');
      }
    } else if (name === 'teddy') {
      // Teddy wie auf den Fotos: braun mit farbigem Hemd, Gesicht hell; in Gold nur Augen und Nase
      el('path', { d: CHARMS.teddy, 'stroke-width': 0.03 }, g);
      if (hex) {
        const brown = enamelFill(ctx, '#b67f69');
        dot(-0.27, -0.36, 0.075, '#e5b3a4'); dot(0.27, -0.36, 0.075, '#e5b3a4');
        dot(-0.29, 0.13, 0.065, brown); dot(0.29, 0.13, 0.065, brown);
        dot(-0.15, 0.41, 0.055, brown); dot(0.15, 0.41, 0.055, brown);
        dot(0, 0.2, 0.21, enamelFill(ctx, hex), 0.2);
        dot(0, -0.2, 0.205, brown);
        dot(0, -0.13, 0.095, '#f1d6c8', 0.068);
      }
      dot(-0.085, -0.25, 0.026, '#2a2020'); dot(0.085, -0.25, 0.026, '#2a2020');
      dot(0, -0.155, 0.032, '#2a2020', 0.022);
    } else if (name === 'car') {
      // kleines Auto: farbige Karosserie, helle Fenster, dunkle Räder mit Metallnabe
      el('path', { d: CHARMS.car, 'stroke-width': 0.03 }, g);
      if (hex) {
        el('path', { d: 'M-.42 .1V0C-.42-.05-.38-.08-.32-.08L-.2-.09C-.15-.24-.07-.3 .04-.3C.15-.3 .2-.24 .24-.09L.36-.08C.41-.07 .42-.04 .42 0V.1Z', fill: enamelFill(ctx, hex) }, en);
        el('path', { d: 'M-.14-.1C-.1-.21-.04-.25 .03-.25C.11-.25 .15-.2 .18-.1Z', fill: '#eef6fb' }, en);
        el('path', { d: 'M.02-.25V-.1', stroke: ctx.metal, 'stroke-width': 0.03 }, en);
      }
      dot(-0.25, 0.16, 0.095, '#2b313b'); dot(0.26, 0.16, 0.095, '#2b313b');
      dot(-0.25, 0.16, 0.04, ctx.metal); dot(0.26, 0.16, 0.04, ctx.metal);
    } else if (name === 'allah') {
      // Tropfen mit „الله“: emailliert mit weißer Schrift, in Gold eingraviert
      el('path', { d: CHARMS.allah, 'stroke-width': 0.03 }, g);
      if (hex) el('path', { d: CHARMS.allah, transform: 'translate(0 .03) scale(.8)', fill: enamelFill(ctx, hex) }, en);
      const light = !hex || ['#f6f4ef', '#f8c9d4', '#f2c53d', '#97d8bf'].includes(hex);
      const t = el('text', { x: 0, y: 0.14, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-family': '"Aref Ruqaa", serif', 'font-weight': 700, 'font-size': 0.34, fill: light ? ctx.dark : '#fff', 'fill-opacity': hex ? 1 : 0.7, stroke: 'none' }, en);
      t.textContent = 'الله';
    } else if (name === 'coin') {
      // gravierte Münze; mit Farbe: Emaille-Fläche, Gravur hell darauf
      el('circle', { r: 0.5, 'stroke-width': 0.03 }, g);
      if (hex) dot(0, 0, 0.43, enamelFill(ctx, hex));
      else el('circle', { r: 0.4, fill: 'none', stroke: ctx.dark, 'stroke-opacity': 0.7, 'stroke-width': 0.05 }, g);
      for (let i = -2; i <= 2; i++) {
        el('line', { x1: -0.24 + Math.abs(i) * 0.05, x2: 0.24 - Math.abs(i) * 0.05, y1: i * 0.11, y2: i * 0.11, stroke: hex ? '#fff' : ctx.dark, 'stroke-opacity': hex ? 0.75 : 0.65, 'stroke-width': 0.045, 'stroke-dasharray': '0.06 0.035' }, hex ? en : g);
      }
    } else {
      const p = el('path', { d: CHARMS[name], 'stroke-width': 0.03 }, g);
      if (stoneFill) { p.setAttribute('fill', stoneFill); p.setAttribute('stroke-width', 0.08); }
      else if (hex) {
        // farbige Emaille mit Goldrand
        el('path', { d: CHARMS[name], transform: 'scale(.76)', fill: enamelFill(ctx, hex) }, en);
      }
      const detail = hex && !stoneFill ? en : g;
      if (name === 'hamsa') el('circle', { cy: 0.2, r: 0.07, fill: 'none', stroke: hex ? '#fff' : ctx.dark, 'stroke-opacity': 0.6, 'stroke-width': 0.03 }, detail);
      if (name === 'flower') el('circle', { r: 0.12, fill: hex ? '#f2c53d' : ctx.dark, 'fill-opacity': hex ? 1 : 0.25, stroke: 'none' }, detail);
    }
    return cy;
  }

  // Baut Name(n), Verbinder, Unterstrich, Krone, Ösen und hängende Anhänger als eine Goldplatte.
  // fit(anchors) darf eine senkrechte Verschiebung liefern (Platte hängt an der Kette).
  // Rückgabe in SVG-Koordinaten: Box und die Einhängepunkte L/R.
  function namePlate(ctx, cx, baseY, maxW, maxSize, allowSecond, fit, maxH, opts) {
    opts = opts || {};
    const F = font();
    const raw1 = shownName(1);
    const raw2 = allowSecond ? shownName(2) : '';
    const n1 = raw1 || fallbackName();
    const rtl = isArabic(n1);
    const S = 40;                       // Layout-Schriftgröße, danach skaliert
    const fs = S * F.scale;
    const nameCol = PAINT[state.nameColor];   // Name in Emaille (Farbe mit Goldrand) oder nur Metall
    const rim = fs * 0.075;
    plateFilter(ctx);
    const pg = el('g', null, ctx.g);
    const fg = el('g', { filter: 'url(#' + ctx.id + '-plate)' }, pg);
    // Emaille liegt über dem Metall, ohne Licht-Filter; fängt keine Klicks ab (die Anhänger darunter sollen greifbar bleiben)
    const enG = el('g', { 'pointer-events': 'none' }, pg);
    if (!raw1) { fg.setAttribute('opacity', 0.4); enG.setAttribute('opacity', 0.4); }
    const outer = el('g', null, fg);
    const edge = el('use', { href: '#' + ctx.id + '-pi', fill: ctx.dark, stroke: ctx.dark }, outer);
    const main = el('g', { fill: ctx.metal, stroke: ctx.metal }, outer);
    const inner = el('g', { id: ctx.id + '-pi' }, main);

    const mkText = txt => {
      const t = el('text', { x: 0, y: 0, 'font-family': F.family, 'font-weight': F.weight, 'font-size': fs, 'stroke-width': nameCol ? rim : F.thin ? 0.5 : 0, 'stroke-linejoin': 'round' }, inner);
      if (F.spacing) t.style.letterSpacing = F.spacing + 'em';
      t.textContent = F.upper && !isArabic(txt) ? txt.toUpperCase() : txt;
      return t;
    };
    const items = [];
    const t1 = mkText(n1);
    let t2El = null;
    items.push({ kind: 'text', el: t1 });
    if (raw2) {
      if (state.join === 'amp') items.push({ kind: 'text', el: mkText(isArabic(raw2) || rtl ? TXT.amp : '&') });
      else items.push({ kind: 'charm', name: state.join === 'infinity' ? 'infinity' : 'heart', size: fs * 0.4 });
      t2El = mkText(raw2);
      items.push({ kind: 'text', el: t2El });
    }
    if (rtl) items.reverse();

    // gewählte Anhänger: hängen an Ringen unter dem Namen (wie bei Malaks Ketten); Krone sitzt auf dem ersten Buchstaben
    const picks = String(state.accent || '').split(',').filter(v => v && v !== 'none');
    const wantCrown = picks.includes('crown');
    let dangles = picks.filter(v => CHARM_HANG[v] !== undefined);
    dangles = dangles.slice(0, 6);
    // vom Kunden selbst platzierte Anhänger (gezogen oder angetippt) kommen an ihre Stelle, der Rest automatisch
    const SP = spotsMap();
    const custom = [];
    dangles = dangles.filter(n => {
      const c = SP[n];
      if (!c) return true;
      if (c[0] === 'c' && opts.pin) return true;                 // die Anstecknadel hat keine Kette
      if (c[0] === 'o' && !ON_LETTER.includes(n)) return true;
      custom.push({ name: n, code: c });
      return false;
    });
    // „an der Kette“: Anhänger hängen neben dem Namen an der Kette (zeichnet chainCharms), der Stein bleibt am Namen
    let side = [];
    if (!opts.pin && state.charmPos === 'chain') {
      side = dangles.map(n => ({ name: n, s: null }));
      dangles = dangles.filter(n => !side.some(e => e.name === n));
    }
    custom.filter(c => c.code[0] === 'c').forEach(c => side.push({ name: c.name, s: c.code[1] === 'R' ? 1 : 0, slot: +(c.code.slice(2) || 0) }));

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
    // Emaille: Kopie der Schrift ohne Rand in Farbe, so bleibt ringsum ein schmaler Goldrand sichtbar
    if (nameCol) {
      const fill = enamelFill(ctx, nameCol);
      textEls.forEach(t => {
        const c = t.cloneNode(true);
        c.setAttribute('fill', fill); c.setAttribute('stroke', 'none'); c.setAttribute('stroke-width', 0);
        enG.appendChild(c);
      });
    }
    // Herz zwischen zwei Namen in der gewählten Farbe
    items.forEach(it => {
      if (it.kind === 'charm' && it.name === 'heart' && charmHex('heart')) {
        el('path', { d: CHARMS.heart, transform: 'translate(' + it.cx + ' ' + midY + ') scale(' + (it.size * 0.76) + ')', fill: enamelFill(ctx, charmHex('heart')) }, enG);
      }
    });

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
      c.lineWidth = nameCol ? rim : F.thin ? 0.5 : 0.01;
      c.lineJoin = 'round';
      items.forEach(it => {
        if (it.kind === 'text') {
          // linke Kante aus der SVG-Box (stimmt auch auf der arabischen Seite)
          const bx = it.el.getBBox().x;
          c.fillText(it.el.textContent, bx, 0);
          if (F.thin || nameCol) c.strokeText(it.el.textContent, bx, 0);
        } else {
          c.save(); c.translate(it.cx, midY); c.scale(it.size, it.size);
          const p2 = new Path2D(CHARMS[it.name]);
          if (it.name === 'infinity') { c.lineWidth = fs * 0.05 / it.size; c.stroke(p2); } else c.fill(p2);
          c.restore();
        }
      });
      if (ulPath) { c.lineWidth = fs * 0.05; c.lineCap = 'round'; c.stroke(new Path2D(ulPath)); }
      if (ulBar) c.fillRect(ulBar[0], ulBar[1], ulBar[2], ulBar[3]);
    }, pre.x, pre.x + pre.width, pre.y - fs * 0.05, pre.y + pre.height + fs * 0.05, fs * 0.3, fs);

    // Krone sitzt oben auf dem ersten Buchstaben
    if (wantCrown) {
      let r = null;
      try { r = t1.getExtentOfChar(0); } catch (e) { r = null; }
      const bb1 = t1.getBBox();
      const xa = r ? r.x : bb1.x, xb = r ? r.x + r.width : bb1.x + fs * 0.5;
      const top = ink.topAt(xa, xb) || [(xa + xb) / 2, bb1.y];
      const cs = fs * 0.34;
      const ctf = 'translate(' + top[0] + ' ' + (top[1] - 0.25 * cs) + ') scale(' + cs + ')';
      el('path', { d: CHARMS.crown, transform: ctf, 'stroke-width': 0.6 / cs, 'data-charm': 'crown' }, inner);
      if (charmHex('crown')) el('path', { d: CHARMS.crown, transform: ctf + ' translate(0 .02) scale(.74)', fill: enamelFill(ctx, charmHex('crown')) }, enG);
    }

    // Ösen an beiden Enden (Teil der Platte); die Anstecknadel hat keine Kette, dafür eine Nadel hinter dem Namen
    const R = fs * 0.07;
    const aL = ink.L || [pre.x, midY], aR = ink.R || [pre.x + pre.width, midY];
    const eL = [aL[0] - R * 0.5, aL[1]], eR = [aR[0] + R * 0.5, aR[1]];
    if (!opts.pin) [eL, eR].forEach(e => el('circle', { cx: e[0], cy: e[1], r: R * 0.6, fill: 'none', 'stroke-width': R * 0.42 }, inner));
    const hookL = [eL[0] - R * 0.6, eL[1]], hookR = [eR[0] + R * 0.6, eR[1]];
    if (opts.pin) {
      // Nadel wie auf dem Foto: läuft hinter dem Namen, links der Verschluss, rechts die Spitze
      const by = pre.y + pre.height * 0.42, bw = fs * 0.045;
      const x0 = pre.x - fs * 0.14, x1 = pre.x + pre.width + fs * 0.4;
      const bar = el('g', null);
      el('path', { d: 'M' + x0 + ' ' + by + 'H' + (x1 - fs * 0.1), fill: 'none', 'stroke-width': bw, 'stroke-linecap': 'round' }, bar);
      el('path', { d: 'M' + (x1 - fs * 0.11) + ' ' + (by - bw * 0.5) + 'L' + x1 + ' ' + by + 'L' + (x1 - fs * 0.11) + ' ' + (by + bw * 0.5) + 'Z', 'stroke-width': 0.2 }, bar);
      el('rect', { x: x0 - fs * 0.07, y: by - fs * 0.065, width: fs * 0.13, height: fs * 0.13, rx: fs * 0.035, 'stroke-width': 0.2 }, bar);
      inner.insertBefore(bar, inner.firstChild);
    }

    // Größe aus Name und Ösen (die hängenden Anhänger zählen nicht mit)
    const bb = inner.getBBox();
    let k = Math.min(maxSize / S, maxW / Math.max(1, bb.width));
    if (maxH) k = Math.min(k, maxH / Math.max(1, bb.height));

    // hängende Anhänger: vom Ende des Namens (Leserichtung) nach innen, jeder an einem kleinen Ring
    const dir = rtl ? 1 : -1;
    const endX = rtl ? aL[0] : aR[0];
    const baseSize = n => (n === 'stone' ? fs * 0.26 : n === 'hamsa' ? fs * 0.48 : fs * 0.4);
    // Platz unter dem Namen: bei kurzen Namen werden die Anhänger kleiner, damit sie nebeneinander passen
    const avail = Math.abs(aR[0] - aL[0]) * 0.92;
    const need = dangles.reduce((sum, n) => sum + baseSize(n) * 1.15, 0);
    const shrink = need > avail ? Math.max(0.6, avail / need) : 1;
    let ax = endX + dir * fs * 0.18;
    let prevX = null;
    const hung = [];

    // Stellen, an die der Kunde Anhänger ziehen kann: unter und oben auf jedem Buchstaben
    const lt = [];
    [[1, t1], [2, t2El]].forEach(([num, tEl]) => {
      if (!tEl) return;
      const txt = tEl.textContent;
      for (let i = 0; i < txt.length; i++) {
        if (/\s/.test(txt[i])) continue;
        let r = null;
        try { r = tEl.getExtentOfChar(i); } catch (e) { r = null; }
        if (!r || !r.width) continue;
        const bot = ink.bottomAt(r.x + r.width / 2, Math.max(fs * 0.04, r.width * 0.3));
        if (bot) lt.push({ kind: 'u', ref: num + '.' + i, x: bot[0], y: bot[1] });
        const top = ink.topAt(r.x + r.width * 0.2, r.x + r.width * 0.8);
        if (top) lt.push({ kind: 'o', ref: num + '.' + i, x: top[0], y: top[1] });
      }
    });
    // selbst platzierte: unter dem Buchstaben an einem Ring, oder klein oben auf den Buchstaben gelötet
    const taken = [];
    custom.forEach(c => {
      if (c.code[0] === 'c') return;
      const t = lt.find(q => q.kind === c.code[0] && q.ref === c.code.slice(1));
      if (!t) { dangles.push(c.name); return; }        // Buchstabe gibt es nicht mehr: automatisch
      if (c.code[0] === 'u') {
        const size = baseSize(c.name), rr = fs * 0.048, ringY = t.y + rr * 0.6;
        el('circle', { cx: t.x, cy: ringY, r: rr, fill: 'none', 'stroke-width': rr * 0.42 }, inner);
        hung.push({ x: t.x, y: drawCharm(ctx, inner, c.name, t.x, ringY + rr * 0.8, size, null, enG) });
        taken.push([t.x, size]);
      } else {
        const size = fs * 0.3, cy = t.y - size * 0.22;
        drawCharm(ctx, inner, c.name, t.x, cy + CHARM_HANG[c.name] * size, size, null, enG);
        hung.push({ x: t.x, y: cy });
      }
    });
    const free = (x0, size) => taken.every(([tx0, ts]) => Math.abs(tx0 - x0) >= (size + ts) * 0.55);
    // Anstecknadel: Anhänger wie auf Malaks Foto über die ganze Breite des Namens verteilt
    const spread = opts.pin && dangles.length > 1;
    const span = [aL[0] + fs * 0.12, aR[0] - fs * 0.12];
    dangles.forEach((name, i) => {
      const size = baseSize(name) * shrink;
      // nächste Stelle mit Metall darunter suchen, mit genug Abstand zum vorigen Anhänger
      let b = null;
      if (spread) {
        const f = (i + 0.5) / dangles.length;
        const want = rtl ? span[1] - f * (span[1] - span[0]) : span[0] + f * (span[1] - span[0]);
        for (let t = 0; t < 40 && !b; t++) {
          for (const sgn of [1, -1]) {
            const hit = ink.bottomAt(want + sgn * t * fs * 0.03, fs * 0.04);
            if (hit && (prevX === null || Math.abs(hit[0] - prevX) >= size * 1.05) && free(hit[0], size)) { b = hit; break; }
          }
        }
      }
      for (let t = 0; t < 40 && !b; t++) {
        const tryX = ax + dir * t * fs * 0.03;
        const hit = ink.bottomAt(tryX, fs * 0.04);
        if (hit && (prevX === null || Math.abs(hit[0] - prevX) >= size * 1.05) && free(hit[0], size)) { b = hit; ax = tryX; }
      }
      if (!b) {
        // kein freier Platz mehr unter dem Namen (kurzer Name, viele Anhänger): an die Kette hängen,
        // beim Pin (keine Kette) und beim Stein trotzdem unter den Namen, dann etwas enger
        if (!opts.pin) { side.push({ name, s: null }); return; }
        b = ink.bottomAt(ax, fs * 0.25) || ink.bottomAt((aL[0] + aR[0]) / 2, Math.abs(aR[0] - aL[0]));
        if (!b) return;
      }
      prevX = b[0];
      const rr = fs * 0.048;
      const ringY = b[1] + rr * 0.6;
      el('circle', { cx: b[0], cy: ringY, r: rr, fill: 'none', 'stroke-width': rr * 0.42 }, inner);
      const topY = ringY + rr * 0.8;
      hung.push({ x: b[0], y: drawCharm(ctx, inner, name, b[0], topY, size, null, enG) });
      ax = b[0] + dir * (size * 1.15);
    });

    // auf Zielgröße bringen und zentrieren
    const tx = cx - (bb.x + bb.width / 2) * k;
    outer.setAttribute('transform', 'translate(' + tx.toFixed(2) + ' ' + baseY + ') scale(' + k.toFixed(4) + ')');
    enG.setAttribute('transform', outer.getAttribute('transform'));
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

    if (dy) ctx.glints = ctx.glints.map(g => [g[0], g[1] + dy]);
    hung.forEach(h => { if (!h.stone) { const q = conv([h.x, h.y]); ctx.glints.push([q[0], q[1] + dy]); } });

    // Zielstellen in SVG-Koordinaten (Ankerpunkt = wo der Anhänger dann ungefähr sitzt), nur im Bereich Namenskette
    if (ctx.studio) {
      const u = fs * k;
      ctx.charmUnit = u;
      ctx.targets = lt.map(t => {
        const q = conv([t.x, t.y]);
        return { kind: t.kind, ref: t.ref, x: q[0], y: q[1] + dy + (t.kind === 'u' ? u * 0.28 : -u * 0.06) };
      });
    }
    const box = { x: tx + bb.x * k, y: baseY + bb.y * k + dy, width: bb.width * k, height: bb.height * k };
    return { box, L, R: Rr, textEls, k, tx, eyeR: R * 0.6 * k, fs, side };
  }

  // Kettenplätze zum Selbst-Platzieren: Abstand vom Namen entlang der Kette, Platz 0 direkt neben dem Namen
  const CHAIN_STEP = 0.5;
  const slotDist = (gap, unit, i) => gap + unit * (0.2 + i * CHAIN_STEP);

  // Anhänger an der Kette neben dem Namen (wie bei Malaks Kinderketten): selbst platzierte an ihrem Platz,
  // die übrigen abwechselnd links und rechts in die nächste freie Lücke. Jeder hängt an einem kleinen Ring.
  // Braucht die zwei Kettenpfade, die hook() gerade gezeichnet hat.
  function chainCharms(ctx, pl, gap, grow) {
    if (!pl.side || !pl.side.length || ctx.chains.length < 2) return;
    const guides = ctx.chains.slice(-2);
    const metalG = el('g', { fill: ctx.metal, stroke: ctx.metal, filter: 'url(#' + ctx.id + '-plate)' }, ctx.g);
    const enG = el('g', { 'pointer-events': 'none' }, ctx.g);
    const unit = pl.fs * pl.k * (grow || 1);
    const sizeOf = n => (n === 'hamsa' ? 0.48 : n === 'car' ? 0.48 : n === 'teddy' ? 0.46 : n === 'stone' ? 0.3 : 0.42) * unit;
    const used = [0, 0], occ = [[], []], next = [null, null];
    const put = (name, s, d, size) => {
      const p = alongChain(guides[s], s ? pl.R : pl.L, d);
      const rr = unit * 0.05;
      el('circle', { cx: p.x, cy: p.y + rr * 0.8, r: rr, fill: 'none', 'stroke-width': rr * 0.45 }, metalG);
      drawCharm(ctx, metalG, name, p.x, p.y + rr * 1.7, size, null, enG);
      ctx.glints.push([p.x, p.y + size * 0.7]);
      occ[s].push([d, size]);
      used[s] = Math.max(used[s], d);
    };
    // selbst gewählter Platz; liegt er bei diesem Stück außerhalb des Bildes (z. B. Armband statt Halskette),
    // rückt der Anhänger auf den nächsten sichtbaren Platz
    const y0 = ctx.vy || 0;
    const inView = (s, d) => {
      const q = alongChain(guides[s], s ? pl.R : pl.L, d), y = q.y + unit * 0.3;
      return q.x > 10 + unit * 0.26 && q.x < 390 - unit * 0.26 && y > y0 + 8 + unit * 0.3 && y < y0 + 292 && d < guides[s].getTotalLength() - 4;
    };
    pl.side.filter(e => e.slot != null).forEach(e => {
      let i = e.slot;
      while (i > 0 && !inView(e.s, slotDist(gap, unit, i))) i--;
      put(e.name, e.s, slotDist(gap, unit, i), sizeOf(e.name));
    });
    let auto = 0;
    pl.side.filter(e => e.slot == null).forEach(e => {
      const s = e.s !== null ? e.s : auto++ % 2;      // 0 = links, 1 = rechts
      const size = sizeOf(e.name);
      let d = next[s] === null ? gap + size * 0.45 : next[s];
      while (occ[s].some(([od, os]) => Math.abs(od - d) < (os + size) * 0.62)) d += size * 0.4;
      put(e.name, s, d, size);
      next[s] = d + size * 1.35;
    });
    return used;
  }
  // Zielstellen an der Kette für das freie Platzieren: mehrere Plätze je Seite, vom Namen aus nach oben,
  // solange die Kette im Bild ist
  function chainTargets(ctx, pl, gap, grow) {
    if (!ctx.studio || !ctx.targets || ctx.chains.length < 2) return;
    const guides = ctx.chains.slice(-2), unit = pl.fs * pl.k * (grow || 1);
    const y0 = ctx.vy || 0;
    [0, 1].forEach(s => {
      const g = guides[s], L = g.getTotalLength();
      for (let i = 0; i < 9; i++) {
        const d = slotDist(gap, unit, i);
        if (d > L - 4) break;
        const p = alongChain(g, s ? pl.R : pl.L, d), y = p.y + unit * 0.3;
        if (p.x < 10 + unit * 0.26 || p.x > 390 - unit * 0.26 || y < y0 + 8 + unit * 0.3 || y > y0 + 292) break;
        ctx.targets.push({ kind: 'c', ref: (s ? 'R' : 'L') + i, x: p.x, y });
      }
    });
  }
  // Punkt auf der Kette im Abstand d vom Namen (die Pfade laufen je nach Ansicht zum Namen hin oder von ihm weg)
  function alongChain(g, end, d) {
    const L = g.getTotalLength(), a = g.getPointAtLength(0), b = g.getPointAtLength(L);
    const fromStart = Math.hypot(a.x - end[0], a.y - end[1]) < Math.hypot(b.x - end[0], b.y - end[1]);
    return g.getPointAtLength(Math.max(0, Math.min(L, fromStart ? d : L - d)));
  }
  // Herz als Glied in der Kette (wie bei Malaks „Mayssam“): die Kette läuft hinter dem flachen Herz durch,
  // links und rechts hält je ein kleiner Ring. Liegt weiter außen als die hängenden Anhänger.
  function chainHeart(ctx, pl, gap, grow, used) {
    const want = state.chainHeart;
    if (!want || want === 'none' || ctx.chains.length < 2) return;
    const guides = ctx.chains.slice(-2);
    const unit = pl.fs * pl.k * (grow || 1);
    const size = unit * 0.62, rr = unit * 0.045;
    const metalG = el('g', { fill: ctx.metal, stroke: ctx.metal, filter: 'url(#' + ctx.id + '-plate)' }, ctx.g);
    const enG = el('g', { 'pointer-events': 'none' }, ctx.g);
    const col = charmHex('heart');
    [0, 1].forEach(s => {
      if (want !== 'both' && want !== (s ? 'right' : 'left')) return;
      const g = guides[s], end = s ? pl.R : pl.L;
      const d = gap + (used && used[s] ? used[s] + size * 0.95 : size * 0.75);
      const p = alongChain(g, end, d), q = alongChain(g, end, d + 1.5);
      // entlang der Kette ausrichten, die Spitze zeigt nach unten
      let a = Math.atan2(q.y - p.y, q.x - p.x);
      if (Math.cos(a) < 0) a += Math.PI;
      const tf = 'translate(' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ') rotate(' + (a * 180 / Math.PI).toFixed(1) + ')';
      const hg = el('g', { transform: tf }, metalG);
      // die breiteste Stelle des Herzens (bei den Bögen) liegt auf der Kette
      const heartTf = 'translate(0 ' + (size * 0.17).toFixed(2) + ') scale(' + size.toFixed(3) + ')';
      el('path', { d: CHARMS.heart, transform: heartTf, 'stroke-width': 0.04 }, hg);
      [-1, 1].forEach(sx => el('circle', { cx: sx * (size * 0.44 + rr * 0.6), cy: 0, r: rr, fill: 'none', 'stroke-width': rr * 0.45 }, hg));
      if (col) {
        const eg = el('g', { transform: tf }, enG);
        el('path', { d: CHARMS.heart, transform: 'translate(0 ' + (size * 0.17).toFixed(2) + ') scale(' + (size * 0.76).toFixed(3) + ')', fill: enamelFill(ctx, col) }, eg);
      }
      ctx.glints.push([p.x, p.y]);
    });
  }

  // ---------- Hals-Foto (Pexels, cottonbro studio) und Kettenverlauf darauf ----------
  // neck.json: Kettenverlauf je Länge in SVG-Einheiten (Breite 400), festgelegt in Empire_Jewelry_Werkstatt\neck_photo.py
  const IMG = (LANG === 'ar' ? '../' : '') + 'img/';
  let BUST = null;
  const bustReady = fetch(IMG + 'neck.json').then(r => r.json()).then(j => { BUST = j; }).catch(() => {});
  const onBust = piece => !!BUST && (piece === 'necklace' || piece === 'pendant' || piece === 'initial' || piece === 'map');
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

  // ---------- Libanon-Karte als Anhänger (Gold, Gravur, Flagge, bunt bemalt) ----------
  const mapFont = () => {
    if (state.mapDesign === 'cities') return LANG === 'ar' ? FONTS.modern : FONTS.block;   // Städtenamen wie gestempelt
    return isArabic(nameText(state.mapText) || TXT.mapText) ? FONTS.calligraphy : FONTS.script;
  };
  // Herz-Ausschnitt: so nah wie möglich am gewählten Ort, aber ganz innerhalb der Karte
  function heartSpot(town, r) {
    let p = LEB.cities[town];
    if (!p) return null;
    const [cx, cy] = LEB.center;
    for (let t = 0; t <= 1; t += 0.04) {
      const x = p[0] + (cx - p[0]) * t, y = p[1] + (cy - p[1]) * t;
      let ok = true;
      for (let a = 0; a < 16 && ok; a++) ok = LEB.inside(x + Math.cos(a * Math.PI / 8) * r, y + Math.sin(a * Math.PI / 8) * r);
      if (ok) return [x, y];
    }
    return [cx, cy];
  }
  // weiche Linie durch Punkte (Flüsse)
  function smoothPath(P) {
    let d = 'M' + P[0][0] + ' ' + P[0][1];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
        (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0] + ' ' + p2[1];
    }
    return d;
  }
  // Ausdehnung der gedrehten Karte, gemessen vom Aufhängepunkt (Karten-Einheiten)
  const LEB_BOX = (() => {
    const a = LEB.rot * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    let x0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    LEB.pts.forEach(p => {
      const dx = p[0] - LEB.top[0], dy = p[1] - LEB.top[1];
      const x = dx * c - dy * s, y = dx * s + dy * c;
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    });
    return { x0, x1, y1, c, s };
  })();
  // kleines Haus mit rotem Ziegeldach und drei Bogenfenstern (wie die alten libanesischen Häuser)
  function house(g, x, y, w, h, wall, ctx) {
    const line = { stroke: ctx.metal, 'stroke-width': 0.55, 'stroke-linejoin': 'round' };
    el('rect', Object.assign({ x, y, width: w, height: h, fill: wall }, line), g);
    el('path', Object.assign({ d: 'M' + (x - 1.2) + ' ' + y + 'L' + (x + w / 2) + ' ' + (y - h * 0.55) + 'L' + (x + w + 1.2) + ' ' + y + 'Z', fill: '#e2735c' }, line), g);
    const aw = w / 5, ah = h * 0.42, ay = y + h * 0.3;
    for (let i = 0; i < 3; i++) {
      const ax = x + aw * (0.6 + i * 1.4);
      el('path', { d: 'M' + ax + ' ' + (ay + ah) + 'V' + (ay + aw / 2) + 'A' + (aw / 2) + ' ' + (aw / 2) + ' 0 0 1 ' + (ax + aw) + ' ' + (ay + aw / 2) + 'V' + (ay + ah) + 'Z', fill: '#4f86c6' }, g);
    }
  }
  function mapPendant(ctx, hx, hy, s, k) {
    const T = LEB.top, B = LEB_BOX;
    const mt = hy + 6.4 * k;                 // Kartenspitze unter Öse und Ring
    const toSvg = p => {
      const dx = p[0] - T[0], dy = p[1] - T[1];
      return [hx + (dx * B.c - dy * B.s) * s, mt + (dx * B.s + dy * B.c) * s];
    };
    // Öse oben, kleiner Ring durch die Spitze der Karte
    el('ellipse', { cx: hx, cy: hy, rx: 2.5 * k, ry: 4.2 * k, fill: 'none', stroke: ctx.metal, 'stroke-width': 1.6 * k }, ctx.g);
    plateFilter(ctx);
    const plate = 'url(#' + ctx.id + '-plate)';
    const tf = 'translate(' + hx.toFixed(2) + ' ' + mt.toFixed(2) + ') rotate(' + LEB.rot.toFixed(2) + ') scale(' + s.toFixed(4) + ') translate(' + (-T[0]) + ' ' + (-T[1]) + ')';
    const clipId = ctx.id + '-leb';
    el('path', { d: LEB.d }, el('clipPath', { id: clipId }, ctx.defs));
    // eigenes Gold für die Karte: Spiegelung in mehreren Bändern über die Länge (poliert)
    const mg = el('linearGradient', { id: ctx.id + '-mapmetal', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 30, y2: 52, spreadMethod: 'reflect' }, ctx.defs);
    const m = METALS[state.gold] || METALS.yellow;
    m.forEach((c, i) => el('stop', { offset: i / (m.length - 1), 'stop-color': c }, mg));
    const metal = 'url(#' + ctx.id + '-mapmetal)';
    const design = state.mapDesign;
    const enamel = design === 'flag' || design === 'paint';
    // 1) Goldplatte mit Licht-Filter (Kante, Glanz, Schatten), darauf Glanz und Gravur
    const g = el('g', { transform: tf, filter: plate }, ctx.g);
    // ausgesägtes Herz am gewählten Ort (durchsichtig; der Filter gibt dem Loch eine Kante und Schatten)
    let body = g;
    if ((design === 'gold' || design === 'cities') && LEB.cities[state.mapHeart]) {
      const hr = 4.6;                                   // halbe Herzbreite (Karten-Einheiten)
      const hp = heartSpot(state.mapHeart, hr + 1.8);
      const mid = ctx.id + '-heart';
      const mk = el('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: -20, y: -20, width: 120, height: 140 }, ctx.defs);
      el('rect', { x: -20, y: -20, width: 120, height: 140, fill: '#fff' }, mk);
      el('path', { d: CHARMS.heart, fill: '#000', transform: 'translate(' + hp[0].toFixed(1) + ' ' + hp[1].toFixed(1) + ') rotate(' + (-LEB.rot).toFixed(2) + ') scale(' + (hr * 2.2) + ')' }, mk);
      body = el('g', { mask: 'url(#' + mid + ')' }, g);
    }
    el('path', { d: LEB.d, fill: metal, stroke: metal, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, body);
    const inside = el('g', { 'clip-path': 'url(#' + clipId + ')' }, body);
    const [cx, cy] = LEB.center;
    if (design === 'cities') {
      // gravierte Karte: Flüsse als Linien, Städte mit Punkt und Namen, „LEBANON“ groß in der Mitte
      const F = mapFont();
      const engrave = (d, w) => {
        el('path', { d, fill: 'none', stroke: '#fff', 'stroke-opacity': 0.55, 'stroke-width': w, 'stroke-linecap': 'round', transform: 'translate(0.25 0.35)' }, inside);
        el('path', { d, fill: 'none', stroke: ctx.dark, 'stroke-opacity': 0.6, 'stroke-width': w, 'stroke-linecap': 'round' }, inside);
      };
      LEB.rivers.forEach(r => engrave(smoothPath(r), 0.6));
      // Schrift liegt gerade (wie beim Tragen), Feld ab der Spitze
      const ug = el('g', { transform: 'translate(' + T[0] + ' ' + T[1] + ') rotate(' + (-LEB.rot).toFixed(2) + ')' }, inside);
      const toU = p => { const dx = p[0] - T[0], dy = p[1] - T[1]; return [dx * B.c - dy * B.s, dx * B.s + dy * B.c]; };
      // gestempelte Schrift: dunkle Rille mit feiner Kontur, darunter heller Rand
      const label = (txt, x, y, size, anchor, maxW) => {
        const els = [['#fff', 0.6, 0.3, 0.4], [ctx.dark, 0.9, 0, 0]].map(([fill, op, dx, dy]) => {
          const e = el('text', { x: x + dx, y: y + dy, direction: 'ltr', 'text-anchor': anchor, 'font-family': F.family, 'font-weight': F.weight, 'font-size': size, fill, 'fill-opacity': op, stroke: fill, 'stroke-opacity': op * 0.8, 'stroke-width': (size * 0.06).toFixed(2), 'stroke-linejoin': 'round' }, ug);
          if (LANG !== 'ar') e.setAttribute('letter-spacing', (size * 0.04).toFixed(2));
          e.textContent = txt;
          return e;
        });
        const w = els[1].getComputedTextLength();
        if (w > maxW) els.forEach(e => e.setAttribute('font-size', (size * maxW / w).toFixed(2)));
      };
      // Herz an einer der beschrifteten Städte: Name unter das Herz statt neben den Punkt
      const heartU = LEB.cities[state.mapHeart] ? toU(heartSpot(state.mapHeart, 6.4)) : null;
      [['tripoli', 30], ['beirut', 22], ['saida', 21], ['tyre', 14]].forEach(([id, maxW]) => {
        const u = toU(LEB.cities[id]);
        if (heartU && state.mapHeart === id) {
          label(TXT.mapCities[id], heartU[0] - 5, heartU[1] + 9.6, 5.2, 'start', maxW);
          return;
        }
        el('circle', { cx: u[0] + 1.4, cy: u[1], r: 0.95, fill: ctx.dark, 'fill-opacity': 0.8 }, ug);
        label(TXT.mapCities[id], u[0] + 3, u[1] + 1.8, 5.2, 'start', maxW);
      });
      label(TXT.mapName, 2, 46, LANG === 'ar' ? 11 : 7.6, 'middle', 30);
    }
    if (!enamel) {
      // polierter Glanz: heller Streifen oben, etwas dunkler unten
      const sid = ctx.id + '-sheen';
      const lg = el('linearGradient', { id: sid, x1: 0, y1: 0, x2: 0.8, y2: 1 }, ctx.defs);
      [[0, '#fff', 0], [0.28, '#fff', 0.5], [0.42, '#fff', 0], [0.7, '#3b2606', 0], [1, '#3b2606', 0.28]]
        .forEach(([o, c, a]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, lg));
      el('path', { d: LEB.d, fill: 'url(#' + sid + ')' }, inside);
    }
    if (design === 'engrave') {
      // Gravur entlang der Längsachse der Karte
      const raw = nameText(state.mapText);
      const t = raw || TXT.mapText, F = mapFont();
      const tg = el('g', { transform: 'rotate(' + LEB.axis + ' ' + (cx + 2) + ' ' + (cy - 3) + ')' }, inside);
      const mk = (dx, dy, fill, op) => {
        const e = el('text', { x: cx + 2 + dx, y: cy - 3 + dy, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-family': F.family, 'font-weight': F.weight, 'font-size': 10, fill, 'fill-opacity': op }, tg);
        e.textContent = t;
        return e;
      };
      const hi = mk(0.35, 0.5, '#fff', 0.5), lo = mk(0, 0, ctx.dark, raw ? 0.85 : 0.4);
      const w10 = lo.getComputedTextLength() || chars(t).length * 5;
      // kurze Wörter nicht zu groß, lange passen in die Länge (Ruqaa wirkt kleiner, darf größer sein)
      const size = Math.min((isArabic(t) ? 26 : 19) * F.scale, 10 * 74 / w10);
      [hi, lo].forEach(e => e.setAttribute('font-size', size.toFixed(2)));
    }
    if (enamel) {
      // 2) Emaille ohne Licht-Filter (sonst wird sie blass), gerade ausgerichtet wie beim Tragen:
      //    eigenes Feld ab der Spitze, x nach rechts, y nach unten (Höhe 0 … B.y1)
      const eg = el('g', { transform: tf }, ctx.g);
      const ein = el('g', { 'clip-path': 'url(#' + clipId + ')' }, eg);
      const up = el('g', { transform: 'translate(' + T[0] + ' ' + T[1] + ') rotate(' + (-LEB.rot).toFixed(2) + ')' }, ein);
      if (design === 'flag') {
        // wie die Flagge und die Vorlagen: oben ein schmalerer roter Streifen (der Norden ist breit),
        // breites Weiß mit Zeder, unten rot
        const y1 = B.y1 * 0.21, y2 = B.y1 * 0.74;
        el('rect', { x: -40, y: -10, width: 80, height: y1 + 10, fill: '#d0242e' }, up);
        el('rect', { x: -40, y: y1, width: 80, height: y2 - y1, fill: '#faf8f3' }, up);
        el('rect', { x: -40, y: y2, width: 80, height: 40, fill: '#d0242e' }, up);
        el('path', { d: CEDAR_FLAG, transform: 'translate(-1 ' + (B.y1 * 0.42).toFixed(1) + ') scale(25)', fill: '#13924a' }, up);
      } else {
        // bunte Emaille mit Goldlinien dazwischen: Himmel, Sonne, Berge mit Zeder, Häuser, Meer
        const line = { stroke: metal, 'stroke-width': 0.6, 'stroke-linejoin': 'round' };
        el('rect', { x: -40, y: -10, width: 80, height: 140, fill: '#b9e0f2' }, up);
        el('circle', Object.assign({ cx: 11, cy: 19, r: 5.5, fill: '#f5c842' }, line), up);
        el('path', Object.assign({ d: 'M-25 40C-12 28-2 34 6 27C14 21 22 26 30 30V130H-25Z', fill: '#9fd8b8' }, line), up);
        el('path', { d: CEDAR_FLAG, transform: 'translate(13 36) scale(10)', fill: '#2f8f55', stroke: metal, 'stroke-width': 0.06, 'stroke-linejoin': 'round' }, up);
        el('path', Object.assign({ d: 'M-25 58C-12 52-2 58 8 53C16 49 22 52 30 55V130H-25Z', fill: '#f6cf9c' }, line), up);
        house(up, -14, 50, 11, 8, '#f9cfdc', ctx);
        house(up, -1.5, 56, 10, 7.5, '#fff0c8', ctx);
        house(up, -13.5, 65, 10, 7, '#d6e4ff', ctx);
        house(up, -1, 68, 8.5, 6.5, '#ffd6c2', ctx);
        el('path', Object.assign({ d: 'M-25 84C-16 80-9 86 0 82C8 79 14 84 30 81V130H-25Z', fill: '#6fb7e3' }, line), up);
        el('path', { d: 'M-13 93C-10 91-7 94-4 92M-9 101C-6 99-3 102 0 100M-12 108C-9 106-6 109-3 107', fill: 'none', stroke: '#fff', 'stroke-opacity': 0.9, 'stroke-width': 0.7, 'stroke-linecap': 'round' }, up);
      }
      // Glanz auf der Emaille (glasig), oben links heller
      const gid = ctx.id + '-gloss';
      const gl = el('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0.7, y2: 1 }, ctx.defs);
      [[0, '#fff', 0.05], [0.22, '#fff', 0.38], [0.36, '#fff', 0], [1, '#000', 0.08]]
        .forEach(([o, c, a]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, gl));
      el('path', { d: LEB.d, fill: 'url(#' + gid + ')' }, ein);
      // 3) Goldrand um die Emaille, mit eigenem Licht und Schatten auf die Emaille
      const rg = el('g', { transform: tf, filter: plate }, ctx.g);
      el('path', { d: LEB.d, fill: 'none', stroke: metal, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, rg);
    }
    // kleiner Ring durch die Spitze
    el('circle', { cx: hx, cy: hy + 4.6 * k, r: 2 * k, fill: 'none', stroke: ctx.metal, 'stroke-width': 1.1 * k }, ctx.g);
    ['tripoli', 'beirut', 'zahle', 'saida', 'baalbek'].forEach(c => ctx.glints.push(toSvg(LEB.cities[c])));
    ctx.textBox = { x: hx + B.x0 * s, y: mt + B.y1 * s * 0.15, width: (B.x1 - B.x0) * s, height: B.y1 * s * 0.7 };
  }

  const DRAW = {
    necklace(ctx) {
      if (ctx.model) {
        const C = bustCurve(state.len);
        const pl = namePlate(ctx, C.front[0], C.front[1] + 6, 112, 40, true, a =>
          ((curveY(C.left, a.L[0]) - a.L[1]) + (curveY(C.right, a.R[0]) - a.R[1])) / 2 + 1.4, 36);
        hook(ctx, pl.L, -1, st => bustPath(C.left, st, -1));
        hook(ctx, pl.R, 1, st => bustPath(C.right, st, 1));
        chainTargets(ctx, pl, pl.fs * pl.k * 0.3);
        const used = chainCharms(ctx, pl, pl.fs * pl.k * 0.3);
        chainHeart(ctx, pl, pl.fs * pl.k * 0.3, 1, used);
        ctx.textBox = pl.box;
        return;
      }
      // Anhänger an der Kette brauchen Platz daneben: Name dann etwas kleiner und höher
      // sobald Anhänger gewählt sind, bleibt das Bild gleich, egal ob sie unter dem Namen oder an der Kette hängen
      // (sonst verschieben sich die Kettenpunkte beim Platzieren)
      const hasCharms = String(state.accent || '').split(',').some(v => CHARM_HANG[v] !== undefined);
      const heartLink = !!state.chainHeart && state.chainHeart !== 'none';
      const onChain = hasCharms || heartLink;
      const pl = namePlate(ctx, 200, onChain ? 176 : 196, hasCharms && heartLink ? 150 : onChain ? 190 : 272, 76, true);
      // mit Anhängern oder Herz an der Kette läuft sie neben dem Namen flacher (sonst stehen sie zu schräg)
      // mit Anhängern: Kette steigt als gleichmäßiger Bogen schräg nach oben, so gibt es viele Plätze daran
      const out = onChain ? 62 : 74, rise = onChain ? 26 : 16, top = onChain ? 70 : 110;
      const x0 = onChain ? 58 : 44, x1 = onChain ? 68 : 58;
      hook(ctx, pl.L, -1, st => 'M' + x0 + ' -12C' + x1 + ' ' + top + ' ' + (st[0] - out) + ' ' + (st[1] - rise) + ' ' + st[0] + ' ' + st[1]);
      hook(ctx, pl.R, 1, st => 'M' + (400 - x0) + ' -12C' + (400 - x1) + ' ' + top + ' ' + (st[0] + out) + ' ' + (st[1] - rise) + ' ' + st[0] + ' ' + st[1]);
      chainTargets(ctx, pl, pl.fs * pl.k * 0.3);
      const used = chainCharms(ctx, pl, pl.fs * pl.k * 0.3);
      chainHeart(ctx, pl, pl.fs * pl.k * 0.3, 1, used);
      ctx.textBox = pl.box;
    },
    // Namensarmband wie Malaks „Adam“: Name in der Mitte, Kette nach beiden Seiten, Anhänger an der Kette
    bracelet(ctx) {
      ctx.linkScale = 1.35;
      const pl = namePlate(ctx, 200, 140, 220, 70, ctx.studio, null, 70);
      hook(ctx, pl.L, -1, st => 'M-14 ' + (st[1] + 50) + 'C36 ' + (st[1] + 44) + ' ' + (st[0] - 64) + ' ' + (st[1] + 4) + ' ' + st[0] + ' ' + st[1]);
      hook(ctx, pl.R, 1, st => 'M414 ' + (st[1] + 50) + 'C364 ' + (st[1] + 44) + ' ' + (st[0] + 64) + ' ' + (st[1] + 4) + ' ' + st[0] + ' ' + st[1]);
      // Anhänger am Armband sind im Verhältnis größer (wie Teddy und Auto bei „Adam“)
      chainTargets(ctx, pl, pl.fs * pl.k * 0.5, 1.45);
      const used = chainCharms(ctx, pl, pl.fs * pl.k * 0.5, 1.45);
      chainHeart(ctx, pl, pl.fs * pl.k * 0.5, 1.2, used);
      ctx.textBox = pl.box;
    },
    // Anstecknadel mit Namen wie Malaks „حسن“: Nadel hinter dem Namen, Anhänger darunter, keine Kette
    pin(ctx) {
      const pl = namePlate(ctx, 200, 128, 280, 120, false, null, 118, { pin: true });
      ctx.textBox = pl.box;
    },
    pendant(ctx) {
      const mo = MOTIFS[state.motif];
      if (ctx.model) {
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
      if (ctx.model) {
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
    },
    map(ctx) {
      const B = LEB_BOX;
      if (ctx.model) {
        // am Hals in echter Größe (ca. 2,5 cm hoch)
        const C = bustCurve(state.len);
        const hx = C.front[0], hy = C.front[1] + 2;
        linkChain(ctx, bustPath(C.left, [hx - 1.5, hy - 3], -1));
        linkChain(ctx, bustPath(C.right, [hx + 1.5, hy - 3], 1));
        mapPendant(ctx, hx, hy, 70 / B.y1, 1);
        return;
      }
      // Nahansicht: Karte groß, Kette von oben zur Öse
      const k = 2.2, hy = 50, top = hy + 6.4 * k;
      const s = Math.min((290 - top) / B.y1, 330 / (B.x1 - B.x0));
      const hx = 200 - (B.x0 + B.x1) / 2 * s;
      ctx.linkScale = 1.9;
      linkChain(ctx, 'M' + (hx - 125) + ' -12C' + (hx - 105) + ' 24 ' + (hx - 30) + ' ' + (hy - 14) + ' ' + (hx - 3) + ' ' + (hy - 7));
      linkChain(ctx, 'M' + (hx + 125) + ' -12C' + (hx + 105) + ' 24 ' + (hx + 30) + ' ' + (hy - 14) + ' ' + (hx + 3) + ' ' + (hy - 7));
      mapPendant(ctx, hx, hy, s, k);
    }
  };
  // schwarzer Samt wie in Malaks Schmuckschachteln (Ansicht für Armband und Anstecknadel)
  function velvet(svg, id, defs) {
    const rg = el('radialGradient', { id: id + '-vel', cx: '50%', cy: '40%', r: '80%' }, defs);
    [[0, '#2c2c2e'], [0.55, '#18181a'], [1, '#09090a']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, rg));
    el('rect', { x: -10, y: -10, width: 420, height: 320, fill: 'url(#' + id + '-vel)' }, svg);
    const nf = el('filter', { id: id + '-vgrain', x: 0, y: 0, width: '100%', height: '100%' }, defs);
    el('feTurbulence', { type: 'fractalNoise', baseFrequency: 1.1, numOctaves: 2, seed: 7, result: 'n' }, nf);
    el('feColorMatrix', { in: 'n', type: 'matrix', values: '0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .1 0' }, nf);
    el('rect', { x: 0, y: 0, width: 400, height: 300, filter: 'url(#' + id + '-vgrain)' }, svg);
  }
  function render(svg) {
    const id = svg.dataset.pid;
    let piece = svg.dataset.piece || state.piece;
    // im Bereich Namenskette: Halskette, Armband oder Anstecknadel
    const studio = piece === 'necklace';
    if (studio && (state.item === 'bracelet' || state.item === 'pin')) piece = state.item;
    const m = METALS[state.gold] || METALS.yellow;
    // Nahansicht (data-view="close"): nur die Kette, ohne Hals
    const model = onBust(piece) && svg.dataset.view !== 'close';
    svg.replaceChildren();
    const defs = el('defs', null, svg);
    if (model) {
      el('image', { href: IMG + 'neck.webp', x: 0, y: 0, width: 400, height: BUST.h || 300, preserveAspectRatio: 'xMidYMid slice' }, svg);
    } else if (studio && piece !== 'necklace' && svg.dataset.view !== 'close') velvet(svg, id, defs);
    else if (!svg.dataset.bare) background(svg, id, defs);     // „bare“: frei auf dem Hintergrund der Seite (Startbereich)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    // auf der Büste näher heran (Kette und Anhänger in echter Größe, trotzdem gut lesbar)
    let vy = 0;
    if (model) {
      // Ausschnitt folgt der Kettenlänge (längere Kette = tiefer)
      const C = bustCurve(piece === 'necklace' || piece === 'map' ? state.len : state.size);
      // die Karte hängt tiefer als die Namensplatte, darum dort weniger Abstand nach oben
      vy = Math.max(0, Math.min((BUST.h || 300) - 300, C.front[1] - (piece === 'map' ? 172 : 212)));
    }
    svg.setAttribute('viewBox', '0 ' + vy.toFixed(1) + ' 400 300');
    const grad = el('linearGradient', { id: id + '-metal', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 120, y2: 60, spreadMethod: 'reflect' }, defs);
    m.forEach((c, i) => el('stop', { offset: i / (m.length - 1), 'stop-color': c }, grad));
    const sh = el('filter', { id: id + '-sh', x: '-10%', y: '-10%', width: '120%', height: '130%' }, defs);
    el('feDropShadow', { dx: 0.7, dy: 1.4, stdDeviation: 0.9, 'flood-color': '#3a2412', 'flood-opacity': model ? 0.38 : 0.28 }, sh);
    const glow = el('filter', { id: id + '-glow', x: '-150%', y: '-150%', width: '400%', height: '400%' }, defs);
    el('feGaussianBlur', { stdDeviation: 1.6 }, glow);
    const clip = el('clipPath', { id: id + '-clip' }, defs);
    const waiting = ANIM && svg === heroSvg && !svg._seen;
    const clipRect = el('rect', { x: -20, y: vy - 20, width: waiting ? 0 : 440, height: 340 }, clip);

    const ctx = { id, defs, metal: 'url(#' + id + '-metal)', dark: m[0], glints: [], chains: [], textBox: null, model, linkScale: model ? 0.9 : 1, studio, vy };
    ctx.under = el('g', null, svg);
    const wrapG = el('g', { 'clip-path': 'url(#' + id + '-clip)' }, svg);
    ctx.chainG = el('g', { filter: 'url(#' + id + '-sh)' }, wrapG);
    ctx.g = el('g', null, wrapG);
    const shapeG = el('g', { filter: 'url(#' + id + '-sh)' }, ctx.g);
    const plainG = ctx.g;
    // Motive und Ringe bekommen den einfachen Schatten, die Namensplatte ihren eigenen Filter
    if (['necklace', 'bracelet', 'map', 'pin'].includes(piece)) ctx.g = plainG; else ctx.g = shapeG;
    DRAW[piece](ctx);
    ctx.sparks = el('g', { class: 'sparks', 'pointer-events': 'none' }, svg);
    ctx.grad = grad;
    ctx.clipRect = clipRect;
    svg._ctx = ctx;
    if (svg._after) svg._after();
    const sec = svg.closest('section');
    const form = sec && sec.querySelector('[data-form]');
    if (form) svg.setAttribute('aria-label', TXT.sketch + ' ' + lines(form).map(l => l[1]).join(', '));
  }
  const renderAll = () => { previews.forEach(render); if (zoomBox && zoomBox.open) render(zoomSvg); };

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
    if (!ANIM || LITE || !svg._visible) return;
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
      if (f.dataset.design) hide = !f.dataset.design.split(' ').includes(state.mapDesign);
      if (f.dataset.item && !f.dataset.item.split(' ').includes(state.item)) hide = true;
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

  // Beschriftung eines Anhängers wie im Formular (z. B. „Heart“) und wo er sitzt (für Nachricht und Hinweis)
  function charmLabel(name) {
    const i = document.querySelector('[data-form="studio"] input[name="n-accent"][value="' + name + '"]');
    return i ? i.closest('label').querySelector('.chip-t').textContent.trim() : name;
  }
  function spotText(code) {
    if (code[0] === 'c') {
      const slot = +(code.slice(2) || 0);
      return (code[1] === 'R' ? TXT.spotChainR : TXT.spotChainL) + (slot ? TXT.spotSlot(slot + 1) : '');
    }
    const num = +code[1], i = +code.slice(3);
    let name = shownName(num) || (num === 1 ? fallbackName() : '');
    if (font().upper && !isArabic(name)) name = name.toUpperCase();
    return (code[0] === 'u' ? TXT.spotUnder : TXT.spotOn)(name[i] || '?', name);
  }
  // Farbe je gewähltem Anhänger für die Nachricht, z. B. „Heart: Red; Teddy bear: Light blue“
  function describeCols() {
    return String(state.accent || '').split(',').filter(n => n && n !== 'none')
      .map(n => charmLabel(n) + ': ' + colName(charmColKey(n))).join('; ');
  }
  function describeSpots() {
    const m = spotsMap();
    return String(state.accent || '').split(',')
      .filter(n => m[n] && !(m[n][0] === 'o' && !ON_LETTER.includes(n)) && !(m[n][0] === 'c' && state.item === 'pin'))
      .map(n => charmLabel(n) + ': ' + spotText(m[n])).join('; ');
  }

  function lines(form) {
    const out = [];
    form.querySelectorAll('[data-field]').forEach(f => {
      if (f.hidden) return;
      const key = f.dataset.field;
      let label = f.dataset.label, v = '';
      if (key === 'spots') { const d = describeSpots(); if (d) out.push([label, d]); return; }
      if (key === 'charmCols') { const d = describeCols(); if (d) out.push([label, d]); return; }
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
      if (key === 'text' && form === builder && state.piece === 'initial') { label = TXT.letter; v = v ? firstLetter(v) : ''; }
      if (key === 'size' && sizeLabel) label = sizeLabel.textContent;
      if (v) out.push([label, v]);
    });
    return out;
  }
  // ---------- Entwurf als Link: öffnet genau diese Gestaltung wieder ----------
  const KEYS = {
    studio: ['text', 'text2', 'textAlt', 'text2Alt', 'join', 'style', 'accent', 'underline', 'thick', 'chain', 'gold', 'stone', 'len', 'karat',
      'item', 'nameColor', 'charmColor', 'charmPos', 'wrist', 'chainHeart', 'spots', 'charmCols'],
    builder: ['piece', 'gold', 'text', 'textAlt', 'style', 'motif', 'enamel', 'stone', 'size', 'karat'],
    map: ['mapDesign', 'mapText', 'gold', 'karat', 'chain', 'len', 'mapHeart']
  };
  const LINK = { studio: ['s', '#name'], builder: ['b', '#design'], map: ['m', '#lebanon'] };
  function designUrl(kind) {
    const raw = LINK[kind][0] + '|' + KEYS[kind].map(k => String(state[k] || '').replace(/\|/g, ' ')).join('|');
    const bytes = new TextEncoder().encode(raw);
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    const d = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return location.origin + location.pathname + '?d=' + d + LINK[kind][1];
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
      const f = Object.keys(LINK).find(kind => LINK[kind][0] === parts[0]);
      if (!f) return null;
      const o = { f };
      KEYS[f].forEach((k, i) => { if (parts[i + 1]) o[k] = parts[i + 1]; });
      return o;
    } catch (e) { return null; }
  }
  function message(form) {
    const L = lines(form);
    const studioHello = { bracelet: TXT.helloBracelet, pin: TXT.helloPin }[state.item] || TXT.helloName;
    const hello = { studio: studioHello, map: TXT.helloMap }[form.dataset.form] || TXT.hello;
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
      if (form.dataset.form === 'studio') {
        colourUI.forEach(f => f());
        form.querySelectorAll('[data-spots-reset]').forEach(b => { b.hidden = !describeSpots(); });
        document.querySelectorAll('.drag-hint').forEach(h => h.classList.toggle('is-on', dragHintOn()));
        const h = form.querySelector('.summary h3');
        if (h) h.textContent = TXT.sum[state.item] || TXT.sum.necklace;
      }
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
  // Eine Vorschau (SVG) als Bild mit eingebetteter Schrift und eingebetteten Fotos
  async function svgImage(svg, css, W, H) {
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
    const vb = (clone.getAttribute('viewBox') || '0 0 400 300').split(/\s+/).map(Number);
    const bgRect = el('rect', { x: vb[0] - 5, y: vb[1] - 5, width: vb[2] + 10, height: vb[3] + 10, fill: 'url(#x-bg)' });
    clone.insertBefore(bgRect, defs.nextSibling);
    for (const im of Array.from(clone.querySelectorAll('image'))) {
      const blob = await (await fetch(im.getAttribute('href'))).blob();
      im.setAttribute('href', await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); }));
    }
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
    const img = new Image();
    img.src = url;
    await img.decode();
    URL.revokeObjectURL(url);
    return img;
  }

  async function exportPng(form) {
    const sec = form.closest('section');
    const close = sec.querySelector('svg.preview-close');
    const views = close ? [close, sec.querySelector('svg.preview:not(.preview-close)')] : [sec.querySelector('svg.preview')];
    const fam = (form.dataset.form === 'map' ? mapFont() : font()).family.split(',')[0].replace(/"/g, '').trim();
    const css = await fontCss(fam);
    // Namenskette: Nahansicht der Kette und Hals-Foto nebeneinander, sonst eine Ansicht
    const VW = close ? 900 : 1200, VH = close ? 675 : 900, gap = close ? 6 : 0;
    const W = VW * views.length + gap * (views.length - 1), H = VH;
    const imgs = [];
    for (const v of views) imgs.push(await svgImage(v, css, VW, VH));
    const L = lines(form);
    const pad = 56, lh = 42;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H + pad * 2 + 64 + L.length * lh;
    const x = c.getContext('2d');
    x.fillStyle = '#ffffff';
    x.fillRect(0, 0, c.width, c.height);
    imgs.forEach((im, k) => {
      const pos = LANG === 'ar' ? imgs.length - 1 - k : k;
      x.drawImage(im, pos * (VW + gap), 0, VW, VH);
    });
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
  // Beim Wechsel Halskette / Armband / Anstecknadel: Startwerte wie auf Malaks Fotos,
  // aber nur für Felder, die der Kunde noch nicht selbst geändert hat
  const touchedKeys = new Set();
  // Farbe je Anhänger: Banner im Bild und Farbfeld im Formular teilen sich diese Teile
  let ccActive = null;          // Anhänger, dessen Farbe gerade gewählt wird
  const colourUI = [];          // werden nach jeder Änderung aufgefrischt
  function setCharmCol(name, key) {
    const m = charmColsMap();
    m[name] = key;
    state.charmCols = Object.keys(m).map(n => n + '=' + m[n]).join(',');
    touched = true;
    touchedKeys.add('charmCols');
    colourUI.forEach(f => f());
    schedule('charmCols');
  }
  function makeSwatches(wrap) {
    CHARM_COLS.forEach(([key, hex]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sw' + (hex ? '' : ' sw-gold');
      if (hex) b.style.setProperty('--c', hex);
      b.dataset.col = key;
      b.title = colName(key);
      b.setAttribute('aria-label', colName(key));
      wrap.appendChild(b);
    });
  }
  const markSwatches = (wrap, name) => wrap.querySelectorAll('[data-col]').forEach(b => {
    b.setAttribute('aria-pressed', name && b.dataset.col === charmColKey(name) ? 'true' : 'false');
    b.hidden = name === 'stone' ? b.dataset.col === 'metal' : b.dataset.col === 'clear';
  });
  // kurzer Hinweis im Bild, solange Anhänger gewählt, aber noch keiner verschoben wurde
  let hintDone = false;
  const dragHintOn = () => !hintDone && !state.spots && String(state.accent || '').split(',').some(v => CHARM_HANG[v] !== undefined);
  const ITEM_START = {
    necklace: { charmPos: 'below', nameColor: 'metal', accent: 'none' },
    bracelet: { charmPos: 'chain', nameColor: 'blue', accent: 'teddy,car' },
    pin: { nameColor: 'metal', accent: 'hamsa,eye,coin' }
  };
  function itemDefaults() {
    const d = ITEM_START[state.item] || {};
    Object.keys(d).forEach(k => { if (!touchedKeys.has(k)) state[k] = d[k]; });
  }
  function onChange(e) {
    const c = e.target;
    const k = c.dataset && c.dataset.key;
    if (!k) return;
    let val = c.value;
    if (c.type === 'checkbox') {
      const group = Array.from(c.closest('fieldset').querySelectorAll('input[type=checkbox][data-key="' + k + '"]'));
      let on = group.filter(i => i.checked).map(i => i.value);
      if (on.filter(v => v !== 'crown').length > MAX_CHARMS) { c.checked = false; on = on.filter(v => v !== c.value); }
      val = on.join(',');
    }
    if ((c.type === 'radio' && !c.checked) || state[k] === val) return;
    state[k] = val;
    touched = true;
    if (k === 'item') itemDefaults(); else touchedKeys.add(k);
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

  // Karten-Symbole für die Design-Knöpfe (Libanon-Anhänger)
  document.querySelectorAll('.map-ico').forEach((span, i) => {
    const kind = span.dataset.map, cid = 'mi' + i;
    const svg = el('svg', { viewBox: '-3 -3 83 106', 'aria-hidden': 'true' });
    el('path', { d: LEB.d }, el('clipPath', { id: cid }, el('defs', null, svg)));
    const gold = '#d9b25a';
    const defs = svg.querySelector('defs');
    if (kind === 'gold') {
      // Herz ausgesägt
      const mk = el('mask', { id: cid + 'h', maskUnits: 'userSpaceOnUse', x: -5, y: -5, width: 90, height: 110 }, defs);
      el('rect', { x: -5, y: -5, width: 90, height: 110, fill: '#fff' }, mk);
      el('path', { d: CHARMS.heart, fill: '#000', transform: 'translate(29 47) scale(22)' }, mk);
    }
    const base = el('path', { d: LEB.d, fill: gold }, svg);
    if (kind === 'gold') base.setAttribute('mask', 'url(#' + cid + 'h)');
    const g = el('g', { 'clip-path': 'url(#' + cid + ')' }, svg);
    if (kind === 'flag') {
      el('rect', { x: -5, y: -5, width: 90, height: 31, fill: '#d22b33' }, g);
      el('rect', { x: -5, y: 26, width: 90, height: 48, fill: '#fff' }, g);
      el('rect', { x: -5, y: 74, width: 90, height: 31, fill: '#d22b33' }, g);
      el('path', { d: CEDAR_FLAG, transform: 'translate(43 42) scale(27)', fill: '#1f9a4c' }, g);
    } else if (kind === 'paint') {
      [['#cde8f4', -5], ['#bfe5d0', 36], ['#f8d9b0', 54], ['#8cc8e8', 75]].forEach(([c, y]) => el('rect', { x: -5, y, width: 90, height: 110, fill: c }, g));
      el('rect', { x: 22, y: 44, width: 14, height: 10, fill: '#fbe3ec' }, g);
    } else if (kind === 'engrave') {
      el('path', { d: 'M18 72L58 18M24 76L62 26', stroke: '#7d5c17', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    } else if (kind === 'cities') {
      LEB.rivers.slice(0, 3).forEach(r => el('path', { d: smoothPath(r), fill: 'none', stroke: '#7d5c17', 'stroke-width': 3, 'stroke-linecap': 'round' }, g));
      ['tripoli', 'beirut', 'saida'].forEach(c => el('circle', { cx: LEB.cities[c][0] + 3, cy: LEB.cities[c][1], r: 4, fill: '#7d5c17' }, g));
    }
    el('path', { d: LEB.d, fill: 'none', stroke: '#9c7726', 'stroke-width': kind === 'gold' || kind === 'engrave' ? 3 : 5, 'stroke-linejoin': 'round' }, svg);
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
    if (!('spots' in like)) state.spots = '';
    Object.keys(like).forEach(k => touchedKeys.add(k));
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
    KEYS[shared.f].forEach(k => {
      if (typeof shared[k] !== 'string') return;
      if (k === 'style' && !FONTS[shared[k]]) return;   // Schrift gibt es nicht mehr (z. B. Old English in alten Links)
      state[k] = shared[k].slice(0, k === 'spots' || k === 'charmCols' ? 160 : 40);
      touchedKeys.add(k);
    });
    if (shared.textAlt) altEdited.textAlt = true;
    if (shared.text2Alt) altEdited.text2Alt = true;
    lastKind = font().kind === 'arabic';
  }
  if (shared && shared.f === 'studio' && STONE[state.stone]) {
    const acc = String(state.accent || '').split(',').filter(v => v && v !== 'none');
    if (!acc.includes('stone')) acc.push('stone');
    state.accent = acc.join(',');
    const m = charmColsMap();
    m.stone = state.stone;
    state.charmCols = Object.keys(m).map(n => n + '=' + m[n]).join(',');
  }
  if (state.charmColor && state.charmColor !== 'metal' && !state.charmCols) {
    const old = ['heart'].concat(String(state.accent || '').split(',').filter(n => PAINTABLE.includes(n) && n !== 'heart'));
    state.charmCols = old.map(n => n + '=' + state.charmColor).join(',');
    state.charmColor = 'metal';
  }
  refreshAlt(); updateSizes();
  if (shared && shared.size) state.size = shared.size;
  updateFields(); syncControls(null); updateSamples(); updateOutputs();

  // ---------- Vergrößerung: Bild der Namenskette bzw. Karte groß öffnen, hineinzoomen, verschieben ----------
  const stages = Array.from(document.querySelectorAll('.studio-stage'));
  if (stages.length) {
    zoomBox = document.createElement('dialog');
    zoomBox.className = 'zoom-box';
    zoomBox.innerHTML =
      '<div class="zoom-scroll"><svg class="zoom-svg" data-pid="L" data-piece="necklace" viewBox="0 0 400 300" role="img"></svg></div>' +
      '<p class="zoom-hint"></p>' +
      '<div class="zoom-tools">' +
      '<button type="button" class="zoom-btn" data-z="-" aria-label="' + TXT.zoomOut + '">−</button>' +
      '<button type="button" class="zoom-btn" data-z="+" aria-label="' + TXT.zoomIn + '">+</button>' +
      '<button type="button" class="zoom-btn zoom-x" aria-label="' + TXT.zoomClose + '">×</button></div>';
    document.body.appendChild(zoomBox);
    zoomSvg = zoomBox.querySelector('svg');
    const sc = zoomBox.querySelector('.zoom-scroll');
    zoomBox.querySelector('.zoom-hint').textContent = TXT.zoomHint;
    let z = 1;
    // Zoomstufe setzen; der Punkt (fx, fy) (Anteil 0..1 im Bild) bleibt an der Stelle (px, py) im Fenster
    const setZoom = (nz, fx, fy, px, py) => {
      nz = Math.max(1, Math.min(4, nz));
      const r = sc.getBoundingClientRect();
      if (px === undefined) { px = r.width / 2; py = r.height / 2; }
      if (fx === undefined) {
        fx = (sc.scrollLeft + px) / zoomSvg.clientWidth;
        fy = (sc.scrollTop + py) / zoomSvg.clientHeight;
      }
      z = nz;
      zoomSvg.style.width = (z * 100) + '%';
      zoomBox.classList.toggle('is-zoomed', z > 1);
      sc.scrollLeft = fx * zoomSvg.clientWidth - px;
      sc.scrollTop = fy * zoomSvg.clientHeight - py;
    };
    const open = (stage, view) => {
      if (view) zoomSvg.dataset.view = view; else delete zoomSvg.dataset.view;
      const src = stage.querySelector(view ? 'svg.preview-close' : 'svg.preview:not(.preview-close)');
      zoomSvg.dataset.piece = src.dataset.piece;
      zoomSvg.setAttribute('aria-label', src.getAttribute('aria-label'));
      zoomBox.showModal();  // erst sichtbar machen, sonst misst getBBox 0 und die Ösen sitzen falsch
      render(zoomSvg);
      setZoom(1, 0.5, 0.5);
    };
    // Klick auf eine der beiden Ansichten öffnet sie groß
    stages.forEach(stage => {
      stage.querySelectorAll('svg.preview').forEach(v => {
        // nicht vergrößern, wenn gerade ein Anhänger gezogen oder platziert wurde
        v.addEventListener('click', () => { if (v._noZoom) { v._noZoom = false; return; } open(stage, v.dataset.view); });
      });
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'zoom-open';
      btn.setAttribute('aria-label', TXT.zoomOpen);
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6"/></svg><span>' + TXT.zoomOpen + '</span>';
      btn.addEventListener('click', () => open(stage, ''));
      stage.appendChild(btn);
    });
    zoomBox.querySelector('.zoom-x').addEventListener('click', () => zoomBox.close());
    zoomBox.querySelectorAll('[data-z]').forEach(b => b.addEventListener('click', () => setZoom(b.dataset.z === '+' ? z * 1.6 : z / 1.6)));
    // Klick neben das Bild schließt
    zoomBox.addEventListener('click', e => { if (e.target === zoomBox) zoomBox.close(); });
    // Ziehen mit der Maus verschiebt, kurzer Klick zoomt an dieser Stelle
    let drag = null;
    sc.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, l: sc.scrollLeft, t: sc.scrollTop, moved: false };
    });
    window.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
      if (drag.moved && z > 1) { sc.scrollLeft = drag.l - dx; sc.scrollTop = drag.t - dy; }
    });
    window.addEventListener('pointerup', () => { setTimeout(() => { drag = null; }, 0); });
    zoomSvg.addEventListener('click', e => {
      if (drag && drag.moved) return;
      const r = zoomSvg.getBoundingClientRect(), sr = sc.getBoundingClientRect();
      const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      setZoom(z > 1 ? 1 : 2.5, fx, fy, e.clientX - sr.left, e.clientY - sr.top);
    });
    // Strg + Mausrad oder Trackpad-Zoom
    sc.addEventListener('wheel', e => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const r = zoomSvg.getBoundingClientRect(), sr = sc.getBoundingClientRect();
      setZoom(z * (e.deltaY < 0 ? 1.15 : 1 / 1.15), (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, e.clientX - sr.left, e.clientY - sr.top);
    }, { passive: false });
  }

  // ---------- Anhänger im Bild: ziehen = verschieben, antippen = Farb-Banner (und Stelle antippen) ----------
  // Beim Loslassen rastet der Anhänger an der nächsten möglichen Stelle ein (unter/auf einem Buchstaben, an der Kette).
  const placeSvg = document.querySelector('#name svg.preview-close');
  const spotsStatus = document.querySelector('[data-spots-status]');
  if (placeSvg) {
    let act = null;       // laufendes Ziehen: { name, x0, y0, moved, id }
    let picked = null;    // angetippter Anhänger (Banner offen)
    let overlay = null;
    const stageEl = placeSvg.closest('.studio-stage');
    const pt = e => {
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(placeSvg.getScreenCTM().inverse());
      return [p.x, p.y];
    };
    const valid = name => name === 'crown' ? [] : ((placeSvg._ctx && placeSvg._ctx.targets) || []).filter(t =>
      t.kind === 'u' || (t.kind === 'o' && ON_LETTER.includes(name)) || (t.kind === 'c' && state.item !== 'pin'));
    const nearest = (name, p, maxD) => {
      let best = null, bd = maxD;
      valid(name).forEach(t => { const d = Math.hypot(t.x - p[0], t.y - p[1]); if (d < bd) { bd = d; best = t; } });
      return best;
    };
    const clearOverlay = () => {
      if (overlay) overlay.remove();
      overlay = null;
      placeSvg.querySelectorAll('[data-charm]').forEach(g => g.removeAttribute('opacity'));
    };
    // mögliche Stellen als Punkte zeigen, die nächste hervorheben; beim Ziehen wird der Anhänger selbst blass
    const showTargets = (name, hi, dim) => {
      if (overlay) overlay.remove();
      overlay = el('g', { 'pointer-events': 'none' }, placeSvg);
      valid(name).forEach(t => el('circle', {
        cx: t.x, cy: t.y, r: t === hi ? 5.5 : 3.4,
        fill: t === hi ? '#457256' : 'rgba(69,114,86,.22)', stroke: '#457256', 'stroke-width': 1.1
      }, overlay));
      if (dim) placeSvg.querySelectorAll('[data-charm="' + name + '"]').forEach(g => g.setAttribute('opacity', 0.3));
      else {
        // angetippter Anhänger: grüner Kreis, damit man sieht, welcher gerade gefärbt wird
        const g = placeSvg.querySelector('[data-charm="' + name + '"]');
        if (g) {
          const r = g.getBoundingClientRect(), m = placeSvg.getScreenCTM();
          const c = new DOMPoint(r.x + r.width / 2, r.y + r.height / 2).matrixTransform(m.inverse());
          el('circle', { cx: c.x, cy: c.y, r: Math.max(r.width, r.height) / 2 / m.a + 3, fill: 'none', stroke: '#457256', 'stroke-width': 1.5, 'stroke-dasharray': '3 2.5' }, overlay);
        }
      }
    };
    const ghost = (name, p) => {
      const c = placeSvg._ctx, size = (c.charmUnit || 40) * 0.42;
      const gm = el('g', { fill: c.metal, stroke: c.metal, opacity: 0.92, 'pointer-events': 'none' }, overlay);
      drawCharm(c, gm, name, p[0], p[1] + CHARM_HANG[name] * size, size, null, overlay);
    };
    const hintOff = () => { hintDone = true; document.querySelectorAll('.drag-hint').forEach(h => h.classList.remove('is-on')); };
    const place = (name, t) => {
      const m = spotsMap();
      m[name] = t.kind + t.ref;
      state.spots = Object.keys(m).map(n => n + '=' + m[n]).join(',');
      touched = true;
      hintOff();
      touchedKeys.add('spots');
      if (spotsStatus) spotsStatus.textContent = charmLabel(name) + ': ' + spotText(m[name]);
      schedule('spots');
    };

    // Farb-Banner: erscheint beim Antippen eines Anhängers direkt daneben, viele Farben zur Auswahl
    const pop = document.createElement('div');
    pop.className = 'charm-pop';
    pop.hidden = true;
    pop.innerHTML = '<p class="charm-pop-t"></p><div class="charm-pop-sw"></div><p class="charm-pop-h"></p>' +
      '<button type="button" class="charm-pop-x" aria-label="' + TXT.close + '">×</button>';
    (stageEl || placeSvg.parentNode).appendChild(pop);
    const swWrap = pop.querySelector('.charm-pop-sw');
    makeSwatches(swWrap);
    const markSw = () => markSwatches(swWrap, picked);
    colourUI.push(markSw);
    // Banner direkt unter dem Bild (deckt keinen Anhänger ab); passt es nicht mehr ins Fenster, unten ins Bild
    const placePop = () => {
      if (!picked || pop.hidden || !stageEl) return;
      const sr = stageEl.getBoundingClientRect();
      if (sr.bottom < 40 || sr.top > innerHeight - 40) { closePop(); return; }
      const pw = pop.offsetWidth, ph = pop.offsetHeight;
      const x = Math.max(8, Math.min(innerWidth - pw - 8, sr.left + sr.width / 2 - pw / 2));
      let y = sr.bottom + 8;
      if (y + ph > innerHeight - 8) y = sr.bottom - ph - 8;
      pop.style.left = Math.round(x) + 'px';
      pop.style.top = Math.round(y) + 'px';
    };
    const openPop = name => {
      picked = name;
      pop.querySelector('.charm-pop-t').textContent = charmLabel(name);
      pop.querySelector('.charm-pop-h').textContent = name === 'crown' ? '' : TXT.popHint;
      pop.hidden = false;
      markSw();
      placePop();
      showTargets(name, null, false);
      hintOff();
      ccActive = name;              // Farbfeld im Formular zeigt denselben Anhänger
      colourUI.forEach(f => f());
    };
    const closePop = () => {
      pop.hidden = true;
      picked = null;
      clearOverlay();
    };
    swWrap.addEventListener('click', e => {
      const b = e.target.closest('[data-col]');
      if (b && picked) setCharmCol(picked, b.dataset.col);
    });
    pop.querySelector('.charm-pop-x').addEventListener('click', closePop);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && picked) closePop(); });
    window.addEventListener('resize', placePop);
    window.addEventListener('scroll', placePop, { passive: true });
    // nach jedem Neuzeichnen: Banner und Punkte wieder an den (evtl. verschobenen) Anhänger
    placeSvg._after = () => {
      if (!picked) return;
      if (!placeSvg.querySelector('[data-charm="' + picked + '"]')) { closePop(); return; }
      markSw();
      placePop();
      showTargets(picked, null, false);
    };

    // Vergrößern gesperrt, solange ein Anhänger angefasst ist, und kurz nach dem Loslassen.
    // (Der Klick kommt erst nach dem Loslassen – egal, wie lange gezogen wurde.)
    let zoomTimer = 0;
    const holdZoom = () => { clearTimeout(zoomTimer); placeSvg._noZoom = true; };
    const releaseZoomSoon = () => {
      clearTimeout(zoomTimer);
      placeSvg._noZoom = true;
      zoomTimer = setTimeout(() => { placeSvg._noZoom = false; }, 350);
    };
    placeSvg.addEventListener('pointerdown', e => {
      const g = e.target.closest && e.target.closest('[data-charm]');
      if (g && placeSvg.contains(g)) {
        e.preventDefault();
        holdZoom();
        act = { name: g.getAttribute('data-charm'), x0: e.clientX, y0: e.clientY, moved: false, id: e.pointerId };
        try { placeSvg.setPointerCapture(e.pointerId); } catch (err) { /* egal */ }
      } else if (picked) holdZoom();
      else { clearTimeout(zoomTimer); placeSvg._noZoom = false; }   // normaler Klick ins Bild: vergrößern
    });
    placeSvg.addEventListener('pointermove', e => {
      if (!act || e.pointerId !== act.id || act.name === 'crown') return;
      if (!act.moved && Math.hypot(e.clientX - act.x0, e.clientY - act.y0) < 6) return;
      if (!act.moved) { pop.hidden = true; picked = null; }
      act.moved = true;
      const p = pt(e);
      showTargets(act.name, nearest(act.name, p, 36), true);
      ghost(act.name, p);
    });
    placeSvg.addEventListener('pointerup', e => {
      if (act || picked) releaseZoomSoon();
      if (act && e.pointerId === act.id) {
        const a = act;
        act = null;
        if (a.moved) {
          const t = nearest(a.name, pt(e), 36);
          clearOverlay();
          if (t) place(a.name, t);
          return;
        }
        // angetippt: Farb-Banner dieses Anhängers öffnen (auch wenn gerade ein anderes offen ist)
        openPop(a.name);
        return;
      }
      if (picked) {
        const t = nearest(picked, pt(e), 42);
        if (t) place(picked, t); else closePop();
      }
    });
    placeSvg.addEventListener('pointercancel', () => { act = null; clearOverlay(); releaseZoomSoon(); });
    // Handy: Ziehen eines Anhängers soll nicht die Seite scrollen
    placeSvg.addEventListener('touchstart', e => {
      if (e.target.closest && e.target.closest('[data-charm]')) e.preventDefault();
    }, { passive: false });
    if (stageEl) {
      const hint = document.createElement('p');
      hint.className = 'drag-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/></svg><span></span>';
      hint.querySelector('span').textContent = TXT.dragHint;
      stageEl.appendChild(hint);
      hint.classList.toggle('is-on', dragHintOn());
    }
    const reset = document.querySelector('[data-spots-reset]');
    if (reset) reset.addEventListener('click', () => {
      state.spots = '';
      if (spotsStatus) spotsStatus.textContent = '';
      schedule('spots');
    });
  }

  // ---------- Farbfeld unter den Anhängern: beim Antippen eines Anhängers erscheinen gleich seine Farben ----------
  const accentFs = document.querySelector('[data-form="studio"] [data-field="accent"]');
  if (accentFs) {
    const panel = document.createElement('div');
    panel.className = 'charm-colors';
    panel.hidden = true;
    panel.innerHTML = '<p class="cc-t"></p><div class="cc-tabs"></div><div class="cc-sw"></div>';
    panel.querySelector('.cc-t').textContent = TXT.ccTitle;
    accentFs.insertBefore(panel, accentFs.querySelector('[data-field="charmCols"]') || accentFs.querySelector('.spots-row'));
    const tabs = panel.querySelector('.cc-tabs'), sw = panel.querySelector('.cc-sw');
    makeSwatches(sw);
    const icon = name => {
      const d = CHARMS[name];
      return d ? '<span class="charm-ico" aria-hidden="true"><svg viewBox="-0.6 -0.6 1.2 1.2"><path d="' + d + '" fill="currentColor" stroke="currentColor" stroke-width="0.06"/></svg></span>' : '';
    };
    const renderPanel = () => {
      const picks = String(state.accent || '').split(',').filter(v => v && v !== 'none');
      if (!picks.length) { panel.hidden = true; ccActive = null; return; }
      if (!ccActive || !picks.includes(ccActive)) ccActive = picks[picks.length - 1];
      panel.hidden = false;
      tabs.replaceChildren(...picks.map(n => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'cc-tab';
        b.dataset.tab = n;
        b.setAttribute('aria-pressed', n === ccActive ? 'true' : 'false');
        const hex = charmHex(n);
        b.innerHTML = icon(n) + '<span class="cc-l"></span><span class="cc-dot' + (hex ? '' : ' gold') + '"' + (hex ? ' style="--c:' + hex + '"' : '') + '></span>';
        b.querySelector('.cc-l').textContent = charmLabel(n);
        return b;
      }));
      markSwatches(sw, ccActive);
    };
    tabs.addEventListener('click', e => {
      const b = e.target.closest('[data-tab]');
      if (b) { ccActive = b.dataset.tab; renderPanel(); }
    });
    sw.addEventListener('click', e => {
      const b = e.target.closest('[data-col]');
      if (b && ccActive) setCharmCol(ccActive, b.dataset.col);
    });
    // Anhänger angetippt: gleich seine Farben zeigen (nach der Prüfung „höchstens 5“)
    accentFs.addEventListener('change', e => {
      const c = e.target;
      if (c.name !== 'n-accent') return;
      setTimeout(() => { if (c.checked) ccActive = c.value; renderPanel(); }, 0);
    });
    colourUI.push(renderPanel);
    renderPanel();
  }

  // ---------- Startbereich: Ring und wechselnder Schmuck an derselben Stelle ----------
  // Halskette (Anhänger kommen nacheinander dazu, Name wechselt) → Armband → Anstecknadel → Ring zum Schluss → …
  // Gezeichnet mit denselben Funktionen wie der Gestalter, aber mit eigenen Beispielwerten
  // (die Eingaben des Kunden bleiben unberührt). Antippen öffnet den Gestalter mit genau diesem Stück.
  // Bei „weniger Bewegung“ bleibt nur der Ring.
  const ringStageEl = document.querySelector('.ring-stage');
  if (ringStageEl && ANIM) {
    const AR = LANG === 'ar';
    const BASE = { text2: '', textAlt: '', text2Alt: '', join: 'heart', underline: 'none', thick: 'std', chain: 'cable',
      len: '45 cm', wrist: '', stone: 'none', karat: '18k', chainHeart: 'none', spots: '', charmColor: 'metal' };
    const SHOW = [
      { item: 'necklace', text: AR ? 'ليلى' : 'Layla', style: AR ? 'calligraphy' : 'script', gold: 'yellow', nameColor: 'metal',
        charmPos: 'below', charmCols: 'heart=red', steps: [[], ['heart'], ['heart', 'star'], ['heart', 'star', 'stone']] },
      { item: 'necklace', text: AR ? 'مايا' : 'Maya', style: AR ? 'modern' : 'pacifico', gold: 'rose', nameColor: 'pink',
        charmPos: 'chain', charmCols: 'butterfly=lilac,flower=pink', steps: [[], ['butterfly'], ['butterfly', 'flower']] },
      { item: 'bracelet', text: AR ? 'آدم' : 'Adam', style: AR ? 'modern' : 'pacifico', gold: 'yellow', nameColor: 'blue',
        charmPos: 'chain', charmCols: '', steps: [[], ['teddy'], ['teddy', 'car']] },
      { item: 'pin', text: 'حسن', style: 'calligraphy', gold: 'white', nameColor: 'metal',
        charmPos: 'below', charmCols: '', steps: [[], ['hamsa'], ['hamsa', 'eye'], ['hamsa', 'eye', 'coin']] }
    ];
    const svg = el('svg', { class: 'hero-piece', viewBox: '0 0 400 300', role: 'link', tabindex: '0', 'aria-label': TXT.heroOpen }, ringStageEl);
    svg.dataset.pid = 'hp';
    svg.dataset.piece = 'necklace';
    svg.dataset.view = 'close';
    svg.dataset.bare = '1';
    ringStageEl.setAttribute('role', 'group');
    let current = null, gen = 0, visible = true;
    const design = (p, accent) => Object.assign({}, BASE, {
      item: p.item, text: p.text, style: p.style, gold: p.gold, nameColor: p.nameColor, charmPos: p.charmPos,
      charmCols: p.charmCols, accent: accent.length ? accent.join(',') : 'none'
    });
    // mit den Beispielwerten zeichnen, danach die Werte des Kunden zurück
    // Armband und Anstecknadel sind kleiner als die Kette: im Startbereich näher heranzoomen
    const ZOOM = { bracelet: '16 42 368 276', pin: '72 50 256 192' };
    const draw = d => {
      const keep = {};
      Object.keys(d).forEach(k => { keep[k] = state[k]; state[k] = d[k]; });
      try { render(svg); } finally { Object.assign(state, keep); }
      if (ZOOM[d.item]) svg.setAttribute('viewBox', ZOOM[d.item]);
    };
    // neu dazugekommene Anhänger „ploppen“ auf (Skalierung zusätzlich zur Lage, darum additive="sum")
    const popIn = names => names.forEach(n => svg.querySelectorAll('[data-charm="' + n + '"]').forEach(g => {
      const a = el('animateTransform', { attributeName: 'transform', type: 'scale', values: '0.05;1.18;1', keyTimes: '0;0.7;1', dur: '0.55s', additive: 'sum', fill: 'freeze', begin: 'indefinite' }, g);
      try { a.beginElement(); } catch (e) { /* ohne SMIL einfach da */ }
    }));
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    // wartet; solange der Startbereich nicht zu sehen oder der Tab im Hintergrund ist, geht es nicht weiter
    const pause = async (ms, my) => {
      await sleep(ms);
      while (my === gen && (!visible || document.hidden)) await sleep(500);
      return my === gen;
    };
    async function run(my) {
      while (my === gen) {
        for (const p of SHOW) {
          // erst ausblenden (Ring bzw. voriges Stück), dann das neue Stück zeichnen und einblenden
          svg.style.opacity = 0;
          const fromRing = !ringStageEl.classList.contains('show-piece');
          ringStageEl.classList.add('show-piece');
          if (!await pause(fromRing ? 650 : 450, my)) return;
          current = design(p, p.steps[0]);
          draw(current);
          svg.style.opacity = '';
          for (let i = 1; i < p.steps.length; i++) {
            if (!await pause(i === 1 ? 1500 : 1250, my)) return;
            const added = p.steps[i].filter(n => !p.steps[i - 1].includes(n));
            current = design(p, p.steps[i]);
            draw(current);
            popIn(added);
            if (!LITE) burst(svg, 2, 0.15);
          }
          if (!await pause(2300, my)) return;
        }
        svg.style.opacity = 0;                         // Schmuck aus, zum Schluss der Ring
        if (!await pause(450, my)) return;
        ringStageEl.classList.remove('show-piece');
        svg.style.opacity = '';
        if (!await pause(5500, my)) return;
      }
    }
    const restart = delay => {
      gen++;
      const my = gen;
      ringStageEl.classList.remove('show-piece');
      setTimeout(() => { if (my === gen) run(my); }, delay || 0);
    };
    // Steinfarbe am Ring gewählt: Ring zeigen, Wechsel eine Weile anhalten
    document.querySelectorAll('[data-stones] input').forEach(i => i.addEventListener('change', () => restart(15000)));
    new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; })).observe(ringStageEl);
    // antippen: Gestalter mit genau diesem Stück öffnen
    const openIt = () => {
      if (!current || !ringStageEl.classList.contains('show-piece')) return;
      Object.assign(state, current);
      Object.keys(current).forEach(k => touchedKeys.add(k));
      altEdited.textAlt = altEdited.text2Alt = false;
      refreshAlt(); updateSizes(); updateFields(); syncControls(null); updateSamples();
      renderAll(); updateOutputs();
      goTo(document.getElementById('name'));
    };
    svg.addEventListener('click', openIt);
    svg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIt(); } });
    fontsReady().then(() => restart(0));
  }

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
    if (ANIM && !LITE) {
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
