import { IUser } from "../models/User";

export interface PostBody {
  title: string;
  image: string;
  description: string;
  author: IUser;
  limit: string;
}
