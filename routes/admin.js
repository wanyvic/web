var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var Long = require('mongodb').Long;
var url = "mongodb://localhost:27017/runoob";
var bitcoin_rpc = require('node-bitcoin-rpc')
bitcoin_rpc.init('localhost', 19442, 'massgrid', 'massgridpassword')
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session.user)      
    if(!req.session.user){               //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login");                //未登录则重定向到 /login 路径
    }
    res.render('admin', { title: 'MassGrid' });

});
router.post('/processInsert', function(req, res) {
    console.log(req.session.user)      
    if(!req.session.user){               //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login");                //未登录则重定向到 /login 路径
    }
    var address = req.body.massgridaddress;
    var wechat = req.body.wechat;
    if(insertOneAddress(address ,wechat) && setaccount(address ,wechat)){
        // if(setaccount(address ,wechat))
            console.log('insert successful '); //set account
    }
});
function insertOneAddress(address ,wechat){
    var addr ={'address': address,
        'wechat' : wechat,
        'timestamp': Long.fromNumber(0)};
        try {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("massgrid");
                var whereStr = {'address': address};  // 查询条件
                var updateStr = {$set: addr};
                dbo.collection("massgrid").updateOne(whereStr, updateStr,{upsert:true}, function(err, res) {
                    if (err) throw err;
                    console.log("address insert successful");
                    db.close();
                });
            });
        } catch (error) {
            return false;
        }
        return true;
}
function setaccount(address ,wechat){
    try {
        bitcoin_rpc.call('setaccount', [address ,wechat], function (err, res) {
            if (err !== null) {
              console.log('sendtoaddress error :( ' + err + ' ' + res.error)
              throw err;
            } else { 
              console.log('sendtoaddress successful ' + res.result); //set account
            } 
        });
    } catch (error) {
        return false;
    }
    return true;
}
module.exports = router;
