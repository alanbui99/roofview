const fs = require("fs");
const fetch = require("node-fetch");
const faker = require("faker");

const Rooftop = require("../models/Rooftop");
const User = require("../models/User");

const {createReview} = require("../services/reviews.service")

const execute = async () => {
    try {
        const rawData = fs.readFileSync("./data.json");
        const rooftops = JSON.parse(rawData);

        for await (const rooftop of rooftops) {
            const placeId = await placeSearch(`${rooftop.name} ${rooftop.city}`);
            if (placeId) {
                const details = await placeDetails(placeId);
                const addressComponents = extractAddressComponents(details.address_components)
                const photoUrls = [];
                if (details.photos) {
                    for await (const photo of details.photos) {
                        const photoUrl = await placePhotos(photo.photo_reference);
                        photoUrls.push(photoUrl);
                    }
                }
                // console.log(details)
                const newRooftop = await createRooftop({ ...rooftop, ...details, ...addressComponents, photoUrls });
                await seedReviews(details.reviews, newRooftop.id)
            }        
        }
    } catch(err) {
        console.log(err)
    }
};

const seedReviews = async (reviews, rooftopId) => {
    try {

        const authors = await User.find({isActual: false})

        for await (const review of reviews) {
            let payload = {}
            const idx = Math.floor(Math.random() * authors.length);
            payload.author = {
                id: authors[idx].id,
                firstName: authors[idx].firstName,
                lastName: authors[idx].lastName
            }

            payload.rating = review.rating;
            payload.text = review.text;
            await createReview(rooftopId, { ...payload });

        }

        console.log(rooftopId)
    
    } catch (err) {
        console.log(err)
    }
}

const seedUsers = async (num) => {
    for (let i = 0; i < num; i++) {
        try {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();

            const user = new User({
                firstName,
                lastName,
                email: `${firstName}${lastName}@gmail.com`,
                username: `${firstName}${lastName}@gmail.com`,
                isActual: false,
            });

            const registeredUser = await User.register(
                user,
                `${firstName}${lastName}@fakeUser`
            );
            console.log(registeredUser);
        } catch (err) {
            console.log(err);
        }
    }
};

const placeSearch = async (input) => {
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=textquery&fields=place_id&key=${process.env.GEOCODER_KEY}`;
    let placeId;

    await fetch(url)
        .then((response) => response.json())
        .then(async (data) => {
            if (data.candidates.length === 1) {
                placeId = data.candidates[0].place_id;
            }
        })
        .catch((err) => console.log(err));

    return placeId;
};

const placeDetails = async (placeId) => {
    let details;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=business_status,address_components,formatted_address,formatted_phone_number,geometry,name,opening_hours,photos,place_id,price_level,reviews,website&key=${process.env.GEOCODER_KEY}`;
    await fetch(url)
        .then((response) => response.json())
        .then((data) => (details = data.result))
        .catch((err) => console.log(err));
    return details;
};

const placePhotos = async (photoReference) => {
    let photoUrl;
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1248&photoreference=${photoReference}&key=${process.env.GEOCODER_KEY}`;
    await fetch(url)
        .then((response) => {
            photoUrl = response.url;
        })
        .catch((err) => console.log(err));

    return photoUrl;
};

const createRooftop = async (payload) => {
    let createdRooftop
    const rooftop = new Rooftop({
        name: payload.name,
        priceLevel: payload.price_level,
        desc: payload.desc,
        formattedAddress: payload.formatted_address,
        lat: payload.geometry.location.lat,
        lng: payload.geometry.location.lng,
        locality: payload.locality,
        areaLevel2: payload.areaLevel2,
        country: payload.country,
        height: payload.height,
        view: payload.view,
        food: payload.food,
        openingHours: payload.opening_hours,
        formattedPhoneNumber: payload.formatted_phone_number,
        website: payload.website,
        businessStatus: payload.business_status,
        photos: payload.photoUrls,
        highlights: payload.features,
    });

    await rooftop.save()
    .then(savedRooftop => {
        createdRooftop = savedRooftop
    })
    .catch(err => console.log(err))

    return createdRooftop
};

const extractAddressComponents = (addressComponents) => {
    let locality;
    let areaLevel2;
    let country;

    addressComponents.forEach((component) => {
        if (component.types[0] === "locality") locality = component.long_name;
        if (component.types[0] === "administrative_area_level_2")
        areaLevel2 = component.short_name;
        if (component.types[0] === "country") country = component.long_name;
    });

    return { locality, areaLevel2, country };
};


const getMissingInfo = async () => {
    try {
        let count = 0
        const allRooftops = await Rooftop.find({source: {$exists: false}, placeId: {$exists: false}})

        for await (const rooftop of allRooftops) {
            let searchString = rooftop.name

            const fields = ['locality', 'country']

            fields.forEach(field => {
                if (rooftop[field]) {
                    searchString += ' '
                    searchString += rooftop[field]
                }
            })

            searchString = encodeURI(searchString)
            const placeId = await placeSearch(searchString);

            if (placeId) {
                rooftop.placeId = placeId

                const details = await placeDetails(placeId)

                if (details.formatted_address) {
                    rooftop.formattedAddress = details.formatted_address
                }

                details.address_components.forEach((component) => {
                    if (component.types[0] === "administrative_area_level_1") {
                        rooftop.areaLevel1 = component.long_name
                    }
                })

                rooftop.save()
                .then(doc => {
                    console.log(doc);
                    count += 1
                })
                .catch(err => console.log(err))

                console.log('COUNT: ', count)
            }
        }

    } catch (err) {
        console.log(err)
    }
}

module.exports = { execute, getMissingInfo };
