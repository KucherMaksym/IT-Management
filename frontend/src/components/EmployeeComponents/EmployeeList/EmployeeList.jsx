import React, {useEffect, useState} from 'react';
import axios from "axios";
import EmployeeCard from "../EmployeeCard/EmployeeCard";
import {useNavigate, useSearchParams} from "react-router-dom";
import Modal from "../../Modal/Modal";

const MyComponent = () => {

    const [employee, setEmployee] = useState([]);
    let [searchParams, setSearchParams] = useSearchParams();
    const modalId = searchParams.get('modal');
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUserModal, setCurrentUserModal] = useState(null);
    const [newRole, setNewRole] = useState();
    const [loading, setLoading] = useState(false);

    const getEmployee = (id) => {
        if (id) {
            try {
                setLoading(true); // Установите loading в true перед запросом
                axios.get(`http://localhost:8000/api/users/${id}`, {withCredentials: true})
                    .then((response) => {
                        setCurrentUserModal(response.data); // Установите текущего сотрудника
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => {
                        setLoading(false); // Установите loading в false после запроса
                    });
            } catch (err) {
                console.log(err);
            }
        }
    }


    const getAllEmployees = () => {
        axios.get("http://localhost:8000/api/companies/allEmployees", {withCredentials: true}).then((response) => {
            if (response.data) {
                setEmployee(response.data);
            }
        })
    }

    const changeRole = () => {
        axios.patch("http://localhost:8000/api/users/changeRole", {
            userToChangeRole: currentUserModal,
            newRole: newRole,
            isNewCompany: false
        }, {withCredentials: true}).then((response) => {
            console.log(response.data);
        })
    }

    useEffect(() => {
        getAllEmployees();
        if (modalId) {
            getEmployee(modalId);
        }
    }, [modalId]);


    const openModal = (id) => () => {
        setSearchParams({modal: `${id}`});
        setIsModalOpen(true);
    }

    const closeModal = () => {
        searchParams.delete('modal');
        setIsModalOpen(false);
        navigate(`?${searchParams.toString()}`, { replace: true });
        changeRole();
    };


    return (
        <div className="flex container w-screen flex-wrap p-4 ">
            {
                employee.length > 0 && employee.map((employee) => (
                    <EmployeeCard key={employee._id} setParams={openModal(employee._id)} {...employee}></EmployeeCard>
                ))
            }
            {isModalOpen && !loading && <Modal onClose={closeModal}>
                {
                    currentUserModal  ? <div>
                        <h2 className={`text-2xl mt-5`}>{currentUserModal.username}</h2>
                        <div className={`my-5 flex flex-col items-center `}>
                            <div className={`flex w-full justify-between max-w-md`}>
                                <p>role</p>
                                <strong>{currentUserModal.role}</strong>
                            </div>
                            <div className={`flex w-full justify-between max-w-md`}>
                                <p>bonuses</p>
                                <strong>{currentUserModal.bonuses}</strong>
                            </div>
                            <div className={`flex w-full justify-between max-w-md`}>
                                <p>groups</p>
                                {currentUserModal.groups.length > 0 ? <strong>{currentUserModal.groups}</strong> : <strong>—</strong>}
                            </div>
                        </div>

                        <form>
                            <h5 className={`mb-2 font-medium`}>change role</h5>
                            <select className={`border-b border-b-blue-400 outline-0`} defaultValue={currentUserModal.role} value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                                <option value="team lead">Team leader</option>
                                <option value="senior developer">Senior developer</option>
                                <option value="middle developer">Middle developer</option>
                                <option value="junior developer">Junior developer</option>
                                <option value="designer">Designer</option>
                                <option value="other">Other</option>
                            </select>

                        </form>

                    </div> : <div>no info</div>
                }


            </Modal>
            }

        </div>
    );
};

export default MyComponent;
