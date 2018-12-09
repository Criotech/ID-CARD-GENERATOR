
var express = require('express');
const path = require('path');
var router = express.Router();
let indexController = require('../controllers/indexController.js');
let userController = require('../controllers/userController.js');
let passport = require("passport");
let User = require('../models/users');
let Student = require('../models/students');
let Staff = require('../models/staffs');
let Admin = require('../models/admins')
const multer =require("multer");
const methodOverride = require("method-override");


function  isLoggedIn(req, res,next){
  
  if (req.isAuthenticated()){
    return next()
  }
     res.redirect('/login')
}


router.get('/logout', function(req, res, next){
  req.logout()
  res.redirect('/login')
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/signup', userController.signup);



router.get('/login', function(req, res, next) {
  res.render('login');
});


router.get('/admindashboard', isLoggedIn, function(req, res, next) {
  res.render('admindashboard');
});


router.get('/registerStudent', isLoggedIn, function(req, res, next) {
    let success = req.flash('success');

  res.render('registerStudent', {success});
});


router.get('/adminPortal', isLoggedIn, function(req, res, next) {
    let success = req.flash('success');
    let failure = req.flash('failure');

   res.render('adminPortal', {success, failure});        

});

router.get('/updateidcard', isLoggedIn, function(req, res, next){
    let success = req.flash('success');

   res.render('updatePortal', {success});        
})

router.get('/registerStaff', isLoggedIn, function(req, res, next) {
    let success = req.flash('success');
  res.render('registerStaff', {success});
    
});

router.get('/generateStudent', isLoggedIn, function(req, res, next) {
 
  res.render('generateStudent');

});




router.get('/generateStaff', isLoggedIn, function(req, res, next) {
 
  res.render('generateStaff');

});


router.post('/createAccount', passport.authenticate('local.registerAdmin',{
  successRedirect: '/admindashboard',
  failureRedirect: '/signup',
  failureFlash: true
}))


router.post('/login/admin', passport.authenticate('local.loginAdmin',{
  successRedirect: '/admindashboard',
  failureRedirect: '/login',
  failureFlash: true
}))


const  storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
})


var upload = multer({
  storage: storage ,
  //limits: {fileSize: 10},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).fields([
  {name: "passport"},
  {name: "sign"}
]);

//check file type 
function checkFileType(file, cb){
  //Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // check ext
  const extname = filetypes.test(path.extname
  (file.originalname).toLowerCase());
  //check mime
  const mimetype = filetypes.test(file.mimetype)

  if(mimetype && extname){
    return cb(null, true);
  }else {
    cb('Error: images Only!')
  }
}


router.post('/register/student', function(req, res, next){

            upload(req, res, (err) => {
    if (err){
    
    //res.render('students', {msg : err})
   res.send(err)
    } else if (req.files == undefined){
    res.send("No image Uploaded")
    }else{
      console.log(`/uploads/${req.files["passport"][0].filename}`);
      let userMail = req.user.email;
               let newStudent = new Student();
          newStudent.email= userMail;
           newStudent.passport = `/uploads/${req.files["passport"][0].filename}`;
           newStudent.studentName= req.body.studentName;
           newStudent.reg= req.body.reg;
           newStudent.class= req.body.class;
           newStudent.gender= req.body.gender;
           newStudent.role=req.body.role;

         newStudent.save().then((result)=>{
           if(result){
             console.log(result)
              req.flash('success', "Successful");
             res.redirect("/registerStudent");
           }else{
             res.send("err")
           }
         })
         
     res.send("test")
    }
  })
               
})



router.post('/register/staff', function(req, res, next){

            upload(req, res, (err) => {
    if (err){
    
   res.send(err)
    } else if (req.files == undefined){
    res.send("No image Uploaded")
    }else{
      let userMail = req.user.email;

               let newStaff = new Staff();
          newStaff.email= userMail;
           newStaff.passport = `/uploads/${req.files["passport"][0].filename}`;
           newStaff.staffName= req.body.staffName;
           newStaff.reg= req.body.reg;
           newStaff.gender= req.body.gender;
           newStaff.position = req.body.position;
           newStaff.role=req.body.role;

         newStaff.save().then((result)=>{
           if(result){
              req.flash('success', "Successful");
             res.redirect("/registerStaff");
           }else{
             res.send("err")
           }
         })
             
     // res.send("test")
    }
  })
           
})



router.post('/register/admin', function(req, res, next){

            upload(req, res, (err) => {
    if (err){
    
   res.send(err)
    }else if (req.files == undefined){
    res.send("No image Uploaded")
    }else{
      console.log( `/uploads/${req.files["sign"][0].filename}`);
       let userMail = req.user.email;
 Admin.findOne({email: userMail}).then(function(result){
   if (!result){ 


               let newAdmin = new Admin();
          newAdmin.email= userMail;
           newAdmin.passport =  `/uploads/${req.files["passport"][0].filename}`;
           newAdmin.schoolName= req.body.schoolName;
           newAdmin.address= req.body.address;
           newAdmin.validity= req.body.validity;
           newAdmin.caution = req.body.caution;
          newAdmin.sign =  `/uploads/${req.files["sign"][0].filename}`;           
           newAdmin.role=req.body.role;

         newAdmin.save().then((result)=>{
           console.log(result)
           if(result){
              req.flash('success', "Successful");
             res.redirect("/adminPortal");
           }else{
                          res.send("err")
           }
         })

   }else{
               req.flash('failure', "Sorry The User Already Exist. Click On The Update Link TO Update Data");
             res.redirect("/adminPortal");

    // console.log("sorry cannot save new data")
   }

 })

    }
  })           
})



router.put('/register/admin/update', function (req, res){
  upload(req, res, (err) => {
    if (err){
    
    //res.render('students', {msg : err})
   res.send(err)
    } else if (req.files == undefined){
        //res.render('students', {msg : 'No image Uploaded'})
    res.send("No image Uploaded")
    }else{
       let userMail = req.user.email;
         
      Admin.findOneAndUpdate({email: userMail},
       {$set:{passport:  `/uploads/${req.files["passport"][0].filename}`, 
       schoolName: req.body.schoolName, 
       address:req.body.address,
      validity: req.body.address,
      caution: req.body.caution,
      sign: `/uploads/${req.files["sign"][0].filename}`,
      }}, 
       {new: true})
      .then((result)=>{
          if (result) {
              req.flash('success', "Successful");
             res.redirect("/updatePortal");
          } else {
            res.send("error")
          }
      })
             
     // res.send("test")
    }
  })
})



 

module.exports = router;
