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



// SPARKLE TUNE: smaller, fewer, slower, warmer gold flicker
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 54;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = (Math.random() * 100).toFixed(2) + '%';
    dot.style.setProperty('--duration', (64 + Math.random() * 54).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 110).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-16 + Math.random() * 32).toFixed(1)) + 'px');
    dot.style.setProperty('--flicker', (12 + Math.random() * 8).toFixed(2) + 's');
    const bright = Math.random() < 0.12;
    const size = bright ? (2.0 + Math.random() * 2.0) : (0.55 + Math.random() * 0.95);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.opacity = bright ? (0.34 + Math.random() * 0.16).toFixed(2) : (0.07 + Math.random() * 0.09).toFixed(2);
    ambient.appendChild(dot);
  }
})();




// V10A sparkle tune: magical, pretty, subtle, centered scene
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 46;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = (Math.random() * 100).toFixed(2) + '%';
    dot.style.setProperty('--duration', (76 + Math.random() * 58).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 124).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-14 + Math.random() * 28).toFixed(1)) + 'px');
    dot.style.setProperty('--flicker', (13 + Math.random() * 8).toFixed(2) + 's');
    const bright = Math.random() < 0.15;
    const size = bright ? (1.45 + Math.random() * 1.35) : (0.50 + Math.random() * 0.72);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.opacity = bright ? (0.28 + Math.random() * 0.14).toFixed(2) : (0.08 + Math.random() * 0.08).toFixed(2);
    ambient.appendChild(dot);
  }
})();




// V10G: visible slow upward gold sparkles
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 62;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = (Math.random() * 100).toFixed(2) + '%';
    dot.style.setProperty('--duration', (78 + Math.random() * 62).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 135).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-18 + Math.random() * 36).toFixed(1)) + 'px');
    dot.style.setProperty('--flicker', (8 + Math.random() * 7).toFixed(2) + 's');
    const bright = Math.random() < 0.20;
    const size = bright ? (1.9 + Math.random() * 1.6) : (0.85 + Math.random() * 0.95);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.opacity = bright ? (0.44 + Math.random() * 0.18).toFixed(2) : (0.20 + Math.random() * 0.16).toFixed(2);
    ambient.appendChild(dot);
  }
})();




// V10H: visible but fewer slow upward sparkles
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 48;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = (Math.random() * 100).toFixed(2) + '%';
    dot.style.setProperty('--duration', (82 + Math.random() * 66).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 145).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-14 + Math.random() * 28).toFixed(1)) + 'px');
    dot.style.setProperty('--flicker', (9 + Math.random() * 7).toFixed(2) + 's');
    const bright = Math.random() < 0.18;
    const size = bright ? (1.8 + Math.random() * 1.3) : (0.90 + Math.random() * 0.85);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.opacity = bright ? (0.46 + Math.random() * 0.16).toFixed(2) : (0.22 + Math.random() * 0.14).toFixed(2);
    ambient.appendChild(dot);
  }
})();




// V11 Hebrew final: visible magical slow upward sparkle field
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 58;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = (Math.random() * 100).toFixed(2) + '%';
    dot.style.setProperty('--duration', (72 + Math.random() * 56).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 128).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-18 + Math.random() * 36).toFixed(1)) + 'px');
    dot.style.setProperty('--flicker', (8 + Math.random() * 8).toFixed(2) + 's');
    const bright = Math.random() < 0.20;
    const size = bright ? (1.9 + Math.random() * 1.5) : (0.85 + Math.random() * 0.85);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.opacity = bright ? (0.46 + Math.random() * 0.18).toFixed(2) : (0.22 + Math.random() * 0.14).toFixed(2);
    ambient.appendChild(dot);
  }
})();




// V11 clean motion: visible magical slow upward sparkles, biased away from center globe area
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 64;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    let x;
    const side = Math.random();
    if (side < 0.40) x = Math.random() * 34;          // left field
    else if (side < 0.80) x = 66 + Math.random() * 34; // right field
    else x = Math.random() * 100;                      // occasional full-field depth
    dot.style.left = x.toFixed(2) + '%';
    dot.style.setProperty('--duration', (64 + Math.random() * 50).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 116).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-14 + Math.random() * 28).toFixed(1)) + 'px');
    dot.style.setProperty('--flicker', (7 + Math.random() * 7).toFixed(2) + 's');
    const bright = Math.random() < 0.18;
    const size = bright ? (1.7 + Math.random() * 1.2) : (0.80 + Math.random() * 0.85);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.opacity = bright ? (0.42 + Math.random() * 0.16).toFixed(2) : (0.20 + Math.random() * 0.14).toFixed(2);
    ambient.appendChild(dot);
  }
})();



// V12 GALLERY FINAL: visible slow particles, placed away from globe/text
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 86;
  function pickX(){
    const r = Math.random();
    if (r < 0.40) return Math.random() * 34;            // left gallery space
    if (r < 0.80) return 66 + Math.random() * 34;       // right gallery space
    if (r < 0.90) return 8 + Math.random() * 18;        // far left edge
    return 74 + Math.random() * 18;                     // far right edge
  }
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = pickX().toFixed(2) + '%';
    dot.style.setProperty('--duration', (34 + Math.random() * 42).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 80).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-28 + Math.random() * 56).toFixed(1)) + 'px');
    dot.style.setProperty('--flicker', (5.4 + Math.random() * 5.6).toFixed(2) + 's');
    const bright = Math.random() < 0.23;
    const size = bright ? (2.3 + Math.random() * 2.4) : (1.05 + Math.random() * 1.35);
    const opacity = bright ? (0.62 + Math.random() * 0.20) : (0.36 + Math.random() * 0.20);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.setProperty('--particle-opacity', opacity.toFixed(2));
    ambient.appendChild(dot);
  }
})();


// V12B: brighter visible slow particles, still biased to open gallery space
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 76;
  function pickX(){
    const r = Math.random();
    if (r < 0.42) return 2 + Math.random() * 30;
    if (r < 0.84) return 68 + Math.random() * 30;
    if (r < 0.92) return 36 + Math.random() * 8;   // rare center-edge dust, not on globe
    return 56 + Math.random() * 8;
  }
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = pickX().toFixed(2) + '%';
    dot.style.setProperty('--duration', (38 + Math.random() * 48).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 88).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-26 + Math.random() * 52).toFixed(1)) + 'px');
    dot.style.setProperty('--flicker', (4.6 + Math.random() * 5.4).toFixed(2) + 's');
    const bright = Math.random() < 0.26;
    const size = bright ? (2.6 + Math.random() * 2.6) : (1.25 + Math.random() * 1.55);
    const opacity = bright ? (0.68 + Math.random() * 0.18) : (0.42 + Math.random() * 0.22);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.setProperty('--particle-opacity', opacity.toFixed(2));
    ambient.appendChild(dot);
  }
})();



// V13 FINAL: visibly moving magic sparkle field. Keeps center corridor mostly clear.
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 64;
  function pickX(){
    const r = Math.random();
    if (r < 0.46) return 3 + Math.random() * 27;
    if (r < 0.92) return 70 + Math.random() * 27;
    return Math.random() < .5 ? 32 + Math.random()*6 : 62 + Math.random()*6;
  }
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = pickX().toFixed(2) + '%';
    dot.style.setProperty('--duration', (18 + Math.random() * 12).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-Math.random() * 28).toFixed(2) + 's');
    dot.style.setProperty('--drift', ((-34 + Math.random() * 68).toFixed(1)) + 'px');
    dot.style.setProperty('--flicker', (3.2 + Math.random() * 3.6).toFixed(2) + 's');
    const bright = Math.random() < 0.28;
    const size = bright ? (3.1 + Math.random() * 2.4) : (1.7 + Math.random() * 1.6);
    const opacity = bright ? (0.78 + Math.random() * 0.18) : (0.52 + Math.random() * 0.22);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.setProperty('--particle-opacity', opacity.toFixed(2));
    ambient.appendChild(dot);
  }
})();

// V14 REAL-SITE FIX: deterministic, faster, readable upward sparkle movement in open side space.
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 54;
  const rand = (min, max) => min + Math.random() * (max - min);
  function pickX(){
    const r = Math.random();
    if (r < 0.44) return rand(3, 29);       // left open gallery space
    if (r < 0.88) return rand(71, 97);      // right open gallery space
    if (r < 0.94) return rand(32, 37);      // rare center-edge dust, left of globe/text
    return rand(63, 68);                    // rare center-edge dust, right of globe/text
  }
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = pickX().toFixed(2) + '%';
    dot.style.setProperty('--duration', rand(10.5, 16.5).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-rand(0, 16)).toFixed(2) + 's');
    dot.style.setProperty('--drift', rand(-38, 38).toFixed(1) + 'px');
    dot.style.setProperty('--flicker', rand(3.0, 5.4).toFixed(2) + 's');
    const bright = Math.random() < 0.32;
    const size = bright ? rand(3.4, 5.1) : rand(1.9, 3.3);
    const opacity = bright ? rand(0.82, 0.96) : rand(0.58, 0.78);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.setProperty('--particle-opacity', opacity.toFixed(2));
    dot.dataset.x = dot.style.left;
    dot.dataset.duration = dot.style.getPropertyValue('--duration');
    ambient.appendChild(dot);
  }
})();

// V15 FINAL CHECK: faster readable motion, side-space sparkle field only.
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 62;
  const rand = (min, max) => min + Math.random() * (max - min);
  function pickX(){
    const r = Math.random();
    if (r < 0.46) return rand(4, 30);
    if (r < 0.92) return rand(70, 96);
    return Math.random() < .5 ? rand(32, 36) : rand(64, 68);
  }
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = pickX().toFixed(2) + '%';
    dot.style.setProperty('--duration', rand(7.8, 12.8).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-rand(0, 13)).toFixed(2) + 's');
    dot.style.setProperty('--drift', rand(-42, 42).toFixed(1) + 'px');
    dot.style.setProperty('--flicker', rand(2.8, 4.8).toFixed(2) + 's');
    const bright = Math.random() < 0.34;
    const size = bright ? rand(4.0, 5.8) : rand(2.2, 3.8);
    const opacity = bright ? rand(0.88, 0.98) : rand(0.64, 0.84);
    dot.style.width = size.toFixed(2) + 'px';
    dot.style.height = size.toFixed(2) + 'px';
    dot.style.setProperty('--particle-opacity', opacity.toFixed(2));
    ambient.appendChild(dot);
  }
})();

// V16 SIZE FIX: use CSS variable so particle size defeats older !important width rules.
(function(){
  const ambient = document.querySelector('.ambient-lights-v8');
  if (!ambient) return;
  ambient.innerHTML = '';
  const count = 60;
  const rand = (min, max) => min + Math.random() * (max - min);
  function pickX(){
    const r = Math.random();
    if (r < 0.46) return rand(4, 30);
    if (r < 0.92) return rand(70, 96);
    return Math.random() < .5 ? rand(32, 36) : rand(64, 68);
  }
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'ambient-light';
    dot.style.left = pickX().toFixed(2) + '%';
    dot.style.setProperty('--duration', rand(8.0, 13.0).toFixed(2) + 's');
    dot.style.setProperty('--delay', (-rand(0, 13)).toFixed(2) + 's');
    dot.style.setProperty('--drift', rand(-42, 42).toFixed(1) + 'px');
    dot.style.setProperty('--flicker', rand(2.8, 4.8).toFixed(2) + 's');
    const bright = Math.random() < 0.32;
    const size = bright ? rand(4.2, 6.2) : rand(2.5, 4.0);
    const opacity = bright ? rand(0.88, 0.98) : rand(0.66, 0.84);
    dot.style.setProperty('--particle-size', size.toFixed(2) + 'px');
    dot.style.setProperty('--particle-opacity', opacity.toFixed(2));
    ambient.appendChild(dot);
  }
})();
