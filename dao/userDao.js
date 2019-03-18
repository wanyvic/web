var MongoClient = require('mongodb').MongoClient;
var Long = require('mongodb').Long;
var $conf = require('../conf/conf');
var url = $conf.mongourl.url;

// 向前台返回JSON方法的简单封装
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
	insertAddress: function (req, res, next) {
        console.log('insertAddress start');
		var param = req;
		if(param.address == null || param.wechat == null) {
            res,json({code:1,msg:'require address and wechat name'});
			return;
		}
		var addr ={'address': param.address,
        'wechat' : param.wechat,
		'timestamp': Long.fromNumber(0)};
		try {
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db("massgrid");
				var whereStr = {'address': param.address};  // 查询条件
				var updateStr = {$set: addr};
				dbo.collection("massgrid").updateOne(whereStr, updateStr,{upsert:true}, function(err, res) {
                    if (err) throw err;
					console.log("mongo address insert successful");
					db.close();
				});
			});
		} catch (error) {
            res.json({code:2,msg:error});
        }
        next(req,res);
    },
	delete: function (req, res, next) {
		var param = req;
		console.log(param);
		if(param.address == null) {
			jsonWrite(res, undefined);
			return false;
		}
		try {
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db("massgrid");
				var whereStr = {'address': param.address};  // 查询条件
				dbo.collection("massgrid").deleteOne(whereStr, function(err, res) {
                    if (err) throw err;
                    jsonWrite(res,{
                        code:0,
                        msg: 'deleteAddress success'
                    });
					console.log("address delete successful");
					res.json({result:false})
					db.close();
				});
			});
		} catch (error) {
            jsonWrite(res,{
            code:5,
            msg: 'deleteAddress failed: '+error.error
        });
		}
		return true;
	},
	queryAll: function (req, res, next) {
		try {
			MongoClient.connect(url, function(err, db) {

				if (err) throw err;
				var dbo = db.db("massgrid");
				dbo.collection("massgrid").find({}).toArray(function(err, result)  {
					if (err) throw err;
					var data = {'total':result.length,'rows':result};
					res.json(data);
					console.log("address find successful",data);
					db.close();
				});
			});
		} catch (error) {
            jsonWrite(res,{
            code:6,
            msg: 'queryAll failed: '+error.error
        });
		}
		return true;
	}
};