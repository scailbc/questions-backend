const { Session } = require("../models");

module.exports = function ( req, res, next ) {
    if (!req || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        res.status(401).send({
            success: false,
            message: "Invalid token",
        });
        next("route");
    } 
    else {
        const token = req.headers.authorization.split(" ")[1];
        Session.getSession(token)
        .then( session => {
            if (session) {
                if (session.expiration < Date.now()) {
                    // Session expired
                    session.destroy()
                    .then(() => {
                        res.status(401).send({
                            success: false,
                            message: "Token expired",
                        });
                        next("route");
                    });
                }
                else {
                    next();
                }
            }
            else {
                // Invalid token
                res.status(401).send({
                    success: false,
                    message: "Invalid token",
                });
                next("route");
            }
        })
        .catch( error => {
            res.status(500).send({
                success: false,
                message: error.message,
            });
            next("route");
        });
    }
};
