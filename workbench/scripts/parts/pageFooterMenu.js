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

  // 該当ページのフッターアイコンをアクティブにする
  var pageMap = {
    "mypage": ["マイページ"],
    "coupon": ["クーポン"],
    "rakutoku": ["らくとく"],
    "eye-data": ["Eyeデータ", "eye"]
  };
  var path = decodeURIComponent(window.location.pathname);
  $footer.find("[data-footer-page]").each(function () {
    var page = $(this).data("footer-page");
    var keywords = pageMap[page] || [];
    for (var i = 0; i < keywords.length; i++) {
      if (path.indexOf(keywords[i]) !== -1) {
        $(this).addClass("c-footer-menu__link--active");
        break;
      }
    }
  });
});
