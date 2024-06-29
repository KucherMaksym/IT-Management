import React, { useEffect, useState } from 'react';
import axios from "axios";
import TaskCard from "../Tasks/TaskCard/TaskCard";
import Task from "../Tasks/Task/Task";
import {removeTask} from "../../redux/actions/tasksActions";
import {Bounce, toast, ToastContainer} from "react-toastify";

const ConsiderationPage = () => {
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [isImageOpened, setIsImageOpened] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    const getAllConsiderationTasks = () => {
        axios.get("http://localhost:8000/api/tasks/allConsiderationTasks", { withCredentials: true }).then((response) => {
            setTasks(response.data);
        });
    };

    const clickTask = (id) => () => {
        setCurrentTask(tasks.find(task => task._id === id))
    };

    const handleAcceptTask = () => {
        toast.success('✔️ Task Accepted!', {
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
        setTasks((prevState) => prevState.filter((element) => {return element !== currentTask}))
        setCurrentTask(null);
    }

    useEffect(() => {
        getAllConsiderationTasks();
    }, []);

    return (
        <div className="w-full container">
            { tasks.length > 0 &&
            <div className={`w-full flex flex-col lg:flex-row my-10`}>
                <div className="w-full lg:w-6/12 bg-gray-200 rounded-xl mb-10 lg:mb-0 lg:mr-10 lg:h-[calc(100vh-106px)] max-h-[700px] border-2 overflow-y-scroll overflow-x-hidden">
                    {tasks.map((task, index) => (
                        <TaskCard
                            isConsideration={true}
                            setAvatar={setCurrentAvatar}
                            isSelected={currentTask ? currentTask._id === task._id : false}
                            index={index}
                            key={task._id}
                            maxIndex={tasks.length - 1}
                            {...task}
                            onClick={clickTask(task._id)}
                        />
                    ))}
                </div>
                <div className="w-full flex items-center justify-center">
                    {currentTask && (
                        <Task
                            isConsideration={true}
                            key={currentTask._id}
                            avatar={currentAvatar}
                            isImageOpened={setIsImageOpened}
                            task={currentTask}
                            loading={loading}
                            completeTask={handleAcceptTask}
                            {...currentTask}
                        />
                    )}
                </div>
            </div>
            }
        </div>
    );
};

export default ConsiderationPage;
