import React, { useEffect, useState } from 'react';
import axios from "axios";
import TaskCard from "../TaskCard/TaskCard";
import StaticDatePickerWithHighlight from "../../../components/Calendar/Calendar";
import Task from "../Task/Task";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import noTasks from "./../../../components/assets/noTasks.png"
import {Bounce, toast, ToastContainer} from "react-toastify";

const TaskList = () => {
    const {tasks, loading} = useSelector((state) => state.tasks);
    const [dates, setDates] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isImageOpened, setIsImageOpened] = useState(false);

    const handleNewDay = (e) => {
        setSelectedDay(e)
        const hasTask = dates.some(date => e.isSame(date, 'day'));
        if (hasTask){
            const formattedDate = dayjs(e).format('YYYY-MM-DD');
            axios.get(`http://localhost:8000/api/tasks/taskByDate/${formattedDate}`, { withCredentials: true })
                .then((response) => {
                    if (response.data) {
                        setCurrentTask(response.data);
                    } else {
                        console.log("no tasks")
                    }
                })
                .catch(error => {
                    console.error('Error fetching task by date:', error);
                });
        }
    }

    useEffect(() => {
        if (localStorage.getItem("selectedTask") && localStorage.getItem("selectedTask") !== "undefined") {
            const savedTask = localStorage.getItem("selectedTask")
            const findCurrentTask = tasks.find((task) => task.id === savedTask);
            if (findCurrentTask) {
                setCurrentTask(findCurrentTask);
                setSelectedDay(dayjs(findCurrentTask.deadline));
            }
        }
        const taskDates = tasks.map((task) => task.deadline);
        setDates(taskDates);

    }, [tasks]);

    const clickTask = (id) => () => {
        const newSelectedTask = tasks.find((task) => task.id === id);
        setCurrentTask(newSelectedTask)
        setSelectedDay(dayjs(newSelectedTask.deadline))
        localStorage.setItem("selectedTask", id);
    }

    const handleCompleteTask = () => {
        setCurrentTask(null);
        toast.success('Task Completed!', {
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

    return (
        <div className={`flex container h-[calc(100vh_-_106px)] flex-col items-center justify-center-700 p-3`}>
            {tasks.length > 0  && !loading ?
                <div className="flex flex-col-reverse w-full max-w-4xl items-center lg:flex-row mt-10">
                    <div className="max-h-[600px] border-2 border-gray-300 overflow-x-hidden overflow-y-scroll lg:w-6/12 flex items-center bg-gray-200 h-full justify-start flex-col">
                        {isImageOpened ? document.body.classList.add("no-scroll") : document.body.classList.remove("no-scroll")}
                        {tasks.map((task, index) => (
                            <TaskCard
                                isSelected={currentTask ? currentTask._id === task._id : false}
                                index={index}
                                key={task._id}
                                maxIndex={tasks.length - 1}
                                {...task}
                                onClick={clickTask(task._id)}
                            />
                        ))}
                    </div>
                    <div className="w-6/12 flex flex-col lg:items-end justify-center">
                        <StaticDatePickerWithHighlight onChange={handleNewDay} selectedDay={selectedDay}
                                                       highlightedDates={dates}/>
                    </div>
                </div>
                :
                <div className={`h-full flex flex-col items-center justify-center`}>
                    <h2 className={`text-zinc-800 text-3xl font-bold`}>
                        No any tasks for you
                    </h2>
                    <img src={noTasks} alt=""/>

                </div>
            }
            { currentTask && (
            <div className={`w-full flex my-10 items-center justify-center`}>
                <Task
                    key={currentTask._id}
                    isImageOpened={setIsImageOpened}
                    task={currentTask}
                    completeTask={handleCompleteTask}
                />
            </div>
            )}
        </div>
    );
};

export default TaskList;
