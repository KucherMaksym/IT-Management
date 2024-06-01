import React from 'react';
import {Link, useLocation, useSearchParams} from 'react-router-dom';
import Modal from "../../Modal/Modal";


const EmployeeCard = (props) => {


    return (
        <div className={`w-6/12 p-3`}>
            <div className={`h-full w-full rounded-2xl border-2 border-blue-400 bg-blue-50  flex justify-between p-4`}>
                <button
                    className={`flex h-full items-center`}
                    //to={`?modal=true`}
                    onClick={ props.setParams }
                >
                    <img className={`rounded-3xl`} src={props.avatar} alt={''} width={50} />
                    <div className={`flex flex-col w-8/12 ml-4 items-start`}>
                        <h3 className={`text-2xl`}>{props.username}</h3>
                        <div className={`flex flex-nowrap`}>
                            <p className={`mr-3 overflow-hidden text-ellipsis whitespace-nowrap`}>{props.role}</p>
                            <p className={`w-28 overflow-hidden text-ellipsis whitespace-nowrap`}>Active
                                tasks: <strong>{props.activeTasks.length}</strong></p>
                        </div>
                    </div>
                </button>
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
            </div>

        </div>
    );
};

export default EmployeeCard;