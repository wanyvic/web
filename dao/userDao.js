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
		var param = req;
		console.log(param);
		if(param.address == null || param.wechat == null) {
			jsonWrite(res, undefined);
			return false;
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
					console.log("address insert successful");
					db.close();
				});
			});
		} catch (error) {
			return false;
		}
		return true;
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
					console.log("address delete successful");
					res.json({result:false})
					db.close();
				});
			});
		} catch (error) {
			return false;
		}
		return true;
	},
	find: function(req, res, next) {
		var param = req.body;
		console.log(param);
		if(param.address == null) {
			jsonWrite(res, undefined);
			return false;
		}
		try {
			var addr ={'address': param.address};
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
		} catch (error) {
			return false;
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
					console.log("address find successful",result);
					res.json(result);
					db.close();
				});
			});
		} catch (error) {
			return false;
		}
		return true;
	}
};