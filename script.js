/* v57 clean script: stronger music persistence, homepage orb cursor, quote letter hover, transparent intro logo */
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
      root + 'audio/lumen-nocturne.mp3?v=75',
      root + 'lumen-nocturne.mp3?v=75',
      root + 'audio/lumen-nocturne.mp3',
      root + 'lumen-nocturne.mp3',
      './audio/lumen-nocturne.mp3?v=75',
      './lumen-nocturne.mp3?v=75',
      './audio/lumen-nocturne.mp3',
      './lumen-nocturne.mp3',
      'audio/lumen-nocturne.mp3?v=75',
      'lumen-nocturne.mp3?v=75',
      'audio/lumen-nocturne.mp3',
      'lumen-nocturne.mp3'
    ];
    var i = 0, trying = false;
    function pressed(on){ btn.setAttribute('aria-pressed', on ? 'true' : 'false'); document.body.classList.toggle('music-playing', !!on); btn.classList.toggle('is-playing', !!on); }
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
      else { trying=false; pressed(false); btn.title='Music did not play. Check that lumen-nocturne.mp3 exists in /audio/ or the repo root, then click Music again.'; if(remember !== false) saveState(false); }
    }
    btn.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      if(trying) return;
      if(audio.paused){ i=0; play(true); }
      else { audio.dataset.userStopped='1'; audio.pause(); pressed(false); saveState(false); }
    });
    audio.addEventListener('play', function(){ audio.dataset.userStopped='0'; pressed(true); saveState(true); });
    audio.addEventListener('pause', function(){
      pressed(false);
      /* Do not mark music off during normal page navigation. Only the Music button should turn it off. */
      if(audio.dataset.userStopped === '1') saveState(false);
      else saveState(true);
    });
    audio.addEventListener('timeupdate', function(){ if(!audio.paused) saveState(true); });
    audio.addEventListener('error', function(){ if(trying) next(true); });
    window.addEventListener('beforeunload', function(){ if(audio.dataset.userStopped !== '1') saveState(true); });
    window.addEventListener('pagehide', function(){ if(audio.dataset.userStopped !== '1') saveState(true); });
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href]');
      if(a && !audio.paused) saveState(true);
      try{ if(localStorage.getItem(MUSIC_KEY) === '1' && audio.paused && audio.dataset.userStopped !== '1'){ i=0; play(false); } }catch(err){}
    }, true);
    document.addEventListener('pointerdown', function(){
      try{ if(localStorage.getItem(MUSIC_KEY) === '1' && audio.paused && audio.dataset.userStopped !== '1'){ i=0; play(false); } }catch(err){}
    }, {passive:true});

    function tryAutoResume(){
      try{
        if(localStorage.getItem(MUSIC_KEY) === '1' && audio.paused && audio.dataset.userStopped !== '1'){
          i=0; play(false);
        }
      }catch(err){}
    }
    ['pageshow','focus','visibilitychange','mousemove','pointermove','click','keydown','touchstart'].forEach(function(evt){
      window.addEventListener(evt, tryAutoResume, {passive:true});
      document.addEventListener(evt, tryAutoResume, {passive:true});
    });

    try{
      if(localStorage.getItem(MUSIC_KEY) === '1'){
        i = 0; setTimeout(function(){ play(false); }, 120); setTimeout(tryAutoResume, 650);
      }
    }catch(e){}
  }

  function wrapLetters(){
    function shouldSkipTextNode(node){
      if(!node || !node.nodeValue || !node.nodeValue.trim()) return true;
      var p = node.parentNode;
      if(!p || !p.closest) return true;
      if(p.classList && p.classList.contains('az-letter')) return true;
      if(p.closest('script,style,noscript,template,textarea,input,select,option,audio,video,canvas,svg,.az-letter')) return true;
      return false;
    }
    function wrapNode(root){
      if(!root || !root.querySelectorAll) return;
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode:function(node){
        return shouldSkipTextNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }});
      var nodes=[], n;
      while((n=walker.nextNode())) nodes.push(n);
      nodes.forEach(function(node){
        if(!node.parentNode || shouldSkipTextNode(node)) return;
        var frag=document.createDocumentFragment();
        var text=node.nodeValue;
        var parts=text.match(/\s+|\S+/g) || [];
        parts.forEach(function(part){
          if(/\s+/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
          var word=document.createElement('span');
          word.className='az-word';
          for(var i=0;i<part.length;i++){
            var span=document.createElement('span');
            span.className='az-letter';
            span.textContent=part.charAt(i);
            word.appendChild(span);
          }
          frag.appendChild(word);
        });
        node.parentNode.replaceChild(frag,node);
      });
    }
    wrapNode(document.body);
    document.body.classList.add('az-v80-letter-ready');
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
    var last = 0, lastTouch = 0;
    function makeSpark(x,y,touch){
      if(typeof x !== 'number' || typeof y !== 'number') return;
      var s=document.createElement('i');
      if(touch) s.className='touch-spark';
      var spread = touch ? 18 : 12;
      var dx=(Math.random()*spread-spread/2), dy=(Math.random()*spread-spread/2);
      s.style.left=(x+dx)+'px'; s.style.top=(y+dy)+'px';
      s.style.setProperty('--tx',(Math.random()*18-9)+'px');
      s.style.setProperty('--ty',(Math.random()*18-9)+'px');
      s.style.setProperty('--life',(touch ? 760+Math.random()*220 : 620+Math.random()*300)+'ms');
      field.appendChild(s);
      setTimeout(function(x){ if(x && x.parentNode) x.parentNode.removeChild(x); }, touch ? 980 : 700, s);
    }
    function moveCursor(e){
      if(e && e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if(typeof e.clientX !== 'number') return;
      cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; cursor.style.opacity = '.96';
      var now = Date.now();
      if(now - last < 55) return; last = now;
      makeSpark(e.clientX,e.clientY,false);
    }
    function touchSpark(e){
      var t = e.touches && e.touches[0] ? e.touches[0] : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : null);
      if(!t) return;
      var now = Date.now();
      if(e.type === 'touchmove' && now - lastTouch < 70) return;
      lastTouch = now;
      makeSpark(t.clientX,t.clientY,true);
    }
    function pointerTouchSpark(e){
      if(!e || (e.pointerType !== 'touch' && e.pointerType !== 'pen')) return;
      var now = Date.now();
      if(e.type === 'pointermove' && now - lastTouch < 70) return;
      lastTouch = now;
      makeSpark(e.clientX,e.clientY,true);
    }
    document.addEventListener('mousemove', moveCursor, {passive:true});
    document.addEventListener('pointermove', moveCursor, {passive:true});
    document.addEventListener('touchstart', touchSpark, {passive:true});
    document.addEventListener('touchmove', touchSpark, {passive:true});
    document.addEventListener('pointerdown', pointerTouchSpark, {passive:true});
  }

  function fixIntroLogo(){
    $$('.intro-logo-blend img').forEach(function(img){
      var tries=['inverted-world-logo-transparent.png?v=66','entry-images/inverted-world-logo-transparent.png?v=66','inverted-world-logo.png?v=66','entry-images/inverted-world-logo.png?v=66','assets/logo-black.png?v=66','logo-black.png?v=66'];
      var idx=0;
      img.onerror=function(){ if(idx < tries.length-1){ idx++; img.src=tries[idx]; } };
      img.src=tries[0];
    });
  }

  function makeIntroCardClickable(){
    $$('.intro-card,.start-here-card').forEach(function(card){
      var link = card.querySelector('a[href]'); if(!link) return;
      card.setAttribute('role','link'); card.tabIndex=0; card.style.cursor='none';
      card.addEventListener('click', function(e){ if(e.target.closest('a')) return; location.href = link.getAttribute('href'); });
      card.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); location.href = link.getAttribute('href'); } });
    });
  }

  function readerText(){
    var target = $('.entry-main') || $('.article') || $('.gallery-main.narrow');
    if(!target) return '';
    var clone = target.cloneNode(true);
    $$('.intro-logo-blend,.eyebrow,h1,.entry-label,.page-head,.az-reader-toggle,.az-reader-panel,.az-teleprompter,script,style,nav,footer,figure,aside', clone).forEach(function(el){ el.remove(); });
    var text = (clone.innerText || '').replace(/\s+/g,' ').trim();
    /* Avoid reading a repeated page label/title if it survives in copied markup. */
    text = text.replace(/^(Introduction\s+){1,2}/i, '');
    return text.trim();
  }

  function setupReader(){
    if(!('speechSynthesis' in window)) return;
    if(!($('.entry-main') || $('.article') || $('.gallery-main.narrow'))) return;
    $$('.az-reader-toggle').forEach(function(el){ el.remove(); });
    var btn = document.createElement('button'); btn.className='az-reader-toggle'; btn.type='button'; btn.textContent='Reader';
    document.body.appendChild(btn);
    function pickVoice(){
      var voices = speechSynthesis.getVoices() || [];
      var scored = voices.map(function(v){
        var n = ((v.name || '') + ' ' + (v.lang || '')).toLowerCase();
        var score = 0;
        if(/^en/i.test(v.lang || '')) score += 10;
        if(/female|zira|samantha|victoria|karen|serena|moira|tessa|google uk english female|microsoft aria|microsoft jenny|natural|premium|enhanced|neural/.test(n)) score += 20;
        if(/google|microsoft/.test(n)) score += 6;
        if(/david|mark|alex|daniel|george|male/.test(n)) score += 2;
        if(/compact|robot|espeak/.test(n)) score -= 15;
        return {voice:v, score:score};
      }).sort(function(a,b){ return b.score - a.score; });
      return scored.length ? scored[0].voice : null;
    }
    var speaking=false;
    btn.addEventListener('click', function(){
      if(speaking){ speechSynthesis.cancel(); speaking=false; btn.classList.remove('is-reading'); return; }
      var text = readerText(); if(!text) return;
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.78;
      u.pitch = 0.82;
      u.volume = 0.72;
      var voice = pickVoice(); if(voice) u.voice = voice;
      u.onend = u.onerror = function(){ speaking=false; btn.classList.remove('is-reading'); };
      speechSynthesis.cancel(); speechSynthesis.speak(u); speaking=true; btn.classList.add('is-reading');
    });
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  function hideBrokenEntryImages(){
    $$('.entry-image img,.hero-figure img,.head-image img').forEach(function(img){
      function hide(){
        var box = img.closest('.entry-image,.hero-figure,.head-image');
        if(box) box.classList.add('is-missing');
      }
      img.addEventListener('error', hide);
      if(img.complete && img.naturalWidth === 0) hide();
    });
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
    setupSearch(); setupMusic(); setupCursor(); fixIntroLogo(); makeIntroCardClickable(); hideBrokenEntryImages(); setupReader(); addFooterLink(); wrapLetters();
  });
})();
