import express, {Router} from "express";
import passport from "passport";
import {isAuthenticated} from "../middlewares/middlewares.middleware";
import asyncHandler from "express-async-handler";
import {MessageModel} from "../models/message.model";

const router = Router();

router.use(passport.initialize());
router.use(passport.session());

router.get("/:roomId", (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {
    const roomId = req.params.roomId;
    const allMessages = await MessageModel.find({roomId: roomId})
    res.status(200).send(allMessages);
}));


export default router;