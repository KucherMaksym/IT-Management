import React from 'react';
import axios from "axios";

const MyComponent = () => {

    const logout = () => {
        axios.get('http://localhost:8000/logout', {withCredentials: true}).then((response) => {
            window.location.href = ("/");
        })
    }

    return (
        <div>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default MyComponent;
