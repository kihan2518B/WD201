const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const path = require("path");
const bodyParser = require("body-parser");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const passport = require("passport");
const ConnectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("Shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"])); //THE TEXT SHOULD BE OF 32 CHARACTERS ONLY
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "my-super-secret-key-21728172615261562",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //24hrs
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

//define a local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done("Invalid Password");
          }
        })
        .catch((error) => {
          return error;
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("serializing user in session ", user.id);
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.get("/", async function (request, response) {
  response.render("index", {
    title: "Todo App",
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  ConnectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    // response.send("Hello World");
    // const allTodo = await Todo.getTodo();
    const LoggedinUser = request.user.id;
    const overdueTodos = await Todo.overdue(LoggedinUser);
    const dueTodayTodos = await Todo.dueToday(LoggedinUser);
    const dueLaterTodos = await Todo.dueLater(LoggedinUser);
    const completed = await Todo.completedItem(LoggedinUser);

    if (request.accepts("html")) {
      response.render("todos", {
        // allTodo,
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completed,
        csrfToken: request.csrfToken(), //csrfToken() generates csrf token and return it and poperty name is csrfToken
      });
    } else {
      response.json({
        // allTodo,
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completed,
      });
    }
    // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
    // Then, we have to respond with all Todos, like:
    // response.send(todos)
  },
);

//We will Make Route for signup page
app.post("/users", async (request, response) => {
  //Hashing The password
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  //have to create User
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "SignUp",
    csrfToken: request.csrfToken(),
  });
});

app.get("/login", (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});
app.post(
  "/session",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (request, response) => {
    console.log(request.user);
    response.redirect("todos");
  },
);

//signout
app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

//adding todo
app.post(
  "/todos",
  ConnectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("user:", request.user.id);
    try {
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

// updating todo
app.put(
  "/todos/:id",
  ConnectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    const todo = await Todo.findByPk(request.params.id);
    try {
      const status = todo.completed;
      //logic to toogle checkbox if true than do false and vise-versa
      const updatedTodo = await todo.setcompletionstatus(status);
      return response.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

//deleting todo
app.delete(
  "/todos/:id/delete",
  ConnectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Delete a todo by ID:", request.params.id);
    const LoggedinUser = request.user.id;
    const todo_id = request.params.id;
    try {
      const deletedItem = await Todo.deletetodo(todo_id, LoggedinUser);
      response.send(deletedItem ? true : false);
    } catch (error) {
      console.error(error);
      return response.status(442).json(error);
    }
  },
);

module.exports = app;
