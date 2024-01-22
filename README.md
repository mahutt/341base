# Soen 341 Project Seed

This repository contains the starting point for the Soen 341 project, as well as relevant guides for configuring and contributing to a [Node.js](https://nodejs.org/) app built with the [Express](https://expressjs.com/) framework.

If you notice incorrect or missing information below, please commit changes to rectify the issue. 

## Local Environment Configuration

Since Express is a Node.js framework, Node.js and the [Node.js package manager (npm)](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager) must be installed on your machine.

Simply put, Node.js is a runtime environment that allows you to run JavaScript code *outside* of a web browser.
The Express framework builds on top of Node.js to facilitate the process of building web apps.
Express provides routing, middleware, and other server-side functionality.

> Node.js + Express = ability to write backend/server code in JavaScript.
> 

### Installing Node.js & Node.js Package Manager

On Windows:

1. Download `nvm-setup.zip` from the most recent [release](https://github.com/coreybutler/nvm-windows/releases) of the Node.js version manager for Windows.
2. Extract and run `nvm-setup.exe`.
3. Open a command prompt (with administrator privileges) and run `nvm install lts`.
4. Run `nvm list` to see which version of node.js was installed, and then `nvm use <version-number>`.

On MacOS:

1. If Homebrew isn't already installed, open a terminal and run `/bin/bash -c "$(curl -fsSL <https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh>)"`.
2. You can then use Homebrew to install Node.js by running `brew install node`. This also installs npm as it is bundled with Node.js.
3. Verify the installation of Node.js and npm by running `node -v` and `npm -v`, respectively.

### Cloning This Repository

Assuming you are using VS Code, you can follow the steps below.

1. Open VS Code.
2. Open the command palette by pressing **`Ctrl + Shift + P`** (Windows/Linux) or **`Cmd + Shift + P`** (Mac).
3. Type `Git: Clone` in the command palette and press enter.
4. Paste in the url of [this repository](https://github.com/mahutt/341base) and press enter.
5. Specify a location on your machine.
6. VS Code will ask if you want to open the cloned repository - select `Yes` or `Open`.

### Installing Dependencies

Prior to starting the server locally, you must install project dependencies. You can do this by opening a terminal at the repository folder and running `npm install` to install Node.js packages.

Since dependencies may be added or even removed throughout the development process, it’s possible you may need to run `npm install` again, after pulling changes. 

You can view the list of all current project dependencies in the `package.json` file, under the `dependencies` property. You’ll also notice a `devDependencies` property which lists dependencies that improve developer experience - these dependencies are not bundled with the rest of the app when deployed to production.

### Handling Secrets

To facilitate development, all team members will be connecting to the same MongoDB cluster, hosted by MongoDB Atlas. To prevent exposing (shared) database credentials, we will be storing them in a file called `config.js`.

You might have noticed that this file does not yet exist in your local copy of the repository, as it is listed in `.gitignore` and thus was automatically excluded from git commits when this base project was written. The contents of `config.js` should look like the following.

```jsx
const config = {
    mongoDB:
        '<database-uri>',
};

module.exports = config;
```

Create a `config.js` file in the root of the repository, and replace `<database-uri>` with the actual URI. For context, this URI is used to connect to the hosted database in `app.js` as follows:

```jsx
// mongoose connection setup
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const config = require('./config');
const mongoDB = config.mongoDB;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}
```

### Running The App

In the same `package.json` file, there is a `scripts` property which is used to run and define custom commands. You can run them using `npm run <command-name>`.

For example, `npm run start` will start a local server instance. You can then visit [http://localhost:3000/](http://localhost:3000/) and you should see a “Welcome to Express” message.

However, during development, you should use `npm run devstart` instead. This command starts the server using nodemon (a dev dependency) instead of node. Nodemon auto-restarts the server when saved changes are detected in backend code, allowing us to save time during development.

### VS Code Extensions

If you are using VS Code for this project, you can install the extensions below to improve your development experience.

- **EJS language support** - as this project makes use of EJS templating.
- **Prettier - Code formatter** - as this will enforce consistent formatting across all files you contribute to. This eases adherence to good practice, and consistent formatting will make it easier for team members to read and understand each other’s code.
    - After installing Prettier, make sure to set it as the default formatter in VS Code settings. Additionally, the **Format On Save** setting should be checked (set to true).

## App Structure Breakdown

These next few sections cover the basic internal workings of an Express app, and how we will leverage them to build a web app that adheres to an MVC architecture.

### www Script

When you run `npm run start` in a terminal at the project directory, npm checks the `scripts` property in `package.json` for the `start` command. The value of the start command is `node ./bin/www` - this is the actual command that executes in your terminal (`npm run start` is effectively an alias for `node ./bin/www`). 

So, the start command uses Node.js to execute the `www` script located at `./bin/`. The `www` script starts the server. The script’s first line of code is `var app = require('../app');`, which imports the app object defined in `./app.js`.

`app.js` is where we define and configure our Express application.

### Routing

Scroll down `app.js` and you’ll find the line `app.use('/users', usersRouter);`. This line tells our app to use `usersRouter` for all URLs that extend [http://example.com/users](http://example.com/users). This means that requests to URLs like [http://example.com/users/ambrose](http://example.com/users/ambrose) will be handled by logic defined in the `usersRouter`.

You can inspect the `usersRouter` code by scrolling up the file to see from where the router was imported. You’ll find this line `var usersRouter = require('./routes/users');`.

In `./routes/users.js`, you’ll find code like `router.get("/", user_controller.user_list);`, which means that GET requests made to [http://example.com/users](http://example.com/users) (+ /) will be handled by the `user_controller`'s `user_list` function. 

If the line was `router.post("/all", user_controller.user_list);`, then this controller function would only be invoked by POST requests to [http://example.com/users/all](http://example.com/users/all). Again, we are appending /all to /users, since the router in question was used for URLs beginning with /users (recall `app.use('/users', usersRouter);`).

### Controllers

Controllers are where *real* backend logic is defined. Controller functions are invoked in response to requests made to specific URLs, and these functions decide what to send back to the client.

In the example above, the `usersRouter` invoked `user_controller`'s `user_list` function in response to a GET request to [http://example.com/users](http://example.com/users) (see `./routes/users.js`).

If we scroll up a little, we can see where the `user_controller` was imported from: `const user_controller = require("../controllers/userController");`.

If we navigate to `./controllers/userController.js`, we can see the definition of the `user_list` function: 

```jsx
exports.user_list = asyncHandler(async (req, res, next) => {
    const allUsers = await User.find({}, "user_name")
    res.render('user_list', { user_list: allUsers });
});
```

We will eventually cover MongoDB and Mongoose to understand the first line. Simply put, `const allUsers = await User.find({}, "user_name")` extracts all `user_name`s belonging to `User`s in our database and saves them in a variable called `allUsers`.

We then render the `user_list` template using the extracted usernames, and attach it to the response (`res`) object. At the end of this function, the `res` object is implicitly returned to the client.

This function might be confusing, as it uses two technologies that have not yet been introduced. For now, it is only important to understand that this function (1) obtained an array of usernames from our database, (2) generated an HTML file that lists these usernames, and (3) sent the HTML content to the client.

### MongoDB & Mongoose

This project uses MongoDB - a popular NoSQL database. Paired with the Mongoose library, we can model our data using `Schema`s and we can query data using JavaScript functions (as opposed to using a query language).

In the first line of the controller function introduced above, `User.find({}, "user_name")` is calling the `find` function on the `User` model.

The first argument, `{}`, is for conditions. In this case it is empty, and so all user instances will be returned. If you only wanted users older than 18 (and assuming an `age` property exists), you could add this condition: `User.find({ age: { $gt: 18 } }, "user_name")`.

The second argument, `"user_name"` specifies the fields to include in the returned documents. If you wanted the `find` function to return `user_name`s *and* `age`s, you could add the `age` field: `User.find({}, "user_name age")`.

### Models

The Mongoose module allows us to model the data stored in our database. If we search above the `User.find({}, "user_name")` snippet, we can see from where the `User` model is imported: `const User = require("../models/user");`.

In `./models/user.js`, we can see the `Schema` used to define the model.

```jsx
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_name: { type: String, required: true, maxLength: 100 },
});
```

Within the schema, we define attributes (like `user_name`) as well as attribute restrictions `{ type: String, required: true, maxLength: 100 }`. We then define and export a model using this schema for use in controller functions: `module.exports = mongoose.model("User", UserSchema);`. We can now use pre-defined Mongoose model functions to easily create, read, update, and delete users in the database. `find` was one such example.

### EJS Templating

The second line of the controller method introduced above is `res.render('user_list', { user_list: allUsers });`. The first argument of the `render` function is the name of a template defined elsewhere in the project. The second argument is the data to populate the template with.

All templates are defined in the `./views/` directory, so you can inspect the template being rendered above by navigating to `./views/user_list.ejs`.

In this project, we are using EJS templates, which are essentially HTML documents wherein JS can be injected to dynamically render the view. The contents of `user_list.ejs`:

```jsx
<!DOCTYPE html>
<html>
  <head>
    <title>User List</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1>User List</h1>
    <ul>
      <% user_list.forEach(function(user) { %>
        <li><%= user.user_name %></li>
      <% }) %>
    </ul>
  </body>
</html>
```

You can see a familiar HTML markup, as well as some JS injected using the `<%` & `%>` delimiters. In this case, the template assumes a `user_list` variable was passed to the view when rendered, and iterates through it to create a `li` element containing the `user_name` property of each.

### Welcome to MVC

To summarize, a router associates specific URL requests with a controller function.

The controller function interacts with data models and views to deliver a response.

The data model is a wrapper of a database collection that is easy to interact with. A view is a template that can be populated with data from a model to generate an HTML page.

This model-view-controller (MVC) architecture offers modularity, maintainability, and code reusability through a clear separation of concerns.
