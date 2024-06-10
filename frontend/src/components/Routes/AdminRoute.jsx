import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
    const { company } = useSelector(state => state.user);
    const { loading, isAdmin } = company;

    if (!loading && !isAdmin) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
};

export default AdminRoute;
