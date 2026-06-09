/* v55 emergency clean script: music fallback, individual letter motion, reader, cursor trails */
(function(){
  'use strict';
  function $(sel, root){ return (root || document).querySelector(sel); }
  function $$(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function pageFile(){ return (location.pathname.split('/').pop() || 'index.html').toLowerCase(); }

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
    btn.id='music-toggle'; btn.classList.add('music-toggle'); btn.setAttribute('aria-pressed','false');

    var old = $('#lumen-site-audio'); if(old) old.remove();
    var audio = document.createElement('audio');
    audio.id='lumen-site-audio'; audio.preload='auto'; audio.loop=true; audio.volume=0.78; audio.setAttribute('playsinline',''); audio.setAttribute('webkit-playsinline','');
    document.body.appendChild(audio);

    var base = location.pathname.indexOf('/TheAntizionistGlossary/') === 0 ? '/TheAntizionistGlossary/' : './';
    var sources = [
      'lumen-nocturne.mp3?v=55',
      './lumen-nocturne.mp3?v=55',
      'audio/lumen-nocturne.mp3?v=55',
      './audio/lumen-nocturne.mp3?v=55',
      base + 'lumen-nocturne.mp3?v=55',
      base + 'audio/lumen-nocturne.mp3?v=55'
    ];
    var i = 0, trying = false;
    function pressed(on){ btn.setAttribute('aria-pressed', on ? 'true' : 'false'); document.body.classList.toggle('music-playing', !!on); }
    function setSrc(){ if(audio.src !== sources[i]){ audio.src = sources[i]; try{ audio.load(); }catch(e){} } }
    function play(){
      trying = true; setSrc(); audio.muted=false; audio.volume=0.78;
      var p; try{ p = audio.play(); }catch(e){ return next(); }
      if(p && p.then){ p.then(function(){ trying=false; pressed(true); }).catch(function(){ next(); }); }
      else { trying=false; pressed(true); }
    }
    function next(){
      if(i < sources.length - 1){ i++; setTimeout(play, 80); }
      else { trying=false; pressed(false); btn.textContent='Music'; btn.title='Audio file was not found or could not be played.'; }
    }
    btn.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      if(trying) return;
      if(audio.paused){ i=0; play(); } else { audio.pause(); pressed(false); }
    });
    audio.addEventListener('play', function(){ pressed(true); });
    audio.addEventListener('pause', function(){ pressed(false); });
    audio.addEventListener('error', function(){ if(trying) next(); });
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
        span.addEventListener('mouseenter', function(){ this.classList.add('az-letter-active'); this.style.transform='translateY(-7px) scale(1.12) rotate(-1.5deg)'; });
        span.addEventListener('mouseleave', function(){ var s=this; s.classList.remove('az-letter-active'); s.style.transform='translateY(0) scale(1) rotate(0deg)'; });
        frag.appendChild(span);
      }
      el.textContent=''; el.appendChild(frag); el.dataset.azWrapped='1';
    });
    document.body.classList.add('az-v55-letter-ready');
  }

  function setupCursor(){
    var cursor = $('#gold-cursor');
    var field = $('#cursor-sparks');
    if(!field){ field = document.createElement('div'); field.id='cursor-sparks'; field.setAttribute('aria-hidden','true'); document.body.appendChild(field); }
    var last = 0;
    document.addEventListener('mousemove', function(e){
      if(cursor){ cursor.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'; }
      var now = Date.now();
      if(now - last < 18) return; last = now;
      for(var k=0;k<3;k++){
        var s=document.createElement('i');
        var dx=(Math.random()*32-16), dy=(Math.random()*32-16);
        s.style.left=(e.clientX+dx)+'px'; s.style.top=(e.clientY+dy)+'px';
        s.style.setProperty('--tx',(Math.random()*44-22)+'px');
        s.style.setProperty('--ty',(Math.random()*44-22)+'px');
        s.style.setProperty('--life',(520+Math.random()*520)+'ms');
        field.appendChild(s);
        setTimeout(function(x){ if(x && x.parentNode) x.parentNode.removeChild(x); }, 1100, s);
      }
    }, {passive:true});
  }

  function fixIntroLogo(){
    $$('.intro-logo-blend img').forEach(function(img){
      var tries=['inverted-world-logo.png?v=55','entry-images/inverted-world-logo.png?v=55','assets/logo-black.png?v=55','logo-black.png?v=55'];
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

  function setupReader(){
    if(!('speechSynthesis' in window)) return;
    var target = $('.entry-main,.article,.gallery-main.narrow');
    if(!target) return;
    var btn = document.createElement('button'); btn.className='az-reader-toggle'; btn.type='button'; btn.textContent='Reader';
    document.body.appendChild(btn);
    function pickVoice(){
      var voices = speechSynthesis.getVoices() || [];
      return voices.find(function(v){ return /natural|premium|enhanced|samantha|zira|david|google/i.test(v.name); }) || voices.find(function(v){ return /en/i.test(v.lang); }) || voices[0] || null;
    }
    var speaking=false;
    btn.addEventListener('click', function(){
      if(speaking){ speechSynthesis.cancel(); speaking=false; btn.classList.remove('is-reading'); return; }
      var u = new SpeechSynthesisUtterance((target.innerText || '').replace(/\s+/g,' ').trim());
      u.rate = 0.82; u.pitch = 0.78; u.volume = 0.86; var voice = pickVoice(); if(voice) u.voice = voice;
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
