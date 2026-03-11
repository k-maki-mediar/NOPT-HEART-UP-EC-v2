/**
 * ＰＣ版
 */
$(document).ready(function() {

    // リアルタイムバリデーション設定
     var initInputList = $("input[type='radio']:checked").closest("div").find("input[type='text']");
        if ($(initInputList).length > 0) {
            initInputList.siValidation({});
     }

    $("input[type='radio']").click(function(event) {
        var inputList =  $("input[type='radio']").closest("div").find("input[type='text']");
        if ($(inputList).length > 0) {
            $(inputList).each(function() {
                $(this).unbind("blur");
            });
        }
        inputList = $("input[type='radio']:checked").closest("div").find("input[type='text']");
        if ($(inputList).length > 0) {
            inputList.siValidation({});
        }
    });

    $("input[name='paymentMethodCode']:checked").trigger("click");
    $(".creditcardMainArea").each(function() {
        var targetArea = $(this);
        // カード初期選択処理
        if ($(".inputtedCard", targetArea).length > 0) {
            $(".inputtedCard", targetArea).prop("checked", true).trigger("click");
        } else {
            var selectedCard = $(".savedCardInfoListArea input[type='radio']:checked", targetArea);
            if (selectedCard.length > 0) {
                selectedCard.prop("checked", true).trigger("click");
            } else {
                $("input[name^='savedCardId_']", targetArea).first().prop("checked", true).trigger("click");
            }
        }
    });

    // コンビニのお客様番号の表示制御
    $("select.csvSelectTag").change(function() {
       var cvsPhoneNumberArea =  $(this).closest(".displayPaymentListTemplateArea").find(".cvsPhoneNumber");
       // イーコンの場合のみ表示
        if ($(this).val() == "20") {
            cvsPhoneNumberArea.show();
        } else {
            cvsPhoneNumberArea.hide();
        }
    });
    $("select.csvSelectTag").trigger("change");

});

/**
 * 過去登録したカード情報を削除する
 *
 * @param paymentMethodCode
 * @param customerCardId
 * @param deleteId
 */
function sendPaymentDeleteCardNoRequest(paymentMethodCode, customerCardId, deleteId, element) {

    var confirmMessage;
    confirmMessage = "削除しますか？"

    if (confirm(confirmMessage)) {

        var uri = "/order/payment/delete_card_info/";
        var parameters = createBaseParametersForAjaxApi("order", "payment", "delete_card_info");
        parameters.paymentMethodCode = paymentMethodCode;
        parameters.customerCardId = customerCardId;

        var param = {
            parameters : parameters,
            uri : uri,
            dataType : "json",
            async : true,
            element : element
        }
        sendAjaxToApi(param);
    }

}

/**
 * 注文内容確認へ
 */
function sendPaymentRequestConfirm(element) {

    var parameters = createBaseParametersForAjaxApi("order", "payment", "confirm");

    var param = {
        parameters : parameters,
        uri : "/order/payment/confirm/",
        formId : "paymentForm",
        dataType : "json",
        async : true,
        element : element,
    }
    sendAjaxToApi(param);

}


/**
 * ポイント・クーポン適用
 *
 */
function applyPointCoupon(element) {

    var successFunction = function(data, messages) {
        if (messages.errorMessages.length === 0 && messages.warningMessages.length === 0) {
            var url = settings.context + settings.servletMapping + "/order/payment/";
            location.assign(url);
        } else {
            $("#confirmCouponArea").html("");

            if (messages.warningMessages.length > 0) {
                $("input[name=selectCouponManagementCode]:eq(0)").prop("checked", true);
                $("input[name=pointUseType]:eq(2)").prop("checked", true);
                $("#couponType").val("");
                $("#confirmCouponCode").val("");
                $("#inputUsePoint").val("");
            }
        }
    };

    var parameters = createBaseParametersForAjaxApi("order", "payment", "apply");

    var functions = createAjaxFunctions(null, null, successFunction);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : "/order/payment/apply/",
        formId : "paymentForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

/**
 * カード登録
 */
function sendRegistCardRequest(element) {

    $("input[name='deliveryAppoint']").val([ "1" ]);

    var methodCode = $(element).data("methodcode");

    $("input[name='paymentMethodCode']").val([ methodCode ]);

    var uri = "/order/payment/register_card/";
    var parameters = createBaseParametersForAjaxApi("order", "payment", "register_card");
    parameters.registCardMethodCode = methodCode;

    var param = {
        parameters : parameters,
        uri : uri,
        formId : "paymentForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

function changeCouponType(couponType) {
    $("#couponType").val(couponType);
}

/**
 * カード選択時のイベント処理
 */
function toggleCardInfo(isShow, areaId, parentId, paymentMethoCode) {

    var paymentMethodArea = $("#" + areaId);

    // カード名義人の入力フィールド表示制御
    paymentMethodArea.find(".inputCardholderNameArea").hide().find("input[type='text']").attr("name", "");
    var checkedRadio = paymentMethodArea.find("input[name^='savedCardId_']:checked");
    var inputCardholderName = checkedRadio.closest("div").find(".inputCardholderNameArea");
    inputCardholderName.show("fast").find("input[type='text']").attr("name", "cardholderName_" + paymentMethoCode);

    // 通常カードチェックボックス表示
    paymentMethodArea.find(".defaultCardCheckbox").hide().find("input[type='checkbox']").attr("name", "");
    var checkedRadio = paymentMethodArea.find("input[name^='savedCardId_']:checked");
    var defaultCardCheckBox = checkedRadio.closest("div").find(".defaultCardCheckbox");
    defaultCardCheckBox.show("fast").find("input[type='checkbox']").attr("name", "defaultCard_" + paymentMethoCode);

    // 決済時にカード登録チェックボックス表示制御
    var saveNewCardCheckbox = paymentMethodArea.find(".saveNewCardCheckbox");
    if (checkedRadio.hasClass("savedCard")) {
        saveNewCardCheckbox.hide("fast");
    } else {
        saveNewCardCheckbox.show("fast");
    }

    // 新規カード登録エリア設定
    var newCardInfoArea = paymentMethodArea.find(".newCardInfoArea");
    if (isShow) {
        newCardInfoArea.find(".newCardInfoInputArea").show("fast");
    } else {
        newCardInfoArea.find(".newCardInfoInputArea").hide("fast");
    }
}

/**
 * 通常カード選択時のイベント処理
 */
function defaultCardFunc(element) {
    if ($(element).is(":checked")) {
        $(element).closest(".creditcardMainArea").find(".saveNewCardCheckbox input").prop("checked", true);
    }
}


function sendPaymentBackRequest(url, element) {
	var parameters = createBaseParametersForAjaxApi("order", "payment", "back");
	parameters.url = url;
	var param = {
		parameters: parameters,
		uri: "/order/payment/back/",
		dataType: "json",
		async: false,
		element: element
	}
	sendAjaxToApi(param);
}