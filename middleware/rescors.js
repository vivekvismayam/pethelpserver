module.exports = function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    // Set custom headers for CORS
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-*", "true");
    console.log('Middleware Cors')
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    return next();
};