import mongoose from "mongoose";

const songLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
  },
  { timestamps: true },
);

export const SongLike = mongoose.model("SongLike", songLikeSchema);
