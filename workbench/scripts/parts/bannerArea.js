$(function () {
  var $carousel = $(".js-banner-carousel");
  var $btn = $(".js-banner-play-toggle");
  var $icon = $(".js-banner-play-icon");
  var isPlaying = true;

  $carousel.slick({
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    arrows: false,
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    adaptiveHeight: true
  });

  // dotsの横にボタンを移動して表示
  $carousel.find(".slick-dots").append($btn);
  $btn.show();

  $btn.on("click", function () {
    if (isPlaying) {
      $carousel.slick("slickPause");
      $icon.removeClass("bi-pause-fill").addClass("bi-play-fill");
      $btn.attr("aria-label", "スライドショーを再生");
    } else {
      $carousel.slick("slickPlay");
      $icon.removeClass("bi-play-fill").addClass("bi-pause-fill");
      $btn.attr("aria-label", "スライドショーを一時停止");
    }
    isPlaying = !isPlaying;
  });
});
