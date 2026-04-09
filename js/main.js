// ─── BDS Main Script ─────────────────────────────────────────
// Runs after DOM is ready (sections are pre-rendered by build script)

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initBDS() {
  // ─── NAV SCROLL ──────────────────────────────────────────────
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ─── MOBILE NAV TOGGLE ──────────────────────────────────────
  var toggle = document.getElementById('mobileToggle');
  var navLinks = document.querySelector('.nav-links');
  var navCta = document.querySelector('.nav-cta');
  if (toggle) {
    toggle.addEventListener('click', function() {
      var isOpen = toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (navLinks) navLinks.classList.toggle('nav-open');
      if (navCta) navCta.classList.toggle('nav-open');
    });
    // Close mobile nav when a link is clicked
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('nav-open');
          if (navCta) navCta.classList.remove('nav-open');
        });
      });
    }
  }

  // ─── SCROLL REVEAL ───────────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    // Immediately show all reveal elements without animation
    reveals.forEach(function(el) { el.classList.add('visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function(el) { revealObserver.observe(el); });
  }

  // ─── CUSTOM CURSOR (pointer devices only) ───────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    var cursor = document.getElementById('cursor');
    if (cursor) {
      document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });

      document.querySelectorAll('a, button, .pillar-card, .ep-card, .tool-card, .social-card').forEach(function(el) {
        el.addEventListener('mouseenter', function() {
          cursor.style.width = '20px';
          cursor.style.height = '20px';
          cursor.style.opacity = '0.6';
        });
        el.addEventListener('mouseleave', function() {
          cursor.style.width = '8px';
          cursor.style.height = '8px';
          cursor.style.opacity = '1';
        });
      });
    }
  }

  // ─── SMOOTH ANCHOR SCROLL ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── HERO WORD ROTATION (skip if reduced motion) ────────────
  if (!prefersReducedMotion) {
    var rotatingWord = document.querySelector('.hero-rotating-word');
    if (rotatingWord) {
      var words = ['Artists.', 'Freelancers.', 'Developers.', 'Creators.', 'Filmmakers.', 'Designers.'];
      var wordIndex = 0;
      setInterval(function() {
        rotatingWord.classList.add('fade-out');
        setTimeout(function() {
          wordIndex = (wordIndex + 1) % words.length;
          rotatingWord.textContent = words[wordIndex];
          rotatingWord.classList.remove('fade-out');
        }, 400);
      }, 2500);
    }
  }

  // ─── VIDEO CYCLING (play one at a time) ─────────────────────
  if (!prefersReducedMotion) {
    document.querySelectorAll('.premium-card-cycle').forEach(function(video) {
      var sources = (video.getAttribute('data-videos') || '').split(',');
      if (sources.length < 2) return;
      var index = 0;
      video.addEventListener('ended', function() {
        index = (index + 1) % sources.length;
        video.src = sources[index];
        video.play();
      });
    });
  }

  // ─── LAZY VIDEO AUTOPLAY (skip if reduced motion) ───────────
  if (!prefersReducedMotion) {
    var lazyVideos = document.querySelectorAll('video[data-lazy]');
    if (lazyVideos.length > 0) {
      var videoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.play();
            videoObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px' });
      lazyVideos.forEach(function(v) { videoObserver.observe(v); });
    }
  }

  // ─── STAGGER REVEAL ──────────────────────────────────────────
  if (!prefersReducedMotion) {
    document.querySelectorAll('.pillars-grid .pillar-card').forEach(function(el, i) {
      el.style.transitionDelay = (i * 0.06) + 's';
    });
  }

  // ─── PODCAST API ─────────────────────────────────────────────
  // Updates the podcast section with live episode data from Apple Podcasts + YouTube
  // Targets current markup: .pod-hero, .pod-4grid .pod-showcase-card
  fetch('/api/podcast').then(function(res) {
    if (!res.ok) throw new Error('API ' + res.status);
    return res.json();
  }).then(function(data) {
    // Update pillar stat (home page)
    var pillarStat = document.querySelector('.pillar-card .pillar-stat');
    if (pillarStat && data.totalEpisodes) {
      pillarStat.textContent = data.totalEpisodes + '+ Episodes';
    }

    if (data.episodes && data.episodes.length > 0) {
      var ep = data.episodes[0];
      var apiNum = ep.episodeNumber || data.totalEpisodes || 0;

      // Update featured hero episode (.pod-hero)
      var podHero = document.querySelector('.pod-hero');
      if (podHero) {
        // Update hero link
        if (ep.youtubeUrl) podHero.href = ep.youtubeUrl;

        // Update hero thumbnail
        var heroBg = podHero.querySelector('.pod-hero-bg');
        if (heroBg && ep.artworkUrl) {
          heroBg.src = ep.artworkUrl.replace('hqdefault', 'maxresdefault');
        }

        // Update badge text (e.g., "Latest · Ep. 103")
        var badge = podHero.querySelector('.playlist-badge');
        if (badge) badge.textContent = 'Latest \u00b7 Ep. ' + apiNum;

        // Update title
        var heroTitle = podHero.querySelector('h2');
        if (heroTitle) heroTitle.textContent = ep.title || '';
      }

      // Update grid episodes (.pod-4grid .pod-showcase-card)
      var cards = document.querySelectorAll('.pod-4grid .pod-showcase-card');
      for (var i = 0; i < Math.min(cards.length, data.episodes.length - 1); i++) {
        var e = data.episodes[i + 1];

        // Update card link
        if (e.youtubeUrl) cards[i].href = e.youtubeUrl;

        // Update thumbnail
        var cardImg = cards[i].querySelector('img');
        if (cardImg && e.artworkUrl) {
          cardImg.src = e.artworkUrl.replace('hqdefault', 'maxresdefault');
        }

        // Update title
        var cardTitle = cards[i].querySelector('.pod-showcase-name h4');
        if (cardTitle) cardTitle.textContent = e.title || '';

        // Update meta (episode number, date, duration)
        var cardMeta = cards[i].querySelector('.pod-showcase-name span');
        if (cardMeta) {
          var metaParts = ['Ep. ' + (e.episodeNumber || '')];
          if (e.date) metaParts.push(e.date);
          if (e.duration) metaParts.push(e.duration);
          cardMeta.textContent = metaParts.join(' \u00b7 ');
        }
      }
    }
  }).catch(function() {});
}

// ─── NEWSLETTER (global, called from inline onsubmit) ────────
function handleSubscribe(e) {
  e.preventDefault();
  var btn = e.target.querySelector('button');
  var input = e.target.querySelector('input');
  btn.textContent = 'Subscribed \u2713';
  btn.style.background = '#4ac864';
  input.value = '';
  setTimeout(function() {
    btn.textContent = 'Subscribe \u2192';
    btn.style.background = '';
  }, 3000);
}

// Initialize after DOM is ready (sections are pre-rendered by build script)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBDS);
} else {
  initBDS();
}
