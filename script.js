const q=document.querySelector('#azSearch');if(q){q.addEventListener('input',()=>{const v=q.value.toLowerCase();document.querySelectorAll('.term-list li').forEach(li=>{li.style.display=li.textContent.toLowerCase().includes(v)?'':'none'})})}

const ambient=document.querySelector('.ambient-lights');
if(ambient){
  const count=42;
  for(let i=0;i<count;i++){
    const dot=document.createElement('span');
    dot.className='ambient-light';
    dot.style.left=(Math.random()*100).toFixed(2)+'%';
    dot.style.setProperty('--duration',(30+Math.random()*20).toFixed(2)+'s');
    dot.style.setProperty('--delay',(-Math.random()*32).toFixed(2)+'s');
    dot.style.setProperty('--drift',((-22+Math.random()*44).toFixed(1))+'px');
    const size=(1.4+Math.random()*2.4).toFixed(1)+'px';
    dot.style.width=size;
    dot.style.height=size;
    ambient.appendChild(dot);
  }
}


const orb=document.getElementById('cursor-orb');
if(orb && !window.matchMedia('(pointer: coarse)').matches){
  document.addEventListener('mousemove',(e)=>{
    orb.style.opacity='1';
    orb.style.transform=`translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  document.addEventListener('mouseleave',()=>{orb.style.opacity='0';});
}


// HOMEPAGE V4: replace ambient field with smaller, slower, dimmer floating lights
(function(){
  const ambient = document.querySelector('.ambient-lights');
  if (ambient) {
    ambient.innerHTML = '';
    const count = 64;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.className = 'ambient-light';
      dot.style.left = (Math.random() * 100).toFixed(2) + '%';
      dot.style.setProperty('--duration', (36 + Math.random() * 28).toFixed(2) + 's');
      dot.style.setProperty('--delay', (-Math.random() * 60).toFixed(2) + 's');
      dot.style.setProperty('--drift', ((-18 + Math.random() * 36).toFixed(1)) + 'px');
      dot.style.setProperty('--orb-size', (0.9 + Math.random() * 1.7).toFixed(2) + 'px');
      ambient.appendChild(dot);
    }
  }

  const orb = document.getElementById('cursor-orb');
  if (!orb || window.matchMedia('(pointer: coarse)').matches) return;
  document.addEventListener('mousemove', (e) => {
    orb.style.opacity = '1';
    orb.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  document.addEventListener('mouseleave', () => { orb.style.opacity = '0'; });
})();


// HOMEPAGE V5: full-screen field of visible tiny orbs and a few brighter ones
(function(){
  const ambient = document.querySelector('.ambient-lights-v5');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 90;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = (Math.random() * 100).toFixed(2) + '%';
    dot.style.setProperty('--duration', (34 + Math.random() * 34).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 70).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-28 + Math.random() * 56).toFixed(1)) + 'px');
    const bright = Math.random() < 0.14;
    const size = bright ? (3.0 + Math.random() * 3.8) : (1.1 + Math.random() * 2.0);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.opacity = bright ? (0.55 + Math.random() * 0.18).toFixed(2) : (0.20 + Math.random() * 0.22).toFixed(2);
    ambient.appendChild(dot);
  }

  const orb = document.getElementById('cursor-orb');
  if (!orb || window.matchMedia('(pointer: coarse)').matches) return;
  document.addEventListener('mousemove', (e) => {
    orb.style.opacity = '1';
    orb.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  document.addEventListener('mouseleave', () => { orb.style.opacity = '0'; });
})();


// HOMEPAGE V6: immersive field of orbs
(function(){
  const ambient = document.querySelector('.ambient-lights-v6');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 120;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = (Math.random() * 100).toFixed(2) + '%';
    dot.style.setProperty('--duration', (36 + Math.random() * 40).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 82).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-35 + Math.random() * 70).toFixed(1)) + 'px');
    const bright = Math.random() < 0.18;
    const size = bright ? (3.6 + Math.random() * 4.8) : (1.0 + Math.random() * 2.0);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.opacity = bright ? (0.58 + Math.random() * 0.20).toFixed(2) : (0.16 + Math.random() * 0.20).toFixed(2);
    ambient.appendChild(dot);
  }
  const orb = document.getElementById('cursor-orb');
  if (!orb || window.matchMedia('(pointer: coarse)').matches) return;
  document.addEventListener('mousemove', (e) => {
    orb.style.opacity = '1';
    orb.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  document.addEventListener('mouseleave', () => { orb.style.opacity = '0'; });
})();


// HOMEPAGE V7: deeper immersive orb field
(function(){
  const ambient = document.querySelector('.ambient-lights-v7');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 145;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = (Math.random() * 100).toFixed(2) + '%';
    dot.style.setProperty('--duration', (38 + Math.random() * 42).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 88).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-38 + Math.random() * 76).toFixed(1)) + 'px');
    const bright = Math.random() < 0.20;
    const size = bright ? (4.0 + Math.random() * 5.3) : (0.9 + Math.random() * 2.0);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.opacity = bright ? (0.60 + Math.random() * 0.20).toFixed(2) : (0.12 + Math.random() * 0.20).toFixed(2);
    ambient.appendChild(dot);
  }
  const orb = document.getElementById('cursor-orb');
  if (!orb || window.matchMedia('(pointer: coarse)').matches) return;
  document.addEventListener('mousemove', (e) => {
    orb.style.opacity = '1';
    orb.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  document.addEventListener('mouseleave', () => { orb.style.opacity = '0'; });
})();


// HOMEPAGE V8: moodier wider orb field
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 150;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = (Math.random() * 100).toFixed(2) + '%';
    dot.style.setProperty('--duration', (42 + Math.random() * 44).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 92).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-44 + Math.random() * 88).toFixed(1)) + 'px');
    const bright = Math.random() < 0.18;
    const size = bright ? (3.6 + Math.random() * 5.0) : (0.8 + Math.random() * 1.8);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.opacity = bright ? (0.58 + Math.random() * 0.18).toFixed(2) : (0.10 + Math.random() * 0.18).toFixed(2);
    ambient.appendChild(dot);
  }
  const orb = document.getElementById('cursor-orb');
  if (!orb || window.matchMedia('(pointer: coarse)').matches) return;
  document.addEventListener('mousemove', (e) => {
    orb.style.opacity = '1';
    orb.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  document.addEventListener('mouseleave', () => { orb.style.opacity = '0'; });
})();
