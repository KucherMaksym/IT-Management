import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {useUser} from "../../UserProvider";

const MyComponent = () => {

    const { user, loading, isAuthenticated, company} = useUser()

    const [tab, setTab] = useState('profile');

    const changeTab = (value) => {
        setTab(value)
    }



    return (
        <nav className={`container flex justify-start h-10 items-center`}>
            <Link className="mr-5" to={"/profile"} onClick={() => changeTab('profile')}>
                Profile
            </Link>
            <Link className="mr-5" to="/profile/tasks" onClick={() => changeTab("tasks")}>
                Tasks
            </Link>
            <Link className="mr-5" to="/profile/messages" onClick={() => changeTab("messages")}>
                Messages
            </Link>
            <Link className="mr-5" to="/profile/stars" onClick={() => changeTab("stars")}>
                Stars
            </Link>
            {
                company.isAdmin &&
                <Link className="mr-5" to="/company/employees" onClick={() => changeTab("employees")}>
                    Employees
                </Link>
            }

        </nav>
    );
};

export default MyComponent;
