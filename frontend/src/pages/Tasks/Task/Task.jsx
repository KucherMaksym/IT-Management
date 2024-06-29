import React, {useEffect, useRef, useState} from 'react';
import dayjs from "dayjs";
import axios from "axios";
import ImageFullScreen from "../../ImageFullScreen/ImageFullScreen";
import TaskImages from "./TaskImages/TaskImages";
import TaskFiles from "./TaskFiles/TaskFiles";
import {useDispatch} from "react-redux";
import {removeTask} from "../../../redux/actions/tasksActions";
import {ToastContainer} from "react-toastify";



const Task = (props) => {
    const [isImageOpened, setIsImageOpened] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [isTaskDivScrollable, setIsTaskDivScrollable] = useState(false);
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const taskComponent = useRef();
    const dispatch = useDispatch();

    const completeTask = () => {
        axios.patch(`http://localhost:8000/api/tasks/complete/${props.task.id}`, {}, { withCredentials: true }).then(response => {
            console.log(response.data);
            dispatch(removeTask(props.task._id));
            props.completeTask();
        });
    };

    const acceptTask = () => {
        axios.patch(`http://localhost:8000/api/tasks/accept/${props.task.id}`, {}, { withCredentials: true }).then(response => {
            console.log(response.data);
            props.completeTask();
        })
    }

    const openImgInFullScreen = (fileUrl) => () => {
        props.isImageOpened(true);
        setIsImageOpened(true);
        setCurrentImage(fileUrl);
    };

    const closeImgInFullScreen = () => {
        props.isImageOpened(false);
        setIsImageOpened(false);
        setCurrentImage(null);
    };

    useEffect(() => {
        const taskDiv = taskComponent.current;
        if (taskDiv.scrollHeight > taskDiv.clientHeight) {
            setIsTaskDivScrollable(true)
        }

    }, [])

    useEffect(() => {
        const newFiles = [];
        const newImages = [];

        props.task.files.forEach((fileUrl) => {
            const fileName = fileUrl.split('/').pop().split('?')[0];

            if (["jpg", "png", "jpeg"].includes(fileName.split(".").pop())) {
                newImages.push(fileUrl);
            } else {
                newFiles.push(fileUrl);
            }
        });

        setFiles(newFiles);
        setImages(newImages);

    }, [props.task.files]);
    return (
        <div className={`w-full lg:max-w-4xl h-full max-h-[700px] ${isTaskDivScrollable ? "overflow-y-scroll" : ""} bg-gray-200 rounded-xl `}  ref={taskComponent}>
            {isImageOpened && <ImageFullScreen onClose={closeImgInFullScreen} fileUrl={currentImage} />}
            <div className={`w-full justify-between  p-5 flex h-20 border-b  border-gray-500`}>
                <div className={`flex items-center`}>
                    {props.loading ? (
                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 animate-pulse"></div>
                    ) : (
                        <img src={props.task.createdBy.avatar} alt={``} width={"50px"} style={{borderRadius: "50%"}} className={`mr-4`} />
                    )}
                    <h3 className={`text-xl font-semibold`}>
                        {props.loading ? <div className="w-32 h-6 bg-gray-300 animate-pulse"></div> : props.task.name}
                    </h3>
                </div>
                <div className={`flex items-center`}>
                    <p className={`flex`}>
                        deadline: <strong>{props.loading ? <div className="w-24 h-6 bg-gray-300 animate-pulse"> </div> : dayjs(props.task.deadline).format("YYYY-MM-DD")}</strong>
                    </p>
                    {props.task.bonuses && (
                        <p>
                            bonuses: <strong>{props.loading ? <div className="w-24 h-6 bg-gray-300 animate-pulse"></div> : props.task.bonuses}</strong>
                        </p>
                    )}
                </div>
            </div>
            <div className={`w-full text-start p-5 flex flex-col justify-between min-h-60`}>
                <div>
                    <p className={``}>
                        {props.loading ? (
                            <>
                                <div className="w-full h-6 bg-gray-300 mb-2 animate-pulse"></div>
                                <div className="w-3/4 h-6 bg-gray-300 mb-2 animate-pulse"></div>
                                <div className="w-1/2 h-6 bg-gray-300 animate-pulse"></div>
                            </>
                        ) : (
                            props.task.description
                        )}
                    </p>
                </div>
                { images.length > 0 &&
                    <div className={`my-10 flex flex-wrap`}>
                        { images.map((image, index) => (
                            <div className={`w-1/3 p-2 max-w-xs`}>
                                <TaskImages
                                    key={index}
                                    openImgInFullScreen={openImgInFullScreen}
                                    fileUrl={image}
                                    fileName={image.split('/').pop().split('?')[0]}
                                />
                            </div>
                        ))}
                    </div>
                }
                {files.length > 0 && files.map((file, index) => (
                    <TaskFiles
                        fileUrl={file}
                        fileName={file.split('/').pop().split('?')[0]}
                    />
                    ))
                }
                <div className={`w-full flex justify-end `}>
                    {props.loading ? (
                        <div className="w-24 h-10 bg-gray-300 rounded-xl animate-pulse"></div>
                    ) : (
                        <button className={`bg-blue-600 text-white font-bold rounded-xl px-4 p-2 hover:bg-blue-400 duration-200`} onClick={props.isConsideration ? acceptTask : completeTask}>{`${props.isConsideration ? "Accept" : "Complete"}`}</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Task;
