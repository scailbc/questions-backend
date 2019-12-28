package user

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/scailbc/questions-backend/db"
)

/**
 * User of the application
 */
type User struct {
	gorm.Model
	Name        string `json:"name"`
	Surname     string `json:"surname"`
	Age        	uint8 `json:"age"`
	Email       string `json:"email" gorm:"type:varchar(100);unique_index"`
	Password    string `json:"password"`
}

func GetUser(id int) *User {
	var u User
	db.DB.First(&u, id)
	return &u
}

func CreateUser(name string, surname string, age uint8, email string, password string) (*User) {
	u := User{Name: name, Surname: surname, Age: age, Email: email, Password: password}
	db.DB.Create(&u)
	return &u
}
