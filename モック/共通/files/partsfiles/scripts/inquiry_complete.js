$(document).ready(function() {
});

// 前へ戻る処理
function backPage(str) {

    var backUrl = str;

    location.href = createWovnHref(settings.context + backUrl);
}
