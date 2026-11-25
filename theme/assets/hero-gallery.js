/* Hero met galerijwand: toont een aantal schilderijen naast elkaar in een kamer, op schaal.
   De knop "Andere schilderijen" kiest een nieuwe willekeurige selectie.

   Schaal: de kamer is 285,7 x 178,6 cm. Alle maten komen in centimeters uit de productgegevens
   (metafields) en worden als percentage van de kamer getekend, dus de verhoudingen kloppen op elk scherm. */
(function () {
  'use strict';

  var section = document.querySelector('[data-hero-gallery]');
  if (!section) return;

  var wall = section.querySelector('[data-hero-wall]');
  var shuffleButton = section.querySelector('[data-hero-shuffle]');
  var status = section.querySelector('[data-hero-status]');
  var dataEl = section.querySelector('[data-hero-works]');
  if (!wall || !dataEl) return;

  var works;
  try { works = JSON.parse(dataEl.textContent); } catch (e) { works = []; }
  if (!works.length) { if (shuffleButton) shuffleButton.hidden = true; return; }

  /* De getekende kamer is 885,7 x 238,6 cm: de zichtbare kamer (0..285,7 x 0..178,6 cm)
     met extra muur en vloer eromheen, zodat hij op elk schermformaat gevuld blijft. */
  var ROOM_X0 = -300;       // cm
  var ROOM_Y0 = -60;        // cm
  var ROOM_W = 885.7;       // cm
  var ROOM_H = 238.6;       // cm
  var CENTER_X = 175.7;     // cm: midden van de bank en de galerijwand
  var CENTER_Y = 47;        // cm van boven: lijn waarop de schilderijen "centraal" hangen
  var GAP = 8;              // cm tussen de lijsten
  var MAX_TOTAL = 198;      // cm: breedste galerijwand die nog netjes boven de bank past
  var COUNT = Math.max(2, Math.min(5, parseInt(section.getAttribute('data-count'), 10) || 4));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var previousKey = '';

  function pct(value, total) { return (value / total * 100).toFixed(4) + '%'; }

  function shufflePick(list, n) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = copy[i]; copy[i] = copy[j]; copy[j] = t;
    }
    return copy.slice(0, n);
  }

  function totalWidth(picks) {
    return picks.reduce(function (sum, w) { return sum + w.fw; }, 0) + GAP * (picks.length - 1);
  }

  /* Kies willekeurig, maar zo dat het op schaal past en niet dezelfde set als net daarvoor is */
  function choose() {
    var n = Math.min(COUNT, works.length);
    var best = null;
    for (var attempt = 0; attempt < 60; attempt++) {
      var picks = shufflePick(works, n);
      var key = picks.map(function (w) { return w.handle; }).sort().join('|');
      if (totalWidth(picks) <= MAX_TOTAL && (key !== previousKey || works.length <= n)) {
        previousKey = key;
        return picks;
      }
      if (!best || totalWidth(picks) < totalWidth(best)) best = picks;
    }
    /* Past niet: laat het laatste schilderij weg tot het wel past */
    while (best.length > 1 && totalWidth(best) > MAX_TOTAL) best = best.slice(0, -1);
    previousKey = best.map(function (w) { return w.handle; }).sort().join('|');
    return best;
  }

  function buildFrame(work, x) {
    var frame = document.createElement('a');
    frame.className = 'room-frame room-frame--' + work.style;
    frame.href = work.url;
    frame.setAttribute('aria-label', work.title);
    frame.title = work.title;

    var y = CENTER_Y - work.fh / 2;
    frame.style.left = pct(x - ROOM_X0, ROOM_W);
    frame.style.top = pct(y - ROOM_Y0, ROOM_H);
    frame.style.width = pct(work.fw, ROOM_W);
    frame.style.height = pct(work.fh, ROOM_H);

    /* Marges in % van de kamerbreedte (padding in % rekent altijd met de breedte van de omgeving) */
    var padV, padH, mat = null;
    if (work.style === 'wood') {
      /* brede houten lijst: het hele verschil tussen lijst en werk is hout */
      padH = (work.fw - work.aw) / 2;
      padV = (work.fh - work.ah) / 2;
      frame.style.padding = pct(padV, ROOM_W) + ' ' + pct(padH, ROOM_W);
    } else {
      var border = work.style === 'white' ? 1 : 1.2;
      frame.style.padding = pct(border, ROOM_W);
      padH = Math.max(0, (work.fw - 2 * border - work.aw) / 2);
      padV = Math.max(0, (work.fh - 2 * border - work.ah) / 2);
      mat = document.createElement('span');
      mat.className = 'room-frame__mat';
      mat.style.padding = pct(padV, ROOM_W) + ' ' + pct(padH, ROOM_W);
    }

    var img = document.createElement('img');
    img.className = 'room-frame__img';
    img.src = work.img;
    img.alt = work.alt;
    img.decoding = 'async';

    if (mat) { mat.appendChild(img); frame.appendChild(mat); } else { frame.appendChild(img); }
    return frame;
  }

  function render(picks, animate) {
    wall.textContent = '';
    var x = CENTER_X - totalWidth(picks) / 2;
    picks.forEach(function (work, i) {
      var frame = buildFrame(work, x);
      if (animate && !reduceMotion) {
        frame.classList.add('is-entering');
        frame.style.transitionDelay = (i * 90) + 'ms';
      }
      wall.appendChild(frame);
      x += work.fw + GAP;
    });
    if (animate && !reduceMotion) {
      /* twee frames wachten zodat de beginstand gerenderd is, daarna laten verschijnen */
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          Array.prototype.forEach.call(wall.children, function (el) { el.classList.remove('is-entering'); });
        });
      });
    }
    if (status) {
      status.textContent = picks.map(function (w) { return w.title; }).join(', ');
    }
  }

  var busy = false;
  function shuffle() {
    if (busy) return;
    busy = true;
    var next = choose();
    if (reduceMotion) { render(next, false); busy = false; return; }
    Array.prototype.forEach.call(wall.children, function (el, i) {
      el.style.transitionDelay = (i * 50) + 'ms';
      el.classList.add('is-leaving');
    });
    window.setTimeout(function () { render(next, true); busy = false; }, wall.children.length ? 420 : 0);
  }

  render(choose(), false);
  if (shuffleButton) shuffleButton.addEventListener('click', shuffle);
})();
