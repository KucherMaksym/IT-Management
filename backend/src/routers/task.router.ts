import express, { Router } from 'express';
import passport from "passport";
import { isAuthenticated } from "../middlewares/middlewares.middleware";
import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";
import { Task, TaskModel } from "../models/task.model";
import multer from "multer";
import path from "node:path";

const admin = require("firebase-admin");
const serviceAccount = require("./../firebase-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://it-managment-d88a9.appspot.com",
});

const bucket = admin.storage().bucket();

const router = Router();

const storage = multer.memoryStorage(); // Использование памяти для хранения загружаемых файлов
const upload = multer({ storage });

router.use(passport.initialize());
router.use(passport.session());

router.get("/allTasks", (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {
    const id = req.user._id;
    const allTasks = await TaskModel.find({takenBy: id});
    res.send(allTasks);
}));

router.get("/:id", (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {
    const id = req.params.id;
    const user = await UserModel.findById(req.user._id);

    if (!user?.activeTasks?.includes(id)) {
        res.status(404).send({response: "Task not found"});
        return;
    }

    const DbTask = await TaskModel.findById(id);
    res.send(DbTask);
}));

router.get('/taskByDate/:date', async (req, res) => {
    try {
        const date = req.params.date;
        const tasks = await TaskModel.find({
            deadline: {
                $gte: new Date(date).setHours(0, 0, 0, 0),
                $lt: new Date(date).setHours(23, 59, 59, 999)
            }
        });
        if (tasks.length > 0) {
            res.json(tasks[0]);
        } else {
            res.status(404).json({ message: 'No tasks found for this date' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post("/newTask/:id", upload.array("files"), (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {
    const { name, description, deadline } = req.body;
    const id = req.params.id;
    console.log(req.files);

    const user = await UserModel.findById(id);

    if (!user) {
        res.status(404).send("User not found");
        return;
    }

    let task:Task = {
        name,
        description,
        deadline,
        takenBy: id,
    };

    if (req.files) {
        const imageUrls = await Promise.all(
            (req.files as Express.Multer.File[]).map(async (file) => {
                const fileRef = bucket.file(`uploads/${Date.now()}-${path.basename(file.originalname)}`);
                const stream = fileRef.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });

                stream.end(file.buffer);

                const signedUrlResponse = await fileRef.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491' // Укажите нужную дату истечения срока действия URL
                });
                return signedUrlResponse[0]; // Извлекаем URL-адрес из объекта GetSignedUrlResponse
            })
        );

        task.files = imageUrls;
    }

    const taskDb = await TaskModel.create(task);

    if (!taskDb) {
        res.status(500).send("Task not created");
        return;
    }
    const updatedUser = await UserModel.findByIdAndUpdate(id, { $push: { activeTasks: taskDb._id } }, { new: true });
    res.status(200).send(updatedUser);
}));

router.get("/download/:fileName", (req, res) => {
    const fileName = req.params.fileName;
    const file = bucket.file(`uploads/${fileName}`);

    file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    }).then((signedUrls: any[]) => {
        res.json({ url: signedUrls[0] });
    }).catch((error: any) => {
        res.status(500).send({ error: 'Failed to get signed URL', details: error });
    });
});

export default router;
