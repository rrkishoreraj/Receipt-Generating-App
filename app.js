const express = require('express');
const app = express();
const morgan = require('morgan');  // The server log the activity with the help of it.
var mongoose = require('mongoose');
var schema = require('./models/schema.js');
const path = require('path');
var bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://'+process.env.USERNAME+':'+process.env.PASSWORD+'@cluster0-i73d8.mongodb.net/test?retryWrites=true&w=majority');


app.use(morgan('combined'));  

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('view engine', 'html');
app.use(express.static(__dirname+'/public'));



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+'/views'+'/index.html'));
})


app.post("/login", (req, res) => {
    if ((req.body.name == 'admin') && (req.body.email == 'admin@ad.com') && (req.body.password == 'admin')){
        res.redirect('/receipt');
    }
    else{
        res.send("Invalid Credentials Entered");
    }
    //res.send("Nodemon auto updates app.js when I save this file!...Cooool!!!")
});

app.get("/receipt", (req, res) => {
    res.sendFile(path.join(__dirname+'/views'+'/receipt.html'));
})

app.post("/generateForm", (req, res) => {
    //res.send(req.body.cname);
/********************************************************************************* */

var dbmodel = mongoose.model('saaaaaaaampleeee', schema);
var newdbModel = new dbmodel();
newdbModel.name = req.body.cname;

newdbModel.save((err, saved) => {
    if (saved){
      console.log('Document Saved Successfully!');
    }
    else{
      console.log(err);
    }
  });


res.send("Saved Successfully!!!");



//***************************************************************************************** */

});


app.listen(3000, () => {
    console.log('Server is up and listening on port 3000...');
})


