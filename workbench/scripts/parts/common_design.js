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
 * 商品一覧ページャー（listMain pager）
 * ======================================== */
$(function () {
  var $listMain = $('#listMain');
  if ($listMain.length === 0) return;

  var $items = $listMain.find('.c-list-main__grid-item');
  var $perPageSelect = $listMain.find('#displayCount');
  var $countTotal = $listMain.find('.c-list-main__count-total');
  var $countRange = $listMain.find('.c-list-main__count-range');
  var totalItems = $items.length;
  var currentPage = 1;

  function getPerPage() {
    return parseInt($perPageSelect.val(), 10) || 8;
  }

  function getTotalPages() {
    return Math.ceil(totalItems / getPerPage());
  }

  // 省略付きページ番号配列を生成（参考: nopt-heart-up-ec準拠）
  // lineSize=3: 現在ページを中心に前後1ページの計3ページを表示
  // 先頭(1)・末尾(max)は常に表示、隙間があれば「…」
  var lineSize = 3;

  function getPageNumbers(current, total) {
    // lineSize以下なら全ページ表示
    if (total <= lineSize) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }

    var pages = [];
    // 中央表示範囲の開始ページを算出（currentを中心に）
    var startPage = current - Math.floor(lineSize / 2);
    if (startPage < 1) startPage = 1;
    var lastPage = startPage + lineSize - 1;
    // 末尾を超えないよう調整
    if (lastPage > total) {
      lastPage = total;
      startPage = total - lineSize + 1;
      if (startPage < 1) startPage = 1;
    }

    // 先頭ページ（中央範囲に含まれなければ表示）
    if (startPage > 1) {
      pages.push(1);
      // 隙間があれば省略記号（隣接なら不要）
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // 中央範囲のページ番号
    for (var j = startPage; j <= lastPage; j++) {
      pages.push(j);
    }

    // 末尾ページ（中央範囲に含まれなければ表示）
    if (lastPage < total) {
      // 隙間があれば省略記号（隣接なら不要）
      if (lastPage + 1 < total) {
        pages.push('...');
      }
      pages.push(total);
    }

    return pages;
  }

  function renderPager() {
    var totalPages = getTotalPages();
    var perPage = getPerPage();

    // 件数表示更新
    $countTotal.text(totalItems);
    var start = (currentPage - 1) * perPage + 1;
    var end = Math.min(currentPage * perPage, totalItems);
    $countRange.text(start + '件〜' + end + '件');

    // ページャーHTML生成
    var html = '';

    // 前へボタン（1ページ目でなければ表示）
    if (currentPage > 1) {
      html += '<li class="c-pager__item c-pager__item--prev">';
      html += '<a href="#" class="c-pager__link c-pager__link--prev" data-page="' + (currentPage - 1) + '" aria-label="前へ"></a>';
      html += '</li>';
    }

    // ページ番号（省略付き）
    var pageNumbers = getPageNumbers(currentPage, totalPages);
    for (var k = 0; k < pageNumbers.length; k++) {
      var p = pageNumbers[k];
      if (p === '...') {
        html += '<li class="c-pager__item c-pager__item--ellipsis">';
        html += '<span class="c-pager__ellipsis">…</span>';
        html += '</li>';
      } else if (p === currentPage) {
        html += '<li class="c-pager__item c-pager__item--current">';
        html += '<span class="c-pager__current" aria-current="page">' + p + '</span>';
        html += '</li>';
      } else {
        html += '<li class="c-pager__item">';
        html += '<a href="#" class="c-pager__link" data-page="' + p + '">' + p + '</a>';
        html += '</li>';
      }
    }

    // 次へボタン（最終ページでなければ表示）
    if (currentPage < totalPages) {
      html += '<li class="c-pager__item c-pager__item--next">';
      html += '<a href="#" class="c-pager__link c-pager__link--next" data-page="' + (currentPage + 1) + '" aria-label="次へ"></a>';
      html += '</li>';
    }

    // 上下ページャー両方更新
    $listMain.find('.c-pager__list').html(html);
  }

  function showPage(page) {
    var perPage = getPerPage();
    currentPage = page;
    var start = (page - 1) * perPage;
    var end = start + perPage;

    $items.each(function (i) {
      $(this).toggle(i >= start && i < end);
    });

    renderPager();
  }

  // ページリンククリック
  $listMain.on('click', '.c-pager__link[data-page]', function (e) {
    e.preventDefault();
    var page = parseInt($(this).data('page'), 10);
    showPage(page);
  });

  // 表示件数変更
  $perPageSelect.on('change', function () {
    showPage(1);
  });

  // 初期表示
  showPage(1);
});

