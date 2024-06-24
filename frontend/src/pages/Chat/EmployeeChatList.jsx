import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useSelector} from "react-redux";
import EmployeeCard from "../../components/EmployeeComponents/EmployeeCard/EmployeeCard";

const EmployeeChatList = ({ onSelectUser }) => {

    const [allEmployees, setAllEmployees] = useState([]);
    const user = useSelector(state => state.user);


    const getAllEmployee = () => {
        axios.get("http://localhost:8000/api/companies/allEmployees", {withCredentials: true}).then(response => {
            axios.get("http://localhost:8000/api/users/" + user.company.company.admin, {withCredentials: true}).then((responseAdmin) => {
                const allEmployees = [...response.data, responseAdmin.data]
                const arrayWithoutMe = allEmployees.filter((users) => {
                    return users.username !== user.user.username
                });
                setAllEmployees(arrayWithoutMe)
            })
        })
    }

    useEffect(() => {
        if (user.company.company)
            getAllEmployee()

        return () => {

        };
    }, [user.company.company]);

    return (
        <div className={`w-full h-full`}>
            {
                allEmployees.length > 0 && allEmployees.map((employee) => (
                    <EmployeeCard key={employee._id} onClick={() => onSelectUser(employee)}  isChat={true} {...employee}></EmployeeCard>
                ))
            }
        </div>
    );
};

export default EmployeeChatList;
