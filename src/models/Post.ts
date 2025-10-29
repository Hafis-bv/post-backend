import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User";

interface IPost extends Document {
  title: string;
  image: string;
  description: string;
  author: Types.ObjectId | IUser;
  createdAt: Date;
}

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Post = mongoose.model<IPost>("Post", postSchema);
