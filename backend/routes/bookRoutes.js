import express from "express";

import {
    getBooks,
    addBook,
    updateBook,
    deleteBook
} from "../controllers/bookController.js";

import {
    protect,
    adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBooks);

router.post("/", protect, adminOnly, addBook);

router.put("/:id", protect, adminOnly, updateBook);

router.delete("/:id", protect, adminOnly, deleteBook);

export default router;