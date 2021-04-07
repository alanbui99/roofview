const geocoder = require('../configs/geocoder.config')

//models
const Rooftop = require("../models/Rooftop");

const AppError = require('../utils/AppError')

exports.getSearchedRooftops = async search => {
    try {
        search = search.toLowerCase();
        if (["usa", "america", "us"].includes(search)) {
            search = "United States"
        }
        
        const regex = new RegExp(escapeRegex(search), "gi");

        const potentialSearchFields = ['name', 'locality', 'areaLevel2', 'areaLevel1', 'country']

        const potentialSearchGroups = []

        for (const field of potentialSearchFields) {
            const foundRooftops = await Rooftop.find({ [field]: regex });
            potentialSearchGroups.push(foundRooftops)
        }

        let maxSearchGroup = []

        potentialSearchGroups.forEach(group => {
            if (group.length > maxSearchGroup.length) {
                maxSearchGroup = group
            }
        })
        
        return maxSearchGroup
    } catch (err) {
        throw new Error(err.message)
    }
}

exports.getSortedRooftops = async sortBy => {
    try {
        const criteria = [
            { type: "rateAvg", property: "avgRating", order: -1 },
            { type: "rateCount", property: "ratingCount", order: -1 },
            { type: "priceLow", property: "price", order: 1 },
            { type: "priceHigh", property: "price", order: -1 },
        ];
    
        for await (let criterion of criteria) {
            if (sortBy === criterion.type) {
                const sortedRooftops = await Rooftop.find().sort([
                    [criterion.property, criterion.order],
                ]);
                return sortedRooftops
            }
        }

    } catch (err) {
        throw new Error(err.message)
    }
}

exports.getMultipleRooftops = async (limit=null) => {
    try {
        const rooftops = await limit 
        ? Rooftop.find().limit(limit)
        : Rooftop.find();

        return rooftops

    } catch (err) {
        throw new Error(err.message)
    }
}

exports.getRooftopById = async (id, populateReviews=true) => {
    try {
        const rooftop = await populateReviews 
        ? Rooftop.findById(id).populate("reviews")
        : Rooftop.findById(id);

        if (!rooftop) throw new AppError("Rooftop Not Found", 404)
        return rooftop;
    } catch (err) {
        throw new Error(err.message)
    }
}

exports.getFeaturedRooftops = async () => {
    try {
        const featuredNames = ['Baba Nest, Sri Panwa Phuket', "Harriet's Rooftop & Lounge", "Los Patios Hostel Boutique - The Best Hostel Medellin", "Mahanakhon Bangkok Skybar", "Terrat", "The Press Lounge", "The Silo Hotel", "Wooloomooloo Steakhouse (Wan Chai)"]
        const rooftops = await Rooftop.find({name: {$in: featuredNames}})
        return rooftops

    } catch (err) {
        throw new Error(err.message)
    }
}

exports.createRooftop = async (payload) => {
    try {
        let createdRooftop
        
        const geocodingPayload = await exports.getGeocoding(payload.address)
        delete payload.address

        newRooftop = new Rooftop({ ...payload,  ...geocodingPayload});
        await newRooftop.save()
        .then(savedRooftop => {
            createdRooftop = savedRooftop
        })

        return createdRooftop

    } catch (err) {
        throw new Error(err.message)
    }
}

exports.updateRooftopById = async (id, payload) => {  
    try {
        const geocodingPayload = await exports.getGeocoding(payload.address)
        delete payload.address
    
        const updatedRooftop = Rooftop.findByIdAndUpdate(id, { ...payload,  ...geocodingPayload}, {new: true})
    
        if (!updatedRooftop) throw new Error('Failed to update rooftop')
    
        return updatedRooftop

    } catch (err) {
        throw new Error(err.message)
    }  
}

exports.deleteRooftopById = async id => {
    try {
        let deletedRooftop;
        
        await Rooftop.findByIdAndDelete(id)
        .then(doc => deletedRooftop = doc)

        return deletedRooftop;
    } catch (err) {
        throw new Error(err.message)
    }
}

exports.getGeocoding = async address => {
    try {
        const data = await geocoder.geocode(address);
        if (!data.length) throw new Error('Invalid address');
    
        const lat = data[0].latitude;
        const lng = data[0].longitude;
        const location = data[0].formattedAddress;
        const city =  data[0].city;
        const country =  data[0].country;

        return { lat, lng, location, city, country };

    } catch (err) {
        throw new Error(err.message)
    }
}

const escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};