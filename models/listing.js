const mongoose = require("mongoose");

const listingSchema = mongoose.Schema({
    title : {
        type: String,
        required : true
    },
    description : String ,
    image : {
        type : String , 
        default: "https://plus.unsplash.com/premium_vector-1717877061286-7c3ad795f56e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => 
            v === "" ?
            "https://plus.unsplash.com/premium_vector-1717877061286-7c3ad795f56e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
             : v,
    },
    price : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    }

});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;