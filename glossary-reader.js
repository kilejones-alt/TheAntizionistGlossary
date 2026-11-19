const readers = new WeakMap();

export function openReader(trigger) {
  if (!readers.has(trigger)) readers.set(trigger, createReader(trigger));
  readers.get(trigger).open();
}

function createReader(trigger) {
  const doc = trigger.ownerDocument;
  const speech = window.speechSynthesis;
  const hebrew = doc.documentElement.lang.startsWith('he');
  const lang = hebrew ? 'he' : 'en';
  const labels = hebrew
    ? { play: 'נגן', pause: 'השהה', previous: 'הפסקה הקודמת', next: 'הפסקה הבאה', close: 'סגור', speed: 'מהירות', voice: 'קול', name: 'בקרות הקורא', error: 'הקול אינו זמין' }
    : { play: 'Play', pause: 'Pause', previous: 'Previous paragraph', next: 'Next paragraph', close: 'Close reader', speed: 'Speed', voice: 'Voice', name: 'Reader controls', error: 'Voice unavailable' };
  const key = 'azReaderV275';
  const speeds = [.8, 1, 1.15, 1.3, 1.5];
  let rate = 1;
  let voiceName = '';
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    if (speeds.includes(saved.rate)) rate = saved.rate;
    if (typeof saved.voice === 'string') voiceName = saved.voice;
  } catch {}

  const make = (tag, name, text = '') => {
    const el = doc.createElement(tag);
    el.className = name;
    el.textContent = text;
    return el;
  };
  const button = (name, glyph, label) => {
    const el = make('button', name, glyph);
    el.type = 'button';
    el.setAttribute('aria-label', label);
    return el;
  };
  const container = make('div', 'az-dock');
  container.id = 'glossary-reader-controls';
  container.hidden = true;
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', labels.name);
  trigger.setAttribute('aria-controls', container.id);
  trigger.setAttribute('aria-expanded', 'false');
  const previous = button('az-prev', '⏮', labels.previous);
  const play = button('az-play', '▶', labels.play);
  const next = button('az-next', '⏭', labels.next);
  const close = button('az-close', '×', labels.close);
  const count = make('span', 'az-count', '0/0');
  count.setAttribute('role', 'status');
  const speed = make('select', 'az-speed');
  speed.setAttribute('aria-label', labels.speed);
  for (const value of speeds) speed.add(new Option(`${value}×`, String(value)));
  speed.value = String(rate);
  const voice = make('select', 'az-voice');
  voice.setAttribute('aria-label', labels.voice);
  const bar = make('span', 'az-bar');
  const fill = make('i', '');
  bar.append(fill);
  container.append(previous, play, next, count, speed, voice, close, bar);
  doc.body.append(container);

  let paragraphs = [];
  let paragraph = 0;
  let chunks = [];
  let part = 0;
  let generation = 0;
  let playing = false;
  let highlight;
  let ducked;
  let activeUtterance;

  function updateVoices() {
    const available = speech.getVoices().filter(candidate => candidate.lang.toLowerCase().startsWith(lang));
    available.sort((a, b) => Number(b.localService) - Number(a.localService));
    voice.replaceChildren(...available.map(candidate => new Option(candidate.name, candidate.name)));
    if (available.some(candidate => candidate.name === voiceName)) voice.value = voiceName;
    voice.hidden = available.length < 2;
    return available;
  }

  function save() {
    try { localStorage.setItem(key, JSON.stringify({ rate, voice: voiceName })); } catch {}
  }

  function restoreMusic() {
    if (!ducked) return;
    ducked.audio.volume = ducked.volume;
    ducked = undefined;
  }

  function update() {
    play.textContent = playing ? '❚❚' : '▶';
    play.setAttribute('aria-label', playing ? labels.pause : labels.play);
    previous.disabled = paragraph === 0;
    next.disabled = paragraph >= paragraphs.length - 1;
    count.textContent = `${paragraph + 1}/${paragraphs.length}`;
    fill.style.width = `${(paragraph + 1) / paragraphs.length * 100}%`;
  }

  function stopSpeaking() {
    generation++;
    speech.cancel();
    activeUtterance = undefined;
    playing = false;
    restoreMusic();
    update();
  }

  function speak(available) {
    if (!playing || container.hidden) return;
    if (part >= chunks.length) {
      if (paragraph < paragraphs.length - 1) jump(paragraph + 1, true, true);
      else closeReader(true);
      return;
    }
    const token = ++generation;
    const utterance = new SpeechSynthesisUtterance(chunks[part]);
    const selected = available.find(candidate => candidate.name === voice.value);
    if (selected) utterance.voice = selected;
    utterance.lang = selected?.lang || (hebrew ? 'he-IL' : 'en-US');
    utterance.rate = rate;
    utterance.onend = () => {
      if (token !== generation || !playing) return;
      part++;
      speak(available);
    };
    utterance.onerror = event => {
      if (token !== generation || event.error === 'canceled' || event.error === 'interrupted') return;
      stopSpeaking();
      count.textContent = labels.error;
    };
    activeUtterance = utterance;
    speech.speak(activeUtterance);
  }

  function startSpeaking() {
    const audio = doc.getElementById('site-music-audio');
    if (audio && !audio.paused && !ducked) {
      ducked = { audio, volume: audio.volume };
      audio.volume = Math.min(.08, audio.volume);
    }
    playing = true;
    update();
    speak(updateVoices());
  }

  function jump(index, start, scroll) {
    stopSpeaking();
    paragraph = Math.max(0, Math.min(paragraphs.length - 1, index));
    part = 0;
    highlight?.classList.remove('is-reader-highlight');
    highlight = paragraphs[paragraph];
    highlight.classList.add('is-reader-highlight');
    const text = highlight.textContent.replace(/\s+/g, ' ').trim();
    chunks = text.match(/.{1,220}(?:\s|$)|.{1,220}/gu).map(value => value.trim()).filter(Boolean);
    if (scroll) {
      const rect = highlight.getBoundingClientRect();
      if (rect.top < 64 || rect.bottom > innerHeight - 100) highlight.scrollIntoView({ block: 'center' });
    }
    update();
    if (start) startSpeaking();
  }

  function closeReader(returnFocus) {
    stopSpeaking();
    highlight?.classList.remove('is-reader-highlight');
    container.classList.remove('is-open');
    container.hidden = true;
    doc.body.classList.remove('az-dock-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  }

  play.addEventListener('click', () => playing ? stopSpeaking() : startSpeaking());
  previous.addEventListener('click', () => jump(paragraph - 1, playing, true));
  next.addEventListener('click', () => jump(paragraph + 1, playing, true));
  close.addEventListener('click', () => closeReader(true));
  speed.addEventListener('change', () => { rate = Number(speed.value); save(); if (playing) { stopSpeaking(); startSpeaking(); } });
  voice.addEventListener('change', () => { voiceName = voice.value; save(); if (playing) { stopSpeaking(); startSpeaking(); } });
  speech.addEventListener('voiceschanged', updateVoices);
  doc.addEventListener('keydown', event => { if (event.key === 'Escape' && !container.hidden) closeReader(true); });
  doc.addEventListener('visibilitychange', () => { if (doc.hidden && playing) stopSpeaking(); });
  addEventListener('pagehide', () => { if (!container.hidden) closeReader(false); });

  return { open() {
    const text = doc.querySelector('.entry-main, main');
    paragraphs = [...(text?.querySelectorAll('p, li') || [])].filter(el =>
      !el.closest('nav, footer, figure, aside, .no-reader, .entry-label') && el.textContent.trim().length > 20);
    if (!paragraphs.length) return;
    updateVoices();
    container.hidden = false;
    container.classList.add('is-open');
    doc.body.classList.add('az-dock-open');
    trigger.setAttribute('aria-expanded', 'true');
    jump(0, false, false);
    play.focus();
  } };
}
