const express = require("express");

const { Category, Exam, Question, Session, User } = require("./models");
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

/** Category */

router.get(["/categories"], authentication, function (req, res, next) {
    const { limit, offset } = req.query;
    let filters = {};
    Category.getCategories(filters, limit && parseInt(limit), offset && parseInt(offset))
        .then((categories) => {
            res.send(categories);
        })
        .catch(handleError.bind(null, res));
});

router.post(["/categories"], authentication, function (req, res, next) {
    const newCategory = req.body;
    Category.createCategory(newCategory)
        .then((createdCategory) => {
            res.status(201).send(createdCategory);
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

router.get(["/categories/:id"], authentication, function (req, res, next) {
    const {id} = req.params;
    Category.getCategory(id)
        .then((category) => {
            if (category) {
                res.send(category.toJSON());
            }
            else {
                res.status(404).send();
            }
        })
        .catch(handleError.bind(null, res));
});

router.put(["/categories/:id"], authentication, function (req, res, next) {
    const {id} = req.params;
    const updatedParams = req.body;
    Category.getCategory(id)
        .then((category) => {
            if (category) {
                return category.updateCategory(updatedParams)
                .then((updatedCategory) => {
                    res.send(updatedCategory.toJSON());
                });
            }
            else {
                res.status(404).send();
            }
        })
        .catch(handleError.bind(null, res));
});

router.delete(["/categories/:id"], authentication, function (req, res, next) {
    const {id} = req.params;
    Category.getCategory(id)
        .then((category) => {
            if (category) {
                return category.destroy()
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

/** Exam */

router.get(["/exams"], authentication, function (req, res, next) {
    const { limit, offset } = req.query;
    let filters = {};
    Exam.getExams(filters, limit && parseInt(limit), offset && parseInt(offset))
        .then((exams) => {
            res.send(exams);
        })
        .catch(handleError.bind(null, res));
});

router.post(["/exams"], authentication, function (req, res, next) {
    const newExam = req.body;
    Exam.createExamWithQuestions(newExam)
        .then((createdExam) => {
            res.status(201).send(createdExam);
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

router.get(["/exams/:id"], authentication, function (req, res, next) {
    const {id} = req.params;
    Exam.getExam(id)
        .then((exam) => {
            if (exam) {
                res.send(exam.toJSON());
            }
            else {
                res.status(404).send();
            }
        })
        .catch(handleError.bind(null, res));
});

router.put(["/exams/:id"], authentication, function (req, res, next) {
    const {id} = req.params;
    const updatedParams = req.body;
    Exam.getExam(id)
        .then((exam) => {
            if (exam) {
                return exam.updateExam(updatedParams)
                .then((updatedExam) => {
                    res.send(updatedExam.toJSON());
                });
            }
            else {
                res.status(404).send();
            }
        })
        .catch(handleError.bind(null, res));
});

router.delete(["/exams/:id"], authentication, function (req, res, next) {
    const {id} = req.params;
    Exam.getExam(id)
        .then((exam) => {
            if (exam) {
                return exam.destroy()
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

/** Question */

router.get(["/questions"], authentication, function (req, res, next) {
    const { limit, offset } = req.query;
    let filters = {};
    Question.getQuestions(filters, limit && parseInt(limit), offset && parseInt(offset))
        .then((questions) => {
            res.send(questions);
        })
        .catch(handleError.bind(null, res));
});

router.get(["/questions/:id"], authentication, function (req, res, next) {
    const {id} = req.params;
    Question.getQuestion(id)
        .then((question) => {
            if (question) {
                res.send(question.toJSON());
            }
            else {
                res.status(404).send();
            }
        })
        .catch(handleError.bind(null, res));
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