var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose= require("mongoose");
var methodOverride = require("method-override");
var uniqueValidator = require('mongoose-unique-validator');

var User = require("./models/user");
var Task = require("./models/task");
var Prospect = require("./models/prospect");

var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


//to handle the requested parameter by user everytime by body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
mongoose.set('useCreateIndex', true);


app.use(function(req, res, next){
   res.locals.currentUser = req.username;
   next();
});



var url = " mongodb://erpdb26:erpdb26@ds033875.mlab.com:33875/erpdbb" || "mongodb://localhost/erpdb";
mongoose.connect(url,{ useNewUrlParser: true });

// mongodb://<dbuser>:<dbpassword>@ds033875.mlab.com:33875/erpdbb

//set the view engine as ejs defalut
app.set("view engine", "ejs");

//session creation
app.use(require("express-session")({
    secret:"erp",
    resave:false,
    saveUninitialized:false
}));

//to use this command every time to use passport 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
//encode and decode
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//other LINk - ----------------------------------------------------------------------------------------------------------

app.get("/",function(req,res)
{
   res.render("startpage",{currentUser:req.user});
});
     
app.get("/register",function(req,res)
{
   res.render("register");
});

app.get("/logout",isLoggedIn,function(req,res)
{
    req.logout();
    res.redirect("/");
});

app.get("/leftnavigation",isLoggedIn, function(req,res)
{
   res.render("leftnavigation");
});



//handling user sign up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/login");
        });
         
    });
});

app.get("/login",function(req, res) {
res.render("login");    
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/leftnavigation",
    failureRedirect:"/login"
    }),function(req,res){
  
});

function isLoggedIn(req,res,next)
{
 if(req.isAuthenticated())
 {
     return next();
 }
 res.redirect("/login");
}






// TASK RELATED ---------------------------------------------------------------------------------------------------------

//CREATE - add new task to DB
app.post("/alltaskpage", isLoggedIn,function(req, res){
    // get data from form and add to array
    var id = req.body.id;
    var name = req.body.name;
    var  description= req.body.description;
    var handler=req.body.handler;
    var clientname=req.body.clientname;
    var status=req.body.status;
    var newTask = {id :id,name:name ,handler:handler,description:description,clientname:clientname,status:status}
    // Create a new task and save to DB
    
   Task.create(newTask, function(err, newlyCreated){
        if(err){
            console.log("duplicate entries");
            console.log(err);
            res.redirect("/alltaskpage/addtask");
             
        } else {
            //redirect back to campgrounds page
            res.redirect("/alltaskpage");
        }
    });
});



//NEW - show form to create new task
app.get("/alltaskpage/addtask",isLoggedIn,function(req, res) {
    res.render("task/addtask");
})

     
//INDEX - show all tasks
app.get("/alltaskpage",isLoggedIn,function(req, res) {
   Task.find({},function(err,alltasks)
   {
      if(err)
      {
         console.log(err);
      }else
      {
         res.render("task/alltaskpage",{tasks:alltasks,currentUser:req.user});
      }
   });
});

// SHOW - shows more info about one task

app.get("/alltaskpage/:id", isLoggedIn,function (req, res) {
    
    //find the campground with provided ID
    
    Task.findById(req.params.id,function (err, foundTask) {
        if (err) {
            console.log(err);
            
        } else {
            //render show template with that 
            res.render("task/showonetask", {task: foundTask,currentUser:req.user});
        }
    
});
});



// EDIT ROUTE
app.get("/alltaskpage/:id/edittask",isLoggedIn, function (req, res) {
  
    Task.findById(req.params.id, function (err, foundTask) {
         if(err)
    {
        console.log(err);
    }
    else
    {
        res.render("task/edittask", {tasks: foundTask,currentUser:req.user});
    }
    });
    
});



// // UPDATE ROUTE
app.put("/alltaskpage/:id", isLoggedIn,function (req, res) {
 
    // find and update the correct campground
    Task.findByIdAndUpdate(req.params.id, req.body.task, function (err, updatedTask) {
        if (err) {
            res.redirect("/alltaskpage");
        } else {
            
            res.redirect("/alltaskpage/" + req.params.id);
        }
    });
});


// DESTROY task ROUTE
app.delete("/alltaskpage/:id",isLoggedIn,function(req, res){
  
  Task.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/alltaskpage");
      } else {
          res.redirect("/alltaskpage");
      }
  });
});




// PROSPECT RELATED ---------------------------------------------------------------------------------------------------------



//CREATE - add new prospect to DB
    app.post("/allprospectpage", isLoggedIn,function(req, res){
    // get data from form and add to array
    var id = req.body.id;
     var name = req.body.name;
    var  description= req.body.description;
    var handler=req.body.handler;

    var newProspect = {id :id,name:name ,handler:handler,description:description}
    // Create a new task and save to DB
    
   Prospect.create(newProspect, function(err, newlyCreated1){
        if(err){
            console.log(err);
             res.redirect("/allprospectpage/addprospect");
        } else {
            //redirect back to campgrounds page
            res.redirect("/allprospectpage");
        }
    });
});


//INDEX - show all prospect
app.get("/allprospectpage",isLoggedIn,function(req, res) {
   Prospect.find({},function(err,allprospects)
   {
      if(err)
      {
         console.log(err);
      }else
      {
         res.render("prospect/allprospectpage",{prospects:allprospects,currentUser:req.user});
      }
   });
});


//NEW - show form to create new prospect
app.get("/allprospectpage/addprospect",isLoggedIn,function(req, res) {
    res.render("prospect/addprospect");
});


// SHOW - shows more info about one prospect

app.get("/allprospectpage/:id", isLoggedIn,function (req, res) {
    
    //find the campground with provided ID
    
    Prospect.findById(req.params.id,function (err, foundProspect) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that 
            res.render("prospect/showoneprospect", {prospect: foundProspect,currentUser:req.user});
        }
    
});
});


// EDIT ROUTE
app.get("/allprospectpage/:id/editprospect", isLoggedIn,function (req, res) {
  
    Prospect.findById(req.params.id, function (err, foundProspect) {
         if(err)
    {
        console.log(err);
    }
    else
    {
        res.render("prospect/editprospect", {prospects: foundProspect,currentUser:req.user});
    }
    });
    
});

// // UPDATE ROUTE
app.put("/allprospectpage/:id", isLoggedIn,function (req, res) {
 
    // find and update the correct campground
    Prospect.findByIdAndUpdate(req.params.id, req.body.prospect, function (err, updatedProspect) {
        if (err) {
            res.redirect("/allprospectpage");
        } else {
            
            res.redirect("/allprospectpage/" + req.params.id);
        }
    });
});



// DESTROY prospect ROUTE
app.delete("/allprospectpage/:id",isLoggedIn,function(req, res){
  Prospect.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/allprospectpage");
      } else {
          res.redirect("/allprospectpage");
      }
  });
});



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Has Started!");
});


