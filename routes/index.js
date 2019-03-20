var express = require('express');
var router = express.Router();
var base58Check = require('base58-native').base58Check;
var userDao = require('../dao/userDao');
var massgridrpc = require('../dao/massgridrpc');
var sendamount = require('../conf/conf').sendAmount.amount;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MassGrid login' });
});
router.post('/processSendCoin', function(req, res) {
    try {
        base58Check.decode(req.body.address)
    } catch (error) {
        console.log("not base58 address");
        res.json({code:1,msg:'not wallet import format address'})
        res.redirect('/');
        return;
    }
    var addr ={'address': req.body.address};
    userDao.findOne(addr,res,function(result,res){
        console.log('findOne: ',result);
        if(result.length != 1){
            res.json({code:2,msg:'the address not record'});
            return;
        }
        if(new Date().getTime() - result[0].timestamp < 24 * 3600 * 1000 ){
            res.json({code:9,msg:'time not allowed',time:result[0].timestamp});
            return;
        }
        var param = {
            'address':result[0].address,
            'wechat':result[0].wechat,
            'amount':sendamount
        };
        massgridrpc.sendtoaddress(param,res,function (req,res) {
            var param2 = {
                'address':param.address,
                'wechat':param.wechat,
                'timestamp':new Date().getTime()
            };
            userDao.insertAddress(param2,res,function (req,res) {
                userDao.insertTime(param2,res,function (req,res) {
                    res.json({code:0,msg:'sendtoaddress successful'});
                });
            });
        });
    });
});
module.exports = router;

