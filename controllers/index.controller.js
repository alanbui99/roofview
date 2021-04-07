const {getFeaturedRooftops} = require("../services/rooftops.service")
exports.getHome = async (req, res, next) => {
    try {        
        const rooftops = await getFeaturedRooftops()
        const heroRooftop = rooftops[Math.floor(Math.random() * rooftops.length)];
        return res.render("home", {rooftops, heroRooftop, home: true});   
    } catch (err) {
        console.log(err)
    }
}
