$(document).ready(function() {
    // パンくず
    createOrderHistoryTopicPathList();
    // ページャー
    pagerDataBind();

    scanStandardName(".commodityNameCol");
});

/**
 * パンくずリストを作成
 */
function createOrderHistoryTopicPathList() {
    var topicPathList = {};
    // Source_code_v12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    // Mockup_v12.18_add_end
    topicPathList["注文履歴"] = "";
    initializeTopicPath(topicPathList);

}
var orderHistoryCallback = function(data, messages) {

    if (messages.errorMessages.length == 0) {
        $("#cancel_" + orderHistoryCallback.targetOrderNo).remove();
        $("#status_" + orderHistoryCallback.targetOrderNo).html("キャンセル");
        $("#info_" + orderHistoryCallback.targetOrderNo).remove();
    }
}

/**
 * 注文キャンセル送信をする
 *
 * @param targetOrderNo
 */
function sendOrderHistoryCancelRequest(targetOrderNo, currentPage, pageSize, element) {

    if (!window.confirm(message.confirmCancelOrder)) {
        return;
    }

    // Source_code_v12.18_add_start
    // var uri = "/mypage/order_history/cancel/";
    // var parameters = createBaseParametersForAjaxApi("mypage", "order_history", "cancel");
    // parameters.orderNo = targetOrderNo;
    // parameters.currentPage = currentPage;
    // parameters.pageSize = pageSize;
    // orderHistoryCallback.targetOrderNo = targetOrderNo;
    // var functions = createAjaxFunctions(null, null, orderHistoryCallback);

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     uri : uri,
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    $(".informationBlock").show();
    element.style.display = "none";
    scrollTopMock();
    // Mockup_v12.18_add_end
}

/**
 * 指定URLに遷移する
 *
 * @param url
 */
function sendOrderHistoryMoveRequest(url, element) {

    // Source_code_v12.18_add_start
    // var parameters = createBaseParametersForAjaxApi("mypage", "order_history", "move");
    // parameters.url = url;

    // var param = {
    //     parameters : parameters,
    //     uri : "/mypage/order_history/move/",
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    if (url.includes("order_detail")) {
        window.location = "../mypage/注文内容.html";
    } else {
        window.location = "../customer/お問い合わせ入力(注文).html"
    }
    // Mockup_v12.18_add_end
}

function orderHistorySearch(type) {

    var parameters = createBaseParametersForAjaxApi("mypage", "order_history", "move");
    parameters.url = "/mypage/order_history/";
    parameters.selectOrderStatusValue = type;

    var param = {
        parameters : parameters,
        uri : "/mypage/order_history/move/",
        dataType : "json",
        async : true
    }
    sendAjaxToApi(param);
}
