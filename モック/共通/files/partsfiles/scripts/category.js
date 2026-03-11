$(document).ready(function() {

    // パンくずリスト
    createTopicPathList();
    

});

function createTopicPathList(data) {

    var topicPathList = {};
    var topicPathArray = $(".topicPath");
    for (var i = 0; i < topicPathArray.length; i++) {
        if (i == topicPathArray.length -1) {
            topicPathList[$(topicPathArray[i]).data("name")] = "";
        } else {
            topicPathList[$(topicPathArray[i]).data("name")] = $(topicPathArray[i]).data("value");
        }
    }


    initializeTopicPath(topicPathList);
}
