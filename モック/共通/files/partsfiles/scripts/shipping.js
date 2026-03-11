/**
 * PC版
 */
$(document).ready(function() {

    var targetRoot = $(".commodityNameCol");

    scanStandardName(targetRoot);

});


/**
 * お届け先の変更
 */
function changeAddress(element) {

    var uri = "/order/shipping/change_address/";
    var parameters = createBaseParametersForAjaxApi("order", "shipping", "change_address");
    var shippingRowCount = $($(element).parents(".shippingListTemplateArea").get(0)).data("rowcount");

    parameters.shippingRowCount = shippingRowCount;
    parameters.requestPattern = "change_address";
    var functions = createAjaxFunctions(null, null, pageReload);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : uri,
        formId : "shippingForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * お届け先の変更（ゲスト購入時）
 */
function changeAddressGuest() {

    var $backButton = $(".backButton");
    $backButton.click();
}

/**
 * 支払画面に遷移
 */
function movePayment(element) {

    var uri = "/order/shipping/move_payment/";
    var parameters = createBaseParametersForAjaxApi("order", "shipping", "move_payment");
    parameters.requestPattern = "move_payment";

    var param = {
        parameters : parameters,
        uri : uri,
        formId : "shippingForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * お届け先画面共通用action生成function
 */
function createActionInfo(actionId) {
    var actionInfo = new ActionInfo("order", "shipping", actionId);
    actionInfo.requestPattern = actionId;

    return actionInfo;
}

/**
 * 複数お届け先選択
 */
function moveShippingMulti(element) {

    var uri = "/order/shipping/move/";
    var parameters = createBaseParametersForAjaxApi("order", "shipping", "move");
    parameters.requestPattern = "move_multi";

    var param = {
        parameters : parameters,
        uri : uri,
        formId : "shippingForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * 新規アドレス登録用なparameter設定
 */
function getSubmitNewAddressParam(){
    var submitNewAddressParam = {};

    // url
    submitNewAddressParam.url = "/order/shipping/";

    return submitNewAddressParam;
}

/**
 * ギフトリスト
 */
function getGiftList(shopCode, commodityCode, target, targetSkuCode) {

    // Source_code_v12.18_add_start
    // var giftSearchCallBack = function(data) {

    //     // メッセージの引き継ぎ
    //     $("#message").html(giftSearchCallBack.message);
    //     $("#giftInfoTemplate").siblings().remove();

    //     // お届け別のindexを取得
    //     var targetShippingDom = $(target).parents(".shippingDtailTemplateArea");
    //     var targetShippingDomIndex = $(".shippingDtailTemplateArea").index(targetShippingDom);

    //     // 商品のindexを取得
    //     var targetCommodityDom = $(target).parents(".commodityListTemplateArea");
    //     var targetCommodityDomIndex = $(".commodityListTemplateArea", targetShippingDom).index(targetCommodityDom);

    //     var targetRow = targetShippingDomIndex + "_" + targetCommodityDomIndex;
    //     // Domをクリア
    //     var giftTargetCode = "giftCode_" + targetSkuCode;
    //     var selectedGiftCode = targetCommodityDom.find(":hidden[name='" + giftTargetCode + "']").val();

    //     if (!selectedGiftCode) {
    //         $("#noneSelect").prop("checked", true);
    //     }

    //     $("#giftList").children("#giftInfo").remove();

    //     for (index in data.giftList) {
    //         var giftInfo = data.giftList[index];
    //         var giftInfoDom = $("#giftList").children("#giftInfoTemplate").clone();
    //         bindDataToDomDataAttribute(giftInfoDom, giftInfo);
    //         bindDataToDomDataAttributeAlt(giftInfoDom, giftInfo);
    //         giftInfoDom.removeClass("hidden");
    //         giftInfoDom.attr("id", "giftInfo" + index);

    //         if (selectedGiftCode == giftInfo.giftCode) {
    //             $("#noneSelect").attr("checked", false);
    //             giftInfoDom.find(".editRadio").prop("checked", true);
    //             $(giftInfoDom).addClass("giftScrollTarget");
    //         }
    //         $("#giftList").append(giftInfoDom);
    //     }

    //     $("<input>", {
    //         type : 'hidden',
    //         name : 'targetRow',
    //         value : targetRow
    //     }).appendTo(giftInfoDom);

    //     // 選択されたギフトの場所にscrollする
    //     var popUpOption = {
    //         onLoad : function() {
    //             var scrollTarget = $(".giftScrollTarget");
    //             if (scrollTarget.length > 0) {
    //                 var position = scrollTarget.position();
    //                 $("#giftList").animate({
    //                     scrollTop : position.top - 123
    //                 }, 200);
    //             }
    //         }
    //     };

    //     pcPopup("giftListArea", popUpOption);
    // }

    // var uri = "/order/gift_list/search/";

    // var parameters = createBaseParametersForAjaxApi("order", "gift_list", "search");
    // parameters.targetShopCode = shopCode;
    // parameters.targetCommodityCode = commodityCode;
    // requestPattern = "gift_list_search";
    // parameters.requestPattern = requestPattern;
    // var functions = createAjaxFunctions(null, null, giftSearchCallBack);

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     uri : uri,
    //     dataType : "json",
    //     async : true
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    // 選択されたギフトの場所にscrollする
    var popUpOption = {
        onLoad : function() {
            var scrollTarget = $(".giftScrollTarget");
            if (scrollTarget.length > 0) {
                var position = scrollTarget.position();
                $("#giftList").animate({
                    scrollTop : position.top - 123
                }, 200);
            }
        }
    };

    pcPopup("giftListArea", popUpOption);
    // Mockup_v12.18_add_end
}

function callGiftSetAction(element) {

    // Source_code_v12.18_add_start
    // var uri = "/order/shipping/update_gift/";
    // var parameters = createBaseParametersForAjaxApi("order", "shipping", "update_gift");
    // parameters.targetRow = $('#giftListArea :hidden[name="targetRow"]').val();
    // parameters.targetGiftCode = $('[name=wrappingSelect]:checked').val();
    // parameters.requestPattern = "update_gift";

    // var uri = "/order/shipping/update_gift/";
    // var functions = createAjaxFunctions(null, null, pageReload);

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     formId : "shippingForm",
    //     uri : uri,
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    targetGiftCode = $('[name=wrappingSelect]:checked').val();
    if(targetGiftCode === "") {
        $("#giftNone").show();
        $("#giftSelected").hide();
    } else {
        $("#giftNone").hide();
        $("#giftSelected").show();
    }
    $(".js_lb_overlay").remove();
    $("#giftListArea").hide();
    scrollTopMock();
    // Mockup_v12.18_add_end
}

/** 再描画 */
function pageReload(data, messages) {

    if (messages.errorMessages.length == 0) {
        location.assign(location.toString());
    } else {
        // お届け先プルダウンを戻す
        var addressSelectArray = $("select[name=shippingAddress]");
        for (var i = 0; i < addressSelectArray.length; i++) {
            var addressSelect = addressSelectArray[i];
            var orgselect = $(addressSelect).data("orgselect")
            $(addressSelect).val(orgselect);
        }

        // ギフト・のしLightBoxを消す
        $("#giftListArea").hide();
        $("#noshiListArea").hide();
        $(".js_lb_overlay").remove();

    }

}

/** クリックイベント */
function txtClick(target) {
    if (target != null) {
        $('input:radio[name="wrappingSelect"]:input[value=' + target + ']').prop("checked", true);
    } else {
        $('input:radio[name="wrappingSelect"]:input[id=noneSelect]').prop("checked", true);
    }
};

/** 熨斗リスト */
function getNoshiList(shopCode, target) {

    // Source_code_v12.18_add_start
    // var noshiSearchCallBack = function(data) {

    //     // お届け別のindexを取得
    //     var targetShippingDom = $(target).parents(".shippingDtailTemplateArea");
    //     var targetShippingDomIndex = $(".shippingDtailTemplateArea").index(targetShippingDom);

    //     // 商品のindexを取得
    //     var targetCommodityDom = $(target).parents(".commodityListTemplateArea");
    //     var targetCommodityDomIndex = $(".commodityListTemplateArea", targetShippingDom).index(targetCommodityDom);

    //     var targetRow = targetShippingDomIndex + "_" + targetCommodityDomIndex;

    //     // 入力した熨斗名入れと連絡事項を取得
    //     var noshiPopUpLinkArea = $(target).parents(".noshiPopUpLinkArea");
    //     $('#noshiListArea [name="noshiNameplate"]').val($(".inputedNoshiNameplate", noshiPopUpLinkArea).val());
    //     $('#noshiListArea [name="noshiMessage"]').val($(".inputedNoshiMessage", noshiPopUpLinkArea).val());
    //     var selectededNoshiCode = $(".selectededNoshiCode", noshiPopUpLinkArea).val();
    //     if ( !selectededNoshiCode ) {
    //         $("#noNoshi").prop("checked", true)
    //     }

    //     $(".noshiInfoTemplate:first").siblings().remove();
    //     for (index in data.noshiList) {
    //         var noshiInfo = data.noshiList[index];
    //         var noshiInfoDom = $(".noshiInfoTemplate:first").clone();
    //         bindDataToDomDataAttribute(noshiInfoDom, noshiInfo);
    //         bindDataToDomDataAttributeAlt(noshiInfoDom, noshiInfo);

    //         // ラジオボタン制御
    //         $("input[type='radio']", noshiInfoDom).attr("id", "noshiInfo_" + noshiInfo.noshiCode).attr("value", noshiInfo.noshiCode);
    //         $("label", noshiInfoDom).attr("for", "noshiInfo_" + noshiInfo.noshiCode);
    //         if (selectededNoshiCode == noshiInfo.noshiCode) {
    //             $("input[type='radio']", noshiInfoDom).prop("checked", true);
    //             $("#noNoshi").prop("checked", false);
    //             $(noshiInfoDom).addClass("noshiScrollTarget");
    //         }

    //         noshiInfoDom.show();
    //         $(".noshiInfoTemplate:last").after(noshiInfoDom);
    //     }

    //     // 各熨斗のエリアにラジオボタンの選択イベントを追加
    //     $("#noshiListArea .noshiInfoTemplate,.noNoshiArea ").each(function() {
    //         $(this).click(function() {
    //             $("input[type='radio']", this).prop("checked", true);
    //         });
    //     });

    //     $("<input>", {
    //         type : 'hidden',
    //         name : 'targetRow',
    //         value : targetRow
    //     }).appendTo("#noshiInfoList");

    //     // 選択された熨斗の場所にscrollする
    //     var popUpOption = {
    //         onLoad : function() {
    //             var scrollTarget = $(".noshiScrollTarget");
    //             if (scrollTarget.length > 0) {
    //                 var position = scrollTarget.position();
    //                 $("#noshiInfoList").animate({
    //                     scrollTop : position.top - 123
    //                 }, 200);
    //             }
    //         }
    //     };

    //     pcPopup("noshiListArea", popUpOption);

    //     // 熨斗入力エリアdisable初期制御
    //     if ($("#noNoshi").is(":checked")) {
    //         disableNoshiInput(true);
    //     } else {
    //         disableNoshiInput(false);
    //     }
    // }

    // var uri = "/order/noshi_list/search/";

    // var parameters = createBaseParametersForAjaxApi("order", "noshi_list", "search");
    // parameters.targetShopCode = shopCode;
    // requestPattern = "noshi_list_search";
    // parameters.requestPattern = requestPattern;
    // var functions = createAjaxFunctions(null, null, noshiSearchCallBack);

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     uri : uri,
    //     dataType : "json",
    //     async : true
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    // 熨斗入力エリアdisable初期制御
    var popUpOption = {
        onLoad : function() {
            var scrollTarget = $(".noshiScrollTarget");
            if (scrollTarget.length > 0) {
                var position = scrollTarget.position();
                $("#noshiInfoList").animate({
                    scrollTop : position.top - 123
                }, 200);
            }
        }
    };

    pcPopup("noshiListArea", popUpOption);

    if ($("#noNoshi").is(":checked")) {
        disableNoshiInput(true);
    } else {
        disableNoshiInput(false);
    }
    // Mockup_v12.18_add_end
}

/** 熨斗入力エリアdisable制御 */
function disableNoshiInput(flg) {
    if (flg) {
        $('#noshiListArea [name="noshiNameplate"],[name="noshiMessage"]').prop("disabled", true);
    } else {
        $('#noshiListArea [name="noshiNameplate"],[name="noshiMessage"]').prop("disabled", false);
    }
}

function callNoshiSetAction(formId, element) {

    // Source_code_v12.18_add_start
    // var uri = "/order/shipping/update_noshi/";
    // var parameters = createBaseParametersForAjaxApi("order", "shipping", "update_noshi");
    // parameters.targetRow = $('#noshiListArea :hidden[name="targetRow"]').val();
    // parameters.targetNoshiCode = $('#noshiListArea [name="noshiRadio"]:checked').val();
    // parameters.targetNoshiNameplate = $('#noshiListArea [name="noshiNameplate"]').val();
    // parameters.targetNoshiMessage = $('#noshiListArea [name="noshiMessage"]').val();
    // parameters.requestPattern = "update_noshi";

    // var uri = "/order/shipping/update_noshi/";
    // var functions = createAjaxFunctions(null, null, pageReload);

    // var param = {
    //     parameters : parameters,
    //     functions : functions,
    //     formId : "shippingForm",
    //     uri : uri,
    //     dataType : "json",
    //     async : true,
    //     element : element
    // }
    // sendAjaxToApi(param);
    // Source_code_v12.18_add_end
    // Mockup_v12.18_add_start
    targetNoshiCode = $('#noshiListArea [name="noshiRadio"]:checked').val();
    if(targetNoshiCode === "") {
        $(".noshiPopUpLinkArea").show();
        $(".noshiPopUpLinkAreaSelected").hide();
    } else {
        $(".noshiPopUpLinkArea").hide();
        $(".noshiPopUpLinkAreaSelected").show();
    }
    $(".js_lb_overlay").remove();
    $("#noshiListArea").hide();
    scrollTopMock();
    // Mockup_v12.18_add_end
}
