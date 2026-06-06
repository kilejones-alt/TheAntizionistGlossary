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

  // Fail-safe: if a page does not have hard-coded sparkles, add them.
  function ensureSparkles() {
    if (document.querySelector('.sparkle-field')) return;
    const field = document.createElement('div');
    field.className = 'sparkle-field';
    field.setAttribute('aria-hidden', 'true');
    const zones = [[3,28],[72,97],[30,37],[63,70]];
    for (let i = 0; i < 64; i++) {
      const zone = i < 28 ? zones[0] : i < 56 ? zones[1] : zones[2 + (i % 2)];
      const s = document.createElement('span');
      s.className = 'sparkle';
      const left = zone[0] + Math.random() * (zone[1] - zone[0]);
      const size = (i % 5 === 0 ? 5.5 + Math.random() * 4.5 : 3 + Math.random() * 3.5).toFixed(2);
      const dur = (6.5 + Math.random() * 6).toFixed(2);
      const delay = (-(Math.random() * Number(dur))).toFixed(2);
      const drift = (-45 + Math.random() * 90).toFixed(1);
      const op = (0.68 + Math.random() * 0.32).toFixed(2);
      s.setAttribute('style', `left:${left.toFixed(2)}%;--size:${size}px;--dur:${dur}s;--delay:${delay}s;--drift:${drift}px;--op:${op}`);
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

    let x = Math.round(window.innerWidth * 0.72);
    let y = Math.round(window.innerHeight * 0.42);
    let lastSpark = 0;
    function place(nx, ny) {
      x = nx; y = ny;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    }
    place(x, y);

    function makeSpark(now = performance.now()) {
      if (now - lastSpark < 18) return;
      lastSpark = now;
      for (let i = 0; i < 2; i++) {
        const dot = document.createElement('span');
        dot.className = 'cursor-spark';
        dot.style.left = `${x + (Math.random() * 20 - 10)}px`;
        dot.style.top = `${y + (Math.random() * 20 - 10)}px`;
        dot.style.setProperty('--trail-x', `${Math.random() * 44 - 22}px`);
        dot.style.setProperty('--trail-y', `${-10 - Math.random() * 34}px`);
        sparks.appendChild(dot);
        setTimeout(() => dot.remove(), 850);
      }
    }

    function move(event) {
      place(event.clientX, event.clientY);
      makeSpark();
    }
    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('mousemove', move, { passive: true });

    // Visible even before the first mouse move; proves the orb layer is loaded.
    setInterval(() => makeSpark(performance.now() + 30), 120);

    // Proof mode for browser screenshots: visible cursor and trail without manual movement.
    if (new URLSearchParams(location.search).has('cursorproof')) {
      let t = 0;
      setInterval(() => {
        t += 0.18;
        place(window.innerWidth * .52 + Math.cos(t) * 130, window.innerHeight * .48 + Math.sin(t * 1.3) * 70);
        makeSpark(performance.now() + 40);
      }, 28);
    }
  }

  ensureSparkles();
  ensureCursor();
})();
