$(function () {
  var $footer = $(".js-footer-menu");
  var lastScrollTop = 0;

  $(window).on("scroll", function () {
    var currentScrollTop = $(this).scrollTop();

    if (currentScrollTop > lastScrollTop) {
      // 下スクロール → 非表示
      $footer.addClass("is-hidden");
    } else {
      // 上スクロール → 表示
      $footer.removeClass("is-hidden");
    }

    lastScrollTop = currentScrollTop;
  });
});
