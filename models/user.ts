import mongoose from "mongoose";
import ResultErrorCodes from "../common/error-codes.ts";
import { createHashPassword } from "../common/utils.ts";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: [10, ResultErrorCodes.PhoneNumberIsInvalid],
    },
    imageUrl: {
      type: String,
    },
    likedSongs: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await createHashPassword(this.password);
});

export const User = mongoose.model("User", userSchema);
