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

  function initReader(){
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


/* Shared history integration: English entries only; original article text is unchanged. */
(function(){if(document.documentElement.lang!=="en")return;var s=document.createElement("script");s.src="history-display.js?v=1";document.body.appendChild(s);})();
