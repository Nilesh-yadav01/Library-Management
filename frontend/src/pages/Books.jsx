import { useEffect, useState } from "react";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    BookOpen
} from "lucide-react";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

const emptyForm = {

    title: "",
    author: "",
    category: "General",
    quantity: 1,
    description: ""

};

const Books = () => {

    const { user } = useAuth();

    const isAdmin = user.role === "admin";

    const [books, setBooks] = useState([]);

    const [search, setSearch] = useState("");

    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    // LOAD BOOKS

    const loadBooks = async () => {

        const response = await api.get("/books", {

            params: { search }

        });

        setBooks(response.data.books);

    };

    useEffect(() => {

        loadBooks().catch((error) => {

            setError(
                error.response?.data?.message ||
                "Unable to load books"
            );

        });

    }, [search]);

    // INPUT CHANGE

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    // OPEN ADD FORM

    const handleAdd = () => {

        setEditingId(null);

        setForm(emptyForm);

        setShowForm(true);

        setError("");

        setMessage("");

    };

    // OPEN EDIT FORM

    const handleEdit = (book) => {

        setEditingId(book._id);

        setForm({

            title: book.title,
            author: book.author,
            category: book.category,
            quantity: book.quantity,
            description: book.description || ""

        });

        setShowForm(true);

        setError("");

        setMessage("");

    };

    // SAVE BOOK

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setMessage("");

        try {

            if (editingId) {

                await api.put(
                    `/books/${editingId}`,
                    form
                );

                setMessage("Book updated successfully");

            } else {

                await api.post("/books", form);

                setMessage("Book added successfully");

            }

            setShowForm(false);

            setForm(emptyForm);

            await loadBooks();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Book operation failed"
            );

        }

    };

    // DELETE BOOK

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/books/${id}`);

            setMessage("Book deleted successfully");

            await loadBooks();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Delete failed"
            );

        }

    };

    // ISSUE BOOK

    const handleIssue = async (id) => {

        setError("");

        setMessage("");

        try {

            const response = await api.post(
                `/issues/${id}`
            );

            setMessage(

                response.data.message +
                ". Return date: " +
                new Date(
                    response.data.issue.dueDate
                ).toLocaleDateString()

            );

            await loadBooks();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Issue failed"
            );

        }

    };

    return (

        <div>

            <div className="page-heading">

                <div>

                    <h2>
                        {isAdmin
                            ? "Manage Books"
                            : "Browse Books"}
                    </h2>

                    <p className="text-secondary">
                        Library Book Collection
                    </p>

                </div>

                {isAdmin && (

                    <button
                        className="btn btn-primary"
                        onClick={handleAdd}
                    >

                        <Plus size={18} />

                        Add Book

                    </button>

                )}

            </div>

            {message && (

                <div className="alert alert-success">
                    {message}
                </div>

            )}

            {error && (

                <div className="alert alert-danger">
                    {error}
                </div>

            )}

            {/* SEARCH */}

            <div className="search-box mb-4">

                <Search size={20} />

                <input

                    type="text"

                    placeholder="Search books..."

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                />

            </div>

            {/* ADD / EDIT FORM */}

            {showForm && isAdmin && (

                <div className="panel mb-4">

                    <h5 className="mb-3">

                        {editingId
                            ? "Edit Book"
                            : "Add New Book"}

                    </h5>

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            <div className="col-md-4">

                                <label className="form-label">
                                    Book Title
                                </label>

                                <input
                                    className="form-control"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Author
                                </label>

                                <input
                                    className="form-control"
                                    name="author"
                                    value={form.author}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Category
                                </label>

                                <input
                                    className="form-control"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-8">

                                <label className="form-label">
                                    Description
                                </label>

                                <input
                                    className="form-control"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        <div className="mt-3 d-flex gap-2">

                            <button className="btn btn-primary">

                                {editingId
                                    ? "Update Book"
                                    : "Save Book"}

                            </button>

                            <button

                                type="button"

                                className="btn btn-light"

                                onClick={() => setShowForm(false)}

                            >

                                Cancel

                            </button>

                        </div>

                    </form>

                </div>

            )}

            {/* BOOK LIST */}

            <div className="row g-3">

                {books.map((book) => (

                    <div
                        className="col-md-6 col-xl-4"
                        key={book._id}
                    >

                        <div className="book-card">

                            <div className="book-cover">

                                <BookOpen size={35} />

                            </div>

                            <div className="book-info">

                                <span className="badge bg-light text-primary">

                                    {book.category}

                                </span>

                                <h5 className="mt-3">

                                    {book.title}

                                </h5>

                                <p className="text-secondary">

                                    By {book.author}

                                </p>

                                <p>

                                    Available: {book.available} / {book.quantity}

                                </p>

                                {isAdmin ? (

                                    <div className="d-flex gap-2">

                                        <button
                                            className="btn btn-outline-primary btn-sm flex-grow-1"
                                            onClick={() => handleEdit(book)}
                                        >

                                            <Pencil size={15} />

                                            Edit

                                        </button>

                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(book._id)}
                                        >

                                            <Trash2 size={15} />

                                        </button>

                                    </div>

                                ) : (

                                    <button

                                        className="btn btn-primary w-100"

                                        disabled={book.available < 1}

                                        onClick={() => handleIssue(book._id)}

                                    >

                                        {book.available < 1
                                            ? "Not Available"
                                            : "Issue Book"}

                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                ))}

                {books.length === 0 && (

                    <div className="text-center text-secondary py-5">

                        No Books Found

                    </div>

                )}

            </div>

        </div>

    );

};

export default Books;