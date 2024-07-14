import React from 'react';
import { Link } from "react-router-dom";

const DropDownMenu = ({ title, options, isOpen, onToggle, path }) => {
    return (
        <div className={`relative inline-block`}>
            <button
                className={`mr-5 flex items-center font-semibold hover:text-sky-600 duration-200`}
                onClick={onToggle}
            >
                {title}
                <svg className={`-mr-1 ml-2 h-5 w-5 duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                     fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"/>
                </svg>
            </button>
            <div className={`absolute left-[-50%] z-10 w-40 bg-gray-200 border border-gray-300 rounded-md
        origin-top transform transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 scale-y-100' : 'scale-y-0 opacity-0'}
      `}>
                <ul>
                    {options?.map((option, index) => (
                        <li className={`h-10 flex items-center justify-center`} key={index}>
                            <Link to={path[index]}>{option}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DropDownMenu;