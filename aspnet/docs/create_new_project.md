# Create new Project

Starting from the `Dockerfile` and the `docker-compose.yml` you can create a new project passing through [Docker](https://www.docker.com/).

Here there are some tutorial:

- [Learn Microsoft - Create a web API with ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-6.0&tabs=visual-studio-code)

First build the image

```bash
docker-compose build
```

Then launch a container, do not use the `docker-compose.yml`, since it's intended to launch a node server and we still have to create it. We have to mount the current folder as a volume, to apply the projects created inside Docker to our folder

```bash
docker run --rm -v ${PWD}:/home/app/aspnet-questions-backend -it aspnet_api bash -l
```

Create a new ASP.NET Core project inside the container

```bash
cd /home/app/
dotnet new webapi -o aspnet-questions-backend
```

This will create the basic project, with the default WeatherForecast class and controller. It also have configured [Swagger](https://swagger.io/), a framework that shows a basic interface to test the APIs.

Let's install some basic libraries:

- EntityFramework: an ORM used to interact with the database

```bash
cd /home/app/aspnet-questions-backend
dotnet add package Microsoft.EntityFrameworkCore.InMemory
```

All this libraries will be downloaded from [NuGET](https://www.nuget.org/) and will be added inside the `aspnet-questions-backend.csproj` file.

The `obj` folder must not be pushed to vesion control. It does not create a gitignore, so we have to create it manually.

```
bin
obj
packages
```

The entry point of the application id the `Program.cs` file. In this file we create a server.

> The server automatically run on HTTPS, so it needs SSL certificates. We can generate them with `dotnet dev-certs https --trust` that will prompt a window to accept the new certificates. Unfortunately this command does not work on Linux, so we can disable HTTPs by removeing the line `app.UseHttpsRedirection()` in `Program.cs` file

Now that the project is created we can run it with:

```bash
cd /home/app/aspnet-questions-backend
dotnet build
dotnet run
```

Or with docker:

```bash
docker run --rm -v ${PWD}:/home/app/aspnet-questions-backend -it -e DB_HOST=192.168.1.21 -e DB_PORT=3306 -e PORT=8080 aspnet_api sh -c "dotnet build --configuration Debug && dotnet run --configuration Debug"
```

Or with docker-compose:


> When using docker-compose inside Windows WSL2, [there are problems with the DNS](https://github.com/microsoft/WSL/issues/8365#issuecomment-1140416081) and it does not resolve the hostname. In this case the restore project fail `error NU1301: Unable to load the service index for source https://api.nuget.org/v3/index.json`. You can try to fixit by disabling the Windows firewall for private network, or running the container without docker-compose.

ASP.NET Core projects are configured to bind to a random HTTP port between 5000-5300 and a random HTTPS port between 7000-7300.
To run from a port defined in an env variable we can use:

```cs
int port = Int32.Parse(Environment.GetEnvironmentVariable("PORT")!); // Use ! to ignore null warning
app.Run($"http://localhost:{port}");
```