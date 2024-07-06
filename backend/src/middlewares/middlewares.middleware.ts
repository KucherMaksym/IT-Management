import express from "express";
import {Roles, UserModel} from "../models/user.model";
import jwt from "jsonwebtoken";



export const isTeamLead  = (req: any, res: express.Response, next: express.NextFunction) => {
    if (req.user?.role === Roles.TEAM_LEAD || req.user?.role === Roles.MANAGER || req.user?.role === Roles.ADMIN) {
        return next();
    }
    return res.status(403).send({ forbidden: true });
}



export const authenticateJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.jwt;
    if (token && process.env.JWT_SECRET_KEY) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err: any, decoded: any) => {
            if (err) {
                return res.status(403).send('Forbidden');
            }
            const user = await UserModel.findById(decoded._id)
            if (!user) {
                return  res.status(404).send('User not found');
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).redirect("/auth/github")
    }
}