import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },

    album: {
      type: String,
    },

    genre: {
      type: [String], // ["Pop", "Romantic"]
      index: true,
    },

    audioUrl: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
    },

    duration: {
      type: Number, // seconds
    },

    playsCount: {
      type: Number,
      default: 0,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    downloadsCount: {
      type: Number,
      default: 0,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Song = mongoose.model("Song", songSchema);
