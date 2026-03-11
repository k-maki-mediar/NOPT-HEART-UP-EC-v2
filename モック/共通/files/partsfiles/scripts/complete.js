/**
 * ＰＣ版
 */
$(document).ready(function() {
});

/**
 * 次画面に遷移する
 *
 * @param url
 */
function moveNext(url) {
    location.href = createWovnHref(settings.context + settings.servletMapping + url);
}
