const express = require("express");
const app = express();
const morgan = require("morgan"); // The server log the activity with the help of it.
var mongoose = require("mongoose");
var schema = require("./models/schema.js");
const path = require("path");
var bodyParser = require("body-parser");
const formidable = require("express-formidable");

mongoose.connect(
  "mongodb+srv://"+process.env.USERNAME+":"+process.env.PASSWORD+"@cluster0-i73d8.mongodb.net/GeneratedReceipt?retryWrites=true&w=majority"
);

//app.use(formidable());
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "html");
app.use(express.static(__dirname + "/public"));

let user, userMail, password;

const authenticate = (req, res, next) => {
  if (user === process.env.USER && userMail === process.env.MAIL && password === process.env.PASSWORD) next()
  else res.redirect("/")
};

//User Authentication Middleware

app.get("/receipt", (req, res, next)  => {authenticate(req, res, next)});
app.post("/generateForm", (req, res, next)  => {authenticate(req, res, next)});
app.get("/generatedReceipt", (req, res, next)  => {authenticate(req, res, next)});
app.get("/getReceiptDetail", (req, res, next)  => {authenticate(req, res, next)});
app.post("/viewReceipt", (req, res, next)  => {authenticate(req, res, next)});
app.get("/allReceipts", (req, res, next)  => {authenticate(req, res, next)});
app.get("/getAllReceipts", (req, res, next)  => {authenticate(req, res, next)});


app.get("/", (req, res, next) => {
  if (user === process.env.USER && userMail === process.env.MAIL && password === process.env.PASSWORD) next()
  else res.sendFile(path.join(__dirname + "/views" + "/index.html"))
}, (req, res) => {
    res.redirect("/receipt");
});

app.post("/login", (req, res) => {
  console.log("Login");
  if (
    req.body.name === process.env.USER &&
    req.body.email === process.env.MAIL &&
    req.body.password === process.env.PASSWORD
  ) {
    user = req.body.name;
    userMail = req.body.email;
    password = req.body.password;
    res.redirect("/receipt");
  } else {
    res.send("Invalid Credentials Entered");
  }
  //res.send("Nodemon auto updates app.js when I save this file!...Cooool!!!")
});

app.get("/logout", (req, res) => {
  (user = ""), (userMail = ""), (password = "");
  res.redirect("/");
});

app.get("/receipt", (req, res) => {
    res.sendFile(path.join(__dirname + "/views" + "/receipt.html"));
});

app.post("/generateForm", (req, res) => {
    var dbmodel = mongoose.model("vendordetails", schema);
    var newdbModel = new dbmodel();
    newdbModel.custName = req.body.custName;
    newdbModel.custId = req.body.custId;
    newdbModel.custMail = req.body.custMail;
    newdbModel.custPhno = req.body.custPhno;
    newdbModel.custAddr = req.body.custAddr;
    newdbModel.invoiceNo = req.body.invoiceNo;
    newdbModel.invoiceCreated = req.body.invoiceCreated;
    newdbModel.paidOn = req.body.paidOn;
    newdbModel.paymentMode = req.body.paymentMode;
    newdbModel.noOfItems = req.body.noOfItems;

    let purchasedItems = [];
    if (Number(req.body.noOfItems) > 1) {
      for (let i = 0; i < Number(req.body.noOfItems); i++) {
        purchasedItems.push({
          item: req.body.item[i],
          quantity: Number(req.body.quantity[i]),
          unitPrice: Number(req.body.unitPrice[i]),
          total: Number(req.body.total[i]),
        });
      }
    }
    else {
      purchasedItems.push({
          item: req.body.item,
          quantity: Number(req.body.quantity),
          unitPrice: Number(req.body.unitPrice),
          total: Number(req.body.total),
        });
    }
    newdbModel.purchasedItems.push(purchasedItems);

    dbmodel
      .find({}, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          !result[0]
            ? (newdbModel.receiptNo = 1000)
            : (newdbModel.receiptNo = result[0].receiptNo + 1);
          newdbModel.save((err, saved) => {
            if (saved) {
              console.log("Document Saved Successfully!");
              res.redirect("/generatedReceipt");
            } else {
              console.log(err);
              res.send(err);
            }
          });
        }
      })
      .sort({ _id: -1 })
      .limit(1);
});

app.get("/generatedReceipt", (req, res) => {
    res.sendFile(path.join(__dirname + "/views" + "/receiptTemplate.html"));
});

app.get("/getReceiptDetail", (req, res) => {
    var dbmodel = mongoose.model("vendordetails", schema);

    dbmodel
      .find({}, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.send(result);
        }
      })
      .sort({ _id: -1 })
      .limit(1);
});

app.post("/viewReceipt", (req, res) => {
    var dbmodel = mongoose.model("vendordetails", schema);
    let id = req.body.id;

    dbmodel.find({ receiptNo: id }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(result);
      }
    });
});

app.get("/allReceipts", (req, res) => {
    res.sendFile(path.join(__dirname + "/views" + "/allreceipts.html"));
});

app.get("/getAllReceipts", (req, res) => {
    var dbmodel = mongoose.model("vendordetails", schema);

    dbmodel.find({}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result);
      }
    });
});

app.listen(process.env.PORT, () => {
  console.log("Server is up and listening on port 5000...");
});
