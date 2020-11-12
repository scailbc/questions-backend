const { DataTypes, Model } = require("sequelize");

const dbConnection = require("../dbConnection");

class Category extends Model {

    static getCategories( filters, limit = 100, offset = 0 ) {
        const hasFilters = Object.keys(filters).length === 0 && filters.constructor === Object;
        return Category.findAndCountAll({
                where: hasFilters ? filters : undefined,
                limit: limit,
                offset: offset,
                raw: true,
            })
            .then( ({rows, count} ) => {
                return rows;
            });
    }

    static createCategory( {category} ) {
        return Category.create({category})
        .catch( creationError => {
            throw creationError.errors.map( e => e.message );
        });
    }

    static getCategory( category ) {
        return Category.findByPk(category);
    }

    updateCategory( updatedParams ) {
        if (updatedParams.hasOwnProperty("category")) { this.category = updatedParams.category; }
        return this.save();
    }
}

Category.init({
    // Model attributes are defined here
    category: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        comment: "Category name",
    },
}, {
    // Other model options go here
    sequelize: dbConnection, // We need to pass the connection instance
    timestamps: true, // Generate createdAt and updatedAt
});

module.exports = Category;