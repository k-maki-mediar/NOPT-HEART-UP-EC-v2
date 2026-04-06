$(function () {
  var $footer = $(".js-footer-menu");

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
