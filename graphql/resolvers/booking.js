const Booking = require("../../models/bookings");
const Game = require("../../models/game");
const { transformBooking, transformGame } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated!");
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookGame: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated!");
    try {
      const fetchedGame = await Game.findOne({ _id: args.gameId });
      const booking = new Booking({
        user: req.userId,
        game: fetchedGame,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated!");
    try {
      const booking = await Booking.findById(args.bookingId).populate("game");
      const game = transformGame(booking.game);
      await Booking.deleteOne({ _id: args.bookingId });
      return game;
    } catch (err) {
      throw err;
    }
  },
};
