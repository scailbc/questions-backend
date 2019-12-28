package dbconnection

import (
	"github.com/jinzhu/gorm"
	"github.com/scailbc/questions-backend/models/user"
)

func InitTables(dbDriver *gorm.DB) {
	// Migrate the schema
	dbDriver.AutoMigrate(&user.User{})
}