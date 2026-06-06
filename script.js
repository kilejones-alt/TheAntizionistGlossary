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
    const zones = [[3,24],[76,97],[25,33],[67,75]];
    for (let i = 0; i < 70; i++) {
      const zone = i < 28 ? zones[0] : i < 56 ? zones[1] : zones[2 + (i % 2)];
      const s = document.createElement('span');
      s.className = 'sparkle';
      const left = zone[0] + Math.random() * (zone[1] - zone[0]);
      const y = 16 + Math.random() * 86;
      const size = (i % 13 === 0 ? 5.2 + Math.random() * 1.8 : 2.4 + Math.random() * 3.4).toFixed(2);
      const dur = (13 + Math.random() * 8).toFixed(2);
      const delay = (-(Math.random() * Number(dur))).toFixed(2);
      const drift = (-26 + Math.random() * 52).toFixed(1);
      const op = (0.62 + Math.random() * 0.30).toFixed(2);
      s.setAttribute('style', `left:${left.toFixed(2)}%;--y:${y.toFixed(2)}vh;--size:${size}px;--dur:${dur}s;--delay:${delay}s;--drift:${drift}px;--op:${op}`);
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

    let x = -80;
    let y = -80;
    let lastSpark = 0;
    function place(nx, ny) {
      x = nx; y = ny;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      document.body.classList.add('cursor-active');
    }

    function makeSpark(now = performance.now()) {
      if (x < 0 || y < 0 || now - lastSpark < 46) return;
      lastSpark = now;
      const dot = document.createElement('span');
      dot.className = 'cursor-spark';
      dot.style.left = `${x + (Math.random() * 10 - 5)}px`;
      dot.style.top = `${y + (Math.random() * 10 - 5)}px`;
      dot.style.setProperty('--trail-x', `${Math.random() * 22 - 11}px`);
      dot.style.setProperty('--trail-y', `${-5 - Math.random() * 18}px`);
      sparks.appendChild(dot);
      setTimeout(() => dot.remove(), 1000);
    }

    function move(event) {
      place(event.clientX, event.clientY);
      makeSpark();
    }
    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('mousemove', move, { passive: true });

    if (new URLSearchParams(location.search).has('cursorproof')) {
      let t = 0;
      document.body.classList.add('cursor-active');
      setInterval(() => {
        t += 0.18;
        place(window.innerWidth * .55 + Math.cos(t) * 110, window.innerHeight * .46 + Math.sin(t * 1.3) * 58);
        makeSpark(performance.now() + 60);
      }, 30);
    }
  }

  ensureSparkles();
  ensureCursor();
})();
