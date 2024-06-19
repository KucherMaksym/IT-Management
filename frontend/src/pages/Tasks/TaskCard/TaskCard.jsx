import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";

const TaskCard = (props) => {
    const [avatar, setAvatar] = useState(null);

    const getUserAvatar = () => {
    }
    axios.get(`http://localhost:8000/api/users/${props.isConsideration ? props.takenBy : props.createdBy }`, {withCredentials: true}).then((response) => {
        setAvatar(response.data.avatar)
        props.setAvatar(response.data.avatar);
    })

    useEffect(() => {
        getUserAvatar();
    }, [])


    return (

            <Link className={` w-full flex h-28  ${props.isConsideration ? "border-b-2" : "border-2 border-t-0"} border-gray-300 px-4 items-center transition-transform hover:scale-105 hover:border-t-2  ${props.index !== 0 ? "rounded-none " : "border-t-2 rounded-t-md"} ${props.isSelected ?  "bg-blue-100" : "bg-gray-100"}` } to={`?${props._id}`} onClick={props.onClick}>
                <div className={`min-w-20 mr-4 flex justify-center items-center`}>
                    { avatar ?
                        <img src={avatar} alt="" className="rounded-full max-w-16" />
                        :
                        <div>hui</div>
                    }
                </div>
                <div className={`flex h-full w-full justify-center items-start flex-col`} >

                    <h1 className={`text-lg text-start font-semibold line-clamp-2 leading-6`}>{props.name}</h1>

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
