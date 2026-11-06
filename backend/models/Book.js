import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    category: {
        type: String,
        default: "General"
    },

    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    available: {
        type: Number,
        required: true,
        min: 0
    },

    description: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

const Book = mongoose.model("Book", bookSchema);

export default Book;