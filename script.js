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
    for (let i = 0; i < 36; i++) {
      const zone = i < 14 ? zones[0] : i < 28 ? zones[1] : zones[2 + (i % 2)];
      const s = document.createElement('span');
      s.className = 'sparkle';
      const left = zone[0] + Math.random() * (zone[1] - zone[0]);
      const y = 16 + Math.random() * 86;
      const size = (i % 16 === 0 ? 4.8 + Math.random() * .7 : 2.5 + Math.random() * 2.1).toFixed(2);
      const dur = (62 + Math.random() * 24).toFixed(2);
      const delay = (-(Math.random() * Number(dur))).toFixed(2);
      const drift = (-18 + Math.random() * 36).toFixed(1);
      const op = (0.58 + Math.random() * 0.28).toFixed(2);
      s.setAttribute('style', `left:${left.toFixed(2)}%;--y:${y.toFixed(2)}vh;--size:${size}px;--dur:${dur}s;--delay:${delay}s;--drift:${drift}px;--op:${op}`);
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
    if (!button) return;
    let ctx = null;
    let master = null;
    let timers = [];
    let playing = false;
    let track = 0;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      button.textContent = button.textContent + ' unavailable';
      button.disabled = true;
      return;
    }
    const tracks = [
      {name:'Bach-style sarabande', tempo:64, key:261.63, seq:[0,4,7,12,11,7,4,0, -2,2,7,11,9,5,2,-2]},
      {name:'Beethoven-style bagatelle', tempo:72, key:293.66, seq:[0,3,7,10,12,10,7,3, 2,5,9,12,14,12,9,5]},
      {name:'Tchaikovsky-style nocturne', tempo:58, key:220.00, seq:[0,7,9,12,11,7,4,2, 0,4,7,11,12,9,7,4]}
    ];
    function freq(base, degree){ return base * Math.pow(2, degree / 12); }
    function clearTimers(){ timers.forEach(clearTimeout); timers=[]; }
    function note(time, frequency, length, gainValue){
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, time);
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(gainValue, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
      osc.connect(gain).connect(master);
      osc.start(time);
      osc.stop(time + length + 0.08);
    }
    function scheduleTrack(){
      if (!playing || !ctx) return;
      const t = tracks[track % tracks.length];
      const beat = 60 / t.tempo;
      const start = ctx.currentTime + 0.08;
      t.seq.forEach((degree, i) => {
        note(start + i * beat, freq(t.key, degree), beat * .82, .045);
        if (i % 2 === 0) note(start + i * beat, freq(t.key/2, degree), beat * 1.6, .030);
        if (i % 4 === 0) note(start + i * beat, freq(t.key/4, degree), beat * 3.2, .020);
      });
      const duration = t.seq.length * beat * 1000;
      timers.push(setTimeout(() => { track++; scheduleTrack(); }, duration - 80));
    }
    function start(){
      if (!ctx) {
        ctx = new AudioContext();
        master = ctx.createGain();
        master.gain.value = 0.13;
        master.connect(ctx.destination);
      }
      ctx.resume();
      playing = true;
      button.setAttribute('aria-pressed','true');
      document.body.classList.add('music-playing');
      scheduleTrack();
    }
    function stop(){
      playing = false;
      clearTimers();
      button.setAttribute('aria-pressed','false');
      document.body.classList.remove('music-playing');
      if (master) master.gain.setTargetAtTime(0.0001, ctx.currentTime, .05);
      setTimeout(() => { if (master && ctx && !playing) master.gain.value = 0.13; }, 180);
    }
    button.addEventListener('click', () => playing ? stop() : start());
  }


  normalizeGlossaryIntro();
  normalizeIndexDates();
  ensureSparkles();
  ensureCursor();
  ensureMusicButton();
  setupMusic();
})();
