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

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const particleCanvas = document.createElement('canvas');
  particleCanvas.className = 'magic-particle-canvas';
  particleCanvas.setAttribute('aria-hidden', 'true');
  const cursorCanvas = document.createElement('canvas');
  cursorCanvas.className = 'magic-cursor-canvas';
  cursorCanvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(particleCanvas);
  document.body.appendChild(cursorCanvas);

  const pctx = particleCanvas.getContext('2d');
  const cctx = cursorCanvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const sideZones = [[0.035, 0.29], [0.71, 0.965], [0.31, 0.37], [0.63, 0.69]];
  let particles = [];
  const cursor = { x: -1000, y: -1000, active: false, sparks: [] };
  let lastSpark = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    [particleCanvas, cursorCanvas].forEach((canvas) => {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    });
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeParticles();
  }

  function randomFromZone() {
    const zone = sideZones[Math.random() < 0.82 ? (Math.random() < 0.5 ? 0 : 1) : (Math.random() < 0.5 ? 2 : 3)];
    return (zone[0] + Math.random() * (zone[1] - zone[0])) * width;
  }

  function makeParticles() {
    const count = width < 700 ? 34 : 58;
    particles = Array.from({ length: count }, (_, i) => resetParticle({}, true, i));
  }

  function resetParticle(p, scatter = false, i = 0) {
    p.x = randomFromZone();
    p.y = scatter ? Math.random() * height : height + 18 + Math.random() * 140;
    p.baseX = p.x;
    p.size = 1.35 + Math.random() * 2.55;
    p.speed = 48 + Math.random() * 70;
    p.drift = -24 + Math.random() * 48;
    p.phase = Math.random() * Math.PI * 2;
    p.pulse = 0.62 + Math.random() * 0.38;
    p.alpha = 0.54 + Math.random() * 0.34;
    p.twinkle = 1.4 + Math.random() * 2.8;
    p.index = i;
    return p;
  }

  function drawGoldDot(ctx, x, y, radius, alpha) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 3.9);
    glow.addColorStop(0, `rgba(255,250,222,${alpha})`);
    glow.addColorStop(0.22, `rgba(255,216,116,${alpha * 0.86})`);
    glow.addColorStop(0.52, `rgba(246,183,64,${alpha * 0.18})`);
    glow.addColorStop(1, 'rgba(246,183,64,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 3.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255,247,211,${Math.min(1, alpha + .08)})`;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.1, radius * .42), 0, Math.PI * 2);
    ctx.fill();
  }

  let last = performance.now();
  function animate(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    pctx.clearRect(0, 0, width, height);
    pctx.globalCompositeOperation = 'lighter';
    for (const p of particles) {
      p.y -= p.speed * dt;
      p.phase += p.twinkle * dt;
      const progress = 1 - Math.max(0, Math.min(1, p.y / height));
      const x = p.baseX + Math.sin(p.phase * .7) * 8 + p.drift * progress;
      const visible = p.y > -90 && p.y < height + 100;
      if (visible) {
        const fadeIn = Math.min(1, (height + 35 - p.y) / 130);
        const fadeOut = Math.min(1, (p.y + 80) / 160);
        const twinkle = 0.70 + Math.sin(p.phase) * 0.30;
        drawGoldDot(pctx, x, p.y, p.size, p.alpha * fadeIn * fadeOut * twinkle);
      }
      if (p.y < -110) resetParticle(p, false, p.index);
    }
    pctx.globalCompositeOperation = 'source-over';

    cctx.clearRect(0, 0, width, height);
    cctx.globalCompositeOperation = 'lighter';
    if (cursor.active && window.matchMedia('(pointer: fine)').matches) {
      drawGoldDot(cctx, cursor.x, cursor.y, 9.5 + Math.sin(now / 150) * 2.2, 0.98);
      drawGoldDot(cctx, cursor.x, cursor.y, 18, 0.26 + Math.sin(now / 130) * .10);
    }
    cursor.sparks = cursor.sparks.filter((s) => now - s.birth < 850);
    for (const s of cursor.sparks) {
      const t = (now - s.birth) / 850;
      const x = s.x + s.dx * t;
      const y = s.y + s.dy * t - 18 * t;
      drawGoldDot(cctx, x, y, s.size * (1 - t * .65), (1 - t) * .86);
    }
    cctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(animate);
  }

  function pointerMove(event) {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('magic-cursor');
    cursor.active = true;
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    const now = performance.now();
    if (now - lastSpark > 26) {
      lastSpark = now;
      cursor.sparks.push({
        x: cursor.x + Math.random() * 14 - 7,
        y: cursor.y + Math.random() * 14 - 7,
        dx: Math.random() * 40 - 20,
        dy: Math.random() * 34 - 12,
        size: 2.1 + Math.random() * 3.9,
        birth: now
      });
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('pointermove', pointerMove, { passive: true });
  document.addEventListener('pointerleave', () => { cursor.active = false; });
  resize();
  requestAnimationFrame(animate);
})();
