import React from 'react';
import {Link, useLocation, useSearchParams} from 'react-router-dom';


const EmployeeCard = (props) => {


    return (
        <div className={`w-full ${props.isChat ? "" : "p-3" } `}>
            <div className={`w-full h-24 border-2 ${props.isChat ? "border-x-0 border-t-0 border-gray-400" : "border-blue-400 rounded-2xl"}  bg-blue-50  flex justify-between ${props.isChat ? "" : "p-4" } `}>
                <button
                    className={`flex h-full items-center ${props.isChat ? "w-full p-4" : ""}`}
                    onClick={ props.onClick } >
                    <img className={`rounded-3xl`} src={props.avatar} alt={''} width={50} />
                    <div className={`flex flex-col w-8/12 h-full ml-4 items-start justify-center`}>
                        <h3 className={`text-xl overflow-x-hidden w-full overflow-y-hidden text-start whitespace-nowrap text-ellipsis`}>{props.username}</h3>
                        <div className={`flex flex-nowrap`}>
                            <p className={`mr-3 text-sm overflow-hidden text-ellipsis whitespace-nowrap`}>{props.role}</p>
                            {
                                !props.isChat && (
                                    <p className={`w-28 overflow-hidden text-ellipsis whitespace-nowrap`}>Active
                                        tasks: <strong>{props.activeTasks.length}</strong>
                                    </p>
                                )
                            }
                        </div>
                    </div>
                </button>
                {
                    !props.isChat && (
                <div className={`w-4/12 flex items-center`}>
                <div className={`w-6/12`}>
                        <Link to={`/company/newTask/${props._id}`}>
                            New
                        </Link>
                    </div>
                    <div className={`w-6/12`}>
                        <Link to={''}>
                            Write
                        </Link>
                    </div>
                </div>
                    )
                }
            </div>
        </div>
    );
};

export default EmployeeCard;