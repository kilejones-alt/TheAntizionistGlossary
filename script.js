// TAG v181 clean consolidated behavior.
(function(){
  'use strict';
  var VERSION='195';
  var d=document;
  function $(s,root){return (root||d).querySelector(s)}
  function $$(s,root){return Array.prototype.slice.call((root||d).querySelectorAll(s))}
  function rand(min,max){return min+Math.random()*(max-min)}


  function initSparkles(){
    $$('.sparkle-field').forEach(function(el){el.remove();});
    var field=d.createElement('div');
    field.className='sparkle-field';
    field.setAttribute('aria-hidden','true');
    d.body.insertBefore(field,d.body.firstChild);
    var isHome=d.body.classList.contains('home');
    var count=isHome?112:86;
    var cols=isHome?14:12;
    var rows=Math.ceil(count/cols);
    for(var i=0;i<count;i++){
      var s=d.createElement('span');
      var layer=i%3;
      var depthClass=layer===0?'sparkle-far':(layer===1?'sparkle-mid':'sparkle-near');
      s.className='sparkle '+depthClass;
      var size=depthClass==='sparkle-far'?rand(2.4,4.8):(depthClass==='sparkle-mid'?rand(4.6,7.8):rand(7.2,12.8));
      var col=i%cols;
      var row=Math.floor(i/cols);
      var x=((col+.5)/cols)*100+rand(-2.8,2.8);
      var y=((row+.5)/rows)*100+rand(-4.5,4.5);
      x=Math.max(2,Math.min(98,x));
      y=Math.max(4,Math.min(102,y));
      s.style.setProperty('--x',x.toFixed(2)+'vw');
      s.style.setProperty('--y',y.toFixed(2)+'vh');
      s.style.setProperty('--size',size.toFixed(2)+'px');
      s.style.setProperty('--dur',rand(165,290).toFixed(2)+'s');
      s.style.setProperty('--delay',(-rand(0,240)).toFixed(2)+'s');
      var sway=(Math.random()<.5?-1:1)*rand(62,112);
      s.style.setProperty('--sway',sway.toFixed(1)+'px');
      s.style.setProperty('--drift',((Math.random()<.5?-1:1)*rand(34,86)).toFixed(1)+'px');
      var base=depthClass==='sparkle-far'?rand(.26,.52):(depthClass==='sparkle-mid'?rand(.44,.74):rand(.66,.98));
      s.style.setProperty('--op',base.toFixed(2));
      s.style.setProperty('--pulse',rand(24,56).toFixed(2)+'s');
      s.style.setProperty('--glow-delay',(-rand(0,46)).toFixed(2)+'s');
      field.appendChild(s);
    }
  }

  function initEntryImages(){
    $$('.entry-image img').forEach(function(img){
      var src=(img.getAttribute('src')||'').split('?')[0].toLowerCase();
      if(src.endsWith('.png')){
        var fig=img.closest('.entry-image');
        if(fig) fig.classList.add('entry-card-image');
      }
    });
  }

  function initCursor(){
    if(!window.matchMedia || !window.matchMedia('(pointer:fine)').matches) return;
    var c=$('#gold-cursor');
    if(!c){c=d.createElement('div');c.id='gold-cursor';c.setAttribute('aria-hidden','true');c.innerHTML='<i></i>';d.body.appendChild(c)}
    var box=$('#cursor-sparks');
    if(!box){box=d.createElement('div');box.id='cursor-sparks';box.setAttribute('aria-hidden','true');d.body.appendChild(box)}
    var last=0;
    d.addEventListener('pointermove',function(e){
      c.classList.add('is-visible');
      c.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0)';
      var now=Date.now();
      if(now-last>34){last=now;var sp=d.createElement('span');sp.className='cursor-spark';sp.style.left=(e.clientX+rand(-4,4))+'px';sp.style.top=(e.clientY+rand(-4,4))+'px';sp.style.setProperty('--dx',rand(-18,18)+'px');sp.style.setProperty('--dy',rand(-20,10)+'px');box.appendChild(sp);setTimeout(function(){sp.remove()},850)}
    },{passive:true});
    d.addEventListener('mouseleave',function(){c.classList.remove('is-visible')});
  }

  function wrapLetters(el){
    if(!el || el.classList.contains('letterized') || el.closest('.no-letter-wrap')) return;
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
    var sels=[
      'main h1','main h2','main h3','main h4','main p','main li','main a',
      'footer p','footer a','nav a','button','.music-toggle','.az-reader-toggle',
      '.home-title','.home-subtitle','.home-author','.home-quote-text','.home-quote-name','.home-quote-title',
      '.lead','.eyebrow','.entry-label','.tiny-citation-box','.education-bottom-card','.start-here-card',
      '.term-list a','.alphabet a','.resource-grid h2','.resource-grid p','.entry-side h3','.entry-side li','.entry-side p'
    ].join(',');
    $$(sels).forEach(function(el){
      if(!el || el.closest('script,style,noscript,svg,.no-hover-text')) return;
      if((el.textContent||'').trim().length<1) return;
      el.classList.add('az-hoverable-text');
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
      });
    });
  }

  function initMusic(){
    var btn=$('#music-toggle');
    var audio=new Audio('lumen-nocturne.mp3?v='+VERSION);
    audio.loop=true;audio.volume=.46;audio.preload='auto';
    var enabled=localStorage.getItem('tag-music-on')==='1';
    function setButton(on){if(btn){btn.setAttribute('aria-pressed',on?'true':'false');btn.title=on?'Music on':'Music off';}}
    function play(){audio.play().then(function(){enabled=true;localStorage.setItem('tag-music-on','1');setButton(true)}).catch(function(){setButton(false)});}
    function stop(){audio.pause();enabled=false;localStorage.setItem('tag-music-on','0');setButton(false)}
    if(btn){btn.addEventListener('click',function(e){e.preventDefault(); e.stopPropagation(); if(audio.paused) play(); else stop();});}
    setButton(enabled);
    if(enabled){var once=function(){play();d.removeEventListener('pointerdown',once,true)};d.addEventListener('pointerdown',once,true)}
    d.addEventListener('pointerdown',function(e){
      if(enabled || (btn && e.target===btn)) return;
      if(e.target.closest && e.target.closest('a,button,input,textarea,select')) return;
      play();
    },{once:true,capture:true});
  }

  function initReader(){
    if(!('speechSynthesis' in window)) return;
    $$('.az-reader-toggle').forEach(function(el){el.remove()});
    var btn=d.createElement('button');btn.type='button';btn.className='az-reader-toggle';btn.textContent='Reader';d.body.appendChild(btn);
    var nodes=[], idx=0, reading=false;
    function collect(){
      var selector='.entry-main p:not(.entry-label),.entry-main li,main.gallery-main p,main.gallery-main li,main:not(.gallery-main) p,main:not(.gallery-main) li';
      return $$(selector).filter(function(n){return !n.closest('nav,footer,figure,aside,.no-reader') && n.textContent.trim().length>20});
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
      u.rate=.92;u.pitch=.96;u.volume=1;
      var voices=speechSynthesis.getVoices()||[];
      var preferred=voices.find(function(v){return /Google US English|Microsoft Aria|Samantha|Daniel/i.test(v.name)}) || voices.find(function(v){return /^en/i.test(v.lang)});
      if(preferred) u.voice=preferred;
      u.onend=function(){ if(reading) speakNext(); };
      u.onerror=function(){ if(reading) speakNext(); };
      speechSynthesis.speak(u);
    }
    btn.addEventListener('click',function(){
      if(reading){stop();return;}
      nodes=collect();idx=0;if(!nodes.length) return;
      reading=true;btn.classList.add('is-reading');speechSynthesis.cancel();speakNext();
    });
    window.addEventListener('beforeunload',function(){speechSynthesis.cancel()});
  }

  document.addEventListener('DOMContentLoaded',function(){
    initEntryImages();
    initSparkles();
    initCursor();
    initLetterHover();
    initGlobalHoverText();
    initSearch();
    initMusic();
    initReader();
  });
})();
