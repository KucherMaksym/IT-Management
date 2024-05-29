import React from 'react';
import logo from "./../assets/DoIT.png"
import {Link, useLocation} from "react-router-dom";
import ProfileNavbar from "../ProfileNavbar/ProfileNavbar";
import {useUser} from "../../UserProvider";

const MyComponent = () => {

    //const [userLogo, setUserLogo] = React.useState();

    const { user, loading, isAuthenticated} = useUser();

    const location = useLocation();
    let isProfile = location.pathname.startsWith("/profile");

    // useEffect(() => {
    //     return () => {
    //         axios.get("http://localhost:8000/profile", {withCredentials: true}).then((res) => {
    //             setUserLogo(res.data.avatar)
    //         });
    //     };
    // }, []);


    return (
        <header className={` w-full flex flex-col items-center justify-center `}>
            <div className="container flex items-center justify-between h-16">
                <Link to="/">
                    <img src={logo} alt="Logo" width={"68px"}/>
                </Link>
                    {loading ? <p>Loading</p> : user && isAuthenticated ?
                        <Link to={"/profile"}>
                            <img src={user.avatar} alt="userLogo" width={"42px"} style={{borderRadius: "50%"}}/>
                        </Link>
                        :
                        <a href={"http://localhost:8000/auth/github"}>Login with Github</a>
                    }
            </div>
            <div className={` flex w-full justify-center  border-b-2 border-b-gray-300`}>
                {isProfile && (<ProfileNavbar/>)}
            </div>

        </header>
    );
};

export default MyComponent;
