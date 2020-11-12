const express = require("express");

const { Session, User } = require("./models");
const authentication = require("./middlewares/authentication");

const router = express.Router();

function handleError(res, error) {
    res.status(422).send({
        error: error.message,
    });
}

/** Authentication */

router.post(["/registration"], function (req, res, next) {
    const newUser = req.body;
    User.createUser(newUser)
        .then((createdUser) => {
            // Create a session for the user
            Session.createSession({userId: createdUser.id, expiration: Date.now() + 86400*1000})
                    .then( newSession => {
                        res.status(201).send({
                            key: newSession.key,
                            user: createdUser.toJSON(),
                        });
                    })
                    .catch((res, error) => {
                        res.status(500).send({
                            error: error.message,
                        });
                    });
        })
        .catch( creationError => {
            if (Array.isArray(creationError)) {
                res.status(422).send({
                    error: creationError,
                });
            }
            else {
                handleError(res, creationError);
            }
        });
});

router.post(["/login"], function (req, res, next) {
    const { email, password } = req.body;

    // Check if credentials are valid
    User.getByCredentials(email, password)
        .then((user) => {
            if (user) {
                // Create a new session
                Session.createSession({userId: user.id, expiration: Date.now() + 86400*1000})
                    .then( newSession => {
                        res.status(201).send({
                            key: newSession.key,
                            user: user.toJSON(),
                        });
                    })
                    .catch((res, error) => {
                        res.status(500).send({
                            error: error.message,
                        });
                    });
            }
            else {
                res.status(401).send();
            }
        })
        .catch(handleError.bind(null, res));
});

router.post(["/logout"], authentication, function (req, res, next) {
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
                return session.destroy()
                .then(() => {
                    res.send({success: true});
                });
            }
            else {
                res.send({success: true});
            }
        })
        .catch(handleError.bind(null, res));
    }
});

/** Users */

router.get(["/users"], authentication, function (req, res, next) {
    const { limit, offset } = req.query;
    let filters = {};
    User.getUsers(filters, limit && parseInt(limit), offset && parseInt(offset))
        .then((users) => {
            res.send(users);
        })
        .catch(handleError.bind(null, res));
});

router.post(["/users"], authentication, function (req, res, next) {
    const newUser = req.body;
    User.createUser(newUser)
        .then((createdUser) => {
            res.status(201).send(createdUser);
        })
        .catch( creationError => {
            if (Array.isArray(creationError)) {
                res.status(422).send({
                    error: creationError,
                });
            }
            else {
                handleError(res, creationError);
            }
        });
});

router.get(["/users/:id"], authentication, function (req, res, next) {
    const {id} = req.params;
    User.getUser(id)
        .then((user) => {
            if (user) {
                res.send(user.toJSON());
            }
            else {
                res.status(404).send();
            }
        })
        .catch(handleError.bind(null, res));
});

router.put(["/users/:id"], authentication, function (req, res, next) {
    const {id} = req.params;
    const updatedParams = req.body;
    User.getUser(id)
        .then((user) => {
            if (user) {
                return user.updateUser(updatedParams)
                .then((updatedUser) => {
                    res.send(updatedUser.toJSON());
                });
            }
            else {
                res.status(404).send();
            }
        })
        .catch(handleError.bind(null, res));
});

router.delete(["/users/:id"], authentication, function (req, res, next) {
    const {id} = req.params;
    User.getUser(id)
        .then((user) => {
            if (user) {
                return user.destroy()
                .then(() => {
                    res.send({success: true});
                });
            }
            else {
                res.status(404).send();
            }
        })
        .catch(handleError.bind(null, res));
});

module.exports = router;