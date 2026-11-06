import { useEffect, useState } from "react";

import {
    BookOpen,
    BookCheck,
    Clock,
    Library
} from "lucide-react";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {

    const { user } = useAuth();

    const [books, setBooks] = useState([]);

    const [issues, setIssues] = useState([]);

    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const bookResponse = await api.get("/books");

                const issueResponse = await api.get(
                    user.role === "admin"
                        ? "/issues"
                        : "/issues/my"
                );

                setBooks(bookResponse.data.books);

                setIssues(issueResponse.data.issues);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Dashboard loading failed"
                );

            }

        };

        loadDashboard();

    }, [user.role]);

    const activeBooks = issues.filter(
        (issue) => !issue.returned
    ).length;

    const returnedBooks = issues.filter(
        (issue) => issue.returned
    ).length;

    const overdueBooks = issues.filter(
        (issue) =>
            !issue.returned &&
            new Date(issue.dueDate) < new Date()
    ).length;

    const stats = [

        {
            title: "Total Books",
            value: books.length,
            icon: Library
        },

        {
            title: user.role === "admin"
                ? "Total Issues"
                : "My Active Books",
            value: user.role === "admin"
                ? issues.length
                : activeBooks,
            icon: BookOpen
        },

        {
            title: "Returned Books",
            value: returnedBooks,
            icon: BookCheck
        },

        {
            title: "Overdue Books",
            value: overdueBooks,
            icon: Clock
        }

    ];

    return (

        <div>

            <div className="page-heading">

                <div>

                    <span className="text-primary small fw-bold">
                        OVERVIEW
                    </span>

                    <h2>Dashboard</h2>

                    <p className="text-secondary">
                        Library Management Overview
                    </p>

                </div>

            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="row g-3 mb-4">

                {stats.map((item, index) => {

                    const Icon = item.icon;

                    return (

                        <div
                            className="col-md-6 col-xl-3"
                            key={index}
                        >

                            <div className="stat-card">

                                <div>

                                    <p className="stat-label">
                                        {item.title}
                                    </p>

                                    <h2>
                                        {item.value}
                                    </h2>

                                </div>

                                <div className="stat-icon">

                                    <Icon size={25} />

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

            <div className="panel">

                <h5 className="fw-bold mb-3">
                    Recent Books
                </h5>

                <div className="table-responsive">

                    <table className="table table-hover">

                        <thead>

                            <tr>

                                <th>Book Name</th>

                                <th>Author</th>

                                <th>Category</th>

                                <th>Available</th>

                            </tr>

                        </thead>

                        <tbody>

                            {books.slice(0, 6).map((book) => (

                                <tr key={book._id}>

                                    <td>{book.title}</td>

                                    <td>{book.author}</td>

                                    <td>{book.category}</td>

                                    <td>
                                        {book.available} / {book.quantity}
                                    </td>

                                </tr>

                            ))}

                            {books.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="text-center"
                                    >

                                        No Books Available

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};

export default Dashboard;