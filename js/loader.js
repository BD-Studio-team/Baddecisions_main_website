// Section loader — fetches HTML partials and inserts them into the page
// Note: This loads trusted local section files only (same-origin), not user content
(function() {
  var slots = document.querySelectorAll('[data-include]');
  var total = slots.length;
  var loaded = 0;
  slots.forEach(function(slot) {
    var url = slot.getAttribute('data-include');
    // Only load from same origin sections
    if (!url.startsWith('/sections/')) return;
    fetch(url)
      .then(function(r) { return r.text(); })
      .then(function(markup) {
        var range = document.createRange();
        range.selectNode(document.body);
        var fragment = range.createContextualFragment(markup);
        slot.parentNode.insertBefore(fragment, slot);
        slot.parentNode.removeChild(slot);
        loaded++;
        if (loaded === total) {
          window.dispatchEvent(new Event('sections-loaded'));
        }
      });
  });
})();
