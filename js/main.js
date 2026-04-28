// ─── BDS Main Script ─────────────────────────────────────────
// Runs after DOM is ready (sections are pre-rendered by build script)

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initNav() {
  var burger = document.getElementById('navBurger');
  var overlay = document.getElementById('navMobileOverlay');

  if (!burger || !overlay) return;

  function setNavOpen(isOpen) {
    burger.classList.toggle('open', isOpen);
    overlay.classList.toggle('open', isOpen);
    overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-open', isOpen);

    if (!isOpen) {
      overlay.querySelectorAll('details[open]').forEach(function(item) {
        item.removeAttribute('open');
      });
    }
  }

  burger.addEventListener('click', function() {
    setNavOpen(!burger.classList.contains('open'));
  });

  overlay.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      setNavOpen(false);
    });
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && burger.classList.contains('open')) {
      setNavOpen(false);
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && burger.classList.contains('open')) {
      setNavOpen(false);
    }
  });
}

function initReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  if (prefersReducedMotion) {
    reveals.forEach(function(el) { el.classList.add('visible'); });
    return;
  }

  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function(el) {
    revealObserver.observe(el);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

var heroRotationInterval = null;
function initHeroRotation() {
  if (prefersReducedMotion) return;

  var rotatingWord = document.querySelector('.hero-rotating-word');
  if (!rotatingWord) return;

  var words = ['artists.', 'builders.', 'studios.', 'brands.', 'founders.', 'teams.'];
  var wordIndex = 0;

  heroRotationInterval = setInterval(function() {
    rotatingWord.classList.add('fade-out');
    setTimeout(function() {
      wordIndex = (wordIndex + 1) % words.length;
      rotatingWord.textContent = words[wordIndex];
      rotatingWord.classList.remove('fade-out');
    }, 400);
  }, 2500);
}
// Cleanup helper for future SPA use
function destroyHeroRotation() {
  if (heroRotationInterval) {
    clearInterval(heroRotationInterval);
    heroRotationInterval = null;
  }
}

function safePlay(video) {
  var playPromise = video.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(function() {});
  }
}

function initManagedVideos() {
  document.querySelectorAll('video').forEach(function(video) {
    var shouldForcePlay = video.classList.contains('hero-bg-video');

    if (prefersReducedMotion && !shouldForcePlay) {
      video.pause();
      video.removeAttribute('autoplay');
      return;
    }

    if (video.hasAttribute('data-autoplay')) {
      video.muted = true;
      video.defaultMuted = true;
      video.autoplay = true;
      video.playsInline = true;
      safePlay(video);
    }
  });

  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState !== 'visible') return;
    document.querySelectorAll('.hero-bg-video').forEach(safePlay);
  });

  window.addEventListener('touchstart', function() {
    document.querySelectorAll('.hero-bg-video').forEach(safePlay);
  }, { once: true, passive: true });
}

function initVideoCycling() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.premium-card-cycle').forEach(function(video) {
    var sources = (video.getAttribute('data-videos') || '').split(',');
    if (sources.length < 2) return;

    var index = 0;
    video.addEventListener('ended', function() {
      index = (index + 1) % sources.length;
      video.src = sources[index];
      safePlay(video);
    });
  });
}

function initLazyVideos() {
  if (prefersReducedMotion) return;

  var lazyVideos = document.querySelectorAll('video[data-lazy]');
  if (lazyVideos.length === 0) return;

  var videoObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        safePlay(entry.target);
        videoObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  lazyVideos.forEach(function(video) {
    videoObserver.observe(video);
  });
}

function initStaggeredReveal() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.pillars-grid .pillar-card').forEach(function(card, index) {
    card.style.transitionDelay = (index * 0.06) + 's';
  });
}

function initOpenRolesAccordion() {
  document.querySelectorAll('.or-list').forEach(function(list) {
    var rows = Array.prototype.slice.call(list.querySelectorAll('.or-row'));
    if (rows.length === 0) return;

    rows.forEach(function(row) {
      row.addEventListener('toggle', function() {
        if (!row.open) return;
        rows.forEach(function(otherRow) {
          if (otherRow !== row) otherRow.open = false;
        });
      });
    });
  });
}

function initMobileSwipeTracks() {
  var tracks = document.querySelectorAll('.mobile-swipe-track[data-mobile-slider]');
  if (tracks.length === 0) return;

  var isMobile = window.matchMedia('(max-width: 640px)');

  tracks.forEach(function(track) {
    var sliderName = track.getAttribute('data-mobile-slider');
    var dotsRoot = document.querySelector('.mobile-swipe-dots[data-slider-dots="' + sliderName + '"]');
    if (!dotsRoot) return;

    var items = Array.prototype.slice.call(track.children);
    if (items.length === 0) return;

    var dots = [];
    var ticking = false;

    function getActiveIndex() {
      var currentLeft = track.scrollLeft;
      var activeIndex = 0;
      var closestDistance = Infinity;

      items.forEach(function(item, index) {
        var distance = Math.abs(item.offsetLeft - currentLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          activeIndex = index;
        }
      });

      return activeIndex;
    }

    function updateDots() {
      if (!isMobile.matches) return;
      var activeIndex = getActiveIndex();
      dots.forEach(function(dot, index) {
        dot.classList.toggle('is-active', index === activeIndex);
      });
    }

    function requestDotUpdate() {
      if (!isMobile.matches || ticking) return;
      ticking = true;
      window.requestAnimationFrame(function() {
        updateDots();
        ticking = false;
      });
    }

    items.forEach(function(item, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'mobile-swipe-dot';
      dot.setAttribute('aria-label', 'Go to item ' + (index + 1));
      dot.addEventListener('click', function() {
        track.scrollTo({
          left: item.offsetLeft,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
      dotsRoot.appendChild(dot);
      dots.push(dot);
    });

    track.addEventListener('scroll', requestDotUpdate, { passive: true });

    var refresh = function() {
      if (!isMobile.matches) {
        dots.forEach(function(dot) { dot.classList.remove('is-active'); });
        return;
      }
      updateDots();
    };

    if (typeof isMobile.addEventListener === 'function') {
      isMobile.addEventListener('change', refresh);
    } else if (typeof isMobile.addListener === 'function') {
      isMobile.addListener(refresh);
    }

    window.addEventListener('resize', refresh);
    refresh();
  });
}

function initBDS() {
  initNav();
  initMobileSwipeTracks();
  initReveal();
  initSmoothScroll();
  initHeroRotation();
  initManagedVideos();
  initVideoCycling();
  initLazyVideos();
  initStaggeredReveal();
  initOpenRolesAccordion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBDS);
} else {
  initBDS();
}
