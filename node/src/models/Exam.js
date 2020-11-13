const { DataTypes, Model } = require("sequelize");

const dbConnection = require("../dbConnection");
const Category = require("./Category");
const Option = require("./Option");
const Question = require("./Question");

class Exam extends Model {

    static getExams( filters, limit = 100, offset = 0 ) {
        const hasFilters = Object.keys(filters).length === 0 && filters.constructor === Object;
        return Exam.findAndCountAll({
                include: {
                    model: Question,
                    as: "questions",
                    attributes: ["id", "text", "type", "answer"],
                    include: {
                        model: Option,
                        as: "options",
                        attributes: ["id", "text", "correct"],
                    },
                },
                where: hasFilters ? filters : undefined,
                limit: limit,
                offset: offset,
                raw: false, // Get as model to have the questions as an array
            })
            .then( ({rows, count} ) => {
                return rows;
            });
    }

    static createExam( {title, category} ) {
        return Exam.create({title, category})
        .catch( creationError => {
            throw creationError.errors.map( e => e.message );
        });
    }

    static createExamWithQuestions( {title, category, questions} ) {
        return new Promise( (mainResolve, mainReject) => {
            dbConnection.transaction( creationExamTransaction => {
                return Promise.resolve(
                    Exam.create({title, category}, {
                        transaction: creationExamTransaction,
                    })
                )
                .then( createdExam => {
                    const newExam = createdExam.toJSON();
                    // Create the questions, questions will create the options
                    if (questions) {
                        return Promise.all(questions.map( q => {
                            return Question.createQuestionWithOptions({...q, examId: newExam.id}, creationExamTransaction);
                        }))
                        .then( (createdQuestions) => {
                            newExam.questions = createdQuestions;
                            return newExam;
                        });
                    }
                    else {
                        newExam.questions = [];
                        return newExam;
                    }
                });
            })
            .then(mainResolve)
            .catch( creationError => {
                // Transaction failed, it will automatically rollback and undo the whole operation
                if (creationError.errors && Array.isArray(creationError.errors)) {
                    mainReject(creationError.errors.map( e => e.message ));
                }
                else {
                    mainReject(creationError);
                }
            })
        });
    }

    static getExam( id ) {
        return Exam.findByPk(id, {
            include: {
                model: Question,
                as: "questions",
                attributes: ["id", "text", "type", "answer"],
                include: {
                    model: Option,
                    as: "options",
                    attributes: ["id", "text", "correct"],
                },
            },
        });
    }

    updateExam( updatedParams ) {
        if (updatedParams.hasOwnProperty("title")) { this.title = updatedParams.title; }
        if (updatedParams.hasOwnProperty("category")) { this.category = updatedParams.category; }
        return this.save();
    }
}

Exam.init({
    // Model attributes are defined here
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Exam name",
    },
}, {
    // Other model options go here
    sequelize: dbConnection, // We need to pass the connection instance
    timestamps: true, // Generate createdAt and updatedAt
});

Exam.belongsTo(Category, {foreignKey: "category"});
Exam.hasMany(Question, {as: "questions", foreignKey: "examId"});
Question.belongsTo(Exam, {foreignKey: "examId"});

module.exports = Exam;