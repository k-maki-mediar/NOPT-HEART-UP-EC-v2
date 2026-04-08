/**
 * filterPanel.js
 * SP専用フィルターパネル アコーディオン開閉制御
 */
(function () {
  'use strict';

  const toggle = document.querySelector('.js-filter-toggle');
  if (!toggle) return;

  const bodyId = toggle.getAttribute('aria-controls');
  const body = bodyId ? document.getElementById(bodyId) : null;
  if (!body) return;

  toggle.addEventListener('click', function () {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));

    if (isExpanded) {
      body.classList.remove('c-filter-panel__body--open');
    } else {
      body.classList.add('c-filter-panel__body--open');
    }
  });
})();
