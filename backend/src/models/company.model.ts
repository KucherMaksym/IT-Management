import {model, Schema} from "mongoose";

export interface Company {
    name: string;
    description: string;
    admin: string;
    employees: string[];
    groups: string[];
}

export const CompanySchema = new Schema<Company>({
    name: {type: String, required: true},
    description: {type: String},
    admin: {type: String, required: true},
    employees: {type: [String]},
    groups: {type: [String]},
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


export const CompanyModel = model<Company>("Companies", CompanySchema);