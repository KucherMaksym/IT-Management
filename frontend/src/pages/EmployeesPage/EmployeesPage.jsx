import React, {useState} from 'react';
import axios from "axios";
import EmployeeList from "../../components/EmployeeComponents/EmployeeList/EmployeeList";

const MyComponent = () => {

    const addNewEmployee = () => {
        axios.patch(`http://localhost:8000/api/companies/addNewEmployee`,  {newEmployee: newEmployeeId},{withCredentials: true}).then((response) =>{
            console.log(response.data);
        }).catch((err) => {
            console.error(err);
        })
    }

    const [newEmployeeId, setNewEmployeeId] = useState("");

    return (
        <div className="flex flex-col items-center">
            <h1 className={`text-3xl mt-10 mb-5 `}>Add new Employee</h1>
            <div className={`flex items-center mb-20`}>
                <input className={`h-10 p-2 border-2 border-blue-400 outline-0`} style={{borderRadius: "50px 0 0 50px"}}
                       type="text" value={newEmployeeId} onChange={(e) => setNewEmployeeId(e.target.value)}/>
                <button className={`bg-blue-400 h-10 p-2 text-white`} style={{borderRadius: "0 50px 50px 0"}} onClick={addNewEmployee}>Add +</button>
            </div>
            <EmployeeList/>
        </div>
    );
};

export default MyComponent;
