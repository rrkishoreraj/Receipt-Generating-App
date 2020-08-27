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

const authenticate = () => {
  return user === "admin" && userMail === "admin@ad.com" && password === "admin"
    ? true
    : false;
};

app.get("/", (req, res) => {
    if (authenticate()) {
    res.redirect("/receipt");
  }
  res.sendFile(path.join(__dirname + "/views" + "/index.html"));
});

app.post("/login", (req, res) => {
  console.log("Login");
  if (
    req.body.name === "admin" &&
    req.body.email === "admin@ad.com" &&
    req.body.password === "admin"
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
  if (authenticate()) {
    res.sendFile(path.join(__dirname + "/views" + "/receipt.html"));
  } else {
    res.redirect("/");
  }
});

app.post("/generateForm", (req, res) => {
  if (authenticate()) {
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
  } else {
    res.redirect("/");
  }
});

app.get("/generatedReceipt", (req, res) => {
  if (authenticate()) {
    res.sendFile(path.join(__dirname + "/views" + "/receiptTemplate.html"));
  } else {
    res.redirect("/");
  }
});

app.get("/getReceiptDetail", (req, res) => {
  if (authenticate()) {
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
  } else {
    res.redirect("/");
  }
});

app.post("/viewReceipt", (req, res) => {
  if (authenticate()) {
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
  } else {
    res.redirect("/");
  }
});

app.get("/allReceipts", (req, res) => {
  if (authenticate()) {
    res.sendFile(path.join(__dirname + "/views" + "/allreceipts.html"));
  } else {
    res.redirect("/");
  }
});

app.get("/getAllReceipts", (req, res) => {
  if (authenticate()) {
    var dbmodel = mongoose.model("vendordetails", schema);

    dbmodel.find({}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result);
      }
    });
  } else {
    res.redirect("/");
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is up and listening on port 5000...");
});
