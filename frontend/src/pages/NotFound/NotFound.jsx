import React from 'react';
import {Link} from "react-router-dom";
import classes from './NotFound.module.css'

const NotFound = () => {
    return (
        <div className={`flex ${classes.content} flex-col items-center center justify-center`}>
            <h1 className={`text-5xl`}>Page not Found</h1>
            <Link className={`text-gray-500`} to={"/"}>Return to main page ➡</Link>
        </div>
    );
};

export default NotFound;
