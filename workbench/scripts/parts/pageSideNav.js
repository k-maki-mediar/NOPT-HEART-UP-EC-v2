$(function () {
  // サイドナビ 商品メニューアコーディオン開閉
  $('.js-side-nav-accordion').on('click', function () {
    var $item = $(this).closest('.c-side-nav__item--accordion');
    $item.toggleClass('c-side-nav__item--open');
    var isOpen = $item.hasClass('c-side-nav__item--open');
    $(this).attr('aria-expanded', isOpen);
  });
});
