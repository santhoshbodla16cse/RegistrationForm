  
var express = require('express');
var router = express.Router();

//Get Homepage
router.get('/', function (req, res) {
  res.render('index');
});

// router.get('/:action',(req,res)=>{
//   res.redirect(`/users/${req.params.action}`)
// })


module.exports = router;