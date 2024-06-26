import React from 'react';
import {Link} from "react-router-dom";
import unknownPerson from "./../../../components/assets/unknownPerson.jpg"
import dayjs from "dayjs";
import DifferenceBetweenTwoDates from "../../../components/DifferenceBetweenTwoDates/DifferenceBetweenTwoDates";

const TaskCard = (props) => {

    return (

            <Link className={`relative w-full flex min-h-[112px] hover:border-b-2 border-gray-300 px-4 items-center transition-transform hover:scale-105 hover:border-t-2 rounded-none ${props.index === 0 ? "border-t-0" : "border-t-2"} ${props.isSelected ?  "bg-blue-100" : "bg-gray-100"}` } to={`?${props._id}`} onClick={props.onClick}>
               <DifferenceBetweenTwoDates deadline={props.deadline} unit={"days"} />
                <div className={`min-w-20 mr-4 flex justify-center items-center`}>
                    { props.createdBy.avatar ?
                        <img src={props.createdBy.avatar} alt="" className="rounded-full max-w-16" />
                        :
                        <img src={unknownPerson} className="rounded-full max-w-16" />
                    }
                </div>
                <div className={`flex h-full w-full justify-center items-start flex-col`} >

                    <h1 className={`text-lg text-start font-semibold line-clamp-2 leading-6`}>{props.name}</h1>

                    <p className={`text-xs text-start break-words md:max-w-[241px]`} style={{
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
