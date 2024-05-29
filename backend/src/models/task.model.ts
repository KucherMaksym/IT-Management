import {model, Schema} from 'mongoose';

export interface Task {
    name: string,
    description: string,
    deadline: Date,
    completed: boolean,
    userIdToComplete: string
    accepted: boolean,
    bonus?: number,
    taken: boolean
    takenBy?: string;
}

export const taskSchema = new Schema<Task>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    deadline: {type: Date, required: true},
    completed: {type: Boolean, default: false},
    userIdToComplete: {type: String },
    accepted: {type: Boolean, default: false},
    bonus: {type: Number, default: 0},
    taken: {type: Boolean, default: false},
    takenBy: {type: String},
},
{
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
})

export const TaskModel = model("Task", taskSchema);