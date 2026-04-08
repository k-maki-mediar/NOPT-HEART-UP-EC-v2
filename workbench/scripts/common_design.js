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

  // mainの下にフッター高さ分の余白を確保（pageFooterがある画面は不要）
  const hasPageFooter = $(".c-page-footer").length > 0;
  function updateBottomPadding() {
    if (hasPageFooter) {
      $main.css("padding-bottom", 0);
    } else {
      const footerHeight = $footer.outerHeight();
      $main.css("padding-bottom", footerHeight + "px");
    }
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
 * カスタムセレクト（c-detail-unit__select → カスタムUI化）
 * ======================================== */
$(function () {
  $('.c-detail-unit__select, .c-detail-unit__prescription-select').each(function () {
    const $select = $(this);
    const $wrap = $select.closest('.c-detail-unit__select-wrap').length
      ? $select.closest('.c-detail-unit__select-wrap')
      : $select.parent();

    // カスタムUI生成
    const $custom = $('<div class="c-detail-unit__custom-select"></div>');
    const $trigger = $('<button type="button" class="c-detail-unit__custom-select-trigger" aria-haspopup="listbox" aria-expanded="false"></button>');
    const $panel = $('<div class="c-detail-unit__custom-select-panel" role="listbox"></div>');

    // option をボタンとして生成
    $select.find('option').each(function () {
      const $opt = $(this);
      const $optBtn = $('<button type="button" class="c-detail-unit__custom-select-option" role="option"></button>');
      $optBtn.text($opt.text());
      $optBtn.attr('data-value', $opt.val());
      if ($opt.is(':selected')) {
        $optBtn.addClass('c-detail-unit__custom-select-option--selected');
        $optBtn.attr('aria-selected', 'true');
        $trigger.text($opt.text());
      }
      $panel.append($optBtn);
    });

    $custom.append($trigger).append($panel);
    $wrap.append($custom);

    // トリガークリックで開閉
    $trigger.on('click', function (e) {
      e.stopPropagation();
      const isOpen = $custom.hasClass('c-detail-unit__custom-select--open');

      // 他のドロップダウンを閉じる
      $('.c-detail-unit__custom-select--open').removeClass('c-detail-unit__custom-select--open')
        .find('.c-detail-unit__custom-select-trigger').attr('aria-expanded', 'false');

      if (!isOpen) {
        $custom.addClass('c-detail-unit__custom-select--open');
        $trigger.attr('aria-expanded', 'true');

        // 処方箋テーブル内: fixed位置でパネルを表示（テーブルのoverflow問題回避）
        if ($select.hasClass('c-detail-unit__prescription-select')) {
          const rect = $trigger[0].getBoundingClientRect();
          $panel.css({
            top: rect.bottom + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px'
          });
        }
      }
    });

    // 選択肢クリック
    $panel.on('click', '.c-detail-unit__custom-select-option', function () {
      const $opt = $(this);
      const val = $opt.data('value');

      // ネイティブselectを更新してchangeイベント発火
      $select.val(val).trigger('change');

      // UI更新
      $panel.find('.c-detail-unit__custom-select-option')
        .removeClass('c-detail-unit__custom-select-option--selected')
        .attr('aria-selected', 'false');
      $opt.addClass('c-detail-unit__custom-select-option--selected')
        .attr('aria-selected', 'true');
      $trigger.contents().first().replaceWith($opt.text());

      // 閉じる
      $custom.removeClass('c-detail-unit__custom-select--open');
      $trigger.attr('aria-expanded', 'false');
    });
  });

  // 外側クリックで閉じる
  $(document).on('click', function () {
    $('.c-detail-unit__custom-select--open').removeClass('c-detail-unit__custom-select--open')
      .find('.c-detail-unit__custom-select-trigger').attr('aria-expanded', 'false');
  });

  // Escキーで閉じる
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.c-detail-unit__custom-select--open').removeClass('c-detail-unit__custom-select--open')
        .find('.c-detail-unit__custom-select-trigger').attr('aria-expanded', 'false');
    }
  });
});

/* ========================================
 * 商品詳細（detailUnitMain）
 * ======================================== */
$(function () {

  // ----------------------------------------
  // 商品画像スライダー（ドット・サムネイル切替）
  // ----------------------------------------
  const $slider = $('.js-detail-image-slider');
  const $slides = $slider.find('.c-detail-unit__image-slide');
  const $dots = $('.js-detail-image-dot');
  const $thumbBtns = $('.js-detail-thumbnail-btn');

  function showSlide(index) {
    const total = $slides.length;
    const safeIndex = Math.max(0, Math.min(index, total - 1));
    $slides.hide().eq(safeIndex).show();
    $dots.removeClass('c-detail-unit__image-dot--active').eq(safeIndex).addClass('c-detail-unit__image-dot--active');
    $thumbBtns.removeClass('c-detail-unit__thumbnail-btn--active').eq(safeIndex).addClass('c-detail-unit__thumbnail-btn--active');
  }

  // 初期表示（最初のスライドのみ表示）
  if ($slides.length > 1) {
    $slides.hide().first().show();
  }

  $dots.on('click', function () {
    showSlide(parseInt($(this).data('index'), 10));
  });

  $thumbBtns.on('click', function () {
    showSlide(parseInt($(this).data('index'), 10));
  });

  // ----------------------------------------
  // 通常注文：左右数量0→ボタン切替（コンタクトレンズ）
  // ----------------------------------------
  const $qRight = $('.js-detail-quantity-right');
  const $qLeft = $('.js-detail-quantity-left');
  const $cartBtnNormal = $('.js-detail-cart-btn-normal');
  const $totalDisplay = $('.js-detail-quantity-total');

  function updateNormalCartBtn() {
    if ($qRight.length === 0 && $qLeft.length === 0) { return; }
    const right = parseInt($qRight.val() || '0', 10);
    const left = parseInt($qLeft.val() || '0', 10);
    const total = right + left;

    // 合計箱数表示更新
    if ($totalDisplay.length) {
      // 単価はdata属性から取得（実装時はHTMLにdata-unit-price属性を付与）
      const unitPrice = parseInt($totalDisplay.data('unit-price') || '3300', 10);
      $totalDisplay.text('計 ' + total + '箱 　1箱あたり ' + unitPrice.toLocaleString() + '円');
    }

    if (total > 0) {
      $cartBtnNormal.text('カートに入れる').prop('disabled', false).removeAttr('aria-disabled');
    } else {
      $cartBtnNormal.text('カートに入れる').prop('disabled', true).attr('aria-disabled', 'true');
    }
  }

  $qRight.on('change', updateNormalCartBtn);
  $qLeft.on('change', updateNormalCartBtn);
  updateNormalCartBtn();

  // ----------------------------------------
  // らくとく定期便：左右チェックOFF→ボタン切替（コンタクトレンズ）
  // ----------------------------------------
  const $rakutokuRight = $('.js-detail-rakutoku-right');
  const $rakutokuLeft = $('.js-detail-rakutoku-left');
  const $cartBtnRakutoku = $('.js-detail-cart-btn-rakutoku');

  function updateRakutokuCartBtn() {
    if ($rakutokuRight.length === 0 && $rakutokuLeft.length === 0) { return; }
    const rightChecked = $rakutokuRight.is(':checked');
    const leftChecked = $rakutokuLeft.is(':checked');

    if (rightChecked || leftChecked) {
      $cartBtnRakutoku.text('定期便を申し込む').prop('disabled', false).removeAttr('aria-disabled');
    } else {
      $cartBtnRakutoku.text('定期便を申し込む').prop('disabled', true).attr('aria-disabled', 'true');
    }
  }

  $rakutokuRight.on('change', updateRakutokuCartBtn);
  $rakutokuLeft.on('change', updateRakutokuCartBtn);
  updateRakutokuCartBtn();

  // ----------------------------------------
  // カート投入後モーダル
  // ----------------------------------------
  const $modal = $('.js-cart-modal');
  const $modalOverlay = $('.js-cart-modal-overlay');
  const $modalContinue = $('.js-cart-modal-continue');

  function openCartModal() {
    $modal.addClass('c-cart-modal--open');
    $modal.attr('aria-hidden', 'false');
    $modalContinue.trigger('focus');
  }

  function closeCartModal() {
    $modal.removeClass('c-cart-modal--open');
    $modal.attr('aria-hidden', 'true');
  }

  // カートに入れるボタン押下でモーダル表示
  $(document).on('click', '.js-detail-cart-btn-normal, .js-detail-cart-btn-rakutoku', function (e) {
    e.preventDefault();
    openCartModal();
  });

  // 「買い物を続ける」ボタンでモーダルを閉じる
  $modalContinue.on('click', function () {
    closeCartModal();
  });

  // オーバーレイクリックでモーダルを閉じる
  $modalOverlay.on('click', function () {
    closeCartModal();
  });

  // Escキーでモーダルを閉じる
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $modal.hasClass('c-cart-modal--open')) {
      closeCartModal();
    }
  });

  // ----------------------------------------
  // 注文ブロック タブ切替
  // ----------------------------------------
  $(document).on('click', '.js-detail-order-tab', function () {
    const $tab = $(this);
    const target = $tab.data('target');
    const $wrapper = $tab.closest('.c-detail-unit__order-wrapper');

    // タブ切替
    $wrapper.find('.js-detail-order-tab').removeClass('is-active').attr('aria-selected', 'false');
    $tab.addClass('is-active').attr('aria-selected', 'true');

    // パネル切替
    $wrapper.find('.js-detail-order-panel').removeClass('is-active');
    $wrapper.find('.js-detail-order-panel[data-panel="' + target + '"]').addClass('is-active');
  });

  // ----------------------------------------
  // お気に入りボタン トグル
  // ----------------------------------------
  $(document).on('click', '.js-favorite-btn', function (e) {
    e.preventDefault();
    $(this).toggleClass('c-detail-unit__favorite-btn--registered');
  });

});
