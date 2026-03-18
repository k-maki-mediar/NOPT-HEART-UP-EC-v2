$(function () {
  // 初期状態で子カテゴリを非表示
  $('.js-category-sub').hide();

  $('.js-category-toggle').on('click', function () {
    var $btn = $(this);
    var index = $('.js-category-toggle').index($btn);
    var $target = $('.js-category-sub[data-category="' + index + '"]');
    var isOpen = $btn.hasClass('is-active');

    // 全て閉じる
    $('.js-category-toggle').removeClass('is-active').attr('aria-expanded', 'false');
    $('.js-category-sub').slideUp(300);

    // 同じボタンなら閉じるだけ、別なら開く
    if (!isOpen) {
      $btn.addClass('is-active').attr('aria-expanded', 'true');
      $target.slideDown(300);
    }
  });
});
