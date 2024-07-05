import React, {useRef, useState} from 'react';
import axios from "axios";
import EmployeeList from "../../components/EmployeeComponents/EmployeeList/EmployeeList";
import {useMutation, useQuery, useQueryClient} from "react-query";

const MyComponent = () => {

    const inputId = useRef(null);
    const queryClient = useQueryClient();

    const fetchEmployees = async () => {
        const { data } = await axios.get("http://localhost:8000/api/companies/allEmployees", {withCredentials: true});
        return data;
    }

    const {data, isLoading, isError} = useQuery({queryKey: "employees", queryFn: fetchEmployees, refetchOnWindowFocus: true})

    const addNewEmployee = async () => {
        const response = await axios.patch(`http://localhost:8000/api/companies/addNewEmployee`, { newEmployee: inputId.current.value }, { withCredentials: true });
        return response.data;
    }

    const mutation = useMutation({
        mutationFn: addNewEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
        },
        onError: (error) => {
            console.error(error);
        }
    })

    const handleAddEmployee = () => {
        mutation.mutate()
    }




    return (
        <div className="flex flex-col items-center">
            <h1 className={`text-3xl mt-10 mb-5 `}>Add new Employee</h1>
            <div className={`flex items-center mb-20`}>
                <input className={`h-10 p-2 border-2 border-blue-400 outline-0`} style={{borderRadius: "50px 0 0 50px"}}
                       type="text" ref={inputId}/>
                <button className={`bg-blue-400 h-10 p-2 text-white`} style={{borderRadius: "0 50px 50px 0"}} onClick={handleAddEmployee}>Add +</button>
            </div>
            <EmployeeList employees={data} />
        </div>
    );
};

export default MyComponent;
