const q=document.querySelector('#azSearch');if(q){q.addEventListener('input',()=>{const v=q.value.toLowerCase();document.querySelectorAll('.term-list li').forEach(li=>{li.style.display=li.textContent.toLowerCase().includes(v)?'':'none'})})}

const ambient=document.querySelector('.ambient-lights');
if(ambient){
  const count=30;
  for(let i=0;i<count;i++){
    const dot=document.createElement('span');
    dot.className='ambient-light';
    dot.style.left=(Math.random()*100).toFixed(2)+'%';
    dot.style.setProperty('--duration',(18+Math.random()*18).toFixed(2)+'s');
    dot.style.setProperty('--delay',(-Math.random()*32).toFixed(2)+'s');
    dot.style.setProperty('--drift',((-35+Math.random()*70).toFixed(1))+'px');
    const size=(1.4+Math.random()*2.4).toFixed(1)+'px';
    dot.style.width=size;
    dot.style.height=size;
    ambient.appendChild(dot);
  }
}
