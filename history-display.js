/* Displays the same maintained history paragraphs as the Detector. */
(function(){
  'use strict';
  const mappings={
    'zionism-is-racism.html':'Zionism is racism',
    'boycott-divestment-sanctions.html':'Boycott, Divestment, and Sanctions (BDS)',
    'globalize-the-intifada.html':'Globalize the intifada',
    'from-the-river-to-the-sea.html':'From the river to the sea',
    'hasbara.html':'Hasbara','pinkwashing.html':'Pinkwashing',
    'settler-colonialism.html':'Settler colonialism','zionist-entity.html':'Zionist entity',
    'ethnostate.html':'Ethnostate','open-air-prison.html':'Open-air prison',
    'apartheid-wall.html':'Apartheid wall','end-the-occupation.html':'End the occupation',
    'genocide.html':'Genocide','apartheid.html':'Apartheid','collective-punishment.html':'Collective punishment',
    'modern-day-nazis.html':'Holocaust / Nazi comparison','nazi-state.html':'Holocaust / Nazi comparison',
    'zio-zionazi.html':'Holocaust / Nazi comparison',
    'antizionism-october-7-2023-present.html':'October 7 / Al-Aqsa Flood',
    'anti-zionism.html':'Antizionism','zionism.html':'Zionism'
  };
  const file=location.pathname.split('/').pop();
  const container=document.querySelector('article.entry-main');
  const term=mappings[file];
  if(term && container && !document.getElementById('shared-history-section')){
    const section=document.createElement('section');
    section.id='shared-history-section';
    section.setAttribute('aria-labelledby','shared-history-heading');
    const heading=document.createElement('h2');heading.id='shared-history-heading';heading.textContent='History';
    const paragraph=document.createElement('p');paragraph.dataset.sharedHistory=term;paragraph.style.whiteSpace='pre-line';
    section.append(heading,paragraph);
    container.append(section);
  }
  function update(){
    document.querySelectorAll('[data-shared-history]').forEach(el=>{el.textContent=window.SharedHistory.get(el.dataset.sharedHistory);});
  }
  function ready(){update();window.SharedHistory.subscribe(update);}
  if(window.SharedHistory){ready();return;}
  const script=document.createElement('script');script.src='shared-history.js?v=1';script.onload=ready;document.body.append(script);
})();
