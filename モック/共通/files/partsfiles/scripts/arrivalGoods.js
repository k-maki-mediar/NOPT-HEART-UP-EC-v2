function arrivalGoodsRegister(formId, element) {
    var parameters = createBaseParametersForAjaxApi("catalog", "arrival_goods", "register");

    // LightBoxを閉じる
    var completeFunction = function() {
        $("#arrivalGoodsArea").hide();
        $(".js_lb_overlay").remove();
    }

    var param = {
        parameters : parameters,
        functions : createAjaxFunctions(null, completeFunction, null),
        formId : formId,
        uri : "/catalog/arrival_goods/register/",
        dataType : "json",
        async : true,
        element : element
    }
    sendAjaxToApi(param);
}
