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
    const $menu = $('.js-header-menu');
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
 * キャンペーン＆トピックス カルーセル
 * ======================================== */
$(function () {
  const $carousel = $(".js-campaign-carousel");
  const $btn = $(".js-campaign-play-toggle");
  const $pauseIcon = $(".js-campaign-pause-icon");
  const $playIcon = $(".js-campaign-play-icon");
  let isPlaying = true;

  $carousel.slick({
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    arrows: false,
    dots: true,
    appendDots: $(".js-campaign-dots"),
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 99999,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

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
  $('.c-detail-unit__select, .c-detail-unit__prescription-select, .c-list-main__select').each(function () {
    const $select = $(this);
    if ($select.is(':disabled')) { return; }
    const $wrap = $select.closest('.c-detail-unit__select-wrap').length
      ? $select.closest('.c-detail-unit__select-wrap')
      : $select.closest('.c-list-main__select-wrap').length
        ? $select.closest('.c-list-main__select-wrap')
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
      closeAllDropdowns();

      if (!isOpen) {
        $custom.addClass('c-detail-unit__custom-select--open');
        $trigger.attr('aria-expanded', 'true');

        // 注文パネル内: 初回のみパネルをbody直下に移動
        if ($custom.closest('.c-detail-unit__order-panels').length && !$panel.data('moved-to-body')) {
          $panel.appendTo('body');
          $panel.data('moved-to-body', true);
        }

        // body直下に移動したパネル: display + fixed位置を直接制御
        if ($panel.data('moved-to-body')) {
          const rect = $trigger[0].getBoundingClientRect();
          $panel.css({
            display: 'block',
            position: 'fixed',
            top: rect.bottom + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            'z-index': 1000
          });
        } else if ($select.hasClass('c-detail-unit__prescription-select')) {
          // 処方箋テーブル内: fixed位置のみ（DOMはそのまま）
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
      if ($panel.data('moved-to-body')) { $panel.hide(); }
    });
  });

  // body直下パネルも含めて全ドロップダウンを閉じるヘルパー
  function closeAllDropdowns() {
    $('.c-detail-unit__custom-select--open').each(function () {
      $(this).removeClass('c-detail-unit__custom-select--open')
        .find('.c-detail-unit__custom-select-trigger').attr('aria-expanded', 'false');
    });
    // body直下に移動されたパネルも非表示
    $('.c-detail-unit__custom-select-panel').filter(function () {
      return $(this).data('moved-to-body');
    }).hide();
  }

  // 外側クリックで閉じる
  $(document).on('click', function () {
    closeAllDropdowns();
  });

  // Escキーで閉じる
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });

  // スクロール時: fixedパネルの位置を追従更新
  $(window).on('scroll', function () {
    $('.c-detail-unit__custom-select--open').each(function () {
      const $open = $(this);
      const $trig = $open.find('.c-detail-unit__custom-select-trigger');
      const $pnl = $open.find('.c-detail-unit__custom-select-panel');
      if ($pnl.css('position') === 'fixed') {
        const rect = $trig[0].getBoundingClientRect();
        $pnl.css({
          top: rect.bottom + 'px',
          left: rect.left + 'px',
          width: rect.width + 'px'
        });
      }
    });
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

  // スワイプ対応（タッチ操作で画像切替）
  let currentSlide = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 40;

  $slider.on('touchstart', function (e) {
    touchStartX = e.originalEvent.touches[0].clientX;
  });

  $slider.on('touchend', function (e) {
    touchEndX = e.originalEvent.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < SWIPE_THRESHOLD) { return; }
    const total = $slides.length;
    if (diff > 0 && currentSlide < total - 1) {
      currentSlide++;
    } else if (diff < 0 && currentSlide > 0) {
      currentSlide--;
    }
    showSlide(currentSlide);
  });

  // ドット・サムネイルクリック時もcurrentSlideを同期
  $dots.on('click', function () {
    currentSlide = parseInt($(this).data('index'), 10);
  });
  $thumbBtns.on('click', function () {
    currentSlide = parseInt($(this).data('index'), 10);
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
      $totalDisplay.find('.js-detail-quantity-total-num').text(total);
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

  // Escキーでモーダルを閉じる（カスタムセレクトのEsc制御と共存）
  $(document).on('keydown.cartModal', function (e) {
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
    const $wrapper = $tab.closest('.js-order-wrap');

    // タブ切替
    $wrapper.find('.js-detail-order-tab').removeClass('is-active').attr('aria-selected', 'false');
    $tab.addClass('is-active').attr('aria-selected', 'true');

    // パネル切替
    $wrapper.find('.js-detail-order-panel').removeClass('is-active');
    $wrapper.find('.js-detail-order-panel[data-panel="' + target + '"]').addClass('is-active');

    // SVG外枠を再描画
    requestAnimationFrame(function () {
      drawOrderOutline($wrapper[0]);
    });
  });

  // らくとくタブがある場合、初期表示をらくとくにする
  $('.js-order-wrap').each(function () {
    const $wrapper = $(this);
    const $rakutokuTab = $wrapper.find('.js-detail-order-tab[data-target="rakutoku"]');
    if ($rakutokuTab.length) {
      $wrapper.find('.js-detail-order-tab').removeClass('is-active').attr('aria-selected', 'false');
      $rakutokuTab.addClass('is-active').attr('aria-selected', 'true');
      $wrapper.find('.js-detail-order-panel').removeClass('is-active');
      $wrapper.find('.js-detail-order-panel[data-panel="rakutoku"]').addClass('is-active');
    }
  });

  // ----------------------------------------
  // 注文ブロック SVG外枠描画
  // ----------------------------------------
  function drawOrderOutline(wrapper) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = wrapper.querySelector('.c-detail-unit__order-outline');
    const activeTab = wrapper.querySelector('.c-detail-unit__order-tab.is-active');
    const panels = wrapper.querySelector('.c-detail-unit__order-panels');

    if (!svg || !activeTab || !panels) return;

    const wrapRect = wrapper.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const panelRect = panels.getBoundingClientRect();

    const stroke = 2;
    const radius = 8;

    const left = tabRect.left - wrapRect.left;
    const right = tabRect.right - wrapRect.left;
    const tabTop = tabRect.top - wrapRect.top;
    const panelTop = panelRect.top - wrapRect.top;
    const panelLeft = panelRect.left - wrapRect.left;
    const panelRight = panelRect.right - wrapRect.left;
    const panelBottom = panelRect.bottom - wrapRect.top;

    svg.setAttribute('viewBox', '0 0 ' + wrapRect.width + ' ' + wrapRect.height);

    const d = [
      'M ' + panelLeft + ' ' + panelBottom,
      'L ' + panelLeft + ' ' + panelTop,
      'L ' + left + ' ' + panelTop,
      'L ' + left + ' ' + (tabTop + radius),
      'Q ' + left + ' ' + tabTop + ' ' + (left + radius) + ' ' + tabTop,
      'L ' + (right - radius) + ' ' + tabTop,
      'Q ' + right + ' ' + tabTop + ' ' + right + ' ' + (tabTop + radius),
      'L ' + right + ' ' + panelTop,
      'L ' + panelRight + ' ' + panelTop,
      'L ' + panelRight + ' ' + panelBottom,
      'Z'
    ].join(' ');

    // 既存のpathを削除して再作成（SVG名前空間を使う）
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#00387d');
    path.setAttribute('stroke-width', stroke);
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(path);
  }

  // 初期描画 + リサイズ対応
  const orderWrappers = document.querySelectorAll('.js-order-wrap');
  orderWrappers.forEach(function (w) {
    drawOrderOutline(w);
  });
  $(window).on('resize', function () {
    orderWrappers.forEach(function (w) {
      drawOrderOutline(w);
    });
  });

  // フォントサイズ変更時にも再描画
  const fontSizeObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'data-font-size') {
        setTimeout(function () {
          orderWrappers.forEach(function (w) {
            drawOrderOutline(w);
          });
        }, 50);
      }
    });
  });
  fontSizeObserver.observe(document.documentElement, { attributes: true });

  // ----------------------------------------
  // お気に入りボタン トグル
  // ----------------------------------------
  $(document).on('click', '.js-favorite-btn', function (e) {
    e.preventDefault();
    $(this).toggleClass('c-detail-unit__favorite-btn--registered');
  });

});

/* ========================================
 * SPフィルターパネル（filterPanel）
 * ======================================== */
(function () {
  'use strict';

  const toggle = document.querySelector('.js-filter-toggle');
  if (!toggle) return;

  const bodyId = toggle.getAttribute('aria-controls');
  const body = bodyId ? document.getElementById(bodyId) : null;
  if (!body) return;

  toggle.addEventListener('click', function () {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));

    if (isExpanded) {
      body.classList.remove('c-filter-panel__body--open');
    } else {
      body.classList.add('c-filter-panel__body--open');
    }
  });
})();

/* ========================================
 * ページトップへ戻るボタン（pageFooter）
 * ======================================== */
(function () {
  'use strict';

  const btn = document.querySelector('.c-page-footer__page-top-link');
  if (!btn) return;

  const SCROLL_THRESHOLD = 200;
  const SCROLL_DELTA_THRESHOLD = 5;

  let lastScrollY = window.scrollY;
  let scrollDirection = null;
  let ticking = false;

  function detectScrollDirection(currentScrollY) {
    const delta = Math.abs(currentScrollY - lastScrollY);

    if (delta < SCROLL_DELTA_THRESHOLD) {
      return scrollDirection;
    }

    if (currentScrollY > lastScrollY) {
      scrollDirection = 'down';
    } else if (currentScrollY < lastScrollY) {
      scrollDirection = 'up';
    }

    lastScrollY = currentScrollY;
    return scrollDirection;
  }

  function updateVisibility() {
    const currentScrollY = window.scrollY;

    if (currentScrollY < SCROLL_THRESHOLD) {
      btn.classList.remove('is-visible');
      ticking = false;
      return;
    }

    const direction = detectScrollDirection(currentScrollY);

    if (direction === 'down') {
      btn.classList.add('is-visible');
    } else if (direction === 'up') {
      btn.classList.remove('is-visible');
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  updateVisibility();
})();

/* ========================================
 * ページネーション（pager）
 * ======================================== */
$(function () {
  'use strict';

  const TOTAL_SLOTS = 7;
  const pagers = document.querySelectorAll('.js-pager');
  if (!pagers.length) return;

  function getPageSlots(current, total) {
    const slots = [];

    if (total <= TOTAL_SLOTS) {
      for (let i = 1; i <= total; i++) {
        slots.push(i);
      }
      return slots;
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }

    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, '...', current - 1, current, current + 1, '...', total];
  }

  function createItem(className, inner) {
    const li = document.createElement('li');
    li.className = 'c-pager__item' + (className ? ' ' + className : '');
    li.appendChild(inner);
    return li;
  }

  function renderPager(pager, current, total) {
    const list = pager.querySelector('.c-pager__list');
    if (!list) return;

    list.innerHTML = '';
    const slots = getPageSlots(current, total);

    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.className = 'c-pager__link c-pager__link--prev';
    prevLink.setAttribute('aria-label', '前へ');
    const prevItem = createItem('c-pager__item--prev', prevLink);
    if (current <= 1) prevItem.classList.add('is-hidden');
    list.appendChild(prevItem);

    for (let i = 0; i < slots.length; i++) {
      if (slots[i] === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'c-pager__ellipsis';
        ellipsis.textContent = '\u2026';
        list.appendChild(createItem('', ellipsis));
      } else if (slots[i] === current) {
        const span = document.createElement('span');
        span.className = 'c-pager__current';
        span.setAttribute('aria-current', 'page');
        span.textContent = slots[i];
        list.appendChild(createItem('c-pager__item--current', span));
      } else {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'c-pager__link';
        a.textContent = slots[i];
        list.appendChild(createItem('', a));
      }
    }

    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.className = 'c-pager__link c-pager__link--next';
    nextLink.setAttribute('aria-label', '次へ');
    const nextItem = createItem('c-pager__item--next', nextLink);
    if (current >= total) nextItem.classList.add('is-hidden');
    list.appendChild(nextItem);
  }

  function updateAll(newPage) {
    for (let i = 0; i < pagers.length; i++) {
      const total = parseInt(pagers[i].getAttribute('data-total-pages'), 10) || 1;
      if (newPage < 1) newPage = 1;
      if (newPage > total) newPage = total;
      pagers[i].setAttribute('data-current-page', newPage);
      renderPager(pagers[i], newPage, total);
    }
  }

  for (let i = 0; i < pagers.length; i++) {
    const total = parseInt(pagers[i].getAttribute('data-total-pages'), 10) || 1;
    const current = parseInt(pagers[i].getAttribute('data-current-page'), 10) || 1;
    renderPager(pagers[i], current, total);
  }

  document.addEventListener('click', function (e) {
    const target = e.target.closest('.c-pager__link');
    if (!target) return;

    const pager = target.closest('.js-pager');
    if (!pager) return;

    e.preventDefault();

    const current = parseInt(pager.getAttribute('data-current-page'), 10) || 1;
    let newPage;

    if (target.classList.contains('c-pager__link--prev')) {
      newPage = current - 1;
    } else if (target.classList.contains('c-pager__link--next')) {
      newPage = current + 1;
    } else {
      newPage = parseInt(target.textContent, 10);
    }

    if (isNaN(newPage) || newPage === current) return;

    updateAll(newPage);
  });
});

/* ========================================
 * PC横スクロール マウスドラッグ対応
 * おすすめ商品・最近見た商品リスト
 * ======================================== */
$(function () {
  const DRAG_THRESHOLD = 5;

  $('.c-recommend__list, .c-browsing-history__list').each(function () {
    const el = this;
    let isDown = false;
    let hasDragged = false;
    let startX = 0;
    let scrollLeft = 0;

    $(el).on('mousedown', function (e) {
      if (e.button !== 0) return;
      isDown = true;
      hasDragged = false;
      startX = e.clientX;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    });

    // 画像のネイティブドラッグを防止（ドラッグスクロールと競合するため）
    $(el).on('dragstart', 'img, a', function (e) {
      e.preventDefault();
    });

    $(document).on('mousemove', function (e) {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > DRAG_THRESHOLD) {
        hasDragged = true;
      }
      el.scrollLeft = scrollLeft - dx;
    });

    $(document).on('mouseup', function () {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = '';
      el.style.userSelect = '';
    });

    // ドラッグ後のクリックでリンク遷移しないようにする
    $(el).on('click', 'a', function (e) {
      if (hasDragged) {
        e.preventDefault();
      }
    });

    // カード全体クリックで商品ページへ遷移（ドラッグ時は除外）
    $(el).on('click', '.c-product-card', function (e) {
      if (hasDragged) return;
      // リンク自体のクリックはそのまま通す
      if ($(e.target).closest('a').length) return;
      const href = $(this).find('.c-product-card__name-link').attr('href');
      if (href) {
        window.location.href = href;
      }
    });
  });
});

/* ========================================
 * 定期契約確認変更：タブ切替
 * ======================================== */
$(function () {
  const $tabs = $('.js-teiki-tab');
  if (!$tabs.length) return;

  $tabs.on('click', function () {
    const $clickedTab = $(this);
    const $tabList = $clickedTab.closest('[role="tablist"]');
    const panelId = $clickedTab.attr('aria-controls');
    const $panel = $('#' + panelId);

    // 同じタブリスト内のタブをすべてリセット
    $tabList.find('.js-teiki-tab').each(function () {
      $(this).removeClass('is-active')
        .attr('aria-selected', 'false')
        .attr('tabindex', '-1');
    });

    // クリックされたタブをアクティブに
    $clickedTab.addClass('is-active')
      .attr('aria-selected', 'true')
      .removeAttr('tabindex');

    // パネルの切替
    const $allPanels = $tabList.closest('.p-teiki-detail').find('.p-teiki-detail__tab-panel');
    $allPanels.each(function () {
      $(this).attr('hidden', '');
    });
    $panel.removeAttr('hidden');
  });
});

/* ========================================
 * 定期契約確認変更：お届けスケジュールカルーセル
 * ======================================== */
$(function () {
  const PC_MIN = 992;

  function initCarousel() {
    $('.js-teiki-carousel').each(function () {
      const $carousel = $(this);
      const $scroll = $carousel.find('.js-teiki-carousel-scroll');
      const $cards = $scroll.children('.c-teiki-schedule__card');
      const $dots = $carousel.find('.js-teiki-carousel-dot');
      const $prevBtn = $carousel.find('.js-teiki-carousel-prev');
      const $nextBtn = $carousel.find('.js-teiki-carousel-next');
      let currentIndex = 1;

      function isPC() { return window.innerWidth >= PC_MIN; }

      function updateNav() {
        if (isPC()) { $prevBtn.hide(); $nextBtn.hide(); return; }
        $prevBtn.toggle(currentIndex > 0);
        $nextBtn.toggle(currentIndex < $cards.length - 1);
      }

      function goTo(index) {
        if (isPC()) return;
        if (index < 0 || index >= $cards.length) return;
        currentIndex = index;
        const card = $cards.eq(index)[0];
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        $dots.removeClass('is-active');
        $dots.eq(index).addClass('is-active');
        updateNav();
      }

      setTimeout(function () { goTo(1); }, 100);

      $prevBtn.on('click', function () { goTo(currentIndex - 1); });
      $nextBtn.on('click', function () { goTo(currentIndex + 1); });
      $dots.on('click', function () { goTo(parseInt($(this).data('index'), 10)); });

      let scrollTimer = null;
      $scroll.on('scroll', function () {
        if (isPC()) return;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
          const scrollCenter = $scroll.scrollLeft() + $scroll.width() / 2;
          let closest = 0;
          let minDist = Infinity;
          $cards.each(function (i) {
            const cardCenter = this.offsetLeft - $scroll[0].offsetLeft + this.offsetWidth / 2;
            const dist = Math.abs(scrollCenter - cardCenter);
            if (dist < minDist) { minDist = dist; closest = i; }
          });
          if (closest !== currentIndex) {
            currentIndex = closest;
            $dots.removeClass('is-active');
            $dots.eq(currentIndex).addClass('is-active');
            updateNav();
          }
        }, 80);
      });
    });
  }

  initCarousel();
});

/* ========================================
 * 定期契約確認変更：申込商品アコーディオン開閉
 * ======================================== */
$(function () {
  $('.js-teiki-products-toggle').on('click', function () {
    const $btn = $(this);
    const $body = $btn.next('.js-teiki-products-body');
    const isOpen = $btn.attr('aria-expanded') === 'true';
    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('c-teiki-products__body--open');
  });
});

/* ========================================
 * 定期契約確認変更：金額ブロック開閉
 * ======================================== */
$(function () {
  $('.js-teiki-amount-toggle').on('click', function () {
    const $btn = $(this);
    const $body = $btn.next('.js-teiki-amount-body');
    const isOpen = $btn.attr('aria-expanded') === 'true';
    $btn.attr('aria-expanded', !isOpen);
    $body.slideToggle(200);
  });
});

/* ========================================
 * 定期契約確認変更：購入情報・金額アコーディオン開閉
 * ======================================== */
$(function () {
  $('.js-teiki-toggle').on('click', function () {
    const $btn = $(this);
    const $body = $btn.next('.js-teiki-toggle-body');
    const isOpen = $btn.attr('aria-expanded') === 'true';
    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('c-teiki-info-block__body--open');
    $body.toggleClass('c-teiki-amount-block__body--open');
  });
});

/* ========================================
 * 定期契約確認変更：お届け先選択モーダル
 * ======================================== */
(function () {
  'use strict';

  const modal = document.querySelector('.js-teiki-modal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('.js-teiki-modal-open');
  const closeBtns = document.querySelectorAll('.js-teiki-modal-close');
  const modalInner = modal.querySelector('.c-teiki-modal__inner');

  function openModal(e) {
    e.preventDefault();
    modal.removeAttribute('hidden');
    if (modalInner) {
      modalInner.focus();
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  for (let i = 0; i < openBtns.length; i++) {
    openBtns[i].addEventListener('click', openModal);
  }

  for (let j = 0; j < closeBtns.length; j++) {
    closeBtns[j].addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const radios = modal.querySelectorAll('.c-teiki-address-select__radio');
  for (let r = 0; r < radios.length; r++) {
    radios[r].addEventListener('change', function () {
      const cards = modal.querySelectorAll('.c-teiki-address-select__card');
      for (let c = 0; c < cards.length; c++) {
        cards[c].classList.remove('c-teiki-address-select__card--selected');
      }
      const card = this.closest('.c-teiki-address-select__card');
      if (card) {
        card.classList.add('c-teiki-address-select__card--selected');
      }
    });
  }
})();

/* ========================================
 * 定期契約確認変更：スキップ確認モーダル
 * ======================================== */
(function () {
  'use strict';

  const modal = document.querySelector('.js-skip-modal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('.js-skip-modal-open');
  const closeBtns = modal.querySelectorAll('.js-skip-modal-close');
  const modalInner = modal.querySelector('.c-teiki-modal__inner');
  const titleAccent = modal.querySelector('.c-teiki-modal__skip-title-accent');

  function openModal(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const category = btn.querySelector('.c-teiki-skip-figma__btn-category');
    if (category && titleAccent) {
      titleAccent.textContent = category.textContent + '定期便';
    }
    modal.removeAttribute('hidden');
    if (modalInner) {
      modalInner.focus();
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  for (let i = 0; i < openBtns.length; i++) {
    openBtns[i].addEventListener('click', openModal);
  }

  for (let j = 0; j < closeBtns.length; j++) {
    closeBtns[j].addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();

/* ========================================
 * 定期契約確認変更：休止理由モーダル
 * ======================================== */
(function () {
  'use strict';

  const modal = document.querySelector('.js-pause-modal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('.js-pause-modal-open');
  const closeBtns = modal.querySelectorAll('.js-pause-modal-close');
  const modalInner = modal.querySelector('.c-teiki-modal__inner');
  const surveyGroups = modal.querySelectorAll('.js-survey-group');

  function showGroups(category) {
    for (let g = 0; g < surveyGroups.length; g++) {
      if (!category) {
        surveyGroups[g].style.display = '';
      } else if (surveyGroups[g].getAttribute('data-survey-group') === category) {
        surveyGroups[g].style.display = '';
      } else {
        surveyGroups[g].style.display = 'none';
      }
    }
  }

  function openModal(e) {
    e.preventDefault();
    const category = e.currentTarget.getAttribute('data-survey-category');
    showGroups(category);
    modal.removeAttribute('hidden');
    if (modalInner) {
      modalInner.focus();
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  for (let i = 0; i < openBtns.length; i++) {
    openBtns[i].addEventListener('click', openModal);
  }

  for (let j = 0; j < closeBtns.length; j++) {
    closeBtns[j].addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const otherToggles = modal.querySelectorAll('.js-survey-other-toggle');
  for (let k = 0; k < otherToggles.length; k++) {
    otherToggles[k].addEventListener('change', function () {
      const textarea = this.closest('.c-teiki-survey__item').querySelector('.js-survey-other-textarea');
      if (!textarea) return;
      if (this.checked) {
        textarea.removeAttribute('hidden');
      } else {
        textarea.setAttribute('hidden', '');
        textarea.value = '';
      }
    });
  }
})();

/* ========================================
 * 定期契約確認変更：解約理由モーダル
 * ======================================== */
(function () {
  'use strict';

  const modal = document.querySelector('.js-cancel-modal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('.js-cancel-modal-open');
  const closeBtns = modal.querySelectorAll('.js-cancel-modal-close');
  const modalInner = modal.querySelector('.c-teiki-modal__inner');
  const surveyGroups = modal.querySelectorAll('.js-survey-group');

  function showGroups(category) {
    for (let g = 0; g < surveyGroups.length; g++) {
      if (!category) {
        surveyGroups[g].style.display = '';
      } else if (surveyGroups[g].getAttribute('data-survey-group') === category) {
        surveyGroups[g].style.display = '';
      } else {
        surveyGroups[g].style.display = 'none';
      }
    }
  }

  function openModal(e) {
    e.preventDefault();
    const category = e.currentTarget.getAttribute('data-survey-category');
    showGroups(category);
    modal.removeAttribute('hidden');
    if (modalInner) {
      modalInner.focus();
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  for (let i = 0; i < openBtns.length; i++) {
    openBtns[i].addEventListener('click', openModal);
  }

  for (let j = 0; j < closeBtns.length; j++) {
    closeBtns[j].addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const otherToggles = modal.querySelectorAll('.js-survey-other-toggle');
  for (let k = 0; k < otherToggles.length; k++) {
    otherToggles[k].addEventListener('change', function () {
      const textarea = this.closest('.c-teiki-survey__item').querySelector('.js-survey-other-textarea');
      if (!textarea) return;
      if (this.checked) {
        textarea.removeAttribute('hidden');
      } else {
        textarea.setAttribute('hidden', '');
        textarea.value = '';
      }
    });
  }
})();

/* ========================================
 * 定期契約確認変更：同梱対象選択モーダル
 * ======================================== */
(function () {
  'use strict';

  const modal = document.querySelector('.js-bundle-modal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('.js-bundle-modal-open');
  const closeBtns = modal.querySelectorAll('.js-bundle-modal-close');
  const modalInner = modal.querySelector('.c-teiki-modal__inner');

  function openModal(e) {
    e.preventDefault();
    modal.removeAttribute('hidden');
    if (modalInner) {
      modalInner.focus();
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  for (let i = 0; i < openBtns.length; i++) {
    openBtns[i].addEventListener('click', openModal);
  }

  for (let j = 0; j < closeBtns.length; j++) {
    closeBtns[j].addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();

/* ========================================
 * カート：数量ステッパー（通常購入・定期購入共通）
 * data-qty-min / data-qty-max でDGBT側から動的に上下限をセット可能
 * ======================================== */
$(function () {
  function formatPrice(num) {
    return num.toLocaleString() + '円';
  }

  function updateShippingMsg() {
    const $msg = $('.js-cart-shipping-msg');
    if (!$msg.length) return;
    const threshold = parseInt($msg.data('free-shipping-threshold'), 10) || 5500;
    let cartTotal = 0;
    $('.js-cart-item').each(function () {
      const unitPrice = parseInt($(this).data('unit-price'), 10) || 0;
      const qty = parseInt($(this).find('.js-cart-qty-value').val(), 10) || 1;
      cartTotal += unitPrice * qty;
    });
    $('.js-cart-total-amount').text(formatPrice(cartTotal));
    if (cartTotal >= threshold) {
      $('.js-cart-shipping-msg-short').prop('hidden', true);
      $('.js-cart-shipping-msg-free').prop('hidden', false);
    } else {
      $('.js-cart-shipping-msg-short').prop('hidden', false);
      $('.js-cart-shipping-msg-free').prop('hidden', true);
      $('.js-cart-remaining-amount').text(formatPrice(threshold - cartTotal));
    }
  }

  function updateSubtotal($stepper) {
    const $item = $stepper.closest('.js-cart-item');
    if (!$item.length) return;
    const unitPrice = parseInt($item.data('unit-price'), 10);
    if (isNaN(unitPrice)) return;
    const qty = parseInt($stepper.find('.js-cart-qty-value').val(), 10) || 1;
    $item.find('.js-cart-item-subtotal').text(formatPrice(unitPrice * qty));
  }

  function updateStepperState($stepper) {
    const $input = $stepper.find('.js-cart-qty-value');
    const $minus = $stepper.find('.js-cart-qty-minus');
    const $plus = $stepper.find('.js-cart-qty-plus');
    const current = parseInt($input.val(), 10) || 1;
    const min = parseInt($stepper.data('qty-min'), 10) || 1;
    const max = parseInt($stepper.data('qty-max'), 10) || 9999;

    $minus.prop('disabled', current <= min);
    $plus.prop('disabled', current >= max);
    updateSubtotal($stepper);
    updateShippingMsg();
  }

  // マイナスボタン
  $(document).on('click', '.js-cart-qty-minus', function () {
    const $stepper = $(this).closest('.js-cart-qty-stepper');
    const $input = $stepper.find('.js-cart-qty-value');
    const min = parseInt($stepper.data('qty-min'), 10) || 1;
    let current = parseInt($input.val(), 10) || 1;
    if (current > min) {
      $input.val(current - 1);
    }
    updateStepperState($stepper);
  });

  // プラスボタン
  $(document).on('click', '.js-cart-qty-plus', function () {
    const $stepper = $(this).closest('.js-cart-qty-stepper');
    const $input = $stepper.find('.js-cart-qty-value');
    const max = parseInt($stepper.data('qty-max'), 10) || 9999;
    let current = parseInt($input.val(), 10) || 1;
    if (current < max) {
      $input.val(current + 1);
    }
    updateStepperState($stepper);
  });

  // 手入力時のバリデーション
  $(document).on('change', '.js-cart-qty-value', function () {
    const $input = $(this);
    const $stepper = $input.closest('.js-cart-qty-stepper');
    const min = parseInt($stepper.data('qty-min'), 10) || 1;
    const max = parseInt($stepper.data('qty-max'), 10) || 9999;
    let val = parseInt($input.val(), 10);
    if (isNaN(val) || val < min) { val = min; }
    if (val > max) { val = max; }
    $input.val(val);
    updateStepperState($stepper);
  });

  // 初期状態更新
  $('.js-cart-qty-stepper').each(function () {
    updateStepperState($(this));
  });
});

/* ========================================
 * フォントサイズ切り替え（fontSizeSwitcher）
 * ======================================== */
(function() {
  'use strict';

  const STORAGE_KEY = 'user-font-size';
  const FONT_SIZES = ['normal', 'large', 'x-large'];
  const SWITCHER_GAP = 48;

  function applyFontSize(size) {
    if (size === 'normal' || FONT_SIZES.indexOf(size) === -1) {
      document.documentElement.removeAttribute('data-font-size');
    } else {
      document.documentElement.setAttribute('data-font-size', size);
    }
  }

  function saveFontSize(size) {
    try { localStorage.setItem(STORAGE_KEY, size); } catch (e) {}
  }

  function getSavedFontSize() {
    try { return localStorage.getItem(STORAGE_KEY) || 'normal'; } catch (e) { return 'normal'; }
  }

  function updateMenuActiveState(size) {
    const options = document.querySelectorAll('[data-font-size-option]');
    for (let i = 0; i < options.length; i++) {
      const optionSize = options[i].getAttribute('data-font-size-option');
      if (optionSize === size) {
        options[i].classList.add('is-active');
      } else {
        options[i].classList.remove('is-active');
      }
    }
  }

  function toggleDropdown(open) {
    const trigger = document.querySelector('[data-font-size-trigger]');
    const menu = document.querySelector('[data-font-size-menu]');
    if (!trigger || !menu) return;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { menu.classList.add('is-open'); } else { menu.classList.remove('is-open'); }
  }

  function isDropdownOpen() {
    const menu = document.querySelector('[data-font-size-menu]');
    return menu && menu.classList.contains('is-open');
  }

  function setupSwitcherOffset(header, wrapper) {
    if (!header || !wrapper) return;
    const updateOffset = function() {
      const userBar = document.querySelector('.c-user-bar');
      const headerH = header.getBoundingClientRect().height;
      const userBarH = userBar ? userBar.getBoundingClientRect().height : 0;
      const notice = document.querySelector('.c-important-notice');
      const offset = headerH + userBarH + SWITCHER_GAP;
      wrapper.style.setProperty('--font-size-switcher-offset', offset + 'px');
    };
    updateOffset();
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(updateOffset).observe(header);
    } else {
      window.addEventListener('resize', updateOffset);
    }
  }

  // FOUC防止: 即座に適用
  applyFontSize(getSavedFontSize());

  // DOM読み込み後
  function initFontSizeSwitcher() {
    const switcher = document.querySelector('[data-font-size-switcher]');
    const wrapper = document.querySelector('.c-font-size-switcher-wrapper');
    const header = document.querySelector('.c-header');
    const trigger = document.querySelector('[data-font-size-trigger]');
    const menu = document.querySelector('[data-font-size-menu]');
    const options = document.querySelectorAll('[data-font-size-option]');

    if (!switcher || !wrapper || !trigger || !menu || options.length === 0) return;

    setupSwitcherOffset(header, wrapper);
    updateMenuActiveState(getSavedFontSize());

    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(!isDropdownOpen());
    });

    for (let i = 0; i < options.length; i++) {
      options[i].addEventListener('click', function(e) {
        e.preventDefault();
        const size = this.getAttribute('data-font-size-option');
        applyFontSize(size);
        saveFontSize(size);
        updateMenuActiveState(size);
      });
    }

    document.addEventListener('click', function(e) {
      if (!switcher.contains(e.target)) { toggleDropdown(false); }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { toggleDropdown(false); trigger.focus(); }
    });

    menu.addEventListener('keydown', function(e) {
      const optionsArray = Array.prototype.slice.call(options);
      const currentIndex = optionsArray.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        optionsArray[(currentIndex + 1) % optionsArray.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        optionsArray[(currentIndex - 1 + optionsArray.length) % optionsArray.length].focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFontSizeSwitcher);
  } else {
    initFontSizeSwitcher();
  }
})();
