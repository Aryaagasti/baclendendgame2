var express = require('express');
var router = express.Router();
const userModels = require("./users")
const passport = require('passport')
//this is for registration for user👇
const localStrategy = require('passport-local').Strategy;






/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get("/profile",IsLoggedIn,(req,res,next)=>{
  res.send('welcome to profile')
})

// this code for registration for user👇


router.post('/register', function(req,res){
  var userdata = new userModels({
    username: req.body.username,
    secret: req.body.secret,
  });

  userModels.register(userdata, req.body.password)
    .then(function(registereduser){
      passport.authenticate("local")(req,res,function(){
        res.redirect('/profile');
      })
    })
});




//code for login👇
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),(req,res)=>{})

//code for logout👇
router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    res.redirect('/')
  })
})
//code for isloggedIN middleware👇
let isLoggedIn =(req,res,next)=>{
if(req.isAuthenticated()){
  return next()
}
res.redirect("/")
}

router.get("/create",async(req,res)=>{
 let userdata = await userModels.create({
    username: "shreya",
    nickname: "shreyacute",
    description:  "i am girl of 30 and i love computer science and backend development node and react",
    categories: ['fashion','life','movies','songs'],
  })
  res.send(userdata)
})

// router.get("/find",async(req,res)=>{
//   let user = await userModels.find({username:"Arya"})
//   res.send(user)
// })// this is case data collection schema of user is made for arya some inconvencey smeeling mistake Arya data not found in database

//performing  question of intermeditate mongodb
//1) performing case insensititive search in mongoDB? 👇⭐
// whenver we try search or find user some smelling mistake is happen is if a user name start with harsh in database we make schema collection its name but some mistake we do Harsh so then data schema collection not found in collectio  therefore we perform our query case sensitive
//in regular expression ^ => state were your start
//                      $ => state where you end
router.get("/find",async(req,res)=>{
  var regex = new RegExp("^ArYA$", 'i')
  let user = await userModels.find({username: regex})
   res.send(user)
 })

//2)finding document where all array field containt all of set value?👇⭐
// this is question is all about  search elemnt categories in database accoriding user perference using this $all ->  we perform this operation 
router.get("/categoryfind",async(req,res)=>{
  let user = await userModels.find({categories:{$all: ['js']}})
  res.send(user)
})
//3) finding document data according specification of data range?👇⭐
// this question is all about your search user in database according to date created range
router.get("/finddate",async(req,res)=>{
  let date1 =  new  Date('2024-3-21')
  let date2 =  new  Date('2024-3-22')
  let user = await userModels.find({datecreated: {$gte: date1, $lte:date2}})
  res.send(user)

  res.send(date1)
})
//4)how to find files document on the existing in database?👇⭐
//this question praticing is the field in the document is exist or not
// this was the syntax => name of the field  $exisits: true/false
router.get("/findfileexit",async(req,res)=>{
  let user = await userModels.find({categories:{$exists: true}})
  res.send(user)
})
//5) how to filter documents based on a specific field length in database?👇⭐
router.get("/findlength", async(req,res)=>{
let user = await userModels.find({
  $expr:{
    $and:[
      {$gte: [{$strLenCP: '$nickname'}, 0] },
      {$lte: [{$strLenCP: '$nickname'}, 12] }
    ]
  }
})
res.send(user)
})



//flash messgae create and display 👇
// router.get('/failed', function(req, res) {
//   req.flash('age',12)
//   req.flash("name","arya")
//   res.send("bangya")
// });

// router.get('/checkkaro', function(req, res) {
//   console.log(req.flash('age'),req.flash('name'))
//   res.send("check kr lo backend ke terminal")
// });

module.exports = router;

router.post('/register', function(req,res){
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret,
  });

  userModel.register(userdata, req.body.password)
    .then(function(registereduser){
      passport.authenticate("local")(req,res,function(){
        res.redirect('/profile');
      })
    })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",    // Where to redirect on success
  failureRedirect: "/"       // Where to redirect on failure
}), function(req,res) {})

// here, passport.authenticate is written in middleware --> i.e., before reaching to function

router.get("/logout", function (req, res, next) {
  req.logout(function(err){       // passing a function to accept error
    if (err) { return next(err); }
    res.redirect('/');    // on logout, it is redirected to '/' route
  });
});

// Taking Protection by IsLoggedIn Middleware

function IsLoggedIn(req,res,next) {
  if (req.isAuthenticated()){
    return next();      // if you're loggedin --> go to next()
  }
  res.redirect('/');    // else, if not loggedin --> redirect to '/' route
}

module.exports = router;