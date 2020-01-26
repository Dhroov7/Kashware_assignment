const express = require("express"),
  app = express(),
  bcrypt = require("bcrypt"),
  auth = require("./auth"),
  models = require("./models").models;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", auth.login);

app.post("/signup", async (req, res) => {
  try {
    let username = req.body.username,
      password = req.body.password;

    password = await bcrypt.hash(password, 10);
    models.userLocal.create({
      username: username,
      password: password
    });

    res.send("User created");
  } catch (e) {
    console.log(e);
    res.send("Unable to signUp!");
  }
});

app.post("/publish", auth.checkToken, async (req, res) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    let userToken = await models.token.findOne({
      where: {
        token: token
      }
    });

    let user = await models.userLocal.findOne({
      where: {
        id: userToken.userId
      }
    });

    if (user.username.toLowerCase() !== "thanos") {
      let publishedBook = await models.book.create({
        title: req.body.title ? req.body.title : "",
        description: req.body.description ? req.body.description : "",
        author: req.body.author ? req.body.author : "",
        cover: req.body.cover ? req.body.cover : "",
        price: req.body.price ? req.body.price : 0,
        userId: userToken.userId
      });

      res.send(publishedBook);
    }
    res.send('Sorry Thanos, Iron man is protecting this!')
  } catch (e) {
    console.log(e);
    res.send("Unable to publish your book right now!");
  }
});

app.get("/publish", auth.checkToken, async (req, res) => {
  try {
    let publishedBooks = await models.book.findAll();

    res.send(publishedBooks);
  } catch (e) {
    console.log(e);
    res.send("Unable to retrieve books right now!");
  }
});

app.get("/search/:title", auth.checkToken, async (req, res) => {
  try {
    let booksByTitle = await models.book.findAll({
      where: {
        title: req.params.title
      }
    });

    res.send(booksByTitle);
  } catch (e) {
    console.log(e);
    res.send("Unable to search books right now!");
  }
});

app.get("/list", auth.checkToken, async (req, res) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    let userToken = await models.token.findOne({
      where: {
        token: token
      }
    });

    let publishedBooksByUser = await models.book.findAll({
      where: {
        userId: userToken.userId
      }
    });

    res.send(publishedBooksByUser);
  } catch (e) {
    console.log(e);
    res.send("Unable to show your books right now!");
  }
});

app.post("/unpublish", auth.checkToken, async (req, res) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    let userToken = await models.token.findOne({
      where: {
        token: token
      }
    });

    let book = await models.book.findOne({
      where: {
        userId: userToken.userId
      }
    });

    if (book) {
      await models.book.destroy({
        where: {
          title: req.body.title
        }
      });
    }

    res.send(book);
  } catch (e) {
    console.log(e);
    res.send("Unable to unpublish your book right now!");
  }
});

app.listen(9090, () => {
  console.log("Server started at http://localhost:9090");
});
