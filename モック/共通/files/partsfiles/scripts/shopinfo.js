$(document).ready(function() {

    // パンくず
    if( $('#shopList').length > 0 ) {
        createTopicPathList();
    }
});


function createTopicPathList() {

    var topicPathList = {};
    topicPathList["ショップ一覧"] = "/info/shop_list/";

    initializeTopicPath(topicPathList);
}
