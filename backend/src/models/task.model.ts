import {model, Schema} from 'mongoose';

export enum TaskStatus {
    NOT_TAKEN = "not taken",
    CONSIDERATION = "consideration",
    IN_PROGRESS = "in progress",
    COMPLETED = "completed",
    DELETED = "deleted",
}

export interface Task {
    name: string,
    description: string,
    deadline: Date,
    userIdToComplete?: string
    status: TaskStatus,
    bonus?: number,
    taken?: boolean
    takenBy?: string;
    createdBy: {
        _id: string,
        avatar: string
    }
    files?: string[];
    branchName?: string;
}

export const taskSchema = new Schema<Task>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    deadline: {type: Date},
    status: {type: String, default: TaskStatus.NOT_TAKEN, required: true},
    bonus: {type: Number, default: 0},
    taken: {type: Boolean, default: false},
    takenBy: {type: String},
    createdBy: {
        _id: {type: String, required: true},
        avatar: {type: String, required: true},
    },
    files: {type: [String]},
    branchName: {type: String},
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