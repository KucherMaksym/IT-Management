import React from 'react';
import {useUser} from "../../UserProvider";
import {Navigate, Outlet} from "react-router-dom";

const AdminRoute = () => {
    const {loading, company } = useUser();

    if (!company.isAdmin && !loading) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default AdminRoute;
