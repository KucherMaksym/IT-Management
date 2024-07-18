import express, {Router} from 'express';
import passport from "passport";
import {authenticateJWT, isTeamLead} from "../middlewares/middlewares.middleware";
import asyncHandler from "express-async-handler";
import {Roles, User, UserModel} from "../models/user.model";
import {Task, TaskModel, TaskStatus} from "../models/task.model";
import multer from "multer";
import path from "node:path";
import {startSession} from "mongoose";
import {Octokit} from "@octokit/rest";
import {CompanyModel} from "../models/company.model";

const admin = require("firebase-admin");
const serviceAccount = require("./../firebase-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://it-managment-d88a9.appspot.com",
});

const bucket = admin.storage().bucket();

const router = Router();

const storage = multer.memoryStorage(); // Использование памяти для хранения загружаемых файлов
const upload = multer({storage});

router.use(passport.initialize());
router.use(passport.session());

const getOwnerAndRepoName = async (userId: string) => {
    const userDb = await UserModel.findById(userId);

    if (!userDb) {
        return;
    }

    const companyDb = await CompanyModel.findOne({$or: [{admin: userDb._id}, {employees: userDb._id}] });

    if (!companyDb) {
        return;
    }
    const ownerAndRepoName = companyDb.repository.split("/");
    return ownerAndRepoName;

}

router.get("/allTasks", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    const id = req.user._id;
    const allTasks = await TaskModel.find({takenBy: id, status: TaskStatus.IN_PROGRESS});
    res.send(allTasks);
}));

router.get("/allConsiderationTasks", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {

    const tasks = await TaskModel.find({status: TaskStatus.CONSIDERATION})
    res.send(tasks);

}))

router.get("/:id", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    const id = req.params.id;
    const user = await UserModel.findById(req.user._id);

    if (!user?.activeTasks?.includes(id) && !user?.considerationTasks?.includes(id)) {
        if (req.user.role !== Roles.ADMIN && req.user.role !== Roles.MANAGER) {
            res.status(404).send({response: "Task not found"});
            return;
        }
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
            res.status(404).json({message: 'No tasks found for this date'});
        }
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
});

router.post("/newTask/:id", upload.array("files"), authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    const {name, description, deadline} = req.body;
    const id = req.params.id;
    const user = req.user as User;

    const userDb = await UserModel.findById(id);

    const adminDb = await UserModel.findById(user._id);

    if (!adminDb) {
        res.status(404).send("Company is not found");
        return;
    }

    if (!userDb) {
        res.status(404).send("User not found");
        return;
    }

    const companyDb = await CompanyModel.findOne({$or: [{admin: userDb._id}, {employees: userDb._id}] });
    if (!companyDb) {
        res.status(404).send("Company is not found");
        return;
    }

    const ownerAndRepoName = companyDb.repository.split("/")
    console.log(userDb.accessToken)
    const octokit = new Octokit({auth: adminDb.accessToken});

    const {data: repo} = await octokit.rest.repos.get({
        owner: ownerAndRepoName[0],
        repo: ownerAndRepoName[1],
    })

    if (!repo) {
        res.status(404).send("repository not found");
        return;
    }

    const {data: ref} = await octokit.rest.git.getRef({
        owner: ownerAndRepoName[0],
        repo: ownerAndRepoName[1],
        ref: `heads/${repo.default_branch}`
    })

    if (!ref) {
        res.status(404).send("repository not found");
        return;
    }

    const {data: newRef} = await octokit.rest.git.createRef({
        owner : ownerAndRepoName[0],
        repo: ownerAndRepoName[1],
        ref: `refs/heads/${name}`,
        sha: `${ref.object.sha}`,
    });

    if (!newRef) {
        res.status(500).send("Internal server error while creating a new ref");
        return
    }

    let task: Task = {
        name,
        description,
        deadline,
        takenBy: id,
        createdBy: {
            _id: req.user._id,
            avatar: req.user.avatar
        },
        status: TaskStatus.IN_PROGRESS,
        branchName: newRef.ref
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
    const updatedUser = await UserModel.findByIdAndUpdate(id, {$push: {activeTasks: taskDb._id}}, {new: true});
    res.status(200).send(updatedUser);
}));

router.get("/download/:fileName", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    const fileName = req.params.fileName;
    const file = bucket.file(`uploads/${fileName}`);

    file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    }).then((signedUrls: any[]) => {
        res.json({url: signedUrls[0]});
    }).catch((error: any) => {
        res.status(500).send({error: 'Failed to get signed URL', details: error});
    });
}));

router.patch("/complete/:id", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    const id = req.params.id;
    const user = req.user as User;

    if (!user) {
        res.status(500).send("Internal server error");
        return;
    }

    try {
        const taskDb = await TaskModel.findById(id);
        const userDb = await UserModel.findById(taskDb?.takenBy);

        if (!userDb || !taskDb) {
            res.status(404).send("user or task not found");
            return;
        }

        const changeTaskStatusInDb = async () => {
            const updatedTask = await TaskModel.findByIdAndUpdate(id, {status: TaskStatus.CONSIDERATION}, {new: true});
            userDb?.considerationTasks?.push(id);
            const updatedActiveTasks = userDb?.activeTasks?.filter(function (newActiveTasks) {
                return newActiveTasks !== id;
            });
            userDb ? userDb.activeTasks = updatedActiveTasks : null;
            await userDb?.save();
            res.send(userDb);
        }

        if (taskDb.branchName) {
            const octokit = new Octokit({auth: user.accessToken});
            const ownerAndRepoName = await getOwnerAndRepoName(user._id);

            if (!ownerAndRepoName) {
                res.status(404).send("repository not found");
                return;
            }

            const {data: repo} = await octokit.rest.repos.get({
                owner: ownerAndRepoName[0],
                repo: ownerAndRepoName[1]
            });

            if (!repo) {
                res.status(404).send("repository not found");
                return;
            }

            const response = await octokit.rest.pulls.create({
                owner: ownerAndRepoName[0],
                repo: ownerAndRepoName[1],
                title: `Pull request for branch ${taskDb.branchName}`,
                head: taskDb.branchName,
                base: repo.default_branch
            });

            if (response.status !== 201) {
                res.status(500).send("Internal server error");
                return;
            }
            await changeTaskStatusInDb();
            res.status(200).send(response.data);
            return;
        }
        await changeTaskStatusInDb();

    } catch (err) {
        console.error("Error", err);
        res.status(500).send(err);
    }
}));

router.patch("/accept/:id", isTeamLead, authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    const taskId = req.params.id;
    const user = await UserModel.findOne({considerationTasks: taskId});

    const session = await startSession();

    session.startTransaction();

    // $pull deletes the value from array

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(user?._id, {
            $pull: {considerationTasks: taskId},
            $push: {completedTasks: taskId}
        }, {session, new: true});
        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, {
            status: TaskStatus.COMPLETED,
        }, {session, new: true});

        if (updatedTask && updatedUser) {
            await session.commitTransaction();
            console.log("successful commit")
            res.send(updatedTask);
        } else {
            await session.abortTransaction();
            console.log('Transaction aborted');
        }

    } catch (error) {
        console.error('Transaction error:', error);
        await session.abortTransaction();
    } finally {
        await session.endSession();
    }

}))


export default router;
