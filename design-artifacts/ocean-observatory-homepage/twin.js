/* ============================================================
   Ocean Observatory prototype — digital twin scene
   "Acoustic Network Awakening" + guided observation cycle.
   Dependency-free canvas; adapted from the site's own
   _includes/hero-uwsn.html world model (simplified for the
   design prototype). All data simulated and labeled as such.
   ============================================================ */
(function(){
'use strict';
var host=document.getElementById('twin'); if(!host){return;}
var cv=host.querySelector('canvas'); var ctx=cv.getContext('2d'); if(!ctx){return;}
var DPR=Math.min(window.devicePixelRatio||1,2);
var MONO='ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
var REDUCED=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var W=0,H=0;

/* ---------- config: semantic color contract (locked) ---------- */
var COL={
  net:'79,216,247',   netDim:'150,200,215',
  threat:'233,86,70', amber:'240,178,70',
  hab:'86,214,170',   sei:'255,140,64', seiAlt:'186,124,240',
  off:'138,150,160',  ink:'190,225,238'
};
var KM=2.5;                       /* world unit -> km */

/* ---------- helpers ---------- */
function hsh(a,b){var s=Math.sin(a*127.1+b*311.7)*43758.5453;return s-Math.floor(s);}
function n2(x,z){
  var ix=Math.floor(x),iz=Math.floor(z),fx=x-ix,fz=z-iz;
  var u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz);
  return hsh(ix,iz)*(1-u)*(1-v)+hsh(ix+1,iz)*u*(1-v)+hsh(ix,iz+1)*(1-u)*v+hsh(ix+1,iz+1)*u*v;
}
function noise(x,z){return (n2(x,z)*0.65+n2(x*2.3+7,z*2.3+3)*0.35)-0.5;}
function ss(e,t){if(t<=0){return 0;}if(t>=e){return 1;}var q=t/e;return q*q*(3-2*q);}
function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function lerp(a,b,f){return a+(b-a)*f;}
function outQuint(q){q=clamp(q,0,1);return 1-Math.pow(1-q,5);}
function outQuart(q){q=clamp(q,0,1);return 1-Math.pow(1-q,4);}

/* ---------- bathymetry ---------- */
function faultX(z){return -0.18+0.11*Math.sin(z*1.5+0.6);}
function depthAt(x,z){
  var wx=x+0.14*noise(x*0.9+31,z*0.9+7),wz=z+0.14*noise(x*1.1+53,z*1.1+17);
  return 0.34+0.14*(1-x)*0.5
    +0.26*ss(0.22,faultX(z)-x)
    +0.09*ss(0.16,0.44+0.10*Math.sin(z*1.2-0.4)-x)
    +noise(wx*1.8,wz*1.8)*0.05
    +noise(wx*5.2+3,wz*5.2+9)*0.02;
}
var GX=44,GZ=30,gw=[],gsx=new Float32Array(GX*GZ),gsy=new Float32Array(GX*GZ);
(function(){
  for(var j=0;j<GZ;j++){for(var i=0;i<GX;i++){
    var x=-1.15+2.30*i/(GX-1),z=-1.0+2.0*j/(GZ-1);
    gw.push({x:x,z:z,d:depthAt(x,z),m:n2(x*2.6+13,z*2.6+27),jit:(hsh(i*3,j*7)-0.5)*1.6});
  }}
})();
var FAULTPTS=(function(){
  var out=[];
  for(var k=0;k<=36;k++){
    var z=-1+2*k/36,x=faultX(z)+noise(z*4.1+7,3.3)*0.028;
    out.push({x:x,z:z,y:depthAt(x,z)-0.004,gap:hsh(k,61)>0.84});
  }
  return out;
})();
var EPI={x:faultX(0.15),z:0.15,y:depthAt(faultX(0.15),0.15)-0.01};

/* ---------- topology (mirrors the live twin) ---------- */
function mkNode(x,z,kind,id,role){return {x:x,z:z,y:depthAt(x,z)-0.02,kind:kind,id:id,role:role};}
var chain=[],relays=[],habs=[],i;
var chainZ=[0.80,0.44,0.08,-0.30,-0.62,-0.92];
for(i=0;i<chainZ.length;i++){
  chain.push(mkNode(faultX(chainZ[i])-0.10-0.03*Math.sin(i*2.1),chainZ[i],'demand','F-10'+(i+1),
    'Seafloor seismic + pressure sensor'));
}
var relayPos=[[0.10,-0.55],[0.16,0.05],[0.12,0.62],[0.45,-0.35],[0.50,0.25],[0.42,0.78],
  [0.72,-0.08],[0.78,0.50],[0.30,-0.75],[0.62,-0.55],[0.28,0.40],[0.60,0.68]];
for(i=0;i<relayPos.length;i++){
  relays.push(mkNode(relayPos[i][0],relayPos[i][1],'relay','R-2'+(i<9?'0':'')+(i+1),'Acoustic relay node'));
}
habs.push(mkNode(0.60,0.58,'habitat','H-301','Habitat sensor · temperature (coral ridge)'));
habs.push(mkNode(0.74,-0.34,'habitat','H-302','Habitat sensor · dissolved O₂ (seagrass)'));
habs.push(mkNode(0.16,0.86,'habitat','H-303','Habitat sensor · turbidity'));
var BS={x:0.92,z:0.06,y:0,kind:'bs',id:'BS-1',role:'Surface gateway buoy'};
var allNodes=chain.concat(relays,habs);
var byId={};for(i=0;i<allNodes.length;i++){byId[allNodes[i].id]=allNodes[i];}byId[BS.id]=BS;
function d2(a,b){var dx=a.x-b.x,dz=a.z-b.z;return dx*dx+dz*dz;}
var TREE=(function(){
  var map={};
  for(var k=0;k<allNodes.length;k++){
    var a=allNodes[k],best=BS,bd=d2(a,BS);
    for(var m=0;m<allNodes.length;m++){
      var b=allNodes[m];
      if(b===a){continue;}
      if(d2(b,BS)>=d2(a,BS)-0.02){continue;}
      var dd=d2(a,b);
      if(dd<bd){bd=dd;best=b;}
    }
    map[a.id]=best;
  }
  return map;
})();
function treePath(n){
  var pts=[n],c=n,g=0;
  while(c!==BS&&g<14){c=TREE[c.id]||BS;pts.push(c);g++;}
  return pts;
}
function hops(n){return treePath(n).length-1;}
var SRC=chain[3];
var path1=[SRC,relays[1],relays[4],relays[7],BS];   /* primary  (solid)  */
var path2=[SRC,relays[0],relays[3],relays[6],BS];   /* backup   (dashed) */
/* awakening order: buoy outward, node i activates at AW.t0 + i*AW.stag */
var AWORDER=allNodes.slice().sort(function(a,b){
  var ha=hops(a),hb=hops(b);
  return ha!==hb?ha-hb:d2(a,BS)-d2(b,BS);
});
var AW={pulse:0.55,t0:0.45,stag:0.088,confirm:0,end:0};
AW.confirm=AW.t0+AWORDER.length*AW.stag+0.10;   /* ≈2.40 s */
AW.end=AW.confirm+0.10;

/* ---------- habitat zones + vegetation + threats ---------- */
function mkZone(cx,cz,r,seed,name){
  var pts=[];
  for(var k=0;k<24;k++){
    var th=k/24*6.2832;
    var rr=r*(0.72+0.55*n2(seed+Math.cos(th)*1.4+3,seed+Math.sin(th)*1.4+8));
    pts.push({x:cx+Math.cos(th)*rr,z:cz+Math.sin(th)*rr*0.82});
  }
  return {cx:cx,cz:cz,r:r,pts:pts,name:name};
}
var ZCORAL=mkZone(0.58,0.56,0.20,4.2,'Coral habitat');
var ZGRASS=mkZone(0.74,-0.36,0.19,9.7,'Seagrass meadow');
var BLADES=(function(){
  var out=[];
  for(var k=0;k<34;k++){
    var th=hsh(k,51)*6.2832,rr=Math.sqrt(hsh(k,53))*ZGRASS.r*0.85;
    var x=ZGRASS.cx+Math.cos(th)*rr,z=ZGRASS.cz+Math.sin(th)*rr*0.8;
    out.push({x:x,z:z,y:depthAt(x,z),h:5+hsh(k,57)*7,ph:hsh(k,59)*6.28});
  }
  return out;
})();
var CORALS=(function(){
  var out=[];
  for(var k=0;k<22;k++){
    var th=hsh(k,31)*6.2832,rr=Math.sqrt(hsh(k,37))*ZCORAL.r*0.85;
    var x=ZCORAL.cx+Math.cos(th)*rr,z=ZCORAL.cz+Math.sin(th)*rr*0.8;
    out.push({x:x,z:z,y:depthAt(x,z),s:2.2+hsh(k,41)*3.2,v:hsh(k,43)});
  }
  return out;
})();
var MINES=[[-0.78,-0.45],[-0.95,0.30],[-0.52,0.68]].map(function(p,k){
  var d=depthAt(p[0],p[1]);
  return {x:p[0],z:p[1],y:d-0.012,id:'MN-'+(k+1)};
});
/* tracked contact: mid-water, shown with an uncertainty region (never a bare point) */
var S01={x:-0.62,z:0.12,y:0.42,id:'S-01',conf:0.62,ur:0.11};

/* ---------- camera ---------- */
var cam={yaw:-0.45,pitch:0.28,zoom:1,panX:0,panY:0};
var camTw=null;                    /* {from,to,t0,dur} — easeOutQuint, then full stop */
var yawS=0,yawC=1,S=1,DH=1,PT=0.28,CX=0,TY=0,SC=1;
var A={x:0,y:0},B={x:0,y:0};
function camApply(){
  yawS=Math.sin(cam.yaw);yawC=Math.cos(cam.yaw);
  PT=cam.pitch;
  S=Math.min(W*0.45,H*1.05)*cam.zoom;
  DH=H*0.55*cam.zoom;
  SC=clamp(S/420,0.7,1.5);
  CX=W*0.5+cam.panX;
  TY=H*0.24-(cam.zoom-1)*H*0.16+cam.panY;
}
function proj(x,y,z,o){
  var rx=x*yawC-z*yawS,rz=x*yawS+z*yawC;
  o.x=CX+rx*S;o.y=TY+rz*S*PT+y*DH;
}
/* focus move: bring world point P near screen anchor with target zoom/yaw */
function focusOn(p,zoom,yaw){
  var save={yaw:cam.yaw,pitch:cam.pitch,zoom:cam.zoom,panX:cam.panX,panY:cam.panY};
  cam.yaw=yaw;cam.zoom=zoom;cam.panX=0;cam.panY=0;
  camApply();proj(p.x,p.y||0,p.z,A);
  var to={yaw:yaw,pitch:save.pitch,zoom:zoom,
    panX:clamp(W*0.5-A.x,-W*0.3,W*0.3),
    panY:clamp(H*0.47-A.y,-H*0.25,H*0.25)};
  cam.yaw=save.yaw;cam.pitch=save.pitch;cam.zoom=save.zoom;cam.panX=save.panX;cam.panY=save.panY;
  camApply();
  if(REDUCED){cam.yaw=to.yaw;cam.pitch=to.pitch;cam.zoom=to.zoom;cam.panX=to.panX;cam.panY=to.panY;camTw=null;return;}
  camTw={from:{yaw:cam.yaw,pitch:cam.pitch,zoom:cam.zoom,panX:cam.panX,panY:cam.panY},to:to,t0:tN,dur:0.62};
}
function camTick(){
  if(!camTw){return false;}
  var q=(tN-camTw.t0)/camTw.dur;
  if(q>=1){
    cam.yaw=camTw.to.yaw;cam.pitch=camTw.to.pitch;cam.zoom=camTw.to.zoom;
    cam.panX=camTw.to.panX;cam.panY=camTw.to.panY;camTw=null;return false;
  }
  var e=outQuint(q);
  cam.yaw=lerp(camTw.from.yaw,camTw.to.yaw,e);
  cam.pitch=lerp(camTw.from.pitch,camTw.to.pitch,e);
  cam.zoom=lerp(camTw.from.zoom,camTw.to.zoom,e);
  cam.panX=lerp(camTw.from.panX,camTw.to.panX,e);
  cam.panY=lerp(camTw.from.panY,camTw.to.panY,e);
  return true;
}

/* ---------- state machine ---------- */
/* phase: 'pre' → 'awaken' → 'live'.  REDUCED starts directly at 'live'. */
var tN=0;                          /* scene clock, frozen while paused        */
var phase=REDUCED?'live':'pre';
var awT0=-1;                       /* tN when awakening started               */
var layers={network:true,security:true,habitat:true,seismic:true};
var SPOTS=['network','security','habitat','seismic'];
var spotIdx=-1,spotT0=-1,SPOT_DUR=8,cycleFrom=-1;
var em={network:0,security:0,habitat:0,seismic:0};       /* emphasis 0..1    */
var emT={network:0,security:0,habitat:0,seismic:0};      /* targets          */
var paused=false,hovering=false,exploring=false,holdUntil=-1;
var sel=null,pickables=[],cycleIdx=-1;
var packets=[],rings=[],pktSlot=-1;
var secT0=-1,seiT0=-1;             /* one-shot per-spotlight timers           */
var routeAlpha=REDUCED?1:0;        /* routes fade in near the end of awakening*/

function nodeOn(n){
  if(phase==='live'){return 1;}
  if(phase==='pre'||awT0<0){return 0;}
  var at=AW.t0;
  for(var k=0;k<AWORDER.length;k++){if(AWORDER[k]===n){at=AW.t0+k*AW.stag;break;}}
  return ss(0.28,(tN-awT0)-at);
}
function alphaMul(cat){
  if(spotIdx<0){return 1;}
  var e=em[SPOTS[spotIdx]];
  return cat===SPOTS[spotIdx]?1:1-0.62*e;
}
function guidedRunning(){
  return phase==='live'&&!REDUCED&&!paused&&!sel&&!exploring&&!hovering&&tN>holdUntil;
}

/* ---------- DOM refs ---------- */
var stateEl=document.getElementById('tw-state'),
    annEl=document.getElementById('tw-announce'),
    plqTitle=document.getElementById('plq-title'),
    plqText=document.getElementById('plq-text'),
    plqTag=document.getElementById('plq-tag'),
    plqDl=document.getElementById('plq-fields'),
    btnPause=document.getElementById('tw-pause'),
    btnExplore=document.getElementById('tw-explore'),
    ctrlBox=document.getElementById('tw-controls');
function announce(msg){if(annEl){annEl.textContent=msg;}}

var PLQ={
  pre:    ['Standing by','Acoustic sensor field deployed on the fault-zone shelf. Awaiting synchronization pulse from surface gateway BS-1.'],
  awaken: ['Synchronizing','Acoustic sync pulse from gateway BS-1 propagating through the relay topology…'],
  synced: ['Network synchronized','All 21 sensors reporting to surface gateway BS-1 over the convergecast topology. Guided observation begins shortly.'],
  network:['Network topology','Data packets follow the convergecast routes to gateway BS-1. Solid cyan: primary route · dashed: backup route (k = 2).'],
  security:['Security picture','Tracked contact S-01 is shown with an amber positional-uncertainty region — never as an exact point. Charted mines MN-1…3 hold red threat radii.'],
  habitat:['Habitat observation','Coral-ridge and seagrass observation areas monitored by sensors H-301–H-303 (temperature, dissolved O₂, turbidity).'],
  seismic:['Seismic monitoring','A single microquake wavefront propagates along fault FZ-1; arrival order across the seafloor array constrains the epicentre.'],
  reduced:['Network overview','Static view (reduced motion): full topology with primary and backup routes, security contacts, habitat areas, and the FZ-1 fault trace. Use the layer controls to filter.']
};
var plqFadeTimer=0;
function setPlaque(key){
  var it=PLQ[key];if(!it){return;}
  if(REDUCED){plqTitle.textContent=it[0];plqText.textContent=it[1];return;}
  plqText.classList.add('fading');
  clearTimeout(plqFadeTimer);
  plqFadeTimer=setTimeout(function(){
    plqTitle.textContent=it[0];plqText.textContent=it[1];
    plqText.classList.remove('fading');
  },210);
}
function setState(txt){if(stateEl.textContent!==txt){stateEl.textContent=txt;}}
function stateLine(){
  if(REDUCED){return 'STATIC · REDUCED MOTION';}
  if(paused){return 'PAUSED';}
  if(sel){return 'SELECTED: '+sel.id;}
  if(phase==='pre'){return 'STANDBY';}
  if(phase==='awaken'){return 'SYNC IN PROGRESS';}
  if(spotIdx>=0){return 'AUTO · SPOTLIGHT: '+SPOTS[spotIdx].toUpperCase();}
  return 'SYNCHRONIZED';
}

/* ---------- guided cycle ---------- */
function enterSpot(idx){
  spotIdx=idx;spotT0=tN;
  var s=SPOTS[idx];
  for(var k in emT){emT[k]=0;}
  emT[s]=1;
  secT0=s==='security'?tN:-1;
  seiT0=s==='seismic'?tN:-1;
  if(s==='network'){focusOn({x:0.35,z:0.05,y:0.25},1.0,-0.45);}
  else if(s==='security'){focusOn({x:-0.66,z:0.05,y:0.3},1.16,-0.32);}
  else if(s==='habitat'){focusOn({x:0.62,z:0.15,y:0.3},1.16,-0.52);}
  else{focusOn({x:EPI.x,z:EPI.z,y:EPI.y*0.7},1.10,-0.42);}
  setPlaque(s);
  announce('Spotlight: '+PLQ[s][0]+'. '+PLQ[s][1]);
}
function emTick(dt){
  var moved=false;
  for(var k in em){
    var d=emT[k]-em[k];
    if(Math.abs(d)>0.001){em[k]+=d*Math.min(1,dt*6);moved=true;}
    else if(em[k]!==emT[k]){em[k]=emT[k];}
  }
  return moved;
}

/* ---------- packets (network spotlight only) ---------- */
function stepPackets(dt){
  if(spotIdx>=0&&SPOTS[spotIdx]==='network'&&layers.network){
    var slot=Math.floor((tN-spotT0)/1.35);
    if(slot!==pktSlot&&tN-spotT0>0.62){
      pktSlot=slot;
      var n=allNodes[Math.floor(hsh(slot,5)*allNodes.length)];
      packets.push({pts:treePath(n),seg:0,u:0});
    }
  }
  var pi=packets.length;
  while(pi--){
    var p=packets[pi];
    p.u+=dt/0.8;
    while(p.u>1){
      p.u-=1;p.seg++;
      if(p.seg>=p.pts.length-1){
        rings.push({x:BS.x,y:BS.y,z:BS.z,r1:0.05,t0:tN,life:1.2,col:COL.net});
        packets.splice(pi,1);break;
      }
    }
  }
  var ri=rings.length;
  while(ri--){if(tN-rings[ri].t0>rings[ri].life){rings.splice(ri,1);}}
}

/* ---------- drawing ---------- */
function groundEllipse(p,r,strokeStyle,width,dash,fillStyle){
  proj(p.x,p.y,p.z,A);
  if(fillStyle){ctx.fillStyle=fillStyle;ctx.beginPath();ctx.ellipse(A.x,A.y,r*S,r*S*PT,0,0,6.2832);ctx.fill();}
  if(strokeStyle){
    ctx.strokeStyle=strokeStyle;ctx.lineWidth=width||1;
    if(dash){ctx.setLineDash(dash);}
    ctx.beginPath();ctx.ellipse(A.x,A.y,r*S,r*S*PT,0,0,6.2832);ctx.stroke();
    ctx.setLineDash([]);
  }
}
function drawSurface(){
  /* static swell: frozen phase — the observatory stays spatially calm */
  var XA=-1.9,XB=1.9,ZA=-1.35,ZB=1.05,SXC=26,SZC=5;
  function wv(x,z){return 0.008*Math.sin(x*6.1+3.8)+0.005*Math.sin((x*0.4+z)*8.7+1.3)
    +0.004*Math.sin((x-z*0.6)*11.3+4.1);}
  proj(0,wv(0,-1),-1,A);var backY=A.y;
  var sk=ctx.createLinearGradient(0,0,0,Math.max(backY,10));
  sk.addColorStop(0,'rgba(140,205,228,0.30)');
  sk.addColorStop(0.7,'rgba(90,160,190,0.10)');
  sk.addColorStop(1,'rgba(90,160,190,0)');
  ctx.fillStyle=sk;ctx.fillRect(0,0,W,Math.max(backY,10));
  for(var j=0;j<SZC;j++){
    var z0=ZA+(ZB-ZA)*j/SZC,z1=ZA+(ZB-ZA)*(j+1)/SZC;
    ctx.fillStyle='rgba(152,214,234,'+(0.026+0.05*(1-j/(SZC-1))).toFixed(3)+')';
    ctx.beginPath();
    for(var i2=0;i2<=SXC;i2++){
      var x=XA+(XB-XA)*i2/SXC;proj(x,wv(x,z0),z0,A);
      if(i2===0){ctx.moveTo(A.x,A.y);}else{ctx.lineTo(A.x,A.y);}
    }
    for(i2=SXC;i2>=0;i2--){
      var x2=XA+(XB-XA)*i2/SXC;proj(x2,wv(x2,z1),z1,A);ctx.lineTo(A.x,A.y);
    }
    ctx.closePath();ctx.fill();
  }
}
function drawTerrain(){
  for(var idx=0;idx<gw.length;idx++){
    var gp=gw[idx];
    var rx=gp.x*yawC-gp.z*yawS,rz=gp.x*yawS+gp.z*yawC;
    gsx[idx]=CX+rx*S;gsy[idx]=TY+rz*S*PT+gp.d*DH;
  }
  for(var j=0;j<GZ-1;j++){
    var far=1-j/(GZ-2);
    for(var i2=0;i2<GX-1;i2++){
      idx=j*GX+i2;
      var q0=gw[idx];
      var dA=(q0.d+gw[idx+1].d+gw[idx+GX+1].d+gw[idx+GX].d)*0.25;
      var lit=clamp(((q0.d-gw[idx+1].d)*18+(q0.d-gw[idx+GX].d)*5)*0.8,-0.6,1.1);
      var deep=ss(0.25,dA-0.52);
      var hue=lerp(33+q0.m*8,205,deep*0.5);
      var sat=lerp(23+q0.m*6,12,deep);
      var L=55-40*dA+lit*9+q0.jit;
      ctx.fillStyle='hsla('+hue.toFixed(0)+','+sat.toFixed(0)+'%,'+L.toFixed(1)+'%,'+(0.9-far*0.22).toFixed(3)+')';
      ctx.beginPath();
      ctx.moveTo(gsx[idx],gsy[idx]);ctx.lineTo(gsx[idx+1],gsy[idx+1]);
      ctx.lineTo(gsx[idx+GX+1],gsy[idx+GX+1]);ctx.lineTo(gsx[idx+GX],gsy[idx+GX]);
      ctx.closePath();ctx.fill();
    }
  }
  var fog=ctx.createLinearGradient(0,H*0.45,0,H);
  fog.addColorStop(0,'rgba(5,15,24,0)');fog.addColorStop(1,'rgba(5,15,24,0.5)');
  ctx.fillStyle=fog;ctx.fillRect(0,H*0.45,W,H*0.55);
}
function drawFault(){
  for(var strand=0;strand<2;strand++){
    ctx.strokeStyle=strand===0?'rgba(10,10,12,0.5)':'rgba(12,14,16,0.32)';
    ctx.lineWidth=strand===0?2:1.2;
    ctx.beginPath();var pen=false;
    for(var k=0;k<FAULTPTS.length;k++){
      var fp=FAULTPTS[k];
      if(fp.gap&&strand===0){pen=false;continue;}
      proj(fp.x+strand*0.045-0.01,fp.y,fp.z,A);
      if(!pen){ctx.moveTo(A.x,A.y);pen=true;}else{ctx.lineTo(A.x,A.y);}
    }
    ctx.stroke();
  }
  if(!layers.seismic){return;}
  var am=alphaMul('seismic');
  ctx.strokeStyle='rgba('+COL.sei+','+(0.30*am).toFixed(3)+')';
  ctx.lineWidth=1;ctx.setLineDash([3,6]);
  ctx.beginPath();
  for(var k2=0;k2<FAULTPTS.length;k2++){
    proj(FAULTPTS[k2].x,FAULTPTS[k2].y-0.006,FAULTPTS[k2].z,A);
    if(k2===0){ctx.moveTo(A.x,A.y);}else{ctx.lineTo(A.x,A.y);}
  }
  ctx.stroke();ctx.setLineDash([]);
  proj(FAULTPTS[3].x,FAULTPTS[3].y-0.02,FAULTPTS[3].z,A);
  ctx.font='600 9px '+MONO;
  ctx.fillStyle='rgba(255,178,126,'+(0.6*am).toFixed(2)+')';
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText('FZ-1 · active fault',A.x+8,A.y);
}
function drawZones(){
  var k;
  for(k=0;k<CORALS.length;k++){
    var c=CORALS[k];proj(c.x,c.y,c.z,A);
    var s2=c.s*SC;
    ctx.lineWidth=1.1;
    for(var b=0;b<3;b++){
      var ba=-0.5+b*0.5+(c.v-0.5)*0.6;
      ctx.strokeStyle=c.v>0.5?'rgba(196,142,132,0.42)':'rgba(205,170,120,0.40)';
      ctx.beginPath();ctx.moveTo(A.x,A.y);
      ctx.quadraticCurveTo(A.x+ba*s2*0.7,A.y-s2*0.7,A.x+ba*s2,A.y-s2*1.25);
      ctx.stroke();
    }
  }
  /* seagrass: sway only while the habitat spotlight is active (slow drift) */
  var sway0=(spotIdx>=0&&SPOTS[spotIdx]==='habitat'&&!REDUCED&&!paused)?1:0;
  for(k=0;k<BLADES.length;k++){
    var g2=BLADES[k];proj(g2.x,g2.y,g2.z,A);
    var sway=sway0*Math.sin(tN*0.8+g2.ph)*2.0;
    ctx.strokeStyle='rgba(96,148,96,0.45)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(A.x,A.y);
    ctx.quadraticCurveTo(A.x+sway*0.5,A.y-g2.h*SC*0.6,A.x+sway,A.y-g2.h*SC);
    ctx.stroke();
  }
  if(!layers.habitat){return;}
  var am=alphaMul('habitat');
  var zs=[ZCORAL,ZGRASS];
  for(var zi=0;zi<zs.length;zi++){
    var zn=zs[zi];
    ctx.beginPath();
    for(k=0;k<zn.pts.length;k++){
      var p=zn.pts[k];proj(p.x,depthAt(p.x,p.z)-0.006,p.z,A);
      if(k===0){ctx.moveTo(A.x,A.y);}else{ctx.lineTo(A.x,A.y);}
    }
    ctx.closePath();
    ctx.fillStyle='rgba('+COL.hab+','+(0.05*am).toFixed(3)+')';ctx.fill();
    ctx.strokeStyle='rgba('+COL.hab+','+(0.32*am).toFixed(3)+')';
    ctx.lineWidth=1;ctx.setLineDash([2,5]);ctx.stroke();ctx.setLineDash([]);
    proj(zn.cx,depthAt(zn.cx,zn.cz)-0.05,zn.cz,A);
    ctx.font='9px '+MONO;
    ctx.fillStyle='rgba(127,227,192,'+(0.62*am).toFixed(2)+')';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(zn.name,A.x,A.y);
  }
}
function drawLinks(){
  if(!layers.network){return;}
  var am=alphaMul('network');
  for(var k=0;k<allNodes.length;k++){
    var a=allNodes[k],b=TREE[a.id];if(!b){continue;}
    var on=Math.min(nodeOn(a),1);
    if(on<=0.02){continue;}
    proj(a.x,a.y,a.z,A);var ax=A.x,ay=A.y;
    proj(b.x,b.y,b.z,A);
    ctx.strokeStyle='rgba('+COL.netDim+','+(0.17*on*am).toFixed(3)+')';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(ax,ay);
    /* stroke progression: the edge grows from the parent toward the node */
    ctx.lineTo(lerp(A.x,ax,on),lerp(A.y,ay,on));
    ctx.stroke();
  }
}
function pathStroke(pts){
  ctx.beginPath();
  for(var k=0;k<pts.length;k++){proj(pts[k].x,pts[k].y,pts[k].z,A);
    if(k===0){ctx.moveTo(A.x,A.y);}else{ctx.lineTo(A.x,A.y);}}
  ctx.stroke();
}
function drawPaths(){
  if(!layers.network||routeAlpha<=0.02){return;}
  var am=alphaMul('network')*routeAlpha;
  ctx.setLineDash([]);
  ctx.lineWidth=1.8;
  ctx.strokeStyle='rgba('+COL.net+','+(0.55*am).toFixed(3)+')';
  pathStroke(path1);
  ctx.setLineDash([5,7]);ctx.lineWidth=1.3;
  ctx.strokeStyle='rgba('+COL.net+','+(0.38*am).toFixed(3)+')';
  pathStroke(path2);
  ctx.setLineDash([]);
}
function drawMines(){
  for(var k=0;k<MINES.length;k++){
    var m=MINES[k];proj(m.x,m.y,m.z,A);
    var r=7.5*SC;
    ctx.fillStyle='rgba(5,8,12,0.45)';
    ctx.beginPath();ctx.ellipse(A.x,A.y+r*0.55,r*1.3,r*0.42,0,0,6.2832);ctx.fill();
    if(layers.security){
      var am=alphaMul('security');
      groundEllipse(m,0.24,'rgba('+COL.threat+','+(0.22*am).toFixed(3)+')',1.2,[4,5]);
    }
    var sg=ctx.createRadialGradient(A.x-r*0.4,A.y-r*0.5,r*0.15,A.x,A.y,r*1.15);
    sg.addColorStop(0,'#3D4A58');sg.addColorStop(0.55,'#232B36');sg.addColorStop(1,'#0C1117');
    ctx.fillStyle=sg;
    ctx.beginPath();ctx.arc(A.x,A.y,r,0,6.2832);ctx.fill();
    ctx.strokeStyle='rgba(170,195,210,0.30)';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(A.x,A.y,r,0,6.2832);ctx.stroke();
    if(layers.security){
      ctx.fillStyle='rgba('+COL.threat+','+(0.85*alphaMul('security')).toFixed(2)+')';
      ctx.beginPath();ctx.arc(A.x,A.y-r*0.15,1.5*SC,0,6.2832);ctx.fill();
    }
    pick(A.x,A.y,r+6,{kind:'mine',ref:m,id:m.id});
  }
}
function drawContact(){
  if(!layers.security){return;}
  var am=alphaMul('security');
  /* uncertainty region first — one slow expansion when the spotlight lands */
  var pulse=0;
  if(secT0>=0&&!REDUCED&&!paused){
    var q=clamp((tN-secT0-0.62)/3.2,0,1);
    pulse=Math.sin(q*3.1416)*outQuart(q<0.5?q*2:1);
  }
  var ur=S01.ur*(1+0.22*pulse);
  groundEllipse({x:S01.x,z:S01.z,y:depthAt(S01.x,S01.z)-0.004},ur,
    'rgba('+COL.amber+','+((0.30+0.14*pulse)*am).toFixed(3)+')',1.2,[3,4],
    'rgba('+COL.amber+','+(0.05*am).toFixed(3)+')');
  proj(S01.x,S01.y,S01.z,A);
  ctx.save();ctx.translate(A.x,A.y);
  ctx.fillStyle='rgba(26,36,47,'+(0.95*am).toFixed(2)+')';
  ctx.beginPath();ctx.ellipse(0,0,17*SC,4.6*SC,0,0,6.2832);ctx.fill();
  ctx.fillStyle='rgba(44,57,71,'+(0.95*am).toFixed(2)+')';
  ctx.fillRect(-3*SC,-8.4*SC,6.4*SC,5*SC);
  ctx.restore();
  ctx.font='600 9px '+MONO;
  ctx.fillStyle='rgba(240,205,150,'+(0.75*am).toFixed(2)+')';
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText('S-01 · UNKNOWN',A.x+22*SC,A.y-9*SC);
  pick(A.x,A.y,18*SC,{kind:'contact',ref:S01,id:'S-01'});
}
function drawSensors(){
  for(var k=0;k<allNodes.length;k++){
    var n=allNodes[k];
    var on=nodeOn(n);
    proj(n.x,n.y,n.z,A);
    var s2=SC*1.18*(0.72+0.28*outQuart(on));
    /* tripod frame */
    ctx.strokeStyle=on>0.5?'rgba(140,170,185,0.45)':'rgba(120,130,140,0.35)';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(A.x-3.4*s2,A.y+3*s2);ctx.lineTo(A.x,A.y-1.5*s2);
    ctx.lineTo(A.x+3.4*s2,A.y+3*s2);
    ctx.moveTo(A.x,A.y-1.5*s2);ctx.lineTo(A.x,A.y+3*s2);
    ctx.stroke();
    /* housing: gray while offline, kind color once operational */
    var col;
    if(n.kind==='demand'){col=on>0.5?'#DFF6FF':'#5A646E';}
    else if(n.kind==='habitat'){col=on>0.5?'#8CE8C6':'#5A646E';}
    else{col=on>0.5?'#9BD8E8':'#5A646E';}
    ctx.globalAlpha=0.45+0.55*on;
    ctx.fillStyle=col;
    if(n.kind==='demand'){
      ctx.save();ctx.translate(A.x,A.y-2.2*s2);ctx.rotate(0.7854);
      ctx.fillRect(-2.3*s2,-2.3*s2,4.6*s2,4.6*s2);ctx.restore();
    }else{
      ctx.beginPath();ctx.arc(A.x,A.y-2.2*s2,2.2*s2,0,6.2832);ctx.fill();
    }
    ctx.globalAlpha=1;
    /* activation flash: one restrained ring as the node comes online */
    if(on>0&&on<1){
      ctx.strokeStyle='rgba('+COL.net+','+(0.5*(1-on)).toFixed(3)+')';
      ctx.lineWidth=1.2;
      ctx.beginPath();ctx.ellipse(A.x,A.y-1.2*s2,(4+10*on)*s2,(4+10*on)*s2*0.55,0,0,6.2832);
      ctx.stroke();
    }
    pick(A.x,A.y-1.5*s2,10*s2,{kind:'sensor',ref:n,id:n.id});
  }
}
function drawSeismicWave(){
  if(!layers.seismic||seiT0<0||REDUCED){return;}
  var age=tN-seiT0-0.65;
  if(age<0){return;}
  var Rmax=0.85,R=age*0.24;
  var am=alphaMul('seismic');
  if(R<Rmax&&!paused){
    var fade=1-ss(0.25,R-Rmax+0.25);
    groundEllipse(EPI,R,'rgba('+COL.sei+','+(0.32*fade*am).toFixed(3)+')',1.6);
    groundEllipse(EPI,Math.max(0,R-0.05),'rgba('+COL.seiAlt+','+(0.22*fade*am).toFixed(3)+')',1.2);
  }
  proj(EPI.x,EPI.y,EPI.z,A);
  ctx.strokeStyle='rgba('+COL.sei+','+(0.8*am).toFixed(2)+')';
  ctx.lineWidth=1.4;
  ctx.beginPath();
  ctx.moveTo(A.x-5*SC,A.y);ctx.lineTo(A.x+5*SC,A.y);
  ctx.moveTo(A.x,A.y-4*SC);ctx.lineTo(A.x,A.y+4*SC);
  ctx.stroke();
  ctx.font='600 9px '+MONO;
  ctx.fillStyle='rgba(255,178,126,'+(0.85*am).toFixed(2)+')';
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText('M 3.4 (sim)',A.x+8*SC,A.y-6*SC);
}
function drawEpicentreStatic(){
  /* reduced motion: the epicentre marker stays, no wave */
  if(!layers.seismic||!REDUCED){return;}
  proj(EPI.x,EPI.y,EPI.z,A);
  ctx.strokeStyle='rgba('+COL.sei+',0.8)';ctx.lineWidth=1.4;
  ctx.beginPath();
  ctx.moveTo(A.x-5*SC,A.y);ctx.lineTo(A.x+5*SC,A.y);
  ctx.moveTo(A.x,A.y-4*SC);ctx.lineTo(A.x,A.y+4*SC);
  ctx.stroke();
  groundEllipse(EPI,0.3,'rgba('+COL.sei+',0.20)',1.2,[3,6]);
  ctx.font='600 9px '+MONO;
  ctx.fillStyle='rgba(255,178,126,0.85)';
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText('M 3.4 (sim)',A.x+8*SC,A.y-6*SC);
}
function drawPackets(){
  if(!layers.network){return;}
  for(var k=0;k<packets.length;k++){
    var p=packets[k];
    var a2=p.pts[p.seg],b2=p.pts[p.seg+1];
    if(!b2){continue;}
    var ue=p.u*p.u*(3-2*p.u);
    proj(lerp(a2.x,b2.x,ue),lerp(a2.y,b2.y,ue),lerp(a2.z,b2.z,ue),A);
    var ut=Math.max(0,ue-0.14);
    proj(lerp(a2.x,b2.x,ut),lerp(a2.y,b2.y,ut),lerp(a2.z,b2.z,ut),B);
    var tg=ctx.createLinearGradient(B.x,B.y,A.x,A.y);
    tg.addColorStop(0,'rgba('+COL.net+',0)');
    tg.addColorStop(1,'rgba('+COL.net+',0.55)');
    ctx.strokeStyle=tg;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(B.x,B.y);ctx.lineTo(A.x,A.y);ctx.stroke();
    ctx.fillStyle='rgba('+COL.net+',0.9)';
    ctx.beginPath();ctx.arc(A.x,A.y,2.2,0,6.2832);ctx.fill();
  }
}
function drawRings(){
  for(var k=0;k<rings.length;k++){
    var rg=rings[k],age=tN-rg.t0;
    if(age<0||age>rg.life){continue;}
    var q=age/rg.life;
    proj(rg.x,rg.y,rg.z,A);
    ctx.strokeStyle='rgba('+rg.col+','+(0.3*(1-q)).toFixed(3)+')';
    ctx.lineWidth=1.1;
    ctx.beginPath();ctx.ellipse(A.x,A.y,(0.006+rg.r1*q)*S,(0.006+rg.r1*q)*S*PT,0,0,6.2832);
    ctx.stroke();
  }
}
function drawAwakenPulse(){
  if(phase!=='awaken'||awT0<0){return;}
  var age=tN-awT0;
  if(age>AW.pulse+0.25){return;}
  var q=clamp(age/AW.pulse,0,1),e=outQuart(q);
  proj(BS.x,BS.y,BS.z,A);
  ctx.strokeStyle='rgba('+COL.net+','+(0.5*(1-e)).toFixed(3)+')';
  ctx.lineWidth=1.6;
  ctx.beginPath();ctx.ellipse(A.x,A.y,e*0.24*S,e*0.24*S*PT,0,0,6.2832);ctx.stroke();
  ctx.strokeStyle='rgba('+COL.net+','+(0.28*(1-e)).toFixed(3)+')';
  ctx.beginPath();ctx.ellipse(A.x,A.y,e*0.15*S,e*0.15*S*PT,0,0,6.2832);ctx.stroke();
}
function drawBuoy(){
  proj(BS.x,0,BS.z,A);
  proj(BS.x,depthAt(BS.x,BS.z),BS.z,B);
  ctx.setLineDash([2,5]);
  ctx.strokeStyle='rgba(160,200,215,0.16)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(A.x,A.y+3);ctx.lineTo(B.x,B.y);ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle='rgba(200,235,245,0.5)';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.ellipse(A.x,A.y,10*SC,3.4*SC,0,0,6.2832);ctx.stroke();
  ctx.fillStyle='#E5AE55';
  ctx.beginPath();ctx.ellipse(A.x,A.y-1.5,5.5*SC,2.6*SC,0,0,6.2832);ctx.fill();
  ctx.strokeStyle='#C9E8F2';ctx.lineWidth=1.4;
  ctx.beginPath();ctx.moveTo(A.x,A.y-2);ctx.lineTo(A.x,A.y-15*SC);ctx.stroke();
  ctx.fillStyle='rgba(255,224,180,0.85)';
  ctx.beginPath();ctx.arc(A.x,A.y-17*SC,2*SC,0,6.2832);ctx.fill();
  ctx.font='600 10px '+MONO;
  ctx.fillStyle='rgba(210,235,245,0.75)';
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText('BS-1',A.x+15*SC,A.y-8);
  pick(A.x,A.y-6,14*SC,{kind:'bs',ref:BS,id:'BS-1'});
}
function drawSelection(){
  if(!sel){return;}
  var p=sel.ref;
  proj(p.x,p.y!==undefined?p.y:0,p.z,A);
  var r=15*SC,g=5*SC;
  ctx.strokeStyle='rgba(235,248,252,0.85)';ctx.lineWidth=1.4;
  ctx.beginPath();
  ctx.moveTo(A.x-r,A.y-r+g);ctx.lineTo(A.x-r,A.y-r);ctx.lineTo(A.x-r+g,A.y-r);
  ctx.moveTo(A.x+r-g,A.y-r);ctx.lineTo(A.x+r,A.y-r);ctx.lineTo(A.x+r,A.y-r+g);
  ctx.moveTo(A.x+r,A.y+r-g);ctx.lineTo(A.x+r,A.y+r);ctx.lineTo(A.x+r-g,A.y+r);
  ctx.moveTo(A.x-r+g,A.y+r);ctx.lineTo(A.x-r,A.y+r);ctx.lineTo(A.x-r,A.y+r-g);
  ctx.stroke();
  if(sel.kind==='sensor'){
    groundEllipse(byId[sel.id],0.19,'rgba(150,220,240,0.22)',1,[3,5]);
    var pth=treePath(byId[sel.id]);
    ctx.strokeStyle='rgba('+COL.net+',0.55)';ctx.lineWidth=1.8;
    pathStroke(pth);
  }
}
function drawHUD(){
  var ink='rgba(190,225,238,0.62)',dim='rgba(150,190,205,0.40)';
  var cy0=H-(W<640?96:58),cx0=28;
  ctx.strokeStyle=dim;ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(cx0,cy0,12,0,6.2832);ctx.stroke();
  ctx.save();ctx.translate(cx0,cy0);ctx.rotate(-cam.yaw);
  ctx.strokeStyle=ink;ctx.lineWidth=1.4;
  ctx.beginPath();ctx.moveTo(0,6);ctx.lineTo(0,-8);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-3,-4);ctx.lineTo(0,-8);ctx.lineTo(3,-4);ctx.stroke();
  ctx.restore();
  ctx.font='600 9px '+MONO;ctx.fillStyle=ink;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('N',cx0,cy0-18);
  var kmOpts=[0.25,0.5,1,2],km=0.25;
  for(var ki=0;ki<kmOpts.length;ki++){if(kmOpts[ki]/KM*S<=130){km=kmOpts[ki];}}
  var bl=km/KM*S,bx=cx0+24,by=cy0+6;
  ctx.strokeStyle=ink;ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(bx,by-3);ctx.lineTo(bx,by);ctx.lineTo(bx+bl,by);ctx.lineTo(bx+bl,by-3);
  ctx.stroke();
  ctx.textAlign='left';ctx.textBaseline='alphabetic';
  ctx.font='9px '+MONO;
  ctx.fillText(km<1?(km*1000)+' m':km+' km',bx+bl+7,by+3);
}
function drawVignette(){
  var v=ctx.createRadialGradient(W*0.5,H*0.42,H*0.25,W*0.5,H*0.42,Math.max(W,H)*0.78);
  v.addColorStop(0,'rgba(3,10,16,0)');v.addColorStop(1,'rgba(3,10,16,0.5)');
  ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
}
function drawFrame(){
  camApply();
  pickables.length=0;
  var g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0D3247');g.addColorStop(0.45,'#071B29');g.addColorStop(1,'#040E17');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  drawSurface();
  drawTerrain();
  drawFault();
  drawZones();
  drawLinks();
  drawPaths();
  drawMines();
  drawContact();
  drawSensors();
  drawSeismicWave();
  drawEpicentreStatic();
  drawPackets();
  drawRings();
  drawAwakenPulse();
  drawBuoy();
  drawSelection();
  drawVignette();
  drawHUD();
}

/* ---------- picking + detail plaque ---------- */
function pick(sx,sy,r,obj){pickables.push({sx:sx,sy:sy,r:r,o:obj});}
function pickAt(x,y){
  var best=null,bd=1e9;
  var th=matchMedia('(pointer: coarse)').matches?24:15;
  for(var k=0;k<pickables.length;k++){
    var p=pickables[k];
    var dx=p.sx-x,dy=p.sy-y,dd=Math.sqrt(dx*dx+dy*dy)-p.r;
    if(dd<bd){bd=dd;best=p;}
  }
  return (best&&bd<th)?best.o:null;
}
function fld(rows){
  var h='';
  for(var k=0;k<rows.length;k++){h+='<dt>'+rows[k][0]+'</dt><dd>'+rows[k][1]+'</dd>';}
  plqDl.innerHTML=h;plqDl.hidden=false;
}
function select(o,msg){
  sel=o;
  if(!o){
    plqDl.hidden=true;plqDl.innerHTML='';
    if(msg){announce(msg);}
    setPlaque(REDUCED?'reduced':(spotIdx>=0?SPOTS[spotIdx]:'synced'));
    requestDraw();
    return;
  }
  var n,rows;
  if(o.kind==='sensor'){
    n=byId[o.id];
    plqTitle.textContent=o.id+' · '+(n.kind==='demand'?'OBS sensor':n.kind==='habitat'?'Habitat sensor':'Relay node');
    plqText.textContent=n.role+'. Selected — spotlight locked; automatic cycling resumes when the selection is cleared.';
    rows=[
      ['Depth',Math.round(n.y*1000)+' m'],
      ['Hops → BS',String(hops(n))],
      ['Route','→ '+(TREE[n.id]?TREE[n.id].id:'BS-1')],
      ['Status',phase==='live'||nodeOn(n)>=1?'Nominal — reporting':'Synchronizing'],
      ['Data','Simulated']];
  }else if(o.kind==='mine'){
    plqTitle.textContent=o.id+' · Moored mine';
    plqText.textContent='Bottom-seated contact mine, charted. Static threat with a fixed effect radius; symbol not to scale.';
    rows=[
      ['Depth',Math.round(o.ref.y*1000)+' m'],
      ['Effect radius','600 m'],
      ['Severity','Low · charted'],
      ['Data','Simulated']];
  }else if(o.kind==='contact'){
    plqTitle.textContent='S-01 · Tracked contact';
    plqText.textContent='Class Unknown. Position estimate carries an uncertainty region (amber); no exact point is claimed.';
    rows=[
      ['Class','Unknown'],
      ['Depth','≈ '+Math.round(S01.y*1000)+' m'],
      ['Pos. confidence',Math.round(S01.conf*100)+'%'],
      ['Data','Simulated']];
  }else{
    plqTitle.textContent='BS-1 · Surface gateway buoy';
    plqText.textContent='Acoustic → RF gateway. Origin of the synchronization pulse; all convergecast routes terminate here.';
    rows=[
      ['Position','Surface · moored'],
      ['Sensors reporting','21 / 21'],
      ['Uplink','Satellite · nominal'],
      ['Data','Simulated']];
  }
  fld(rows);
  announce('Selected '+o.id);
  requestDraw();
}

/* ---------- interaction ---------- */
var drag=null,decel=null;
cv.addEventListener('pointerdown',function(e){
  drag={x:e.clientX,y:e.clientY,moved:false,vx:0,type:e.pointerType};
  decel=null;holdUntil=tN+6;
});
cv.addEventListener('pointermove',function(e){
  if(!drag){return;}
  var dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.moved&&Math.sqrt(dx*dx+dy*dy)>4){
    drag.moved=true;cv.classList.add('dragging');
    camTw=null;                      /* direct manipulation wins immediately */
    try{cv.setPointerCapture(e.pointerId);}catch(_){}
  }
  if(drag.moved){
    cam.yaw+=dx*0.005;
    if(drag.type!=='touch'){cam.pitch=clamp(cam.pitch-dy*0.0022,0.15,0.44);}
    drag.vx=dx*0.005;
    drag.x=e.clientX;drag.y=e.clientY;
    holdUntil=tN+6;
    requestDraw();
  }
});
function endDrag(e){
  if(!drag){return;}
  var wasClick=!drag.moved;
  if(drag.moved&&Math.abs(drag.vx)>0.002&&!REDUCED){
    decel={v:clamp(drag.vx,-0.05,0.05)};   /* brief glide, then a full stop */
  }
  drag=null;cv.classList.remove('dragging');
  if(wasClick&&e){
    var r=cv.getBoundingClientRect();
    var o=pickAt(e.clientX-r.left,e.clientY-r.top);
    select(o,o?null:'Selection cleared');
  }
  holdUntil=tN+6;
}
cv.addEventListener('pointerup',endDrag);
cv.addEventListener('pointercancel',function(){drag=null;cv.classList.remove('dragging');});
cv.addEventListener('pointerenter',function(){hovering=true;});
cv.addEventListener('pointerleave',function(){hovering=false;});
cv.addEventListener('focus',function(){holdUntil=tN+6;});
cv.addEventListener('wheel',function(e){
  if(!e.ctrlKey&&!e.metaKey){return;}
  e.preventDefault();
  cam.zoom=clamp(cam.zoom*(e.deltaY<0?1.12:0.89),0.65,1.9);
  holdUntil=tN+6;requestDraw();
},{passive:false});
cv.addEventListener('keydown',function(e){
  var kc=e.key;
  holdUntil=tN+6;
  if(kc==='ArrowRight'||kc==='ArrowDown'||kc==='ArrowLeft'||kc==='ArrowUp'){
    e.preventDefault();
    if(!pickables.length){requestDraw();return;}
    var list=pickables.slice().sort(function(a,b){return a.sx-b.sx;});
    cycleIdx=(kc==='ArrowRight'||kc==='ArrowDown')?
      (cycleIdx+1)%list.length:(cycleIdx-1+list.length)%list.length;
    select(list[cycleIdx].o);
  }else if(kc==='Enter'||kc===' '){
    e.preventDefault();
    if(!sel&&pickables.length){cycleIdx=0;select(pickables[0].o);}
  }else if(kc==='Escape'){select(null,'Selection cleared');}
  else if(kc==='+'||kc==='='){cam.zoom=clamp(cam.zoom*1.15,0.65,1.9);requestDraw();}
  else if(kc==='-'||kc==='_'){cam.zoom=clamp(cam.zoom/1.15,0.65,1.9);requestDraw();}
});

/* pause / explore / layers / zoom */
function setPaused(v){
  paused=v;
  btnPause.setAttribute('aria-pressed',String(v));
  btnPause.querySelector('span').textContent=v?'Resume':'Pause';
  announce(v?'Automatic motion paused':'Automatic motion resumed');
  requestDraw();
}
btnPause.addEventListener('click',function(){setPaused(!paused);});
btnExplore.addEventListener('click',function(){
  exploring=!exploring;
  btnExplore.setAttribute('aria-pressed',String(exploring));
  btnExplore.setAttribute('aria-expanded',String(exploring));
  ctrlBox.hidden=!exploring;
  host.classList.toggle('explore',exploring);
  announce(exploring?'Explore mode: layer filters, legend and zoom available. Automatic cycling paused.'
    :'Explore mode closed. Automatic cycling resumes.');
  holdUntil=tN+2;
  requestDraw();
});
var layerBtns=host.querySelectorAll('.twin-layers button');
function syncLayerBtns(){
  var all=layers.network&&layers.security&&layers.habitat&&layers.seismic;
  for(var k=0;k<layerBtns.length;k++){
    var b=layerBtns[k],l=b.getAttribute('data-layer');
    b.setAttribute('aria-pressed',l==='all'?String(all):String(!!layers[l]));
  }
}
for(i=0;i<layerBtns.length;i++){
  layerBtns[i].addEventListener('click',function(){
    var l=this.getAttribute('data-layer');
    if(l==='all'){layers.network=layers.security=layers.habitat=layers.seismic=true;}
    else{layers[l]=!layers[l];}
    syncLayerBtns();
    announce(l==='all'?'All layers on':l+' layer '+(layers[l]?'on':'off'));
    requestDraw();
  });
}
document.getElementById('tw-zin').addEventListener('click',function(){
  cam.zoom=clamp(cam.zoom*1.25,0.65,1.9);requestDraw();});
document.getElementById('tw-zout').addEventListener('click',function(){
  cam.zoom=clamp(cam.zoom/1.25,0.65,1.9);requestDraw();});

/* ---------- loop / lifecycle ---------- */
var raf=0,prevNow=0,vis=!document.hidden,inView=true,needDraw=true;
function requestDraw(){
  needDraw=true;
  if(REDUCED||!raf){singleFrame();}
}
function singleFrame(){camApply();drawFrame();setState(stateLine());needDraw=false;}
function animating(){
  if(paused){return false;}
  if(phase==='awaken'){return true;}
  if(camTw||decel){return true;}
  if(packets.length||rings.length){return true;}
  if(spotIdx>=0){
    var s=SPOTS[spotIdx];
    if(s==='network'&&guidedRunning()){return true;}
    if(s==='habitat'&&guidedRunning()){return true;}
    if(s==='security'&&secT0>=0&&tN-secT0<4.2){return true;}
    if(s==='seismic'&&seiT0>=0&&tN-seiT0<5.2){return true;}
  }
  for(var k in em){if(em[k]!==emT[k]){return true;}}
  return false;
}
function tick(now){
  if(!vis||!inView){raf=0;return;}
  var dt=Math.min(0.05,(now-prevNow)/1000);prevNow=now;
  var isAnim=animating();
  if(!paused){tN+=dt;}
  /* awakening progression */
  if(phase==='awaken'&&tN-awT0>=AW.confirm&&routeAlpha<1){
    routeAlpha=Math.min(1,routeAlpha+dt*4);
  }
  if(phase==='awaken'&&tN-awT0>=1.6){
    routeAlpha=Math.min(1,routeAlpha+dt*1.5);
  }
  if(phase==='awaken'&&tN-awT0>=AW.end){
    phase='live';routeAlpha=1;
    cycleFrom=tN+3.5;
    setPlaque('synced');
    announce('Network synchronized. All 21 sensors reporting.');
    rings.push({x:BS.x,y:BS.y,z:BS.z,r1:0.08,t0:tN,life:1.2,col:COL.net});
  }
  /* guided cycle scheduling */
  if(phase==='live'&&!paused){
    if(spotIdx<0&&cycleFrom>0&&tN>=cycleFrom&&guidedRunning()){enterSpot(0);}
    else if(spotIdx>=0&&guidedRunning()&&tN-spotT0>SPOT_DUR){enterSpot((spotIdx+1)%SPOTS.length);}
  }
  var moved=false;
  if(!paused){
    moved=camTick()||moved;
    moved=emTick(dt)||moved;
    if(decel){
      cam.yaw+=decel.v;decel.v*=0.86;
      if(Math.abs(decel.v)<0.0004){decel=null;}
      moved=true;
    }
    stepPackets(dt);
  }
  if(isAnim||moved||needDraw){singleFrame();}
  raf=requestAnimationFrame(tick);
}
function setRunning(){
  if(REDUCED){return;}
  if(vis&&inView&&!raf){prevNow=performance.now();raf=requestAnimationFrame(tick);}
  if((!vis||!inView)&&raf){cancelAnimationFrame(raf);raf=0;}
}
function resize(){
  var r=host.getBoundingClientRect();
  W=Math.max(1,r.width);H=Math.max(1,r.height);
  cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  singleFrame();
}
if(window.ResizeObserver){new ResizeObserver(resize).observe(host);}
else{window.addEventListener('resize',resize);}

/* ---------- boot: static-first, then awaken after idle ---------- */
resize();                              /* frame 0: complete muted scene       */
syncLayerBtns();
if(REDUCED){
  setPlaque('reduced');
  setState(stateLine());
  /* no rAF loop: every control renders single frames on demand */
}else{
  setPlaque('pre');
  document.addEventListener('visibilitychange',function(){vis=!document.hidden;setRunning();});
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){inView=en[0].isIntersecting;setRunning();},{threshold:0.05})
      .observe(host);
  }
  setRunning();
  var kick=function(){
    setTimeout(function(){
      if(phase!=='pre'){return;}
      phase='awaken';awT0=tN;
      setPlaque('awaken');
      announce('Acoustic synchronization pulse transmitted from gateway BS-1.');
    },700);
  };
  if('requestIdleCallback' in window){requestIdleCallback(kick,{timeout:1200});}
  else{window.addEventListener('load',kick);kick();}
}
})();
