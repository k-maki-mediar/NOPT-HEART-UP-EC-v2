$(document).ready(function() {
    // パンくず
    createOrderDetailTopicPathList();

    scanStandardName(".commodityNameCol");
});

/**
 * パンくずリストを作成
 */
function createOrderDetailTopicPathList() {

    var topicPathList = {};
    // Source_V12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // topicPathList["注文履歴"] = "/mypage/order_history/";
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    topicPathList["注文履歴"] = "../mypage/注文履歴.html";
    // Mockup_V12.18_add_end
    topicPathList["注文内容"] = "";

    initializeTopicPath(topicPathList);
}

var orderDetailCallback = function() {

};

/**
 * 指定URLに遷移する
 *
 * @param url
 */
function sendOrderDetailMoveRequest(url, element) {

    // Source_code_v12.18_add_start
    // var parameters = createBaseParametersForAjaxApi("mypage", "order_detail", "move");
    // parameters.url = url;

    // var param = {
    //     parameters : parameters,
    //     uri : "/mypage/order_detail/move/",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    window.location = "../mypage/お届け履歴.html"
    // Mockup_v12.18_add_end
}

/**
 * 注文キャンセル送信をする
 *
 * @param targetOrderNo
 */
function sendOrderDetailCancelRequest(element) {
    if (!window.confirm(message.confirmCancelOrder)) {
        return;
    }

    // Source_code_v12.18_add_start
    // var successFunction = function() {
    //     $("#cancelButton").remove();
    // }

    // var parameters = createBaseParametersForAjaxApi("mypage", "order_detail", "cancel");
    // var functions = createAjaxFunctions(null, null, successFunction);

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     formId : "cancelForm",
    //     uri : "/mypage/order_detail/cancel/",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    $(".informationBlock").show();
    $("#cancelButton").hide();
    scrollTopMock();
    // Mockup_v12.18_add_end
}

/**
 * レビュー投稿画面遷移
 */
function moveReviewPost(url) {
    // Source_code_v12.18_add_start
    // var url = url;
    // window.location = createWovnHref(settings.context + settings.servletMapping + url);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    window.location = "../catalog/レビュー入力.html"
    // Mockup_v12.18_add_end
}
