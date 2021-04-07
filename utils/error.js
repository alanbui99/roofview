module.exports = (err, res) => {
    console.log(err)
    res.status(err.status || 500)
    res.render('error', {err})
}
