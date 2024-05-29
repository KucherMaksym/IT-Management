import express from "express";



export const isAuthenticated = (req: express.Request & { isAuthenticated?: () => boolean }, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.send({ isAuthenticated: false });
};