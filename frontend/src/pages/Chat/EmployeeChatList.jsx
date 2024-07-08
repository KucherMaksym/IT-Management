import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useSelector} from "react-redux";
import EmployeeCard from "../../components/EmployeeComponents/EmployeeCard/EmployeeCard";
import {useQuery, useQueryClient} from "react-query";

const EmployeeChatList = (props) => {

    const user = useSelector(state => state.user);
    const queryClient = useQueryClient();

    const fetchAllEmployees = () => {
        axios.get("http://localhost:8000/api/companies/allEmployees", {withCredentials: true}).then(response => {
            axios.get("http://localhost:8000/api/users/" + user.company.company.admin, {withCredentials: true}).then((responseAdmin) => {
                const allEmployees = [...response.data, responseAdmin.data]
                const arrayWithoutMe = allEmployees.filter((users) => {
                    return users.username !== user.user.username
                });
                console.log(arrayWithoutMe)
                props.setAllEmployees(arrayWithoutMe)
            })
        })
    }


    const { data, isLoading, isError } = useQuery(["employees", user?.company?.company?.admin], () => fetchAllEmployees(user), {
            enabled: !!user?.company?.company?.admin,
            onSuccess: (data) => {
                props.setAllEmployees(data);
                queryClient.setQueryData("employees", data);
            },
        }
    );


    return (
        <div className={`w-full h-full`}>
            {
                props.allEmployees && props.allEmployees.length > 0 && props.allEmployees.map((employee) => (
                    <EmployeeCard key={employee._id} onClick={() => props.onSelectUser(employee)} isChat={true} {...employee}></EmployeeCard>
                ))
            }
        </div>
    );
};

export default EmployeeChatList;
