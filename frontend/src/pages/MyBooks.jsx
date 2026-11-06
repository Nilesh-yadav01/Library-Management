import { useEffect, useState } from "react";

import { RotateCcw } from "lucide-react";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

const MyBooks = () => {

    const { user } = useAuth();

    const [issues, setIssues] = useState([]);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const loadIssues = async () => {

        const response = await api.get(

            user.role === "admin"
                ? "/issues"
                : "/issues/my"

        );

        setIssues(response.data.issues);

    };

    useEffect(() => {

        loadIssues().catch((error) => {

            setError(
                error.response?.data?.message ||
                "Unable to load records"
            );

        });

    }, [user.role]);

    // RETURN BOOK

    const handleReturn = async (id) => {

        setMessage("");

        setError("");

        try {

            const response = await api.patch(
                `/issues/${id}/return`
            );

            setMessage(
                response.data.message +
                ". Fine: ₹" +
                response.data.fine
            );

            await loadIssues();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Return failed"
            );

        }

    };

    return (

        <div>

            <div className="page-heading">

                <div>

                    <h2>

                        {user.role === "admin"
                            ? "Issue Records"
                            : "My Books"}

                    </h2>

                    <p className="text-secondary">

                        Track issued and returned books

                    </p>

                </div>

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

            <div className="panel">

                <div className="table-responsive">

                    <table className="table table-hover align-middle">

                        <thead>

                            <tr>

                                {user.role === "admin" && (
                                    <th>Student</th>
                                )}

                                <th>Book</th>

                                <th>Issue Date</th>

                                <th>Return Date</th>

                                <th>Status</th>

                                <th>Fine</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {issues.map((issue) => {

                                const isLate =
                                    !issue.returned &&
                                    new Date(issue.dueDate) < new Date();

                                return (

                                    <tr key={issue._id}>

                                        {user.role === "admin" && (

                                            <td>

                                                <strong>
                                                    {issue.student?.name}
                                                </strong>

                                                <small className="d-block text-secondary">
                                                    {issue.student?.email}
                                                </small>

                                            </td>

                                        )}

                                        <td>

                                            {issue.book?.title || "Book unavailable"}

                                        </td>

                                        <td>

                                            {new Date(
                                                issue.issueDate
                                            ).toLocaleDateString()}

                                        </td>

                                        <td>

                                            {new Date(
                                                issue.dueDate
                                            ).toLocaleDateString()}

                                        </td>

                                        <td>

                                            <span className={

                                                issue.returned
                                                    ? "badge bg-success"
                                                    : isLate
                                                        ? "badge bg-danger"
                                                        : "badge bg-primary"

                                            }>

                                                {issue.returned
                                                    ? "Returned"
                                                    : isLate
                                                        ? "Overdue"
                                                        : "Issued"}

                                            </span>

                                        </td>

                                        <td>

                                            ₹{issue.fine || 0}

                                        </td>

                                        <td>

                                            {!issue.returned ? (

                                                <button

                                                    className="btn btn-sm btn-outline-primary"

                                                    onClick={() =>
                                                        handleReturn(issue._id)
                                                    }

                                                >

                                                    <RotateCcw size={14} />

                                                    Return

                                                </button>

                                            ) : (

                                                <span className="text-success">
                                                    Completed
                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                );

                            })}

                            {issues.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={
                                            user.role === "admin" ? 7 : 6
                                        }
                                        className="text-center py-5"
                                    >

                                        No Issue Records Found

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            <div className="mt-3 text-secondary small">

                Book duration: 14 days |

                Late fine: ₹5 per day

            </div>

        </div>

    );

};

export default MyBooks;