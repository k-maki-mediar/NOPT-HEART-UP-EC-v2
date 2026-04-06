/**
 * filterPanel.js
 * SP専用フィルターパネル アコーディオン開閉制御
 */
(function () {
  'use strict';

  var toggle = document.querySelector('.js-filter-toggle');
  if (!toggle) return;

  var bodyId = toggle.getAttribute('aria-controls');
  var body = bodyId ? document.getElementById(bodyId) : null;
  if (!body) return;

  toggle.addEventListener('click', function () {
    var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));

    if (isExpanded) {
      body.classList.remove('c-filter-panel__body--open');
    } else {
      body.classList.add('c-filter-panel__body--open');
    }
  });
})();
