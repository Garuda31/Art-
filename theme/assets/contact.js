/* Contact: onderwerp vooraf invullen via ?subject=... */
(function () {
  'use strict';
  var input = document.querySelector('[data-contact-subject]');
  if (!input) return;
  var subject = new URLSearchParams(window.location.search).get('subject');
  if (subject && !input.value) input.value = subject.slice(0, 200);
})();
