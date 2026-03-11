var webReceptionUtil = {

    /**
     * 対象のskuコードがセット品であるかの判定結果を返却します。
     *
     * 利用対象サービス： naviplus
     *
     * @param
     *  target　対象skuCode
     *
     * @return boolean
     */
     isSetCommodity: function(skuCode) {

         return skuCode.indexOf(":") >= 0;
     },

    /**
     * 指定の最大文字列で区切り文字列を返却します。
     * ※karteでは最大文字数2048文字以内の制約あり。
     * ※naviplusの商品URLは250文字以内の制約あり。
     *
     * 利用対象サービス： 複数サービス
     *
     * @param
     *  target　対象文字列
     *  maxLength 最大文字列数
     * @return 整形後の文字列
     */
     substring: function(target,maxLength) {

         return target.substring(0,maxLength);
    },

    /**
     * 連携対象となる商品画像URLを取得します。
     *
     * 利用対象サービス： naviplus
     *
     * @param commodityImagePath 商品画像
     * @return 商品画像URL
     */
     convertCommodityImagePath: function(commodityImagePath,config,context) {

         var result = commodityImagePath;

         if ( config.contentsProtocol == 'local' ) {

             var uri = location.href.split(context)[0];
             result = uri + commodityImagePath;

         }

         return result;
    },

    /**
     * 商品名中の半角カンマ、半角アンパサンド、連続する半角アンダーライン、半角ダブルクォーテーションを全角に置換します。
     *
     * 利用対象サービス： flipdesk
     *
     * @param commodityName 商品名
     * @return 置換後の商品名
     */
    halfWidthToFullWidth: function(commodityName) {

        return commodityName
            .replace(/,/g, '，')
            .replace(/&/g, '＆')
            .replace(/"/g, '”')
            .replace(/__/g, '＿＿')
            .replace(/%/g, '％')
            .replace(/=/g, '＝');
    },

    /**
     * 引数の値がnull、undifined、空文字の場合、空文字を表す定数へ変換します。
     *　値が存在する場合は、元の文字列を返却します。
     *
     * 利用対象サービス： karte
     *
     * @param target 変換対象オブジェクト
     * @return 変換後の文字列
     */
    convertName: function(target) {

        if (!target) {

            return '未選択';
        }

        return target;
    },

    /**
     * 引数の値から組み合わせIDの出力文字列を生成します。
     *　値が存在しない場合は、空文字列を返却します。
     *
     * 利用対象サービス： 複数サービス
     *
     * @param target 変換対象組み合わせID
     *        type 変換タイプ（order)
     *
     * @return 変換後の組み合わせID出力文字列
     */
    createIdentifierStr: function(target, type) {

        var result = '';

        if (target) {

            switch(type) {
            case 'order':
                result = this.extractIdentifier(target);
                break;
            default:
                result = target;
            }

            result = "(組み合せID[" + result + "])";

        }

        return result;
    },

    /**
     * 引数の値から組み合わせIDを抽出します。
     *　値が存在しない場合は、空文字列を返却します。
     *
     * 利用対象サービス： 複数サービス
     *
     * @param target 組み合わせID文字列
     *
     * @return 組み合わせID
     */
    extractIdentifier: function(target) {

        var result = '';

        if (target) {

            try{
                result = target.match(/\d{8}-\d{4}/)[0];
            } catch(e) {
                try {
                    result = target.match(/\d{8}/)[0];
                } catch(e){
                    try{
                        result = target.match(/\d{4}/)[0];
                    } catch(e) {
                        console.error('invalid identifier: ' + target);
                    }
                }
            }

        }

        return result;
    },

    /**
     * 引数の値から規格名称を付与した商品名を返却します。
     *　値が存在しない場合は、商品名を返却します。
     *
     * 利用対象サービス： 複数サービス
     *
     * @param target 商品名
     * @param standardDetail1Name 規格名称１
     * @param standardDetail2Name 規格名称２
     *
     * @return 規格名称を付与した商品名
     */
    convertStandardName: function( target, standardDetail1Name, standardDetail2Name) {

        if(standardDetail1Name && standardDetail2Name) {
            target += "(" + standardDetail1Name + "/" + standardDetail2Name + ")";
        } else if(standardDetail1Name) {
            target += "(" + standardDetail1Name + ")";
        } else if(standardDetail2Name) {
            target += "(" + standardDetail2Name + ")";
        }

        return target;
    },

    /**
     * 選択された規格コードから該当の企画名称を返却します。
     *　値が存在しない場合は、空文字を返却します。
     *
     * 利用対象サービス： 複数サービス（※商品詳細画面のみ有効）
     *
     * @param selectedCode 選択された規格コード
     * @param standardDetailInfo 規格詳細リスト
     *
     * @return 規格名称
     */
    getStandardDetailName: function( selectedCode, standardDetailInfo ) {

        var result = '';

        if( selectedCode && standardDetailInfo ) {
            $(standardDetailInfo.standardDetailList).each(function() {
                if( this.standardDetailCode == selectedCode) {
                    result = this.standardDetailName;
                }
            });
        }

        return result;

    },

    /**
     * 商品オブジェクトから商品名を以下の形式に合わせて変換し、結果を返します。
     *
     * 規格品（企画名称あり）：　商品名（[企画名称1/企画名称2]）
     * セット品：　商品名（[組み合わせID:10桁の数字]）
     * 予約品：　【予約】 商品名
     *
     * 利用対象サービス： 複数サービス
     *
     * @param commodityName 商品名
     * @param purchaseMethodType 購入方法区分
     *
     * @return 変換後の商品名
     */
    getConvertCommodityName: function( type, obj, purchaseMethodType ) {

        var commodityName = obj.commodityName;
        var skuCode = obj.skuCode;
        var standardDetail1Name = obj.standardDetail1Name;
        var standardDetail2Name = obj.standardDetail2Name;
        var identifier;

        switch( type ) {
        case 'detail':
        case 'cart':
            purchaseMethodType = obj.purchaseMethodType;
            identifier = this.createIdentifierStr(obj.setIdentifier);
            break;
        case 'order':
            identifier = this.createIdentifierStr(obj.identifier,'order');
            break;
        }

        return this.convertCommodityName( commodityName, purchaseMethodType, skuCode, standardDetail1Name, standardDetail2Name, identifier );

    },

    convertCommodityName: function( commodityName, purchaseMethodType, skuCode, standardDetail1Name, standardDetail2Name, identifier ) {

        var target = commodityName;

        switch(purchaseMethodType) {
        case 2:
            target = "【予約】 " + target;
            break;
        default:

        }

        target = this.convertStandardName(target,standardDetail1Name,standardDetail2Name);

        if( identifier ) {
            target +=  identifier;
        }

        return target;
    },

    /**
     * 引数から、在庫ステータスを返却します。
     * 返却される定数は連携サービス依存の整数値です。
     *
     * 利用対象サービス： naviplus
     *
     * @param isReserve 予約ステータス
     * @param stockManagementType 在庫管理区分
     * @param availableStockQuantity 在庫数量
     * @param stockSufficientThreshold 在庫多閾値
     *
     * @return 在庫状態ステータス
     */
    getCommodityStockStatus: function(isReserve, stockManagementType, availableStockQuantity, stockSufficientThreshold) {

        var commodityStockStatus = 1;
        switch (stockManagementType) {

            case "0":
                break;

            case "3":

                if (isReserve) {

                    if (availableStockQuantity == 0) {
                        commodityStockStatus = 0;
                    }

                } else {

                    if (availableStockQuantity <= 0) {
                        commodityStockStatus = 0;
                    } else if (availableStockQuantity <= stockSufficientThreshold) {
                        commodityStockStatus = 2;
                    }
                }

                break;

            case "4":
                commodityStockStatus = 1;
                break;

            default:
                break;
        }

        return commodityStockStatus;
    }

};
