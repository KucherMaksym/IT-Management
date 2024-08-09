import React from 'react';
import axios from "axios";
import {useSelector} from "react-redux";
import ProfileCard from "./ProfileCard";

const MyComponent = () => {

    const {user} = useSelector((state) => state.user);

    const logout = () => {
        axios.get('http://localhost:8000/logout', {withCredentials: true}).then((response) => {
            window.location.href = ("/");
        })
    }

    return (
        <div className={`container py-10`}>
            <div className={`w-[300px]`}>
                <ProfileCard user={user} logout={logout} />
            </div>
        </div>
    );
};

export default MyComponent;
