# Update the Glossary

This repository is the single source for the public Glossary. The original Antizionism Detector app requests a term's first article paragraph from these published pages when the term opens. Some terms retain approved saved text when a page cannot be read. A Glossary text edit does not require a Google Play or Netlify release.

1. Edit the matching English entry file, such as `zionism-is-racism.html`. Keep its source links and image credits accurate. If the Hebrew page should change too, edit its matching `-he.html` file.
2. Run `node scripts/check-site.mjs` from this repository. It checks every page's local links and browser policy, plus the original app's Glossary pages.
3. Commit and push to `main`. Once GitHub Pages publishes, open the edited live page and the same term in the original app. The app requests the current paragraph and retains a saved copy for offline use.

For an app feature, purchase, research, or design change, use the separate `kilejones-alt/antizionistdetector` repository and its `web/FIRST-APP-UPDATES.md` checklist. The second paid app has its own release path.

Live Glossary: https://kilejones-alt.github.io/TheAntizionistGlossary/
