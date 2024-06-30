import { MessageModel } from "./models/message.model";

export const socketHandler = (io: any) => {

    let currentRoom: string;

    io.on("connection", (socket : any) => {
        console.log("successfully connected " + socket.id);

        socket.on("join room", (room: any) => {
            socket.join(room);
            currentRoom = room;
            console.log("room joined: " + currentRoom);
        });

        socket.on("message", async (message: any) => {
            try {
                const savedMessage = await MessageModel.create(message);
                console.log(savedMessage);
                console.log(currentRoom)
                io.to(message.roomId).emit("new message", savedMessage);
            } catch (error) {
                console.error("Error saving message: ", error);
            }
        });

        socket.on("seen", async (message: any) => {
            try {
                const updatedMessage = await MessageModel.findByIdAndUpdate(message._id, { isSeen: true }, { new: true });
                console.log("message seen");
                console.log(updatedMessage);
                io.to(currentRoom).emit("message seen", updatedMessage?._id);
            } catch (error) {
                console.error("Error marking message as seen: ", error);
            }
        });

        socket.on("leave room", (room: any) => {
            socket.leave(room);
            console.log("room left: " + room);
        });

        socket.on("disconnect", () => {
            console.log("disconnected " + socket.id);
        });
    });
};
