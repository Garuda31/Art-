/* Winkelmand: drawer, toevoegen en verwijderen zonder paginaverversing.
   Zonder JS werken de gewone links en formulieren naar de cartpagina.

   Knopstatussen van "In winkelmand":
   idle -> adding -> added (kort "Toegevoegd ✓") -> in-cart ("Bekijk winkelmand")
   Elk werk is uniek, dus een tweede klik opent de winkelmand i.p.v. nogmaals toe te voegen. */
(function () {
  'use strict';

  var dialog = document.querySelector('[data-cart-drawer]');
  if (!dialog) return;

  var body = dialog.querySelector('[data-cart-drawer-body]');
  var cartUrl = dialog.getAttribute('data-cart-url');
  var root = dialog.getAttribute('data-root');
  var sectionId = dialog.getAttribute('data-section-id');
  var onCartPage = dialog.hasAttribute('data-cart-page');
  var productEl = document.querySelector('[data-product-id]');
  var productId = productEl ? productEl.getAttribute('data-product-id') : null;
  var transient = false;

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

  /* ----- Knoppen "In winkelmand" (hoofdknop en sticky balk) ----- */
  var LABEL_ATTR = {
    idle: 'data-idle-label',
    adding: 'data-adding-label',
    added: 'data-added-label',
    'in-cart': 'data-in-cart-label'
  };

  function setButtons(state) {
    document.querySelectorAll('[data-add-to-cart]').forEach(function (button) {
      var label = button.querySelector('[data-add-label]') || button;
      var text = button.getAttribute(LABEL_ATTR[state]);
      if (text) label.textContent = text;
      button.disabled = state === 'adding';
      button.classList.toggle('is-added', state === 'added');
      if (state === 'added' || state === 'in-cart') button.setAttribute('data-in-cart', '');
      else if (state === 'idle') button.removeAttribute('data-in-cart');
    });
  }

  function isInCart() {
    var button = document.querySelector('[data-add-to-cart]');
    return !!button && button.hasAttribute('data-in-cart');
  }

  /* ----- Drawer-inhoud en teller in de header ----- */
  function bump(el) {
    el.classList.remove('is-bumped');
    void el.offsetWidth;
    el.classList.add('is-bumped');
  }

  function updateCount(source, animate) {
    if (!source) return;
    var count = parseInt(source.getAttribute('data-cart-count-source'), 10) || 0;
    var label = source.getAttribute('data-cart-label-source');
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
      if (animate && count > 0) bump(el);
    });
    document.querySelectorAll('[data-cart-label]').forEach(function (el) {
      if (label) el.textContent = label;
    });

    /* Knopstatus synchroon houden als het werk uit de winkelmand is gehaald */
    if (productId && !transient) {
      var ids = source.getAttribute('data-cart-product-ids') || '';
      setButtons(ids.indexOf(',' + productId + ',') > -1 ? 'in-cart' : 'idle');
    }
  }

  function refresh(animate) {
    return fetch(cartUrl + (cartUrl.indexOf('?') > -1 ? '&' : '?') + 'section_id=' + encodeURIComponent(sectionId))
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = doc.querySelector('[data-cart-drawer-body]');
        if (!fresh) return;
        body.innerHTML = fresh.innerHTML;
        updateCount(body.querySelector('[data-cart-count-source]'), animate);
      });
  }

  /* ----- Openen via header-icoon of andere [data-cart-open] ----- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-cart-link], [data-cart-open]');
    if (!link || onCartPage) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    refresh(false).then(openDrawer, function () { window.location.href = link.href || cartUrl; });
  });

  /* ----- Verwijderen ----- */
  dialog.addEventListener('click', function (e) {
    var remove = e.target.closest('[data-cart-remove]');
    if (!remove) return;
    e.preventDefault();
    remove.setAttribute('aria-disabled', 'true');
    fetch(root + 'cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: parseInt(remove.getAttribute('data-line'), 10), quantity: 0 })
    }).then(function () { return refresh(false); })
      .catch(function () { window.location.href = remove.href; });
  });

  /* ----- Toevoegen vanaf de productpagina ----- */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-product-form]');
    if (!form) return;

    /* Dynamische afrekenknop (Shop Pay, Apple Pay, ...) laat Shopify zelf afhandelen */
    if (e.submitter && !e.submitter.hasAttribute('data-add-to-cart')) return;

    e.preventDefault();

    /* Staat het werk al in de winkelmand: gewoon de winkelmand tonen */
    if (isInCart()) {
      refresh(false).then(openDrawer);
      return;
    }

    var error = form.querySelector('[data-form-error]');
    if (error) error.hidden = true;
    transient = true;
    setButtons('adding');

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
      .then(function () { return refresh(true); })
      .then(function () {
        setButtons('added');
        openDrawer();
        window.setTimeout(function () {
          transient = false;
          setButtons('in-cart');
        }, 1800);
      })
      .catch(function (err) {
        transient = false;
        setButtons('idle');
        if (error) {
          error.textContent = (err && err.message) || error.getAttribute('data-fallback') || '';
          error.hidden = false;
        }
      });
  });
})();
