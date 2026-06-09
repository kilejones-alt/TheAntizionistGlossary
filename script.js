/* v56 clean script: persistent music state, orb cursor restored, softer trails, reader body-only */
(function(){
  'use strict';
  function $(sel, root){ return (root || document).querySelector(sel); }
  function $$(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var MUSIC_KEY = 'tagMusicOn';
  var TIME_KEY = 'tagMusicTime';

  function setupSearch(){
    var search = $('.search,[data-term-search]');
    if(!search) return;
    search.addEventListener('input', function(){
      var value = (search.value || '').toLowerCase();
      $$('.term-list li').forEach(function(li){
        li.style.display = ((li.textContent || '').toLowerCase().indexOf(value) !== -1) ? '' : 'none';
      });
    });
  }

  function setupMusic(){
    $$('#az-music-start,.az-music-start,.music-start,.start-music,.az-start-cue').forEach(function(el){ el.remove(); });
    var btn = $('#music-toggle') || $('.music-toggle') || $$('button,a').find(function(el){ return /^\s*(music|מוזיקה)\s*$/i.test(el.textContent || ''); });
    if(!btn){
      var nav = $('.gallery-topbar nav');
      if(!nav) return;
      var sep = document.createElement('span'); sep.className='nav-divider'; sep.textContent='|';
      btn = document.createElement('button'); btn.id='music-toggle'; btn.className='music-toggle'; btn.type='button'; btn.textContent='Music'; btn.setAttribute('aria-pressed','false');
      nav.appendChild(sep); nav.appendChild(btn);
    }
    if(btn.tagName.toLowerCase()==='a') btn.setAttribute('role','button');
    if(btn.tagName.toLowerCase()==='button') btn.type='button';
    btn.id='music-toggle'; btn.classList.add('music-toggle'); btn.textContent='Music';

    var old = $('#lumen-site-audio'); if(old) old.remove();
    var audio = document.createElement('audio');
    audio.id='lumen-site-audio'; audio.preload='auto'; audio.loop=true; audio.volume=0.76; audio.setAttribute('playsinline',''); audio.setAttribute('webkit-playsinline','');
    document.body.appendChild(audio);

    var root = location.pathname.indexOf('/TheAntizionistGlossary/') === 0 ? '/TheAntizionistGlossary/' : './';
    var sources = [
      root + 'lumen-nocturne.mp3?v=56',
      root + 'audio/lumen-nocturne.mp3?v=56',
      'lumen-nocturne.mp3?v=56',
      './lumen-nocturne.mp3?v=56',
      'audio/lumen-nocturne.mp3?v=56',
      './audio/lumen-nocturne.mp3?v=56'
    ];
    var i = 0, trying = false;
    function pressed(on){ btn.setAttribute('aria-pressed', on ? 'true' : 'false'); document.body.classList.toggle('music-playing', !!on); }
    function setSrc(){ if(audio.src !== sources[i]){ audio.src = sources[i]; try{ audio.load(); }catch(e){} } }
    function saveState(on){ try{ localStorage.setItem(MUSIC_KEY, on ? '1' : '0'); if(!isNaN(audio.currentTime)) localStorage.setItem(TIME_KEY, String(audio.currentTime || 0)); }catch(e){} }
    function resumeTime(){
      var t = 0; try{ t = parseFloat(localStorage.getItem(TIME_KEY) || '0') || 0; }catch(e){}
      if(t > 0 && isFinite(t)){ try{ audio.currentTime = t; }catch(e){} }
    }
    function play(remember){
      trying = true; setSrc(); audio.muted=false; audio.volume=0.76; resumeTime();
      var p; try{ p = audio.play(); }catch(e){ return next(remember); }
      if(p && p.then){ p.then(function(){ trying=false; pressed(true); if(remember !== false) saveState(true); }).catch(function(){ next(remember); }); }
      else { trying=false; pressed(true); if(remember !== false) saveState(true); }
    }
    function next(remember){
      if(i < sources.length - 1){ i++; setTimeout(function(){ play(remember); }, 80); }
      else { trying=false; pressed(false); btn.title='Audio file was not found or could not be played.'; if(remember !== false) saveState(false); }
    }
    btn.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      if(trying) return;
      if(audio.paused){ i=0; play(true); }
      else { audio.pause(); pressed(false); saveState(false); }
    });
    audio.addEventListener('play', function(){ pressed(true); saveState(true); });
    audio.addEventListener('pause', function(){ pressed(false); if(!document.hidden) saveState(false); });
    audio.addEventListener('timeupdate', function(){ if(!audio.paused) saveState(true); });
    audio.addEventListener('error', function(){ if(trying) next(true); });
    window.addEventListener('beforeunload', function(){ if(!audio.paused) saveState(true); });
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href]');
      if(a && !audio.paused) saveState(true);
    }, true);
    try{
      if(localStorage.getItem(MUSIC_KEY) === '1'){
        i = 0; setTimeout(function(){ play(false); }, 220);
      }
    }catch(e){}
  }

  function wrapLetters(){
    var targets = [];
    if(document.body.classList.contains('home')) targets.push($('.home-copy h1'));
    targets = targets.concat($$('.home-kicker,.home-subtitle,.home-author,.gallery-main h1,.intro-card h2,.term-list a'));
    targets.forEach(function(el){
      if(!el || el.dataset.azWrapped === '1' || el.closest('nav,footer,button')) return;
      var text = el.textContent;
      if(!text || !text.trim()) return;
      var frag = document.createDocumentFragment();
      for(var n=0; n<text.length; n++){
        var ch = text.charAt(n);
        if(ch === ' '){ frag.appendChild(document.createTextNode(' ')); continue; }
        var span = document.createElement('span'); span.className='az-letter'; span.textContent=ch;
        frag.appendChild(span);
      }
      el.textContent=''; el.appendChild(frag); el.dataset.azWrapped='1';
    });
    document.body.classList.add('az-v56-letter-ready');
  }

  function setupCursor(){
    var cursor = $('#gold-cursor');
    if(!cursor){
      cursor = document.createElement('div'); cursor.id = 'gold-cursor'; cursor.setAttribute('aria-hidden','true');
      var halo = document.createElement('i'); cursor.appendChild(halo); document.body.appendChild(cursor);
    }
    var field = $('#cursor-sparks');
    if(!field){ field = document.createElement('div'); field.id='cursor-sparks'; field.setAttribute('aria-hidden','true'); document.body.appendChild(field); }
    document.documentElement.classList.add('custom-cursor-ready'); document.body.classList.add('custom-cursor-ready','cursor-active');
    var last = 0;
    document.addEventListener('mousemove', function(e){
      cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
      var now = Date.now();
      if(now - last < 38) return; last = now;
      var s=document.createElement('i');
      var dx=(Math.random()*16-8), dy=(Math.random()*16-8);
      s.style.left=(e.clientX+dx)+'px'; s.style.top=(e.clientY+dy)+'px';
      s.style.setProperty('--tx',(Math.random()*24-12)+'px');
      s.style.setProperty('--ty',(Math.random()*24-12)+'px');
      s.style.setProperty('--life',(420+Math.random()*360)+'ms');
      field.appendChild(s);
      setTimeout(function(x){ if(x && x.parentNode) x.parentNode.removeChild(x); }, 900, s);
    }, {passive:true});
  }

  function fixIntroLogo(){
    $$('.intro-logo-blend img').forEach(function(img){
      var tries=['inverted-world-logo.png?v=56','entry-images/inverted-world-logo.png?v=56','assets/logo-black.png?v=56','logo-black.png?v=56'];
      var idx=0;
      img.onerror=function(){ if(idx < tries.length-1){ idx++; img.src=tries[idx]; } };
      img.src=tries[0];
    });
  }

  function makeIntroCardClickable(){
    $$('.intro-card,.start-here-card').forEach(function(card){
      var link = card.querySelector('a[href]'); if(!link) return;
      card.setAttribute('role','link'); card.tabIndex=0; card.style.cursor='pointer';
      card.addEventListener('click', function(e){ if(e.target.closest('a')) return; location.href = link.getAttribute('href'); });
      card.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); location.href = link.getAttribute('href'); } });
    });
  }

  function readerText(){
    var target = $('.entry-main') || $('.article') || $('.gallery-main.narrow');
    if(!target) return '';
    var clone = target.cloneNode(true);
    $$('.intro-logo-blend,.eyebrow,h1,.entry-label,.az-reader-toggle,.az-reader-panel,.az-teleprompter,script,style,nav,footer', clone).forEach(function(el){ el.remove(); });
    return (clone.innerText || '').replace(/\s+/g,' ').trim();
  }

  function setupReader(){
    if(!('speechSynthesis' in window)) return;
    if(!($('.entry-main') || $('.article') || $('.gallery-main.narrow'))) return;
    $$('.az-reader-toggle').forEach(function(el){ el.remove(); });
    var btn = document.createElement('button'); btn.className='az-reader-toggle'; btn.type='button'; btn.textContent='Reader';
    document.body.appendChild(btn);
    function pickVoice(){
      var voices = speechSynthesis.getVoices() || [];
      return voices.find(function(v){ return /natural|premium|enhanced|samantha|zira|google uk english female|google us english/i.test(v.name); }) || voices.find(function(v){ return /^en/i.test(v.lang); }) || voices[0] || null;
    }
    var speaking=false;
    btn.addEventListener('click', function(){
      if(speaking){ speechSynthesis.cancel(); speaking=false; btn.classList.remove('is-reading'); return; }
      var text = readerText(); if(!text) return;
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.82; u.pitch = 0.82; u.volume = 0.84; var voice = pickVoice(); if(voice) u.voice = voice;
      u.onend = u.onerror = function(){ speaking=false; btn.classList.remove('is-reading'); };
      speechSynthesis.cancel(); speechSynthesis.speak(u); speaking=true; btn.classList.add('is-reading');
    });
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  function addFooterLink(){
    $$('footer p').forEach(function(p){
      if((p.textContent || '').indexOf('Educational Resources') !== -1) return;
      var author = Array.prototype.slice.call(p.querySelectorAll('a')).find(function(a){ return /author/i.test(a.textContent || ''); });
      var a = document.createElement('a'); a.href='educational-resources.html'; a.textContent='Educational Resources';
      if(author){ author.insertAdjacentText('afterend',' · '); author.parentNode.insertBefore(a, author.nextSibling.nextSibling); }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    setupSearch(); setupMusic(); wrapLetters(); setupCursor(); fixIntroLogo(); makeIntroCardClickable(); setupReader(); addFooterLink();
  });
})();
