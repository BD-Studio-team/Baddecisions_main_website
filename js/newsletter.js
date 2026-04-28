// ─── BDS Newsletter ───────────────────────────────────────────
// Klaviyo client-subscriptions submission. Public client identifiers, not secrets.
// Docs: https://developers.klaviyo.com/en/reference/create_client_subscription

(function() {
  var KLAVIYO_PUBLIC_KEY = 'Tir9Yi';
  var KLAVIYO_LIST_ID = 'UWvYjQ';
  var KLAVIYO_API_REVISION = '2024-02-15';
  var SUBMIT_COOLDOWN_MS = 5000;

  var lastSubmitTime = new WeakMap();

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function detectSource() {
    var path = (window.location.pathname || '/').toLowerCase();
    if (path === '/' || path === '') return 'BD Studio Homepage';
    if (path.indexOf('/podcast') === 0) return 'BD Studio Podcast';
    if (path.indexOf('/education') === 0) return 'BD Studio Education';
    if (path.indexOf('/work-with-us/services') === 0) return 'BD Studio Services';
    if (path.indexOf('/work-with-us/media-partnerships') === 0) return 'BD Studio Media Partnerships';
    if (path.indexOf('/work-with-us/open-roles') === 0) return 'BD Studio Open Roles';
    if (path.indexOf('/work-with-us') === 0) return 'BD Studio Work With Us';
    return 'BD Studio' + path;
  }

  function showError(form, message) {
    var errBox = form.querySelector('.nl-error');
    var errText = form.querySelector('.nl-error-text');
    var success = form.querySelector('.nl-success');
    if (success) success.hidden = true;
    if (errText && message) errText.textContent = message;
    if (errBox) errBox.hidden = false;
  }

  function showSuccess(form) {
    var success = form.querySelector('.nl-success');
    var errBox = form.querySelector('.nl-error');
    var fineprint = form.querySelector('.nl-fineprint');
    if (errBox) errBox.hidden = true;
    if (fineprint) fineprint.hidden = true;
    if (success) success.hidden = false;
  }

  function setSubmitting(btn, state) {
    if (!btn) return;
    btn.disabled = state;
    var text = btn.querySelector('.nl-submit-text');
    if (text) text.textContent = state ? 'Subscribing...' : 'Subscribe';
  }

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.currentTarget;

    var honeypot = form.querySelector('.nl-honeypot');
    if (honeypot && honeypot.value) return;

    var now = Date.now();
    var last = lastSubmitTime.get(form) || 0;
    if (now - last < SUBMIT_COOLDOWN_MS) {
      showError(form, 'Please wait a few seconds before trying again.');
      return;
    }

    var nameInput = form.querySelector('input[name="name"]');
    var emailInput = form.querySelector('input[name="email"]');
    var name = nameInput ? nameInput.value.trim() : '';
    var email = emailInput ? emailInput.value.trim() : '';

    if (name.length < 2) { showError(form, 'Please enter your name.'); return; }
    if (!isValidEmail(email)) { showError(form, 'Please enter a valid email.'); return; }

    lastSubmitTime.set(form, now);
    var submitBtn = form.querySelector('.nl-submit');
    setSubmitting(submitBtn, true);

    var source = form.getAttribute('data-source') || detectSource();
    var payload = {
      data: {
        type: 'subscription',
        attributes: {
          profile: {
            data: {
              type: 'profile',
              attributes: { email: email, first_name: name }
            }
          },
          custom_source: source
        },
        relationships: {
          list: {
            data: { type: 'list', id: KLAVIYO_LIST_ID }
          }
        }
      }
    };

    fetch('https://a.klaviyo.com/client/subscriptions/?company_id=' + KLAVIYO_PUBLIC_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': KLAVIYO_API_REVISION
      },
      body: JSON.stringify(payload)
    }).then(function(res) {
      if (!res.ok) throw new Error('status_' + res.status);
      form.reset();
      showSuccess(form);
    }).catch(function(err) {
      var isNetwork = err && err.message === 'Failed to fetch';
      showError(form, isNetwork
        ? 'Network error — check your connection and try again.'
        : 'Something went wrong. Please try again.');
    }).then(function() {
      setSubmitting(submitBtn, false);
    });
  }

  function init() {
    var forms = document.querySelectorAll('.nl-form');
    forms.forEach(function(form) {
      form.addEventListener('submit', handleSubmit);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
