$(document).ready(function() {
    createDeliveryHistoryTopicPathList();
    pagerDataBind();
    scanStandardName(".commodityListArea");
});

/**
 * パンくずリストを作成
 */
function createDeliveryHistoryTopicPathList() {
    var topicPathList = {};
    // Source_code_v12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // topicPathList["アドレス帳一覧"] = "/mypage/address_list/";
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    topicPathList["アドレス帳一覧"] = "../mypage/アドレス帳一覧.html";
    topicPathList["お届け履歴"] = "";
    // Source_code_v12.18_add_end

    initializeTopicPath(topicPathList);
}

var deliveryHistoryCallback = function() {

};
