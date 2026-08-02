const mongoose = require("mongoose");
const initData = require("./data (1).js");
const Listing = require("../models/listing.js");
main()
.then((res)=>{console.log("connection successfull")})
.catch (err=>
    console.log(err)
);
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/TravelFun");
}

const initDB = async()=>{
    Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"6a465c3af13455a98866977b" }))
    Listing.insertMany(initData.data);
    console.log("Data initialized");
}

initDB();