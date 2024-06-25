import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import EmployeeChatList from "./EmployeeChatList";
import { useDispatch, useSelector } from "react-redux";
import ChatMessages from "./ChatMessages";
import axios from "axios";

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [room, setRoom] = useState(null);

    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const chat = useSelector((state) => state.chat);

    const handleSelectUser = (selectedUser) => {
        setMessages([]);
        const userIDs = [user._id, selectedUser._id];
        const newRoom = userIDs.sort().join("-");

        axios.get("http://localhost:8000/api/chat/" + newRoom, {withCredentials: true}).then((response) => {
            setMessages(response.data)
        })

        dispatch({ type: 'SET_USER', payload: selectedUser });
        console.log(newRoom)
        localStorage.setItem("Previous Chat", JSON.stringify(selectedUser));

        setSelectedUser(selectedUser);
        setRoom(newRoom);
        if (socket) {
            socket.emit("join room", newRoom);
        }
    };

    const handleNewMessage = (text) => {
        if (!text || !room) return;

        const message = {
            text: text,
            sender: user._id,
            roomId: room,
        }
        if (socket) {
            setMessages((prevState) => [...prevState, message])
            socket.emit("message", message);
        }
    };

    useEffect(() => {
        const newSocket = io('http://localhost:8000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected ' + newSocket.id);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected ' + newSocket.id);
        });

        return () => {
            if (newSocket) {
                if (room) {
                    newSocket.emit("leave room", room);
                }
                newSocket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        if (localStorage.getItem("Previous Chat")) {
            const userInStorage = localStorage.getItem("Previous Chat");
            setSelectedUser(JSON.parse(userInStorage));

            const userIDs = [user._id, JSON.parse(userInStorage)._id];
            const room = userIDs.sort().join("-");

            axios.get("http://localhost:8000/api/chat/" + room, {withCredentials: true}).then((response) => {
                setMessages(response.data)
            })
        }

        socket.on("new message", (message) => {
            setMessages((prevState) => [...prevState, message]);
        });

        return () => {
            socket.off("new message");
        };
    }, [socket]);

    return (
        <div className={`w-full flex`}>
            <div className={`flex flex-col md:w-[400px] md:min-w-[400px] border-r-2 overflow-y-scroll`}>
                <EmployeeChatList onSelectUser={handleSelectUser} />
            </div>
            <div className={`flex flex-col justify-start md:w-[calc(100%-400px)] flex-grow`}>
                <ChatMessages messages={messages} onNewMessage={handleNewMessage} selectedUser={selectedUser} />
            </div>
        </div>
    );
};

export default Chat;
