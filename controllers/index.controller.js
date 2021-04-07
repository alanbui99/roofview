const { lookup } = require('geoip-lite');

const {getFeaturedRooftops} = require("../services/rooftops.service")
exports.getHome = async (req, res, next) => {
    try {        

        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(userIp)
        console.log(lookup(userIp))
        

        const featuredRooftops = await getFeaturedRooftops()
        const heroRooftop = featuredRooftops[Math.floor(Math.random() * featuredRooftops.length)];
        return res.render("home", {featuredRooftops, heroRooftop, home: true});   
    } catch (err) {
        console.log(err)
    }
}
