import React, {useEffect, useRef, useState} from 'react';
import dayjs from "dayjs";
import FileExtension from "../../../components/FileExtension/FileExtension";
import axios from "axios";
import ImageFullScreen from "../../ImageFullScreen/ImageFullScreen";

const Task = (props) => {
    const [isImageOpened, setIsImageOpened] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [isTaskDivScrollable, setIsTaskDivScrollable] = useState(false);
    const taskComponent = useRef();

    const completeTask = () => {
        axios.patch(`http://localhost:8000/api/tasks/accept/${props.id}`, {}, { withCredentials: true }).then(response => {
            console.log(response.data);
        });
    };

    const acceptTask = () => {
        axios.patch(`http://localhost:8000/api/tasks/accept/${props.id}`, {}, { withCredentials: true }).then(response => {
            console.log(response.data);
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

    return (
        <div className={`w-full lg:max-w-4xl h-full max-h-[700px] ${isTaskDivScrollable ? "overflow-y-scroll" : ""} bg-gray-200 rounded-xl `}  ref={taskComponent}>
            {isImageOpened && <ImageFullScreen onClose={closeImgInFullScreen} fileUrl={currentImage} />}
            <div className={`w-full justify-between  p-5 flex h-20 border-b  border-gray-500`}>
                <div className={`flex items-center`}>
                    {props.loading ? (
                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 animate-pulse"></div>
                    ) : (
                        <img src={props.avatar} alt={``} width={"50px"} style={{borderRadius: "50%"}} className={`mr-4`} />
                    )}
                    <h3 className={`text-xl font-semibold`}>
                        {props.loading ? <div className="w-32 h-6 bg-gray-300 animate-pulse"></div> : props.name}
                    </h3>
                </div>
                <div className={`flex items-center`}>
                    <p className={`flex`}>
                        deadline: <strong>{props.loading ? <div className="w-24 h-6 bg-gray-300 animate-pulse"> </div> : dayjs(props.deadline).format("YYYY-MM-DD")}</strong>
                    </p>
                    {props.bonuses && (
                        <p>
                            bonuses: <strong>{props.loading ? <div className="w-24 h-6 bg-gray-300 animate-pulse"></div> : props.bonuses}</strong>
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
                            props.description
                        )}
                    </p>
                </div>

                {props.task.files && props.task.files.length > 0 && (
                    <div className={`my-10 flex flex-wrap`}>
                        {props.task.files.map((fileUrl, index) => {
                            const fileName = fileUrl.split('/').pop().split('?')[0];
                            return (
                                <div className={`w-1/3 p-2 max-w-xs`} key={index}>
                                    {props.loading ? (
                                        <div className="w-full h-40 bg-gray-300 animate-pulse"></div>
                                    ) : fileName.split(".").pop() === "jpg" ? (
                                        <div
                                            className={`h-40 overflow-hidden rounded-lg shadow-lg hover:shadow-xl duration-300 transition hover:scale-105`}>
                                            <button className={`w-full h-full`} onClick={openImgInFullScreen(fileUrl)}>
                                                <img className={`w-full h-40 object-cover`} src={fileUrl} alt={fileName}
                                                     loading="eager"/>
                                            </button>
                                        </div>
                                    ) : (
                                        <a className={`flex w-full`} href={fileUrl}>
                                            <FileExtension filename={decodeURI(fileName.split("-")[1])}/>
                                            <strong className={`underline text-lg ml-5 text-blue-600 hover:text-blue-800 hover:cursor-pointer visited:text-purple-600`}>
                                                {decodeURI(fileName.split("-")[1])}
                                            </strong>
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
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
