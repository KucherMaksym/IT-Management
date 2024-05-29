import React from 'react';
import {useUser} from "../../UserProvider";
import {Navigate, Outlet} from "react-router-dom";

const UserRouter = () => {
    const {user, loading} = useUser();

    if (!user && !loading) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default UserRouter;
