/**
 * pageFooter.js
 * ページトップへ戻るボタンの表示制御
 * - 下方向スクロール時にボタンを表示
 * - 上方向スクロール時にボタンを非表示
 */
(function () {
  var btn = document.querySelector('.c-page-footer__page-top-link');
  if (!btn) return;

  // スクロール閾値
  var SCROLL_THRESHOLD = 200;
  var SCROLL_DELTA_THRESHOLD = 5;

  var lastScrollY = window.scrollY;
  var scrollDirection = null;
  var ticking = false;

  function detectScrollDirection(currentScrollY) {
    var delta = Math.abs(currentScrollY - lastScrollY);

    if (delta < SCROLL_DELTA_THRESHOLD) {
      return scrollDirection;
    }

    if (currentScrollY > lastScrollY) {
      scrollDirection = 'down';
    } else if (currentScrollY < lastScrollY) {
      scrollDirection = 'up';
    }

    lastScrollY = currentScrollY;
    return scrollDirection;
  }

  function updateVisibility() {
    var currentScrollY = window.scrollY;

    // ページトップ付近では常に非表示
    if (currentScrollY < SCROLL_THRESHOLD) {
      btn.classList.remove('is-visible');
      ticking = false;
      return;
    }

    var direction = detectScrollDirection(currentScrollY);

    // 下方向スクロール時に表示
    if (direction === 'down') {
      btn.classList.add('is-visible');
    } else if (direction === 'up') {
      btn.classList.remove('is-visible');
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  }, { passive: true });

  // クリック時にスムーズスクロール
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 初期状態を設定
  updateVisibility();
})();
