import React, {memo } from 'react';
import logo from "./../assets/DoIT.png"
import {Link, useLocation} from "react-router-dom";
import ProfileNavbar from "../ProfileNavbar/ProfileNavbar";
import {useSelector} from "react-redux";
import LogInWithGitHub from "../LogIn/LogInWithGitHub";

const Header = memo(() => {
    const {user, loading, isAuthenticated} = useSelector((state) => state.user);

    const location = useLocation();
    let isProfile = location.pathname.startsWith("/profile");
    let isCompany = location.pathname.startsWith("/company");
    return (
        <header className={` w-full flex flex-col items-center justify-center `}>
            <div className="container flex items-center justify-between h-16">
                <Link className={`ml-5`} to="/">
                    <img src={logo} alt="Logo" width={"68px"}/>
                </Link>
                    {loading ? <p>Loading</p> : user && isAuthenticated ?
                        <Link className={`mr-5`} to={"/profile"}>
                            <img src={user.avatar} alt="userLogo" width={"42px"} style={{borderRadius: "50%"}}/>
                        </Link>
                        :
                        <LogInWithGitHub />
                    }
            </div>
            <div className={` flex w-full justify-center  border-b-2 border-b-gray-300`}>
                {isProfile && (<ProfileNavbar/>) || isCompany && (<ProfileNavbar/>)}
            </div>

        </header>
    );
});

export default Header;
