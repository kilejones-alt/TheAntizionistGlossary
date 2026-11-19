(() => {
  'use strict';

  const page = document;
  const hebrew = page.documentElement.lang.startsWith('he');
  const all = (selector, root = page) => [...root.querySelectorAll(selector)];
  const create = (name, className) => {
    const el = page.createElement(name);
    if (className) el.className = className;
    return el;
  };

  function setupNavigation() {
    for (const nav of all('.nav-links, .gallery-topbar nav:not(.site-nav)')) {
      if (nav.querySelector('.az-site-link')) continue;
      const link = create('a', 'site-link-gold az-site-link');
      link.href = 'https://kilejones.com/';
      link.textContent = hebrew ? 'קייל ג׳ונס' : 'Kile Jones';
      const divider = create('span', 'nav-divider');
      divider.textContent = '|';
      divider.setAttribute('aria-hidden', 'true');
      const music = nav.querySelector('#music-toggle');
      if (music) music.before(link, divider);
      else nav.append(divider, link);
    }

    const toggle = page.querySelector('.nav-toggle');
    const links = page.querySelector('.nav-links');
    if (!toggle || !links) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      page.body.classList.toggle('nav-open', open);
    }

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    links.addEventListener('click', event => {
      if (event.target.closest('a, button')) setOpen(false);
    });
    page.addEventListener('keydown', event => {
      if (event.key === 'Escape' && page.body.classList.contains('nav-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    page.addEventListener('pointerdown', event => {
      if (!toggle.contains(event.target) && !links.contains(event.target)) setOpen(false);
    }, { passive: true });
    matchMedia('(max-width: 760px)').addEventListener('change', () => setOpen(false));
  }

  function setupSearch() {
    const input = page.querySelector('[data-term-search]');
    if (!input) return;
    const normalize = value => value.normalize('NFKC').toLocaleLowerCase(hebrew ? 'he' : 'en')
      .replace(/[\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7]/g, '')
      .replace(/[\s\-\u2010-\u2014]+/g, ' ').trim();
    const sections = all('.letter-block').map(block => ({
      block,
      entries: all('.term-list li', block).map(el => ({ el, words: normalize(el.textContent) })),
    }));
    const status = page.getElementById('search-status');
    const alphabet = all('.alphabet a[href^="#"]');
    const update = () => {
      const query = normalize(input.value);
      let count = 0;
      for (const { block, entries } of sections) {
        let visible = 0;
        for (const { el, words } of entries) {
          const match = words.includes(query);
          el.hidden = !match;
          if (match) visible++;
        }
        block.hidden = visible === 0;
        count += visible;
      }
      for (const link of alphabet) {
        const target = page.getElementById(link.getAttribute('href').slice(1));
        link.hidden = Boolean(target?.closest('.letter-block')?.hidden);
      }
      if (status) status.textContent = hebrew ? `נמצאו ${count} ערכים` : `${count} terms shown`;
    };
    input.addEventListener('input', update);
    if (input.value) update();
    addEventListener('pageshow', () => { if (input.value) update(); });
  }

  function setupResearchRail() {
    const rails = all('.entry-side .side-toggle');
    if (!rails.length) return;
    const compact = matchMedia('(max-width: 980px)');
    for (const button of rails) {
      const section = button.closest('.side-section');
      if (!section) continue;
      const symbol = button.querySelector('.side-toggle-plus');
      const setOpen = open => {
        button.setAttribute('aria-expanded', String(open));
        section.classList.toggle('is-collapsed', !open);
        if (symbol) symbol.textContent = open ? '−' : '+';
      };
      setOpen(!compact.matches);
      compact.addEventListener('change', event => setOpen(!event.matches));
      button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
    }
  }

  function setupProgress() {
    if (!page.body.matches('.entry-page, .introduction-page, .glossary-page')) return;
    const bar = create('div', 'az-progress');
    const fill = create('i');
    bar.setAttribute('aria-hidden', 'true');
    bar.append(fill);
    page.body.append(bar);
    let frame;
    const update = () => {
      frame = undefined;
      const range = page.documentElement.scrollHeight - innerHeight;
      const progress = range > 0 ? Math.max(0, Math.min(1, scrollY / range)) : 0;
      fill.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(update); };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    addEventListener('pageshow', schedule);
    update();
  }

  function setupMusic() {
    const buttons = all('#music-toggle, .music-toggle, [data-music-toggle]');
    if (!buttons.length) return;
    const key = 'tagMusicStateV202';
    let position = 0;
    let volume = .42;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      if (Number.isFinite(saved.time)) position = Math.max(0, saved.time);
      if (Number.isFinite(saved.volume)) volume = Math.max(0, Math.min(1, saved.volume));
    } catch {}

    let audio;
    function sync(playing) {
      for (const button of buttons) {
        button.setAttribute('aria-pressed', String(playing));
        button.classList.toggle('is-playing', playing);
        button.textContent = hebrew ? (playing ? 'מוזיקה פועלת' : 'מוזיקה') : (playing ? 'Music On' : 'Music');
      }
    }
    function save() {
      if (!audio) return;
      try { localStorage.setItem(key, JSON.stringify({ time: audio.currentTime, volume })); } catch {}
    }
    function loadAudio() {
      audio = create('audio');
      audio.id = 'site-music-audio';
      audio.loop = true;
      audio.playsInline = true;
      audio.preload = 'none';
      audio.volume = volume;
      audio.addEventListener('loadedmetadata', () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = position % audio.duration;
      }, { once: true });
      audio.addEventListener('play', () => sync(true));
      audio.addEventListener('pause', () => { sync(false); save(); });
      audio.addEventListener('error', () => sync(false));
      audio.src = 'lumen-nocturne-lite.mp3';
      page.body.append(audio);
    }

    for (const button of buttons) button.addEventListener('click', async () => {
      if (!audio) loadAudio();
      if (!audio.paused) { audio.pause(); return; }
      try { await audio.play(); } catch { sync(false); }
    });
    addEventListener('pagehide', () => { audio?.pause(); save(); });
    page.addEventListener('visibilitychange', () => { if (page.hidden) audio?.pause(); });
    sync(false);
  }

  function setupReader() {
    if (!page.body.matches('.entry-page, .introduction-page') || !('speechSynthesis' in window)) return;
    const trigger = create('button', 'az-reader-toggle');
    trigger.type = 'button';
    trigger.textContent = hebrew ? 'קורא' : 'Reader';
    trigger.setAttribute('aria-expanded', 'false');
    page.body.append(trigger);
    trigger.addEventListener('click', async () => {
      trigger.disabled = true;
      try {
        const { openReader } = await import('./glossary-reader.js?v=287');
        openReader(trigger);
        trigger.removeAttribute('title');
      } catch {
        trigger.title = hebrew ? 'הקורא אינו זמין' : 'Reader unavailable';
      } finally {
        trigger.disabled = false;
      }
    });
  }

  setupNavigation();
  setupSearch();
  setupResearchRail();
  setupProgress();
  setupMusic();
  setupReader();
})();
