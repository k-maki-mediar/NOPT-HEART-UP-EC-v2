$(document).ready(function() {
    // パンくず
    createRecommendListTopicPathList();
    // ページャー
    pagerDataBind();
});

/**
 * パンくずリストを作成
 */
function createRecommendListTopicPathList() {
    // Source_code_v12.18_add_start
    var topicPathList = {};
    // topicPathList["マイページ"] = "/mypage/mypage/";
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    topicPathList["おすすめ商品"] = "";
    // Source_code_v12.18_add_end
    initializeTopicPath(topicPathList);
}
