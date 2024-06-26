import React, {memo, useState} from 'react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const ProfileNavbar = memo(() => {

    const {company} = useSelector(state => state.user);

    const [tab, setTab] = useState('profile');

    const changeTab = (value) => {
        setTab(value)
    }



    return (
        <nav className={`container flex justify-start h-10 items-center`}>
            <Link className={`mr-5 font-semibold hover:text-sky-600 duration-200 ${tab === "profile" ? "text-sky-600" : ""}`} to={"/profile"} onClick={() => changeTab('profile')}>
                Profile
            </Link>
            <Link className={`mr-5 font-semibold hover:text-sky-600 duration-200 ${tab === "tasks" ? "text-sky-600" : ""}`} to="/profile/tasks" onClick={() => changeTab("tasks")}>
                Tasks
            </Link>
            <Link className={`mr-5 font-semibold hover:text-sky-600 duration-200 ${tab === "chat" ? "text-sky-600" : ""}`} to="/profile/chat" onClick={() => changeTab("chat")}>
                Chat
            </Link>
            <Link className={`mr-5 font-semibold hover:text-sky-600 duration-200 ${tab === "stars" ? "text-sky-600" : ""}`} to="/profile/stars" onClick={() => changeTab("stars")}>
                Stars
            </Link>
            {
                company.isAdmin &&
                <Link className={`mr-5 font-semibold hover:text-sky-600 duration-200 ${tab === "employees" ? "text-sky-600" : ""}`} to="/company/employees" onClick={() => changeTab("employees")}>
                    Employees
                </Link>
            }
            {
                company.isAdmin &&
                <Link className={`mr-5 font-semibold hover:text-sky-600 duration-200 ${tab === "consideration" ? "text-sky-600" : ""}`} to="/company/consideration" onClick={() => changeTab("consideration")}>
                    Consideration
                </Link>
            }

        </nav>
    );
});

export default ProfileNavbar;
