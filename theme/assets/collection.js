/* Collectie: filters en sortering direct toepassen (zonder JS werkt de knop "Toepassen"). */
(function () {
  'use strict';

  var form = document.querySelector('[data-filter-form]');
  if (!form) return;

  var timer;
  function submitSoon(delay) {
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      if (typeof form.requestSubmit === 'function') form.requestSubmit();
      else form.submit();
    }, delay);
  }

  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('input[type="checkbox"], select')) submitSoon(0);
    else if (t.matches('input[type="number"]')) submitSoon(600);
  });

  /* Prijsvelden zonder waarde niet meesturen */
  form.addEventListener('submit', function () {
    form.querySelectorAll('input[type="number"]').forEach(function (input) {
      if (input.value === '') input.disabled = true;
    });
  });
})();
