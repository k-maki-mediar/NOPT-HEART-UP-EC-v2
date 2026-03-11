$(document).ready(function() {

    // パンくずリスト
    createTopicPathListForCatalogDetail();

    // 規格エリア設定
    setStandardArea();

    // 画像設定
    setStandardImg();

    // プレビュー時Function
    previewFunctionList.push(function() {
        detailPreviewFromBackCallback();
    });
    
});

var dispArea;
var selectBtn1;
var selectBtn2;
var isHover = false;
var isMouseIn = false;

/**
 * 規格エリアを設定する。
 */
function setStandardArea() {

    var code1 = $("#selectedStandardDetailCode1").val();
    var code2 = $("#selectedStandardDetailCode2").val();

    changeStandard(code1, code2);

    setHover();
}

/**
 * 規格変更時の処理
 *
 * @param code1
 *            規格コード1
 * @param code2
 *            規格コード2
 */
function changeStandard(code1, code2) {

    // 現在のエリアを非表示にする
    if (dispArea) {
        $(dispArea).addClass("standardHidden");
        $(dispArea).find('.incWorkCheck').addClass("ignored");
        $(dispArea).find('.incWorkDetail').addClass("ignored");
        $(dispArea).find('.incWorkFreeTextInput').addClass("ignored");
    }

    var areaId = "#standardArea" + code1 + code2;
    var btnAreaId = "#standardButtonArea" + code1 + code2;
    var descriptAreaId = "#standardDescriptArea" + code1 + code2;

    // 規格に該当するエリアを取得する(価格エリア、ボタンエリア、説明エリア)
    var detailElement = $(areaId + ", " + btnAreaId + ", " + descriptAreaId);

    // 規格組み合わせなし
    if (detailElement.length) {
        $(".mismatchArea").addClass("standardHidden");
    } else {
        $(".mismatchArea").removeClass("standardHidden");
    }

    // 該当エリアを表示する
    detailElement.removeClass("standardHidden");
    detailElement.find('.incWorkCheck').removeClass("ignored");
    detailElement.find('.incWorkDetail').removeClass("ignored");
    detailElement.find('.incWorkFreeTextInput').removeClass("ignored");
    dispArea = detailElement;

    // ボタン群のstyleを初期化する
    var btns = $(".selectStandardBtn");
    btns.removeClass("selectedStandard");

    var detailInfoAreaElement = $(".detailInfoArea");
    for (var i = 0; i < detailInfoAreaElement.length; i++) {
        var detailInfo = detailInfoAreaElement[i];
        var standardDetail1Code = $(detailInfo).find("input[name='standardDetail1Code']").val();
        var standardDetail2Code = $(detailInfo).find("input[name='standardDetail2Code']").val();
    }

    // 選んだボタンに選択色をつける
    var btn1 = $("#standard1btn" + code1);
    var btn2 = $("#standard2btn" + code2);
    $(btn1).addClass("selectedStandard");
    $(btn2).addClass("selectedStandard");

    if (!isHover) {
        selectBtn1 = btn1;
        selectBtn2 = btn2;
        $("#selectedStandardDetailCode1").val(code1);
        $("#selectedStandardDetailCode2").val(code2);
    }

}

/**
 * マウスオーバーの設定
 */
function setHover() {

    // マウスオーバー処理を無効
    if (_ua.Tablet || _ua.Mobile) {
        return;
    }

    var btns = $(".selectStandardBtn");

    // マウスオーバーで在庫数などを切り替える
    $(btns).siHover({}, function(event, data, element) {

        isMouseIn = true;

        // ボタンクリックを呼び出す
        isHover = true;
        element.click();
        isHover = false;

    }, function(event, data, element) {

        isMouseIn = false;

        setTimeout("standardMouseOut()", 200);
    });
}

/**
 * マウスが離れる際の処理
 */
function standardMouseOut() {

    // マウスがinしている最中の場合、戻さない
    if (isMouseIn) {
        return;
    }

    // 元に戻す処理(保持していたボタンのクリックを実行する)
    isHover = true;
    selectBtn1.click();
    selectBtn2.click();
    isHover = false;

}

/**
 * 規格1の変更時
 */
function changeStandard1(code1) {

    var code2 = $("#selectedStandardDetailCode2").val();
    changeStandard(code1, code2);

    var standardImageType = $("#standardImageType").val();
    if (standardImageType == 1) {
        changeStandardImage(code1, true);
    }

}

/**
 * 規格2の変更時
 */
function changeStandard2(code2) {

    var code1 = $("#selectedStandardDetailCode1").val();
    changeStandard(code1, code2);

    var standardImageType = $("#standardImageType").val();
    if (standardImageType == 2) {
        changeStandardImage(code2, true);
    }

}

/**
 * カート追加処理
 *
 * @param shopCode
 * @param commodityCode
 * @param selectedSkuCode
 */
function addCartOfDetail(formId, agreeFlg) {

    var quantityId = formId.replace("detailInfoForm_","quantityList_");
    var quantity = $("#"+quantityId).val();

    var salesMethodType = $("#salesMethodType").val();
    var purchaseMethodType;
    if (salesMethodType == "1") {
        purchaseMethodType = "1"
    } else {
        purchaseMethodType = $("input[name=purchaseMethodType]:checked").val();
    }

    // カートに追加
    addCartFromDetail(formId, agreeFlg, quantity, null, purchaseMethodType);
}

/**
 * 画像設定処理
 */
function setStandardImg() {

    // クライアント端末幅変更時
    clientStyleFunctionList.push(function() {

        // SP、TB時はズームしない
        if (clientStyle === "sp" || clientStyle === "tb") {
            $(".ZoomContainer").hide();
        } else {
            $(".ZoomContainer").show();
        }
    });

    setZoomImages();

    var code1 = $("#selectedStandardDetailCode1").val();
    var code2 = $("#selectedStandardDetailCode2").val();
    var standardImageType = $("#standardImageType").val();

    // 画像表示設定
    if (standardImageType == 1) {
        changeStandardImage(code1, true);

    } else if (standardImageType == 2) {
        changeStandardImage(code2, true);

    } else {
        if (!_ua.Tablet && !_ua.Mobile) {
            $("#mainImage").click(function (e) {
                var ez = $("#mainImage").data("ezPlus");
                callColorbox(ez.getGalleryList());
                return false;
            });
        }
    }

    if (_ua.Tablet || _ua.Mobile) {
        // SPの場合は画像のURLで閲覧
        var w = $("#mainImage").width();
        var h = $("#mainImage").height();
        var link = $("<div id='spImageLink'></div>").width(w).height(h);
        $("#mainImage").before(link);
        $("#spImageLink").on("click", function(e) {
            var url = $("#mainImage").attr("data-zoom-image");
            window.open(url, null, "resizable=1");
        });
    }
}

/**
 * 規格画像つけ画像変更
 */
function changeStandardImage(standardDetailCode, changeImageFlag) {

    var standardImageArea = $("#standardDetailCode_" + standardDetailCode);
    // 規格エリアがない場合は処理しない
    if (!standardImageArea.length) {
        return;
    }

    standardImageArea.siblings().hide();
    standardImageArea.show();
    var commonImage = standardImageArea.find(".catalogRelatedImages a:eq(0)");

    if (changeImageFlag) {
        // 規格画像がない場合はNoPhoto
        if (!commonImage.length) {

            $("#mainImageArea #mainImage").stop(true, true).fadeOut("fast", function() {
                $(".zoomWrapper").hide();
                $("#spImageLink").hide();
                $(".ZoomContainer").hide();
                $("#noPhotoArea").stop(true, true).fadeIn("fast");
            });

        } else {
            // 規格画像がある場合
            if ($("#noPhotoArea").is(':visible')) {

                $(".zoomWrapper").show();
                $("#spImageLink").show();
                $(".ZoomContainer").show();
                $("#noPhotoArea").stop(true, true).fadeOut("fast", function() {
                    commonImage.click();
                    $("#mainImageArea #mainImage").stop(true, true).fadeIn("fast");
                });

            } else {
                if (!($('div.zoomWindow').length)) {
                    setTimeout(function() {commonImage.click();}, 2000);
                } else {
                    commonImage.click();
                }
            }

            if (!_ua.Tablet && !_ua.Mobile) {

                $(".ZoomContainer").show();
                // 選択された規格のpopUp画像リストを作成する
                var startIndex = 0;
                var targetImages = 0;

                $("#relatedImageArea > span").each(function(index, dom) {
                    if ($(this).attr("id") == "standardDetailCode_" + standardDetailCode) {
                        targetImages = $("#mainImage", dom).length;
                        return false;
                    } else {
                        startIndex += $("#mainImage", dom).length;
                        return true;
                    }
                });

                $("#mainImage").off("click").click(function(e) {
                    var ez = $("#mainImage").data("ezPlus");
                    var galleryList = ez.getGalleryList();

                    var currentStandardGalleryList = galleryList.slice(startIndex + 1, startIndex + targetImages);
                    currentStandardGalleryList.unshift(galleryList[0]);
                    callColorbox(currentStandardGalleryList);
                    return false;
                });
            } else {
                $(".ZoomContainer").hide();
            }
        }
    }

    // 規格画像が一枚のみの場合はサムネル一覧を非表示
    if (standardImageArea.find(".catalogRelatedImages a").length <= 1) {
        $(".catalogRelatedImages").hide();
    } else {
        $(".catalogRelatedImages").show();
    }

}
