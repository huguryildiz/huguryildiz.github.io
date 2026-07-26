---
layout: academic
title: "Courses & Teaching – Hüseyin Uğur Yıldız"
description: "Courses taught at TED University by Hüseyin Uğur Yıldız — probability, signals and systems, communication systems, optimization for networks — and teaching philosophy."
permalink: /teaching/
modified: 2026-07-26
---

<div class="shell">
  <header class="pagehead"><h1 id="teaching-h1">Teaching</h1></header>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-calendar"/></svg>Current courses at TED University</h2>
  <div class="course-motion">
    <button class="btn btn-quiet course-motion-toggle" id="courseMotionToggle" type="button"
      aria-pressed="false" aria-describedby="courseMotionNote">
      <svg class="motion-pause" aria-hidden="true"><use href="#i-pause"/></svg>
      <svg class="motion-play" aria-hidden="true"><use href="#i-play"/></svg>
      <span>Pause animations</span>
    </button>
    <p id="courseMotionNote">Course previews play silently when they enter the viewport and pause off-screen.</p>
    <span class="sr-only" id="courseMotionStatus" aria-live="polite"></span>
  </div>
  <h3 class="sub">Undergraduate</h3>

  <article class="swproject">
    <video class="course-video" data-src="/assets/video/courses/hero-ee304.mp4"
      poster="/assets/images/courses/ee304.webp" loop muted playsinline preload="none"
      aria-hidden="true"></video>
    <div>
      {% assign course = site.data.cv.courses | where: "code", "EE 304" | first %}<h3>{{ course.code }} — {{ course.name }}</h3>
      <p>A third-year undergraduate course covering probability models, discrete and continuous
        random variables, joint and conditional distributions, correlation, covariance, and expectation.</p>
      <div class="links"><span class="tag">{{ course.terms_web }}</span>
        <a class="ext" href="https://www.tedu.edu.tr/ee-304" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-link"/></svg> Course catalog</a></div>
    </div>
  </article>

  <article class="swproject">
    <video class="course-video" data-src="/assets/video/courses/hero-ee311.mp4"
      poster="/assets/images/courses/ee311.webp" loop muted playsinline preload="none"
      aria-hidden="true"></video>
    <div>
      {% assign course = site.data.cv.courses | where: "code", "EE 311" | first %}<h3>{{ course.code }} — {{ course.name }}</h3>
      <p>A third-year undergraduate course covering continuous-time and discrete-time signals,
        linear systems, Fourier analysis, and sampling theory.</p>
      <div class="links"><span class="tag">{{ course.terms_web }}</span>
        <a class="ext" href="https://www.tedu.edu.tr/ee-311" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-link"/></svg> Course catalog</a></div>
    </div>
  </article>

  <article class="swproject">
    <video class="course-video" data-src="/assets/video/courses/hero-ee413.mp4"
      poster="/assets/images/courses/ee413.webp" loop muted playsinline preload="none"
      aria-hidden="true"></video>
    <div>
      {% assign course = site.data.cv.courses | where: "code", "EE 413" | first %}<h3>{{ course.code }} — {{ course.name }}</h3>
      <p>A senior-level undergraduate course covering digital communication systems, sampling,
        quantization, digital modulation, receiver design, noise effects, and introductory
        information theory concepts.</p>
      <div class="links"><span class="tag">{{ course.terms_web }}</span>
        <a class="ext" href="https://www.tedu.edu.tr/ee-413" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-link"/></svg> Course catalog</a></div>
    </div>
  </article>

  <article class="swproject">
    <video class="course-video" data-src="/assets/video/courses/hero-ee491.mp4"
      poster="/assets/images/courses/ee491.webp" loop muted playsinline preload="none"
      aria-hidden="true"></video>
    <div>
      <h3>EE 491 / EE 492 — Senior Design Project I &amp; II</h3>
      <p>A two-semester capstone sequence focused on the design and implementation of an electrical
        and electronics engineering system, emphasizing engineering analysis, technical reporting,
        and teamwork.</p>
      <div class="links">
        <span class="tag">EE 491: Fall 2016 — present</span>
        <a class="ext" href="https://www.tedu.edu.tr/ee-491" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-link"/></svg> EE 491 catalog</a>
        <span class="tag">EE 492: Spring 2017 — present</span>
        <a class="ext" href="https://www.tedu.edu.tr/ee-492" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-link"/></svg> EE 492 catalog</a>
      </div>
    </div>
  </article>

  <h3 class="sub">Graduate</h3>

  <article class="swproject">
    <video class="course-video" data-src="/assets/video/courses/hero-ee512.mp4"
      poster="/assets/images/courses/ee512.webp" loop muted playsinline preload="none"
      aria-hidden="true"></video>
    <div>
      {% assign course = site.data.cv.courses | where: "code", "EE 512" | first %}<h3>{{ course.code }} — {{ course.name }}</h3>
      <p>Graduate-level course covering optimization techniques for communication networks,
        including linear, integer, mixed-integer programming, network flows, and wireless network
        applications.</p>
      <div class="links"><span class="tag">{{ course.terms_web }}</span>
        <a class="ext" href="https://www.tedu.edu.tr/ee-512" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-link"/></svg> Course catalog</a></div>
    </div>
  </article>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-clock"/></svg>Previously taught courses at TED University</h2>

  <article class="swproject">
    <video class="course-video" data-src="/assets/video/courses/hero-ee205.mp4"
      poster="/assets/images/courses/ee205.webp" loop muted playsinline preload="none"
      aria-hidden="true"></video>
    <div>
      {% assign course = site.data.cv.courses | where: "code", "EE 205" | first %}<h3>{{ course.code }} — {{ course.name }}</h3>
      <p>A second-year undergraduate course introducing MATLAB-based software tools and
        computational methods for electrical engineering applications.</p>
      <div class="links"><span class="tag">{{ course.terms_web }}</span>
        <a class="ext" href="https://www.tedu.edu.tr/ee-205" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-link"/></svg> Course catalog</a></div>
    </div>
  </article>

  <article class="swproject">
    <video class="course-video" data-src="/assets/video/courses/hero-ee312.mp4"
      poster="/assets/images/courses/ee312.webp" loop muted playsinline preload="none"
      aria-hidden="true"></video>
    <div>
      {% assign course = site.data.cv.courses | where: "code", "EE 312" | first %}<h3>{{ course.code }} — {{ course.name }}</h3>
      <p>A third-year undergraduate course covering communication systems, modulation techniques,
        and noise analysis.</p>
      <div class="links"><span class="tag">{{ course.terms_web }}</span>
        <a class="ext" href="https://www.tedu.edu.tr/ee-312" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-link"/></svg> Course catalog</a></div>
    </div>
  </article>

  <article class="swproject">
    <video class="course-video" data-src="/assets/video/courses/hero-ee462.mp4"
      poster="/assets/images/courses/ee462.webp" loop muted playsinline preload="none"
      aria-hidden="true"></video>
    <div>
      {% assign course = site.data.cv.courses | where: "code", "EE 462" | first %}<h3>{{ course.code }} — {{ course.name }}</h3>
      <p>A senior-level undergraduate course covering power system modeling, load flow, fault
        analysis, smart grids, and renewables.</p>
      <div class="links"><span class="tag">{{ course.terms_web }}</span>
        <a class="ext" href="https://www.tedu.edu.tr/ee-462" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-link"/></svg> Course catalog</a></div>
    </div>
  </article>

  <p style="margin-top:1.6rem;">Course materials, including lecture notes and supplementary
    resources, are available through the
    <a class="ext" href="https://lms.tedu.edu.tr/" target="_blank" rel="noopener"><i class="ai ai-moodle" aria-hidden="true"></i> TEDU LMS</a>.</p>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-bulb"/></svg>Teaching philosophy and pedagogical approach</h2>
  <p>My teaching philosophy integrates <b>theory, practice, and active learning</b> to foster
    independent thinking and lifelong learning. I emphasize:</p>
  <ul class="dotlist">
    <li>Interactive classroom discussions that promote collaborative problem-solving</li>
    <li>Two-stage collaborative quizzes combining group work with individual assessment</li>
    <li>Use of modern computational tools (e.g., MATLAB, tablets) for live problem-solving and visualization</li>
    <li>Connecting theoretical concepts to real-world engineering applications</li>
    <li>Preparing students for both industry and research careers</li>
  </ul>
  <p style="margin-top:1em;">My goal is to create an engaging and supportive learning environment
    that helps students develop strong analytical and problem-solving skills.</p>
</div>

<script>
(function(){
  var videos=Array.prototype.slice.call(document.querySelectorAll('.course-video'));
  var toggle=document.getElementById('courseMotionToggle');
  var toggleText=toggle.querySelector('span');
  var status=document.getElementById('courseMotionStatus');
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
  var pausedByUser=false;

  function motionReduced(){
    return !!(reduced&&reduced.matches);
  }
  function loadVideo(video){
    if(video.getAttribute('src'))return;
    video.setAttribute('src',video.getAttribute('data-src'));
    video.load();
  }
  function shouldPlay(video){
    return video.hasAttribute('data-in-view')&&!pausedByUser&&!motionReduced()&&!document.hidden;
  }
  function syncVideo(video){
    video.muted=true;
    video.defaultMuted=true;
    if(shouldPlay(video)){
      loadVideo(video);
      var playback=video.play();
      if(playback&&playback.catch)playback.catch(function(){});
    }else{
      video.pause();
      if(motionReduced()&&video.currentTime)video.currentTime=0;
    }
  }
  function updateControl(announce){
    var forced=motionReduced();
    var paused=forced||pausedByUser;
    toggle.disabled=forced;
    toggle.setAttribute('aria-pressed',String(paused));
    toggleText.textContent=forced?'Animations disabled by motion preference':
      (pausedByUser?'Resume animations':'Pause animations');
    if(announce)status.textContent=forced?'Course animations are disabled by your reduced-motion preference.':
      (pausedByUser?'Course animations paused.':'Course animations resumed.');
  }
  function syncAll(announce){
    videos.forEach(syncVideo);
    updateControl(announce);
  }

  toggle.addEventListener('click',function(){
    pausedByUser=!pausedByUser;
    syncAll(true);
  });

  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting)entry.target.setAttribute('data-in-view','');
        else entry.target.removeAttribute('data-in-view');
        syncVideo(entry.target);
      });
    },{rootMargin:'180px 0px',threshold:.12});
    videos.forEach(function(video){observer.observe(video);});
  }else{
    videos.forEach(function(video){video.setAttribute('data-in-view','');});
  }

  document.addEventListener('visibilitychange',function(){syncAll(false);});
  syncAll(false);
  if(reduced){
    if(reduced.addEventListener)reduced.addEventListener('change',function(){syncAll(true);});
    else if(reduced.addListener)reduced.addListener(function(){syncAll(true);});
  }
})();
</script>
