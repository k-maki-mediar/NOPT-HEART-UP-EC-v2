/**
 * common_design.js
 * デザイン用共通JavaScript（全画面から共通参照）
 * PKGレビュー指摘により、パーツ単位の個別JSを本ファイルに集約。
 */

/* ========================================
 * ヘッダーメニュー（pageHeaderMenu）
 * ======================================== */
$(function () {
  // メニューボタンでパネル開閉
  $('.js-header-menu-toggle').on('click', function () {
    const $btn = $(this);
    const $menu = $('#js-header-menu');
    const $footer = $('.js-footer-menu');
    $menu.toggleClass('c-header-menu--open');
    const isOpen = $menu.hasClass('c-header-menu--open');
    $btn.attr('aria-expanded', isOpen);
    $footer.toggle(!isOpen);
  });

  // 商品メニューアコーディオン開閉
  $('.js-header-menu-accordion').on('click', function () {
    const $item = $(this).closest('.c-header-menu__item--accordion');
    $item.toggleClass('c-header-menu__item--open');
    const isOpen = $item.hasClass('c-header-menu__item--open');
    $(this).attr('aria-expanded', isOpen);
  });
});

/* ========================================
 * フッターメニュー（pageFooterMenu）
 * ======================================== */
$(function () {
  const $footer = $(".js-footer-menu");
  const $main = $(".c-main");

  // mainの下にフッター高さ + 2rem分の余白を確保
  function updateBottomPadding() {
    const footerHeight = $footer.outerHeight();
    const extraPadding = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2;
    $main.css("padding-bottom", footerHeight + extraPadding + "px");
  }

  updateBottomPadding();
  $(window).on("resize", updateBottomPadding);

  // 該当ページのフッターアイコンをアクティブにする
  const pageMap = {
    "mypage": ["マイページ"],
    "coupon": ["クーポン"],
    "rakutoku": ["らくとく"],
    "eye-data": ["Eyeデータ", "eye"]
  };
  const path = decodeURIComponent(window.location.pathname);
  $footer.find("[data-footer-page]").each(function () {
    const page = $(this).data("footer-page");
    const keywords = pageMap[page] || [];
    for (let i = 0; i < keywords.length; i++) {
      if (path.indexOf(keywords[i]) !== -1) {
        $(this).addClass("c-footer-menu__link--active");
        break;
      }
    }
  });
});

/* ========================================
 * サイドナビ（pageSideNav）
 * ======================================== */
$(function () {
  // サイドナビ 商品メニューアコーディオン開閉
  $('.js-side-nav-accordion').on('click', function () {
    const $item = $(this).closest('.c-side-nav__item--accordion');
    $item.toggleClass('c-side-nav__item--open');
    const isOpen = $item.hasClass('c-side-nav__item--open');
    $(this).attr('aria-expanded', isOpen);
  });
});

/* ========================================
 * バナーエリア（bannerArea）
 * ======================================== */
$(function () {
  const $carousel = $(".js-banner-carousel");
  const $btn = $(".js-banner-play-toggle");
  const $pauseIcon = $(".js-banner-pause-icon");
  const $playIcon = $(".js-banner-play-icon");
  let isPlaying = true;

  if ($carousel.length === 0) {
    return;
  }

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
      $pauseIcon.hide();
      $playIcon.show();
      $btn.attr("aria-label", "スライドショーを再生");
    } else {
      $carousel.slick("slickPlay");
      $playIcon.hide();
      $pauseIcon.show();
      $btn.attr("aria-label", "スライドショーを一時停止");
    }
    isPlaying = !isPlaying;
  });
});

/* ========================================
 * カテゴリメニュー（categoryMenu）
 * ======================================== */
$(function () {
  // 初期状態で子カテゴリを非表示
  $('.js-category-sub').hide();

  $('.js-category-toggle').on('click', function () {
    const $btn = $(this);
    const index = $('.js-category-toggle').index($btn);
    const $target = $('.js-category-sub[data-category="' + index + '"]');
    const isOpen = $btn.hasClass('c-category-menu__btn--active');

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

/* ========================================
 * 商品メニュー（productMenu）
 * ======================================== */
$(function () {
  // 商品カテゴリアコーディオン開閉
  $(document).on('click', '.js-product-menu-toggle', function () {
    const $category = $(this).closest('.c-product-menu__category');
    $category.toggleClass('c-product-menu__category--open');
    const isOpen = $category.hasClass('c-product-menu__category--open');
    $(this).attr('aria-expanded', isOpen);
  });
});

/* ========================================
 * 購入可能コンタクトレンズ（availableLens）
 * ======================================== */
$(function () {
  $('.js-available-lens-toggle').on('click', function () {
    const $btn = $(this);
    const $body = $btn.next('.js-available-lens-body');
    const isOpen = $btn.attr('aria-expanded') === 'true';
    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('c-available-lens__body--open');
  });
});

/* ========================================
 * クーポン一覧（couponList）
 * ======================================== */
$(function () {
  $('.js-coupon-list-toggle').on('click', function () {
    const $btn = $(this);
    const $body = $btn.next('.js-coupon-list-body');
    const isOpen = $btn.attr('aria-expanded') === 'true';
    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('c-coupon-list__body--open');
  });
});

/* ========================================
 * 注文履歴（orderHistory）
 * ======================================== */
$(function () {
  $('.js-order-history-toggle').on('click', function () {
    const $btn = $(this);
    const $body = $btn.next('.js-order-history-body');
    const isOpen = $btn.attr('aria-expanded') === 'true';
    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('c-order-history__body--open');
  });
});

/* ========================================
 * お気に入り商品（favoriteProducts）
 * ======================================== */
$(function () {
  $('.js-favorite-products-toggle').on('click', function () {
    const $btn = $(this);
    const $body = $btn.next('.js-favorite-products-body');
    const isOpen = $btn.attr('aria-expanded') === 'true';
    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('c-favorite-products__body--open');
  });
});

/* ========================================
 * SP絞り込みパネル（filterPanel）
 * ======================================== */
$(function () {
  $(document).on('click', '.js-filter-toggle', function () {
    const $btn = $(this);
    const $body = $('#filterPanelBody');
    const isOpen = $btn.attr('aria-expanded') === 'true';
    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('c-filter-panel__body--open');
  });
});

/* ========================================
 * 表示形式切替（商品一覧・listMain）
 * ======================================== */
$(function () {
  $(document).on('click', '.js-display-mode-btn', function () {
    const $btn = $(this);
    const mode = $btn.data('mode');
    const $listMain = $btn.closest('.c-list-main__control').siblings('.c-list-main__grid').parent();

    // .c-list-main を特定（ボタンの祖先）
    const $listMainContainer = $btn.closest('.c-list-main');

    // ボタンのaria-pressed切替
    $btn.closest('.c-list-main__display-mode').find('.js-display-mode-btn').attr('aria-pressed', 'false');
    $btn.attr('aria-pressed', 'true');

    // リストのmodifierクラス切替
    if (mode === 'list') {
      $listMainContainer.addClass('c-list-main--list');
    } else {
      $listMainContainer.removeClass('c-list-main--list');
    }
  });
});
