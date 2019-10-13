# Create User Model

[Spirng Boot Docs - Developing Web Applications](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-developing-web-applications)

[Medium - Building a Spring Boot Rest Web Service in 4 steps](https://medium.com/@cleverti/building-a-spring-boot-rest-web-service-in-4-steps-d951be63647f)

[Spring Guides - Accessing data with MySQL](https://spring.io/guides/gs/accessing-data-mysql/)

[How to Install and Configure MySQL in Ubuntu 18.04 LTS](https://vitux.com/how-to-install-and-configure-mysql-in-ubuntu-18-04-lts/)

## Configure the database

First we need a database, the [guide](https://spring.io/guides/gs/accessing-data-mysql/) suggest MySql, so we are using that.

Using MySql consist on installing a MySql server running on the computer, since it's a server we will use a docker container, the [official mysql container](https://hub.docker.com/_/mysql/) with [tag 8.0.17](https://github.com/docker-library/mysql/blob/4af273a07854d7e4b68c5148b8e23b86aa8706e2/8.0/Dockerfile).

I add the container to the `docker-compose.yml` and set the db name and the user, this way a new database is created and the selected user is given full access to that databse. Without those fields, we use the _root_ and a default database.

[Some Basic Operations with MySQL](https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-basic-ops)

To enter inside the mysql console:

```sh
docker exec -it spring-boot_db_1 bash -l
mysql --password=5pr1ngb00t_r00t
```

Inside the console you can use these commands to inspect the database:

```sh
SELECT user,authentication_string,plugin,host FROM mysql.user;

USE questions_db;

SHOW TABLES;

DESCRIBE user;
```

We need to configure the database in `\src\main\resources\application.properties`. Since we are working inside the docker network, we can't use localhost in the db host, we must set the real IP address of hour computer. For now we can set the environment variable `DB_HOST` in the docker compose for the `api` container.

If we use localhost, we get the error `com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure`.

## Create the model

The user model is a simple Java class, the main job is made by `javax.persistence.Entity`, which connect the model to a table in the database.

Then create:
- a repository with `org.springframework.data.repository.CrudRepository`,  which abstracts the persistence access details, useful to define queries
- a controller with `org.springframework.stereotype.Controller` and `org.springframework.web.bind.annotation.RequestMapping`, used to define the available APIs

[Sapiens Works - Repository vs DAO](https://blog.sapiensworks.com/post/2012/11/01/Repository-vs-DAO.aspx)

Now by simply running our application, Spring Boot will create a `user` table inside the mysql container, with all the columns for the data defined in the User model

Controller methods should return a `ResponseEntity` object, which represent the response with both headers and body. For simple cases we can use the annotation `@ResponseBody`, that allows to return the body of the response.

To receive parameters in the request, check the [difference between @RequestBody and @RequestParam](https://stackoverflow.com/a/32980438):

- @RequestParam is used for parameters in the url
- @RequestBody is the whole body of the request as an object

## Handling errors

By default errors in the request are handled with exceptions and cause a _500 INTERNAL SERVER ERROR_ response.

[Exception Handling in Spring MVC](https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc#global-exception-handling)

We can handle the most common errors by defining a `ControllerAdvice`, a class that will hold all the functions that handle the generated exceptions, through the `ExceptionHandler` annotation.

The most common error that I want to handle are:

- GET requests of missing object must return a 404 NOT_FOUND
- basic conflict in the database (e.g. email already present) must return a 409 CONFLICT
- POST/PUT with invalid or missing parameters must return a 422 UNPROCESSABLE_ENTITY

The method of our ControllerAdvice return the HTTP response to send to the user, the objects used are:

- `ResponseEntity<T>`: handle the whole response(status, headers and body), the body is an object of class T
- `HttpEntity<T>`: handle only the body, an object of class T. The return status can be defined with the `ResponseStatus` annotation
- `ResposeBody` notation: just like the controllers, returns only the content of the body

The ControllerAdvice can extends the `ResponseEntityExceptionHandler` class, which already handle some of the error, but I think that it always return a 400 BAD_REQUEST. We can override those function to handle an exception in a custom way, note that those functions usually return a `ResponseEntity`, so we must override them with the same name, params and return type. **NOTE** we can't have 2 functions handling the same exception.