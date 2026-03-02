import mongoose from "mongoose";

export interface ISinger {
  name: string;
  stageName?: string;
  bio?: string;
  slug: string;
  profileImage: string;
  genres?: string[];
  country?: string;
  socialLinks?: {
    instagram?: { username: string; followersCount: number };
    facebook?: string;
    youtube?: string;
  };
}

const singerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stageName: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    profileImage: {
      type: String,
      required: true,
    },
    genres: [
      {
        type: String,
      },
    ],
    country: {
      type: String,
    },
    socialLinks: {
      instagram: {
        username: {
          type: String,
          required: true,
        },
        followersCount: {
          type: String,
          default: 0,
        },
      },
      youtube: String,
      facebook: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Singer = mongoose.model("Singer", singerSchema);
