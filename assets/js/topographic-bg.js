/*
 * Interior topographic background for huguryildiz.com.
 * Visual direction adapted from Radiant's "Topographic Contour Map":
 * https://github.com/pbakaus/radiant
 *
 * Radiant is MIT licensed.
 * Copyright (c) 2025 Paul Bakaus
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */
(function(){
  'use strict';

  var canvas=document.querySelector('.topographic-bg');
  if(!canvas)return;
  var ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return;

  var motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  var animated=!motion.matches;
  var frame=0;
  var lastPaint=0;
  var image=null;
  var width=0;
  var height=0;
  var rgb=[224,154,106];
  var resizeFrame=0;
  var random=new Float32Array(65536);
  var seed=73;

  for(var r=0;r<random.length;r++){
    seed=(seed*16807)%2147483647;
    random[r]=(seed-1)/2147483646;
  }

  function fade(t){
    return t*t*t*(t*(t*6-15)+10);
  }

  function mix(a,b,t){
    return a+(b-a)*t;
  }

  function noise(x,y){
    var ix=Math.floor(x);
    var iy=Math.floor(y);
    var fx=fade(x-ix);
    var fy=fade(y-iy);
    var x0=ix&255;
    var x1=(ix+1)&255;
    var y0=(iy&255)<<8;
    var y1=((iy+1)&255)<<8;
    return mix(
      mix(random[y0+x0],random[y0+x1],fx),
      mix(random[y1+x0],random[y1+x1],fx),
      fy
    );
  }

  function field(x,y,time){
    var value=0;
    var amplitude=.54;
    var frequency=1;
    var total=0;
    for(var octave=0;octave<4;octave++){
      value+=noise(
        x*frequency+time*(.072+octave*.009),
        y*frequency-time*(.046+octave*.006)
      )*amplitude;
      total+=amplitude;
      amplitude*=.5;
      frequency*=2.03;
    }
    return value/total;
  }

  function smoothstep(a,b,value){
    var t=Math.max(0,Math.min(1,(value-a)/(b-a)));
    return t*t*(3-2*t);
  }

  function readColor(){
    var color=getComputedStyle(canvas).color.match(/[\d.]+/g);
    if(color&&color.length>=3)rgb=[
      Math.round(Number(color[0])),
      Math.round(Number(color[1])),
      Math.round(Number(color[2]))
    ];
  }

  function size(){
    var scale=window.innerWidth<680?0.32:0.38;
    width=Math.max(1,Math.ceil(window.innerWidth*scale));
    height=Math.max(1,Math.ceil((window.innerHeight-64)*scale));
    canvas.width=width;
    canvas.height=height;
    image=ctx.createImageData(width,height);
    readColor();
  }

  function paint(time){
    if(!image)size();
    var pixels=image.data;
    var levels=9;
    var aspect=width/Math.max(1,height);
    var offset=0;

    for(var y=0;y<height;y++){
      var ny=(y/height-.5)*5.8;
      for(var x=0;x<width;x++){
        var nx=(x/width-.5)*5.8*aspect;
        var elevation=field(nx,ny,time);
        var stepped=elevation*levels;
        var fraction=stepped-Math.floor(stepped);
        var distance=Math.min(fraction,1-fraction);
        var line=1-smoothstep(.018,.092,distance);
        var major=Math.floor(stepped)%3===0?1:.58;
        var alpha=Math.round(118*line*major);

        pixels[offset]=rgb[0];
        pixels[offset+1]=rgb[1];
        pixels[offset+2]=rgb[2];
        pixels[offset+3]=alpha;
        offset+=4;
      }
    }
    ctx.putImageData(image,0,0);
  }

  function loop(timestamp){
    frame=0;
    if(document.hidden||!animated)return;
    if(timestamp-lastPaint>=66){
      lastPaint=timestamp;
      paint(timestamp/1000);
    }
    frame=requestAnimationFrame(loop);
  }

  function start(){
    if(frame||document.hidden||!animated)return;
    frame=requestAnimationFrame(loop);
  }

  function stop(){
    if(frame)cancelAnimationFrame(frame);
    frame=0;
  }

  function queueResize(){
    if(resizeFrame)cancelAnimationFrame(resizeFrame);
    resizeFrame=requestAnimationFrame(function(){
      resizeFrame=0;
      size();
      paint(performance.now()/1000);
      start();
    });
  }

  function motionChanged(event){
    animated=!event.matches;
    if(animated)start();
    else{
      stop();
      paint(0);
    }
  }

  window.addEventListener('resize',queueResize,{passive:true});
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)stop();
    else start();
  });
  if(motion.addEventListener)motion.addEventListener('change',motionChanged);
  else if(motion.addListener)motion.addListener(motionChanged);

  new MutationObserver(function(){
    readColor();
    paint(animated?performance.now()/1000:0);
  }).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

  size();
  paint(0);
  start();
})();
