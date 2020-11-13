const { DataTypes, Model } = require("sequelize");

const dbConnection = require("../dbConnection");
const Option = require("./Option");

class Question extends Model {

    static TYPES = ["single_choice", "multi_choice", "open"];

    static getQuestions( filters, limit = 100, offset = 0 ) {
        const hasFilters = Object.keys(filters).length === 0 && filters.constructor === Object;
        return Question.findAndCountAll({
                include: {
                    model: Option,
                    as: "options",
                    attributes: ["id", "text", "correct"],
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

    static createQuestion( {text, type, answer, examId} ) {
        return Question.create({text, type, answer, examId})
        .catch( creationError => {
            throw creationError.errors.map( e => e.message );
        });
    }

    static createQuestionWithOptions( {text, type, answer, examId, options}, transaction = null ) {
        return new Promise( (mainResolve, mainReject) => {
            return new Promise( resolve => {
                // Create transaction if not defined
                if (transaction) {
                    resolve(transaction);
                }
                else {
                    dbConnection.transaction( newTransaction => {
                        resolve(newTransaction);
                    });
                }
            })
            .then( creationQuestionTransaction => {
                return Promise.resolve(
                    Question.create({text, type, answer, examId}, {
                        transaction: creationQuestionTransaction,
                    })
                )
                .then( createdQuestion => {
                    const newQuestion = createdQuestion.toJSON();
                    if (options) {
                        // Create the options
                        return Option.createQuestionOptions(newQuestion.id, options, creationQuestionTransaction)
                        .then( (createdOptions) => {
                            newQuestion.options = createdOptions;
                            return newQuestion;
                        });
                    }
                    else {
                        newQuestion.options = [];
                        return newQuestion;
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
            });
        });
    }

    static getQuestion( id ) {
        return Question.findByPk(id, {
            include: {
                model: Option,
                as: "options",
                attributes: ["id", "text", "correct"],
            },
        });
    }

    updateQuestion( updatedParams ) {
        if (updatedParams.hasOwnProperty("text")) { this.text = updatedParams.text; }
        if (updatedParams.hasOwnProperty("type")) { this.type = updatedParams.type; }
        if (updatedParams.hasOwnProperty("answer")) { this.answer = updatedParams.ageanswer; }
        return this.save();
    }
}

Question.init({
    // Model attributes are defined here
    text: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Question text",
    },
    type: {
        type: DataTypes.ENUM(Question.TYPES),
        allowNull: false,
        comment: "Type of question, the type of answer that require",
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "If the question is of type 'open', this is the correct answer. It's null for 'choice' types",
    },
}, {
    // Other model options go here
    sequelize: dbConnection, // We need to pass the connection instance
    timestamps: true, // Generate createdAt and updatedAt
});

Question.hasMany(Option, {as: "options", foreignKey: "questionId"});
Option.belongsTo(Question, {foreignKey: "questionId"});

module.exports = Question;