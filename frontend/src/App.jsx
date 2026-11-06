import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./components/Layout";

import Auth from "./pages/Auth";

import Dashboard from "./pages/Dashboard";

import Books from "./pages/Books";

import MyBooks from "./pages/MyBooks";

const App = () => {

    const { user, loading } = useAuth();

    if (loading) {

        return <h3 className="text-center mt-5">Loading...</h3>;

    }

    return (

        <Routes>

            {/* LOGIN */}

            <Route

                path="/login"

                element={

                    user
                        ? <Navigate to="/dashboard" />
                        : <Auth mode="login" />

                }

            />

            {/* REGISTER */}

            <Route

                path="/register"

                element={

                    user
                        ? <Navigate to="/dashboard" />
                        : <Auth mode="register" />

                }

            />

            {/* PROTECTED ROUTES */}

            <Route element={<ProtectedRoute />}>

                <Route element={<Layout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/books"
                        element={<Books />}
                    />

                    <Route
                        path="/my-books"
                        element={<MyBooks />}
                    />

                </Route>

            </Route>

            {/* DEFAULT ROUTE */}

            <Route

                path="*"

                element={

                    <Navigate

                        to={user ? "/dashboard" : "/login"}

                        replace

                    />

                }

            />

        </Routes>

    );

};

export default App;