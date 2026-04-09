// ─── BDS Main Script ─────────────────────────────────────────
// Runs after DOM is ready (sections are pre-rendered by build script)

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
      toggle.classList.toggle('open');
      if (navLinks) navLinks.classList.toggle('nav-open');
      if (navCta) navCta.classList.toggle('nav-open');
    });
    // Close mobile nav when a link is clicked
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
          toggle.classList.remove('open');
          navLinks.classList.remove('nav-open');
          if (navCta) navCta.classList.remove('nav-open');
        });
      });
    }
  }

  // ─── SCROLL REVEAL ───────────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function(el) { revealObserver.observe(el); });

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

  // ─── HERO WORD ROTATION ─────────────────────────────────────
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

  // ─── VIDEO CYCLING (play one at a time) ─────────────────────
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

  // ─── LAZY VIDEO AUTOPLAY ────────────────────────────────────
  // Only hero video autoplays immediately; below-fold videos play on scroll
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

  // ─── STAGGER REVEAL ──────────────────────────────────────────
  document.querySelectorAll('.pillars-grid .pillar-card, .episodes-grid .ep-card').forEach(function(el, i) {
    el.style.transitionDelay = (i * 0.06) + 's';
  });

  // ─── PODCAST API ─────────────────────────────────────────────
  fetch('/api/podcast').then(function(res) {
    if (!res.ok) throw new Error('API ' + res.status);
    return res.json();
  }).then(function(data) {
    // Update pillar stat
    var pillarStat = document.querySelector('.pillar-card .pillar-stat');
    if (pillarStat && data.totalEpisodes) {
      pillarStat.textContent = data.totalEpisodes + '+ Episodes';
    }

    if (data.episodes && data.episodes.length > 0) {
      var ep = data.episodes[0];

      // Only update featured episode if API has a newer one than what's hardcoded
      var currentEpNum = document.querySelector('.ep-number');
      var currentNum = currentEpNum ? parseInt(currentEpNum.textContent) : 0;
      var apiNum = ep.episodeNumber || data.totalEpisodes || 0;

      if (apiNum >= currentNum) {
        var epNum = document.querySelector('.ep-number');
        if (epNum) epNum.textContent = apiNum;
        var epTitle = document.querySelector('.ep-featured-card.main .ep-title');
        if (epTitle) epTitle.textContent = ep.title || '';
        var epGuest = document.querySelector('.ep-featured-card.main .ep-guest');
        if (epGuest) epGuest.textContent = ep.date + ' \u2022 ' + ep.duration;
        var epBadge = document.querySelector('.ep-date');
        if (epBadge) epBadge.textContent = ep.date;

        // Add thumbnail to featured card
        var featuredCard = document.querySelector('.ep-featured-card.main');
        var epMeta = featuredCard ? featuredCard.querySelector('.ep-meta') : null;
        if (featuredCard && epMeta && ep.artworkUrl && !featuredCard.querySelector('.ep-featured-thumb')) {
          var thumb = document.createElement('img');
          thumb.src = ep.artworkUrl.replace('hqdefault', 'maxresdefault');
          thumb.alt = '';
          thumb.className = 'ep-featured-thumb';
          thumb.loading = 'lazy';
          featuredCard.insertBefore(thumb, epMeta);
        }

        // Update featured episode links
        var epBtns = document.querySelectorAll('.ep-featured-card.main .ep-btn');
        if (epBtns.length >= 1 && ep.trackViewUrl) {
          if (epBtns[2]) epBtns[2].href = ep.trackViewUrl;
        }
        if (ep.youtubeUrl) {
          if (epBtns[1]) epBtns[1].href = ep.youtubeUrl;
        }
      }

      // Grid episodes
      var cards = document.querySelectorAll('.episodes-grid .ep-card');
      for (var i = 0; i < Math.min(cards.length, data.episodes.length - 1); i++) {
        var e = data.episodes[i + 1];
        var numEl = cards[i].querySelector('.ep-card-number');
        var titleEl = cards[i].querySelector('.ep-card-title');
        var guestEl = cards[i].querySelector('.ep-card-guest');
        var dateEl = cards[i].querySelector('.ep-card-date');
        if (numEl) numEl.textContent = e.episodeNumber ? 'Ep. ' + e.episodeNumber : 'Ep.';
        if (titleEl) titleEl.textContent = e.title || '';
        if (guestEl) guestEl.textContent = e.duration ? e.date + ' \u2022 ' + e.duration : e.date || '';
        if (dateEl) dateEl.textContent = e.date || '';

        // Add artwork thumbnail
        if (e.artworkUrl && !cards[i].querySelector('.ep-card-art')) {
          var img = document.createElement('img');
          img.src = e.artworkUrl.replace('hqdefault', 'mqdefault');
          img.alt = '';
          img.className = 'ep-card-art';
          img.loading = 'lazy';
          cards[i].insertBefore(img, cards[i].firstChild);
        }

        // Update play button link
        var playBtn = cards[i].querySelector('.ep-card-play');
        if (playBtn) {
          playBtn.href = e.youtubeUrl || playBtn.href;
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
