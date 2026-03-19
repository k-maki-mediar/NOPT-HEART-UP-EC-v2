$(function () {
  // サイドナビ 商品メニューアコーディオン開閉
  $('.js-side-nav-accordion').on('click', function () {
    var $item = $(this).closest('.c-side-nav__item--accordion');
    var $submenu = $item.find('.c-side-nav__submenu');
    $item.toggleClass('is-open');
    $submenu.slideToggle(300);
  });
});
