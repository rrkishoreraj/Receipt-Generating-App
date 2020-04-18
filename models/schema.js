var mongoose = require('mongoose')
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
/*
var dataSchema = mongoose.Schema({
    custname: String,
    custid: Number,
    custmail: String,
    custphno: Number,
    custaddr: String,
    invoiceno: Number,
    invoicecreated: Date,
    purchaseditems: {
        item: String,
        quantity: Number,
        unitprice: SchemaTypes.Double,
        total: SchemaTypes.Double
    }

})
*/

var dataSchema = mongoose.Schema({
    name: String
})



//var dataModel = mongoose.model('', dataSchema)
module.exports = dataSchema;    