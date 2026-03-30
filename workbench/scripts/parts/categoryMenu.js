$(function () {
  // 初期状態で子カテゴリを非表示
  $('.js-category-sub').hide();

  $('.js-category-toggle').on('click', function () {
    var $btn = $(this);
    var index = $('.js-category-toggle').index($btn);
    var $target = $('.js-category-sub[data-category="' + index + '"]');
    var isOpen = $btn.hasClass('c-category-menu__btn--active');

    // 全て即非表示
    $('.js-category-toggle').removeClass('c-category-menu__btn--active').attr('aria-expanded', 'false');
    $('.js-category-sub').hide();

    // 同じボタンなら閉じるだけ、別なら開く
    if (!isOpen) {
      $btn.addClass('c-category-menu__btn--active').attr('aria-expanded', 'true');
      $target.show();
    }
  });
});
