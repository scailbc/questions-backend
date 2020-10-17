# Create new Project

Starting from the `Dockerfile` and the `docker-compose.yml` you can create a new project passing through [Docker](https://www.docker.com/).

First build the image

```bash
docker-compose build
```

Then launch a container, do not use the `docker-compose.yml`, since it's intended to launch a node server and we still have to create it. We have to mount the current folder as a volume, to apply the projects created inside Docker to our folder

```bash
docker run --rm -v ${PWD}:/home/app/node-questions-backend -it node_api bash -l
```

Create a new node project inside the container

```bash
cd /home/app/node-questions-backend
npm init
```

This will create the package.json file, which contains all informations about the project and the list of used libraries.

Let's install some basi libraries:

- Express: which allows to create an API server
- Express Session: used to handle users sessions
- Body Parser: middleware to parse the requests body
- cors: used to manage CORS
- Helmet: add a list of useful HTTP headers to all requests

```bash
cd /home/app/node-questions-backend
npm install express express-session body-parser cors helmet --save-exact
```

All this libraries will be downloaded from [NPM](https://www.npmjs.com/) into the `node_modules` folder and a reference will be added inside the `package.json` files. It will also create the `package-lock.json`, which contains the full list of all installed libraries and their dependencies.

The `node_modules` folder must not be pushed to vesion control.

Finally create the entry point of the application, the `index.js` file. In this file we will create a server.

We create a new express object, then we add all the middlewares, and finally we start the server on the desired port.

```js
const port = process.env.PORT;

// Create the server
const app = express();

// Add middlewares
app.use(cors());
app.use(session({
    secret: "my-authentication-secret",
    resave: false,
    saveUninitialized: false
}));

// Start listening on port
const server = app.listen(port, function () {
    console.log("app_listening", port);
});
```

Now that the project is created we can run it with:

```bash
cd /home/app/node-questions-backend
node index.js
```

Or with docker-compose:

```bash
docker-compose up
```