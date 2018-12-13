var express = require("express"); // This line calls the express module
var app = express(); //invoke express application
const fileUpload = require('express-fileupload');
app.use(fileUpload());
var mysql = require('mysql');







var fs = require('fs');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


// we need some way for the app to know where to look
app.use(express.static("views"));

app.use(express.static("scripts"));

app.use(express.static("images"));

app.use(express.static("model"));

var contact = require("./model/contact.json") // Allow access to contact json file


// Set up a page that jsut says something 
app.get("/", function(req, res){
    
   // res.send("food");
    res.render("index.ejs");
    console.log("Home Page.")
    
});

app.get("/menus", function(req, res){
    
   // res.send("food");
    res.render("menus.ejs");
    console.log("What's on the menu?")
    
});

app.get("/contacts", function(req, res){
    
   // res.send("This is the best class ever");
    res.render("contacts.ejs", {contact});
    console.log("What's on the menu?")
    
});

app.get("/contactus", function(req, res){
    
   // res.send("This is the best class ever");
    res.render("contactus.ejs", {contact});
    console.log("What's on the menu?")
    
});


// route to render contact info page 
app.get("/addcontact", function(req, res){
    
   // res.send("This is the best class ever");
    res.render("addcontact.ejs");
    console.log("on contacts page!")
    
});


// route to render contact info page 
app.post("/addcontact", function(req, res){
    
    // function to find the max id
    
  	function getMax(contacts , id) {
		var max
		for (var i=0; i<contacts.length; i++) {
			if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
				max = contacts[i];
			
		}
		return max;
	}
	
	
	var maxPpg = getMax(contact, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
    
	// create a new product based on what we have in our form on the add page 
	
	var contactsx = {
    name: req.body.name,
    id: newId,
    details: req.body.details,
    number: req.body.number,
    price: req.body.price,
    picture: req.body.picture
    
  };
    
     console.log(contactsx);
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  // The following function reads the new data and pushes it into our JSON file
  
  fs.readFile('./model/contact.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      contact.push(contactsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./model/contact.json', json, 'utf8')
    }
    
  })
  res.redirect("/contacts");
    
    
});

app.get('/upload', function(req, res) { // Call a get request when somebody visits the main url
    res.render('upload.ejs');   // Sending a response which is just a string.
 
        
});




app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  filename = sampleFile.name;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./images/' + filename, function(err) {
    if (err)
      return res.status(500).send(err);
 console.log("Here is the image " + req.files.sampleFile)
    res.redirect('/');
  });
});










app.post('/add', function(req, res){
	var count = Object.keys(contact).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	
	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	
	function getMax(contacts , id) {
		var max
		for (var i=0; i<contacts.length; i++) {
			if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
				max = contacts[i];
			
		}
		return max;
	}
	
	var maxPpg = getMax(contact, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
	
	// create a new product based on what we have in our form on the add page 
	
	var contactsx = {
    name: req.body.name,
    id: newId,
    details: req.body.details,
    number: req.body.number,
    price: req.body.price,
    picture: req.body.picture
    
  };
    
  
  console.log(contactsx);
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  // The following function reads the new data and pushes it into our JSON file
  
  fs.readFile('./models/contact.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      contact.push(contactsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./models/contact.json', json, 'utf8')
    }
    
  })
  res.redirect("/contact");
  
});

app.get("/deletecontacts/:id", function(req, res){
    
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  var keyToFind = parseInt(req.params.id) // Getes the id from the URL
  var data = contact; // Tell the application what the data is
  var index = data.map(function(d) {return d.id;}).indexOf(keyToFind)
  console.log("variable Index is : " + index)
  console.log("The Key you ar looking for is : " + keyToFind);
  
  contact.splice(index, 1);
  json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./model/contact.json', json, 'utf8')
  res.redirect("/");
    
});


// Now we need to tell the application where to run


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Off we go again");
  
})
















