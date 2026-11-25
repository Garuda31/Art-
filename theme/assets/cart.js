/* Winkelmand: drawer, toevoegen en verwijderen zonder paginaverversing.
   Zonder JS werken de gewone links en formulieren naar de cartpagina. */
(function () {
  'use strict';

  var dialog = document.querySelector('[data-cart-drawer]');
  if (!dialog) return;

  var body = dialog.querySelector('[data-cart-drawer-body]');
  var cartUrl = dialog.getAttribute('data-cart-url');
  var root = dialog.getAttribute('data-root');
  var sectionId = dialog.getAttribute('data-section-id');
  var onCartPage = dialog.hasAttribute('data-cart-page');

  function openDrawer() {
    if (dialog.open) return;
    dialog.showModal();
    document.body.classList.add('is-locked');
  }

  function closeDrawer() {
    if (dialog.open) dialog.close();
  }

  dialog.addEventListener('close', function () {
    document.body.classList.remove('is-locked');
  });

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog || e.target.closest('[data-cart-close]')) closeDrawer();
  });

  /* Drawer-inhoud en teller in de header bijwerken */
  function updateCount(source) {
    if (!source) return;
    var count = parseInt(source.getAttribute('data-cart-count-source'), 10) || 0;
    var label = source.getAttribute('data-cart-label-source');
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });
    document.querySelectorAll('[data-cart-label]').forEach(function (el) {
      if (label) el.textContent = label;
    });
  }

  function refresh() {
    return fetch(cartUrl + (cartUrl.indexOf('?') > -1 ? '&' : '?') + 'section_id=' + encodeURIComponent(sectionId))
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = doc.querySelector('[data-cart-drawer-body]');
        if (!fresh) return;
        body.innerHTML = fresh.innerHTML;
        updateCount(body.querySelector('[data-cart-count-source]'));
      });
  }

  /* Header-winkelmand opent de drawer (behalve op de cartpagina zelf) */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-cart-link]');
    if (!link || onCartPage) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    refresh().then(openDrawer, function () { window.location.href = link.href; });
  });

  /* Verwijderen */
  dialog.addEventListener('click', function (e) {
    var remove = e.target.closest('[data-cart-remove]');
    if (!remove) return;
    e.preventDefault();
    remove.setAttribute('aria-disabled', 'true');
    fetch(root + 'cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: parseInt(remove.getAttribute('data-line'), 10), quantity: 0 })
    }).then(refresh).catch(function () { window.location.href = remove.href; });
  });

  /* Toevoegen vanaf de productpagina */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-product-form]');
    if (!form) return;
    e.preventDefault();

    var button = form.querySelector('[data-add-to-cart]');
    var error = form.querySelector('[data-form-error]');
    var original = button ? button.textContent : '';
    if (error) error.hidden = true;
    if (button) {
      button.disabled = true;
      button.textContent = button.getAttribute('data-adding-label') || original;
    }

    fetch(root + 'cart/add.js', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.description || data.message || '');
          return data;
        });
      })
      .then(refresh)
      .then(openDrawer)
      .catch(function (err) {
        if (error) {
          error.textContent = (err && err.message) || error.getAttribute('data-fallback') || '';
          error.hidden = false;
        }
      })
      .then(function () {
        if (button) {
          button.disabled = false;
          button.textContent = original;
        }
      });
  });
})();
