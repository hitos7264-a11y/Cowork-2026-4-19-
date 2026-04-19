// COWORK 2026 - Main JS
(function() {
  'use strict';

  var THEME_KEY = 'cowork-theme';

  function applyTheme(theme) {
    var t = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', t === 'light' ? '#f4f6fb' : '#07080c');
    }
    var label = t === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え';
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(cur === 'light' ? 'dark' : 'light');
    });
  });

  applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  // Scroll-triggered reveal animation
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // Smooth internal anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // Glossary search
  const gs = document.querySelector('#glossary-search');
  if (gs) {
    gs.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll('.term').forEach((t) => {
        const text = t.innerText.toLowerCase();
        if (!q || text.includes(q)) t.classList.remove('hidden');
        else t.classList.add('hidden');
      });
    });
  }

  // Highlight active bottom nav item based on path
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach((n) => {
    const href = n.getAttribute('data-match');
    if (href && path.startsWith(href)) n.classList.add('active');
  });

  // Animate stat numbers on home
  const nums = document.querySelectorAll('.stat-card .num[data-count]');
  if (nums.length && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const dur = 1400;
          const start = performance.now();
          const from = 0;
          const tick = (now) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const v = from + (target - from) * eased;
            el.textContent = (Number.isInteger(target) ? Math.round(v) : v.toFixed(1)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io2.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io2.observe(n));
  }
})();
