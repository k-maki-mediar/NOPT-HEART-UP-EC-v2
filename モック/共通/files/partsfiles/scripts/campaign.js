$(document).ready(function() {

    // パンくず
    createTopicPathList();
    

});


//パンくずリストを作成
function createTopicPathList() {

    var topicPathList = {};
    var campaignNameArea = $("#campaignNameArea");
    topicPathList[campaignNameArea.html()] = "";

    initializeTopicPath(topicPathList);
}
