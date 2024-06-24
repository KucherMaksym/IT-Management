import React from 'react';

const TaskImages = (props) => {
    return (
        <div className={`h-40 overflow-hidden rounded-lg shadow-lg hover:shadow-xl duration-300 transition hover:scale-105`}>
            <button className={`w-full h-full`} onClick={props.openImgInFullScreen(props.fileUrl)}>
                <img className={`w-full h-40 object-cover`} src={props.fileUrl} alt={props.fileName} loading="lazy"/>
            </button>
        </div>
    );
};

export default TaskImages;
