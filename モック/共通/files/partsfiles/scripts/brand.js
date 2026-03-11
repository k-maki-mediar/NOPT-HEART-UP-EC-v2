$(document).ready(function() {

    // パンくず
    createTopicPathList();
    
});

// パンくずリストを作成
function createTopicPathList() {

    var topicPathList = {};
    var brandNameArea = $("#brandNameArea");
    topicPathList[brandNameArea.html()] = "";

    initializeTopicPath(topicPathList);
}
