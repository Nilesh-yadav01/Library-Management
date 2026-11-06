import Book from "../models/Book.js";
import Issue from "../models/Issue.js";

// GET ALL BOOKS

export const getBooks = async (req, res) => {

    try {

        const search = req.query.search || "";

        const books = await Book.find({

            $or: [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    author: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]

        }).sort({ createdAt: -1 });

        res.json({ books });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ADD BOOK

export const addBook = async (req, res) => {

    try {

        const {
            title,
            author,
            category,
            quantity,
            description
        } = req.body;

        const qty = Number(quantity);

        if (
            !title?.trim() ||
            !author?.trim() ||
            !Number.isInteger(qty) ||
            qty < 1
        ) {
            return res.status(400).json({
                message: "Enter valid book details"
            });
        }

        const book = await Book.create({

            title,
            author,
            category,
            quantity: qty,
            available: qty,
            description

        });

        res.status(201).json({

            message: "Book added successfully",
            book

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// UPDATE BOOK

export const updateBook = async (req, res) => {

    try {

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const {
            title,
            author,
            category,
            quantity,
            description
        } = req.body;

        const qty = Number(quantity);

        const activeIssues = await Issue.countDocuments({
            book: book._id,
            returned: false
        });

        if (
            !Number.isInteger(qty) ||
            qty < activeIssues
        ) {
            return res.status(400).json({
                message: "Quantity cannot be less than issued copies"
            });
        }

        book.title = title;
        book.author = author;
        book.category = category;
        book.description = description;
        book.quantity = qty;
        book.available = qty - activeIssues;

        await book.save();

        res.json({

            message: "Book updated successfully",
            book

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// DELETE BOOK

export const deleteBook = async (req, res) => {

    try {

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const activeIssues = await Issue.countDocuments({
            book: book._id,
            returned: false
        });

        if (activeIssues > 0) {
            return res.status(400).json({
                message: "Book is currently issued"
            });
        }

        await book.deleteOne();

        res.json({
            message: "Book deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};