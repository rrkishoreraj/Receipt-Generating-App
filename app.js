const express = require("express");
const app = express();
const morgan = require("morgan"); // The server log the activity with the help of it.
var mongoose = require("mongoose");
var schema = require("./models/schema.js");
const path = require("path");
var bodyParser = require("body-parser");
const formidable = require("express-formidable");

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0-i73d8.mongodb.net/GeneratedReceipt?retryWrites=true&w=majority"
);

app.use(formidable());
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "html");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views" + "/index.html"));
});

app.post("/login", (req, res) => {
  if (
    req.fields.name == "admin" &&
    req.fields.email == "admin@ad.com" &&
    req.fields.password == "admin"
  ) {
    res.redirect("/receipt");
  } else {
    res.send("Invalid Credentials Entered");
  }
  //res.send("Nodemon auto updates app.js when I save this file!...Cooool!!!")
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
  for (let i = 0; i < req.body.noOfItems; i++) {
    purchasedItems.push({
      item: req.body.item[i],
      quantity: Number(req.body.quantity[i]),
      unitPrice: parseFloat(req.body.unitPrice[i]),
      total: parseFloat(req.body.total[i]),
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

app.post("/getReceiptDetail", (req, res) => {
  var dbmodel = mongoose.model("vendordetails", schema);
  id = Number(req.fields.id);
  console.log(req.fields);
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

app.listen(5000, () => {
  console.log("Server is up and listening on port 5000...");
});
