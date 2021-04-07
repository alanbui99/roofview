const mongoose = require("mongoose");
const Review = require("./Review");

const rooftopSchema = new mongoose.Schema({
  name: String,
  placeId: String,
  source: String,
  avgRating: Number,
  priceLevel: Number,
  desc: String,
  formattedAddress: String,
  lat: Number,
  lng: Number,
  locality: String,
  areaLevel2: String, 
  areaLevel1: String, 
  country: String,
  ratingCount: Number,
  height: String,
  view: String,
  food: String,
  openingHours: Object,
  formattedPhoneNumber: String,
  website: String,
  businessStatus: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  photos: [{
    type: String
  }],
  highlights: [{
    type: String
  }],
}, {
  timestamps: true
});

rooftopSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Rooftop", rooftopSchema);
