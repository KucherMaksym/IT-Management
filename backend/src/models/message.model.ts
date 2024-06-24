import {model, Schema} from "mongoose";

export interface Message {
    text: string;
    sender: string
    roomId: string
    isSeen: boolean
}

export const MessageSchema = new Schema<Message>({
    text: {type: String, required: true},
    sender: {type: String, required: true},
    roomId: {type: String, required: true},
    isSeen: {type: Boolean, default: false},
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
})

export const MessageModel = model("messages", MessageSchema)