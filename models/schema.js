var mongoose = require("mongoose");
require("mongoose-double")(mongoose);

var SchemaTypes = mongoose.Schema.Types;

var dataSchema = mongoose.Schema({
  custName: String,
  custId: Number,
  custMail: String,
  custPhno: Number,
  custAddr: String,
  invoiceNo: Number,
  receiptNo: Number,
  invoiceCreated: Date,
  paidOn: Date,
  paymentMode: String,
  noOfItems: Number,
  purchasedItems: Array,
});

/*
var dataSchema = mongoose.Schema({
    name: String
})

{
    item: String,
    quantity: Number,
    unitPrice: SchemaTypes.Double,
    total: SchemaTypes.Double,
  },
*/

//var dataModel = mongoose.model('', dataSchema)
module.exports = dataSchema;
