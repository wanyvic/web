var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');
var base58Check = require('base58-native').base58Check;

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session.user);
    if(!req.session.user){;
        req.session.error = "login in first"
        res.redirect("/login");
        return;
    }
    res.render('admin', { title: 'MassGrid' });

});
router.post('/processInsert', function(req, res) {
    try {
        base58Check.decode(req.body.address);
    } catch (error) {
        console.log("not base58 address");
        res.json({code:1,msg:'address invailed'});
        return;
    }
    var data = {
        'address':req.body.address,
        'wechat':req.body.wechat,
        'timestamp':0
    }
    if(req.body.timestamp != null)
        data.timestamp = req.body.timestamp;
    console.log('processInsert',data);
    if(!req.session.user){
        req.session.error = "login in first"
        res.redirect("/login");
    }
    userDao.insertAddress(data,res,function(req,res){
        res.json({code:0,msg:'insert successful'})
    });
});
router.post('/processDelete', function(req, res) {
    try {
        base58Check.decode(req.body.removeaddress);
    } catch (error) {
        console.log("not base58 address");
        res.json({code:1,msg:'address invailed'});
        return;
    }
    var data = req.body.removeaddress;
    console.log('processDelete',data);
    if(!req.session.user){
        req.session.error = "login in first"
        res.redirect("/login");
    }
    userDao.deleteAddress(data,res,function(req,res){
        res.json({code:0,msg:'delete successful'})
    });

});
router.post('/processdata', function(req, res) {
    console.log(req.session.user);
    if(!req.session.user){
        req.session.error = "login in first";
        res.redirect("/login");
        return;
    }
    userDao.queryAll('',res);
});
module.exports = router;
