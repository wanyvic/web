var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');
var massgridrpc = require('../dao/massgridrpc');

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
    var data = {
        'address':req.body.massgridaddress,
        'wechat':req.body.wechat
    }
    if(userDao.insertAddress(data,res) && massgridrpc.setaccount(data,res)){
            console.log('insert successful '); //set account
    }
});
module.exports = router;
