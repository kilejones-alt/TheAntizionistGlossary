(() => {
  const q = document.querySelector('#azSearch');
  if (q) {
    q.addEventListener('input', () => {
      const value = q.value.toLowerCase();
      document.querySelectorAll('.term-list li').forEach((li) => {
        li.style.display = li.textContent.toLowerCase().includes(value) ? '' : 'none';
      });
    });
  }

  let ambient = document.querySelector('.ambient-lights');
  if (!ambient) {
    ambient = document.createElement('div');
    ambient.className = 'ambient-lights ambient-lights-v17';
    ambient.setAttribute('aria-hidden', 'true');
    document.body.prepend(ambient);
  }
  ambient.classList.add('ambient-lights-v17');
  ambient.innerHTML = '';

  const particles = [
    [7, -0.2, 6.8, 20, 7.0, .88], [14, -1.6, 5.7, -16, 5.2, .72], [22, -3.0, 7.1, 30, 4.8, .82],
    [29, -4.5, 6.2, -32, 6.0, .66], [73, -0.7, 6.4, -24, 6.4, .86], [81, -2.1, 5.4, 18, 5.0, .74],
    [91, -3.8, 7.4, -36, 7.2, .80], [96, -5.0, 6.0, 26, 4.6, .70], [5, -5.8, 5.2, 34, 4.8, .84],
    [18, -6.4, 7.6, -28, 6.8, .68], [26, -7.0, 5.9, 22, 5.6, .78], [76, -6.7, 6.9, -20, 6.2, .88],
    [87, -7.5, 5.8, 30, 4.8, .72], [94, -8.3, 7.2, -34, 5.8, .82], [10, -8.7, 6.1, 18, 6.2, .70],
    [24, -9.2, 5.5, -22, 4.5, .76], [71, -9.7, 6.5, 36, 6.4, .86], [84, -10.3, 5.3, -18, 5.0, .74],
    [93, -10.9, 7.5, 28, 7.0, .80], [3, -11.4, 6.6, -26, 5.2, .78], [16, -12.1, 5.6, 30, 4.9, .84],
    [28, -12.8, 7.0, -36, 6.6, .66], [72, -13.2, 6.0, 20, 5.4, .86], [79, -13.8, 5.1, -18, 4.6, .72],
    [89, -14.4, 6.8, 32, 6.2, .80], [97, -14.9, 5.9, -24, 5.6, .76], [9, -15.4, 7.3, 26, 6.8, .82],
    [21, -16.0, 6.3, -30, 4.8, .70], [74, -16.6, 5.4, 22, 5.2, .86], [86, -17.1, 7.1, -36, 6.0, .74],
    [31, -2.7, 6.9, -12, 5.5, .54], [67, -4.2, 6.5, 14, 5.8, .56], [34, -7.4, 7.3, 10, 6.3, .50],
    [64, -11.2, 6.7, -10, 5.6, .52]
  ];

  particles.forEach(([x, delay, duration, drift, size, opacity], index) => {
    const dot = document.createElement('span');
    dot.className = 'ambient-light art-particle';
    dot.style.left = `${x}%`;
    dot.style.setProperty('--delay', `${delay}s`);
    dot.style.setProperty('--duration', `${duration}s`);
    dot.style.setProperty('--drift', `${drift}px`);
    dot.style.setProperty('--particle-size', `${size}px`);
    dot.style.setProperty('--particle-opacity', `${opacity}`);
    dot.style.setProperty('--flicker', `${3.2 + (index % 7) * 0.32}s`);
    ambient.appendChild(dot);
  });

  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.documentElement.classList.add('custom-cursor-active');

  let orb = document.getElementById('cursor-orb');
  if (!orb) {
    orb = document.createElement('div');
    orb.id = 'cursor-orb';
    orb.className = 'cursor-orb';
    orb.setAttribute('aria-hidden', 'true');
    document.body.appendChild(orb);
  }

  let lastSpark = 0;
  const moveOrb = (event) => {
    orb.style.opacity = '1';
    orb.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    const now = performance.now();
    if (now - lastSpark > 34) {
      lastSpark = now;
      const spark = document.createElement('span');
      spark.className = 'cursor-spark';
      spark.style.left = `${event.clientX + (Math.random() * 12 - 6)}px`;
      spark.style.top = `${event.clientY + (Math.random() * 12 - 6)}px`;
      spark.style.setProperty('--spark-drift-x', `${Math.random() * 34 - 17}px`);
      spark.style.setProperty('--spark-drift-y', `${-18 - Math.random() * 28}px`);
      spark.style.setProperty('--spark-size', `${2.5 + Math.random() * 4.5}px`);
      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 950);
    }
  };

  document.addEventListener('mousemove', moveOrb, { passive: true });
  document.addEventListener('mouseleave', () => { orb.style.opacity = '0'; });
})();
