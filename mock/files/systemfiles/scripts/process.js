var loadingTimer;

var processing = false;

jQuery.extend({
    stringify : function stringify(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string")
                obj = '"' + obj + '"';
            return String(obj);
        } else {
            // recurse array or object
            var v, json = [], arr = (obj && obj.constructor == Array);

            for ( var n in obj) {
                v = obj[n];
                t = typeof (v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string")
                        v = '"' + v + '"';
                    else if (t == "object" && v !== null)
                        v = jQuery.stringify(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }
});

$.ajaxSetup({
    cache : false
});

/**
 * 次のURLに遷移
 *
 * @param nextUrl
 */
function dispatchUrl(nextUrl, messageType, element) {

    if (nextUrl.lastIndexOf(settings.context + settings.apiServ, 0) === 0) {
        nextUrl = nextUrl.substring(settings.context.length + settings.apiServ.length);
        
        var param = {
            uri : nextUrl,
            parameter : {},
            dataType : "json",
            element : element,
            messageType : messageType,
            async : true
        }
        sendAjaxToApi(param);
        return;
    }

    var url = nextUrl.split("?")[0];
    if (url.lastIndexOf(settings.context + settings.servletMapping + "/catalog/list/", 0) === 0) {
        sendRequestToFront(nextUrl, false);
    } else {
        window.location = createWovnHref(nextUrl);
    }
}

/**
 * function for send request.
 *
 * @param url
 *            Url for request.
 * @param post
 *            You should set true if you want to use post method, and should set
 *            false otherwise.
 * @param formId
 *            From id.
 * @param parameters
 *            Assosiation array.
 */
function sendRequestToFront(url, post, formId, parameters) {

    processing = true;

    blockDoubleClick("blockDoubleClick");

    var processKind = url.split("/")[1];
    var requestUrl;

    if (url.lastIndexOf(settings.context, 0) === 0) {
        requestUrl = url;
    } else if ($.inArray(processKind, commonSettings.shortUrlGroup) >= 0) {
        requestUrl = settings.context + url;
    } else {
        requestUrl = settings.context + settings.servletMapping + url;
    }

    if (!post && !formId && !parameters) {
        location.assign(requestUrl);
        return;
    }

    var sendForm = getFormElement(formId);
    sendForm.attr("action", requestUrl);
    if (parameters) {
        if (post) {
            parameters = addRequiredParameter(parameters);
        }
        addChildeHiddenElement(sendForm, parameters);
    }
    if (post) {
        sendForm.attr("method", "post");
    } else {
        sendForm.attr("method", "get");
        sendForm.find('input[name="transactionToken"]').remove();
        sendForm.find('input[name="packageId"]').remove();
        sendForm.find('input[name="beanId"]').remove();
        sendForm.find('input[name="actionId"]').remove();
    }
    if (sendForm.hasClass("getFormElement")) {
        sendForm.appendTo(document.body);
    }
    if ($.mobile) {
        sendForm.attr("data-ajax", false);
        sendForm.attr("rel", "external");
    }
    sendForm.submit();

    return;
}

function addRequiredParameter(parameters) {
    if ($("#transactionToken")[0]) {
        if (!parameters) {
            parameters = {
                "transactionToken" : $("#transactionToken").val()
            }
        } else if (!parameters.transactionToken) {
            parameters.transactionToken = $("#transactionToken").val();
        }
    }

    return parameters;
}

/**
 * paramには以下を設定してください。
 *
 * <pre>
 * parameters   :リクエストに必要なパラメータ
 * functions    :リクエスト実行前、実行後、完了後に実行するファンクション
 * url          :リクエストurl
 * formId       :リクエストに必要なformタグのID
 * dataType     :json
 * async        :非同期の場合はtrue
 * skipComplete :リクエスト完了後の処理をスキップする場合はtrue
 * messageType  :メッセージの表示タイプを次の中から指定する。document(デフォルト)/popup/addcart
 * </pre>
 *
 * @param param
 */
function sendAjaxToApi(param) {

    var button = $(param.element).data("button");
    if (button) {
        setTimeout(function() {
            $("input[data-button=" + button + "]").prop("disabled", true);
        }, 50);
    }
    
    processing = true;

    var $form = getFormElement(param.formId);

    parameters = addRequiredParameter(param.parameters);
    addChildeHiddenElement($form, parameters);

    var sendUri = settings.context + settings.apiServ + param.uri;
    var nextUrl;

    if (!param.messageType) {
        param.messageType = "document";
    }

    var formData = removeAjaxParameters($form.serialize());

    $.ajax({
        url : sendUri,
        type : "POST",
        data : formData,
        dataType : param.dataType,
        async : param.async,
        headers : {
            "pragma" : "no-cache",
            "csrf-token" : getCookie("CSRF-TOKEN")
        },

        beforeSend : function(xhr, settings) {
            blockDoubleClick("blockDoubleClick");
            var beforeSendFunction;
            if (param.functions) {
                beforeSendFunction = param.functions["beforeSendFunction"];
            }
            if (beforeSendFunction) {
                beforeSendFunction(xhr, settings);
            }
        }
    }).done(function(data) {
        $("#blockDoubleClick").remove();
        var successFunction;
        if (param.functions) {
            successFunction = param.functions["successFunction"];
        }
        nextUrl = data.nextUrl;
        controlAjaxSuccess(data, successFunction, param.messageType, param.messageAdd, param.formId, param.element);
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        $("#blockDoubleClick").remove();
        controlAjaxError(XMLHttpRequest, textStatus, errorThrown);
        return false;
    }).always(function(xhr, settings) {
        if (param.skipComplete) {
            return false;
        }
    
        processing = false;
        if (button && !nextUrl) {
            setTimeout(function() {
                $("input[data-button=" + button + "]").prop("disabled", false);
            }, 50);
        }
    
        var completeFunction;
        if (param.functions) {
            completeFunction = param.functions["completeFunction"];
        }
        if (completeFunction) {
            completeFunction(xhr, settings);
        }
        removeChildeElement($form, param.parameters);
        logger.transport();
    });
}

function removeAjaxParameters(requestParameters) {

    var reg = 'cardNo[_0-9]*|securityCode[_0-9]*';

    if (requestParameters) {
        var params = requestParameters.split("&");
        $(params).each(function(index, obj) {
            var target = obj.split("=")[0];
            var regExp = new RegExp(reg, 'g');
            if (target.match(regExp)) {
                requestParameters = requestParameters.replace(obj, "").replace("&&", "&");
            }
        });
    }

    return requestParameters;
}

function controlAjaxSuccess(data, successFunction, messageType, messageAdd, formId, element) {

    var transactionToken = data.transactionToken;
    var $transactionToken = $("#transactionToken");
    if (transactionToken && $transactionToken) {
        $transactionToken.val(transactionToken);
    }

    var nextUrl = data.nextUrl;
    if (nextUrl != null && nextUrl != "") {
        dispatchUrl(nextUrl, messageType, element);
        return;
    }


    // メッセージ処理
    parceMessageArea(data, messageType, messageAdd, formId, element);


    if (successFunction) {
        successFunction(data.result, data.messages, data.html);
    }
}

function parceMessageArea(data, messageType, messageAdd, formId, element) {

    var messages = data.messages;
    var errors = messages.errorMessages;
    var warns = messages.warningMessages;
    var informations = messages.informationMessages;

    var existError = (errors && errors.length > 0);
    var existWarn = (warns && warns.length > 0);
    var existInformation = (informations && informations.length > 0);

    if (!existError && !existWarn && !existInformation) {
        return;
    }

    var $messageArea = $("#message");
    if ($messageArea.length === 0) {
        logger.error("Message area is undefined!");

    } else {

        if (!messageAdd) {
            $messageArea.empty();
        }

        var messageLength = 0;

        // エラーメッセージエリア作成（SP、PC共通）
        var $area = $("<div>");
        if (existError) {
            $area.addClass("errorBlock");
            for (var i = 0; i < errors.length; i++) {
                var errorMessage = $('<div>').addClass('errorMessage').text(errors[i]);
                $area.append(errorMessage);
                messageLength = messageLength + errors[i].length;
            }
        }
        if (existWarn) {
            $area.addClass("warningBlock");
            for (var i = 0; i < warns.length; i++) {
                var warningMessage = $('<div>').addClass('warningMessage').text(warns[i]);
                $area.append(warningMessage);
                messageLength = messageLength + warns[i].length;
            }
        }
        if (existInformation) {
            $area.addClass("informationBlock");
            for (var i = 0; i < informations.length; i++) {
                var informationMessage = $('<div>').addClass('informationMessage').text(informations[i]);
                $area.append(informationMessage);
                messageLength = messageLength + informations[i].length;
            }
        }

        $messageArea.append($area);

        if (messageType == "document") {
            $('html,body').animate({
                scrollTop : 0
            }, 'fast');
        }

        $messageArea.show();

    }

    if (messageType == "addcart") {
        showAddCartMessage(formId);
    }
    
    if ( messageType == "popup") {
        if ( !existError && !existWarn && existInformation ) {
          showMessageOnTheElement(messages,element);
        }
    }
}

/**
 * カート追加メッセージ処理
 */
function showAddCartMessage(formId) {

    // 規格一覧で購入確認後に、規格一覧を再popUp
    if (formId.startsWith("sku")) {
        pcPopup("skuListArea");
    }

    if ($.mobile) {
        return;
    }

    var $messageArea = $("#message");
    var $message = $messageArea.text();
    var $messageType = $messageArea.children().attr("class");

    $messageArea.hide();

    $addCartMessageArea = $(".addCartMessageArea");
    $addCartMessageArea.hide();
    $addCartMessageArea.find(".addCartMessage").empty();

    var $formArea = $("#" + formId);
    var $targetAddCartMessageArea;

    // formIdにより、カートメッセージ表示を切り分け
    if (formId.startsWith("favorite")) {
        // お気に入れ画面のメッセージ表示
        $targetAddCartMessageArea = $formArea.closest("tr").find(".addCartMessageArea");
        $targetAddCartMessageArea.css({
            "margin-top" : "35px",
            "right" : "inherit",
        });

    } else if (formId.startsWith("sku")) {
        // 規格一覧のメッセージ表示
        $targetAddCartMessageArea = $formArea.closest("tr").find(".addCartMessageArea");
        $targetAddCartMessageArea.css({
            "margin-top" : "40px",
        });

    } else if (formId.startsWith("catalog")) {

        // 商品一覧のメッセージ表示
        $targetAddCartMessageArea = $(".addCartMessageArea", $formArea);

        // 一覧がサムネイル式で表示のスタイル設定
        if ($("#imageModeArea").length > 0) {
            $targetAddCartMessageArea.css("bottom", "60px");
        }
    } else if (formId.startsWith("detailInfo")) {

        // 商品詳細のメッセージ表示
        $targetAddCartMessageArea = $formArea.closest("div").find(".addCartMessageArea");
    }

    // エラーの場合にカートリンクを表示しない
    $(".addCartMessage", $targetAddCartMessageArea).text($message);
    if ($messageType == "informationBlock") {
        // 成功
        $(".cartUrlButton", $targetAddCartMessageArea).show();
        $targetAddCartMessageArea.addClass("successAddCartMessage").fadeIn();
        $targetAddCartMessageArea.removeClass("errorAddCartMessage");

    } else {
        // エラー
        $(".cartUrlButton", $targetAddCartMessageArea).hide();
        $targetAddCartMessageArea.addClass("errorAddCartMessage").fadeIn();
        $targetAddCartMessageArea.removeClass("successAddCartMessage");
    }

    $(window).one('click', function() {
        $addCartMessageArea.fadeOut();
    });

}
/**
 * ポップアップメッセージ処理
 */
function showMessageOnTheElement( messages,element ) {
    
    if ($.mobile) {
        return;
    }

    var $messageArea = $("#message");
    $messageArea.hide();
    var html = "<div class='popMessageArea'>";
    html += "<div class='popMessage'>" + messages.informationMessages[0] + "</div>"
    html += "</div>";
    var messageArea = $(html);

    var left = $(element).offset().left;
    var windowWidth = $(window).width();
    var marginLeft = 0;
    if ( $(element).parent().children().length > 1 ) {
      var parentLeft = $(element).parent().offset().left;
      left = left - parentLeft;
    }
    
    if (windowWidth - left < 150) {
        marginLeft += message.length * 4;
        $(".triangle").css("margin-left", marginLeft)
    }

    var messageLeft = messageArea.offset().left;
    messageArea.css("margin-left", left - messageLeft - marginLeft );
    
    $(element).parent().first().append(messageArea);
    $(messageArea).fadeIn();
    $(window).one('click', function() {
        messageArea.fadeOut();
    });
}
function controlAjaxError(XMLHttpRequest, textStatus, errorThrown) {
    var status = XMLHttpRequest.status;
    var errorPageName = "";

    logger.debug("XMLHttpRequest : " + JSON.stringify(XMLHttpRequest));
    logger.debug("textStatus     : " + textStatus);
    logger.debug("errorThrown    : " + errorThrown.message);
    
    switch (status) {
    case 0:
        // 通信切断、もしくは時間以内に通信が帰ってこなかった場合に発生
        // エラーページへのリダイレクトは行わない
        logger.error("Ajax error: not connect.");
        return;
    case 404:
        logger.error("Ajax error: access failed error.");
        errorPageName = "access_failed_error";
        break;
    case 406:
        logger.error("Ajax error: invalid access.");
        errorPageName = "invalid_access";
        break;
    case 500:
        logger.error("Ajax error: system error.");
        errorPageName = "system_error";
        break;
    case 901:
        logger.error("Ajax error: catalog not found.");
        errorPageName = "catalog_not_found";
        break;
    default:
        logger.error("Ajax error: other error.");
        errorPageName = "error";
        break;
    }

    location.href = settings.context + settings.servletMapping + "/error/" + errorPageName + "/";
}

/**
 * formIdで指定されたformを取得します。formIdがnull又はブランクの場合はからのformを生成します。
 *
 * @param formId
 * @returns フォーム
 */
function getFormElement(formId) {

    var form;

    if (formId) {
        form = $("#" + formId);
    }

    if (formId == null) {
        form = $("<form/>");
        form.addClass("getFormElement");
    }

    return form;
}

/**
 * 指定されたformに子要素Hiddenを追加します。
 *
 * @param form
 * @param parameters
 *            連想配列{タグID:配置データ}
 */
function addChildeHiddenElement(form, parameters) {

    if (!form) {
        return;
    }

    if (parameters) {
        for (tagId in parameters) {

            if ($.isArray(parameters[tagId])) {
                for (var i = 0; i < parameters[tagId].length; i++) {
                    var input = $('<input/>');
                    input.attr("type", "hidden");
                    input.attr("name", tagId);
                    input.attr("class", tagId + i);
                    input.attr("value", parameters[tagId][i]);
                    form.append(input);
                }
            } else {
                var input = $('<input/>');
                input.attr("type", "hidden");
                input.attr("name", tagId);
                input.attr("class", tagId);
                input.attr("value", parameters[tagId]);
                form.append(input);
            }

        }
    }
}

/**
 * 指定されたformの子要素を削除します。
 *
 * @param form
 * @param parameters
 *            連想配列{タグID:配置データ}
 */
function removeChildeElement(form, parameters) {

    if (!form) {
        return;
    }

    if (parameters) {
        for (tagId in parameters) {

            if ($.isArray(parameters[tagId])) {
                for (var i = 0; i < parameters[tagId].length; i++) {
                    form.children("." + tagId + i).remove();
                }
            } else {
                form.children("." + tagId).remove();
            }

        }
    }
}

/**
 * parentDomの子孫要素から[data-attribute]が指定されているすべてのdomを取得し、値を設定します。
 *
 * @param bindDataToDom
 *            データを配置対象domの親dom
 * @param valueArray
 *            value
 */
function bindDataToDomDataAttribute(parentDom, valueArray) {

    if (!parentDom, !valueArray) {
        return;
    }

    var domArray = parentDom.find("[data-attribute]");

    for (i = 0; i < domArray.length; i++) {

        var dom = $(domArray[i]);

        var id = dom.attr("data-item");
        if (!id) {
            continue;
        }

        var value = valueArray[id];
        if (!value) {
            continue;
        }

        bindDataToDom(dom, value);
    }
}

/**
 * domから[data-attribute]属性を取得し、指定された方法で値を設定します。[data-escape]がfalseの場合以外はencode処理を実施します。
 *
 * @param dom
 *            データ配置対象dom
 * @param value
 *            value
 */
function bindDataToDom(dom, value) {

    if (!dom || !value) {
        return;
    }

    var escape = dom.data("escape");

    if (escape || escape === undefined) {
        value = encodeHtml(value);
    }

    var targetAttribute = dom.data("attribute");

    if ("html" === targetAttribute) {
        dom.html(value);
    } else {
        dom.attr(targetAttribute, value)
    }
}

function createBaseParametersForAjaxApi(packageId, beanid, actionId) {
    var parameters = {
        "packageId" : packageId,
        "beanId" : beanid,
        "actionId" : actionId
    };
    return parameters;
}

function createAjaxFunctions(beforeSendFunction, completeFunction, successFunction) {
    var functions = {
        "beforeSendFunction" : beforeSendFunction,
        "completeFunction" : completeFunction,
        "successFunction" : successFunction
    };
    return functions;
}

// 共通部品読み込み
$(document).on("unload",function() {

    logger.transport();
});

function getCookie(key) {
    var cookies = document.cookie.split(";");
    for (var i in cookies) {
        var cookie = cookies[i].split("=")
        if (key == cookie[0].trim()) {
            return cookie[1];
        }

    }
}

function createWovnHref(url) {
    if (!settings.isUseWovn) {
        return url;
    }
    var lang = getCookie('wovn_selected_lang');
    if (lang != null && settings.defaultLang != lang) {
        var param = '?wovn=en';
        if (url.indexOf('?') > -1) {
            param = '&wovn=' + lang;
        }
        return url + param;
    }
    return url;
}

function bindDataToDomDataAttributeAlt(parentDom, valueArray) {

    if (!parentDom, !valueArray) {
        return;
    }

    var domArray = parentDom.find("[data-attribute-alt]");

    for (i = 0; i < domArray.length; i++) {

        var dom = $(domArray[i]);

        var id = dom.attr("data-alt-item");
        if (!id) {
            continue;
        }

        var value = valueArray[id];
        if (!value) {
            continue;
        }

        if (!dom || !value) {
            return;
        }

        var targetAttribute = dom.data("attribute-alt");
        dom.attr(targetAttribute, value)

    }
}
