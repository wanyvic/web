var express = require('express');
var router = express.Router();

/* GET login listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'MassGrid' });
});
router.post('/processLogin', function(req, res) {
  console.log(req.body.username,req.body.password)
  if(req.body.username =="wany" && req.body.password == "123456"){
    req.session.user = req.body.username;
    res.redirect('../admin');
  }
  res.redirect('../');
});
module.exports = router;
