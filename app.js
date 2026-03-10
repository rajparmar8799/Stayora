const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");


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


//create new listing

app.post("/listings",wrapAsync(async (req,res)=>{
    const { listing } = req.body;
    let newListing = new Listing(listing);
    await newListing.save();
    console.log(`${newListing.title} saved succesfully`);
    res.redirect("/listings");
}))

//put route (after user press update button)

app.put("/listings/:id", wrapAsync(async(req, res,next) => {
        const { id } = req.params;
        const { listing } = req.body;
        await Listing.findByIdAndUpdate(id, listing);
        res.redirect(`/listings/${id}`);
}))


//render new listing form

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

app.delete("/listings/:id",async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    console.log(`listing of id ${id} is deleted succcesfully`);
    res.redirect("/listings");
})

//page not found route 

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

// //error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something went wrong"} = err;
    res.status(statusCode).send(message);
})

app.listen(port,()=>{
    console.log(`app is listening at ${port}`);
})