
var express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var router = express.Router();
let indexController = require('../controllers/indexController.js');
let userController = require('../controllers/userController.js');
let passport = require("passport");
let User = require('../models/users');
let Student = require('../models/students');
let Staff = require('../models/staffs');
let Admin = require('../models/admins')
const multer =require("multer");
var base64 = require('base-64');
const methodOverride = require("method-override");
const cloudinary = require('cloudinary');
const cloudinaryStorage = require("multer-storage-cloudinary")

cloudinary.config({
cloud_name: "dyieekcre",
api_key: "732513327822775",
api_secret: "HzlXLGG447c9m92q6a8vhWoiR-c"
});
const storage = cloudinaryStorage({
cloudinary: cloudinary,
folder: "demo",
allowedFormats: ["jpg", "png"],
});


const parser = multer({ storage: storage }).fields([{name: "passport"},{name: "sign"}]);

function  isLoggedIn(req, res,next){
  
  if (req.isAuthenticated()){
    return next()
  }
     res.redirect('/login')
}


router.get('/logout', function(req, res, next){
  req.logout()
  res.redirect('/')
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
 
  Admin.findOne({email: req.user.email}).then((result)=>{
    if (result){
        console.log(result)
      Student.find({email: req.user.email}).then((doc)=>{
        if(doc){
              console.log(doc)
      res.render('generateStudent', {result, doc});
        } else{
      res.send("Please go to the registrer student portal to register Students details ");
        }
      })
    } else{
      res.send("Please go to the Create card details to create card details")
    }   
  })

});




router.get('/generateStaff', isLoggedIn, function(req, res, next) {
  
  Admin.findOne({email: req.user.email}).then((result)=>{
    if (result){
        console.log(result)
      Staff.find({email: req.user.email}).then((doc)=>{
        if(doc){
              console.log(doc)
      res.render('generateStaff', {result, doc});
        } else{
      res.send("Please go to the registrer staff portal to register Staff details ");
        }
      })
    } else{
      res.send("Please go to the Create card details to create card details")
    }   
  })
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


// const  storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './public/uploads');
//   },
//   filename: function(req, file, cb){
//     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//   }
// })


// var upload = multer({
//   storage: storage ,
//   //limits: {fileSize: 10},
//   fileFilter: function(req, file, cb){
//     checkFileType(file, cb);
//   }
// }).fields([
//   {name: "passport"},
//   {name: "sign"}
// ]);

// //check file type 
// function checkFileType(file, cb){
//   //Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // check ext
//   const extname = filetypes.test(path.extname
//   (file.originalname).toLowerCase());
//   //check mime
//   const mimetype = filetypes.test(file.mimetype)

//   if(mimetype && extname){
//     return cb(null, true);
//   }else {
//     cb('Error: images Only!')
//   }
// }



router.post('/register/student', function(req, res, next){
let isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}

    parser(req, res, (err) => {
var request = require('request').defaults({ encoding: null });
      let yo = req.files["passport"][0].secure_url;
  
// // console.log(req.files)
request.get(yo, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        encoded = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        // console.log(encoded);

      let userMail = req.user.email;

               let newStudent = new Student();
          newStudent.email= userMail;
           newStudent.passport = encoded;
           newStudent.studentName= req.body.studentName;
           newStudent.reg= req.body.reg;
           newStudent.class= req.body.class;
           newStudent.gender= req.body.gender;
           newStudent.role=req.body.role;


         newStudent.save().then((result)=>{
           if(result){
              req.flash('success', "Successful");
             res.redirect("/registerStudent");
           }else{
             res.send("err")
           }
         })
             
     // res.send("test")

    }
});      
    
  })
           
})



router.post('/register/staff', function(req, res, next){
  let isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}

    parser(req, res, (err) => {
      var request = require('request').defaults({ encoding: null });
      let yo = req.files["passport"][0].secure_url;
  
// // console.log(req.files)
request.get(yo, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        encoded = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        // console.log(encoded);

   
    if (isEmpty(req.files)){
    res.send("No image Uploaded")
    }else{
      let userMail = req.user.email;

               let newStaff = new Staff();
          newStaff.email= userMail;
           newStaff.passport = encoded;
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
  }
})           
})
})



router.post('/register/admin', function(req, res, next){
let isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}
let isOne = function(obj) {
  return Object.keys(obj).length === 1;
}
            parser(req, res, (err) => {
    var request = require('request').defaults({ encoding: null });
      let yo = req.files["passport"][0].secure_url;
      let bo = req.files["sign"][0].secure_url;              

// // console.log(req.files)
request.get(yo, function (error, response, body) {
request.get(bo, function (error, response, cont) {
  
    if (!error && response.statusCode == 200) {
        encoded = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        bobo = "data:" + response.headers["content-type"] + ";base64," + new Buffer(cont).toString('base64');
        // console.log(encoded);
 

   if (isEmpty(req.files)){
    res.send("No image Uploaded")
    }else if (isOne(req.files)){
    res.send("Upload Second Image")
    }else{
      console.log( req.files["sign"][0].secure_url);
       let userMail = req.user.email;
 Admin.findOne({email: userMail}).then(function(result){
   if (!result){ 


               let newAdmin = new Admin();
          newAdmin.email= userMail;
           newAdmin.passport =  encoded;
           newAdmin.schoolName= req.body.schoolName;
           newAdmin.address= req.body.address;
           newAdmin.validity= req.body.validity;
           newAdmin.caution = req.body.caution;
          newAdmin.sign = bobo;           
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

    }        
    })
            })
              
     
  })           
})



router.put('/register/admin/update', function (req, res){
let isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}
let isOne = function(obj) {
  return Object.keys(obj).length === 1;
}
            parser(req, res, (err) => {
    var request = require('request').defaults({ encoding: null });
      let yo = req.files["passport"][0].secure_url;
      let bo = req.files["sign"][0].secure_url;              

// // console.log(req.files)
request.get(yo, function (error, response, body) {
request.get(bo, function (error, response, cont) {
  
    if (!error && response.statusCode == 200) {
        encoded = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        bobo = "data:" + response.headers["content-type"] + ";base64," + new Buffer(cont).toString('base64');
        // console.log(encoded);
 

   if (isEmpty(req.files)){
    res.send("No image Uploaded")
    }else if (isOne(req.files)){
    res.send("Upload Second Image")
    }else{
     
      
 let userMail = req.user.email;
         
      Admin.findOneAndUpdate({email: userMail},
       {$set:{passport: encoded, 
       schoolName: req.body.schoolName, 
       address:req.body.address,
      validity: req.body.validity,
      caution: req.body.caution,
      sign: bobo,
      }}, 
       {new: true})
      .then((result)=>{
          if (result) {
              req.flash('success', "Successful");
             res.redirect("/updateidcard");
          } else {
            res.send("error")
          }
      })      
    }

    }        
    })
            })
              
     
  })           
})

router.get('/welcome', function(req, res, next){
  res.render('intro')
})
  





       

 

module.exports = router;
