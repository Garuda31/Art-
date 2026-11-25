/* Nieuwsbriefvenster: na X seconden of bij exit-intent, één keer per bezoeker. */
(function () {
  'use strict';

  var popup = document.querySelector('[data-newsletter-popup]');
  if (!popup) return;

  var KEY = 'sutarwaty_newsletter_seen';
  function seen() {
    try { return window.localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function markSeen() {
    try { window.localStorage.setItem(KEY, '1'); } catch (e) { /* geen opslag beschikbaar */ }
  }

  var posted = /[?&]customer_posted=true/.test(window.location.search);
  var hasErrors = !!popup.querySelector('[role="alert"]');

  var shown = false;
  var timer;

  function show() {
    if (shown || seen()) return;
    /* Niet bovenop een andere open dialoog (winkelmand, lightbox) */
    if (document.querySelector('dialog[open]')) {
      timer = window.setTimeout(show, 8000);
      return;
    }
    shown = true;
    popup.showModal();
    document.body.classList.add('is-locked');
    markSeen();
  }

  popup.addEventListener('close', function () {
    document.body.classList.remove('is-locked');
    markSeen();
  });
  popup.addEventListener('click', function (e) {
    if (e.target === popup || e.target.closest('[data-popup-close]')) popup.close();
  });

  /* Na inschrijven: bevestiging of fout direct tonen */
  if (posted || hasErrors) {
    shown = true;
    popup.showModal();
    document.body.classList.add('is-locked');
    markSeen();
    return;
  }

  if (seen()) return;

  var delay = (parseInt(popup.getAttribute('data-delay'), 10) || 25) * 1000;
  timer = window.setTimeout(show, delay);

  if (popup.getAttribute('data-exit-intent') === 'true' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY <= 0) {
        window.clearTimeout(timer);
        show();
      }
    });
  }
})();
