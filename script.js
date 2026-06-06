(() => {
  const search = document.querySelector('#azSearch') || document.querySelector('[data-term-search]') || document.querySelector('.search');
  if (search) {
    search.addEventListener('input', () => {
      const value = search.value.toLowerCase();
      document.querySelectorAll('.term-list li').forEach((li) => {
        li.style.display = li.textContent.toLowerCase().includes(value) ? '' : 'none';
      });
    });
  }

  const isHebrewHome = document.documentElement.lang === 'he' || document.body.classList.contains('hebrew-page');
  const inEntries = location.pathname.includes('/entries/');
  const base = inEntries ? '../' : '';
  document.querySelectorAll('.gallery-topbar').forEach((bar) => {
    bar.innerHTML = `<nav class="language-nav" aria-label="Primary navigation"><a href="${base}glossary.html">Glossary →</a><span class="nav-divider" aria-hidden="true">|</span><a href="${base}${isHebrewHome ? 'index.html' : 'index-he.html'}" ${isHebrewHome ? 'dir="ltr"' : 'lang="he" dir="rtl"'}>${isHebrewHome ? 'English' : 'עברית'}</a></nav>`;
  });

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const field = document.createElement('div');
  field.className = 'magic-field';
  field.setAttribute('aria-hidden', 'true');
  document.body.prepend(field);
  const zones = [[3,28],[72,97],[31,36],[64,69]];
  const count = Math.min(72, Math.max(48, Math.floor(window.innerWidth / 22)));
  for (let i = 0; i < count; i++) {
    const s = document.createElement('i');
    s.className = 'ambient-spark';
    const side = Math.random() < .84 ? (Math.random() < .5 ? 0 : 1) : (Math.random() < .5 ? 2 : 3);
    const z = zones[side];
    const x = z[0] + Math.random() * (z[1] - z[0]);
    const size = 2.2 + Math.random() * 4.2;
    const dur = 18 + Math.random() * 16;
    const delay = -Math.random() * dur;
    s.style.setProperty('--x', `${x}vw`);
    s.style.setProperty('--s', `${size}px`);
    s.style.setProperty('--d', `${dur}s`);
    s.style.setProperty('--delay', `${delay}s`);
    s.style.setProperty('--drift', `${-38 + Math.random() * 76}px`);
    s.style.setProperty('--o', `${0.54 + Math.random() * .34}`);
    s.style.setProperty('--f', `${2.4 + Math.random() * 3.8}s`);
    field.appendChild(s);
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    const orb = document.createElement('div');
    orb.className = 'magic-cursor-orb';
    orb.setAttribute('aria-hidden', 'true');
    document.body.appendChild(orb);
    let lastSpark = 0;
    let lastX = -1000, lastY = -1000;
    document.documentElement.classList.add('magic-cursor');
    const move = (event) => {
      lastX = event.clientX; lastY = event.clientY;
      orb.style.opacity = '1';
      orb.style.transform = `translate3d(${lastX}px,${lastY}px,0) scale(${.96 + Math.sin(performance.now()/100)*.08})`;
      const now = performance.now();
      if (now - lastSpark > 18) {
        lastSpark = now;
        for (let i=0;i<4;i++) {
          const sp = document.createElement('b');
          sp.className = 'cursor-spark';
          sp.style.left = `${lastX + Math.random()*18 - 9}px`;
          sp.style.top = `${lastY + Math.random()*18 - 9}px`;
          sp.style.setProperty('--dx', `${-46 + Math.random()*92}px`);
          sp.style.setProperty('--dy', `${-72 + Math.random()*62}px`);
          document.body.appendChild(sp);
          setTimeout(() => sp.remove(), 1180);
        }
      }
    };
    document.addEventListener('pointermove', move, {passive:true});
    document.addEventListener('pointerleave', () => { orb.style.opacity = '0'; }, {passive:true});
    // make proof visible even before the first real move
    setTimeout(() => { if (lastX < -900) { orb.style.opacity = '1'; orb.style.transform = 'translate3d(82vw,24vh,0)'; } }, 250);
  }
})();
