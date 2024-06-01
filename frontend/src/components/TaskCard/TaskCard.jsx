import React from 'react';
import {Link} from "react-router-dom";

const TaskCard = (props) => {
    return (

            <Link className={`w-6/12`} to={`${props.id}`}>
                <div className="bg-gray-300 mt-10 max-w-2xl ">
                    <h1>{props.name}</h1>
                    <p>{props.description}</p>
                </div>
            </Link>

    );
};

export default TaskCard;
