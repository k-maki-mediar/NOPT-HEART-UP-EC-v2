$(function() {

    replaceWithBr();
});

/*
 * 処理中の場合はEnter無効 F5無効追加の場合はキーコードの条件に116を追加してください。
 */
$(function() {
    window.document.onkeydown = function(e) {
        if (((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) && processing) {
            return false;
        } else {
            return true;
        }
    }
});
/**
 * short url group.
 */
var commonSettings = {
    shortUrlGroup : [ "commodity", "category", "campaign", "brand" ],
    siteCode : settings.siteShopCode,
    logLevel : "debug"
}

/**
 * Common preview objects.
 */
var previewFunctionList = new Array();

/**
 * Final execute function list.
 */
var finalFunctionList = new Array();

// 12.16.0_12997_del

/**
 * Actionの情報＋CallBack等のAction全体を表すクラス
 */
var Action = function(packageId, beanId, actionId, callback) {
    this.actionInfo = new ActionInfo(packageId, beanId, actionId);
    this.callback = callback;
};

var ActionInfo = function(packageId, beanId, actionId) {
    this.packageId = packageId;
    this.beanId = beanId;
    this.actionId = actionId;
};

var actionList = new Array();

// 12.16.0_12997_del

/** パーツの初期化functionList */
var partsInitializeList = new Array();

function analyzeUrlParameter(location) {
    var arg = new Object;
    var pair = location.search.substring(1).split('&');
    for (var i = 0; pair[i]; i++) {
        var kv = pair[i].split('=');
        arg[kv[0]] = kv[1];
    }
    return arg;
}

var AccessSet = function() {
    this.packageId = "";
    this.actionId = "";
    this.beanId = "";
    this.shortUrlId = "";
    this.otherPathInfo = new Array();
};

// 共通関数系

/**
 * URLを解析する
 *
 * @param url
 * @returns {___accessSet0}
 */
function analyzeAccessSet(url) {
    var path = url.substring(url.indexOf(settings.servletMapping + "/") + settings.servletMapping.length + 1).replace(/\?.*$/,"");
    var paths = path.split("/");
    var accessSet = new AccessSet();

    var baseIndex = 0;
    if (url.indexOf(settings.servletMapping + "/") != -1) {
        if (paths.length > baseIndex) {
            accessSet.packageId = paths[baseIndex];
            log("AnalyzeAccessSet-packageId : " + accessSet.packageId);
            baseIndex++;
        }
        if (paths.length > baseIndex) {
            accessSet.beanId = paths[baseIndex];
            log("AnalyzeAccessSet-beanId : " + accessSet.beanId);
            baseIndex++;
        }
    } else {
        // shortUrlFilterを使われている場合は、baseIndexをfrontが見つかるまでカウントする
        for (var i = 0; i < paths.length; i++) {
            if (("/" + paths[i]) == settings.context) {
                break;
            }
            baseIndex++;
        }
        // front分＋shortUrl識別キー分＋する
        baseIndex += 2;
        accessSet.shortUrlId = paths[baseIndex - 1];
    }
    for (var i = baseIndex; i < paths.length; i++) {
        var info = paths[i];
        if (info != "") {
            // log("AnalyzeAccessSet-other index[" + (i - baseIndex + 1) + "] :
            // " + info);
            accessSet.otherPathInfo.push(info);
        }
    }
    return accessSet;
}

/**
 * ユーザエージェント判別
 */
var _ua = (function(u){
    return {
      Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1)
        || u.indexOf("ipad") != -1
        || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
        || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
        || u.indexOf("kindle") != -1
        || u.indexOf("silk") != -1
        || u.indexOf("playbook") != -1,
      Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
        || u.indexOf("iphone") != -1
        || u.indexOf("ipod") != -1
        || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
        || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
        || u.indexOf("blackberry") != -1
    }
  })(window.navigator.userAgent.toLowerCase());

/**
 *
 */
var fillCommodityAmount = function(target, max) {
    if (!target) {
        return;
    }

    $(target).empty();
    if (!max) {
        max = 99;
    }

    var optionFmt = "<option value=\"{0}\">{0}</option>";
    for (var i = 1; i <= max; i++) {
        $(target).append(optionFmt.format(i));
    }
};

// 12.16.0_12997_del

// Mockup_V12.18_add_start
function getPostalResultJson() {
    var jsonStr = "";
  
    jsonStr += "(";
    jsonStr += '{';
    jsonStr += '"address":{';
    jsonStr += '"postalCode":"3306032",';
    jsonStr += '"prefecture":"埼玉県",';
    jsonStr += '"prefectureCode":"11",';
    jsonStr += '"city":"さいたま市中央区",';
    jsonStr += '"address":"新都心明治安田生命さいたま新都心ビル"';
    jsonStr += '},';
    jsonStr += '"sessionContainer":null';
    jsonStr += '}';
    jsonStr += ')';

    return eval(jsonStr);
  }

  function scrollTopMock() {
    $('html,body').animate({
        scrollTop : 0
    }, 'fast');
  }
// Mockup_V12.18_add_end

/**
 * 住所を表すオブジェクト
 */
var PostalAddress = function(postalCodeId, postalGuideId, prefectureCodeId, cityId, addressId, prefectureNameId) {
    this.postalCodeId = postalCodeId;
    this.postalGuideId = postalGuideId;
    this.prefectureCodeId = prefectureCodeId;
    this.cityId = cityId;
    this.addressId = addressId;
    this.prefectureNameId = prefectureNameId;
};

PostalAddress.prototype = {
    setPostalValue : function(postalId, postalValue) {
        if (postalId) {
            var element = $("#" + postalId);
            element.val(postalValue);
            if (element.data("placed") == "true") {
                element.css('color', element.data('placeholder-color'));
                element.data("placed", "false");
            }
        }
    },
    setPostalGuideInfo : function(guideHtml) {
        if (this.postalGuideId) {
            $("#" + this.postalGuideId).html(guideHtml);
        }
    }
};

/**
 * 郵便番号検索
 */
function sendPostalSearchRequest(postalCodeId, postalGuideId, prefectureCodeId, cityId, addressId, prefectureNameId, displayLoading) {

    var parameters = createBaseParametersForAjaxApi("customer", "postal", "search");

    var postalAddress = new PostalAddress(postalCodeId, postalGuideId, prefectureCodeId, cityId, addressId, prefectureNameId);
    var postalCodeElement = $("#" + postalAddress.postalCodeId);
    if (postalCodeElement.data("placed") == "true") {
        parameters.postalCode = "";
    } else {
        parameters.postalCode = postalCodeElement.val();
    }
    // SourceCode_V12.18_add_start
    // var postalSearchCallback = function(data, messages, parameter) {
	// SourceCode_V12.18_add_end
		var data = getPostalResultJson();
        if (!data.address) {
            postalAddress.setPostalGuideInfo(message.noFoundPostal);
            return;
        }
        var resultAddress = data.address;
        postalAddress.setPostalValue(postalAddress.prefectureNameId, resultAddress.prefecture);
        postalAddress.setPostalValue(postalAddress.prefectureCodeId, resultAddress.prefectureCode);
        postalAddress.setPostalValue(postalAddress.cityId, resultAddress.city);
        postalAddress.setPostalValue(postalAddress.addressId, resultAddress.address);
        postalAddress.setPostalGuideInfo(message.postalSearchCaution);
    // SourceCode_V12.18_add_start
	// };

    // var loadingFmt = "<img src=\"{0}\" width=\"16\" height=\"16\">　検索しています...";
    // postalAddress.setPostalGuideInfo(loadingFmt.format(images.smallLoading));
    // var functions = createAjaxFunctions(null, null, postalSearchCallback);

    // var param = {
        // parameters : parameters,
        // functions : functions,
        // uri : "/customer/postal/search/",
        // dataType : "json",
        // async : true
    // }
    // sendAjaxToApi(param);
	// SourceCode_V12.18_add_end
}

// 12.16.0_12997_del

/**
 * ログのハンドリング処理
 */
var Logger = function() {
    this.errors = new Array();
    this.debugs = new Array();
}

Logger.prototype = {
    error : function(message) {
        this.errors.push(message);
        try {
            if ('console' in window) {
                console.error("[WS_ERROR]" + message);
            }
        } catch (e) {
        }
    },
    debug : function(message) {
        if (commonSettings.logLevel === "debug") {
            this.debugs.push(message);
        }
        if ('console' in window) {
            console.log(message);
        }
    },
    transport : function() {
        // Ajaxでログを転送
        if (logger.errors.length <= 0) {
            return;
        }

        var param = {
            errorLogs : logger.errors,
            debugLogs : logger.debugs,
            browser : $.stringify($.support)
        };
        $.ajax({
            ifModified : true,
            type : "POST",
            url : settings.apiContext + settings.logServ,
            dataType : "json",
            data : param,
            headers : {
                "pragma" : "no-cache"
            },
            complete : function(event) {
            }
        });
        this.errors = new Array();
        this.debugs = new Array();
    }
}
var logger = new Logger();

window.onerror = function(message, url, lineNo) {
    logger.error(url + " : " + lineNo + " : " + message);
    // windowのエラーは処理が中断されるため、ためずに送信する
    logger.transport();
}
$.error = function(message) {
    // jQueryのエラーは処理が中断されるため、ためずに送信する
    logger.error(message);
}
function log(message) {
    if (typeof console != 'undefined') {
        logger.debug("[WS_LOG]:" + message);
    }
}

// 12.16.0_12997_del

function changedate(namebase) {
    // フォームと各年月日のname属性を指定
    var tYear = document.getElementsByName(namebase + "_year")[0];
    var tMonth = document.getElementsByName(namebase + "_month")[0];
    var tDays = document.getElementsByName(namebase + "_day")[0];

    var selectY = tYear.options[tYear.selectedIndex].value;
    var selectM = tMonth.options[tMonth.selectedIndex].value;
    var selectD = tDays.options[tDays.selectedIndex].value;

    var dateObj = new Date(selectY, selectM, 0);

    tDays.length = 0;

    // 選択された月によって、日のオプションを生成
    for (var i = 1; i <= dateObj.getDate(); i++) {
        var name = "" + i;
        var value = i > 9 ? "" + i : "0" + i;
        tDays.options[i - 1] = new Option(name, value);
    }

    if (selectD.indexOf("0") == 0) {
        selectD = selectD.substring(1, 2);
    }
    if (selectD > tDays.length) {
        tDays.options[0].selected = true;
    } else {
        tDays.options[selectD - 1].selected = true;
    }
}

function blockDoubleClick(id) {

    var style;
    if (!$.support.opacity) {
        style = "-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(opacity=0)'; top:0; opacity:0;";
    } else {
        style = "background-color:rgba(255, 255, 255, 0.0); top:0;";
    }

    if ($.mobile) {
        style = style + " height: " + $(document).height() + "px";
    }

    var blockFmt = "<div id=\"{0}\" class=\"blockDoubleClick\" style=\"{1}\" ></div>";

    $("body").after(blockFmt.format(id, style));
}

/**
 * 規格名作成
 *
 * @param targetRoot
 */
function scanStandardName(targetRoot) {
    var stndNameFmt = "<span class='standardDetailName'>({0}{1}{2})</span>";

    var standardDetail1Name;
    if (targetRoot) {
        standardDetail1Name = $(targetRoot).find("span.standardDetail1Name");
    } else {
        standardDetail1Name = $("span.standardDetail1Name");
    }

    $(standardDetail1Name).each(function(i) {
        var stndName1 = $(this).html();
        var stndName2 = $(this).next("span.standardDetail2Name").html();
        if (stndName1 && stndName2) {
            $(this).next("span.standardDetail2Name").remove();
            $(this).replaceWith(stndNameFmt.format(stndName1, "/", stndName2));
        } else if (stndName1 || stndName2) {
            $(this).next("span.standardDetail2Name").remove();
            $(this).replaceWith(stndNameFmt.format(stndName1, "", stndName2));
        }
    });
}

// 12.16.0_12997_del

/**
 * レンダリング
 */
var CellRenderContainer = function(data) {
    this.cellRenderList = new Array();
    this._init(data);
};

CellRenderContainer.prototype = {
    _init : function(data) {
        this.data = data;
    },
    push : function(cellRender) {
        this.cellRenderList.push(cellRender);
    },
    draw : function() {
        for (var i = 0; i < this.cellRenderList.length; i++) {
            var cellRender = this.cellRenderList[i];
            cellRender.data = this.data;
            cellRender.execute();
        }
    }
};

var CellRender = function(data, targetDom, callBack) {
    if (callBack) {
        this.data = data;
        this.targetDom = targetDom;
        this.callBack = callBack;
    } else {
        this.targetDom = data;
        this.callBack = targetDom;
    }
    this.execute = function() {
        for (var i = 0; i < this.targetDom.length; i++) {
            var target = this.targetDom[i];
            this.callBack(this.data, $(target), i);
        }
    };
};

/**
 * 文字フォーマット
 */
String.prototype.format = function() {
    var result = this;

    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{\s*" + i + "\s*\\}", "g");
        result = result.replace(reg, arguments[i]);
    }

    return result;
};

/**
 * 開始文字チェック
 */
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.substring(0, str.length) == str;
    };
}

/**
 * 結末文字チェック
 */
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function(str) {
        return this.substring(this.length - str.length, this.length) == str;
    };
}

/**
 * 日付フォーマット処理
 */
var DateFormat = function(pattern) {
    this._init(pattern);
};

DateFormat.prototype = {
    _init : function(pattern) {

        this.pattern = pattern;
        this._patterns = [];

        for (var i = 0; i < pattern.length; i++) {
            var ch = pattern.charAt(i);
            if (this._patterns.length == 0) {
                this._patterns[0] = ch;
            } else {
                var index = this._patterns.length - 1;
                if (this._patterns[index].charAt(0) == "'") {
                    if (this._patterns[index].length == 1 || this._patterns[index].charAt(this._patterns[index].length - 1) != "'") {
                        this._patterns[index] += ch;
                    } else {
                        this._patterns[index + 1] = ch;
                    }
                } else if (this._patterns[index].charAt(0) == ch) {
                    this._patterns[index] += ch;
                } else {
                    this._patterns[index + 1] = ch;
                }
            }
        }
    },

    format : function(date) {

        var result = [];
        for (var i = 0; i < this._patterns.length; i++) {
            result[i] = this._formatWord(date, this._patterns[i]);
        }
        return result.join('');
    },
    _formatWord : function(date, pattern) {

        var formatter = this._formatter[pattern.charAt(0)];
        if (formatter) {
            return formatter.apply(this, [ date, pattern ]);
        } else {
            return pattern;
        }
    },
    _formatter : {
        "y" : function(date, pattern) {
            // Year
            var year = String(date.getFullYear());
            if (pattern.length <= 2) {
                year = year.substring(2, 4);
            } else {
                year = this._zeroPadding(year, pattern.length);
            }
            return year;
        },
        "M" : function(date, pattern) {
            // Month in year
            return this._zeroPadding(String(date.getMonth() + 1), pattern.length);
        },
        "d" : function(date, pattern) {
            // Day in month
            return this._zeroPadding(String(date.getDate()), pattern.length);
        },
        "H" : function(date, pattern) {
            // Hour in day (0-23)
            return this._zeroPadding(String(date.getHours()), pattern.length);
        },
        "m" : function(date, pattern) {
            // Minute in hour
            return this._zeroPadding(String(date.getMinutes()), pattern.length);
        },
        "s" : function(date, pattern) {
            // Second in minute
            return this._zeroPadding(String(date.getSeconds()), pattern.length);
        },
        "S" : function(date, pattern) {
            // Millisecond
            return this._zeroPadding(String(date.getMilliseconds()), pattern.length);
        },
        "'" : function(date, pattern) {
            // escape
            if (pattern == "''") {
                return "'";
            } else {
                return pattern.replace(/'/g, '');
            }
        }
    },

    _zeroPadding : function(str, length) {
        if (str.length >= length) {
            return str;
        }

        return new Array(length - str.length + 1).join("0") + str;
    }
};

/**
 * WebShopping用serializeArray
 */
var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
    siSerializeArray : function() {
        return this.map(function() {
            return this.elements ? jQuery.makeArray(this.elements) : this;
        }).filter(function() {
            return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
        }).filter(function() {
            // Listのtemplate情報は除去
            var parent = $(this).parents(".listTemplate");
            return !(parent) || parent.length <= 0;
        }).map(function(i, elem) {
            var val = jQuery(this).val();
            // placeholderが有効なら処理を必要としないので終了
            if (!('placeholder' in document.createElement('input'))) {
                if (!($(this).data("placed") === undefined || $(this).data("placed") === "false")) {
                    val = "";
                }
            }
            log(val);

            return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function(val, i) {
                return {
                    name : elem.name,
                    value : val.replace(rCRLF, "\r\n")
                };
            }) : {
                name : elem.name,
                value : val.replace(rCRLF, "\r\n")
            };
        }).get();
    }
});

/**
 * 改行コードを<br />
 * に変換
 */
function encodeHtml(value) {
    var domData = $('<div>').text(value).html();
    return domData.replace(rCRLF, "<br />");
}

/**
 * 画面が初期表示時に、クラス属性が「replaceWithBr」のDomを取得し、改行コードを<br />
 * に変換
 */
function replaceWithBr() {

    $(".replaceWithBr").each(function() {
        $(this).html(encodeHtml($(this).text()));
    });
}

/**
 * elementの文字数を指定したサイズで切り捨てる
 */
function toHeadelineValue(element, maxline, lineSize) {
    var orgVal = $(element).html();
    if (!orgVal) {
        return false;
    }
    var resultVal = "";
    var splitedVal = orgVal.split(/<br[^>]*>/gi);
    var toShorten = false;
    for (var i = 0, line = 0; i < splitedVal.length; i++, line++) {
        var val = splitedVal[i];
        if (line >= maxline) {
            toShorten = true;
            break;
        } else if (i != 0) {
            resultVal += "<br/>";
        }
        // 追加可能な文字数
        var addabaleSize = (maxline * lineSize) - (line * lineSize);
        if (val.length > addabaleSize) {
            // 足そうとした文字列がはみ出す場合
            val = val.substring(0, addabaleSize - 1);
            toShorten = true;
        }
        resultVal += val;
        if (val.length > lineSize) {
            line += parseInt(val.length / lineSize);
        }
    }
    if (toShorten) {
        resultVal += "...";
    }
    $(element).html(resultVal);

    return toShorten;
}

// 12.16.0_12997_del

/**
 * jQueryのhoverにdataを渡せるようにしたもの
 */
(function($) {
    $.fn.siHover = function(data, on, out) {
        $(this).hover(function(event) {
            on(event, data, this);
        }, function(event) {
            out(event, data, this);
        });
    };
})(jQuery);

/*******************************************************************************
 * 商品共通
 ******************************************************************************/
/**
 * セット品の有効在庫数の計算
 *
 * セット構成品に規格商品がある場合、規格を選択毎に在庫数の変更が必要になる。
 * 在庫数のパターンが膨大になる可能性があり、リクエストを投げるほどの処理でないためjavascriptにて計算。
 *
 * 同一構成品でセット品を組んだ場合、1つのセット品購入で構成品の在庫が2減る。
 *
 */
function computeAvailableStockOfSetCatalog(orgSelectSkuDataList) {

    // 同一商品(同一skuCode)ごとにまとめる
    var newSelectDataList = groupSameSkuData(orgSelectSkuDataList);
    var availableStockQuantity;

    for (var i = 0; i < newSelectDataList.length; i++) {

        var skuData = newSelectDataList[i].skuData;
        var quantity = Number.MAX_VALUE;

        // 在庫がない場合
        if (!skuData.hasStock) {
            return 0;
        }

        // 在庫管理しない場合
        if (skuData.hasStock && skuData.availableStockQuantity == 0) {
            continue;
        }

        // 有効在庫数 / セット品に含まれるそのSKUコードの個数
        quantity = Number(skuData.availableStockQuantity) / Number(newSelectDataList[i].itemCount);

        if (quantity < 1) {
            return 0;
        }

        // 最小値を採用する
        if (!availableStockQuantity || Number(availableStockQuantity) > quantity) {
            // 小数点以下は切り捨て
            availableStockQuantity = Math.floor(quantity);
        }
    }

    return availableStockQuantity;
}

function groupSameSkuData(selectSkuDataList) {
    var skuDataList = new Array();

    for (i = 0; i < selectSkuDataList.length; i++) {

        var selectSkuData = selectSkuDataList[i];
        if (!selectSkuData.skuCode) {
            continue;
        }

        var skuData = {
            skuCode : "",
            itemCount : 0,
            skuData : ""
        };

        var sameFlag = false;
        for (j = 0; j < skuDataList.length; j++) {
            if (selectSkuData.skuCode == skuDataList[j].skuCode) {
                skuDataList[j].itemCount += 1;
                sameFlag = true;
                break;
            }
        }

        if (!sameFlag) {
            skuData.skuCode = selectSkuData.skuCode;
            skuData.itemCount = 1;
            skuData.skuData = selectSkuData;
            skuDataList.push(skuData);
        }

    }

    return skuDataList;
}

/**
 * 注文上限数の比較
 */
function compareLimitOrderQuantity(limitOrderQuantity, availableStockQuantity, oneshotOrderLimit) {
    var limitQuantity = Number.MAX_VALUE;
    if (!oneshotOrderLimit) {
        oneshotOrderLimit = Number.MAX_VALUE;
    }
    if (!availableStockQuantity) {
        availableStockQuantity = Number.MAX_VALUE;
    }

    if (Number(availableStockQuantity) < Number(oneshotOrderLimit)) {
        limitQuantity = availableStockQuantity;
    } else if (Number(availableStockQuantity) > Number(oneshotOrderLimit)) {
        limitQuantity = oneshotOrderLimit;
    }

    if (Number(limitOrderQuantity) > Number(limitQuantity)) {
        limitOrderQuantity = limitQuantity;
    }

    return limitOrderQuantity;
}

// 12.16.0_12997_del

/**
 * パンくずリストを作成する。
 */
function initializeTopicPath(topicPathList) {

    var topicPathArea = $("#topicPath");
    var relAttribute = "";
    if ($.mobile) {
        relAttribute = " rel=\"external\" ";
    }
    // SourceCode_v12.18_add_start
	// var topicPathUrlFmt = "javascript:topicPathMove(\"{0}\")";
	// SourceCode_v12.18_add_end
    
	// Mockup_V12.18_add_start
    var topicPathUrlFmt = "javascript:move(\"{0}\")";
    // Mockup_V12.18_add_end
	
    var moveTopPageFmt = "javascript:moveTopPage()";

    var html = "<a href=" + moveTopPageFmt.format("") + " id=\"topicPathLinkTop\">" + message.topPage + "</a>";
    var delimiter = "<span class=\"delimiter\">" + message.topicPathDelimiter + "</span>";

    for ( var topicPath in topicPathList) {
        var url = topicPathList[topicPath];
        var label = "<span class=\"topicPath\">" + encodeHtml(topicPath) + "</span>";
        if (url != "") {
            html += delimiter + "<a href=" + topicPathUrlFmt.format(topicPathList[topicPath]) + relAttribute + " id=\"topicPathLink" + topicPathList[topicPath] + "\">" + label + "</a>";
        } else {
            html += delimiter + label;
        }
    }
    topicPathArea.html(html);
}

/**
 * noPhoto画像
 */
function noPhoto(image, noPhotoType) {
    image.src = images[noPhotoType];
}

// 12.16.0_12997_del

// 12.16.0_12997_del

/**
 * 数量設定
 *
 * @param quantityAreaElement
 * @param commodityData
 */
function createQuantityList(quantityAreaElement, addCartLimitQuantity) {
    var maxQuantity = quantityAreaElement.data("maxquantity");
    if (!maxQuantity) {
        maxQuantity = 20;
    }
    if (addCartLimitQuantity) {
        if (Number(maxQuantity) > Number(addCartLimitQuantity)) {
            maxQuantity = addCartLimitQuantity;
        }
    }
    $(quantityAreaElement).empty();
    for (var i = 1; i <= maxQuantity; i++) {
        $(quantityAreaElement).append("<option value=\"" + i + "\">" + i + "</option>");
    }
}

/**
 * お気に入り登録
 */
function addFavorite(shopCode, commodityCode, skuCode) {

    var parameters = createBaseParametersForAjaxApi("mypage", "favorite", "add");
    parameters.shopCode = shopCode;
    parameters.skuCode = skuCode;

    var locationHref = location.href;
    var startIndex = locationHref.indexOf(settings.context);
    locationHref = locationHref.substring(startIndex, locationHref.length);

    parameters.loginAfterUrl = createWovnHref(locationHref);
    parameters.loginAfterActionInfo = "/mypage/favorite/add/";
    parameters.additionalActionParameterKey = "shopCode,skuCode";
    var functions = createAjaxFunctions(null, null, null);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : "/mypage/favorite/add/",
        dataType : "json",
        async : true
    }
    sendAjaxToApi(param);
}

/**
 * 入荷お知らせ登録
 */
function addArrivalGoods(shopCode, commodityCode, skuCode) {

    if (typeof arrivalGoodsInit == "function") {
        arrivalGoodsInit(shopCode, commodityCode, skuCode);
    }
}

/**
 * お問い合わせ画面遷移
 */
function moveInquiry(shopCode, commodityCode) {
    location.href = createWovnHref(settings.context + settings.servletMapping + "/customer/inquiry_edit/commodity/" + shopCode + "/" + commodityCode + "/");
}

// 12.16.0_12997_del

// 12.16.0_12997_del

// 12.16.0_12997_del

// 12.16.0_12997_del

// 12.16.0_12997_del

/**
 *
 * @param tagCode
 */
function searchTag(shopCode, tagCode) {
	location.href = settings.context + "/tag/" + shopCode + "/" + tagCode + "/";
}

// 12.16.0_12997_del

// 12.16.0_12997_del

function addCartFromDetail(formId, agreeFlg, quantity, compositionList, purchaseMethodType) {

    var parameters = {
        "quantity" : quantity,
        "purchaseMethodType" : purchaseMethodType
    };
    // 付帯情報を設定
    var incWorkChecks;
    var standardCode = "";
    if($("#selectedStandardDetailCode1").val()) {
        var skuCode = formId.replace("detailInfoForm_","");
        incWorkChecks = $(".incWorkCheck_"+ skuCode)
        standardCode = "_" + $("#selectedStandardDetailCode1").val() + $("#selectedStandardDetailCode2").val() + "_" + skuCode;
    } else {
        incWorkChecks = $(".incWorkCheck")
    }

    var index = 0;
    for (var i = 0; i < incWorkChecks.length; i++) {

        var incWorkCheck = incWorkChecks[i]

        if (incWorkCheck.checked) {
            var incWorkCode = $(incWorkCheck).val();
            var postKey = "incWorkCode_" + index;
            index++;
            parameters[postKey] = incWorkCode;

            var selectKey = "incWorkSelect_" + incWorkCode;
            var incWorkSelect = $("#" + selectKey + standardCode);
            var selectValue = incWorkSelect.val();
            parameters[selectKey] = selectValue;

            var textKey = "incWorkText_" + incWorkCode;
            var incWorkText = $("#" + textKey + standardCode);
            var textValue = incWorkText.val();
            parameters[textKey] = textValue;
        }

    }

    addCart(formId, compositionList, agreeFlg, parameters);
}

/**
 * カート追加
 *
 * @param formId
 * @param compositionList
 * @param purchasingAgreementFlg
 * @param parameterAssociationArray
 */
function addCart(formId, compositionList, purchasingAgreementFlg, parameterAssociationArray) {

    var uri = "/cart/cart/add_cart/"

    var successFunction = function(data) {

        initializeMiniCart(miniCartAddCallBack);

    }

    if (!compositionList) {
        compositionList = new Array();
    }

    if (!purchasingAgreementFlg) {
        purchasingAgreementFlg = false;
    }

    var parameters = createBaseParametersForAjaxApi("cart", "cart", "add_cart");

    if (compositionList && compositionList.length != 0) {
        parameters.compositionList = new Array();
        for (var i = 0; i < compositionList.length; i++) {
            parameters.compositionList.push(compositionList[i]);

        }
    }

    parameters["purchasingAgreementFlg"] = purchasingAgreementFlg;

    if (parameterAssociationArray) {
        for (key in parameterAssociationArray) {
            parameters[key] = parameterAssociationArray[key];
        }
    }

    var functions = createAjaxFunctions(null, null, successFunction);

    var param = {
        parameters : parameters,
        functions : functions,
        formId : formId,
        uri : uri,
        messageType : "addcart",
        dataType : "json",
        async : true
    }
    sendAjaxToApi(param);
}

// 12.16.0_12997_del

/**
 * パンくずリスト生成
 */
function createTopicPathListForCatalogDetail() {
    var topicPathList = {};

    var topicPathElements = $(".topicPath");

    for (var i = 0; i < topicPathElements.length; i++) {
        var topicPathData = topicPathElements[i];
        var url = $(topicPathData).data("value");
        // SourceCode_v12.18_add_start
        // topicPathList[$(topicPathData).data("name")] = url + "/";
        // SourceCode_v12.18_add_end

        // Mockup_V12.18_add_start
        topicPathList[$(topicPathData).data("name")] = url;
        // Mockup_V12.18_add_end
    }

    initializeTopicPath(topicPathList);

}

/**
 * 付帯サービス変更時
 */
function changeIncwork(checkId, chagedObj) {
    if ($(chagedObj).val() != '') {
        var incCheck = $("#" + checkId);
        $(incCheck).prop("checked", true);
    }
}

/*******************************************************************************
 * ページング
 ******************************************************************************/
function appendParamToUrl(param) {
    var queryParameter = analyzeUrlParameter(location);

    for (key in param) {
        if (typeof param[key] != "undefined") {
            queryParameter[key] = param[key];
        }
    }

    var resultUrl = "";
    var paramFmt = "{0}{1}={2}";

    for (key in queryParameter) {
        if (resultUrl) {
            resultUrl = resultUrl + "&";
        } else {
            resultUrl = "?";
        }
        resultUrl = paramFmt.format(resultUrl, key, queryParameter[key]);
    }
    return resultUrl.toString();
}

/**
 * ページ遷移
 *
 * @param currentPage
 *            ページ番号
 * @param fn
 *            callback
 */
function goNextPage(currentPage, pageSize, fn, pagerActionInfo) {

    var accessSet = analyzeAccessSet(location.toString());
    var parameters = createBaseParametersForAjaxApi(accessSet.packageId, accessSet.beanId, "init");
    if (typeof pagerActionInfo != "undefined") {
        for ( var key in pagerActionInfo) {
            if (pagerActionInfo[key]) {
                parameters[key] = pagerActionInfo[key];
            }
        }
    }
    parameters.currentPage = currentPage;
    parameters.pageSize = pageSize;

    var url = "/" + accessSet.packageId + "/" + accessSet.beanId + "/init/";
    var functions = createAjaxFunctions(null, null, fn);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : uri,
        dataType : "json",
        async : true
    }
    sendAjaxToApi(param);
}

/**
 * ページサイズの設定
 *
 * @param pager
 *            ページングデータ
 */
function doRenderPageSize(pager, pageSizeArea) {
    var pageSizeType = $(pageSizeArea).data("type");
    if (pageSizeType == 'link') {
        doRenderPageSizeLink(pager, pageSizeArea);
    } else {
        doRenderPageSizeSelect(pager, pageSizeArea);
    }
}

function doRenderPageSizeSelect(pager, pageSizeArea) {
    var pageSizeDom = $(pageSizeArea).find("select[name='pageSize'].pagerSize");
    if (pageSizeDom.length == 0) {
        return;
    }
    $(pageSizeDom).empty();

    var pageSizeOption = new Array();
    var pageSizeOptionTmp = $(pageSizeDom).parent().data("list-option");
    if (typeof pageSizeOptionTmp != "undefined") {
        var splited = pageSizeOptionTmp.split(",");
        for (option in splited) {
            pageSizeOption.push(splited[option]);
        }
    } else {
        pageSizeOption = new Array(8, 16, 32, 64);
    }

    for (var i = 0; i < pageSizeOption.length; i++) {
        var ps = pageSizeOption[i];
        $(pageSizeDom).append(new Option(ps + " 件表示", ps));
        if (pager.rowCount <= ps) {
            break;
        }
    }
    $(pageSizeDom).val(pager.pageSize);
    if ($(pageSizeDom).children().length <= 1) {
        $(pageSizeDom).parent().hide();
    }
}

function doRenderPageSizeLink(pager, pageSizeArea) {
    var pageSizeDom = $(pageSizeArea).find("a[name='pagerSize'].pagerSize");
    if ($(pageSizeDom).length == 0) {
        return;
    }

    $(pageSizeDom).before(" | ");

    var pageSizeOption = new Array();
    var pageSizeOptionTmp = $(pageSizeArea).data("list-option");
    if (typeof pageSizeOptionTmp != "undefined") {
        var splited = pageSizeOptionTmp.split(",");
        for (option in splited) {
            pageSizeOption.push(splited[option]);
        }
    } else {
        pageSizeOption = new Array(10, 20, 50, 100);
    }
    for (var i = 0; i < pageSizeOption.length; i++) {
        var ps = pageSizeOption[i];
        var newPageSize = $(pageSizeDom).clone();
        var $newPageSize = $(newPageSize);
        $newPageSize.html(ps + $(pageSizeDom).html());

        if (pager.pageSize == ps) {
            $(pageSizeDom).before("<input type=\"hidden\" name=\"pageSize\" value=\"" + ps + "\" class=\"pagerSize\">");
            $(pageSizeDom).before($newPageSize.html() + " | ");
        } else {
            $(newPageSize).attr("data-pagesize", ps);
            $(pageSizeDom).before($newPageSize);
            $(pageSizeDom).before(" | ");
        }

        if (pager.rowCount <= ps) {
            break;
        } else {
            $newPageSize.before("  ");
        }
    }
    $(pageSizeDom).remove();
}

/**
 * ページ遷移イベントを設定する
 */
function bindPager() {

    var callBackFunc = null;
    var pagerActionInfo = null;
    var pagerArea = null;

    if (arguments.length > 2) {
        callBackFunc = arguments[0];
        pagerActionInfo = arguments[1];
        pagerArea = arguments[2];
    } else if (arguments.length > 1) {
        if (jQuery.isFunction(arguments[0])) {
            callBackFunc = arguments[0];
            pagerActionInfo = arguments[1];
        } else {
            pagerActionInfo = arguments[0];
            pagerArea = arguments[1];
        }
    } else if (arguments.length > 0) {
        if (jQuery.isFunction(arguments[0])) {
            callBackFunc = arguments[0];
        } else if (arguments[0] instanceof ActionInfo) {
            pagerActionInfo = arguments[0];
        } else {
            pagerArea = arguments[0];
        }
    }

    var isPost = callBackFunc && jQuery.isFunction(callBackFunc);
    var pageSizeDataElement = $("[name='pageSize']");
    var pageLinkElement = $("a.pagingLink");
    var selectPageSizeElement = $("select[name='pageSize'].pagerSize");
    var aPageSizeElement = $("a[name='pagerSize'].pagerSize");

    if (pagerArea != null && typeof (pagerArea) != "undefined") {
        pageLinkElement = $(pagerArea).find("a.pagingLink");
        pageSizeDataElement = $(pagerArea).find("[name='pageSize']");
        selectPageSizeElement = $(pagerArea).find("select[name='pageSize'].pagerSize");
        aPageSizeElement = $(pagerArea).find("a[name='pagerSize'].pagerSize");
    }

    $(pageLinkElement).removeAttr("onclick");
    $(pageLinkElement).click(function(event) {
        var pageSize = $(pageSizeDataElement).val();
        var currentPage = $(this).data("pageno");
        if (isPost) {
            goNextPage(currentPage, pageSize, callBackFunc, pagerActionInfo);
        } else {
            var param = {
                "pageSize" : pageSize,
                "currentPage" : currentPage
            };
            location.href = createWovnHref(appendParamToUrl(param));
        }
        event.preventDefault();
    });

    // ページサイズのchangeイベントを登録
    $(selectPageSizeElement).change(function(event) {
        var pageSize = $(this).val();
        var currentPage = 1;
        if (isPost) {
            goNextPage(currentPage, pageSize, callBackFunc, pagerActionInfo);
        } else {
            var param = {
                "pageSize" : pageSize,
                "currentPage" : currentPage
            };
            location.href = createWovnHref(appendParamToUrl(param));
        }
        event.preventDefault();
    });

    $(aPageSizeElement).click(function(event) {
        var pageSize = $(this).data("pagesize");
        var currentPage = 1;
        if (isPost) {
            goNextPage(1, pageSize, callBackFunc, pagerActionInfo);
        } else {
            var param = {
                "pageSize" : pageSize,
                "currentPage" : currentPage
            };
            location.href = createWovnHref(appendParamToUrl(param));
        }
        event.preventDefault();
    });
}

function pagerDataBind(param) {

    // pageデータマッピング
    var pagerElement = $("#pager");
    var pageListElements = $(".pageList");
    var data = new Object();
    var pager = new Object();
    pager.currentPage = $(pagerElement).data("currentpage");
    pager.maxFetchSize = $(pagerElement).data("maxfetchsize");
    pager.maxPage = $(pagerElement).data("maxpage");
    pager.overflow = $(pagerElement).data("overflow");
    pager.pageSize = $(pagerElement).data("pagesize");
    pager.rowCount = $(pagerElement).data("rowcount");

    var pageListArray = new Array();
    for (var i = 0; i < pageListElements.length; i++) {
        var pageList = pageListElements[i];
        pageListArray.push($(pageList).data("pageno"));
    }
    pager.pageList = pageListArray;

    data.pager = pager;

    var pagerElements = $(".pagerArea").children();
    pagerElements.push($("#pagerSizeArea"));

    for (var i = 0; i < pagerElements.length; i++) {
        var dom = pagerElements[i]
        // html構成を作成
        initializePager(data, $(dom));
    }

    // 作成したhtml構成のonclick処理を設定
    bindPager(param);
}

function initializePager(data, dom) {
    var key = dom.data("item");
    var position = ""
    if (dom.data("position")) {
      position = "_" + dom.data("position");
    }
    if (key == "pager") {
        // ページング情報
        var html = "";
        var pagerInfo = data.pager;
        if (pagerInfo == null) {
            return;
        }

        if (pagerInfo.overflow && pagerInfo.pageList.length > 50) {
            pagerInfo.pageList.length = 50;
        }

        var onclick = " onclick=\"\") ";

        if (pagerInfo.currentPage > 1) {
            // 最初のページでなければ前へを追加
            html += "<a href='#' data-pageNo=\"" + (pagerInfo.currentPage - 1) + "\" " + onclick + "class='pagingPrev pagingLink' id='dispPrevPageLink" + position + "'>＜<span class='d-none d-md-inline'>前へ</span></a>";
        }

        html += "&nbsp;";
        if (pagerInfo.maxPage > 1) {
            // 表示する数字の数 1... x x x x ... Max
            var lineSize = settings.pagingLineSize;
            // 表示する最大ページ数
            var maxSize = settings.pagingMaxSize;

            var startPage = 1;
            if (pagerInfo.currentPage - Math.floor(lineSize / 2) > 1 && pagerInfo.pageList.length > lineSize) {
                startPage = pagerInfo.currentPage - Math.floor(lineSize / 2);
                // 1ページ目とPager開始ページと連続すれば「…」を付けない
                html += "<a href='#' data-pageNo=\"" + 1 + "\" " + onclick + " class=\"pagingCount pagingLink\" id='dispFirstPageLink" + position + "'>" + 1 + "</a>";
                if (startPage - 1 != 1) {
                    html += "…";
                } else {
                    html += "&nbsp;";
                }
            }

            var lastPage = startPage + lineSize - 1;
            if (lastPage > maxSize) {
                lastPage = maxSize;
                startPage = lastPage - lineSize + 1;
            } else if (lastPage > pagerInfo.pageList.length) {
                lastPage = pagerInfo.pageList.length;
            }
            if (maxSize > pagerInfo.maxPage) {
                maxSize = pagerInfo.maxPage;
            }

            for (var i = startPage; i <= lastPage; i++) {
                try {
                    var pageNo = i;
                    if (pageNo == pagerInfo.currentPage) {
                        html += "<span class='pagingCount activepage'>" + pageNo + "</span> ";
                    } else {
                        html += "<a href='#' data-pageNo=\"" + pageNo + "\" " + onclick + " class=\"pagingCount pagingLink\" id=\"dispPageLink" + pageNo + position + "\">" + pageNo + "</a> ";
                    }
                } catch (e) {
                }
            }
            // 最終ページとPager終わりページと連続すれば「…」を付けない
            if (lastPage != maxSize) {
                if (lastPage + 1 != maxSize) {
                    html += "…";
                } else {
                    html += "&nbsp;";
                }
                html += " <a href='#' data-pageNo=\"" + maxSize + "\" " + onclick + " class=\"pagingCount pagingLink\" id='dispLastPageLink'>" + maxSize + "</a> ";
            }
        }

        if (pagerInfo.currentPage < maxSize && pagerInfo.pageList.length > 0) {
            // 最終ページでなければ次へを追加
            html += "<a href='#' data-pageNo=\"" + (pagerInfo.currentPage + 1) + "\"" + onclick + "class='pagingNext pagingLink' id='dispNextPageLink" + position + "'><span class='d-none d-md-inline'>次へ</span>＞</a> ";
        }

        dom.html(html);
        return;
    } else if (key == "pagerRowCount") {
        if (data.pager == null) {
            return;
        }

        var startSize = ((data.pager.currentPage - 1) * data.pager.pageSize) + 1;
        var endSize = startSize + data.pager.pageSize - 1;
        var targetCount = data.pager.rowCount > data.pager.maxFetchSize ? data.pager.maxFetchSize : data.pager.rowCount;
        if (endSize > targetCount) {
            endSize = targetCount;
        }
        var pagerRowCountFmt = "　全{0}件";
        if (data.pager.rowCount > 0 && data.pager.rowCount > data.pager.pageSize) {
            pagerRowCountFmt += "　{1}件 ～ {2}件";
        } else {
            pagerRowCountFmt += "";
        }
        $(".pagerMessage").text(pagerRowCountFmt.format(data.pager.rowCount, startSize, endSize));

        return;
    } else if (key == "pagerSize") {
        if (data.pager == null) {
            return;
        }
        var pageSizeType = $(dom).data("type");
        var dataRole = "";
        if ($.mobile) {
            dataRole = " data-role=\"none\" ";
        }
        var pageSizeHtml = "<select name=\"pageSize\" class=\"pagerSize\"" + dataRole + " id=\"pageSizeList\"></select>";
        if (pageSizeType == 'link') {
            pageSizeHtml = "<a href=\"#\" name=\"pagerSize\" class=\"pagerSize\">件</a>";
        }
        dom.html(pageSizeHtml);
        doRenderPageSize(data.pager, $(dom));
        return;
    } else if (key == "appendPager") {
        var pagerInfo = data.pager;
        if (pagerInfo == null || data.pager.overflow) {
            return;
        }
        if (pagerInfo.currentPage < maxSize) {
            var html = "";
            html += "<div class=\"nextPageBar\">";
            html += "<a href=\"" + (pagerInfo.currentPage + 1) + "\" class=\"pagingLink\"><input type=\"button\" class=\"buttonLarge appendNextPage\" value=\"" + message.next + pagerInfo.pageSize + message.count + "\" /></a>";
            html += "</div>";
            dom.html(html);
        } else {
            dom.html("");
        }
    } else if (key == "readMore") {
        // ページング情報
        var html = "";
        var pagerInfo = data.pager;

        if (pagerInfo == null || pagerInfo.rowCount == 0) {
            $(".readMoreArea").hide();
            return;
        }

        var openReadMoreMessage = $(dom).find(".openReadMore").html();
        if (!openReadMoreMessage) {
            openReadMoreMessage = "もっと見る";
        }
        var closeReadMoreMessage = $(dom).find(".closeReadMore").html();
        if (!closeReadMoreMessage) {
            closeReadMoreMessage = "閉じる";
        }

        // もっと見るのリンク
        if (pagerInfo.currentPage < pagerInfo.maxPage) {
            html += "<div class=\"openReadMoreArea\">";
        } else {
            html += "<div class=\"openReadMoreArea hidden\">";
        }
        html += "<a href='#' data-pageNo=\"" + (pagerInfo.currentPage + 1) + "\"" + onclick + " class=\"openReadMore\">" + openReadMoreMessage + "</a> ";
        html += "</div>";

        // 閉じるのリンク
        if (pagerInfo.currentPage > 1) {
            html += "<div class=\"closeReadMoreArea\">";
        } else {
            // 最初のページでは表示しない
            html += "<div class=\"closeReadMoreArea hidden\">";
        }
        html += "<a href='#' data-pageNo=\"1\" " + onclick + " class=\"closeReadMore\">" + closeReadMoreMessage + "</a>";
        html += "</div>";
        log(html);

        dom.html(html);
    }
}

function reviewListReadMore(init) {

    var currentPage = 0;
    if (!init) {
        $(".readMoreArea").before("<div id=\"readMoreLoading\"><img src=\"" + settings.context + "/files/commonfiles/images/ws_loading_small.gif\" /></div>");
        var currentPageVal = $("#currentPage").val();
        currentPage = Number(currentPageVal) + 1;
    }

    var pathInfo = analyzeAccessSet(location.href).otherPathInfo;
    var shopCode = pathInfo[0];
    var commodityCode = pathInfo[1];
    var uri = "/catalog/review_list/search/" + shopCode + "/" + commodityCode + "/";
    var parameters = createBaseParametersForAjaxApi("catalog", "review_list", "search");
    parameters.shopCode = shopCode;
    parameters.commodityCode = commodityCode;
    parameters.pageSize = 3;
    parameters.currentPage = currentPage;

    if ($.mobile) {
        parameters.clientType = "sp";
    }

    // Mockup_v12.18_add_start
    var data = getReviewListJson();
    reviewListCallBack(data);
	// Mockup_v12.18_add_end

    // SourceCode_V12.18_add_start
    // var functions = createAjaxFunctions(null, null, reviewListCallBack);

    // var param = {
        // parameters : parameters,
        // functions : functions,
        // uri : uri,
        // dataType : "json",
        // async : true
    // }
    // sendAjaxToApi(param);
	// SourceCode_V12.18_add_end
}

function closeRreviewList() {
    var readMoreDataDom = $("[class^=readMoreDataType]");
    $(readMoreDataDom).not(".readMoreDataType").remove();
    var pathInfo = analyzeAccessSet(location.href).otherPathInfo;
    var shopCode = pathInfo[0];
    var commodityCode = pathInfo[1];
    var uri = "/catalog/review_list/search/" + shopCode + "/" + commodityCode + "/";
    var parameters = createBaseParametersForAjaxApi("catalog", "review_list", "search");
    $("#currentPage").val(0)
    parameters.currentPage = 0;
    parameters.pageSize = 3;
    parameters.shopCode = shopCode;
    parameters.commodityCode = commodityCode;

    if ($.mobile) {
        parameters.clientType = "sp";
    }

    // SourceCode_V12.18_add_start
    // var successFunction = function(data) {
        // $("#reviewList").children(".reviewArea").remove();
        // reviewListCallBack(data);
    // }
    // var functions = createAjaxFunctions(null, null, successFunction);

    // var param = {
        // parameters : parameters,
        // functions : functions,
        // uri : uri,
        // dataType : "json",
        // async : true
    // }
    // sendAjaxToApi(param);
	// SourceCode_V12.18_add_end
	
	// Mockup_v12.18_add_start
	var data = getReviewListJson();
	$("#reviewList").children("#reviewInfo").remove();
    reviewListCallBack(data);
	// Mockup_v12.18_add_end
}

var reviewListCallBack = function(data) {

    for (index in data.reviewList) {
        var reviewInfo = data.reviewList[index];
        var reviewInfoDom = $("#reviewList").children("#reviewInfoTemplate").clone();
        bindDataToDomDataAttribute(reviewInfoDom, reviewInfo);
        reviewInfoDom.removeClass("hidden");
        reviewInfoDom.addClass("reviewArea");
        reviewInfoDom.attr("id", "reviewInfo_" + index);
        $("#reviewList").append(reviewInfoDom);
    }

    if (Number($("#currentPage").val()) > 0) {
        $("#closeReadMore").removeClass("hidden");
    } else {
        $("#closeReadMore").addClass("hidden");
    }

    $("#currentPage").val(Number($("#currentPage").val()) + 1);
    var pagerData = data.pager;

    var readMoreDataType = $(".readMoreDataType");
    var dataTypeName = $(readMoreDataType).data("type");
    if (pagerData.currentPage && pagerData.currentPage != 1) {
        $("#readMoreLoading").remove();
    }

    // タイトルエリアの処理
    var reviewListAreaDom = $("#reviewListArea");
    var titleDom = $(reviewListAreaDom).find(".titleArea");

    if (data.reviewList.length == 0) {
        // 投稿なし
        titleDom.find(".hasReviewPost").remove();
        $(".reviewListBody").remove();
    } else {
        // 投稿ある
        $(".noReviewPost").remove();
    }

    // おすすめ度の処理
    var reviewListDom = $(reviewListAreaDom).find(".reviewArea");

    for (var i = 0; i < reviewListDom.length; i++) {
        var reviewPostDom = reviewListDom[i];
        var reviewScore = $(reviewPostDom).find(".reviewScore").val();
        if (!reviewScore) {
            continue;
        }

        // イメージの処理
        var revieScoreImageDom = $(reviewPostDom).find(".reviewScoreImageArea").children();
        $(revieScoreImageDom).not(".reviewScore" + reviewScore).remove();

    }

    // レビューローディングバーを削除
    $("#readMoreLoading").remove();
    $("#reviewListArea").show();
    // レビュータイトル件数更新

    updateReviewPagerRowCountArea($("span[data-item=\"pagerRowCount\"]"), data);

    if (data.pager.rowCount > data.pager.pageSize) {
	    if (Number($("#currentPage").val()) == Math.ceil(data.pager.rowCount / data.pager.pageSize)) {
            $("#openReadMore").addClass("hidden");
        } else {
            $("#openReadMore").removeClass("hidden");
        }
    } else {
        $("#openReadMore").addClass("hidden");
    }

    // レビューtoggle
    if ($('.textOverFlow').length > 0) {
        $('.textOverFlow').each(function () {
            var target = $(this);
            var noescapeTxt = target.text();
            var escapeFullTxt = target.html();
            var count = 75; // デフォルトで表示する文字数

            // 短縮形式表示判定
            if (noescapeTxt.length > count) {
                var escapeSplitTxts = escapeFullTxt.split('<br>'); // 改行（<br>）毎の文字列を取得（サニタイジング済み）
                var sanitizedTxt = "";

                $.each(escapeSplitTxts, function (index, escapeTxt) {
                    var unescapeTxt = jQuery('<span/>').html(escapeTxt).text();
                    count -= unescapeTxt.length;
                    if (count < 0) {
                        // 短縮形式加工(サニタイジング処理も)
                        unescapeTxt = unescapeTxt.substr(0, unescapeTxt.length + count) + '…';
                        sanitizedTxt += jQuery('<span/>').text(unescapeTxt).html() + '<br>';
                        return false;
                    } else {
                        // サニタイジング処理
                        sanitizedTxt += jQuery('<span/>').text(unescapeTxt).html() + '<br>';
                    }
                });
                target.html(sanitizedTxt);

                var moreLead = $('<span class="moreLead"><img src="' + settings.context + '/files/commonfiles/images/icon_plus_b.gif" alt="すべて表示" /></span>');

                target.append(moreLead);
                moreLead.on('click', function () {
                    target.html(escapeFullTxt);
                    $(this).remove();
                });
            }
        });
    }
}

/**
 * レビュータイトルの件数更新
 *
 * @param pagerRowCountDom
 *            更新対象
 * @param data
 *            データ
 */
function updateReviewPagerRowCountArea(pagerRowCountDom, data) {
    if (!pagerRowCountDom || $(pagerRowCountDom).length == 0 || !data || data.pager == null) {
        return;
    }
    var startSize = 1;
    var endSize = Number($("#currentPage").val()) * data.pager.pageSize;
    if (endSize > data.pager.rowCount) {
        endSize = data.pager.rowCount;
    }
    var pagerRowCountFmt = "<span class='pagerRowCount'>" + message.allPageCount;
    if (data.pager.rowCount > 0 && data.pager.rowCount > data.pager.pageSize) {
        pagerRowCountFmt += message.pageCountFromTo + "</span>";
    } else {
        pagerRowCountFmt = "<span>全</span>" + data.pager.rowCount + "<span>件</span>";
    }
    $(pagerRowCountDom).each(function() {
        $(this).html(pagerRowCountFmt.format(data.pager.rowCount, startSize, endSize));
    });
}

/**
 * レビュー投稿画面遷移
 */
function moveReviewPost() {

    var pathInfo = analyzeAccessSet(location.href).otherPathInfo;
    var shopCode = pathInfo[0];
    var commodityCode = pathInfo[1];
    var url = "/catalog/review_edit/init/" + shopCode + "/" + commodityCode + "/";

    window.location = createWovnHref(settings.context + settings.servletMapping + url);
}

function detailPreviewFromBackCallback() {

    removeAttribute($("a"), "href");
    $(":button").attr("onclick","");

    $(function() {

        $(document).keydown(function(event) {

            // クリックされたキーコードを取得する
            var keyCode = event.keyCode;

            // F5 の場合は falseをリターン
            if (keyCode === 116) {
                return false;
            }

            // バックスペースキーを制御する
            if (keyCode === 8) {
                return false;
            }
        });
    });
}

function removeAttribute($element, attribute) {
    if ($element[0]) {
        $element.removeAttr(attribute);
    }
}

// 12.16.0_12997_del

function setFocus(selector) {
    if ($(selector)[0]) {
        $(selector).focus();
    }
}

function arrivalGoodsInit(shopCode, commodityCode, skuCode) {

    var parameters = createBaseParametersForAjaxApi("catalog", "arrival_goods", "init");
    parameters.shopCode = shopCode;
    parameters.commodityCode = commodityCode;
    parameters.skuCode = skuCode;
    var successFunction = function(data) {
        $("#email").siValidation({});
        if (data.email) {
            $("#email").val(data.email);
        }
        pcPopup("arrivalGoodsArea");
    };
    var functions = createAjaxFunctions(null, null, successFunction);

    var param = {
        parameters : parameters,
        functions : functions,
        uri : "/catalog/arrival_goods/init/",
        dataType : "json",
        async : true
    }
    sendAjaxToApi(param);
}

/**
 * 商品詳細ズーム画像設定
 */
function setZoomImages(){

    if (!(_ua.Tablet || _ua.Mobile)) {
        setEzPlus();
    } else {
      $(".relatedImageLink").on("click", function() {
        $(".itemMain").find("#mainImage").attr("src", $(this).data('image'));
        $(".itemMain").find("#mainImage").attr("data-zoom-image", $(this).data('zoom-image'));
      });
    }
}

function setEzPlus() {
    $("#mainImage").ezPlus({
        zoomEnabled : true,
        gallery : "relatedImageArea",
        cursor : "pointer",
        galleryActiveClass : "active",
        imageCrossfade : false,
        scrollZoom : true,
    });
}

/**
 * 商品詳細拡大画像設定
 */
function setLightBoxImages(){

    if (_ua.Tablet || _ua.Mobile) {
        // SPの場合は画像のURLで閲覧
        var w = $("#mainImage").width();
        var h = $("#mainImage").height();
        var link = $("<div id='spImageLink'></div>").width(w).height(h);
        $("#mainImage").before(link);
        $("#spImageLink").on("click", function(e) {
            var url = $("#mainImage").attr("data-zoom-image");
            if (url) {
                window.open(url, null, "resizable=1");
            }
        });

    } else {
        // PCの場合はColorboxで画像を表示
        $("#mainImage").click(function(e) {
            var ez = $("#mainImage").data("ezPlus");
            callColorbox(ez.getGalleryList());
            return false;
        });
    }
}

/**
 *
 * 商品画像フォトギャラリー表示(Colorbox)
 */
function callColorbox(galleryList) {

    var aTagGeneration = "";
    $.each(galleryList, function(index, val){
        aTagGeneration += '<a class="gallery" href="'+val.href+'"></a>'
    });

    $('body').prepend(aTagGeneration);
    $('body').find('a.gallery').colorbox({
        rel:'gallery',
        open:true,
        onCleanup:function(){ $('body').find('a.gallery').remove(); },
    });
}
