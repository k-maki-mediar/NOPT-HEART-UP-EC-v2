$(document).ready(function() {
    createCouponTopicPathList();
});

/**
 * パンくずリストを作成
 */
function createCouponTopicPathList() {
    var topicPathList = {};
    // Source_V12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    // Mockup_V12.18_add_end
    topicPathList["クーポン一覧"] = "";

    initializeTopicPath(topicPathList);
}
