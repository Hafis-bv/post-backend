import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePost,
} from "../controllers/posts";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getSinglePost);
router.post("/create", createPost);
router.delete("/delete/:id", deletePost);
router.patch("/update/:id", updatePost);

export { router as postRouter };
