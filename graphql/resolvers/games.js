const Game = require("../../models/game");
const User = require("../../models/user");

const { transformGame } = require("./merge");

module.exports = {
  games: async () => {
    try {
      const games = await Game.find();
      return games.map((game) => {
        return transformGame(game);
      });
    } catch (err) {
      throw err;
    }
  },

  createGame: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated!");
    try {
      const game = new Game({
        title: args.gameInput.title,
        description: args.gameInput.description,
        price: +args.gameInput.price,
        date: new Date(args.gameInput.date),
        creator: req.userId,
      });
      let createdGame;
      const result = await game.save();
      createdGame = transformGame(result);
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdGames.push(game);
      await creator.save();
      return createdGame;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
