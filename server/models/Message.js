import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;