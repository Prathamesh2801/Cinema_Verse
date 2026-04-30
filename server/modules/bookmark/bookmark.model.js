import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  movieId: Number,
});

//  Prevent duplicates
bookmarkSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
