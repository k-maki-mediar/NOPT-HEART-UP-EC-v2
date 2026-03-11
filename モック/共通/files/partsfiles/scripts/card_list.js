$(document).ready(function() {
    // パンくず
    createCardListTopicPathList();
});

/**
 * パンくずリストを作成
 */
function createCardListTopicPathList() {

    var topicPathList = {};
    // Source_V12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    // Mockup_V12.18_add_end
    topicPathList["クレジットカード情報一覧"] = "";

    initializeTopicPath(topicPathList);
}

/**
 * 参照ボタン
 */
function sendSearchRequest(element) {

    var parameters = createBaseParametersForAjaxApi("mypage", "card_list", "move");
    parameters.searchedFlg = "true";

    var param = {
        parameters : parameters,
        uri : "/mypage/card_list/move",
        formId : "cardListForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * 登録ボタン
 */
function sendAddCardMoveRequest(shopCode, paymentMethodCode, element) {

    // Source_code_v12.18_add_start
    // var uri = "/mypage/card_add/" + shopCode +"/" + paymentMethodCode +"/" ;

    // window.location = settings.context + settings.servletMapping + uri;
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    window.location = "../mypage/クレジットカード情報登録.html"
    // Mockup_v12.18_add_end
}

/**
 * 削除ボタン
 */
function sendPaymentDeleteCardNoRequest(paymentMethodCode, customerCardId, element) {

    var confirmText = "削除しますか？";

    if (window.confirm(confirmText)) {
        // Source_V12.18_add_start
        // var uri = "/mypage/card_list/delete/";
        // var parameters = createBaseParametersForAjaxApi("mypage", "card_list", "delete");
        // parameters.paymentMethodCode = paymentMethodCode;
        // parameters.customerCardId = customerCardId;

        // var param = {
        //     parameters : parameters,
        //     uri : uri,
        //     formId : "cardListForm",
        //     dataType : "json",
        //     async : true,
        //     element : element
        // }
        // sendAjaxToApi(param);
        // Source_V12.18_add_end
        // Mockup_V12.18_add_start
        $('.informationBlock').show();
        window.scrollTo(0, 0);
        // Mockup_V12.18_add_end
    }
}
