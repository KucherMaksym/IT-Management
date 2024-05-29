import React from 'react';
import axios from "axios";

const MyComponent = () => {

    const profile = () => {
        axios.get('http://localhost:8000/profile', { withCredentials: true })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });

    }

    const logout = () => {
        axios.get("http://localhost:8000/logout",{withCredentials: true} ).then((res) => {
            console.log(res.data);
        })
    }

    const protectedj = () => {
        axios.get("http://localhost:8000/protected", { withCredentials: true }).then((res) => {
            console.log(res);
        })
    }

    const hello = () => {
        axios.get("http://localhost:8000").then((response) => {
            console.log(response);
        })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div>
            <a href={"http://localhost:8000/auth/github"}>Login with Github</a>

            <p>Profile</p>
            <button onClick={profile}>profile</button>

            <p>Authenticated</p>
            <button onClick={protectedj}>protected</button>


            <p>logout</p>
            <button onClick={logout}>logout</button>


            <button onClick={hello}>hello</button>
        </div>
    );
};

export default MyComponent;
