import React, { useEffect, useState } from 'react';
import axios from "axios";
import TaskCard from "../../../components/TaskCard/TaskCard";
import StaticDatePickerWithHighlight from "../../../components/Calendar/Calendar";
import Task from "../TaskPage/Task";
import dayjs from "dayjs";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [dates, setDates] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selected, setFiles] = useState(null);

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

    const getUserTasks = () => {
        axios.get("http://localhost:8000/api/tasks/allTasks", { withCredentials: true }).then((response) => {
            const taskDates = response.data.map((task) => task.deadline);
            setDates(taskDates);
            setTasks(response.data);
        });
    };

    useEffect(() => {
        getUserTasks();
    }, []);

    const clickTask = (id) => () => {
        axios.get(`http://localhost:8000/api/tasks/${id}`, { withCredentials: true }).then((response) => {
            setCurrentTask(response.data)
            setSelectedDay(dayjs(response.data.deadline))
        })
    }

    const handleDownload = async (fileName) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/tasks/download/${fileName}`);
            window.open(response.data.url, '_blank');
        } catch (error) {
            console.error('Error getting the download URL:', error);
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center p-3`}>
            <div className="flex flex-col-reverse container items-center lg:flex-row mt-10">
                <div className=" lg:w-5/12 flex items-center flex-col">

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
                <div className="w-7/12 flex flex-col items-center justify-center">
                    <StaticDatePickerWithHighlight onChange={handleNewDay} selectedDay={selectedDay}
                                                   highlightedDates={dates}/>
                </div>
            </div>
            <div className={`w-full flex items-center justify-center`}>
                {
                    currentTask && (
                        <Task
                            handleDownload={handleDownload}
                            task={currentTask}
                            {...currentTask} />
                    )
                }
            </div>
        </div>
    );
};

export default TaskList;
