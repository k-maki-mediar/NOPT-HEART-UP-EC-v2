$(document).ready(function() {
    manageSession();
});

function manageSession(){

    var location = window.location;
    var accessSet = analyzeAccessSet(location.toString());
    var packageId = accessSet.packageId;
    var beanId = accessSet.beanId;
    var actionId = "init";

    var sessionTimeout = settings.sessionTimeout * 60 * 1000;
    var timer = settings.sessionTimer * 60 * 1000;
    
    var url = location.pathname;
    var frontContext = settings.context;
    var servletMapping = settings.servletMapping;
    var sessionUrlList = settings.sessionUrl;
    var urlList = []
    for(var i = 0; i < sessionUrlList.length; i++) {
        urlList.push(frontContext + servletMapping + sessionUrlList[i]);
    }
    
    if (!urlList.includes(url)) {
        return;
    }
    
     // セッションアラートタイマーを設定
    setTimeout(showAlert, sessionTimeout - timer);
    
    var parameters = createBaseParametersForAjaxApi(packageId, beanId, actionId);
    var functions = createAjaxFunctions(null, null, null);
    var param = {
        parameters : parameters,
        functions : functions,
        uri : "/" + packageId + "/" + beanId + "/",
        dataType : "json",
        messageType : "popup",
        async : true,
    }
    
    // のしリストまたはギフトリストポップアップが表示されている場合の処理
    if ($("#noshiListArea").length && ($("#noshiListArea").css('display') != 'none' || $("#giftListArea").css('display') != 'none')) {
        functions = createAjaxFunctions(null, null, pageReload);
        param.functions = functions;
        sendAjaxToApi(param);
    }
    
    // 複数お届け先設定画面向けのパラメータ書き換え
    if (url.includes("/front/app/order/shipping_multi/")) {
        parameters = createBaseParametersForAjaxApi("order", "shipping", "move");
        parameters.requestPattern = "move_multi";
        param.parameters = parameters;
    } else if(url.includes("/front/app/order/shipping_split/")) {
        parameters = createBaseParametersForAjaxApi("order", "shipping", "move");
        parameters.requestPattern = "move_split";
        param.parameters = parameters; 
    }
    
    function showAlert() {
        if (confirm('このセッションはあと' + settings.sessionTimer +'分で終了します。延長しますか？')) {
            sendAjaxToApi(param);
            manageSession();
        } else {
        }
    }
}

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
