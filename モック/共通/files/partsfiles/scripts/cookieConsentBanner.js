/**
 * 必須クッキー
 */
var necessarycName = "COOKIE-CONSENT";
var necessarycValue = "SI Web Shopping";
var necessarycExpireDays = "365";
var necessarycPath = "/";

/**
 * ターゲティングクッキー
 */
var tagetingcName = "TARGETING-COOKIE";
var tagetingcValue = "SI Web Shopping";
var tagetingcExpireDays = "365";
var tagetingcPath = "/";

var persistentCookies = ["CSRF-TOKEN", ...relatedExternalCookieNames];

$(document).ready(function() {
    // クッキー「COOKIE-CONSENT」が存在しなければ、クッキー同意バナーを表示する
    if (!hasCookie(necessarycName)) {
        $("#cookieConsentBanner").removeClass("hidden");
        $("#cookieConsentBannerSP").removeClass("hidden");
    }
    // クッキー「TARGETING-COOKIE」が存在すれば、クッキー管理ポップアップにターゲティングクッキーが「有効」に設定する
    if (hasCookie(tagetingcName)) {
        $("#acceptTargetCookie").prop("checked", true);
    }

    // SPの場合はクッキー同意バナーの位置調整を行う
    if ($("#floating-menu").is(":visible")) {
        $("#cookieConsentBannerSP").addClass("moveUp");
    }
    // SPでない場合はクッキー同意バナーの位置調整を一番下に設定する
    if (!$("#floating-menu").is(":visible")) {
        $("#cookieConsentBannerSP").removeClass("moveUp");
    }

    // ミニカートが表示する場合、クッキー同意バナーの位置調整を行う
    $(window).scroll(function() {
        if ($(".miniCartShopArea").length > 0) {
            if ($(this).scrollTop() > 150) {
                $("#cookieConsentBanner").addClass("moveUp");
                if (!$("#floating-menu").is(":visible")) {
                    $("#cookieConsentBannerSP").addClass("moveUp");
                }
            } else {
                $("#cookieConsentBanner").removeClass("moveUp");
                if (!$("#floating-menu").is(":visible")) {
                    $("#cookieConsentBannerSP").removeClass("moveUp");
                }
            }
        }
    });

    acceptCookie();

    deleteCookies();

});

/**
 * クッキー同意の設定
 */
function acceptCookie() {
    // クッキー同意バナーですべて拒否した場合、バナーが非表示し、必須クッキー「COOKIE-CONSENT」のみを設定する
    $(".btn-deny").click(function() {
        closeCookieBanner();
        setCookie(necessarycName, necessarycValue, necessarycExpireDays, necessarycPath);
    });

    // クッキー同意バナーですべて受け入れる場合、バナーが非表示し、必須クッキー「COOKIE-CONSENT」とターゲティングクッキー「TARGETING-COOKIE」を設定する
    $(".btn-accept").click(function() {
        closeCookieBanner();
        setCookie(necessarycName, necessarycValue, necessarycExpireDays, necessarycPath);
        setCookie(tagetingcName, tagetingcValue, tagetingcExpireDays, tagetingcPath);
    });

}

/**
 * クッキー同意バナー非表示設定
 */
function closeCookieBanner() {
    $("#cookieConsentBanner").addClass("hidden");
    $("#cookieConsentBannerSP").addClass("hidden");
}

/**
 * クッキー同意バナー非表示設定
 */
function closeCookiePopup() {
    $("#cookiePolicyPopUpArea").hide();
    $(".js_lb_overlay").remove();
}

/**
 * クッキー生成の設定
 */
function setCookie(cname, cvalue, exdays, path) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + path;
}

/**
 * クッキー名称からクッキー取得
 * 
 * クッキーがなければ空文字を返す
 */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookies = decodedCookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

/**
 * クッキー存在チェック
 */
function hasCookie(cname) {
    var user = getCookie(cname);
    if (user != "") {
        return true;
    } else {
        return false;
    }
}


/**
 * クッキー削除
 */
function deleteCookies() {
    if (!hasCookie(tagetingcName)) {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            if (!(necessarycName == name) && !(persistentCookies.includes(name))) {
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;domain=";
            }
        }
    }
}
