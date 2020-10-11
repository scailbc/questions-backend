const { Sequelize } = require("sequelize");

// Connect to database
const {DB_HOST, DB_PORT, MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USER} = process.env;
const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: true,
});

function testConnection() {
    return sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .then(() => {
            // performs the necessary changes in the table to make it match the model
            return sequelize.sync({alter: true});
        })
        .catch(error => {
            if ( error.name === "SequelizeConnectionError" && error.original && error.original.code === "PROTOCOL_CONNECTION_LOST") {
                // Probably the container of thw DB is still startig
                setTimeout(testConnection, 3000);
            }
            else {
                console.error('Unable to connect to the database:', error, error.message, error.name);
            }
        });
}

// Recursively try if the connection with the DB is open
testConnection();

module.exports = sequelize;