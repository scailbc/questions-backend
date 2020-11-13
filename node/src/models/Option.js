const { DataTypes, Model } = require("sequelize");

const dbConnection = require("../dbConnection");

class Option extends Model {

    static getOptions( filters, limit = 100, offset = 0 ) {
        const hasFilters = Object.keys(filters).length === 0 && filters.constructor === Object;
        return Option.findAndCountAll({
                where: hasFilters ? filters : undefined,
                limit: limit,
                offset: offset,
                raw: true,
            })
            .then( ({rows, count} ) => {
                return rows;
            });
    }

    static createOption( {text, correct, questionId}, transaction = null ) {
        return Option.create({text, correct, questionId}, {
            transaction: transaction ? transaction : undefined,
        })
        .catch( creationError => {
            throw creationError.errors.map( e => e.message );
        });
    }

    static createQuestionOptions( questionId, options, transaction = null ) {
        return Option.bulkCreate(options.map( ({text, correct}) => {
            return {text, correct, questionId};
        }), {
            transaction: transaction ? transaction : undefined,
        })
        .catch( creationError => {
            if (creationError.errors && Array.isArray(creationError.errors)) {
                throw creationError.errors.map( e => e.message );
            }
            else {
                throw creationError;
            }
        });
    }

    static getOption( id ) {
        return Option.findByPk(id);
    }

    updateOption( updatedParams ) {
        if (updatedParams.hasOwnProperty("text")) { this.text = updatedParams.text; }
        if (updatedParams.hasOwnProperty("correct")) { correct.type = updatedParams.correct; }
        // if (updatedParams.hasOwnProperty("questionId")) { this.questionId = updatedParams.questionId; }
        return this.save();
    }
}

Option.init({
    // Model attributes are defined here
    text: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Option text",
    },
    correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: "If the option is a correct answer for its question",
    },
}, {
    // Other model options go here
    sequelize: dbConnection, // We need to pass the connection instance
    timestamps: true, // Generate createdAt and updatedAt
});

module.exports = Option;