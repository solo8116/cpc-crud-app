const mongoose = require("mongoose");

const blcklistToken = mongoose.Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Logout", blcklistToken);
