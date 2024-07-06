import {model, Schema} from "mongoose";
import {Task} from "./task.model";

export enum Roles {
    ADMIN = 'admin',
    MANAGER = 'manager',
    TEAM_LEAD = "team lead",
    SENIOR_DEVELOPER = 'senior developer',
    MIDDLE_DEVELOPER = 'middle developer',
    JUNIOR_DEVELOPER = 'junior developer',
    DESIGNER = 'designer',
    OTHER = 'other',
}


export interface User {
    _id: string;
    username?: string ;
    displayName?: string;
    about?: string;
    avatar?: string;
    email?: string;
    //number?: string
    role?: Roles;
    company?: string;
    completedTasks?: string[];
    activeTasks?: string[];
    considerationTasks?: Task[];
    groups?: string[];
    bonuses?: number;\
}


export const UserSchema = new Schema<User>({
    username: {type: String, required: true, unique: true},
    displayName: {type: String},
    about: {type: String},
    avatar: {type: String},
    email: {type: String},
    company: {type: String},
    groups: {type: [String]},
    role: {type: String, required: true, default: Roles.OTHER},
    completedTasks: {type: [String]},
    activeTasks: {type: [String]},
    considerationTasks: {type: [String]},
    bonuses:{type: Number, default: 0},

})


export const UserModel = model<User>("User", UserSchema);
