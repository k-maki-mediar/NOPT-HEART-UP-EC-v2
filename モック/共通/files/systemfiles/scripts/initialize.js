// キャッシュ無効
window.onunload = function() {
};

$(function() {

    var ua = (function() {
        return {
            ltIE7 : typeof window.addEventListener == "undefined" && typeof document.querySelectorAll == "undefined",
            ltIE8 : typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined"
        }
    })();

    if ((window.navigator.appName == "Microsoft Internet Explorer") && !document.documentMode) {
        $('body').prepend('<div class="error">ご利用いただいているブラウザには対応していないため、動作しない恐れがございます。</div>');
    }
    // if (cookieEnabled() == false && !document.URL.match("/error/no_support")) {
    //     location.href = settings.context + settings.servletMapping + "/error/no_support/";
    // }
});

var images = {
    noPhotoCampaign : settings.context + "/files/commonfiles/images/NoPhoto_campaign.jpg",
    noPhotoBrand : settings.context + "/files/commonfiles/images/NoPhoto_brand.jpg",
    noPhotoCommodity : settings.context + "/files/commonfiles/images/NoPhoto_commodity.jpg",
    noPhotoGift : settings.context + "/files/commonfiles/images/NoPhoto_gift.jpg",
    smallLoading : settings.context + "/files/commonfiles/images/ws_loading_small.gif",
    noPhotoTag : settings.context + "/files/commonfiles/images/NoPhoto_tag.jpg",
    noPhotoFeature : settings.context + "/files/commonfiles/images/NoPhoto_feature.jpg"
};

var userAgent = window.navigator.userAgent.toLowerCase();
var appVersion = window.navigator.appVersion.toLowerCase();
if (($.support.opacity) && (window.navigator.appName == "Microsoft Internet Explorer")) {
    document.write('<meta http-equiv="X-UA-Compatible" content="edge" />');
}

/**
 * message
 */
var Message = function() {
    this.required = "必須";
    this.next = "次の";
    this.confirmCancelOrder = "注文をキャンセルしてもよろしいですか？";
    this.confirmDelete = "削除しますか？";
    this.noFoundPostal = "該当する住所は見つかりませんでした。";
    this.postalSearchCaution = "(再検索するには、番号を入力しなおしてください。)";
    this.noCartItem = "現在、お客様のカートに品物は入っておりません。";
    this.topicPathDelimiter = "＞";
    this.topPage = "トップページ";
    this.allPageCount = "全{0}件中";
    this.pageCountFromTo = "{1}件から{2}件までを表示";
    this.requiredMessage = "{0}は必ず入力してください";
    this.invalidDigit = "{0}は数値で入力してください";
    this.invalidEmail = "{0}は有効なメールアドレスを入力してください";
    this.invalidAlphaNum2 = "{0}は半角英数字または記号([-][_][.][+])を入力してください。";
    this.invalidAlphaNumSymbol = "{0}は半角英数字記号または半角スペースを入力してください。";
    this.invalidCommodityCode = "{0}は半角英数字または記号([-][_][.][+])を入力してください。(記号を先頭・末尾に置くこと、連続して使用することはできません)";
}
var message = new Message();

/**
 * 画面遷移用
 */

/**
 * 画面遷移用
 */

// トップページ遷移
function moveTopPage() {
    // SourceCode_v12.18_add_start
    // location.href = createWovnHref(settings.context + "/");
    // SourceCode_v12.18_add_end
    // Mockup_V12.18_add_start
    location.href = createWovnHref("../common/トップページ.html");
    // Mockup_V12.18_add_end

    
};

// 各画面遷移
function move(url) {
    // SourceCode_v12.18_add_start
	// location.href = createWovnHref(settings.context + settings.servletMapping + url);
	// SourceCode_v12.18_add_end
	
	// Mockup_V12.18_add_start
		location.href = createWovnHref(url);
	// Mockup_V12.18_add_end
}

/**
 * PC用ポップアップ表示 options - jQuery.lighboxの仕様に準拠
 */
var pcPopup = function(id, options) {
    var blockPopupId = "blockPopupDouble";
    blockDoubleClick(blockPopupId);

    var $element = $("#" + id);
    var wx, wy; // ウインドウの左上座標

    // ウインドウの座標を画面中央にする。
    wx = $(window).width() / 2;
    if (wx < 0)
        wx = 0;
    wy = $(window).height() / 2 - ($element.height() / 2);
    if (wy < 0) {
        wy = $(window).height() / 2;
    }

    var parent = $("#" + id).parent();

    /*override_jquery.lightbox_me.js*/
    var opts = $.extend({}, {
        onLoad : function() {
            $("#" + blockPopupId).remove();
        },
        closeSelector: ".closeLightBox",
        centered : false,
        modalCSS : {
            top : wy,
            left : wx
        },
        parent : parent,
        id : id
    }, options);

    if (options && typeof options.onLoad == "function") {
        opts.onLoad = function() {
            options.onLoad();
            $("#" + blockPopupId).remove();
        }
    }

    $element.lightbox_me(opts);

    var $header = $($element.find(".frameHeader"));
    $header.css({
        cursor : "move"
    });
    $header.unbind("mousedown");
    $header.mousedown({
        mainid : id
    }, function(e) {
        var mx = e.pageX;
        var my = e.pageY;
        var mainid = e.data.mainid;
        $(document).on('mousemove.' + mainid, function(e) {
            wx += e.pageX - mx;
            wy += e.pageY - my;
            $('#' + mainid).css({
                top : wy,
                left : wx
            });
            mx = e.pageX;
            my = e.pageY;
            return false;
        }).one('mouseup', function(e) {
            $(document).off('mousemove.' + mainid);
        });
        return false;
    });
};

// クライアントスタイル
var clientStyle;
var clientStyleFunctionList = new Array();

/**
 * cookieチェック
 */
var cookieEnabled = function() {
    if (!navigator.cookieEnabled) {
        return false;
    }

    // IE 11 は navigator.cookieEnabled が常に true を返すので、仮 Cookie を設定して判定する
    var TEMP_COOKIE = 'tmp_check=1';

    // 仮 Cookie 設定
    var nowCookie = document.cookie;
    document.cookie = TEMP_COOKIE;
    if (nowCookie === document.cookie) {
        return false;
    }

    // 仮 Cookie 削除（有効期限に過去日を指定）
    document.cookie = TEMP_COOKIE + ';expires=' + (new Date(0)).toUTCString();
    return true;
};
