import React from 'react';
import FileExtension from "../../../../components/FileExtension/FileExtension";

const TaskFiles = (props) => {
    return (
        <a className={`flex w-full`} href={props.fileUrl}>
            <FileExtension filename={decodeURI(props.fileName.split("-")[1])}/>
            <strong className={`underline text-lg ml-5 text-blue-600 hover:text-blue-800 hover:cursor-pointer visited:text-purple-600`}>
                {decodeURI(props.fileName.split("-")[1])}
            </strong>
        </a>
    );
};

export default TaskFiles;
