(function(){
 const pages=[...document.querySelectorAll('.page')]; const routeLinks=[...document.querySelectorAll('[data-route]')]; let lastFocus=null;
 function route(){const key=(location.hash||'#discover').slice(1).split('?')[0]; const selected=['discover','explore','method'].includes(key)?key:'discover'; pages.forEach(p=>p.hidden=p.id!==selected);routeLinks.forEach(a=>{const on=a.dataset.route===selected;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});if(selected==='discover'&&key==='story')document.getElementById('story').scrollIntoView();else scrollTo({top:0,behavior:'instant'});}
 window.addEventListener('hashchange',route);route();
 const time=document.querySelector('#time'); const label=document.querySelector('#frame-label');const update=()=>{label.textContent=`FRAME ${String(Number(time.value)+1).padStart(2,'0')} / no observation data`;};time.addEventListener('input',update);update();
 document.querySelector('#prev').addEventListener('click',()=>{time.value=Math.max(0,Number(time.value)-1);update();});document.querySelector('#next').addEventListener('click',()=>{time.value=Math.min(4,Number(time.value)+1);update();});
 const drawer=document.querySelector('#drawer'),backdrop=document.querySelector('#backdrop'),close=document.querySelector('#close-drawer');
 function open(){lastFocus=document.activeElement;drawer.hidden=false;backdrop.hidden=false;document.body.style.overflow='hidden';close.focus();}
 function hide(){drawer.hidden=true;backdrop.hidden=true;document.body.style.overflow='';lastFocus?.focus?.();}
 document.querySelector('#evidence').addEventListener('click',open);document.querySelector('#inspect-more').addEventListener('click',open);document.querySelector('#model-pill').addEventListener('click',open);close.addEventListener('click',hide);backdrop.addEventListener('click',hide);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)hide();if(e.key==='Tab'&&!drawer.hidden){const focusables=[...drawer.querySelectorAll('button,a')].filter(x=>!x.hidden);const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
})();
