import React, {useEffect, useState} from 'react';
import {useUser} from "../../../UserProvider";
import axios from "axios";
import TaskCard from "../../../components/TaskCard/TaskCard";

const TaskList = () => {

    const {user} = useUser();
    const [tasks, setTasks] = useState([]);

    const getUserTasks = () => {
        axios.get("http://localhost:8000/api/tasks/allTasks", {withCredentials: true}).then((response) => {
            console.log(response.data);
            setTasks(response.data)
        })
    }

    useEffect(() => {
        getUserTasks();
    }, []);

    return (
        <div className="flex container flex-wrap ">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    id={task._id}
                    name= {task.name}
                    description={task.description}
                />
            ))}
        </div>
    );
};

export default TaskList;
