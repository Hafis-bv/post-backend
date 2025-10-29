import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { Post } from "../models/Post";
import { PostBody } from "../types/post";

export async function getAllPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { limit } = req.query;

  try {
    const posts = await Post.find(); //limit ? await Post.find().limit(limit) :

    if (!posts.length) {
      return next(new AppError("No posts found", 404));
    }

    return res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    next(new AppError("Server error", 500)); //ошибка сервера?
  }
}

export async function getSinglePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("ID is required", 400));
    }

    const post = await Post.findById(id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    return res.status(200).json(post);
  } catch (e) {
    console.error(e);
    next(new AppError("Server error", 500)); //ошибка сервера?
  }
}

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { image, title, description } = req.body as PostBody;

    if (!title || !description || !image) {
      return next(new AppError("All fields are required", 400));
    }
    const post = await Post.create({
      image,
      title,
      description,
    });

    return res.status(201).json({
      msg: "Post created successfully!",
      post,
    });
  } catch (e) {
    console.error(e);
    next(new AppError("Server error", 500));
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("ID is required", 400));
    }
    const post = await Post.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ msg: "Post deleted successfully!", deletedPost: post });
  } catch (e) {
    console.error(e);
    next(new AppError("Server error", 500));
  }
}

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    console.log(id);

    const { image, title, description } = req.body as PostBody;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("ID is required", 400));
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        image,
        title,
        description,
      },
      {
        new: true, // возвращает обновлённый документ
        runValidators: true, // запускает валидации схемы ..... это че значит
      }
    );

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    return res.status(200).json({
      msg: "Post updated successfully!",
      updatedPost: post,
    });
  } catch (e) {
    console.error(e);
    next(new AppError("Server error", 500));
  }
}
