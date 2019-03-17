var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var Long = require('mongodb').Long;
var url = "mongodb://localhost:27017/runoob";
var base58Check = require('base58-native').base58Check;
var bitcoin_rpc = require('node-bitcoin-rpc')
bitcoin_rpc.init('localhost', 19442, 'massgrid', 'massgridpassword')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MassGrid' });
});
router.post('/processSendCoin', function(req, res) {
  try {
    base58Check.decode(req.body.address)
  } catch (error) {
    console.log("不是address")
    res.redirect('/');
  }
  
  var addr ={'address': req.body.address};
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("massgrid");
    dbo.collection("massgrid"). find(addr).toArray(function(err, result) { // 返回集合中所有数据
        if (err) throw err;
        db.close();
        if(result.length)
          SendCoin(result);
    });
  });
  //处理
  res.redirect('/');
});
function SendCoin(result) {
  console.log(result);
  bitcoin_rpc.call('getbalance', [result[0].wechat,0,true,true], function (err, res) {
    if (err !== null) {
      console.log('getblance error :( ' + err + ' ' + res.error)
    } else {
      console.log('getblance successful ',result[0].address,result[0].wechat,res.result);
      if(res.result < 1001 && Long.fromNumber(new Date().getTime()) - result[0].timestamp > 24 * 3600 *1000 ) {
        bitcoin_rpc.call('sendtoaddress', [result[0].address,10], function (err, res) {
          if (err !== null) {
            console.log('sendtoaddress error :( ' + err + ' ' + res.error)
          } else { 
            console.log('sendtoaddress successful ' + res.result); //txid
            if(res.result.length == 64){
              UpdateTimedb(result)
            }
            
          } 
        })
      }
    }
  })
}
function UpdateTimedb(result){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("massgrid");
    var whereStr = {'address': result[0].address};  // 查询条件
    var updateStr = {$set: { "timestamp" : Long.fromNumber(new Date().getTime())}};
    dbo.collection("massgrid").updateOne(whereStr, updateStr, function(err, res) {
      if (err) throw err;
      console.log("timestamp update successful");
      db.close();
    });
  });
}
module.exports = router;

