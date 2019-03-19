var express = require('express');
var router = express.Router();
var user = require('../conf/conf').users;

/* GET login listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'MassGrid' });
});
router.post('/processLogin', function(req, res) {
  console.log(req.body.username,req.body.password)
  if(req.body.username ==user.user && req.body.password == user.pwd){
    req.session.user = req.body.username;
    res.redirect('../admin');
    return;
  }
  res.redirect('../');
});
module.exports = router;
