// ─── BDS Main Script ─────────────────────────────────────────
// Runs after DOM is ready (sections are pre-rendered by build script)

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initNavScroll() {
  var nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
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
    if (prefersReducedMotion) {
      video.pause();
      video.removeAttribute('autoplay');
      return;
    }

    if (video.hasAttribute('data-autoplay')) {
      video.muted = true;
      safePlay(video);
    }
  });
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

function initPodcastData() {
  fetch('/api/podcast').then(function(res) {
    if (!res.ok) throw new Error('API ' + res.status);
    return res.json();
  }).then(function(data) {
    if (!data.episodes || data.episodes.length === 0) return;

    var featuredEpisode = data.episodes[0];
    var podHero = document.querySelector('.pod-hero');

    if (podHero) {
      if (featuredEpisode.youtubeUrl) {
        podHero.href = featuredEpisode.youtubeUrl;
      }

      var heroBg = podHero.querySelector('.pod-hero-bg');
      if (heroBg && featuredEpisode.artworkUrl) {
        heroBg.src = featuredEpisode.artworkUrl;
        heroBg.alt = (featuredEpisode.title || 'Featured podcast episode') + ' thumbnail';
      }

      var badge = podHero.querySelector('.playlist-badge');
      if (badge) {
        badge.textContent = featuredEpisode.episodeNumber
          ? 'Latest \u00b7 Ep. ' + featuredEpisode.episodeNumber
          : 'Latest';
      }

      var heroTitle = podHero.querySelector('h2');
      if (heroTitle) {
        heroTitle.textContent = featuredEpisode.title || '';
      }
    }

    var cards = document.querySelectorAll('.pod-4grid .pod-showcase-card');
    for (var i = 0; i < Math.min(cards.length, data.episodes.length - 1); i++) {
      var episode = data.episodes[i + 1];

      if (episode.youtubeUrl) {
        cards[i].href = episode.youtubeUrl;
      }

      var cardImg = cards[i].querySelector('img');
      if (cardImg && episode.artworkUrl) {
        cardImg.src = episode.artworkUrl;
        cardImg.alt = (episode.title || 'Podcast episode') + ' thumbnail';
      }

      var cardTitle = cards[i].querySelector('.pod-showcase-name h4');
      if (cardTitle) {
        cardTitle.textContent = episode.title || '';
      }

      var cardMeta = cards[i].querySelector('.pod-card-meta');
      if (cardMeta) {
        cardMeta.textContent = episode.episodeNumber ? 'Ep. ' + episode.episodeNumber : '';
      }
    }
  }).catch(function(err) {
    console.warn('Podcast refresh skipped:', err.message);
  });
}

function initBDS() {
  initNavScroll();
  initReveal();
  initSmoothScroll();
  initHeroRotation();
  initManagedVideos();
  initVideoCycling();
  initLazyVideos();
  initStaggeredReveal();
  initPodcastData();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBDS);
} else {
  initBDS();
}
