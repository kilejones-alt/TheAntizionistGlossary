(function(){
  var search=document.querySelector('#azSearch')||document.querySelector('[data-term-search]')||document.querySelector('.search');
  if(search){search.addEventListener('input',function(){var v=String(search.value||'').toLowerCase();document.querySelectorAll('.term-list li').forEach(function(li){li.style.display=li.textContent.toLowerCase().indexOf(v)>-1?'':'none';});});}

  var inEntries=location.pathname.indexOf('/entries/')>-1;
  var base=inEntries?'../':'';
  var isHebrew=document.documentElement.lang==='he'||document.body.classList.contains('hebrew-page');
  document.querySelectorAll('.gallery-topbar').forEach(function(bar){
    bar.innerHTML='<nav class="language-nav" aria-label="Primary navigation"><a href="'+base+'glossary.html">Glossary →</a><span class="nav-divider" aria-hidden="true">|</span><a href="'+base+(isHebrew?'index.html':'index-he.html')+'" '+(isHebrew?'dir="ltr"':'lang="he" dir="rtl"')+'>'+(isHebrew?'English':'עברית')+'</a></nav>';
  });

  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){return;}

  var field=document.createElement('div');
  field.className='magic-field';
  field.setAttribute('aria-hidden','true');
  document.body.appendChild(field);
  var zones=[[3,29],[71,97],[31,36],[64,69]];
  for(var i=0;i<34;i++){
    var sp=document.createElement('i');
    sp.className='ambient-spark';
    var side=Math.random()<0.86?(Math.random()<0.5?0:1):(Math.random()<0.5?2:3);
    var z=zones[side],x=z[0]+Math.random()*(z[1]-z[0]);
    var dur=7.5+Math.random()*6.5;
    sp.style.setProperty('--x',x+'vw');
    sp.style.setProperty('--s',(3+Math.random()*6)+'px');
    sp.style.setProperty('--d',dur+'s');
    sp.style.setProperty('--delay',(-Math.random()*dur)+'s');
    sp.style.setProperty('--drift',(-48+Math.random()*96)+'px');
    sp.style.setProperty('--o',(0.72+Math.random()*0.25));
    sp.style.setProperty('--f',(1.8+Math.random()*2.4)+'s');
    field.appendChild(sp);
  }

  var orb=document.createElement('div');
  orb.className='magic-cursor-orb';
  orb.setAttribute('aria-hidden','true');
  orb.style.setProperty('--cx','82vw');
  orb.style.setProperty('--cy','24vh');
  document.body.appendChild(orb);
  var last=0,x=window.innerWidth*0.82,y=window.innerHeight*0.24;
  function emit(px,py,n){
    n=n||3;
    for(var i=0;i<n;i++){
      var b=document.createElement('b');
      b.className='cursor-spark';
      b.style.left=(px+Math.random()*22-11)+'px';
      b.style.top=(py+Math.random()*22-11)+'px';
      b.style.setProperty('--dx',(-58+Math.random()*116)+'px');
      b.style.setProperty('--dy',(-78+Math.random()*72)+'px');
      document.body.appendChild(b);
      (function(node){setTimeout(function(){if(node&&node.parentNode)node.parentNode.removeChild(node);},1100);})(b);
    }
  }
  function move(clientX,clientY){
    x=clientX;y=clientY;
    orb.style.setProperty('--cx',x+'px');
    orb.style.setProperty('--cy',y+'px');
    orb.style.opacity='1';
    var now=Date.now();
    if(now-last>24){last=now;emit(x,y,4);}
  }
  document.addEventListener('mousemove',function(e){move(e.clientX,e.clientY);},false);
  document.addEventListener('pointermove',function(e){move(e.clientX,e.clientY);},{passive:true});
  document.addEventListener('touchstart',function(e){if(e.touches&&e.touches[0])move(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
  setInterval(function(){if(Date.now()-last>600){emit(x,y,1);}},420);
})();
