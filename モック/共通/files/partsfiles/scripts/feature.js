$(document).ready(function() {
    // パンくず
    createTopicPathList();
    
});


//パンくずリストを作成
function createTopicPathList() {
    var topicPathList = {};
    var featureNameArea = $("#featureNameArea");
    topicPathList[featureNameArea.html()] = "";
    initializeTopicPath(topicPathList);
}
