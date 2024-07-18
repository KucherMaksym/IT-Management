import React, { memo, useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DropDownMenu from "../DropDownMenu/DropDownMenu";

const ProfileNavbar = memo(() => {
    const { company } = useSelector(state => state.user);
    const [tab, setTab] = useState('profile');
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const navRef = useRef(null);

    const changeTab = (value) => {
        setTab(value);
        localStorage.setItem("previous tab", value);
    }

    useEffect(() => {
        const previousTab = localStorage.getItem("previous tab");
        if (previousTab) {
            changeTab(previousTab);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setOpenMenuIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMenuToggle = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const menuItems = [
        { title: "Profile", options: ["Tasks", "Chat", "Stars"], path: ["/profile/tasks", "/profile/chat", "/profile/stars"] },
    ];

    if (company.isAdmin) {
        menuItems.push(
            {title: "Company", options: ["Employees", "Settings", "Consideration"], path: ["/company/employees", "/company/settings", "/company/consideration"] },
        );
    }

    return (
        <nav className={`container ml-10 flex justify-start h-10 items-center`} ref={navRef}>
            {menuItems.map((item, index) => (
                item.options ? (
                    <DropDownMenu
                        key={index}
                        title={item.title}
                        options={item.options}
                        path={item.path}
                        isOpen={openMenuIndex === index}
                        onToggle={() => handleMenuToggle(index)}
                    />
                ) : (
                    <Link
                        key={index}
                        className={`mr-5 font-semibold hover:text-sky-600 duration-200 ${tab === item.title.toLowerCase() ? "text-sky-600" : ""}`}
                        to={item.path}
                        onClick={() => changeTab(item.title.toLowerCase())}
                    >
                        {item.title}
                    </Link>
                )
            ))}
        </nav>
    );
});

export default ProfileNavbar;