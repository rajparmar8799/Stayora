const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");


app.set("view engine","ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

//middleware to show the currentPage 
app.use((req,res,next)=>{
    res.locals.currentPage = req.path;
    next();
})


const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/Stayora";

connectDB().catch(err => {
    console.log(err);
});

async function connectDB() {
   await mongoose.connect(MONGO_URL);
   console.log("connected to db Succesfuly");
}



//index route

app.get("/",(req,res)=>{
    res.render("listings/home",{currentPage : "home"});
})

//all listings route 

app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index",{ allListings });
})


//post new listing

app.post("/listings",(req,res)=>{
    const { listing } = req.body;
    let newListing = new Listing(listing);
    newListing.save().then(()=>{
        console.log(`${newListing.title} saved succesfully`);
        res.redirect("/listings");
    }).catch(err=>{
        console.log(err);
    })
})

//put route 

app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const { listing } = req.body;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`);

})


//create new listing form

app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
})

//show individual listing route

app.get("/listings/:id",async (req,res)=>{

    const { id } = req.params;
    const askedListing = await Listing.findById(id);

    res.render("listings/show",{ askedListing });
})



//edit the listing
//render the edit form

app.get("/listings/:id/edit",async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);

    res.render("listings/edit",{listing});

})


//delete route 

app.delete("/listings/:id/delete",async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    console.log(`listing of id ${id} is deleted succcesfully`);
    res.redirect("/listings");
})


app.listen(port,()=>{
    console.log(`app is listening at ${port}`);
})