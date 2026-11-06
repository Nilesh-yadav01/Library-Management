import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role }) => {

    const { user, loading } = useAuth();

    if (loading) {

        return <h4 className="text-center mt-5">Loading...</h4>;

    }

    if (!user) {

        return <Navigate to="/login" replace />;

    }

    if (role && user.role !== role) {

        return <Navigate to="/dashboard" replace />;

    }

    return <Outlet />;

};

export default ProtectedRoute;