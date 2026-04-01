$(function () {
  var $footer = $(".js-footer-menu");
  var $main = $(".c-main");

  // mainの下にフッター高さ + 2rem分の余白を確保
  function updateBottomPadding() {
    var footerHeight = $footer.outerHeight();
    var extraPadding = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2;
    $main.css("padding-bottom", footerHeight + extraPadding + "px");
  }

  updateBottomPadding();
  $(window).on("resize", updateBottomPadding);
});
