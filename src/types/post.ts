import { User } from "../models/User";

export interface PostBody {
  title: string;
  image: string;
  description: string;
  author: User;
  limit: string;
}
