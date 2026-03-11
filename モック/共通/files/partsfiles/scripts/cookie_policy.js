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

$(document).ready(function() {

    // クッキー「TARGETING-COOKIE」が存在すれば、クッキー管理ポップアップにターゲティングクッキーが「有効」に設定する
    if (hasCookie(tagetingcName)) {
        $("#acceptTargetCookie").prop("checked", true);
    }

    popUpAcceptCookie();

});

/**
 * クッキー同意の設定
 */
function popUpAcceptCookie() {

    // 「クッキー設定」のポップアップにクッキーの生成を管理する
    $(".confirmButton").click(function() {

        // ターゲティングクッキー「TARGETING-COOKIE」を「無効」に設定する場合、必須クッキー「COOKIE-CONSENT」のみを設定する
        if ($("#notAcceptTargetCookie").is(":checked")) {
            closeCookiePopup();
            setCookie(necessarycName, necessarycValue, necessarycExpireDays, necessarycPath);
            if (hasCookie(tagetingcName)) {
                setCookie(tagetingcName, tagetingcValue, tagetingcExpireDays * -1, tagetingcPath);
            }
        }

        // ターゲティングクッキー「TARGETING-COOKIE」を「有効」に設定する場合、必須クッキー「COOKIE-CONSENT」とターゲティングクッキー「TARGETING-COOKIE」を設定する
        if ($("#acceptTargetCookie").is(":checked")) {
            closeCookiePopup();
            setCookie(necessarycName, necessarycValue, necessarycExpireDays, necessarycPath);
            setCookie(tagetingcName, tagetingcValue, tagetingcExpireDays, tagetingcPath);
        }

        closeCookieBanner();
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
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
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
