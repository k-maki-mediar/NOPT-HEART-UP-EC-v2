$(document).ready(function() {
    // プレビュー時Function
    previewFunctionList.push(function() {
        $("#topicPath").children("a").removeAttr("href");
    });
});

// Source_V12.18_add_start
// function topicPathMove(url) {
//     var parameters = createBaseParametersForAjaxApi("common", "topic_path", "move");
//     parameters.url = url;

//     var param = {
//         parameters : parameters,
//         uri : "/common/topic_path/move/",
//         dataType : "json",
//         async : true
//     }
//     sendAjaxToApi(param);
// }
// Source_V12.18_add_end
// Mockup_V12.18_add_start
function topicPathMove(url) {
    location.href = url;
}
// Mockup_V12.18_add_end
