import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePost,
} from "../controllers/posts";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllPosts); // vse mogut polucat
router.get("/:id", getSinglePost);
router.post("/create", authMiddleware, createPost); // mogut tolko auth useri
router.delete("/delete/:id", authMiddleware, deletePost);
router.patch("/update/:id", authMiddleware, updatePost);

export { router as postRouter };
