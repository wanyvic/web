var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');
var massgridrpc = require('../dao/massgridrpc');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session.user);
    if(!req.session.user){               //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login");                //未登录则重定向到 /login 路径
    }
    res.render('admin', { title: 'MassGrid' });

});
router.post('/processInsert', function(req, res) {
    var data = {
        'address':req.body.address,
        'wechat':req.body.wechat
    }
    console.log('processInsert',data);
    if(!req.session.user){               //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login");                //未登录则重定向到 /login 路径
    }

    massgridrpc.importaddress(data,res,
            function(req,res){
                userDao.insertAddress(req,res,function(req,res){
            res.json({code:0,msg:'insert successful'})
            });
        });

});
router.post('/processdata', function(req, res) {
    console.log(req.session.user);
    if(!req.session.user){               //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login");                //未登录则重定向到 /login 路径
    }
    userDao.queryAll('',res);
});
module.exports = router;
