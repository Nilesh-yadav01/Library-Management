import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

import {
    BookOpen,
    LayoutDashboard,
    Library,
    ClipboardList,
    LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Layout = () => {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    return (

        <div className="app-shell">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <h3 className="brand">

                    <BookOpen size={25} />

                    Library

                </h3>

                <p className="text-secondary mt-4">
                    WORKSPACE
                </p>

                <NavLink
                    to="/dashboard"
                    className="side-link"
                >

                    <LayoutDashboard size={18} />

                    Dashboard

                </NavLink>

                <NavLink
                    to="/books"
                    className="side-link"
                >

                    <Library size={18} />

                    {user?.role === "admin"
                        ? "Manage Books"
                        : "Browse Books"}

                </NavLink>

                <NavLink
                    to="/my-books"
                    className="side-link"
                >

                    <ClipboardList size={18} />

                    {user?.role === "admin"
                        ? "Issue Records"
                        : "My Books"}

                </NavLink>

                <div className="sidebar-bottom">

                    <div className="user-chip">

                        <div className="avatar">

                            {user?.name?.[0]?.toUpperCase()}

                        </div>

                        <div>

                            <strong>{user?.name}</strong>

                            <small className="d-block text-secondary text-capitalize">

                                {user?.role}

                            </small>

                        </div>

                    </div>

                    <button
                        className="btn btn-outline-danger w-100 mt-3"
                        onClick={handleLogout}
                    >

                        <LogOut size={17} />

                        Logout

                    </button>

                </div>

            </aside>

            {/* MAIN CONTENT */}

            <main className="main-area">

                <header className="topbar">

                    <div>

                        <small className="text-secondary">
                            LIBRARY WORKSPACE
                        </small>

                        <h6 className="mb-0">
                            Welcome, {user?.name}
                        </h6>

                    </div>

                    <span className="badge bg-primary text-capitalize">

                        {user?.role}

                    </span>

                </header>

                <div className="content-area">

                    <Outlet />

                </div>

            </main>

        </div>

    );

};

export default Layout;