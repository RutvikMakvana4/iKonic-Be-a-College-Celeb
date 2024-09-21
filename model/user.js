import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
      lowercase: true,
      index: {
        unique: true,
      },
    },
    countryCode: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: String,
      default: null,
    },
    pronouns: {
      type: String,
      default: null,
    },
    collegeId: {
      type: Number,
      default: null,
    },
    collegeName: {
      type: String,
      default: null,
    },
    isSheerVerified: {
      type: Boolean,
      default: false,
    },
    isAgree: {
      type: Boolean,
      default: false,
    },
    isAccountActive: {
      type: Boolean,
      default: false,
    },
    fullName: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    interests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interests",
        default: null,
      },
    ],
    subCultures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCulture",
        default: null,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;