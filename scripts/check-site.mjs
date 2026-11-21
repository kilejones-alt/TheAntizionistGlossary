import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pages = readdirSync(root).filter(name => name.endsWith('.html'));
const failures = [];
const base = 'https://kilejones-alt.github.io/TheAntizionistGlossary/';

for (const name of pages) {
  const html = readFileSync(resolve(root, name), 'utf8');
  if (!/http-equiv=["']Content-Security-Policy["']/i.test(html)) failures.push(`${name}: missing Content Security Policy`);
  if (!/name=["']referrer["']\s+content=["']no-referrer["']/i.test(html) &&
      !/content=["']no-referrer["']\s+name=["']referrer["']/i.test(html)) failures.push(`${name}: missing referrer policy`);

  for (const [, attribute, value] of html.matchAll(/\b(href|src)=["']([^"']+)["']/gi)) {
    if (/^(?:#|[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) continue;
    const path = decodeURIComponent(value.split(/[?#]/, 1)[0]).replace(/^\/TheAntizionistGlossary\//, '');
    if (!path) continue;
    const target = resolve(dirname(resolve(root, name)), path);
    if ((!target.startsWith(root + sep) && target !== root) || !existsSync(target)) failures.push(`${name}: missing local ${attribute} ${value}`);
  }
}

for (const [name, language, canonical] of [
  ['detector-app.html', 'en', 'detector-app.html'],
  ['detector-app-he.html', 'he', 'detector-app-he.html'],
]) {
  const html = readFileSync(resolve(root, name), 'utf8');
  if (!html.includes(`href="${base}${canonical}" rel="canonical"`)) failures.push(`${name}: incorrect canonical URL`);
  if (!html.includes(`lang="${language}"`)) failures.push(`${name}: incorrect page language`);
  if (!html.includes('https://play.google.com/store/apps/details?id=com.kilejones.antizionismdetector')) failures.push(`${name}: missing original Play listing`);
  if (html.includes('com.kilejones.antizionismdetector.paid')) failures.push(`${name}: paid app link in original app page`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} glossary pages, local links, browser policies, and original app links.`);
}
