import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import EmployeeChatList from "./EmployeeChatList";
import { useDispatch, useSelector } from "react-redux";
import ChatMessages from "./ChatMessages";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [room, setRoom] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleSelectUser = (selectedUser) => {
        setMessages([]);
        const userIDs = [user._id, selectedUser._id];
        const newRoom = userIDs.sort().join("-");

        if (socket) {
            if (room) {
                socket.emit("leave room", room); // Leave the previous room
            }
            socket.emit("join room", newRoom); // Join the new room
        }

        axios.get(`http://localhost:8000/api/chat/${newRoom}`, { withCredentials: true }).then((response) => {
            setMessages(response.data);
        });

        dispatch({ type: 'SET_USER', payload: selectedUser });
        localStorage.setItem("Previous Chat", JSON.stringify(selectedUser));

        setSearchParams({ ["user"]: selectedUser._id });

        setSelectedUser(selectedUser);
        setRoom(newRoom);
        console.log("newRoom: " + newRoom);
    };

    const handleNewMessage = (text) => {
        if (!text || !room) return;

        const message = {
            text: text,
            sender: user._id,
            roomId: room,
            isSeen: false
        };

        if (socket) {
            console.log(message);
            socket.emit("message", message);
        }
    };

    const handleMessageSeen = (message) => {
        if (socket) {
            socket.emit("seen", message);
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

        const fetchMessages = (userID) => {
            const userIDs = [user._id, userID];
            const room = userIDs.sort().join("-");

            axios.get(`http://localhost:8000/api/chat/${room}`, { withCredentials: true }).then((response) => {
                setMessages(response.data);
            });
        };

        if (searchParams.get("user")) {
            axios.get(`http://localhost:8000/api/users/${searchParams.get("user")}`, { withCredentials: true }).then((response) => {
                setSelectedUser(response.data);
                fetchMessages(response.data._id);
            });
        } else if (localStorage.getItem("Previous Chat")) {
            const userInStorage = JSON.parse(localStorage.getItem("Previous Chat"));
            setSelectedUser(userInStorage);
            fetchMessages(userInStorage._id);
        }

        const handleMessage = (message) => {
            console.log(message.roomId + " " + room);
            if (message.roomId === room) {
                setMessages((prevState) => [...prevState, message]);
            }
        };

        socket.on("new message", handleMessage);

        socket.on("message seen", (messageId) => {
            setMessages((prevState) =>
                prevState.map((message) =>
                    message._id === messageId ? { ...message, isSeen: true } : message
                )
            );
        });

        return () => {
            socket.off("new message", handleMessage);
            socket.off("message seen");
        };
    }, [socket, room]);

    return (
        <div className="w-full flex">
            <div className="flex flex-col md:w-[400px] md:min-w-[400px] border-r-2 overflow-y-scroll">
                <EmployeeChatList onSelectUser={handleSelectUser} />
            </div>
            <div className="flex flex-col justify-start md:w-[calc(100%-400px)] flex-grow">
                <ChatMessages
                    handleMessageSeen={handleMessageSeen}
                    messages={messages}
                    onNewMessage={handleNewMessage}
                    selectedUser={selectedUser}
                />
            </div>
        </div>
    );
};

export default Chat;
