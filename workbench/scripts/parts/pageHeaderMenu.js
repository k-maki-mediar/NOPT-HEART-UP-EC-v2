$(function () {
  // メニューボタンでパネル開閉
  $('.js-header-menu-toggle').on('click', function () {
    var $btn = $(this);
    var $menu = $('#js-header-menu');
    var $footer = $('.js-footer-menu');
    $menu.toggleClass('is-open');
    var isOpen = $menu.hasClass('is-open');
    $btn.attr('aria-expanded', isOpen);
    $footer.toggle(!isOpen);
  });

  // 商品メニューアコーディオン開閉
  $('.js-header-menu-accordion').on('click', function () {
    var $item = $(this).closest('.c-header-menu__item--accordion');
    $item.toggleClass('is-open');
    var isOpen = $item.hasClass('is-open');
    $(this).attr('aria-expanded', isOpen);
  });
});
