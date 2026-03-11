
// ソーシャルログインボタンの並び順の優先順位(左から順に優先。存在しないものは無視します。）
var sortedPriorityArray = ["facebook","twitter","yahoo","line","rakuten","mixi"];

// ソーシャルログインボタンの表示名を指定
var socialLoginButtons = {
    "facebook": "Facebook",
    "twitter": "Twitter",
    "yahoo": "Yahoo!",
    "line": "LINE",
    "rakuten": "楽天",
    "mixi": "mixi"
};

$(document).ready(function() {

    renameSocialProviders();
    sortSocialProviders();

});

var socialLoginAuthorize = function(socialLoginInfo,provider, type) {

    blockDoubleClick("socialLoginBlockDbClick");

    // Source_code_v12.18_add_start
    // socialLoginInfo = $.parseJSON(socialLoginInfo);

    // var uri = socialLoginInfo.uri + '/' + socialLoginInfo.loginId + '/' + socialLoginInfo.siteId + '/' + provider;
    // var api = 'authenticate';
    // var callback = getCallbackUrl(provider);

    // var authorizeUrl = uri + '/' + api + '?callback=' + callback + '&extended_profile=true';
    // Source_code_v12.18_add_end

    // Mockup_v12.18_add_start
    var authorizeUrl = "";
    if (provider === "facebook") {
        authorizeUrl = `../social/facebook.html?type=${type}`;
    } else if(provider === "twitter") {
        authorizeUrl = `../social/twitter.html?type=${type}`;
    } else if(provider === "yahoo") {
        authorizeUrl = "https://auth.login.yahoo.co.jp/yconnect/v2/authorization?bail=1&client_id=dj0zaiZpPVVNc3ZNYXZFd1pERiZzPWNvbnN1bWVyc2VjcmV0Jng9MDE-&display=page&nonce=_n6ZLrfTZ_qm_vAmIpRDXj6vgPotCND7hntJIZJiOHjT&redirect_uri=https%3A%2F%2Fapi.socialplus.jp%2Fwebshop-dev%2Fws1211itone%2Fyahoo%2Fauthenticate%2Fcallback&response_type=code&scope=openid%20email%20profile&state=JffwzEd-MQ8INo6EgzaLRUPRTn9yuseyYL4w8K8jNJh3";
    }
    location.href = authorizeUrl;
    // Mockup_v12.18_add_end

}

var socialLoginDeAuthorize = function(provider,element) {

    blockDoubleClick("socialLoginBlockDbClick");

    var parameters = createBaseParametersForAjaxApi("mypage", "social_account", "deauth");
    var functions = createAjaxFunctions(null, socialLoginBasicCallBack, null);
    parameters.provider = provider;
    parameters.loginAfterUrl = "/mypage/social_account/";
    parameters.loginAfterActionInfo = "/mypage/social_account/deauth/";
    parameters.additionalActionParameterKey = "provider";

    var param = {
        parameters : parameters,
        functions : functions,
        uri : "/mypage/social_account/deauth/",
        dataType : "json",
        formId : "socialAccountDeauthForm",
        async : true,
        element : element
    }

    sendAjaxToApi(param);
}

var socialLoginBasicCallBack = function() {

    $("#socialLoginBlockDbClick").remove();
}

var loginInitSocialLoginAuth = function() {

    var status = getParameter('status');

    if ( status ) {

        AuthSocialLogin();
    }
}

var customerEditSocialLoginAuth = function() {

    var status = getParameter('status');

    if ( status ) {

        if ( status == 'authorized' ) {

            var provider = getParameter('provider');

            if( provider ) {

                var cls  = '.btn-login-' + provider;
                $(cls).click();
                return;

            } else {

                // フォームアシスト対応。
                var target = $("input[name='token'][type='hidden']");
                var token = target.val();
                if( token ) {
                    AuthCustomerEditSocialLogin(token);
                    return;
                }

            }

        }

        AuthCustomerEditSocialLogin();
    }


}

var AuthSocialLogin = function() {

    var parameters = createBaseParametersForAjaxApi("common", "login", "auth");
    parameters.status = getParameter('status')
    parameters.token = getParameter('token');
    parameters.reason = getParameter('reason');
    parameters.provider = getParameter('provider');

    var param = {
        parameters : parameters,
        functions : createAjaxFunctions(null, null, null),
        uri : "/common/login/auth/",
        formId : 'loginForm',
        dataType : "json",
        async : true,
        element : null
    }

    sendAjaxToApi(param);
}

var AuthCustomerEditSocialLogin = function(token) {

    var parameters = createBaseParametersForAjaxApi("customer", "customer_edit", "auth");
    parameters.status = getParameter('status');
    parameters.token = getParameter('token');
    if(token) {
        parameters.token = token;
    }
    parameters.reason = getParameter('reason');

    var param = {
        parameters : parameters,
        functions : null,
        uri : "/customer/customer_edit/auth/",
        dataType : "json",
        formId : "customerInfoForm",
        async : true,
        element : null
    }

    sendAjaxToApi(param);

}

var getParameter = function(key) {

    var params = location.href.split("?")[1];
    if( params ) {
        var querys = params.split("&");
        var result = querys.filter( function (elt,index,arr) {
           var query = elt.split("=");
           return key == query[0];
        });

        if(result.length) {

            return result[0].split("=")[1];
        }

    }

    return '';
}

var getCallbackUrl = function(provider) {

    // callback対象画面をコントロールしたい場合、下記のmapへ関連付け
    // key[認証ボタン画面PATH]　:　value[callback遷移先画面PATH]
    var map = {
       '/mypage/social_account/deauth/' : '/mypage/social_account/',
    }

    var url = location.href;

    for ( var key in map ) {
       if( url.indexOf(key) > 0 ) {
           url = url.replace(key,map[key]);
       }
    };

    // 前回の認証プロバイダ情報を削除
    var parameter = getParameter('provider');
    url = url.replace('?provider=' + parameter, '');

    // ログイン画面の場合は、認証対象のプロバイダを同期
    if(url.indexOf('/common/login/') >= 0) {
        url = url.replace('/common/login/','/common/login/?provider=' + provider);
    }

    return url;

}

var renameSocialProviders = function() {

    var providers = $('.btn-login-social');
    $(providers).each(function() {
       $(this).text(socialLoginButtons[$(this).attr('name')] + $(this).text());
    });
};

var sortSocialProviders = function() {
    var providers = $('.socialAccountSortArea');

    if( providers ) {

        var parent = providers.parent();

        var sortProviders = providers.sort( function(p1,p2) {
            var p1Index = sortedPriorityArray.indexOf($(p1).attr('name'));
            var p2Index = sortedPriorityArray.indexOf($(p2).attr('name'));
            return p1Index - p2Index;
        });

        providers.remove();
        parent.append(sortProviders);
        $('.socialAccountSortArea').removeClass("hidden");
    }
}