$(function () {
  // メニューボタンでパネル開閉
  $('.js-header-menu-toggle').on('click', function () {
    var $btn = $(this);
    var $menu = $('#js-header-menu');
    $menu.slideToggle(300, function () {
      var isOpen = $menu.is(':visible');
      $btn.attr('aria-expanded', isOpen);
    });
  });

  // 商品メニューアコーディオン開閉
  $('.js-header-menu-accordion').on('click', function () {
    var $item = $(this).closest('.c-header-menu__item--accordion');
    var $submenu = $item.find('.c-header-menu__submenu');
    $item.toggleClass('is-open');
    $submenu.slideToggle(300);
  });
});
