/* Sticky koopbalk (mobiel): verschijnt zodra de hoofdknop boven de viewport uit beeld is gescrold. */
(function () {
  'use strict';

  var bar = document.querySelector('[data-sticky-atc]');
  var anchor = document.querySelector('[data-product-form] [data-add-to-cart]');
  if (!bar || !anchor) return;

  var mobile = window.matchMedia('(max-width: 899px)');
  var ticking = false;

  function update() {
    ticking = false;
    var passed = anchor.getBoundingClientRect().bottom < 0;
    var show = passed && mobile.matches;
    bar.hidden = !show;
    document.body.classList.toggle('has-sticky-atc', show);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
