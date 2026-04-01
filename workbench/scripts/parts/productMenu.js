$(function () {
  // 商品カテゴリアコーディオン開閉
  $(document).on('click', '.js-product-menu-toggle', function () {
    var $category = $(this).closest('.c-product-menu__category');
    $category.toggleClass('c-product-menu__category--open');
    var isOpen = $category.hasClass('c-product-menu__category--open');
    $(this).attr('aria-expanded', isOpen);
  });
});
