
var massgrid_rpc = require('node-bitcoin-rpc')
var $conf = require('../conf/conf');
var massgridrpcConfig = $conf.massgridrpc;
massgrid_rpc.init(massgridrpcConfig.url, massgridrpcConfig.port, massgridrpcConfig.rpcuser, massgridrpcConfig.rpcpassword);

var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res =JSON.stringify({
			code:'1',
			msg: 'require address and wechat name'
		});
	} else {
		res = JSON.stringify(ret);
	}
};
module.exports = {
    getbalance: function (req, res, next) {
        var wechat = req.wechat;
        var address = req.address;
        if(wechat == null || address == null){
            jsonWrite(res, undefined);
			return false;
        }
        return massgrid_rpc.call('getbalance', [wechat,0,true,true], function (err, result) {
            if (err !== null) {
                jsonWrite(res, undefined);
                console.log('getblance error :' + err)
                return false;
            } else {
                jsonWrite(res,result.result)
                console.log('getblance successful ',address,wechat,result.result);
                return true;
            }
        });
    },
    setaccount: function (req, res, next) {
        var wechat = req.wechat;
        var address = req.address;
        if(wechat == null || address == null){
            jsonWrite(res, undefined);
			return false;
        }
        return massgrid_rpc.call('setaccount', [address ,wechat], function (err, result) {
            if (err !== null) {
                jsonWrite(res, undefined);
                console.log('sendtoaddress error :' + err)
                return false;
            } else { 
                jsonWrite(res,result.result)
                console.log('sendtoaddress successful ' + result.result); //set account
                return true;
            } 
        });
    },
    sendtoaddress: function(req, res, next){
        var wechat = req.wechat;
        var address = req.address;
        var amount = req.amount;
        if(wechat == null || address == null|| amount == null){
            jsonWrite(res, undefined);
			return false;
        }
        return massgrid_rpc.call('sendtoaddress', [address,Number(amount)], function (err, result) {
            if (err !== null) {
                jsonWrite(res, undefined);
                console.log('sendtoaddress error :' + err)
                return false;
            } else { 
                if(result.result.length == 64){
                    jsonWrite(res,result.result)
                    console.log('sendtoaddress successful ' + result.result); //txid
                    return true;
                }
            } 
        });
    }
}