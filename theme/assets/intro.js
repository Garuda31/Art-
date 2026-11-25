/* Openingsanimatie: de naam verschijnt in het midden van een leeg scherm en vliegt
   verkleinend naar de plek van het logo in de header (FLIP met de Web Animations API).
   Volgorde: letters verschijnen -> korte pauze -> naam vliegt naar de header en de achtergrond vervaagt.
   Klik of toets = direct doorgaan. Wordt niet getoond bij 'minder beweging'. */
(function () {
  'use strict';

  var root = document.documentElement;
  if (!root.classList.contains('has-intro')) return;

  var overlay = document.querySelector('[data-intro]');
  var bg = overlay && overlay.querySelector('[data-intro-bg]');
  var word = overlay && overlay.querySelector('[data-intro-word]');
  var tagline = overlay && overlay.querySelector('[data-intro-tagline]');
  var logo = document.querySelector('.site-logo__text') || document.querySelector('.site-logo__image');
  var KEY = 'sutarwaty_intro_seen';

  function markSeen() {
    try { window.sessionStorage.setItem(KEY, '1'); } catch (e) { /* geen opslag */ }
  }

  function finish() {
    markSeen();
    root.classList.remove('has-intro');
    if (overlay) overlay.classList.add('is-done');
  }

  if (!overlay || !word || !logo || typeof overlay.animate !== 'function') {
    finish();
    return;
  }

  var letters = Array.prototype.slice.call(word.children);
  var STAGGER = 85;      // ms tussen letters
  var LETTER_MS = 900;   // duur per letter
  var HOLD_MS = 600;     // pauze met de volledige naam
  var FLIGHT_MS = 1300;  // duur van de vlucht naar de header
  var flying = false;
  var flyTimer;

  function fly() {
    if (flying) return;
    flying = true;
    window.clearTimeout(flyTimer);

    var from = word.getBoundingClientRect();
    var to = logo.getBoundingClientRect();
    var scale = to.width / from.width;
    var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    var dy = (to.top + to.height / 2) - (from.top + from.height / 2);

    if (tagline) {
      tagline.animate([{ opacity: parseFloat(getComputedStyle(tagline).opacity) || 0 }, { opacity: 0 }],
        { duration: 350, easing: 'ease-out', fill: 'forwards' });
    }

    /* De achtergrond vervaagt tijdens de vlucht, zodat de pagina eronder verschijnt */
    bg.animate([{ opacity: 1 }, { opacity: 0 }],
      { duration: FLIGHT_MS * 0.7, delay: FLIGHT_MS * 0.25, easing: 'ease-in-out', fill: 'forwards' });

    var flight = word.animate([
      { transform: 'translate(0px, 0px) scale(1)' },
      { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(' + scale + ')' }
    ], { duration: FLIGHT_MS, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', fill: 'forwards' });

    flight.onfinish = finish;
    flight.oncancel = finish;
  }

  function run() {
    overlay.style.animation = 'none';   // veiligheidsnet uitschakelen: JS neemt het over
    window.scrollTo(0, 0);

    letters.forEach(function (el, i) {
      el.animate([
        { opacity: 0, transform: 'translateY(22px)', filter: 'blur(10px)' },
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }
      ], { duration: LETTER_MS, delay: 200 + i * STAGGER, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'forwards' });
    });

    var lettersDone = 200 + (letters.length - 1) * STAGGER + LETTER_MS;
    if (tagline) {
      tagline.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 700, delay: lettersDone - 500, easing: 'ease-out', fill: 'forwards' });
    }

    flyTimer = window.setTimeout(fly, lettersDone + HOLD_MS);
  }

  /* Overslaan: klik of toets */
  overlay.addEventListener('click', fly);
  document.addEventListener('keydown', fly, { once: true });

  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (resolve) { window.setTimeout(resolve, 900); })]).then(run);
})();
