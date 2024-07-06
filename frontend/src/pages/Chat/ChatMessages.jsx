import React, { useRef, useState, useEffect } from 'react';
import background from "./../../components/assets/back.jpg"
import Message from "./Message";

const ChatMessages = (props) => {
    const inputRef = useRef(null);
    const messageWindow = useRef(null);

    const [textAreaHeight, setTextAreaHeight] = useState(0);

    const sendMessage = () => {
        if (inputRef.current.innerText === "") return;
        props.onNewMessage(inputRef.current.innerText);
        inputRef.current.innerText = "";
        setTextAreaHeight(0);
        inputRef.current.focus();
    }

    const handleTextAreaHeightChange = () => {
        if (!inputRef) return;
        setTextAreaHeight(inputRef.current.scrollHeight);
    }

    useEffect(() => {
        if (messageWindow.current){
            messageWindow.current.scroll({top: 1000000000, behavior: "instant"});
            const currentInputRef = inputRef.current;
            currentInputRef.addEventListener('input', handleTextAreaHeightChange);
            currentInputRef.focus()

            return () => {
                currentInputRef.removeEventListener('input', handleTextAreaHeightChange);
            }
        }
    }, []);

    useEffect(() => {
        if (messageWindow.current) {
            messageWindow.current.scroll({top: 1000000000, behavior: "smooth"});
        }
    }, [props.messages, textAreaHeight]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        }
    }

    return (
        <>
            { props.selectedUser ?
                <div
                    className={`w-full h-[calc(100vh-(var(--header-height)))] flex flex-col relative overflow-hidden`}>

                    <div className={`h-20 w-full p-4 border-b-2 border-gray-400 flex items-center justify-between`}>
                        <div className="flex items-center justify-center">
                            <img src={props.selectedUser.avatar} className={`rounded-[50%] mr-5`} width={45} alt=""/>
                            <h3 className={`text-3xl font-semibold`}>
                                {props.selectedUser && props.selectedUser.username}
                            </h3>
                        </div>
                        <div>
                            <button className={`text-3xl font-semibold mr-5`}>
                                ⚠️
                            </button>
                            <button className={`text-3xl font-semibold`}>
                                ⚙️
                            </button>
                        </div>
                    </div>

                    <div className="flex w-full flex-col h-full bg-gray-200 overflow-auto p-5" ref={messageWindow}
                         style={{backgroundImage: `url(${background})`}}>
                        {props.messages && props.messages.length > 0 ? (
                            props.messages.map((message, index) => (
                                <Message handleMessageSeen={props.handleMessageSeen} key={message._id}
                                         messages={props.messages} message={message} index={index}/>
                            ))
                        ) : null}
                    </div>
                    <div
                        className={`relative max-w-full bg-white z-10 min-h-12 bottom-0 right-0 w-full border-t-2 border-gray-500 flex items-center justify-between max-h-40 p-3`}
                        style={{height: `${textAreaHeight + 16}px`}}>
                        <div className={`w-20`}>be be</div>
                        <p className={`empty:before:content-["type_here..."] before:text-gray-500 break-words px-2 max-w-[80%] w-full max-h-40 outline-0 text-start ${textAreaHeight > 160 ? "overflow-y-scroll" : "overflow-y-hidden"}`}
                           ref={inputRef} contentEditable={true} onKeyDown={handleKeyDown}></p>
                        <button className={`ml-2 rounded bg-sky-500 text-white px-2 py-1`} onClick={sendMessage}>Send
                            ➡
                        </button>
                    </div>
                </div>
                :
                <div className={`flex flex-col items-center justify-center h-[calc(100vh-(var(--header-height)))] `}>
                    <h3 className={`text-xl text-gray-700`}>Select a user to start chatting</h3>
                    <p className={`text-3xl`}>📩</p>
                </div>
            }
        </>


    );
};

export default ChatMessages;
