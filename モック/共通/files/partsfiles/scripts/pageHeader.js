$(document).ready(function() {
    // 新規会員登録画面の場合ログインボタン削除
    var url = location.pathname;
    if (url.endsWith("/login/")) {
        $(".header-login-button").remove();
    }
    // 顧客情報入力の場合は新規会員登録ボタン削除
    if (url.match(/customer_edit/g) || url.match(/customer_confirm/g)) {
        $(".customer-edit-button").remove();
    }

    // カテゴリを整形
    // 親カテゴリの場合
    $("#menuCategoryTree").find(".parent").each(function() {
        // role削除
        $(this).removeAttr("role");
        // クラス追加
        $(this).addClass("dropdown-submenu");
        // 子階層用のulタグ作成
        $ul = $("<ul>").addClass("dropdown-menu");
        // 親カテゴリのカテゴリコード取得
        var categoryCode = $(this).find(".categoryCode:first").val();
        // 親カテゴリと同じ親カテゴリコードを持つカテゴリを検索
        $("#menuCategoryTree").find(".parentCategoryCode").each(function() {
            if ($(this).val() != categoryCode) {
                return true;
            }
            // 子カテゴリを移動
            $ul.append($(this).closest("li"));
        })
        // 子カテゴリのリストを親カテゴリに付与
        $(this).append($ul);
    });

    $("#menuCategory li").on('click', function(event){
        event.stopPropagation();
        var categoryCode = $(this).attr("id");
        // Mockup_V12.18_mod_start
        window.location = "../catalog/商品一覧(サムネイル表示).html";
        // Mockup_V12.18_mod_end
    });

    setFocus("#searchWord");

    // プレビュー時Function
    previewFunctionList.push(function() {
        $("#loginInfoArea").remove();
        $("#openCloseMypage").removeAttr("href");
        $("#mypageInfo").remove();
        $("#headerSearchButton").removeAttr("onclick");
        $("#detailSearchButton").removeAttr("onclick");
        $(".openCloseCategory").removeAttr("href");
        $("#menuCategoryTreeArea").remove();
        $("#sitelogoArea").children("a").removeAttr("href");
    });

});

function executeSearch(formId) {
    if (!$(".pageHeaderSearchWord").val() && $(".pageHeaderSearchCategoryCode").val() == "0") {
        pcPopup("pageHeaderSearchAlert");
    } else {
        // Source_code_v12.18_add_start
        // sendRequestToFront(settings.context + settings.servletMapping + "/catalog/list/", false, formId);
        // Source_code_v12.18_add_end
        // Mockup_v12.18_add_start
        window.location = "../catalog/検索結果.html";
        // Mockup_v12.18_add_end
    }
}

function moveCustomerEdit() {
    blockDoubleClickLink('#customerEdit', '/customer/customer_edit/');
}

function logout() {
    var parameters = createBaseParametersForAjaxApi("common", "logout", "execute");

    var param = {
        parameters : parameters,
        formId : "shippingForm",
        uri : "/common/logout/execute/",
        dataType : "json",
        async : true
    };
    sendAjaxToApi(param);
}

function moveMypage() {
    blockDoubleClickLink('#mypage', '/mypage/mypage/');
}

function returnTopPage() {
    blockDoubleClickLink('#returnTopPage', '/common/index/');
}

function login() {
    blockDoubleClickLink('#login', '/common/login/');
}

function blockDoubleClickLink(idSelector, path) {
    var target = $(idSelector);
    if (typeof (target) == "undefined") {
        return;
    }
    target.css('pointer-events','none');
    setTimeout(function() {
        target.css('pointer-events','auto');
    }, 5000);
    window.location = createWovnHref(settings.context + settings.servletMapping + path);
}
