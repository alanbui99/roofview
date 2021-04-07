const passport = require("passport");

const User = require('../models/User')

exports.createUser = async payload => {
    try {
        const { firstName, lastName, email, password } = payload
        const user = new User({ firstName, lastName, email, username: email })
        const registeredUser = await User.register(user, password)
        return registeredUser
    } catch (err) {
        throw (new Error(err.message))
    }
}