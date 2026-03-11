$(document).ready(function() {

    // パンくず
    createTopicPathList();

    // ページャー
    pagerDataBind();
});


function createTopicPathList() {

    var topicPathList = {};
    topicPathList["ショップ一覧"] = "";

    initializeTopicPath(topicPathList);
}
