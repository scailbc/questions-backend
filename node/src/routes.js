const express = require("express");

const { User } = require("./models");

const router = express.Router();

function handleError(res, error) {
    res.status(422).send({
        error: error.message,
    });
}

/** Users */

router.get(["/users"], function (req, res, next) {
    const { limit, offset } = req.query;
    let filters = {};
    User.getUsers(filters, limit && parseInt(limit), offset && parseInt(offset))
        .then((users) => {
            res.send(users);
        })
        .catch(handleError.bind(null, res));
});

router.post(["/users"], function (req, res, next) {
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

router.get(["/users/:id"], function (req, res, next) {
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

router.put(["/users/:id"], function (req, res, next) {
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

router.delete(["/users/:id"], function (req, res, next) {
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