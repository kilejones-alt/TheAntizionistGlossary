/* v44 cursor orb trail + text lift */
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

    let liftedText = null;
    const liftSelector = 'a, button, h1, h2, h3, h4, p, li, blockquote, figcaption, .entry-title, .entry-body, .entry-content, .side-panel, .term-card, .lead, .kicker';

    function clearLift() {
      if (liftedText) liftedText.classList.remove('az-cursor-lift');
      liftedText = null;
    }

    function liftTextAt(nx, ny) {
      const el = document.elementFromPoint(nx, ny);
      const target = el && el.closest ? el.closest(liftSelector) : null;
      if (!target || target === document.body || target === document.documentElement || target.id === 'gold-cursor' || target.id === 'cursor-sparks' || target.closest('#gold-cursor, #cursor-sparks, .sparkle-field')) {
        clearLift();
        return;
      }
      if (liftedText && liftedText !== target) liftedText.classList.remove('az-cursor-lift');
      liftedText = target;
      liftedText.classList.add('az-cursor-lift');
    }

    function makeSpark(now = performance.now()) {
      if (x < 0 || y < 0 || now - lastSpark < 46) return;
      lastSpark = now;
      const dot = document.createElement('span');
      dot.className = 'cursor-spark cursor-orb';
      const size = 2.2 + Math.random() * 4.4;
      dot.style.left = `${x + (Math.random() * 10 - 5)}px`;
      dot.style.top = `${y + (Math.random() * 10 - 5)}px`;
      dot.style.setProperty('--orb-size', `${size.toFixed(2)}px`);
      dot.style.setProperty('--trail-x', `${Math.random() * 22 - 11}px`);
      dot.style.setProperty('--trail-y', `${-6 - Math.random() * 18}px`);
      dot.style.setProperty('--trail-spin', `${Math.random() * 60 - 30}deg`);
      sparks.appendChild(dot);
      setTimeout(() => dot.remove(), 1150);
    }

    function move(event) {
      place(event.clientX, event.clientY);
      makeSpark();
      liftTextAt(event.clientX, event.clientY);
    }
    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('mouseleave', clearLift, { passive: true });
    window.addEventListener('blur', clearLift, { passive: true });

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

    const isHebrew = document.documentElement.lang === 'he' || document.body.dataset.siteLang === 'he' || document.documentElement.dir === 'rtl';
    const baseLabel = isHebrew ? 'מוזיקה' : 'Music';
    const playingLabel = isHebrew ? 'מוזיקה ◦' : 'Music ◦';
    const blockedLabel = isHebrew ? 'מוזיקה — לחצו שוב' : 'Music — click again';

    const audio = document.createElement('audio');
    audio.id = 'lumen-site-audio';
    audio.src = 'audio/lumen-nocturne.mp3';
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = 0.42;
    audio.setAttribute('playsinline', '');
    document.body.appendChild(audio);

    let playing = false;
    let firstClickArmed = true;

    function setPlayingState(on) {
      playing = on;
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      button.textContent = on ? playingLabel : baseLabel;
      document.body.classList.toggle('music-playing', on);
    }

    async function start() {
      try {
        await audio.play();
        setPlayingState(true);
      } catch (e) {
        button.textContent = blockedLabel;
        setPlayingState(false);
      }
    }

    function stop() {
      audio.pause();
      setPlayingState(false);
    }

    button.textContent = baseLabel;
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      firstClickArmed = false;
      if (playing) stop();
      else start();
    });

    document.addEventListener('click', (event) => {
      if (!firstClickArmed || playing) return;
      if (event.target && event.target.closest && event.target.closest('#music-toggle')) return;
      firstClickArmed = false;
      start();
    }, { once: true, capture: true });

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
    var heFiles=new Set(["about-he.html", "anti-zionism-he.html", "antizionism-october-7-2023-present-he.html", "anti-zionism-1948-october-6-2023-he.html", "anti-zionism-1880-1947-he.html", "apartheid-he.html", "apartheid-wall-he.html", "blood-on-your-hands-he.html", "boycott-divestment-sanctions-he.html", "butcher-of-gaza-he.html", "by-any-means-necessary-he.html", "ceasefire-now-he.html", "child-killers-he.html", "collective-punishment-he.html", "colonizer-he.html", "complicity-he.html", "contact-he.html", "death-to-the-idf-he.html", "decolonization-he.html", "end-the-blockade-he.html", "end-the-occupation-he.html", "ethnic-cleansing-he.html", "ethnostate-he.html", "free-palestine-he.html", "from-the-river-to-the-sea-he.html", "genocide-he.html", "globalize-the-intifada-he.html", "glossary-he.html", "hasbara-he.html", "hebrew.html", "image-credits-he.html", "imperial-state-he.html", "index-he.html", "index-he.html", "intifada-he.html", "introduction-he.html", "israeli-war-machine-he.html", "jewish-supremacy-he.html", "liberation-he.html", "method-he.html", "modern-day-nazis-he.html", "nazi-state-he.html", "normalization-he.html", "occupation-he.html", "open-air-prison-he.html", "pinkwashing-he.html", "resistance-he.html", "resources-he.html", "settler-colonialism-he.html", "stop-the-genocide-he.html", "white-settler-he.html", "zio-zionazi-he.html", "zionism-he.html", "zionism-is-racism-he.html", "zionist-entity-he.html"]);
    document.querySelectorAll('a[href]').forEach(function(a){
      var href=a.getAttribute('href');
      var label=(a.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      // Do not rewrite the explicit language switch back to Hebrew.
      // Hebrew pages must keep their internal links Hebrew, but the English switch must go to English.
      if(a.classList && (a.classList.contains('english-switch') || a.classList.contains('language-switch'))) return;
      if(label==='english' || label==='en' || a.getAttribute('lang')==='en' || a.getAttribute('dir')==='ltr') return;
      if(!href || href[0]==='#' || href.indexOf('http://')===0 || href.indexOf('https://')===0 || href.indexOf('mailto:')===0) return;
      var parts=href.split('#'), base=parts[0], hash=parts[1]?'#'+parts[1]:'';
      base=base.replace(/(-he)+\.html$/,'-he.html');
      if(base==='index.html') base='index-he.html';
      else if(base.slice(-5)==='.html' && base.slice(-8)!=='-he.html') { var cand=base.replace(/\.html$/,'-he.html'); if(heFiles.has(cand)) base=cand; }
      if(base) a.setAttribute('href',base+hash);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();

/* v47: stronger cursor text glow, real-audio click start, start-page clickthrough, speech reader + teleprompter */
(function(){
  function isHebrewPage(){
    return document.documentElement.lang === 'he' || document.documentElement.dir === 'rtl' || (document.body && document.body.dataset.siteLang === 'he') || (document.body && document.body.classList.contains('hebrew-page'));
  }
  function currentPage(){
    return (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }
  function isReaderPage(){
    var page=currentPage();
    return !!(document.querySelector('.entry-main') || /^introduction(?:-he)?\.html$/.test(page));
  }
  function pageTextRoot(){
    return document.querySelector('.entry-main') || document.querySelector('main.article') || document.querySelector('main.narrow.article') || document.querySelector('main');
  }
  function getReadableText(){
    var root=pageTextRoot();
    if(!root) return '';
    var clone=root.cloneNode(true);
    clone.querySelectorAll('script,style,nav,footer,.entry-image,.hero-figure,.head-image,.az-reader-panel,.az-teleprompter,.entry-side,.side-panel,.sparkle-field,#gold-cursor,#cursor-sparks').forEach(function(n){n.remove();});
    var parts=[];
    clone.querySelectorAll('h1,h2,h3,p,li,blockquote').forEach(function(n){
      var t=(n.textContent||'').replace(/\s+/g,' ').trim();
      if(t) parts.push(t);
    });
    if(!parts.length){
      var t=(clone.textContent||'').replace(/\s+/g,' ').trim();
      if(t) parts.push(t);
    }
    return parts.join('\n\n');
  }
  function ensureBetterMusic(){
    var isHe=isHebrewPage();
    var button=document.getElementById('music-toggle');
    if(!button) return;
    var audio=document.getElementById('lumen-site-audio');
    if(!audio){
      audio=document.createElement('audio');
      audio.id='lumen-site-audio';
      audio.src='audio/lumen-nocturne.mp3';
      audio.preload='auto';
      audio.loop=true;
      audio.setAttribute('playsinline','');
      document.body.appendChild(audio);
    }
    audio.src = audio.getAttribute('src') || 'audio/lumen-nocturne.mp3';
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.46;
    var base=isHe?'מוזיקה':'Music';
    var on=isHe?'מוזיקה ◦':'Music ◦';
    var tryAgain=isHe?'מוזיקה — לחצו שוב':'Music — click again';
    var started=false;
    function set(onNow){
      started=onNow;
      button.textContent=onNow?on:base;
      button.setAttribute('aria-pressed',onNow?'true':'false');
      document.body.classList.toggle('music-playing',onNow);
      try{ sessionStorage.setItem('azMusicWanted', onNow?'1':'0'); }catch(e){}
    }
    function play(){
      var p=audio.play();
      if(p && p.then){
        p.then(function(){set(true);}).catch(function(){button.textContent=tryAgain; set(false);});
      } else set(true);
    }
    function pause(){ audio.pause(); set(false); }
    button.onclick=function(e){
      e.preventDefault(); e.stopPropagation();
      if(audio.paused) play(); else pause();
    };
    function firstStart(e){
      if(started || !audio.paused) return;
      if(e && e.target && e.target.closest && e.target.closest('.az-reader-panel,.az-teleprompter')) return;
      play();
    }
    ['pointerdown','mousedown','touchstart','keydown','click'].forEach(function(type){
      document.addEventListener(type, firstStart, {capture:true, passive:true});
    });
  }
  function makeHomeStartClickable(){
    if(!document.body || !document.body.classList.contains('home')) return;
    var target=document.querySelector('.home-installation') || document.querySelector('.home-stage');
    if(!target || target.dataset.azStartReady==='1') return;
    target.dataset.azStartReady='1';
    target.classList.add('az-start-clickzone');
    target.setAttribute('title', isHebrewPage() ? 'לחצו כדי להתחיל' : 'Click to start');
    target.addEventListener('click', function(e){
      if(e.target && e.target.closest && e.target.closest('a,button,input,textarea,select,#music-toggle,.az-reader-panel,.az-teleprompter')) return;
      location.href = isHebrewPage() ? 'introduction-he.html' : 'introduction.html';
    });
    var cue=document.createElement('div');
    cue.className='az-start-cue';
    cue.textContent=isHebrewPage()?'לחצו בכל מקום כדי להתחיל':'Click anywhere to start';
    target.appendChild(cue);
  }
  function makeReader(){
    if(!isReaderPage() || !('speechSynthesis' in window)) return;
    if(document.querySelector('.az-reader-panel')) return;
    var isHe=isHebrewPage();
    var panel=document.createElement('div');
    panel.className='az-reader-panel';
    panel.setAttribute('aria-label', isHe?'קריאה בקול':'Read aloud');
    panel.innerHTML = '<button type="button" data-reader="play">'+(isHe?'הקראה':'Read')+'</button><button type="button" data-reader="pause">'+(isHe?'השהה':'Pause')+'</button><button type="button" data-reader="stop">'+(isHe?'עצור':'Stop')+'</button><button type="button" data-reader="prompter">'+(isHe?'טלפרומפטר':'Teleprompter')+'</button>';
    document.body.appendChild(panel);
    var overlay=document.createElement('div');
    overlay.className='az-teleprompter';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML='<div class="az-teleprompter-card"><button type="button" class="az-teleprompter-close">×</button><div class="az-teleprompter-text"></div></div>';
    document.body.appendChild(overlay);
    var prompterText=overlay.querySelector('.az-teleprompter-text');
    var close=overlay.querySelector('.az-teleprompter-close');
    var utter=null, speaking=false, paused=false, scrollTimer=null;
    function stopScroll(){ if(scrollTimer){ clearInterval(scrollTimer); scrollTimer=null; } }
    function startScroll(text){
      stopScroll();
      var words=Math.max(1, text.split(/\s+/).length);
      var duration=Math.max(35, words/2.15); // approx. 129 words per minute
      var start=Date.now();
      var max=0;
      function tick(){
        if(paused) return;
        max=Math.max(0, prompterText.scrollHeight - prompterText.clientHeight);
        var p=Math.min(1, (Date.now()-start)/(duration*1000));
        prompterText.scrollTop=max*p;
        if(p>=1) stopScroll();
      }
      scrollTimer=setInterval(tick, 120);
      tick();
    }
    function buildPrompter(text){
      prompterText.innerHTML='';
      text.split(/\n\n+/).forEach(function(p){
        var div=document.createElement('p');
        div.textContent=p;
        prompterText.appendChild(div);
      });
      prompterText.scrollTop=0;
    }
    function showPrompter(){
      var text=getReadableText();
      buildPrompter(text);
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden','false');
      return text;
    }
    function hidePrompter(){ overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); stopScroll(); }
    function stopSpeech(){
      try{ speechSynthesis.cancel(); }catch(e){}
      speaking=false; paused=false; utter=null; stopScroll();
      panel.classList.remove('is-reading','is-paused');
    }
    function speak(withPrompter){
      var text=withPrompter ? showPrompter() : getReadableText();
      if(!text) return;
      stopSpeech();
      utter=new SpeechSynthesisUtterance(text);
      utter.lang=isHe?'he-IL':'en-US';
      utter.rate=0.92;
      utter.pitch=0.96;
      utter.onstart=function(){ speaking=true; paused=false; panel.classList.add('is-reading'); panel.classList.remove('is-paused'); if(withPrompter) startScroll(text); };
      utter.onend=function(){ speaking=false; panel.classList.remove('is-reading','is-paused'); stopScroll(); };
      utter.onerror=function(){ speaking=false; panel.classList.remove('is-reading','is-paused'); stopScroll(); };
      speechSynthesis.speak(utter);
    }
    panel.addEventListener('click', function(e){
      var b=e.target.closest('button[data-reader]'); if(!b) return;
      var action=b.dataset.reader;
      if(action==='play') speak(false);
      if(action==='prompter') speak(true);
      if(action==='pause'){
        if(speaking && !paused){ speechSynthesis.pause(); paused=true; panel.classList.add('is-paused'); }
        else if(speaking && paused){ speechSynthesis.resume(); paused=false; panel.classList.remove('is-paused'); }
      }
      if(action==='stop') stopSpeech();
    });
    close.addEventListener('click', function(){ stopSpeech(); hidePrompter(); });
    overlay.addEventListener('click', function(e){ if(e.target===overlay){ stopSpeech(); hidePrompter(); } });
    window.addEventListener('beforeunload', stopSpeech);
  }
  function reinforceTextGlow(){
    document.body.classList.add('az-v47-text-glow-ready');
  }
  function run(){
    ensureBetterMusic();
    makeHomeStartClickable();
    makeReader();
    reinforceTextGlow();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();

