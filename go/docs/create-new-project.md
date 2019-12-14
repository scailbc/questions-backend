# Create new Project

There are many framework that allows to create a server with Go (also known as Golang).

Here we will be using [Gorilla Web Toolkit](https://github.com/gorilla), since the [Gorilla Mux Library](https://github.com/gorilla/mux) is the most common HTTP router used in the guides. Gorilla is made of many libraries and by including only those that we need we can create a very light weight program with high performances.

Among the many good frameworks, the most interesting are:
- [Echo](https://github.com/labstack/echo): High performance, minimalist Go web framework
- [Gin Gonic](https://github.com/gin-gonic/gin): a well known framework with good performance and many features
- [Revel](https://github.com/revel/revel): A full-stack web framework, like Ruby on Rails

Since we are using basic libraries, the folder structure it's the same as any other Go program.

Golang projects reside in the `GOPATH`, all imported libraries will be imported there. Inside the `GOPATH` we have 3 folders:
- `src`: where the source code is placed, both the project and the libraries
- `bin`: where the builded executable code is stored
- `pkg`: where the libraries compiled files are stored

We only care about the `src` folder, the others are generated automatically. In the `src` folder files are stored with this folder structure:

```
GOPATH/src/github.com/<username>/<projectname>
```

The program start from a file, usually called `main.go`. The server is started with

```bash
go run ./src/github.com/scailbc/questions-backend/main.go
```

You can also build the program and then execute the builded file (you must add the `GOPATH/bin` folder to the PATH variable to execute a bin command without the full path)

```bash
cd ./src/github.com/scailbc/questions-backend/
go install
questions-backend
```
> WARNING the `go` command should always be executed inside the folder of your code, except fo installing new libraries with `go get`

First we should define the followng variables:

- GOPATH: the folder of all Go projects, `/home/app/go-questions-backend`
- GOBIN: the folder where the `go install` command will move all builded files, default value is "", you can simply set it as `$GOPATH/bin`

The $GOBIN and `/usr/local/go/bin` paths sholud be added to the $PATH variable, since they holds executables.

> WARNING: there is a bug with Docker, the $PATH env variable can't be edited inside the Dockerfile, so you have to use the full path of the executables, like `/usr/local/go/bin/go run main.go`

## External libraries

You can import external libraries using the `go get command` from the `GOPATH` directory

```bash
cd $GOPATH
go get github.com/gorilla/mux
```

This will install:

- the compiled package into the `pkg` folder, `pkg/linux_amd64/github.com/gorilla/mux.a`
- the source code into the `src` folder, `src/github.com/gorilla/mux`

Originally Go didn't store a list of imported packages with their versions, since the whole source code of the library is imported in the project.

Since version 1.11 Go implemented [Modules](https://golang.org/cmd/go/#hdr-Modules__module_versions__and_more) to handle versioning of the libraries and they will be in test until version 1.14. We are currently at version 1.13 and modules are enabled by default.

To generate modules run the follwing command

```bash
cd $GOPATH/src/github.com/scailbc/questions-backend/
go mod init
```

This will create the basic `go.mod` file which contains the list o all libraries for the project. The `go.mod` is file created to be easily readable and editable by humans and programs, by just changing the versions and running the server the new library will be imported

When one of the commands `go build`, `go install` or `go test`, is executed, the `go.sum` file will be generated and both the `go.mod` and `go.sum` files will be updated with the current installed libraries and their current version.

When the server is launched from the project folder, the missing libraries are imported.

```bash
cd $GOPATH/src/github.com/scailbc/questions-backend/
go run main.go
```

The compiled libraries will be imported into the `pkg/mod` folder, but the source code will not be downloaded into the `src/github.com` folder.