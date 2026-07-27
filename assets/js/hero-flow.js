/**
 * Ambient research-current field for the home-page identity column.
 * Adapted from Radiant's Flow Field (MIT), copyright Paul Bakaus:
 * https://github.com/pbakaus/radiant/blob/main/static/flow-field.html
 */
(function(){
  'use strict';

  var canvas=document.getElementById('hero-flow');
  if(!canvas){return;}
  var ctx=canvas.getContext('2d',{alpha:true});
  var hero=canvas.closest('.hero');
  if(!ctx||!hero){return;}

  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  var stacked=window.matchMedia('(max-width: 860px)');
  if(reduced.matches){return;}

  var F3=1/3,G3=1/6;
  var grad3=[
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];
  var perm=new Uint8Array(512),permMod12=new Uint8Array(512);
  (function(){
    var p=new Uint8Array(256),seed=42,i,j,tmp;
    for(i=0;i<256;i++){p[i]=i;}
    for(i=255;i>0;i--){
      seed=(seed*16807)%2147483647;
      j=seed%(i+1);tmp=p[i];p[i]=p[j];p[j]=tmp;
    }
    for(i=0;i<512;i++){
      perm[i]=p[i&255];
      permMod12[i]=perm[i]%12;
    }
  })();

  function noise3D(xin,yin,zin){
    var n0,n1,n2,n3,s=(xin+yin+zin)*F3;
    var i=Math.floor(xin+s),j=Math.floor(yin+s),k=Math.floor(zin+s);
    var t=(i+j+k)*G3,X0=i-t,Y0=j-t,Z0=k-t;
    var x0=xin-X0,y0=yin-Y0,z0=zin-Z0;
    var i1,j1,k1,i2,j2,k2;
    if(x0>=y0){
      if(y0>=z0){i1=1;j1=0;k1=0;i2=1;j2=1;k2=0;}
      else if(x0>=z0){i1=1;j1=0;k1=0;i2=1;j2=0;k2=1;}
      else{i1=0;j1=0;k1=1;i2=1;j2=0;k2=1;}
    }else if(y0<z0){
      i1=0;j1=0;k1=1;i2=0;j2=1;k2=1;
    }else if(x0<z0){
      i1=0;j1=1;k1=0;i2=0;j2=1;k2=1;
    }else{
      i1=0;j1=1;k1=0;i2=1;j2=1;k2=0;
    }
    var x1=x0-i1+G3,y1=y0-j1+G3,z1=z0-k1+G3;
    var x2=x0-i2+2*G3,y2=y0-j2+2*G3,z2=z0-k2+2*G3;
    var x3=x0-1+3*G3,y3=y0-1+3*G3,z3=z0-1+3*G3;
    var ii=i&255,jj=j&255,kk=k&255,gi,q;
    q=.6-x0*x0-y0*y0-z0*z0;
    if(q<0){n0=0;}else{q*=q;gi=permMod12[ii+perm[jj+perm[kk]]];n0=q*q*(grad3[gi][0]*x0+grad3[gi][1]*y0+grad3[gi][2]*z0);}
    q=.6-x1*x1-y1*y1-z1*z1;
    if(q<0){n1=0;}else{q*=q;gi=permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]];n1=q*q*(grad3[gi][0]*x1+grad3[gi][1]*y1+grad3[gi][2]*z1);}
    q=.6-x2*x2-y2*y2-z2*z2;
    if(q<0){n2=0;}else{q*=q;gi=permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]];n2=q*q*(grad3[gi][0]*x2+grad3[gi][1]*y2+grad3[gi][2]*z2);}
    q=.6-x3*x3-y3*y3-z3*z3;
    if(q<0){n3=0;}else{q*=q;gi=permMod12[ii+1+perm[jj+1+perm[kk+1]]];n3=q*q*(grad3[gi][0]*x3+grad3[gi][1]*y3+grad3[gi][2]*z3);}
    return 32*(n0+n1+n2+n3);
  }

  function rgb(value,fallback){
    var v=(value||'').trim(),m;
    if(/^#[0-9a-f]{6}$/i.test(v)){
      return {r:parseInt(v.slice(1,3),16),g:parseInt(v.slice(3,5),16),b:parseInt(v.slice(5,7),16)};
    }
    m=v.match(/^rgb[a]?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    return m?{r:+m[1],g:+m[2],b:+m[3]}:fallback;
  }

  var palette=[];
  function refreshPalette(){
    var css=getComputedStyle(document.documentElement);
    palette=[
      rgb(css.getPropertyValue('--cc-opt'),{r:224,g:154,b:106}),
      rgb(css.getPropertyValue('--accent'),{r:224,g:154,b:106}),
      rgb(css.getPropertyValue('--cc-net'),{r:143,g:184,b:220}),
      rgb(css.getPropertyValue('--cc-ai'),{r:114,g:198,b:180})
    ];
    ctx.clearRect(0,0,W,H);
  }

  var W=0,H=0,DPR=1,particles=[],time=0,last=0,raf=0;
  var visible=!document.hidden,inView=true;
  var mouse={x:-9999,y:-9999,active:false};

  function makeParticle(){
    var roll=Math.random();
    return {
      x:Math.random()*W,y:Math.random()*H,
      speed:.25+Math.random()*.62,
      alpha:.16+Math.random()*.34,
      size:.35+Math.random()*.85,
      color:roll<.52?0:(roll<.73?1:(roll<.9?2:3))
    };
  }

  function seedParticles(){
    var count=Math.max(240,Math.min(440,Math.round(W*H/1200))),i;
    particles.length=0;
    for(i=0;i<count;i++){particles.push(makeParticle());}
  }

  function resize(){
    var r=canvas.getBoundingClientRect();
    W=Math.max(1,r.width);H=Math.max(1,r.height);
    DPR=Math.min(window.devicePixelRatio||1,1.5);
    canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    refreshPalette();
    seedParticles();
  }

  function frame(now){
    if(!visible||!inView||stacked.matches||reduced.matches){raf=0;return;}
    var dt=last?Math.min(32,now-last):16;
    last=now;
    time+=dt*.00005;

    ctx.save();
    ctx.globalCompositeOperation='destination-out';
    ctx.fillStyle='rgba(0,0,0,.065)';
    ctx.fillRect(0,0,W,H);
    ctx.restore();

    var scale=.0031,i,p,nx,ny,angle,vx,vy,dx,dy,dist,force,px,py,c;
    for(i=0;i<particles.length;i++){
      p=particles[i];nx=p.x*scale;ny=p.y*scale;
      angle=noise3D(nx,ny,time)*Math.PI*2;
      vx=Math.cos(angle)*p.speed;vy=Math.sin(angle)*p.speed;
      if(mouse.active){
        dx=p.x-mouse.x;dy=p.y-mouse.y;dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<135&&dist>0){
          force=(1-dist/135)*1.15;
          vx+=(dx/dist)*force;vy+=(dy/dist)*force;
        }
      }
      px=p.x;py=p.y;p.x+=vx;p.y+=vy;c=palette[p.color];
      ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(p.x,p.y);
      ctx.strokeStyle='rgba('+c.r+','+c.g+','+c.b+','+p.alpha+')';
      ctx.lineWidth=p.size;ctx.stroke();
      if(p.x<-20||p.x>W+20||p.y<-20||p.y>H+20){
        p.x=Math.random()*W;p.y=Math.random()*H;
      }
    }
    raf=requestAnimationFrame(frame);
  }

  function setRunning(){
    var shouldRun=visible&&inView&&!stacked.matches&&!reduced.matches;
    if(shouldRun&&!raf){last=0;raf=requestAnimationFrame(frame);}
    if(!shouldRun&&raf){cancelAnimationFrame(raf);raf=0;}
  }

  hero.addEventListener('pointermove',function(e){
    if(e.pointerType==='touch'){return;}
    var r=canvas.getBoundingClientRect();
    mouse.active=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
    if(mouse.active){mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;}
  });
  hero.addEventListener('pointerleave',function(){mouse.active=false;});
  document.addEventListener('visibilitychange',function(){visible=!document.hidden;setRunning();});
  reduced.addEventListener('change',setRunning);
  stacked.addEventListener('change',function(){if(!stacked.matches){resize();}setRunning();});

  var scheme=window.matchMedia('(prefers-color-scheme: dark)');
  scheme.addEventListener('change',refreshPalette);
  new MutationObserver(refreshPalette).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

  if(window.ResizeObserver){new ResizeObserver(resize).observe(canvas);}
  else{window.addEventListener('resize',resize);}
  if(window.IntersectionObserver){
    new IntersectionObserver(function(entries){inView=entries[0].isIntersecting;setRunning();},{threshold:.02}).observe(canvas);
  }
  resize();
  setRunning();
})();
