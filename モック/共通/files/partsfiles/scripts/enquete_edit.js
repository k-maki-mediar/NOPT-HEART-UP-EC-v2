$(document).ready(function() {
    var element = document.querySelectorAll('option')
    var textLength = Math.floor(window.innerWidth / 20);
    element.forEach(option => {
        if (option.textContent.length > textLength) {
            option.textContent = option.textContent.substring(0, textLength) + '...';
        }
    })
});

function next(enqueteEditForm, element) {

    var parameters = createBaseParametersForAjaxApi("order", "enquete_edit", "register");

    var param = {
        parameters : parameters,
        uri : "/order/enquete_edit/register/",
        formId : "enqueteEditForm",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}
