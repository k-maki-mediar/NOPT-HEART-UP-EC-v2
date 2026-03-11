$(document).ready(function() {
    // パンくず
    createCardListTopicPathList();

    // リアルタイムバリデーション設定
    $("input[type='text']").siValidation({});

});

/**
 * パンくずリストを作成
 */
function createCardListTopicPathList() {

    var topicPathList = {};
    // Source_code_v12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // topicPathList["クレジットカード情報一覧"] = "/mypage/card_list/";
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    topicPathList["クレジットカード情報一覧"] = "../mypage/クレジットカード情報一覧.html";
    // Mockup_v12.18_add_end
    topicPathList["クレジットカード情報登録"] = "";

    initializeTopicPath(topicPathList);
}

/**
 * 登録ボタン
 */
function sendAddCardRequest(element) {

    var uri = "/mypage/card_add/register/";
    var parameters = createBaseParametersForAjaxApi("mypage", "card_add", "register");

    var param = {
        parameters : parameters,
        uri : uri,
        formId : "cardAddForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * 前へ戻るボタン
 */
function sendBackRequest(shopCode, element) {

    // Source_code_v12.18_add_start
    // var parameters = createBaseParametersForAjaxApi("mypage", "card_list", "move");
    // parameters.searchShopCode = shopCode;

    // var param = {
    //     parameters : parameters,
    //     uri : "/mypage/card_list/move",
    //     formId : "cardAddForm",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    location.href = "../mypage/クレジットカード情報一覧.html"
    // Mockup_v12.18_add_end
}
