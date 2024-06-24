import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const CompanyRouter = () => {
    const {user, loading, company} = useSelector((state) => state.user);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user && !loading) {
        return <Navigate to="/login" />;
    }

    if (!company.company && !company.loading) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default CompanyRouter;
