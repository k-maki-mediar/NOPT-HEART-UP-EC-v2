$(document).ready(function() {

    createSocialAccountTopicPathList();

});

/**
 * パンくずリストを作成
 */
function createSocialAccountTopicPathList() {

    var topicPathList = {};
    // Source_V12.18_add_start
    // topicPathList["マイページ"] = "/mypage/mypage/";
    // Source_V12.18_add_end
    // Mockup_V12.18_add_start
    topicPathList["マイページ"] = "../mypage/マイページ.html";
    // Mockup_V12.18_add_end
    topicPathList["SNSアカウント連携"] = "";

    initializeTopicPath(topicPathList);
}