$(function () {
  // メニューボタンでパネル開閉
  $('.js-header-menu-toggle').on('click', function () {
    var $btn = $(this);
    var $menu = $('#js-header-menu');
    var $footer = $('.js-footer-menu');
    $menu.toggleClass('c-header-menu--open');
    var isOpen = $menu.hasClass('c-header-menu--open');
    $btn.attr('aria-expanded', isOpen);
    $footer.toggle(!isOpen);
  });

  // 商品メニューアコーディオン開閉
  $('.js-header-menu-accordion').on('click', function () {
    var $item = $(this).closest('.c-header-menu__item--accordion');
    $item.toggleClass('c-header-menu__item--open');
    var isOpen = $item.hasClass('c-header-menu__item--open');
    $(this).attr('aria-expanded', isOpen);
  });
});
