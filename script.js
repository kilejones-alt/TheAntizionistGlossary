/* v51 clean site script: music tab only, reader body only, no line lift, safe letter hover */
(function(){
  'use strict';

  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function pageFile(){ return (location.pathname.split('/').pop() || 'index.html').toLowerCase(); }
  function isHebrew(){
    return document.documentElement.lang === 'he' || document.documentElement.dir === 'rtl' ||
      (document.body && (document.body.dataset.siteLang === 'he' || document.body.classList.contains('hebrew-page')));
  }

  function setupSearch(){
    var search = $('#azSearch');
    if (!search) return;
    search.addEventListener('input', function(){
      var value = (search.value || '').toLowerCase();
      $all('.term-list li').forEach(function(li){
        li.style.display = (li.textContent || '').toLowerCase().indexOf(value) !== -1 ? '' : 'none';
      });
    });
  }

  function lockHomepageLanguage(){
    if (!document.body || !document.body.classList.contains('home')) return;
    var file = pageFile();
    var hardHe = file === 'index-he.html' || document.documentElement.lang === 'he' || document.body.dataset.siteLang === 'he' || document.body.classList.contains('hebrew-page');
    var hardEn = (file === 'index.html' || file === '') && !hardHe;
    if (hardHe) {
      document.documentElement.lang = 'he';
      document.documentElement.dir = 'rtl';
      document.body.dataset.siteLang = 'he';
      document.body.classList.add('hebrew-page');
      document.body.classList.remove('english-page');
    } else if (hardEn) {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
      document.body.dataset.siteLang = 'en';
      document.body.classList.add('english-page');
      document.body.classList.remove('hebrew-page');
    }
  }

  function normalizeGlossaryIntro(){
    var heading = $all('h1,h2').find(function(el){ return /antizionist glossary|glossary/i.test(el.textContent || ''); });
    if (!heading) return;
    var target = 'A directory of terms, slogans, and accusations in modern antizionism.';
    var intro = $all('.lead, .page-head p, .glossary-intro-grid p, main p').find(function(el){
      var t = (el.textContent || '').trim();
      return t && /terms|slogans|accusations|antizionism|anti-zionism|vocabulary|guide/i.test(t);
    });
    if (intro) intro.textContent = target;
  }

  function ensureSparkles(){
    if ($('.sparkle-field')) return;
    var field = document.createElement('div');
    field.className = 'sparkle-field';
    field.setAttribute('aria-hidden', 'true');
    var zones = [[3,24],[76,97],[25,33],[67,75]];
    for (var i = 0; i < 62; i++) {
      var zone = i < 14 ? zones[0] : i < 28 ? zones[1] : zones[2 + (i % 2)];
      var s = document.createElement('span');
      s.className = 'sparkle';
      var left = zone[0] + Math.random() * (zone[1] - zone[0]);
      var y = 5 + Math.random() * 104;
      var size = (i % 11 === 0 ? 10.5 + Math.random() * 3.0 : 4.8 + Math.random() * 5.0).toFixed(2);
      var dur = (46 + Math.random() * 30).toFixed(2);
      var delay = (-Math.random() * Number(dur)).toFixed(2);
      var drift = (-76 + Math.random() * 152).toFixed(1);
      var op = (0.72 + Math.random() * 0.28).toFixed(2);
      var sway = (26 + Math.random() * 44).toFixed(1);
      var twinkle = (2.2 + Math.random() * 2.6).toFixed(2);
      var crackle = (1.15 + Math.random() * 1.1).toFixed(2);
      s.setAttribute('style', 'left:'+left.toFixed(2)+'%;--y:'+y.toFixed(2)+'vh;--size:'+size+'px;--dur:'+dur+'s;--delay:'+delay+'s;--drift:'+drift+'px;--sway:'+sway+'px;--op:'+op+';--twinkle:'+twinkle+'s;--crackle:'+crackle+'s');
      field.appendChild(s);
    }
    document.body.prepend(field);
  }

  function ensureCursor(){
    var cursor = $('#gold-cursor');
    var sparks = $('#cursor-sparks');
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
    var x = -120, y = -120, lastSpark = 0;
    var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (fine) {
      document.body.classList.add('custom-cursor-ready');
      document.documentElement.classList.add('custom-cursor-ready');
      document.documentElement.style.cursor = 'none';
      document.body.style.cursor = 'none';
    }
    function makeSpark(now){
      now = now || performance.now();
      if (x < 0 || y < 0 || now - lastSpark < 46) return;
      lastSpark = now;
      var dot = document.createElement('span');
      dot.className = 'cursor-spark cursor-orb';
      var size = 2.2 + Math.random() * 4.4;
      dot.style.left = (x + (Math.random() * 10 - 5)) + 'px';
      dot.style.top = (y + (Math.random() * 10 - 5)) + 'px';
      dot.style.setProperty('--orb-size', size.toFixed(2) + 'px');
      dot.style.setProperty('--trail-x', (Math.random() * 22 - 11) + 'px');
      dot.style.setProperty('--trail-y', (-6 - Math.random() * 18) + 'px');
      dot.style.setProperty('--trail-spin', (Math.random() * 60 - 30) + 'deg');
      sparks.appendChild(dot);
      setTimeout(function(){ dot.remove(); }, 1150);
    }
    function move(event){
      x = event.clientX; y = event.clientY;
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
      document.body.classList.add('custom-cursor-ready');
      document.documentElement.classList.add('custom-cursor-ready');
      makeSpark();
    }
    document.addEventListener('pointermove', move, {passive:true});
    document.addEventListener('mousemove', move, {passive:true});
  }

  function ensureMusicButton(){
    var button = $('#music-toggle');
    if (button) return button;
    var nav = $('.language-nav, .gallery-topbar nav, .site-nav, nav');
    if (!nav) return null;
    button = document.createElement('button');
    button.id = 'music-toggle';
    button.className = 'music-toggle';
    button.type = 'button';
    button.textContent = isHebrew() ? 'מוזיקה' : 'Music';
    var divider = document.createElement('span');
    divider.className = 'nav-divider';
    divider.setAttribute('aria-hidden','true');
    divider.textContent = '|';
    nav.appendChild(divider);
    nav.appendChild(button);
    return button;
  }

  function setupMusic(){
    return;
    $all('#az-music-start,.az-music-start,.music-start,.start-music').forEach(function(n){ n.remove(); });
    var button = $('#music-toggle') || $('.music-toggle') || $all('button,a').find(function(el){ return /^\s*(music|מוזיקה)\s*$/i.test(el.textContent || ''); });
    if (!button || button.dataset.azV51Music === '1') return;
    button.dataset.azV51Music = '1';
    if (!button.id) button.id = 'music-toggle';
    button.classList.add('music-toggle');
    if (button.tagName.toLowerCase() === 'button') button.type = 'button';
    button.setAttribute('aria-pressed','false');
    button.textContent = isHebrew() ? 'מוזיקה' : 'Music';

    var existing = $('#lumen-site-audio');
    if (existing) existing.remove();
    var audio = document.createElement('audio');
    audio.id = 'lumen-site-audio';
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = 0.70;
    audio.setAttribute('playsinline','');
    audio.setAttribute('webkit-playsinline','');
    document.body.appendChild(audio);

    var basePath = location.pathname.replace(/[^\/]*$/, '');
    var sources = [
      'audio/lumen-nocturne.mp3?v=51',
      './audio/lumen-nocturne.mp3?v=51',
      location.origin + basePath + 'audio/lumen-nocturne.mp3?v=51',
      location.origin + '/TheAntizionistGlossary/audio/lumen-nocturne.mp3?v=51'
    ];
    var sourceIndex = 0;
    function loadSource(){
      if (audio.src !== sources[sourceIndex]) {
        audio.src = sources[sourceIndex];
        try { audio.load(); } catch(e) {}
      }
    }
    function setOn(on){
      document.body.classList.toggle('music-playing', !!on);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      button.textContent = isHebrew() ? 'מוזיקה' : 'Music';
    }
    function play(){
      loadSource();
      audio.muted = false;
      audio.volume = 0.70;
      var p;
      try { p = audio.play(); } catch(e) { setOn(false); return; }
      if (p && p.then) {
        p.then(function(){ setOn(true); }).catch(function(){
          if (sourceIndex < sources.length - 1) { sourceIndex += 1; loadSource(); play(); }
          else setOn(false);
        });
      } else setOn(true);
    }
    function pause(){ try { audio.pause(); } catch(e) {} setOn(false); }
    function toggle(e){
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (audio.paused) play(); else pause();
    }
    button.addEventListener('click', toggle, true);
    button.addEventListener('pointerup', toggle, true);
    audio.addEventListener('play', function(){ setOn(true); });
    audio.addEventListener('pause', function(){ setOn(false); });
    audio.addEventListener('ended', function(){ setOn(false); });
    audio.addEventListener('error', function(){
      if (sourceIndex < sources.length - 1) { sourceIndex += 1; loadSource(); }
      setOn(false);
    });
    setOn(false);
  }

  function makeHomeStartClickable(){
    if (!document.body || !document.body.classList.contains('home')) return;
    $all('.az-start-cue').forEach(function(n){ n.remove(); });
    var target = $('.home-installation') || $('.home-stage');
    if (!target || target.dataset.azStartReady === '1') return;
    target.dataset.azStartReady = '1';
    target.classList.add('az-start-clickzone');
    target.addEventListener('click', function(e){
      if (e.target && e.target.closest && e.target.closest('a,button,input,textarea,select,#music-toggle,.az-reader-panel,.az-teleprompter')) return;
      location.href = isHebrew() ? 'introduction-he.html' : 'introduction.html';
    });
  }

  function hebrewLinkLock(){
    if (!document.body || document.body.dataset.siteLang !== 'he') return;
    var heFiles = new Set(['about-he.html','anti-zionism-he.html','antizionism-october-7-2023-present-he.html','anti-zionism-1948-october-6-2023-he.html','anti-zionism-1880-1947-he.html','apartheid-he.html','apartheid-wall-he.html','blood-on-your-hands-he.html','boycott-divestment-sanctions-he.html','butcher-of-gaza-he.html','by-any-means-necessary-he.html','ceasefire-now-he.html','child-killers-he.html','collective-punishment-he.html','colonizer-he.html','complicity-he.html','contact-he.html','death-to-the-idf-he.html','decolonization-he.html','end-the-blockade-he.html','end-the-occupation-he.html','ethnic-cleansing-he.html','ethnostate-he.html','free-palestine-he.html','from-the-river-to-the-sea-he.html','genocide-he.html','globalize-the-intifada-he.html','glossary-he.html','hasbara-he.html','hebrew.html','image-credits-he.html','imperial-state-he.html','index-he.html','intifada-he.html','introduction-he.html','israeli-war-machine-he.html','jewish-supremacy-he.html','liberation-he.html','method-he.html','modern-day-nazis-he.html','nazi-state-he.html','normalization-he.html','occupation-he.html','open-air-prison-he.html','pinkwashing-he.html','resistance-he.html','resources-he.html','settler-colonialism-he.html','stop-the-genocide-he.html','white-settler-he.html','zio-zionazi-he.html','zionism-he.html','zionism-is-racism-he.html','zionist-entity-he.html']);
    $all('a[href]').forEach(function(a){
      var href = a.getAttribute('href');
      var label = (a.textContent || '').replace(/\s+/g,' ').trim().toLowerCase();
      if (a.classList && (a.classList.contains('english-switch') || a.classList.contains('language-switch'))) return;
      if (label === 'english' || label === 'en' || a.getAttribute('lang') === 'en' || a.getAttribute('dir') === 'ltr') return;
      if (!href || href[0] === '#' || /^https?:/i.test(href) || /^mailto:/i.test(href)) return;
      var parts = href.split('#'), base = parts[0], hash = parts[1] ? '#' + parts[1] : '';
      base = base.replace(/(-he)+\.html$/,'-he.html');
      if (base === 'index.html') base = 'index-he.html';
      else if (/\.html$/.test(base) && !/-he\.html$/.test(base)) {
        var cand = base.replace(/\.html$/,'-he.html');
        if (heFiles.has(cand)) base = cand;
      }
      if (base) a.setAttribute('href', base + hash);
    });
  }

  function contentPage(){ return !!($('.entry-main') || /^introduction(?:-he)?\.html$/.test(pageFile())); }
  function contentRoot(){ return $('.entry-main') || $('main.article') || $('main.narrow.article') || $('main'); }
  function collectReaderSegments(){
    var root = contentRoot();
    if (!root) return [];
    var nodes = $all('h2,h3,h4,p,li,blockquote', root);
    var segments = [];
    nodes.forEach(function(n){
      if (n.closest('nav,footer,.entry-side,.side-panel,.az-reader-panel,.az-teleprompter,.entry-image,.hero-figure,.head-image,.sparkle-field')) return;
      if (n.classList.contains('entry-label') || n.classList.contains('entry-phrase')) return;
      var t = (n.textContent || '').replace(/\s+/g,' ').trim();
      if (!t) return;
      if (/^introduction$/i.test(t) || t === 'מבוא') return;
      segments.push(t);
    });
    return segments;
  }

  var voiceCache = [];
  function refreshVoices(){ try { voiceCache = speechSynthesis.getVoices() || []; } catch(e) { voiceCache = []; } }
  function chooseVoice(lang){
    if (!('speechSynthesis' in window)) return null;
    refreshVoices();
    var target = lang.indexOf('he') === 0 ? 'he' : 'en';
    var voices = voiceCache.filter(function(v){ return (v.lang || '').toLowerCase().indexOf(target) === 0; });
    if (!voices.length) voices = voiceCache;
    var preferred = target === 'he' ? /(google|microsoft|hebrew|hila|carmit|asaf|natural|online)/i : /(natural|online|aria|jenny|samantha|serena|daniel|google|microsoft|zira|guy|ava|alloy)/i;
    return voices.find(function(v){ return preferred.test(v.name || ''); }) || voices[0] || null;
  }

  function setupReader(){
    if (!contentPage() || !('speechSynthesis' in window)) return;
    $all('.az-reader-panel,.az-teleprompter').forEach(function(n){ n.remove(); });
    try { speechSynthesis.cancel(); } catch(e) {}
    var he = isHebrew();
    var panel = document.createElement('div');
    panel.className = 'az-reader-panel az-reader-collapsed';
    panel.innerHTML = '<button type="button" class="az-reader-toggle" data-reader="toggle">'+(he?'הקראה':'Reader')+'</button><div class="az-reader-controls" aria-hidden="true"><button type="button" data-reader="play">'+(he?'הקרא':'Read')+'</button><button type="button" data-reader="pause">'+(he?'השהה':'Pause')+'</button><button type="button" data-reader="stop">'+(he?'עצור':'Stop')+'</button><button type="button" data-reader="prompter">'+(he?'מסך קריאה':'Prompter')+'</button></div>';
    document.body.appendChild(panel);
    var controls = $('.az-reader-controls', panel);
    var overlay = document.createElement('div');
    overlay.className = 'az-teleprompter';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = '<div class="az-teleprompter-card"><button type="button" class="az-teleprompter-close">×</button><div class="az-teleprompter-text"></div></div>';
    document.body.appendChild(overlay);
    var textBox = $('.az-teleprompter-text', overlay);
    var close = $('.az-teleprompter-close', overlay);
    var utter = null, paused = false, timer = null, wordSpans = [];
    function clearTimer(){ if (timer) { clearInterval(timer); timer = null; } }
    function clearHighlight(){ wordSpans.forEach(function(w){ w.classList.remove('az-reading-now'); }); }
    function fullText(){ return collectReaderSegments().join('\n\n'); }
    function buildPrompter(){
      var segments = collectReaderSegments();
      textBox.innerHTML = '';
      wordSpans = [];
      var absolute = 0;
      segments.forEach(function(seg){
        var p = document.createElement('p');
        (seg.match(/\S+|\s+/g) || []).forEach(function(part){
          if (/^\s+$/.test(part)) { p.appendChild(document.createTextNode(part)); absolute += part.length; return; }
          var span = document.createElement('span');
          span.className = 'az-read-word';
          span.dataset.start = String(absolute);
          span.dataset.end = String(absolute + part.length);
          span.textContent = part;
          wordSpans.push(span);
          p.appendChild(span);
          absolute += part.length;
        });
        textBox.appendChild(p);
        absolute += 2;
      });
      textBox.scrollTop = 0;
    }
    function openPrompter(){ buildPrompter(); overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false'); }
    function closePrompter(){ overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); clearTimer(); clearHighlight(); }
    function highlightAtChar(charIndex){
      if (!wordSpans.length) return;
      var span = wordSpans.find(function(s){ return Number(s.dataset.start) <= charIndex && Number(s.dataset.end) >= charIndex; });
      if (!span) return;
      clearHighlight();
      span.classList.add('az-reading-now');
      span.scrollIntoView({block:'center', inline:'nearest', behavior:'smooth'});
    }
    function fallbackHighlight(){
      clearTimer();
      var i = 0;
      timer = setInterval(function(){
        if (paused || !wordSpans.length) return;
        clearHighlight();
        var span = wordSpans[Math.min(i, wordSpans.length - 1)];
        if (span) { span.classList.add('az-reading-now'); span.scrollIntoView({block:'center', inline:'nearest', behavior:'smooth'}); }
        i += 1;
        if (i >= wordSpans.length) clearTimer();
      }, 430);
    }
    function stop(){
      try { speechSynthesis.cancel(); } catch(e) {}
      utter = null; paused = false; clearTimer(); clearHighlight();
      panel.classList.remove('is-reading','is-paused');
    }
    function speak(prompter){
      var text = fullText();
      if (!text) return;
      stop();
      if (prompter) openPrompter();
      utter = new SpeechSynthesisUtterance(text);
      utter.lang = he ? 'he-IL' : 'en-US';
      utter.rate = he ? 0.86 : 0.82;
      utter.pitch = he ? 0.96 : 0.92;
      var voice = chooseVoice(utter.lang);
      if (voice) utter.voice = voice;
      utter.onstart = function(){ panel.classList.add('is-reading'); panel.classList.remove('is-paused'); if (prompter) fallbackHighlight(); };
      utter.onboundary = function(e){ if (prompter && typeof e.charIndex === 'number') highlightAtChar(e.charIndex); };
      utter.onend = function(){ panel.classList.remove('is-reading','is-paused'); clearTimer(); };
      utter.onerror = function(){ panel.classList.remove('is-reading','is-paused'); clearTimer(); };
      try { speechSynthesis.speak(utter); } catch(e) {}
    }
    panel.addEventListener('click', function(e){
      var b = e.target.closest('button[data-reader]');
      if (!b) return;
      var action = b.dataset.reader;
      if (action === 'toggle') {
        var open = panel.classList.toggle('az-reader-open');
        panel.classList.toggle('az-reader-collapsed', !open);
        controls.setAttribute('aria-hidden', open ? 'false' : 'true');
      }
      if (action === 'play') speak(false);
      if (action === 'prompter') speak(true);
      if (action === 'pause') {
        if (paused) { speechSynthesis.resume(); paused = false; panel.classList.remove('is-paused'); }
        else { speechSynthesis.pause(); paused = true; panel.classList.add('is-paused'); }
      }
      if (action === 'stop') stop();
    });
    close.addEventListener('click', function(){ stop(); closePrompter(); });
    window.addEventListener('beforeunload', stop);
  }

  function wrapLettersSafely(){
    return;
    if (document.body.dataset.azV51Letters === '1') return;
    document.body.dataset.azV51Letters = '1';
    var selector = 'main h1, main h2, main h3, main h4, main p, main li, main blockquote, .term-list a, .term-list span, .lead';
    var exclude = 'script,style,textarea,input,select,button,.az-reader-panel,.az-teleprompter,#gold-cursor,#cursor-sparks,.sparkle-field,.entry-image,.hero-figure,.head-image,nav,footer';
    $all(selector).forEach(function(root){
      if (!root || root.closest(exclude) || root.dataset.azLetterized === '1') return;
      root.dataset.azLetterized = '1';
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node){
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (node.parentElement && node.parentElement.closest(exclude + ', .az-letter, .az-word')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function(node){
        var text = node.nodeValue;
        var frag = document.createDocumentFragment();
        var parts = text.match(/\S+|\s+/g) || [];
        parts.forEach(function(part){
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var word = document.createElement('span');
          word.className = 'az-word';
          Array.from(part).forEach(function(ch){
            var letter = document.createElement('span');
            letter.className = 'az-letter';
            letter.textContent = ch;
            word.appendChild(letter);
          });
          frag.appendChild(word);
        });
        node.parentNode.replaceChild(frag, node);
      });
    });
    document.body.classList.add('az-v51-letter-hover-ready');
  }

  function run(){
    lockHomepageLanguage();
    setupSearch();
    normalizeGlossaryIntro();
    ensureSparkles();
    ensureCursor();
    setupMusic();
    makeHomeStartClickable();
    hebrewLinkLock();
    setupReader();
    wrapLettersSafely();
  }

  if ('speechSynthesis' in window) {
    refreshVoices();
    try { speechSynthesis.onvoiceschanged = refreshVoices; } catch(e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  window.addEventListener('pageshow', setupMusic);
})();


/* v52 hard fixes: cache-busted music tab, safe per-letter movement, no click-anywhere audio prompts */
(function(){
  'use strict';
  var AUDIO_PATH = 'audio/lumen-nocturne.mp3?v=53';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  function $(sel, root){ return (root||document).querySelector(sel); }
  function $$ (sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function isHebrew(){ return document.documentElement.dir === 'rtl' || document.body.classList.contains('hebrew-page') || document.documentElement.lang === 'he'; }

  function ensureOnlyMusicTab(){
    $$('#az-music-start,.az-music-start,.music-start,.start-music,.az-start-cue').forEach(function(el){ el.remove(); });
    var nav = $('.gallery-topbar nav') || $('.language-nav') || $('nav');
    var buttons = $$('.music-toggle,#music-toggle').concat($$('button,a').filter(function(el){ return /^\s*(music|מוזיקה)\s*$/i.test(el.textContent || ''); }));
    var btn = buttons[0];
    if(!btn && nav){
      var divider = document.createElement('span'); divider.className='nav-divider'; divider.textContent='|';
      btn = document.createElement('button'); btn.id='music-toggle'; btn.className='music-toggle'; btn.type='button'; btn.textContent='Music';
      nav.appendChild(divider); nav.appendChild(btn);
    }
    buttons.slice(1).forEach(function(extra){ if(extra !== btn && extra.id === 'music-toggle') extra.removeAttribute('id'); });
    if(btn){
      btn.id='music-toggle'; btn.classList.add('music-toggle'); if(btn.tagName.toLowerCase()==='button') btn.type='button';
      btn.textContent='Music'; btn.setAttribute('aria-pressed','false');
    }
    return btn;
  }

  function installMusic(){
    var btn = ensureOnlyMusicTab();
    if(!btn) return;
    var old = document.getElementById('lumen-site-audio'); if(old) old.remove();
    var audio = document.createElement('audio');
    audio.id='lumen-site-audio'; audio.preload='auto'; audio.loop=true; audio.volume=.78; audio.src=AUDIO_PATH; audio.setAttribute('playsinline','');
    document.body.appendChild(audio);
    function pressed(on){ btn.setAttribute('aria-pressed', on?'true':'false'); document.body.classList.toggle('music-playing', !!on); }
    function toggle(ev){
      if(ev){ ev.preventDefault(); ev.stopPropagation(); if(ev.stopImmediatePropagation) ev.stopImmediatePropagation(); }
      audio.src = AUDIO_PATH;
      audio.muted=false; audio.volume=.78;
      if(audio.paused){
        var p = audio.play();
        if(p && p.then){ p.then(function(){ pressed(true); }).catch(function(){ pressed(false); }); }
        else pressed(true);
      } else { audio.pause(); pressed(false); }
    }
    btn.addEventListener('click', toggle, true);
    btn.addEventListener('pointerup', function(ev){ if(ev.pointerType === 'touch') toggle(ev); }, true);
    audio.addEventListener('play', function(){ pressed(true); });
    audio.addEventListener('pause', function(){ pressed(false); });
  }

  function safeLetterize(){
    if(document.body.dataset.azV52Letters==='1') return;
    document.body.dataset.azV52Letters='1';
    var selector = 'main h1, main h2, main h3, main h4, main p, main li, main blockquote, .term-list a, .entry-phrase, .lead';
    var reject = 'script,style,textarea,input,select,button,nav,footer,.az-reader-panel,.az-teleprompter,#gold-cursor,#cursor-sparks,.sparkle-field,.entry-image,.intro-logo-blend,.az-letter,.az-word';
    $$(selector).forEach(function(root){
      if(!root || root.closest(reject) || root.dataset.azV52Letterized==='1') return;
      root.dataset.azV52Letterized='1';
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode:function(node){
        if(!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if(node.parentElement && node.parentElement.closest(reject)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }});
      var nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function(node){
        var frag = document.createDocumentFragment();
        Array.from(node.nodeValue).forEach(function(ch){
          if(/\s/.test(ch)){ frag.appendChild(document.createTextNode(ch)); return; }
          var span=document.createElement('span'); span.className='az-letter'; span.textContent=ch; frag.appendChild(span);
        });
        if(node.parentNode) node.parentNode.replaceChild(frag,node);
      });
    });
    document.body.classList.add('az-v52-letter-hover-ready');
  }

  function keepReaderBodyOnly(){
    // Keeps existing reader, but removes duplicate title text from speech source by marking title/eyebrow as skipped.
    $$('.entry-label,.eyebrow,main > h1,main > .intro-logo-blend').forEach(function(el){ el.setAttribute('data-reader-skip','1'); });
  }

  ready(function(){
    ensureOnlyMusicTab();
    installMusic();
    keepReaderBodyOnly();
    safeLetterize();
  });
  window.addEventListener('pageshow', function(){ ensureOnlyMusicTab(); installMusic(); });
})();
