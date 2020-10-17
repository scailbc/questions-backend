const { DataTypes, Model, Sequelize } = require("sequelize");

const dbConnection = require("../dbConnection");
const User = require("./User");

class Session extends Model {

    static createSession( {userId, expiration} ) {
        return Session.create({userId, expiration})
        .catch( creationError => {
            throw creationError.errors.map( e => e.message );
        });
    }

    static getSession( sessionToken ) {
        return Session.findByPk(sessionToken);
    }

}

Session.init({
    // Model attributes are defined here
    key: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4, // generate UUIDs automatically
        comment: "Authentication token",
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
        comment: "User associated to this session",
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "Expiration UTC date of this token",
    },
}, {
    // Other model options go here
    sequelize: dbConnection, // We need to pass the connection instance
    timestamps: true, // Generate createdAt and updatedAt
    updatedAt: false, // I don't want updatedAt
});

module.exports = Session;