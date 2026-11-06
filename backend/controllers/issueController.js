import Book from "../models/Book.js";
import Issue from "../models/Issue.js";
import { addDays, calculateFine } from "../utils.js";

// ISSUE BOOK

export const issueBook = async (req, res) => {

    try {

        const book = await Book.findById(req.params.bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (book.available < 1) {
            return res.status(400).json({
                message: "Book is not available"
            });
        }

        const activeBooks = await Issue.countDocuments({

            student: req.user._id,
            returned: false

        });

        if (activeBooks >= 3) {
            return res.status(400).json({
                message: "Maximum 3 books allowed"
            });
        }

        const alreadyIssued = await Issue.findOne({

            student: req.user._id,
            book: book._id,
            returned: false

        });

        if (alreadyIssued) {
            return res.status(400).json({
                message: "You already issued this book"
            });
        }

        const issueDate = new Date();

        const dueDate = addDays(issueDate, 14);

        const issue = await Issue.create({

            student: req.user._id,
            book: book._id,
            issueDate,
            dueDate

        });

        book.available -= 1;

        await book.save();

        res.status(201).json({

            message: "Book issued successfully",
            issue

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// RETURN BOOK

export const returnBook = async (req, res) => {

    try {

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue record not found"
            });
        }

        if (
            req.user.role !== "admin" &&
            String(issue.student) !== String(req.user._id)
        ) {
            return res.status(403).json({
                message: "You cannot return another student's book"
            });
        }

        if (issue.returned) {
            return res.status(400).json({
                message: "Book already returned"
            });
        }

        const book = await Book.findById(issue.book);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const actualReturnDate = new Date();

        const fine = calculateFine(
            issue.dueDate,
            actualReturnDate
        );

        issue.actualReturnDate = actualReturnDate;
        issue.fine = fine;
        issue.returned = true;

        await issue.save();

        book.available = Math.min(
            book.quantity,
            book.available + 1
        );

        await book.save();

        res.json({

            message: "Book returned successfully",
            fine,
            issue

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// STUDENT'S BOOKS

export const myIssues = async (req, res) => {

    try {

        const issues = await Issue.find({

            student: req.user._id

        })
        .populate("book", "title author category")
        .sort({ createdAt: -1 });

        res.json({ issues });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ADMIN ALL ISSUE RECORDS

export const allIssues = async (req, res) => {

    try {

        const issues = await Issue.find()

        .populate("student", "name email")

        .populate("book", "title author")

        .sort({ createdAt: -1 });

        res.json({ issues });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};