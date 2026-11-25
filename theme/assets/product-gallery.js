/* Productgalerij: swipe-carrousel, thumbnails/stippen en fullscreen lightbox met zoom. */
(function () {
  'use strict';

  if (customElements.get('product-gallery')) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class ProductGallery extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-gallery-track]');
      if (!this.track) return;

      this.slides = Array.prototype.slice.call(this.querySelectorAll('[data-gallery-slide]'));
      this.thumbs = Array.prototype.slice.call(this.querySelectorAll('[data-gallery-thumb]'));
      this.dots = Array.prototype.slice.call(this.querySelectorAll('[data-gallery-dot]'));
      this.openers = Array.prototype.slice.call(this.querySelectorAll('[data-lightbox-open]'));
      this.dialog = this.querySelector('[data-lightbox]');
      this.index = 0;
      this.lightboxIndex = 0;

      this.bindCarousel();
      if (this.dialog) this.bindLightbox();
    }

    /* ----- Carrousel ----- */
    bindCarousel() {
      var self = this;
      var ticking = false;

      this.track.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          var width = self.track.clientWidth || 1;
          self.setActive(Math.round(self.track.scrollLeft / width));
          ticking = false;
        });
      }, { passive: true });

      this.thumbs.forEach(function (thumb, i) {
        thumb.addEventListener('click', function () { self.goTo(i); });
      });

      var prev = this.querySelector(':scope > [data-gallery-prev]');
      var next = this.querySelector(':scope > [data-gallery-next]');
      if (prev) prev.addEventListener('click', function () { self.goTo(self.index - 1); });
      if (next) next.addEventListener('click', function () { self.goTo(self.index + 1); });

      this.track.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); self.goTo(self.index - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); self.goTo(self.index + 1); }
      });
    }

    goTo(i) {
      var max = this.slides.length - 1;
      i = Math.max(0, Math.min(max, i));
      this.track.scrollTo({ left: i * this.track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
      this.setActive(i);
    }

    setActive(i) {
      if (i === this.index) return;
      this.index = i;
      this.thumbs.forEach(function (thumb, n) {
        var active = n === i;
        thumb.classList.toggle('is-active', active);
        if (active) thumb.setAttribute('aria-current', 'true');
        else thumb.removeAttribute('aria-current');
      });
      this.dots.forEach(function (dot, n) { dot.classList.toggle('is-active', n === i); });
    }

    /* ----- Lightbox ----- */
    bindLightbox() {
      var self = this;
      var dialog = this.dialog;
      this.stage = dialog.querySelector('[data-lightbox-stage]');
      this.image = dialog.querySelector('[data-lightbox-image]');
      this.counter = dialog.querySelector('[data-lightbox-counter]');
      this.zoomButton = dialog.querySelector('[data-lightbox-zoom]');

      this.openers.forEach(function (button, n) {
        button.addEventListener('click', function () { self.openLightbox(n); });
      });

      dialog.querySelector('[data-lightbox-close]').addEventListener('click', function () { dialog.close(); });
      var prev = dialog.querySelector('[data-lightbox-prev]');
      var next = dialog.querySelector('[data-lightbox-next]');
      if (prev) prev.addEventListener('click', function () { self.showLightbox(self.lightboxIndex - 1); });
      if (next) next.addEventListener('click', function () { self.showLightbox(self.lightboxIndex + 1); });

      this.zoomButton.addEventListener('click', function () { self.toggleZoom(); });
      this.image.addEventListener('click', function () { self.toggleZoom(); });

      /* Klik naast de afbeelding sluit */
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog || e.target === self.stage) dialog.close();
      });

      dialog.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') self.showLightbox(self.lightboxIndex - 1);
        if (e.key === 'ArrowRight') self.showLightbox(self.lightboxIndex + 1);
      });

      dialog.addEventListener('close', function () {
        document.body.classList.remove('is-locked');
        self.setZoom(false);
        /* Carrousel meebewegen met de laatst bekeken afbeelding */
        var slideIndex = self.slides.indexOf(self.openers[self.lightboxIndex].closest('[data-gallery-slide]'));
        if (slideIndex > -1) self.goTo(slideIndex);
      });

      /* Eenvoudige swipe in de lightbox (niet ingezoomd) */
      var startX = null;
      this.stage.addEventListener('touchstart', function (e) {
        startX = e.touches.length === 1 && !dialog.classList.contains('is-zoomed') ? e.touches[0].clientX : null;
      }, { passive: true });
      this.stage.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 60) self.showLightbox(self.lightboxIndex + (dx < 0 ? 1 : -1));
        startX = null;
      });
    }

    openLightbox(n) {
      this.showLightbox(n);
      document.body.classList.add('is-locked');
      this.dialog.showModal();
    }

    showLightbox(n) {
      var total = this.openers.length;
      if (!total) return;
      n = (n + total) % total;
      this.lightboxIndex = n;
      var source = this.openers[n];
      this.setZoom(false);
      this.image.src = source.getAttribute('data-full');
      this.image.alt = source.getAttribute('data-alt') || '';
      if (this.counter) {
        var template = this.dialog.getAttribute('data-counter-template') || '__CURRENT__ / __TOTAL__';
        this.counter.textContent = template.replace('__CURRENT__', n + 1).replace('__TOTAL__', total);
      }
    }

    toggleZoom() {
      this.setZoom(!this.dialog.classList.contains('is-zoomed'));
    }

    setZoom(on) {
      this.dialog.classList.toggle('is-zoomed', on);
      this.zoomButton.setAttribute('aria-pressed', String(on));
      if (on) {
        var stage = this.stage;
        window.requestAnimationFrame(function () {
          stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
          stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2;
        });
      }
    }
  }

  customElements.define('product-gallery', ProductGallery);
})();
