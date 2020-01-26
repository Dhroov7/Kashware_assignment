const jwt = require("jsonwebtoken"),
  models = require("./models").models,
  bcrypt = require('bcrypt'),
  config = require("./config.js");

const checkToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: "Token is not valid"
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: "Auth token is not supplied"
      });
    }
  },
  login = async (req, res) => {
    let username = req.body.username,
      password = req.body.password;

    const user = await models.userLocal.findOne({
      where: {
          username: username
      }
    });

    if (username && password) {
      if (username === user.username && await bcrypt.compare(password, user.password)) {
        let token = jwt.sign({ username: username }, config.secret, {
          expiresIn: "24h" // expires in 24 hours
        });
        // return the JWT token for the future API calls
        await models.token.create({
            token: token,
            userId: user.id
        });

        res.json({
          success: true,
          message: "Authentication successful!",
          token: token
        });
      } else {
        res.send(403).json({
          success: false,
          message: "Incorrect username or password"
        });
      }
    } else {
      res.send(400).json({
        success: false,
        message: "Authentication failed! Please check the request"
      });
    }
  };

module.exports = {
  checkToken: checkToken,
  login: login
};
