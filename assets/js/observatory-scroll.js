/* Camera presentation is independent of scenario playback. Native scroll only;
   one cached geometry read on layout, one coalesced update on scroll. */
(function(){
  'use strict';
  var obs=document.querySelector('.obs');
  if(!obs)return;
  var host=document.getElementById('uwsn-hero'),stage=obs.querySelector('.obs-stage');
  var copy=obs.querySelector('.obs-copy'),narrative=obs.querySelector('.obs-narrative');
  var masthead=document.querySelector('.masthead'),plaque=document.getElementById('uw-plaque');
  var beats=obs.querySelectorAll('.obs-beat'),steps=obs.querySelectorAll('.obs-sequence span');
  var wide=matchMedia('(min-width:64em)'),portraitMode=matchMedia('(orientation:portrait)'),
    motion=matchMedia('(prefers-reduced-motion:reduce)');
  var start=0,distance=1,queued=0,enabled=false,chapter=-1;
  function clamp(v){return Math.max(0,Math.min(1,v));}
  function update(){
    queued=0;
    document.documentElement.classList.toggle('obs-over',window.scrollY<start+obs.offsetHeight-masthead.offsetHeight);
    document.documentElement.classList.toggle('obs-scrolled',window.scrollY>8);
    var p=enabled?clamp((window.scrollY-start)/distance):0;
    var exploring=host.classList.contains('uw-explore');
    var fade=clamp(p/0.32),next=p<0.32?0:p<0.75?1:2;
    obs.style.setProperty('--copy-opacity',String(1-fade));
    obs.style.setProperty('--copy-shift',(-fade*36).toFixed(1)+'px');
    /* Invisible identity links must not remain in the keyboard order. */
    copy.inert=(enabled&&fade>=1)||exploring;
    if(chapter!==next){
      chapter=next;obs.dataset.chapter=String(next);
      for(var i=0;i<beats.length;i++)beats[i].classList.toggle('is-current',next===i+1);
      for(var j=0;j<steps.length;j++)steps[j].classList.toggle('is-current',next===j);
    }
    var showing=enabled&&next>0&&!exploring;
    narrative.setAttribute('aria-hidden',String(!showing));
    narrative.inert=!showing;
    for(var k=0;k<beats.length;k++)beats[k].inert=next!==k+1;
    if(host.__uwsnPresentation)host.__uwsnPresentation(p,enabled);
  }
  function schedule(){if(!queued)queued=requestAnimationFrame(update);}
  function layout(){
    var headerHeight=masthead.offsetHeight;
    document.documentElement.style.setProperty('--masthead-height',headerHeight+'px');
    var compact=wide.matches&&window.innerWidth/parseFloat(getComputedStyle(document.documentElement).fontSize)<64;
    obs.classList.toggle('obs-text-compact',compact);
    var fits=copy.offsetHeight+32<=window.innerHeight;
    var portraitStory=!wide.matches&&portraitMode.matches;
    enabled=(portraitStory||(wide.matches&&!compact&&fits))&&!motion.matches&&host.classList.contains('uw-ready');
    obs.classList.toggle('obs-story',enabled);
    start=obs.getBoundingClientRect().top+window.scrollY;
    distance=Math.max(1,obs.offsetHeight-stage.offsetHeight);
    host.style.setProperty('--uw-plaque-height',plaque.offsetHeight+'px');
    /* On a phone held vertically, let the underwater scene begin at the masthead
       and sit behind the identity copy. Landscape and text-zoom layouts retain
       the reserved copy band so their controls remain readable. */
    var fullBleedPortrait=portraitStory;
    host.style.setProperty('--uw-top',fullBleedPortrait?'0px':(!wide.matches||compact?Math.max(0,copy.offsetHeight-110)+'px':'0px'));
    if(host.__uwsnResize)host.__uwsnResize();
    schedule();
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',layout);
  window.addEventListener('pageshow',layout);
  window.addEventListener('hashchange',schedule);
  window.addEventListener('load',layout);
  host.addEventListener('uw-explore-change',layout);
  if(wide.addEventListener){wide.addEventListener('change',layout);portraitMode.addEventListener('change',layout);motion.addEventListener('change',layout);}
  if(document.fonts)document.fonts.ready.then(layout);
  if(window.ResizeObserver){
    var geometry=new ResizeObserver(layout);
    geometry.observe(copy.firstElementChild);geometry.observe(masthead);geometry.observe(plaque);
  }
  var portraitFigure=obs.querySelector('.portrait');
  if(portraitFigure&&window.IntersectionObserver)new IntersectionObserver(function(entries){
    portraitFigure.classList.toggle('orn-off',!entries[0].isIntersecting);
  }).observe(portraitFigure);
  layout();
})();
