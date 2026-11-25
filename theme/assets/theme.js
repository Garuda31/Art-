/* Sutarwaty — basis-JS: menu, compacte header, fade-in. Vanilla, geen afhankelijkheden. */
(function () {
  'use strict';

  var MENU_BREAKPOINT = 900;

  /* ----- Header: menu en compacte stand ----- */
  function initHeader() {
    var header = document.querySelector('[data-site-header]');
    if (!header) return;

    var toggle = header.querySelector('[data-menu-toggle]');
    var nav = header.querySelector('[data-site-nav]');
    var iconOpen = header.querySelector('[data-icon-open]');
    var iconClose = header.querySelector('[data-icon-close]');
    var labelOpen = header.querySelector('[data-label-open]');
    var labelClose = header.querySelector('[data-label-close]');

    function setMenu(open) {
      header.classList.toggle('is-menu-open', open);
      document.body.classList.toggle('is-locked', open);
      toggle.setAttribute('aria-expanded', String(open));
      iconOpen.hidden = open;
      iconClose.hidden = !open;
      labelOpen.hidden = open;
      labelClose.hidden = !open;
    }

    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-menu-open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= MENU_BREAKPOINT) setMenu(false);
    });

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-compact', window.scrollY > 40);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----- Fade-in bij scrollen ----- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  function init() {
    initHeader();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
