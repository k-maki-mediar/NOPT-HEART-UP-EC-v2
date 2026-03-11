$(document).ready(function() {

    // パンくず
    createTopicPathList();

});

// パンくずリストを作成
function createTopicPathList() {

    var topicPathList = {};
    var tagNameArea = $("#tagNameArea");
    topicPathList[tagNameArea.html()] = "";

    initializeTopicPath(topicPathList);
}
