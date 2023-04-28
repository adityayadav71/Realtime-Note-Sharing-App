const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, unique: [true, "Room Name should be unique"] },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: [true, "This participant already exists."],
      },
    ],
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },

    expiresAt: String,
  },
  { timestamps: true }
);

// Create a TTL index on the `updatedAt` field that expires documents with an empty `participants` array
roomSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { participants: { $size: 0 } } });

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
