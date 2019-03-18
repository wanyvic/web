
var massgrid_rpc = require('node-bitcoin-rpc')
var $conf = require('../conf/conf');
var massgridrpcConfig = $conf.massgridrpc;
massgrid_rpc.init(massgridrpcConfig.url, massgridrpcConfig.port, massgridrpcConfig.rpcuser, massgridrpcConfig.rpcpassword);
massgrid_rpc.setTimeout(10000);
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
    getbalance: function (req, res, amount, next) {
        var wechat = req.wechat;
        var address = req.address;
        var state;
        if(wechat == null || address == null){
            jsonWrite(res, undefined);
			return false;
        }
        massgrid_rpc.call('getbalance', [wechat,0,true,true], function (err, result) {
            if (err !== null) {
                console.log('getblance error :' + err)
                state = false;
            } else {
                amount = result.result;
                state = true;
                console.log('getblance successful ',address,wechat,result.result);
            }
        });
        return state;
    },
    importaddress: function (req, res, next) {
        var wechat = req.wechat;
        var address = req.address;
        console.log('importaddress start',wechat,address);
        if(wechat == null || address == null){
            res.json({code:1,msg:'require address and wechat name'});
            return;
        }
        massgrid_rpc.call('importaddress', [address ,wechat], function (err, result) {
            if (err !== null) {
                res.json({code:2,msg:'massgridrpc importaddress error :' + err});
                console.log('massgridrpc importaddress error :' + err)
            } else {
                if(result.error == null){
                    console.log('massgridrpc importaddress successful',err,result); //set account
                    next(req,res);
                    return;
                }
                console.log('massgridrpc importaddress failed',err,result.error); //set account
                res.json({code:10,msg:result.error.message});
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
                    jsonWrite(res,{
                        code:0,
                        msg: 'sendtoaddress successful'
                    });
                    console.log('sendtoaddress successful ' + result.result); //txid
                    return true;
                }
                else{
                    jsonWrite(res,{
                        code:3,
                        msg: 'sendtoaddress failed: '+result.result
                    });
                    console.log('sendtoaddress successful ' + result.result); //txid
                    return false;
                }
            }
        });
    }
}