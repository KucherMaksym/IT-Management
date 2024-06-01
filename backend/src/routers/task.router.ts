import express, { Router } from 'express';
import passport from "passport";
import {isAuthenticated} from "../middlewares/middlewares.middleware";
import asyncHandler from "express-async-handler";
import {UserModel} from "../models/user.model";
import {Task, TaskModel} from "../models/task.model";

const router = Router();

router.use(passport.initialize());
router.use(passport.session());

router.get("/allTasks", (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {

    const id = req.user._id;
    const allTasks = await TaskModel.find({takenBy: id})

    res.send(allTasks);
}))

router.get("/:id",(req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {

    const id = req.params.id;

    const user = await UserModel.findById(req.user._id);

    if (!user?.activeTasks?.includes(id)) {
        res.status(404).send({response: "Task not found"});
        return;
    }

    const DbTask = await TaskModel.findById(id);
    res.send(DbTask);
}))


router.post("/newTask/:id", (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {

    const {name, description, deadline} = req.body;
    const id = req.params.id;

    const user = await UserModel.findById(id);

    if (!user) {
        res.status(404).send("User not found");
        return;
    }

    const task:Task = {
        name, description, deadline,
        takenBy: id
    }

    const taskDb = await TaskModel.create(task);

    if (!taskDb) {
        res.status(500).send("Task not found");
        return;
    }
    const updatedUser = await UserModel.findByIdAndUpdate(id, {$push: { activeTasks: taskDb._id }}, { new: true })
    res.status(200).send(updatedUser);

}))

export default router;