import React, { useState } from 'react';
import StaticDatePickerLandscape from "../../../components/Calendar/Calendar";
import Input from "../../../components/Input/Input";
import classes from "./NewTask.module.css";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import { useMutation } from 'react-query';
import axios from "axios";
import {Bounce, toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const createNewTask = async (taskData) => {
    const response = await axios.post(`http://localhost:8000/api/tasks/newTask/${taskData.id}`, taskData.formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    });
    return response.data;
};

const NewTask = () => {
    const [newTask, setNewTask] = useState({
        name: "",
        description: "",
    });
    const [selectedDay, setSelectedDay] = useState(null);
    const [files, setFiles] = useState([]);

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleNewTask = (event) => {
        setNewTask({...newTask, [event.target.name]: event.target.value});
    };

    const handleNewDay = (e) => {
        setSelectedDay(e);
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };


    const mutation = useMutation(createNewTask, {
        onSuccess: (data) => {
            toast.success("Task Created", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            const returnTo = searchParams.get('returnTo');
            if (returnTo) {
                navigate(returnTo);
            } else {
                navigate('/');  // Пример дефолтного перенаправления
            }
        },
        onError: (error) => {
            console.error('Error uploading the task:', error);
        }
    });

    const sendNewTask = () => {
        if (!newTask.name || !newTask.description || !selectedDay) {
            return toast.error('Write the name, description and select the deadline of new task', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }

        const formData = new FormData();
        formData.append('name', newTask.name);
        formData.append('description', newTask.description);
        formData.append('deadline', selectedDay.format("YYYY-MM-DD"));

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        mutation.mutate({ id, formData });
    };

    return (
        <div className={`container max-w-screen-xl mt-10 flex items-center justify-center`} style={{ height: `calc(100vh - 12)` }}>

            <div className={`w-5/12 flex items-center justify-center`} style={{ width: "" }}>
                <StaticDatePickerLandscape onChange={handleNewDay} value={selectedDay} />
            </div>
            <div className={`w-7/12 flex h-full flex-col items-center`}>
                <Input label="Task name" name={"name"} value={newTask["name"]} onChange={handleNewTask} />
                <div className={`h-full flex mt-10 w-full justify-center`}>
                    <div className={`relative w-6/12`}>
                        <textarea
                            className={`${classes.textarea} max-h-60 min-h-60 w-full bg-gray-300 resize-none outline-0 rounded-2xl p-2 border-gray-50`}
                            value={newTask["description"]}
                            name={"description"}
                            onChange={handleNewTask}
                        ></textarea>
                        <label
                            className={`${classes.label} absolute top-5 text-gray-700 m-3 ${newTask.description ? `${classes.focused}` : ""}`}
                        >
                            Description
                        </label>
                    </div>
                </div>
                <div className={`flex justify-start mt-5`}>
                    <input
                        type="file"
                        className={`border-0 file:border-0 file:p-1 file:bg-blue-500 file:rounded-xl file:text-white`}
                        multiple
                        onChange={handleFileChange}
                    />
                    <button className={`bg-blue-500 text-white rounded-xl p-1 w-16`} onClick={sendNewTask} disabled={mutation.isLoading}>
                        {mutation.isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewTask;
