// import React, {useEffect} from 'react';
// import axios from "axios";
//
// const ConsiderationTaskList = (props) => {
//
//     const [user, setUser] = React.useState(null);
//
//     const getUserById = () => {
//         axios.get(`http://localhost:8000/api/users/${props.task.takenBy}`, {withCredentials: true}).then((response) => {
//             setUser(response.data)
//         })
//     }
//
//     useEffect(() => {
//         getUserById()
//     }, [])
//     return (
//         <div className={`w-full flex justify-start items-center rounded-md ${props.index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}>
//            <div className={`w-20 h-20 flex justify-center items-center`}>
//                {
//                    user && <img className={` w-12 `} style={{borderRadius: "50%"}} src={user.avatar} alt=""/>
//                }
//            </div>
//             <div>
//             <div className={`flex flex-col justify-start items-start`}>
//                    <h3 className={`font-semibold`}>{props.task.name}</h3>
//                    <p>{props.task.description}</p>
//                </div>
//            </div>
//         </div>
//     );
// };
//
// export default ConsiderationTaskList;
