$(function () {
  // 初期状態で子カテゴリを非表示
  $('.js-category-sub').hide();

  $('.js-category-toggle').on('click', function () {
    var $btn = $(this);
    var index = $('.js-category-toggle').index($btn);
    var $target = $('.js-category-sub[data-category="' + index + '"]');
    var isOpen = $btn.hasClass('is-active');

    // 全て即非表示
    $('.js-category-toggle').removeClass('is-active').attr('aria-expanded', 'false');
    $('.js-category-sub').hide();

    // 同じボタンなら閉じるだけ、別なら開いて順番に表示
    if (!isOpen) {
      $btn.addClass('is-active').attr('aria-expanded', 'true');
      $target.show();
      // 子アイテムを左上から順番にフェードイン
      $target.find('.c-category-menu__subitem').css('opacity', 0).each(function (i) {
        $(this).delay(i * 120).animate({ opacity: 1 }, 400);
      });
    }
  });
});
