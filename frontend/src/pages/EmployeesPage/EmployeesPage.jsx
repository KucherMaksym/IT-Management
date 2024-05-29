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
        <div>
            <h1>Add new Employee</h1>
            <input className={`border-2`} type="text" value={newEmployeeId} onChange={(e) => setNewEmployeeId(e.target.value)}/>
            <button onClick={addNewEmployee}>Add +</button>
            <EmployeeList />
        </div>
    );
};

export default MyComponent;
