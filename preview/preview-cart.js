/* Voorbeeldweergave: werkende winkelmand met localStorage.
   Bootst het gedrag van theme/assets/cart.js na (drawer, knopstatussen, cartpagina),
   zonder Shopify. Alleen voor de preview — het echte thema gebruikt cart.js. */
(function () {
  'use strict';

  var KEY = 'sw_preview_cart_v1';
  var W = window.SW_WORKS || {};
  var dialog = document.querySelector('[data-cart-drawer]');
  var drawerBody = dialog && dialog.querySelector('[data-cart-drawer-body]');
  var pagePanel = document.querySelector('[data-cart-page-content]');
  var onCartPage = document.body.hasAttribute('data-cart-page');
  var productEl = document.querySelector('[data-product-id]');
  var productId = productEl ? productEl.getAttribute('data-product-id') : null;
  var transient = false;

  /* ---------- opslag ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* geen opslag */ } }
  function money(n) { return '€' + n.toFixed(2).replace('.', ','); }

  /* ---------- iconen ---------- */
  var ICONS = {
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="1"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    'return': '<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v4.5h4.5"/>',
    certificate: '<path d="M4 4h16v12H4z"/><path d="M8 9h8M8 12h4"/><path d="m14.5 16-.8 5 2.8-1.6 2.8 1.6-.8-5"/>'
  };
  function icon(name) {
    return '<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  /* ---------- markup (zelfde structuur als de Liquid-snippets) ---------- */
  function itemsHtml(list) {
    return '<ul class="cart-items" role="list">' + list.map(function (h) {
      var w = W[h];
      return '<li class="cart-item">' +
        '<a class="cart-item__media" href="' + w.url + '" tabindex="-1" aria-hidden="true"><img src="' + w.img + '" width="96" alt=""></a>' +
        '<div class="cart-item__info"><p class="cart-item__unique eyebrow">Uniek origineel — 1 beschikbaar</p>' +
        '<a class="cart-item__title" href="' + w.url + '">' + w.title + '</a>' +
        '<p class="cart-item__meta small">' + w.meta + '</p>' +
        '<a class="cart-item__remove small" href="#" data-cart-remove data-handle="' + h + '" aria-label="' + w.title + ' verwijderen">Verwijderen</a></div>' +
        '<p class="cart-item__price">' + money(w.price) + '</p></li>';
    }).join('') + '</ul>';
  }

  function summaryHtml(list) {
    var total = list.reduce(function (sum, h) { return sum + W[h].price; }, 0);
    var pay = ['iDEAL', 'Bancontact', 'Visa', 'Mastercard', 'PayPal'].map(function (n) {
      return '<li><span class="pp-badge">' + n + '</span></li>';
    }).join('');
    return '<div class="cart-summary">' +
      '<p class="cart-summary__row"><span>Subtotaal</span><span class="cart-summary__total">' + money(total) + '</span></p>' +
      '<p class="cart-summary__shipping">' + icon('truck') + '<span>Gratis verzekerde verzending (NL)</span></p>' +
      '<p class="cart-summary__note small">Gratis verzekerde verzending binnen Nederland. Btw en eventuele verzendkosten naar het buitenland zie je bij het afrekenen.</p>' +
      '<div class="cart-summary__form"><button type="button" class="button button--full button--buy" data-preview-checkout>' + icon('lock') + 'Afrekenen</button></div>' +
      '<ul class="cart-summary__payments" role="list" aria-label="Betaalmethoden">' + pay + '</ul>' +
      '<ul class="cart-summary__trust small" role="list"><li>' + icon('return') + '14 dagen bedenktijd</li><li>' + icon('certificate') + 'Certificaat van echtheid</li><li>' + icon('lock') + 'Veilig afrekenen</li></ul>' +
      '<div class="cart-summary__help small"><p class="cart-summary__help-title">Vragen voor je afrekent?</p>' +
      '<p class="muted">Ik help je graag, ook met de maat of kleur op jouw muur.</p>' +
      '<p class="cart-summary__help-links"><a href="#">WhatsApp</a><a href="#">E-mail</a></p></div></div>';
  }

  function recsHtml(list, limit) {
    var picks = Object.keys(W).filter(function (h) { return !W[h].sold && list.indexOf(h) === -1; }).slice(0, limit);
    if (!picks.length) return '';
    return '<section class="cart-recs"><h2 class="cart-recs__heading h3">Misschien ook mooi</h2><ul class="cart-recs__grid" role="list">' +
      picks.map(function (h) {
        var w = W[h];
        return '<li><article class="product-card"><div class="product-card__media"><img class="product-card__image" src="' + w.img + '" alt="' + w.title + ' — acryl schilderij van Sutarwaty" width="800" height="1000"></div>' +
          '<div class="product-card__info"><h3 class="product-card__title"><a class="product-card__link" href="' + w.url + '">' + w.title + '</a></h3>' +
          '<p class="product-card__meta small">' + w.meta + '</p><p class="product-card__price"><span class="price"><span class="price__current">' + money(w.price) + '</span></span></p></div></article></li>';
      }).join('') + '</ul></section>';
  }

  function emptyHtml() {
    return '<div class="cart-empty"><p class="cart-empty__title h3">Je winkelmand is leeg.</p>' +
      '<p class="muted">Ontdek de originele werken en vind er een dat bij jouw muur past.</p>' +
      '<a class="button" href="collection.html">Verder kijken</a></div>';
  }

  /* ---------- renderen ---------- */
  function render() {
    var list = load().filter(function (h) { return W[h]; });
    var count = list.length;

    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });
    document.querySelectorAll('[data-cart-label]').forEach(function (el) {
      el.textContent = 'Winkelmand, ' + count + (count === 1 ? ' werk' : ' werken');
    });

    if (drawerBody) {
      drawerBody.innerHTML = count === 0
        ? emptyHtml() + recsHtml(list, 2)
        : '<div class="cart-drawer__items">' + itemsHtml(list) + '</div><div class="cart-drawer__footer">' + summaryHtml(list) + '</div>';
    }

    if (pagePanel) {
      pagePanel.innerHTML = count === 0
        ? emptyHtml() + recsHtml(list, 3)
        : '<div class="cart-page__grid"><div class="cart-page__items">' + itemsHtml(list) + '</div><aside class="cart-page__summary">' + summaryHtml(list) + '</aside></div>' + recsHtml(list, 3);
    }

    if (productId && !transient) setButtons(list.indexOf(productId) > -1 ? 'in-cart' : 'idle');
  }

  /* ---------- knoppen (zelfde statussen als cart.js) ---------- */
  var LABEL = { idle: 'data-idle-label', adding: 'data-adding-label', added: 'data-added-label', 'in-cart': 'data-in-cart-label' };
  function setButtons(state) {
    document.querySelectorAll('[data-add-to-cart]').forEach(function (button) {
      var label = button.querySelector('[data-add-label]') || button;
      var text = button.getAttribute(LABEL[state]);
      if (text) label.textContent = text;
      button.disabled = state === 'adding';
      button.classList.toggle('is-added', state === 'added');
      if (state === 'added' || state === 'in-cart') button.setAttribute('data-in-cart', '');
      else if (state === 'idle') button.removeAttribute('data-in-cart');
    });
  }

  function openDrawer() {
    if (!dialog || dialog.open) return;
    dialog.showModal();
    document.body.classList.add('is-locked');
  }
  function closeDrawer() { if (dialog && dialog.open) dialog.close(); }

  function bump() {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.classList.remove('is-bumped');
      void el.offsetWidth;
      el.classList.add('is-bumped');
    });
  }

  /* ---------- toast voor "afrekenen" ---------- */
  var toast;
  function showToast(message) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'preview-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(function () { toast.hidden = true; }, 6000);
  }

  /* ---------- events ---------- */
  if (dialog) {
    dialog.addEventListener('close', function () { document.body.classList.remove('is-locked'); });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target.closest('[data-cart-close]')) closeDrawer();
    });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-cart-link]');
    if (link && !onCartPage) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      render();
      openDrawer();
      return;
    }

    var remove = e.target.closest('[data-cart-remove]');
    if (remove) {
      e.preventDefault();
      var handle = remove.getAttribute('data-handle');
      save(load().filter(function (h) { return h !== handle; }));
      render();
      return;
    }

    if (e.target.closest('[data-preview-checkout]')) {
      showToast('Voorbeeldweergave: in de echte winkel ga je nu naar Shopify\'s veilige betaalpagina (iDEAL, Bancontact, creditcard, PayPal).');
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-product-form]');
    if (!form) return;
    e.preventDefault();

    var button = document.querySelector('[data-add-to-cart]');
    if (button && button.hasAttribute('data-in-cart')) { render(); openDrawer(); return; }

    transient = true;
    setButtons('adding');
    window.setTimeout(function () {
      var list = load();
      if (list.indexOf(productId) === -1) list.push(productId);
      save(list);
      render();
      bump();
      setButtons('added');
      openDrawer();
      window.setTimeout(function () { transient = false; setButtons('in-cart'); }, 1800);
    }, 350);
  });

  window.addEventListener('storage', render);
  render();
})();
