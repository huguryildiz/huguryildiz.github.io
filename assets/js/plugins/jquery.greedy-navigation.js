/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $vlinks_persist_tail = $vlinks.children("*.persist.tail");
var $hlinks = $('#site-nav .hidden-links');

var breaks = [];
var MOBILE_BREAKPOINT = 768;
var wasMobile = null;

function isMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function moveAllToVisible() {
  while ($hlinks.children().length > 0) {
    if ($vlinks_persist_tail.length > 0) {
      $hlinks.children().first().insertBefore($vlinks_persist_tail);
    } else {
      $hlinks.children().first().appendTo($vlinks);
    }
  }
  breaks = [];
}

function forceMobileMode() {
  while ($vlinks.children("*:not(.persist)").length > 0) {
    $vlinks.children("*:not(.persist)").last().prependTo($hlinks);
  }
  if ($hlinks.children().length > 0) {
    $btn.removeClass("hidden");
  }
}

function updateNav() {
  var mobile = isMobile();

  if (mobile) {
    if (wasMobile !== true) {
      moveAllToVisible();
      forceMobileMode();
      wasMobile = true;
    }

    var mastheadHeight = $('.masthead').height();
    $('body').css('padding-top', mastheadHeight + 'px');
    if ($(".author__urls-wrapper button").is(":visible")) {
      $(".sidebar").css("padding-top", "");
    } else {
      $(".sidebar").css("padding-top", mastheadHeight + "px");
    }
    return;
  }

  // Desktop mode
  if (wasMobile !== false) {
    moveAllToVisible();
    $btn.addClass('hidden');
    $btn.removeClass('close');
    $hlinks.addClass('hidden');
    wasMobile = false;
  }

  var availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width() - 30;

  if ($vlinks.width() > availableSpace) {
    while ($vlinks.width() > availableSpace && $vlinks.children("*:not(.persist)").length > 0) {
      breaks.push($vlinks.width());
      $vlinks.children("*:not(.persist)").last().prependTo($hlinks);
      availableSpace = $btn.hasClass("hidden") ? $nav.width() : $nav.width() - $btn.width() - 30;
      $btn.removeClass("hidden");
    }
  } else {
    while (breaks.length > 0 && availableSpace > breaks[breaks.length - 1]) {
      if ($vlinks_persist_tail.children().length > 0) {
        $hlinks.children().first().insertBefore($vlinks_persist_tail);
      } else {
        $hlinks.children().first().appendTo($vlinks);
      }
      breaks.pop();
    }

    if (breaks.length < 1) {
      $btn.addClass('hidden');
      $btn.removeClass('close');
      $hlinks.addClass('hidden');
    }
  }

  $btn.attr("count", breaks.length);

  var mastheadHeight = $('.masthead').height();
  $('body').css('padding-top', mastheadHeight + 'px');
  if ($(".author__urls-wrapper button").is(":visible")) {
    $(".sidebar").css("padding-top", "");
  } else {
    $(".sidebar").css("padding-top", mastheadHeight + "px");
  }
}

// Window listeners

$(window).on('resize', function () {
  updateNav();
});
screen.orientation.addEventListener("change", function () {
  updateNav();
});

$btn.on('click', function () {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
});

updateNav();
