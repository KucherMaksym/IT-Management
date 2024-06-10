import React, {} from 'react';
import dayjs from "dayjs";
import FileExtension from "../../../components/FileExtension/FileExtension";

const Task = (props) => {


    return (
        <div className={`w-full mt-10 lg:max-w-2xl mb-20 rounded-xl  bg-gray-100`}>
            <div className={`w-full justify-between p-5 flex h-20 border-b border-gray-500`}>
                <div className={`flex items-center`}>
                    <span className={`mr-4`}>img</span>
                    <h3 className={`text-xl font-semibold`}>{props.name}</h3>
                </div>
                <div className={`flex items-center`}>
                    <p>deadline: <strong>{dayjs(props.deadline).format("YYYY-MM-DD")}</strong></p>
                    {
                        props.bonuses && <p>bonuses: <strong>{props.bonuses}</strong></p>
                    }

                </div>
            </div>
            <div className={`w-full text-start p-5 flex flex-col justify-between min-h-60`}>
                <div>
                    <p className={``}>{props.description}</p>
                </div>

                {props.task.files && props.task.files.length > 0 && (
                    <div className={`mt-10`}>
                        <ul>
                            {props.task.files.map((fileUrl, index) => {
                                const fileName = fileUrl.split('/').pop().split('?')[0]; // Получаем имя файла из URL
                                return (
                                    <li className={`w-full`} key={index}>
                                                                                        {/*retrieves only name from the filename and decodes url*/}
                                        <a className={`flex`} onClick={() => props.handleDownload(fileName)}><FileExtension filename={decodeURI(fileName.split("-")[1])} /> <strong className={`underline text-lg ml-5 text-blue-600 hover:text-blue-800 hover:cursor-pointer visited:text-purple-600`}>{decodeURI(fileName.split("-")[1])}</strong></a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Task;
