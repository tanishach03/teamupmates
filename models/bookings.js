const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bookingSchema = new Schema(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
