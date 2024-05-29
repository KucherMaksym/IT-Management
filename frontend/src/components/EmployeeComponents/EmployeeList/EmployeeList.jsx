import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useUser} from "../../../UserProvider";

const MyComponent = () => {

    const [employee, setEmployee] = useState([]);

    const getAllEmployees = () => {
        axios.get("http://localhost:8000/api/companies/allEmployees", {withCredentials: true}).then((response) => {
            if (response.data) {
                console.log(response.data);
                setEmployee(response.data)
            }
        })
    }

    useEffect(() => {
        return () => {
            getAllEmployees();
        };
    }, []);


    return (
        <div className={` container bg-gray-100`}>
            {
                employee && employee.map((employee) => (
                    <div key={employee._id}>{employee.username}</div>
                ))
            }
        </div>
    );
};

export default MyComponent;
