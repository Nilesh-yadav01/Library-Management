import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },

    issueDate: {
        type: Date,
        default: Date.now
    },

    dueDate: {
        type: Date,
        required: true
    },

    actualReturnDate: {
        type: Date,
        default: null
    },

    fine: {
        type: Number,
        default: 0
    },

    returned: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;