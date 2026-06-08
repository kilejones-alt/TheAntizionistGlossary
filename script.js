/* v45 crackle sparkles */
/* v44 preloaded sparkles */
/* v43 attribution fix */
/* v42 live hebrew fix */
(() => {
  const search = document.querySelector('#azSearch');
  if (search) {
    search.addEventListener('input', () => {
      const value = search.value.toLowerCase();
      document.querySelectorAll('.term-list li').forEach((li) => {
        li.style.display = li.textContent.toLowerCase().includes(value) ? '' : 'none';
      });
    });
  }



  function lockHomepageLanguage() {
    if (!document.body.classList.contains('home')) return;

    // The Hebrew homepage is a real page, not a temporary language state.
    // Force it by URL and markup so a cached English preference cannot override it.
    const path = decodeURIComponent(window.location.pathname || '').toLowerCase();
    const file = path.split('/').pop();
    const hardHebrew = file === 'index-he.html' ||
      document.documentElement.lang === 'he' ||
      document.body.dataset.siteLang === 'he' ||
      document.body.classList.contains('hebrew-page');
    const hardEnglish = (file === 'index.html' || file === '') &&
      !hardHebrew &&
      (document.body.dataset.siteLang === 'en' || document.body.classList.contains('english-page'));

    if (hardHebrew) {
      document.documentElement.lang = 'he';
      document.documentElement.dir = 'rtl';
      document.body.dataset.siteLang = 'he';
      document.body.classList.add('hebrew-page');
      document.body.classList.remove('english-page');
      try {
        localStorage.setItem('azHomepageLang', 'he');
        sessionStorage.setItem('azHomepageLang', 'he');
      } catch (e) {}
      return;
    }

    if (hardEnglish) {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
      document.body.dataset.siteLang = 'en';
      document.body.classList.add('english-page');
      document.body.classList.remove('hebrew-page');
      try {
        localStorage.setItem('azHomepageLang', 'en');
        sessionStorage.setItem('azHomepageLang', 'en');
      } catch (e) {}
    }
  }

  function normalizeGlossaryIntro() {
    const target = 'A directory of terms, slogans, and accusations in modern antizionism.';
    const heading = Array.from(document.querySelectorAll('h1,h2')).find((el) => /antizionist glossary|glossary/i.test(el.textContent || ''));
    if (!heading) return;
    const candidates = Array.from(document.querySelectorAll('.lead, .page-head p, .glossary-intro-grid p, main p'));
    const intro = candidates.find((el) => {
      const t = (el.textContent || '').trim();
      return t && /terms|slogans|accusations|antizionism|anti-zionism|vocabulary|guide/i.test(t);
    });
    if (intro) intro.textContent = target;
  }

  // Fail-safe: if a page does not have hard-coded sparkles, add them.
  function ensureSparkles() {
    if (document.querySelector('.sparkle-field')) return;
    const field = document.createElement('div');
    field.className = 'sparkle-field';
    field.setAttribute('aria-hidden', 'true');
    const zones = [[3,24],[76,97],[25,33],[67,75]];
    for (let i = 0; i < 62; i++) {
      const zone = i < 14 ? zones[0] : i < 28 ? zones[1] : zones[2 + (i % 2)];
      const s = document.createElement('span');
      s.className = 'sparkle';
      const left = zone[0] + Math.random() * (zone[1] - zone[0]);
      const y = 5 + Math.random() * 104;
      const size = (i % 11 === 0 ? 10.5 + Math.random() * 3.0 : 4.8 + Math.random() * 5.0).toFixed(2);
      const dur = (46 + Math.random() * 30).toFixed(2);
      // Negative delay is intentionally spread across the full cycle so the field is already populated on page load.
      const delay = (-Math.random() * Number(dur)).toFixed(2);
      const drift = (-76 + Math.random() * 152).toFixed(1);
      const op = (0.72 + Math.random() * 0.28).toFixed(2);
      const sway = (26 + Math.random() * 44).toFixed(1);
      const twinkle = (2.2 + Math.random() * 2.6).toFixed(2);
      const crackle = (1.15 + Math.random() * 1.1).toFixed(2);
      s.setAttribute('style', `left:${left.toFixed(2)}%;--y:${y.toFixed(2)}vh;--size:${size}px;--dur:${dur}s;--delay:${delay}s;--drift:${drift}px;--sway:${sway}px;--op:${op};--twinkle:${twinkle}s;--crackle:${crackle}s`);
      field.appendChild(s);
    }
    document.body.prepend(field);
  }

  function ensureCursor() {
    let cursor = document.getElementById('gold-cursor');
    let sparks = document.getElementById('cursor-sparks');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = 'gold-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML = '<i></i>';
      document.body.appendChild(cursor);
    }
    if (!sparks) {
      sparks = document.createElement('div');
      sparks.id = 'cursor-sparks';
      sparks.setAttribute('aria-hidden', 'true');
      document.body.appendChild(sparks);
    }

    let x = -120;
    let y = -120;
    let lastSpark = 0;
    const pointerFine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    cursor.style.left = '-120px';
    cursor.style.top = '-120px';
    if (pointerFine) {
      document.body.classList.add('custom-cursor-ready');
      document.documentElement.classList.add('custom-cursor-ready');
      document.documentElement.style.cursor = 'none';
      document.body.style.cursor = 'none';
    }

    function place(nx, ny) {
      x = nx; y = ny;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      document.body.classList.add('custom-cursor-ready');
      document.documentElement.classList.add('custom-cursor-ready');
      document.documentElement.style.cursor = 'none';
      document.body.style.cursor = 'none';
    }

    function makeSpark(now = performance.now()) {
      if (x < 0 || y < 0 || now - lastSpark < 190) return;
      lastSpark = now;
      const dot = document.createElement('span');
      dot.className = 'cursor-spark';
      dot.style.left = `${x + (Math.random() * 8 - 4)}px`;
      dot.style.top = `${y + (Math.random() * 8 - 4)}px`;
      dot.style.setProperty('--trail-x', `${Math.random() * 12 - 6}px`);
      dot.style.setProperty('--trail-y', `${-3 - Math.random() * 10}px`);
      sparks.appendChild(dot);
      setTimeout(() => dot.remove(), 1200);
    }

    function move(event) {
      place(event.clientX, event.clientY);
      makeSpark();
    }
    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('pointermove', move, { passive: true });

    // Browser-proof mode only; normal live site waits for real mouse movement.
    if (new URLSearchParams(location.search).has('cursorproof')) {
      let t = 0;
      document.body.classList.add('custom-cursor-ready');
      document.documentElement.classList.add('custom-cursor-ready');
      document.documentElement.style.cursor = 'none';
      document.body.style.cursor = 'none';
      setInterval(() => {
        t += 0.15;
        place(window.innerWidth * .56 + Math.cos(t) * 62, window.innerHeight * .48 + Math.sin(t * 1.15) * 34);
        makeSpark(performance.now() + 90);
      }, 38);
    }
  }



  function normalizeIndexDates() {
    const replacements = [
      {match:/^\s*Anti[- ]?Zionism\s*\(I,\s*II,\s*III\)\s*$/i, items:[
        'Anti-Zionism, 1880–1947',
        'Anti-Zionism, 1948–October 6, 2023',
        'Antizionism, October 7, 2023–Present'
      ]},
      {match:/^\s*Zionism\s*\(I,\s*II,\s*III\)\s*$/i, items:[
        'Zionism, pre-state',
        'Zionism, 1948–October 6, 2023',
        'Zionism, October 7, 2023–Present'
      ]}
    ];
    const nodes = Array.from(document.querySelectorAll('li,a,p,div,span'));
    replacements.forEach(({match, items}) => {
      nodes.forEach((node) => {
        if (!node || node.dataset.azDateSplit === '1') return;
        const text = (node.textContent || '').trim();
        if (!match.test(text)) return;
        node.dataset.azDateSplit = '1';
        if (node.tagName === 'LI') {
          node.innerHTML = items.map((item) => `<div class="split-index-entry">${item}</div>`).join('');
        } else if (node.tagName === 'A') {
          const parent = node.parentElement;
          if (parent && parent.tagName === 'LI') {
            parent.innerHTML = items.map((item) => `<div class="split-index-entry">${item}</div>`).join('');
          } else {
            node.outerHTML = items.map((item) => `<span class="split-index-entry">${item}</span>`).join(' ');
          }
        }
      });
    });
  }

  function ensureMusicButton() {
    if (document.getElementById('music-toggle')) return;
    const nav = document.querySelector('.language-nav, .gallery-topbar nav, .site-nav, nav');
    if (!nav) return;
    const isHebrew = document.documentElement.lang === 'he' || document.body.classList.contains('hebrew-page') || document.dir === 'rtl';
    const button = document.createElement('button');
    button.id = 'music-toggle';
    button.className = 'music-toggle';
    button.type = 'button';
    button.setAttribute('aria-pressed','false');
    button.textContent = isHebrew ? 'מוזיקה' : 'Music';
    const divider = document.createElement('span');
    divider.className = 'nav-divider';
    divider.setAttribute('aria-hidden','true');
    divider.textContent = '|';
    const glossaryLink = Array.from(nav.querySelectorAll('a')).find(a => /glossary|גלוסר/i.test(a.textContent || '') || /glossary\.html/.test(a.getAttribute('href') || ''));
    if (glossaryLink && glossaryLink.nextSibling) {
      nav.insertBefore(divider, glossaryLink.nextSibling);
      nav.insertBefore(button, divider.nextSibling);
    } else {
      nav.appendChild(divider);
      nav.appendChild(button);
    }
  }


  function setupMusic() {
    const button = document.getElementById('music-toggle');
    if (!button || button.dataset.azMusicReady === '1') return;
    button.dataset.azMusicReady = '1';
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      button.textContent = `${button.textContent} unavailable`;
      button.disabled = true;
      return;
    }

    let ctx = null;
    let master = null;
    let filter = null;
    let timer = null;
    let playing = false;
    let step = 0;
    const active = new Set();
    const isHebrew = document.documentElement.lang === 'he' || document.body.dataset.siteLang === 'he' || document.documentElement.dir === 'rtl';
    const baseLabel = isHebrew ? 'מוזיקה' : 'Music';
    const playingLabel = isHebrew ? 'מוזיקה ◦' : 'Music ◦';

    // Original, browser-generated classical-style phrases. No recordings or external files.
    const phrases = [
      { root: 220.00, tempo: 62, notes: [0, 7, 12, 11, 7, 4, 2, 0, -5, 2, 7, 9, 7, 4, 2, 0] },
      { root: 261.63, tempo: 68, notes: [0, 4, 7, 12, 11, 7, 4, 0, 2, 5, 9, 12, 9, 5, 2, 0] },
      { root: 196.00, tempo: 58, notes: [0, 3, 7, 10, 12, 10, 7, 3, -2, 2, 5, 9, 7, 3, 0, -5] }
    ];

    function frequency(root, semitones) {
      return root * Math.pow(2, semitones / 12);
    }

    function makeContext() {
      if (ctx) return;
      ctx = new AudioContext();
      master = ctx.createGain();
      filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 3200;
      master.gain.value = 0.0001;
      filter.connect(master);
      master.connect(ctx.destination);
    }

    function stopActiveNodes() {
      active.forEach((node) => {
        try { node.stop(0); } catch (e) {}
      });
      active.clear();
    }

    function playTone(when, hz, length, level, type = 'sine') {
      if (!ctx || !filter) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(hz, when);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(level, when + 0.045);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + Math.max(0.08, length));
      osc.connect(gain).connect(filter);
      osc.start(when);
      osc.stop(when + length + 0.12);
      active.add(osc);
      osc.addEventListener('ended', () => active.delete(osc));
    }

    function schedulePhrase() {
      if (!playing || !ctx) return;
      const phrase = phrases[step % phrases.length];
      const beat = 60 / phrase.tempo;
      const start = ctx.currentTime + 0.06;
      phrase.notes.forEach((note, i) => {
        const t = start + i * beat;
        playTone(t, frequency(phrase.root, note), beat * 0.92, 0.035, 'sine');
        if (i % 2 === 0) playTone(t, frequency(phrase.root / 2, note), beat * 1.82, 0.022, 'triangle');
        if (i % 4 === 0) playTone(t, frequency(phrase.root / 4, note), beat * 3.55, 0.014, 'sine');
      });
      step += 1;
      const nextDelay = Math.max(120, phrase.notes.length * beat * 1000 - 70);
      timer = window.setTimeout(schedulePhrase, nextDelay);
    }

    async function start() {
      if (playing) return;
      makeContext();
      clearTimeout(timer);
      stopActiveNodes();
      try {
        await ctx.resume();
      } catch (e) {
        button.textContent = isHebrew ? 'מוזיקה — לחצו שוב' : 'Music — click again';
        return;
      }
      playing = true;
      button.setAttribute('aria-pressed', 'true');
      button.textContent = playingLabel;
      document.body.classList.add('music-playing');
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.22);
      schedulePhrase();
    }

    function stop() {
      if (!ctx || !master) return;
      playing = false;
      clearTimeout(timer);
      button.setAttribute('aria-pressed', 'false');
      button.textContent = baseLabel;
      document.body.classList.remove('music-playing');
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.045);
      window.setTimeout(stopActiveNodes, 180);
    }

    button.textContent = baseLabel;
    button.addEventListener('click', () => {
      if (playing) stop();
      else start();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && playing) stop();
    });
  }


  lockHomepageLanguage();
  normalizeGlossaryIntro();
  normalizeIndexDates();
  ensureSparkles();
  ensureCursor();
  ensureMusicButton();
  setupMusic();
})();


// v23-hebrew-no-bounce-lock
(function(){
  function run(){
    if(!document.body || document.body.dataset.siteLang!=='he') return;
    var heFiles=new Set(["about-he.html", "anti-zionism-he.html", "apartheid-he.html", "apartheid-wall-he.html", "blood-on-your-hands-he.html", "boycott-divestment-sanctions-he.html", "butcher-of-gaza-he.html", "by-any-means-necessary-he.html", "ceasefire-now-he.html", "child-killers-he.html", "collective-punishment-he.html", "colonizer-he.html", "complicity-he.html", "contact-he.html", "death-to-the-idf-he.html", "decolonization-he.html", "end-the-blockade-he.html", "end-the-occupation-he.html", "ethnic-cleansing-he.html", "ethnostate-he.html", "free-palestine-he.html", "from-the-river-to-the-sea-he.html", "genocide-he.html", "globalize-the-intifada-he.html", "glossary-he.html", "hasbara-he.html", "hebrew.html", "image-credits-he.html", "imperial-state-he.html", "index-he.html", "index-he.html", "intifada-he.html", "introduction-he.html", "israeli-war-machine-he.html", "jewish-supremacy-he.html", "liberation-he.html", "method-he.html", "modern-day-nazis-he.html", "nazi-state-he.html", "normalization-he.html", "occupation-he.html", "open-air-prison-he.html", "pinkwashing-he.html", "resistance-he.html", "resources-he.html", "settler-colonialism-he.html", "stop-the-genocide-he.html", "white-settler-he.html", "zio-zionazi-he.html", "zionism-he.html", "zionism-is-racism-he.html", "zionist-entity-he.html"]);
    document.querySelectorAll('a[href]').forEach(function(a){
      var href=a.getAttribute('href');
      if(!href || href[0]==='#' || href.indexOf('http://')===0 || href.indexOf('https://')===0 || href.indexOf('mailto:')===0) return;
      var parts=href.split('#'), base=parts[0], hash=parts[1]?'#'+parts[1]:'';
      if(base.indexOf('-he-he.html')!==-1) base=base.replace(/-he-he\.html$/,'-he.html');
      if(base==='index.html') base='index-he.html';
      else if(base.slice(-5)==='.html' && base.slice(-8)!=='-he.html') { var cand=base.replace(/\.html$/,'-he.html'); if(heFiles.has(cand)) base=cand; }
      if(base) a.setAttribute('href',base+hash);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
