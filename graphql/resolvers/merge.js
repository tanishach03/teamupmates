const DataLoader = require("dataloader");

const Game = require("../../models/game");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const gameLoader = new DataLoader((gameIds) => {
  return games(gameIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const games = async (gameIds) => {
  try {
    const games = await Game.find({ _id: { $in: gameIds } });
    games.sort((a, b) => {
      return (
        gameIds.indexOf(a._id.toString()) - gameIds.indexOf(b._id.toString())
      );
    });
    return games.map((game) => {
      return transformGame(game);
    });
  } catch (err) {
    throw err;
  }
};

const singleGame = async (gameId) => {
  try {
    const game = await gameLoader.load(gameId.toString());
    return game;
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdGames: () => gameLoader.loadMany(user._doc.createdGames),
    };
  } catch (err) {
    throw err;
  }
};

const transformGame = (game) => {
  return {
    ...game._doc,
    _id: game.id,
    date: dateToString(game._doc.date),
    creator: user.bind(this, game.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    game: singleGame.bind(this, booking._doc.game),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

exports.transformGame = transformGame;
exports.transformBooking = transformBooking;
