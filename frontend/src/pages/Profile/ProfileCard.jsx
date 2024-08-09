import React from 'react';

const ProfileCard = ({user, logout}) => {
    return (
        <div className={`w-full rounded-xl border border-sky-500 p-5`}>
            <div className={`h-40 flex items-center justify-center`}>
                <img className={`rounded-[50%]`} src={user.avatar} width={120} height={120} alt=""/>
            </div>

            <ul className={`w-full`}>
                <li className={`w-full flex justify-between`}>
                    <div className={`mr-3`}>Username</div>
                    <div className={`text-ellipsis overflow-x-hidden`}>{user.username}</div>
                </li>
                <li className={`w-full flex justify-between`}>
                    <div>Active tasks</div>
                    <div>{user.activeTasks.length}</div>
                </li>
                <li className={`w-full flex justify-between`}>
                    <div>Role</div>
                    <div>{user.role}</div>
                </li>
            </ul>
            <button className={`bg-red-600 text-white rounded-xl p-2 mt-2`} onClick={logout}>Logout</button>
        </div>
    );
};

export default ProfileCard;
