import express from "express";

import {
    issueBook,
    returnBook,
    myIssues,
    allIssues
} from "../controllers/issueController.js";

import {
    protect,
    adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:bookId", protect, issueBook);

router.get("/my", protect, myIssues);

router.get("/", protect, adminOnly, allIssues);

router.patch("/:id/return", protect, returnBook);

export default router;