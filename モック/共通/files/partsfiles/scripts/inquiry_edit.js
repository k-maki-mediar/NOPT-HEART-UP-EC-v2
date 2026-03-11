$(document).ready(function() {
    $("input[type='text'],textarea").siValidation({});
    var element = document.querySelectorAll('option')
    var textLength = Math.floor(window.innerWidth / 20);
    element.forEach(option => {
        if (option.textContent.length > textLength) {
            option.textContent = option.textContent.substring(0, textLength) + '...';
        }
    })

});

// 入力内容確認画面遷移処理
function next(element) {

    var parameters = createBaseParametersForAjaxApi("customer", "inquiry_edit", "next");

    var param = {
        parameters : parameters,
        functions : null,
        uri : "/customer/inquiry_edit/next/",
        dataType : "json",
        formId : "inquiryForm",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}

// 前へ戻る処理
function backPage(str) {

    var backUrl = str;

    location.href = createWovnHref(settings.context + backUrl);
}
