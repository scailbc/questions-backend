package dbconnection

import (
	"fmt"
	"database/sql"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/scailbc/questions-backend/db"
	"os"
)

func Connect() *gorm.DB {
	dbUrl := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("MYSQL_USER")
	dbPassword := os.Getenv("MYSQL_PASSWORD")
	dbName := "questions_db"

	fmt.Println(fmt.Sprintf("Connect to DB on %s:%s", dbUrl, dbPort))
	// TODO Handle bad connection error
	database, err := gorm.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", dbUser, dbPassword, dbUrl, dbPort, dbName))
	

	if err != nil {
		panic(err.Error()) // Just for example purpose. You should use proper error handling instead of panic
	}

	var sqlDB *sql.DB = database.DB()
	err = sqlDB.Ping()
	if err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}

	db.DB = database

	return database
}

func Close() {
	fmt.Println("Close DB connection...")
	db.DB.Close()
}