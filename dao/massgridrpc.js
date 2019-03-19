
var massgrid_rpc = require('node-bitcoin-rpc')
var $conf = require('../conf/conf');
var massgridrpcConfig = $conf.massgridrpc;
const MASSGRID_TIMEOUT = 10000;
massgrid_rpc.init(massgridrpcConfig.url, massgridrpcConfig.port, massgridrpcConfig.rpcuser, massgridrpcConfig.rpcpassword);
massgrid_rpc.setTimeout(MASSGRID_TIMEOUT);
module.exports = {
    sendtoaddress: function(req, res, next){
        var wechat = req.wechat;
        var address = req.address;
        var amount = req.amount;
        if(wechat == null || address == null|| amount == null){
            res.json({code:1,msg:'require address wechat and amount'});
			return;
        }
        try {
            massgrid_rpc.call('sendtoaddress', [address,Number(amount)], function (err, result) {
                if (err) throw err;
                if(result.result.length != 64){
                    res.json({code:3,msg:result.error});
                    return;
                }
            });
        }catch (error) {
            res.json({code:2,msg:error});
            return;
        }
        if(next)
            next(req,res);
    }
}