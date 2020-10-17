const { DataTypes, Model } = require("sequelize");

const dbConnection = require("../dbConnection");

class User extends Model {

    static getUsers( filters, limit = 100, offset = 0 ) {
        const hasFilters = Object.keys(filters).length === 0 && filters.constructor === Object;
        return User.findAndCountAll({
                where: hasFilters ? filters : undefined,
                limit: limit,
                offset: offset,
                raw: true,
            })
            .then( ({rows, count} ) => {
                return rows;
            });
    }

    static createUser( {name, surname, age, email, password} ) {
        return User.create({name, surname, age, email, password})
        .catch( creationError => {
            throw creationError.errors.map( e => e.message );
        });
    }

    static getUser( id ) {
        return User.findByPk(id);
    }

    static getByCredentials( email = null, password = null ) {
        if (email && password) {
            return User.findOne({
                where: {
                    email: email,
                    password: password,
                },
            });
        }
        else {
            return Promise.resolve(null);
        }
    }

    updateUser( updatedParams ) {
        if (updatedParams.hasOwnProperty("name")) { this.name = updatedParams.name; }
        if (updatedParams.hasOwnProperty("surname")) { this.surname = updatedParams.surname; }
        if (updatedParams.hasOwnProperty("age")) { this.age = updatedParams.age; }
        if (updatedParams.hasOwnProperty("email")) { this.email = updatedParams.email; }
        if (updatedParams.hasOwnProperty("password")) { this.password = updatedParams.password; }
        return this.save();
    }
}

User.init({
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "User first name",
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "User last name",
    },
    age: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "User age",
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        comment: "User email, must be unique",
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "User password",
    },
}, {
    // Other model options go here
    sequelize: dbConnection, // We need to pass the connection instance
    timestamps: true, // Generate createdAt and updatedAt
});

module.exports = User;