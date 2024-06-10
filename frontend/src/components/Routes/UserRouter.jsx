import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const UserRouter = () => {
    const { user, loading, isAuthenticated } = useSelector((state) => state.user);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user && !loading) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default UserRouter;
