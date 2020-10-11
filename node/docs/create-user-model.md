# Create User Model

## Configure the database

Using MySql consist on installing a MySql server running on the computer, since it's a server we will use a docker container, the [official mysql container](https://hub.docker.com/_/mysql/) with [tag 8.0.21](https://github.com/docker-library/mysql/blob/285fd39122e4b04fbe18e464deb72977df9c6a45/8.0/Dockerfile).

I add the container to the `docker-compose.yml` and set the db name and the user, this way a new database is created and the selected user is given full access to that databse. Without those fields, we use the _root_ and a default database.

[Some Basic Operations with MySQL](https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-basic-ops)

To enter inside the mysql console:

```sh
docker exec -it node_db_1 bash -l
mysql --password=n0d3_r00t
```

Inside the console you can use these commands to inspect the database:

```sh
SELECT user,authentication_string,plugin,host FROM mysql.user;

USE questions_db;

SHOW TABLES;

DESCRIBE user;
```

We need to configure the database in `\src\main\resources\application.properties`. Since we are working inside the docker network, we can't use localhost in the db host, we must set the real IP address of our computer. For now we can set the environment variable `DB_HOST` in the docker compose for the `api` container.

I got this error:

> [ERROR] --initialize specified but the data directory has files in it. Aborting.

I fixed this by changing the ports in the docker-compose, instead of port 3306 I used the other valid port 33060. After the container started the first time, it stopped to show the error even with the previous port. I suspect it's because I've runned the mysql container for other projects, so it got some ind of conflict.

## Create the model

To interact with the database we will use an ORM, we will use [Sequelize V6](https://sequelize.org/).

To create a table in the database we can create a class for the object and calling `MyModel.init` or calling `sequelize.define`, they're equivalent.

After the definition we can call the models with `sequelize.models.MyModel`.

By defining the model as a class we can assign inner functions to that model, so that's the method we will use.

To synchronize the model definition with the database we call the `MyModel.sync` function, which update the database based on the class.

- `User.sync()` - This creates the table if it doesn't exist (and does nothing if it already exists)
- `User.sync({ force: true })` - This creates the table, dropping it first if it already existed
- `User.sync({ alter: true })` - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.

You can use `sequelize.sync()` to automatically synchronize all models.

Unfortunately the sequelize connection object must be passed to every model, so the database connection is a bit messy.

For a sample project see [sequelize/express-example](https://github.com/sequelize/express-example/tree/a01fcc77d97c1da5078f3381243411a85d63965f)