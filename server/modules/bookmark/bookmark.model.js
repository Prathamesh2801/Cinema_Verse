import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaId: {
      type: Number,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
    status: {
      type: String,
      enum: ["want", "watching", "watched"],
      default: "want",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    note: {
      type: String,
      default: "",
    },
    watchedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

bookmarkSchema.index({ userId: 1, mediaId: 1, mediaType: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
