import React, { useState } from 'react';
import StaticDatePickerLandscape from "../../components/Calendar/Calendar";
import Input from "../../components/Input/Input";
import classes from "./NewTask.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const NewTask = () => {
    const [newTask, setNewTask] = useState({
        name: "",
        description: "",
    });
    const [selectedDay, setSelectedDay] = useState(null);
    const [files, setFiles] = useState([]);

    const { id } = useParams();

    const handleNewTask = (event) => {
        setNewTask({...newTask, [event.target.name]: event.target.value});
        console.log(newTask);
    };

    const handleNewDay = (e) => {
        setSelectedDay(e);
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const sendNewTask = async () => {
        if (!newTask.name || !newTask.description) {
            return console.log("Введи описание и название задачи");
        }

        const formData = new FormData();
        formData.append('name', newTask.name);
        formData.append('description', newTask.description);
        formData.append('deadline', selectedDay.format("YYYY-MM-DD"));

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/tasks/newTask/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading the task:', error);
        }
    };

    return (
        <div className={`container max-w-screen-xl mt-10 flex items-center justify-center`} style={{ height: `calc(100vh-12)` }}>
            <div className={`w-5/12 flex items-center justify-center`} style={{ width: "" }}>
                <StaticDatePickerLandscape onChange={handleNewDay} value={selectedDay} />
            </div>
            <div className={`w-7/12 flex h-full flex-col items-center `}>
                <Input label="Task name" name={"name"} value={newTask["name"]} onChange={handleNewTask} />
                <div className={` h-full flex mt-10 w-full justify-center`}>
                    <div className={`relative w-6/12`}>
                        <textarea
                            className={`${classes.textarea} max-h-60 min-h-60 w-full bg-gray-300 resize-none outline-0 rounded-2xl p-2 border-gray-50`}
                            value={newTask["description"]}
                            name={"description"}
                            onChange={handleNewTask}
                        ></textarea>
                        <label
                            className={` ${classes.label} absolute top-5 text-gray-700 m-3 ${newTask.description ? `${classes.focused}` : ""}`}
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
                    <button className={`bg-blue-500 text-white rounded-xl p-1 w-16`} onClick={sendNewTask}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default NewTask;
