$(function () {
  var $footer = $(".js-footer-menu");
  var $main = $(".c-main");
  var scrollTimer = null;

  $(window).on("scroll", function () {
    // スクロール中は非表示
    $footer.addClass("is-hidden");

    // タイマーリセット
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }

    // スクロール停止後に表示
    scrollTimer = setTimeout(function () {
      $footer.removeClass("is-hidden");
    }, 300);
  });

  // mainの下にフッター高さ + 2rem分の余白を確保
  function updateBottomPadding() {
    var footerHeight = $footer.outerHeight();
    var extraPadding = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2;
    $main.css("padding-bottom", footerHeight + extraPadding + "px");
  }

  updateBottomPadding();
  $(window).on("resize", updateBottomPadding);
});
