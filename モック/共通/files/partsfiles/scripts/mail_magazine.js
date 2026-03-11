$(document).ready(function() {

    // リアルタイムバリデーション設定
    var inputList = $("#mailMagazineForm input[type='text']");
    inputList.siValidation({});
});

// チェックボックス全選択・解除
function checkAll() {
    var checkBoxList = $(".mailMagazineCheckBox");
    var button = $("#selectDeselectAll");
    if (checkBoxList.length > 0) {
        var checkType = button.data("checkType");
        if (checkType) {
            // すでにチェックされていたら外す
            checkBoxList.prop("checked", false);
            button.data("checkType", false);
            button.val("全選択");
        } else {
            checkBoxList.prop("checked", true);
            button.data("checkType", true);
            button.val("全解除");
        }
    }

}

function clickMagazine(mailMagazineCode, event) {
    var checkBoxList = $(".mailMagazineCheckBox");

    var button = $("#selectDeselectAll");
    var checkedCount = 0;
    var uncheckCount = 0;
    var $target = $(event.target || event.srcElement);

    if ($target.attr("type") != "checkbox") {

        for (var i = 0; i < checkBoxList.length; i++) {

            if (checkBoxList[i].value == mailMagazineCode) {

                if (checkBoxList[i].checked) {

                    checkBoxList[i].checked = false;
                } else {
                    checkBoxList[i].checked = true;
                }
            }
        }
    }

    for (var i = 0; i < checkBoxList.length; i++) {
        if (checkBoxList[i].checked) {
            checkedCount++;
        } else {
            uncheckCount++;
        }
    }

    if (checkedCount == checkBoxList.length) {
        button.data("checkType", true);
        button.val("全解除");
    } else if (uncheckCount == checkBoxList.length) {
        button.data("checkType", false);
        button.val("全選択");
    }
    return;
}

// 配信登録・停止
function request(actionName, element) {

    var parameters = createBaseParametersForAjaxApi("customer", "mail_magazine", "request");
    parameters.actionName = actionName;

    var param = {
        parameters : parameters,
        uri : "/customer/mail_magazine/request/",
        formId : "mailMagazineForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

// 配信確認
function confirm(element) {

    var parameters = createBaseParametersForAjaxApi("customer", "mail_magazine", "confirm");

    var param = {
        parameters : parameters,
        uri : "/customer/mail_magazine/request/",
        formId : "mailMagazineForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}
