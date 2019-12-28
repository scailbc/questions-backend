# Create User Model

[Naren Yellavula - Building RESTful Web services with Go](https://www.packtpub.com/eu/application-development/building-restful-web-services-go)

[Chapter 4 - Simplifying RESTful Services with Popular Go Frameworks](https://github.com/narenaryan/gorestful/tree/master/chapter4)

Since we are using the basic libraries without a framework, there isn't a specific structure that we must follow. For every model we have to:

- Define the struct
- Create the table in the database
- Create utility functions to query the data from the database
- Populate the database based on the environment

For the interaction with the database, we have to write the MySQL queries and we have to prevent SQL injection, for that we use the `db.Prepare` function.

All functions will return pointers, that's because in Go a function can't return __'an object or nil'__, that can only be done with a pointer.

```go
func getUser(id int) *User {
	var u User
	err := DB.QueryRow("SELECT id, name, email  FROM users WHERE id=?", id).Scan(&u.ID, &u.Name, &u.Email)
	if err != nil {
        // No user found
		return nil
    }
    // User found
	return &u
}
```

## GORM

Since we don't want to write SQL code, we will use [GORM](https://gorm.io/docs/), an Object Relationa Mapping library that links our model with the database.

The `gorm.Model`class automatically set the values `ID`, `CreatedAt`, `UpdatedAt` and `DeletedAt` to our classes. It also provides table relationships like belongs_to and has_many.

> WARNING: After a `docker-compose down`, the command `docker-compose up` will run an error `driver: bad connection`. This happens because the db container is not fully started. The Docker guideline tells that we should handle the error and retry, for now just run `docker-compose up` a second time and the server will start.

We create a `db` package that will contain the db object, the object that represent the connection with the database. It doesn't import any package, so that any otherpackage can import it with an error of `import cycle not allowed`.

All models will be in the `models` folder and each of them will be in a subpackage. This allows to store all models related functions in the same package and use them in the form `user.CreateUser()`.