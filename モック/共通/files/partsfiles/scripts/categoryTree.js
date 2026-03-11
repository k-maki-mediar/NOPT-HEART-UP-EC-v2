$(document).ready(function() {

    $(".toggle").each(function() {
        if ($(this).next().hasClass("childCategory")) {
            // 下の階層のカテゴリがあれば、表示用eventを追加
            $(this).click(function(event) {
                if (!(event.target.tagName.toLowerCase() === 'a')) {
                    $(this).nextUntil(".toggle, .blank").slideToggle(200);
                    $(this).toggleClass("open");
                }
            });
        } else {
            $(this).toggleClass("toggle blank");
        }
    });

    // プレビュー時Function
    previewFunctionList.push(function() {
        $("#categoryTreeArea a").click(function(event) {
            event.preventDefault();
        });
    });

    var $selected = $("li.selected");
    if ($selected && $selected.hasClass("toggle")) {
        $selected.click();
        $selected.unbind("click");
    }
});
