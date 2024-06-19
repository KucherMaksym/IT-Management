import express from "express";
import {Roles} from "../models/user.model";


export const isAuthenticated = (req: express.Request & { isAuthenticated?: () => boolean }, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.send({ isAuthenticated: false });
};

export const isTeamLead  = (req: any, res: express.Response, next: express.NextFunction) => {
    if (req.user?.role === Roles.TEAM_LEAD || req.user?.role === Roles.MANAGER || req.user?.role === Roles.ADMIN) {
        return next();
    }
    return res.status(403).send({ forbidden: true });
}