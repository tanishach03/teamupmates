const authResolver = require("./auth");
const bookingResolver = require("./booking");
const gamesResolver = require("./games");

const rootResolver = {
  ...authResolver,
  ...bookingResolver,
  ...gamesResolver,
};

module.exports = rootResolver;
