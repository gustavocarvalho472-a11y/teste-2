(function () {
  'use strict';

  var cfg = window.VORA_CONFIG || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Marquees: duplicate content so translateX(-50%) loops seamlessly ---------- */
  document.querySelectorAll('[data-marquee]').forEach(function (track) {
    var items = Array.prototype.slice.call(track.children);
    // Text marquees need several copies to fill wide screens; the photo strip needs one.
    var copies = track.classList.contains('marquee__track') ? 3 : 1;
    for (var c = 0; c < copies; c++) {
      items.forEach(function (el) { track.appendChild(el.cloneNode(true)); });
    }
  });

  /* ---------- Kit selection ---------- */
  var cards = document.querySelectorAll('.kit-card');
  var select = function (i, focus) {
    cards.forEach(function (c, n) {
      var on = n === i;
      c.classList.toggle('is-selected', on);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
      c.tabIndex = on ? 0 : -1;
      if (on && focus) c.focus();
    });
  };

  cards.forEach(function (card, i) {
    var kit = (cfg.kits || [])[i] || {};
    var cta = card.querySelector('[data-field="checkout"]');
    if (cta && kit.checkout) cta.href = kit.checkout;
    // Sem link de checkout configurado, o botão só seleciona o kit (não pula pro topo)
    else if (cta) cta.addEventListener('click', function (e) { e.preventDefault(); });

    card.addEventListener('click', function () { select(i); });
    card.addEventListener('keydown', function (e) {
      var key = e.key;
      if (key === 'ArrowRight' || key === 'ArrowDown') { e.preventDefault(); select((i + 1) % cards.length, true); }
      else if (key === 'ArrowLeft' || key === 'ArrowUp') { e.preventDefault(); select((i - 1 + cards.length) % cards.length, true); }
      else if ((key === ' ' || key === 'Enter') && e.target === card) { e.preventDefault(); select(i); }
    });
  });
  if (cards.length) select(cfg.defaultKit != null ? cfg.defaultKit : 1);

  /* ---------- Contact links ---------- */
  if (cfg.whatsappNumber) {
    var wa = 'https://wa.me/' + cfg.whatsappNumber +
      (cfg.whatsappMessage ? '?text=' + encodeURIComponent(cfg.whatsappMessage) : '');
    document.querySelectorAll('[data-link="whatsapp"]').forEach(function (a) { a.href = wa; });
  }
  if (cfg.instagramHandle) {
    document.querySelectorAll('[data-link="instagram"]').forEach(function (a) {
      a.href = 'https://instagram.com/' + cfg.instagramHandle;
      (a.querySelector('[data-link-text]') || a).textContent = '@' + cfg.instagramHandle;
    });
  }
  if (cfg.email) {
    document.querySelectorAll('[data-link="email"]').forEach(function (a) {
      a.href = 'mailto:' + cfg.email;
      (a.querySelector('[data-link-text]') || a).textContent = cfg.email;
    });
  }
  if (cfg.phone) {
    document.querySelectorAll('[data-field="phone"]').forEach(function (el) { el.textContent = cfg.phone; });
  }

  /* ---------- Testimonial videos: muted autoplay when on screen, tap for sound ---------- */
  var videoCards = document.querySelectorAll('.video-card[data-src]');
  var videos = [];
  videoCards.forEach(function (card) {
    var src = card.getAttribute('data-src');
    if (!src) return;
    var label = card.textContent.trim();
    var v = document.createElement('video');
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.preload = 'none';
    if (card.dataset.poster) v.poster = card.dataset.poster;
    v.setAttribute('aria-label', label);
    v.dataset.src = src;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'video-card__sound';
    var setLabel = function () {
      btn.classList.toggle('is-on', !v.muted);
      btn.setAttribute('aria-pressed', v.muted ? 'false' : 'true');
      btn.innerHTML = (v.muted ? 'Toque para ouvir' : 'Som ligado') +
        '<span class="visually-hidden"> — ' + label + '</span>';
    };
    var toggle = function () {
      if (!v.src) v.src = v.dataset.src;
      // Only one video with sound at a time
      if (v.muted) videos.forEach(function (o) { if (o !== v && !o.muted) { o.muted = true; o.dispatchEvent(new Event('soundchange')); } });
      v.muted = !v.muted;
      v.play().catch(function () {});
      setLabel();
    };
    v.addEventListener('soundchange', setLabel);
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    v.addEventListener('click', toggle);
    setLabel();

    card.textContent = '';
    card.classList.add('has-video');
    card.appendChild(v);
    card.appendChild(btn);
    videos.push(v);
  });
  if (videos.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.src) v.src = v.dataset.src;
          if (!reduceMotion || !v.muted) v.play().catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.6 });
    videos.forEach(function (v) { io.observe(v); });
  } else {
    videos.forEach(function (v) { v.src = v.dataset.src; v.controls = true; });
  }

  /* ---------- Carousels (depoimentos, antes e depois): synced dots ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (scroller) {
    var dotsWrap = scroller.nextElementSibling;
    if (!dotsWrap || !dotsWrap.classList.contains('carousel-dots')) return;
    var items = scroller.firstElementChild.children;
    var dots = [];
    Array.prototype.forEach.call(items, function (item, n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel-dot';
      b.setAttribute('aria-label', 'Ir para o item ' + (n + 1));
      b.addEventListener('click', function () {
        var left = item.offsetLeft - (scroller.clientWidth - item.offsetWidth) / 2;
        scroller.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
      dotsWrap.appendChild(b);
      dots.push(b);
    });
    var sync = function () {
      var overflow = scroller.scrollWidth > scroller.clientWidth + 2;
      dotsWrap.hidden = !overflow;
      if (!overflow) return;
      var center = scroller.scrollLeft + scroller.clientWidth / 2;
      var best = 0, bestD = Infinity;
      Array.prototype.forEach.call(items, function (c, n) {
        var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < bestD) { bestD = d; best = n; }
      });
      dots.forEach(function (d, n) { d.classList.toggle('is-active', n === best); });
    };
    var raf = 0;
    scroller.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    }, { passive: true });
    window.addEventListener('resize', sync);
    window.addEventListener('load', sync);
    scroller.querySelectorAll('img, video').forEach(function (m) { m.addEventListener('load', sync); m.addEventListener('loadedmetadata', sync); });
    sync();
  });
})();
