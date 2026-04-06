/**
 * pager.js
 * ページネーション動的生成・切り替え制御（モック確認用）
 *
 * data-total-pages: 総ページ数
 * data-current-page: 現在ページ
 *
 * 表示ルール:
 * - 常に7枠（数字＋省略記号）を表示し、横幅を一定に保つ
 *   - 先頭付近: 1 2 3 4 5 … 29
 *   - 中間:     1 … 14 15 16 … 29
 *   - 末尾付近: 1 … 25 26 27 28 29
 * - 総ページ数が7以下の場合は全ページ表示
 * - 1ページ目は「前へ」非表示、最終ページは「次へ」非表示
 * - 上部/下部ページャーを同期
 */
(function () {
  'use strict';

  var TOTAL_SLOTS = 7;
  var pagers = document.querySelectorAll('.js-pager');
  if (!pagers.length) return;

  /**
   * 表示するページ番号と省略記号の配列を生成
   * 数字はページ番号、文字列'...'は省略記号
   */
  function getPageSlots(current, total) {
    var i;
    var slots = [];

    // 総ページ数がスロット数以下なら全表示
    if (total <= TOTAL_SLOTS) {
      for (i = 1; i <= total; i++) {
        slots.push(i);
      }
      return slots;
    }

    // 先頭付近: 1 2 3 4 5 … total
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }

    // 末尾付近: 1 … (total-4) (total-3) (total-2) (total-1) total
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }

    // 中間: 1 … (current-1) current (current+1) … total
    return [1, '...', current - 1, current, current + 1, '...', total];
  }

  /**
   * li要素を生成するヘルパー
   */
  function createItem(className, inner) {
    var li = document.createElement('li');
    li.className = 'c-pager__item' + (className ? ' ' + className : '');
    li.appendChild(inner);
    return li;
  }

  /**
   * ページャーのHTMLを動的生成
   */
  function renderPager(pager, current, total) {
    var list = pager.querySelector('.c-pager__list');
    if (!list) return;

    list.innerHTML = '';
    var slots = getPageSlots(current, total);

    // 前へボタン
    var prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.className = 'c-pager__link c-pager__link--prev';
    prevLink.setAttribute('aria-label', '前へ');
    var prevItem = createItem('c-pager__item--prev', prevLink);
    if (current <= 1) prevItem.classList.add('is-hidden');
    list.appendChild(prevItem);

    // ページ番号・省略記号
    for (var i = 0; i < slots.length; i++) {
      if (slots[i] === '...') {
        var ellipsis = document.createElement('span');
        ellipsis.className = 'c-pager__ellipsis';
        ellipsis.textContent = '\u2026';
        list.appendChild(createItem('', ellipsis));
      } else if (slots[i] === current) {
        var span = document.createElement('span');
        span.className = 'c-pager__current';
        span.setAttribute('aria-current', 'page');
        span.textContent = slots[i];
        list.appendChild(createItem('c-pager__item--current', span));
      } else {
        var a = document.createElement('a');
        a.href = '#';
        a.className = 'c-pager__link';
        a.textContent = slots[i];
        list.appendChild(createItem('', a));
      }
    }

    // 次へボタン
    var nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.className = 'c-pager__link c-pager__link--next';
    nextLink.setAttribute('aria-label', '次へ');
    var nextItem = createItem('c-pager__item--next', nextLink);
    if (current >= total) nextItem.classList.add('is-hidden');
    list.appendChild(nextItem);
  }

  /**
   * 全ページャーを更新
   */
  function updateAll(newPage) {
    for (var i = 0; i < pagers.length; i++) {
      var total = parseInt(pagers[i].getAttribute('data-total-pages'), 10) || 1;
      if (newPage < 1) newPage = 1;
      if (newPage > total) newPage = total;
      pagers[i].setAttribute('data-current-page', newPage);
      renderPager(pagers[i], newPage, total);
    }
  }

  // 初期描画
  for (var i = 0; i < pagers.length; i++) {
    var total = parseInt(pagers[i].getAttribute('data-total-pages'), 10) || 1;
    var current = parseInt(pagers[i].getAttribute('data-current-page'), 10) || 1;
    renderPager(pagers[i], current, total);
  }

  // クリックイベント（イベント委任）
  document.addEventListener('click', function (e) {
    var target = e.target.closest('.c-pager__link');
    if (!target) return;

    var pager = target.closest('.js-pager');
    if (!pager) return;

    e.preventDefault();

    var current = parseInt(pager.getAttribute('data-current-page'), 10) || 1;
    var newPage;

    if (target.classList.contains('c-pager__link--prev')) {
      newPage = current - 1;
    } else if (target.classList.contains('c-pager__link--next')) {
      newPage = current + 1;
    } else {
      newPage = parseInt(target.textContent, 10);
    }

    if (isNaN(newPage) || newPage === current) return;

    updateAll(newPage);
  });
})();
