const Listing = require("../models/listing.js");
const axios = require("axios");
module.exports.index = async (req, res) => {
    const { search } = req.query;

    let allListings;

    if (search) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
            ],
        });
    } else {
        allListings = await Listing.find({});
    }

    res.render("./listings/index.ejs", { allListings });
};
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
        path: "reviews",
        populate: {
            path: "author",
            },  
        });
        if(!listing){
            req.flash("error","Listing you requested for does not exist");
            return res.redirect("/listings");
        }
        res.render("./listings/show.ejs", { listing });
    }

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const location = `${req.body.listing.location}, ${req.body.listing.country}`;

    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: location,
                format: "json",
                limit: 1,
            },
            headers: {
                "User-Agent": "TravelFun/1.0"
            }
        }
    );

    const newListing = new Listing(req.body.listing);

    if (response.data.length > 0) {
        newListing.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(response.data[0].lon),
                parseFloat(response.data[0].lat),
            ],
        };
    }

    newListing.owner = req.user._id;
    newListing.image = {
        url,
        filename,
    };

    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        res.render("./listings/edit.ejs", { listing });
    }

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
        const { id } = req.params;

        const deletedListing = await Listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted");
        console.log(deletedListing);
        res.redirect("/listings");
    }