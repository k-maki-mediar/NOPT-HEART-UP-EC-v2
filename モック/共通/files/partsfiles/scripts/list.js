$(document).ready(function() {

    // パンくず
    createTopicPathList();

});


function createTopicPathList() {

    var topicPathList = {};
    topicPathList["検索結果"] = "";

    initializeTopicPath(topicPathList);
}

