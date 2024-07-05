import express, {Router} from "express";
import passport from "passport";
import {isAuthenticated} from "../middlewares/middlewares.middleware";
import asyncHandler from "express-async-handler";
import {Roles, UserModel} from "../models/user.model";

const router = Router();

router.use(passport.initialize());
router.use(passport.session());

const managerAndAdminRoles = [Roles.ADMIN, Roles.MANAGER];

router.patch("/changeRole", (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {
    const { userToChangeRole, newRole, isNewCompany } = req.body;

    if (isNewCompany) {
        const roleChanged = await UserModel.findOneAndUpdate(userToChangeRole, { role: 'admin' });
        res.send(roleChanged);
    }

    if (managerAndAdminRoles.includes(req.user.role)) {
        if (req.user.role === Roles.MANAGER && newRole === Roles.ADMIN) {
            res.status(404).send({ error: "Forbidden" });
        } else {
            const roleChanged = await UserModel.findByIdAndUpdate(userToChangeRole, { role: newRole });
            res.send(roleChanged);
        }
    } else {
        res.status(404).send({ error: "Forbidden" });
    }

}));

router.get("/:id", (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res, next) => {
    if (!req.params.id) {
        res.status(400).send({ error: "id not provided" });
        return;
    }
    const userDb = await UserModel.findById(req.params.id);
    res.send(userDb);
}))

export default router;