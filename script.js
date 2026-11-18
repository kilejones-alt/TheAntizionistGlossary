// TAG v181 clean consolidated behavior.
(function(){
  'use strict';
  var VERSION='274';
  var d=document;
  function $(s,root){return (root||d).querySelector(s)}
  function $$(s,root){return Array.prototype.slice.call((root||d).querySelectorAll(s))}
  function rand(min,max){return min+Math.random()*(max-min)}

  function initEntryImages(){
    /* v217: keep legitimate PNG entry images visible. Older card-style images are no longer linked from entry pages. */
    $$('.entry-image').forEach(function(fig){
      fig.classList.remove('entry-card-image');
      fig.classList.add('entry-image-blended','preserve-full-focal');
    });
  }

  function wrapLetters(el){
    var docLang=(d.documentElement.lang||'').toLowerCase();
    var isRtlPage=d.documentElement.dir==='rtl' || docLang.indexOf('he')===0 || (d.body && d.body.getAttribute('data-site-lang')==='he');
    if(!el || isRtlPage || el.classList.contains('letterized') || el.closest('.no-letter-wrap,[dir="rtl"],[lang="he"]')) return;
    var text=el.textContent;
    if(!text || text.trim().length<2 || text.length>90) return;
    el.textContent='';
    el.classList.add('letterized');
    Array.prototype.forEach.call(text,function(ch){
      if(ch===' '){el.appendChild(d.createTextNode(' '));return;}
      var span=d.createElement('span');span.className='az-letter';span.textContent=ch;el.appendChild(span);
    });
  }
  function initLetterHover(){
    var sels='.home-kicker,.home-subtitle,.home-author,.term-list a,.alphabet a,.gallery-topbar a,.music-toggle,.entry-side h3,.entry-side a,.intro-card h2,.intro-card p,.tiny-citation-box,.eyebrow,.resource-grid h2,.gallery-main h1,.gallery-main h2';
    $$(sels).forEach(wrapLetters);
  }

  function initGlobalHoverText(){
    var sels='nav a,footer a,button,.music-toggle,.az-reader-toggle,.term-list a,.alphabet a,.entry-back-primary,.related-terms-list a';
    $$(sels).forEach(function(el){
      if(!el || el.closest('script,style,noscript,svg,.no-hover-text')) return;
      if((el.textContent||'').trim().length<1) return;
      el.classList.add('az-hoverable-text');
    });
  }

  function wrapEntryWords(){
    var selectors='.entry-opening h1,.entry-main p,.entry-main li,.entry-main h2,.entry-main h3';
    $$(selectors).forEach(function(root){
      if(!root || root.classList.contains('word-hover-ready')) return;
      var walker=d.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
        acceptNode:function(node){
          if(!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          var parent=node.parentElement;
          if(!parent || parent.closest('script,style,noscript,svg,a,button,.az-word,.no-hover-text')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var nodes=[];
      while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function(node){
        var frag=d.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function(part){
          if(!part) return;
          if(/^\s+$/.test(part)){frag.appendChild(d.createTextNode(part));return;}
          var span=d.createElement('span');
          span.className='az-word';
          span.textContent=part;
          frag.appendChild(span);
        });
        node.parentNode.replaceChild(frag,node);
      });
      root.classList.add('word-hover-ready');
    });
  }

  function initSearch(){
    $$('[data-term-search]').forEach(function(input){
      input.addEventListener('input',function(){
        var q=input.value.trim().toLowerCase();
        $$('.term-list li').forEach(function(li){li.classList.toggle('hidden',q && li.textContent.toLowerCase().indexOf(q)===-1)});
        $$('.letter-block').forEach(function(block){
          var visible=$$('.term-list li:not(.hidden)',block).length>0;
          block.classList.toggle('hidden',q && !visible);
        });
        var status=d.getElementById('search-status');
        if(status){
          var count=$$('.term-list li:not(.hidden)').length;
          status.textContent=(d.documentElement.lang||'').toLowerCase().indexOf('he')===0 ? ('נמצאו '+count+' ערכים') : (count+' terms shown');
        }
      });
    });
  }

  function initMusic(){
    /* v204: persistent music is handled by the v202+ cross-page music block below. */
  }

  function initReader(){ return; /* superseded by v275 reader */
    var readerAllowed=d.body.classList.contains('entry-page') || d.body.classList.contains('introduction-page');
    $$('.az-reader-toggle').forEach(function(el){el.remove()});
    if(!readerAllowed || !('speechSynthesis' in window)) return;
    var btn=d.createElement('button');
    btn.type='button';
    btn.className='az-reader-toggle';
    btn.textContent=(d.documentElement.lang||'').toLowerCase().indexOf('he')===0?'קורא':'Reader';
    d.body.appendChild(btn);
    var nodes=[], idx=0, reading=false, selectedVoice=null, voiceReady=false;

    function collect(){
      var selector='.entry-main p:not(.entry-label),.entry-main li,main.gallery-main p,main.gallery-main li,main:not(.gallery-main) p,main:not(.gallery-main) li';
      return $$(selector).filter(function(n){
        return !n.closest('nav,footer,figure,aside,.no-reader') && n.textContent.trim().length>20;
      });
    }

    function pageLang(){
      return ((d.documentElement.lang || d.body.getAttribute('data-site-lang') || 'en')+'').toLowerCase();
    }

    function chooseVoice(){
      var voices=speechSynthesis.getVoices()||[];
      if(!voices.length) return null;
      var isHebrew=pageLang().indexOf('he')===0;
      var preferredHebrew=[
        /he-IL/i,
        /Hebrew/i,
        /Carmit/i,
        /Microsoft.*Hebrew/i
      ];
      var preferredEnglish=[
        /Microsoft Jenny/i,
        /Microsoft Aria/i,
        /Google US English/i,
        /Google UK English Female/i,
        /Samantha/i,
        /Karen/i,
        /Daniel/i,
        /Moira/i,
        /Serena/i,
        /Alex/i
      ];
      var list=isHebrew?preferredHebrew:preferredEnglish;
      for(var i=0;i<list.length;i++){
        var match=voices.find(function(v){return list[i].test(v.name) || list[i].test(v.lang);});
        if(match) return match;
      }
      return voices.find(function(v){return isHebrew ? /^he/i.test(v.lang) : /^en/i.test(v.lang);}) || voices[0];
    }

    function loadVoice(){
      selectedVoice=chooseVoice();
      voiceReady=!!selectedVoice;
    }

    function clear(){nodes.forEach(function(n){n.classList.remove('is-reader-highlight')});}
    function stop(){speechSynthesis.cancel();reading=false;btn.classList.remove('is-reading');clear();}

    function speakNext(){
      clear();
      if(idx>=nodes.length){stop();return;}
      var n=nodes[idx++];
      var text=n.textContent.replace(/\s+/g,' ').trim();
      if(!text){speakNext();return;}
      n.classList.add('is-reader-highlight');
      try{n.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}
      var u=new SpeechSynthesisUtterance(text);
      var isHebrew=pageLang().indexOf('he')===0;
      u.lang=isHebrew?'he-IL':'en-US';
      u.rate=isHebrew?.82:.86;
      u.pitch=isHebrew?.92:.94;
      u.volume=1;
      if(!selectedVoice) loadVoice();
      if(selectedVoice) u.voice=selectedVoice;
      u.onend=function(){ if(reading) speakNext(); };
      u.onerror=function(){ if(reading) speakNext(); };
      speechSynthesis.speak(u);
    }

    btn.addEventListener('click',function(){
      if(reading){stop();return;}
      loadVoice();
      nodes=collect();idx=0;if(!nodes.length) return;
      reading=true;btn.classList.add('is-reading');speechSynthesis.cancel();speakNext();
    });

    if(typeof speechSynthesis.onvoiceschanged !== 'undefined'){
      speechSynthesis.addEventListener('voiceschanged',loadVoice);
    }
    loadVoice();
    window.addEventListener('beforeunload',function(){speechSynthesis.cancel()});
  }

  document.addEventListener('DOMContentLoaded',function(){
    initEntryImages();
    initLetterHover();
    initGlobalHoverText();
    if(window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches) wrapEntryWords();
    initSearch();
    initMusic();
    initReader();
  });
})();




/* --- v202 persistent music across pages --- */
(() => {
  const MUSIC_SRC = "lumen-nocturne.mp3";
  const KEY = "tagMusicStateV202";
  const LEGACY_KEYS = ["tagMusicOn", "tagMusicTime", "tagMusicVolume"];

  const readState = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || "{}");
      return {
        playing: !!stored.playing,
        enabled: typeof stored.enabled === "boolean" ? stored.enabled : true,
        time: Number.isFinite(stored.time) ? stored.time : 0,
        volume: Number.isFinite(stored.volume) ? stored.volume : 0.42,
        updatedAt: Number.isFinite(stored.updatedAt) ? stored.updatedAt : Date.now()
      };
    } catch {
      return { playing: false, enabled: true, time: 0, volume: 0.42, updatedAt: Date.now() };
    }
  };

  const writeState = (audio, playing, enabled = playing) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        playing,
        enabled,
        time: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
        volume: Number.isFinite(audio.volume) ? audio.volume : 0.42,
        updatedAt: Date.now()
      }));
      LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
    } catch {}
  };

  const getOrCreateAudio = (shouldPrime = false) => {
    let audio = document.getElementById("site-music-audio");
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "site-music-audio";
      audio.loop = true;
      audio.preload = shouldPrime ? "metadata" : "none";
      audio.playsInline = true;
      if (shouldPrime) audio.src = MUSIC_SRC;
      document.body.appendChild(audio);
    }
    return audio;
  };

  const ensureMusicSource = (audio) => {
    if (!audio.getAttribute("src")) {
      audio.src = MUSIC_SRC;
      audio.preload = "metadata";
      try { audio.load(); } catch {}
    }
  };

  const syncButtons = (playing) => {
    document.querySelectorAll("#music-toggle, .music-toggle, [data-music-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
      btn.classList.toggle("is-playing", playing);
      if (/music|מוזיקה/i.test(btn.textContent || "")) {
        btn.textContent = playing ? (document.documentElement.lang === "he" ? "מוזיקה פועלת" : "Music On") : (document.documentElement.lang === "he" ? "מוזיקה" : "Music");
      }
    });
  };

  const init = () => {
    const state = readState();
    const audio = getOrCreateAudio(state.enabled && state.playing);

    audio.volume = Math.max(0, Math.min(1, state.volume || 0.42));

    const restoreTime = () => {
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : null;
      const time = Number.isFinite(state.time) ? state.time : 0;
      audio.currentTime = duration ? (time % duration) : time;
    };

    if (audio.readyState >= 1) {
      try { restoreTime(); } catch {}
    } else {
      audio.addEventListener("loadedmetadata", () => {
        try { restoreTime(); } catch {}
      }, { once: true });
    }

    let saveTimer = null;
    const startSaving = () => {
      clearInterval(saveTimer);
      saveTimer = setInterval(() => writeState(audio, !audio.paused, true), 800);
    };
    const stopSaving = () => {
      clearInterval(saveTimer);
      saveTimer = null;
      writeState(audio, false);
    };

    const playAudio = async () => {
      try {
        ensureMusicSource(audio);
        await audio.play();
        syncButtons(true);
        writeState(audio, true, true);
        startSaving();
      } catch {
        syncButtons(false);
        writeState(audio, false);
      }
    };

    const pauseAudio = () => {
      audio.pause();
      syncButtons(false);
      clearInterval(saveTimer);
      saveTimer = null;
      writeState(audio, false, false);
    };

    document.querySelectorAll("#music-toggle, .music-toggle, [data-music-toggle]").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        event.preventDefault();
        if (audio.paused) await playAudio();
        else pauseAudio();
      });
    });

    // v216: on the first user interaction anywhere on the page, start music.
    // This satisfies browser autoplay rules because it is tied to a user gesture.
    let tagAutoMusicStarted = false;
    const startMusicFromPageGesture = async (event) => {
      const target = event && event.target;
      if (target && target.closest && target.closest("#music-toggle, .music-toggle, [data-music-toggle]")) return;
      if (tagAutoMusicStarted || !audio.paused || !readState().enabled) return;
      tagAutoMusicStarted = true;
      await playAudio();
      document.removeEventListener("pointerdown", startMusicFromPageGesture, true);
      document.removeEventListener("keydown", startMusicFromPageGesture, true);
    };
    document.addEventListener("pointerdown", startMusicFromPageGesture, true);
    document.addEventListener("keydown", startMusicFromPageGesture, true);

    audio.addEventListener("play", () => {
      syncButtons(true);
      writeState(audio, true, true);
      startSaving();
    });

    audio.addEventListener("pause", () => {
      syncButtons(false);
      if (!audio.ended) writeState(audio, false, readState().enabled);
      clearInterval(saveTimer);
      saveTimer = null;
    });

    window.addEventListener("pagehide", () => writeState(audio, !audio.paused, readState().enabled));
    window.addEventListener("beforeunload", () => writeState(audio, !audio.paused, readState().enabled));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") writeState(audio, !audio.paused, readState().enabled);
    });

    syncButtons(state.playing);

    // After the user has clicked Music once, every next page attempts to resume from the saved timestamp.
    // Browser rules may still require a fresh click in some cases; this is the safest non-SPA method.
    if (state.enabled && state.playing) {
      const resume = () => playAudio();
      if (document.readyState === "complete") resume();
      else window.addEventListener("load", resume, { once: true });
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();



/* v265 — research rail: open on desktop, compact accordion on phones. */
(() => {
  const initEntryResearchRail = () => {
    const compact = window.matchMedia('(max-width: 980px)').matches;
    document.querySelectorAll('.entry-side .side-toggle').forEach((button) => {
      if (button.dataset.v265Bound === 'true') return;
      button.dataset.v265Bound = 'true';
      const section = button.closest('.side-section');
      if (!section) return;
      const plus = button.querySelector('.side-toggle-plus');
      if (compact) section.classList.add('is-collapsed');
      else section.classList.remove('is-collapsed');
      const sync = () => {
        const collapsed = section.classList.contains('is-collapsed');
        button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        if (plus) plus.textContent = collapsed ? '+' : '−';
      };
      sync();
      button.addEventListener('click', () => {
        section.classList.toggle('is-collapsed');
        sync();
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initEntryResearchRail, { once: true });
  else initEntryResearchRail();
})();

/* v265 compact mobile navigation. */
(() => {
  const initNav = () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links || toggle.dataset.v265NavBound === 'true') return;
    toggle.dataset.v265NavBound = 'true';
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      document.body.classList.toggle('nav-open', !open);
    });
    links.querySelectorAll('a,button').forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initNav, { once:true });
  else initNav();
})();

/* v266 final sweep: slightly larger research-rail text only; entry body size is intentionally unchanged. */
(() => {
  const applyFinalSweep = () => {
    if (document.getElementById('tag-v266-final-sweep')) return;
    const style = document.createElement('style');
    style.id = 'tag-v266-final-sweep';
    style.textContent = `
      .entry-page .entry-side li,
      .entry-page .entry-side li a {
        font-size:15.5px!important;
        line-height:1.58!important;
      }
      .entry-page .entry-side .source-record-top,
      .entry-page .entry-side .source-type,
      .entry-page .entry-side .source-year {
        font-size:12px!important;
        line-height:1.35!important;
      }
    `;
    document.head.appendChild(style);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyFinalSweep, { once:true });
  else applyFinalSweep();
})();


/* v274 mobile interaction hardening. */
(() => {
  const init = () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      const close = () => {
        toggle.setAttribute('aria-expanded','false');
        document.body.classList.remove('nav-open');
      };
      document.addEventListener('pointerdown', (event) => {
        if (!document.body.classList.contains('nav-open')) return;
        if (toggle.contains(event.target) || links.contains(event.target)) return;
        close();
      });
      window.addEventListener('resize', () => { if (window.innerWidth > 760) close(); }, {passive:true});
    }
    const mq = window.matchMedia('(max-width:980px)');
    const syncRail = () => {
      document.querySelectorAll('.entry-side .side-section').forEach((section) => {
        const button = section.querySelector('.side-toggle');
        const plus = section.querySelector('.side-toggle-plus');
        if (!button) return;
        if (!mq.matches) section.classList.remove('is-collapsed');
        const collapsed = section.classList.contains('is-collapsed');
        button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        if (plus) plus.textContent = collapsed ? '+' : '−';
      });
    };
    if (mq.addEventListener) mq.addEventListener('change', syncRail);
    syncRail();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();


/* === v275: enhanced reader, progress line, scroll reveal, home motion, site link === */
(() => {
  const d = document, $ = (s, r) => (r || d).querySelector(s), $$ = (s, r) => Array.from((r || d).querySelectorAll(s));
  const he = () => ((d.documentElement.lang || d.body.getAttribute('data-site-lang') || 'en') + '').toLowerCase().indexOf('he') === 0;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SKEY = 'azReaderV275';
  const load = () => { try { return JSON.parse(localStorage.getItem(SKEY) || '{}'); } catch (e) { return {}; } };
  const save = (o) => { try { localStorage.setItem(SKEY, JSON.stringify(o)); } catch (e) {} };

  // stylesheet
  if (!$('link[data-az-enhance]')) {
    const l = d.createElement('link'); l.rel = 'stylesheet'; l.href = 'enhance.css?v=275'; l.setAttribute('data-az-enhance', '1');
    d.head.appendChild(l);
  }

  // link back to the author's main site
  const addSiteLink = () => {
    $$('.nav-links, .gallery-topbar nav:not(.site-nav)').forEach((nav) => {
      if ($('.az-site-link', nav)) return;
      const div = d.createElement('span'); div.className = 'nav-divider'; div.textContent = '|';
      const a = d.createElement('a'); a.className = 'site-link-gold az-site-link'; a.href = 'https://kilejones.com/'; a.rel = 'noopener';
      a.textContent = he() ? 'קייל ג׳ונס' : 'Kile Jones';
      const music = $('#music-toggle', nav);
      if (music) { nav.insertBefore(a, music); nav.insertBefore(div, music); } else { nav.appendChild(div); nav.appendChild(a); }
    });
  };

  // reading progress
  const addProgress = () => {
    if ($('.az-progress') || !(d.body.classList.contains('entry-page') || d.body.classList.contains('introduction-page') || d.body.classList.contains('glossary-page'))) return;
    const bar = d.createElement('div'); bar.className = 'az-progress'; bar.setAttribute('aria-hidden', 'true');
    const fill = d.createElement('i'); bar.appendChild(fill); d.body.appendChild(bar);
    let tick = false;
    const upd = () => { tick = false; const h = d.documentElement.scrollHeight - window.innerHeight; fill.style.width = (h > 0 ? Math.min(100, Math.max(0, window.scrollY / h * 100)) : 0) + '%'; };
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    window.addEventListener('resize', upd); upd();
  };

  // reveal on scroll
  const addReveal = () => {
    if (reduce || !('IntersectionObserver' in window)) return;
    const els = $$('.entry-main p, .entry-main li');
    if (!els.length) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 0.9) return; el.classList.add('az-reveal'); io.observe(el); });
  };

  // home: stars and pointer parallax
  const addHomeMotion = () => {
    if (!d.body.classList.contains('home') || reduce) return;
    const c = d.createElement('canvas'); c.className = 'az-stars'; c.setAttribute('aria-hidden', 'true'); d.body.insertBefore(c, d.body.firstChild);
    const ctx = c.getContext('2d'); let w = 0, h = 0, stars = [], raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const size = () => { w = c.width = Math.floor(innerWidth * dpr); h = c.height = Math.floor(innerHeight * dpr); const n = Math.round(Math.min(160, innerWidth * innerHeight / 9000)); stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.1 + .25) * dpr, p: Math.random() * 6.28, s: Math.random() * .6 + .2, v: (Math.random() * .06 + .01) * dpr })); };
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.y -= s.v; if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
        const a = .25 + .55 * (.5 + .5 * Math.sin(t / 1000 * s.s + s.p));
        ctx.fillStyle = 'rgba(255,244,214,' + a.toFixed(3) + ')'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    size(); window.addEventListener('resize', size);
    d.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!d.hidden) raf = requestAnimationFrame(draw); });
    raf = requestAnimationFrame(draw);
    const wrap = $('.globe-wrap');
    if (wrap && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      window.addEventListener('pointermove', (e) => {
        const x = (e.clientX / innerWidth - .5) * 14, y = (e.clientY / innerHeight - .5) * 10;
        wrap.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      }, { passive: true });
    }
  };

  // music: fade in on play
  const fadeMusic = () => {
    const a = d.getElementById('site-music-audio'); if (!a || a.dataset.azFade) return; a.dataset.azFade = '1';
    a.addEventListener('play', () => {
      if (reduce || a.dataset.azDuck) return;
      let target = a.volume; if (!(target > 0)) return; a.volume = 0; const t0 = performance.now();
      const step = (n) => { const k = Math.min(1, (n - t0) / 1400); a.volume = Math.min(1, target * k); if (k < 1 && !a.paused) requestAnimationFrame(step); else if (k >= 1) a.volume = target; };
      requestAnimationFrame(step);
    });
  };

  // reader
  const initReaderV2 = () => {
    const ok = d.body.classList.contains('entry-page') || d.body.classList.contains('introduction-page');
    $$('.az-reader-toggle').forEach((el) => el.remove());
    if (!ok || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
    const L = he() ? { open: 'קורא', play: 'נגן', pause: 'השהה', prev: 'הקודם', next: 'הבא', close: 'סגור', speed: 'מהירות', voice: 'קול', aria: 'בקרות הקורא' } : { open: 'Reader', play: 'Play', pause: 'Pause', prev: 'Previous paragraph', next: 'Next paragraph', close: 'Close reader', speed: 'Speed', voice: 'Voice', aria: 'Reader controls' };
    const st = Object.assign({ rate: 1, voice: '' }, load());
    const toggle = d.createElement('button'); toggle.type = 'button'; toggle.className = 'az-reader-toggle'; toggle.textContent = L.open; toggle.setAttribute('aria-label', L.open); d.body.appendChild(toggle);
    const dock = d.createElement('div'); dock.className = 'az-dock'; dock.setAttribute('role', 'group'); dock.setAttribute('aria-label', L.aria);
    dock.innerHTML = '<button type="button" class="az-prev" aria-label="' + L.prev + '">&#9198;</button><button type="button" class="az-play" aria-label="' + L.play + '">&#9654;</button><button type="button" class="az-next" aria-label="' + L.next + '">&#9197;</button><span class="az-count" aria-live="off">0/0</span><select class="az-speed" aria-label="' + L.speed + '"></select><select class="az-voice" aria-label="' + L.voice + '"></select><button type="button" class="az-close" aria-label="' + L.close + '">&#10005;</button><span class="az-bar"><i></i></span>';
    d.body.appendChild(dock);
    const q = (s) => $(s, dock), playB = q('.az-play'), countE = q('.az-count'), speedS = q('.az-speed'), voiceS = q('.az-voice'), fill = q('.az-bar i');
    [.8, 1, 1.15, 1.3, 1.5].forEach((r) => { const o = d.createElement('option'); o.value = r; o.textContent = r + '×'; speedS.appendChild(o); });
    speedS.value = String(st.rate);

    let paras = [], pi = 0, ci = 0, chunks = [], playing = false, token = 0, voices = [], duck = null, fails = 0;
    const lang = () => he() ? 'he' : 'en';
    const collect = () => $$('.entry-main p:not(.entry-label),.entry-main li,main.gallery-main p,main.gallery-main li,main:not(.gallery-main) p,main:not(.gallery-main) li').filter((n, i, a) => a.indexOf(n) === i && !n.closest('nav,footer,figure,aside,.no-reader') && n.textContent.trim().length > 20);
    const chunk = (text) => {
      text = text.replace(/\s+/g, ' ').trim();
      let sents = [];
      if (window.Intl && Intl.Segmenter) { try { sents = Array.from(new Intl.Segmenter(he() ? 'he' : 'en', { granularity: 'sentence' }).segment(text), (x) => x.segment.trim()); } catch (e) {} }
      if (!sents.length) sents = text.match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) || [text];
      const out = []; let cur = '';
      sents.forEach((s) => { if ((cur + ' ' + s).length > 210 && cur) { out.push(cur); cur = s; } else cur = cur ? cur + ' ' + s : s; });
      if (cur) out.push(cur);
      return out.reduce((acc, s) => { while (s.length > 260) { let k = s.lastIndexOf(',', 240); if (k < 80) k = s.lastIndexOf(' ', 240); if (k < 80) k = 240; acc.push(s.slice(0, k + 1)); s = s.slice(k + 1).trim(); } acc.push(s); return acc; }, []);
    };
    const rank = (v) => { const n = v.name || ''; let s = 0; if (/natural|neural|premium|enhanced|online|siri/i.test(n)) s += 6; if (/google/i.test(n)) s += 3; if (/aria|jenny|ava|evan|samantha|serena|daniel|moira|karen|carmit|hila|avri/i.test(n)) s += 2; if (!v.localService) s += 1; return s; };
    const loadVoices = () => {
      voices = (speechSynthesis.getVoices() || []).filter((v) => (v.lang || '').toLowerCase().indexOf(lang()) === 0).sort((a, b) => rank(b) - rank(a));
      voiceS.innerHTML = '';
      voices.forEach((v) => { const o = d.createElement('option'); o.value = v.name; o.textContent = v.name.replace(/Microsoft |Online \(Natural\) - /g, '').slice(0, 28); voiceS.appendChild(o); });
      const pick = voices.find((v) => v.name === st.voice) || voices[0];
      if (pick) voiceS.value = pick.name;
      voiceS.style.display = voices.length > 1 ? '' : 'none';
    };
    const cur = () => voices.find((v) => v.name === voiceS.value) || voices[0] || null;
    const setDuck = (on) => {
      const a = d.getElementById('site-music-audio'); if (!a) return;
      if (on && !a.paused && duck === null) { duck = a.volume; a.dataset.azDuck = '1'; a.volume = Math.min(a.volume, .08); }
      if (!on && duck !== null) { a.volume = duck; duck = null; delete a.dataset.azDuck; }
    };
    const clearHL = () => paras.forEach((n) => n.classList.remove('is-reader-highlight'));
    const ui = () => { playB.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;'; playB.setAttribute('aria-label', playing ? L.pause : L.play); countE.textContent = Math.min(pi + 1, paras.length) + '/' + paras.length; fill.style.width = (paras.length ? (pi / paras.length * 100) : 0) + '%'; };
    const goPara = (i, startPlaying) => {
      speechSynthesis.cancel(); token++;
      pi = Math.max(0, Math.min(paras.length - 1, i)); ci = 0; clearHL();
      const n = paras[pi]; if (!n) return;
      n.classList.add('is-reader-highlight'); chunks = chunk(n.textContent);
      const r = n.getBoundingClientRect(); if (r.top < 70 || r.bottom > innerHeight - 100) { try { n.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); } catch (e) {} }
      ui(); if (startPlaying) speak();
    };
    const speak = () => {
      if (!playing) return;
      if (ci >= chunks.length) { if (pi + 1 < paras.length) goPara(pi + 1, true); else stop(true); return; }
      const my = ++token, u = new SpeechSynthesisUtterance(chunks[ci]);
      u.lang = he() ? 'he-IL' : 'en-US'; u.rate = Number(st.rate) * (he() ? .9 : .95); u.pitch = 1; u.volume = 1;
      const v = cur(); if (v) { u.voice = v; u.lang = v.lang || u.lang; }
      u.onend = () => { if (my === token && playing) { fails = 0; ci++; speak(); } };
      u.onerror = (e) => { if (my !== token || !playing || e.error === 'interrupted' || e.error === 'canceled') return; fails++; if (fails >= 3) { fails = 0; pause(); countE.textContent = he() ? 'אין קול' : 'No voice'; return; } ci++; speak(); };
      speechSynthesis.speak(u);
    };
    const start = () => { if (!paras.length) { paras = collect(); } if (!paras.length) return; dock.classList.add('is-open'); d.body.classList.add('az-dock-open'); playing = true; setDuck(true); loadVoices(); ui(); if (!chunks.length) goPara(pi, true); else { speechSynthesis.cancel(); speak(); } setMedia(); };
    const pause = () => { playing = false; token++; speechSynthesis.cancel(); setDuck(false); ui(); };
    const stop = (done) => { playing = false; token++; speechSynthesis.cancel(); setDuck(false); clearHL(); dock.classList.remove('is-open'); d.body.classList.remove('az-dock-open'); pi = 0; ci = 0; chunks = []; ui(); if (done) toggle.focus(); };
    function setMedia() { try { if (!('mediaSession' in navigator)) return; navigator.mediaSession.metadata = new MediaMetadata({ title: ($('h1') || {}).textContent || 'The Antizionist Glossary', artist: 'Kile Jones', album: 'The Antizionist Glossary' }); navigator.mediaSession.setActionHandler('play', start); navigator.mediaSession.setActionHandler('pause', pause); navigator.mediaSession.setActionHandler('nexttrack', () => goPara(pi + 1, true)); navigator.mediaSession.setActionHandler('previoustrack', () => goPara(pi - 1, true)); } catch (e) {} }

    toggle.addEventListener('click', () => { paras = collect(); pi = 0; chunks = []; start(); });
    playB.addEventListener('click', () => { if (playing) pause(); else { playing = true; setDuck(true); ui(); if (!chunks.length) goPara(pi, true); else speak(); } });
    q('.az-prev').addEventListener('click', () => { playing = true; setDuck(true); goPara(pi - 1, true); });
    q('.az-next').addEventListener('click', () => { playing = true; setDuck(true); goPara(pi + 1, true); });
    q('.az-close').addEventListener('click', () => stop(true));
    speedS.addEventListener('change', () => { st.rate = Number(speedS.value); save(st); if (playing) { token++; speechSynthesis.cancel(); speak(); } });
    voiceS.addEventListener('change', () => { st.voice = voiceS.value; save(st); if (playing) { token++; speechSynthesis.cancel(); speak(); } });
    d.addEventListener('click', (e) => { if (!dock.classList.contains('is-open')) return; const p = e.target.closest && e.target.closest('p,li'); const i = paras.indexOf(p); if (i >= 0 && !e.target.closest('a,button')) { playing = true; setDuck(true); goPara(i, true); } });
    d.addEventListener('keydown', (e) => { if (!dock.classList.contains('is-open') || /INPUT|SELECT|TEXTAREA|BUTTON|A/.test((e.target.tagName || ''))) { if (e.key === 'Escape' && dock.classList.contains('is-open')) stop(true); return; } if (e.key === 'Escape') stop(true); else if (e.key === ' ') { e.preventDefault(); playB.click(); } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); q('.az-next').click(); } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); q('.az-prev').click(); } });
    if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', loadVoices);
    loadVoices();
    window.addEventListener('beforeunload', () => speechSynthesis.cancel());
    window.addEventListener('pagehide', () => { speechSynthesis.cancel(); setDuck(false); });
  };

  const boot = () => { addSiteLink(); addProgress(); addReveal(); addHomeMotion(); fadeMusic(); initReaderV2(); };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
