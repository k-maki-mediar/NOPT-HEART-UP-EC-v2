$(document).ready(function(){
            for (var i = 0; i < finalFunctionList.length; i++) {
                finalFunctionList[i]();
            }

            controlBackButton();
            imgSrc();
            changeClientStyle();

            setTimeout(function(){
                previewControl()
            },500);
            
            if ('scrollRestoration' in history) {
               history.scrollRestoration = 'manual';
            }

        });

function previewControl() {
    var $preview = $("#preview");
    if ($preview[0]) {
        var isPreview = $preview.attr("value");
        if (isPreview === "true") {
            for (var i = 0; i < previewFunctionList.length; i++) {
                previewFunctionList[i]();
            }
        }
    }
}

$(function() {
    $(".popUpArea").prev().click(function(e) {
        var dialog = $(this).next();
        $(".popUpArea").not(dialog).hide(0);
        dialog.toggle(0);
        e.stopPropagation();
    });

    $(document).click(function(e) {
        $(".popUpArea").hide();
    });
});

/**
 * BackButton Control Function
 */
function controlBackButton() {
    var backButton = $("#backButton");

    if (!backButton.length) {
        return;
    }

    if ($.mobile) {
        backButton.attr("rel", "external")
    }

    var commonMoveBack = function() {
        $(this).unbind();
        $(this).addClass("largeButtonDuplicateStop");
        $(this).data("button", "goBack");
        var parameters = createBaseParametersForAjaxApi("common", "history_back", "back");
        var param = {
            parameters : parameters,
            uri : "/common/history_back/back/",
            dataType : "json",
            async : true,
            element : this
        }
        sendAjaxToApi(param);
    };

    backButton.click(commonMoveBack);
}

function imgSrc() {
    $("img").each(function() {

        var src = $(this).attr("src");
        if ($(this).attr("src") === "" || !$(this).attr("src")) {
            var noPhotoType = $(this).data("nophoto");

            if (noPhotoType) {
                $(this).attr("src", images[noPhotoType]);

            } else {
                $(this).attr("src", images["noPhotoCommodity"]);
            }
        }
    });
}

// クライアント端末の幅によってデザイン変更
function changeClientStyle() {
    if ($.mobile) {
        return;
    }
    var clientWidth = document.body.clientWidth;

    if (clientWidth < 768) {
        clientStyle = "sp";
    } else if (clientWidth < 992) {
        clientStyle = "tb";
    } else if (clientWidth < 1200) {
        clientStyle = "pc";
    } else {
        clientStyle = "large";
    }

    for (var i = 0; i < clientStyleFunctionList.length; i++) {
        clientStyleFunctionList[i]();
    }

}

window.onresize = function() {
    changeClientStyle();
};

