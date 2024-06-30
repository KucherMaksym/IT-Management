import React, {useRef} from 'react';
import {useSelector} from "react-redux";
import {useIsVisible} from "../../hooks/useIsVisible";

const Message = (props) => {

    const {user} = useSelector((state) => state.user);

    const message = useRef(null)
    const isVisible = useIsVisible(message)



    return (
        <div className={`${props.message.sender === user._id ? "self-end" : "self-start"} 
                            rounded-3xl max-w-lg ${props.message.sender === user._id ? "bg-sky-400" : "bg-gray-500"}  py-1 px-2 
                            ${props.index > 0 && props.messages[props.index - 1].sender === props.message.sender ? "mt-1" : "mt-5"} `}
                            ref={message}>
            <p className="text-white break-words text-start max-w-lg font-semibold">
                {props.message.text}
            </p>
            <div className={`flex justify-end`}>
                { props.message.sender === user._id && <p className={`${props.message.isSeen ? "text-sky-200" : "text-gray-500"}`}>{props.message.isSeen ? "✔✔" : "✔"}</p>}
            </div>
            {!props.message.isSeen ? isVisible && props.message.sender !== user._id && props.handleMessageSeen(props.message) : null}
        </div>
    );
};

export default Message;
