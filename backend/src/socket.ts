import {MessageModel} from "./models/message.model";

export const socketHandler = (io: any) => {

    let currentRoom: string;

    io.on("connection", (socket : any) => {
        console.log("successfully connected " + socket.id);

        socket.on("join room" , (room: any) => {
            socket.join(room);
            currentRoom = room
            console.log("room: " + currentRoom)
        })

        socket.on("message", (message: any) => {
            console.log(message);
            MessageModel.create(message).then((msg: any) => {
                console.log(msg)
            });
            socket.to(currentRoom).emit("new message", message)
        })

        socket.on("leave room", (room: any) => {
            socket.leave(room);
            console.log("room left: " + room);
        })

        socket.on("disconnect", () => {
            console.log("disconnected " + socket.id);
        });
    });
}
