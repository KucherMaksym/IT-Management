import mongoose, {connect} from "mongoose";

export const dbConnection = () => {
 connect("mongodb://localhost:27017/it-management").then((connection) => {
     console.log("MongoDB connected");
 });
}