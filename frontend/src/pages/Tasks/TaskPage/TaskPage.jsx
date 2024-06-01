import React, {useEffect} from 'react';
import axios from "axios";
import {useParams} from "react-router-dom";

const TaskPage = () => {

    const {taskId} = useParams();

    const getTask = () => {
        axios.get(`http://localhost:8000/api/tasks/${taskId}`, {withCredentials: true}).then((response) => {
            console.log(response.data);
        })
    }
    useEffect(() => {

        getTask()
    }, []);




    return (
        <div>

        </div>
    );
};

export default TaskPage;
