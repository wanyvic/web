var MongoClient = require('mongodb').MongoClient;
var Long = require('mongodb').Long;
var $conf = require('../conf/conf');
var url = $conf.mongourl.url;

module.exports = {
	insertAddress: function (req, res, next) {
        console.log('insertAddress start',req);
		var param = req;
		if(param.address == null || param.wechat == null) {
            res.json({code:3,msg:'require address and wechat name'});
			return;
        }
		try {
            var addr ={
                'address': param.address,
                'wechat' : param.wechat,
                'timestamp': Long.fromNumber(param.timestamp)
                };
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
            res.json({code:4,msg:error});
            return;
        }
        if(next)
            next(req,res);
    },
    insertTime: function (req, res, next) {
        console.log('insertTime start',req);
		var param = req;
		if(param.address == null || param.timestamp == null) {
            res.json({code:3,msg:'require address'});
			return;
        }
		try {
            var time ={
                'times': Long.fromNumber(param.timestamp)
                };
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db("massgrid");
				var whereStr = {'address': param.address};  // 查询条件
                var updateStr = {$addToSet: time};
				dbo.collection("massgrid").updateOne(whereStr, updateStr,{upsert:true}, function(err, res) {
                    if (err) throw err;
					console.log("mongo insert time successful");
					db.close();
				});
			});
		} catch (error) {
            res.json({code:5,msg:error});
            return;
        }
        if(next)
            next(req,res);
    },
	deleteAddress: function (req, res, next) {
		console.log(req);
		if(req == null) {
            res.json({code:3,msg:'require address'});
            return;
		}
		try {
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db("massgrid");
				var whereStr = {'address': req};  // 查询条件
				dbo.collection("massgrid").deleteOne(whereStr, function(err, res) {
                    if (err) throw err;
                    console.log("mongo address delete successful");
					db.close();
				});
			});
		} catch (error) {
            res.json({code:6,msg:error});
            return;
		}
        if(next)
            next(req,res);
	},
	queryAll: function (req, res, next) {
		try {
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db("massgrid");
				dbo.collection("massgrid").find({}).toArray(function(err, result)  {
					if (err) throw err;
					res.json({code:0,'total':result.length,'rows':result});
					console.log("address queryAll successful");
					db.close();
				});
			});
		} catch (error) {
            res.json({code:7,msg:error});
            return;
		}
    },
    findOne: function (req, res, next) {
        if(req == null) {
        res.json({code:3,msg:'require address'});
        return;
        }
		try {
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
                var dbo = db.db("massgrid");
                var whereStr = {'address': req.address};
				dbo.collection("massgrid").find(whereStr).toArray(function(err, result)  {
					if (err) throw err;
					console.log("address find successful");
                    db.close();
                    next(result,res);
				});
			});
		} catch (error) {
            res.json({code:8,msg:error});
            return;
        }
	}
};