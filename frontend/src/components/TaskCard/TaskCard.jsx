import React from 'react';
import {Link} from "react-router-dom";

const TaskCard = (props) => {
    return (

            <Link className={` w-full flex h-28 border-2 border-gray-300 px-4 items-center max-w-2xl transition-colors duration-100 ${props.index !== 0 ? "rounded-none border-t-0" : "rounded-t-md"} ${props.index === props.maxIndex ? "rounded-b-md" : ""} ${props.isSelected ?  "bg-blue-100" : "bg-gray-100"}` } to={`?${props._id}`} onClick={props.onClick}>
                <div className={`min-w-20 mr-4`}>
                    img
                </div>
                <div className={`flex h-full justify-center items-start flex-col`} >
                    <h1 className={`text-xl`}>{props.name}</h1>
                    <p className={`text-xs`} style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                    }}>{props.description}</p>
                </div>
            </Link>

    );
};

export default TaskCard;
