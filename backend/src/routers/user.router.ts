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
    const { userToChangeRole, roleChanger, newRole, isNewCompany } = req.body;

    if (isNewCompany) {
        const roleChanged = UserModel.findOneAndUpdate(userToChangeRole, { role: 'admin' });
        res.send(roleChanged);
    } else if (managerAndAdminRoles.includes(roleChanger)) {
        if (roleChanger === Roles.MANAGER && newRole === Roles.ADMIN) {
            res.status(403).send({ error: "Менеджер не может назначить роль администратора" });
        } else {
            const roleChanged = UserModel.findOneAndUpdate(userToChangeRole, { role: newRole });
            res.send(roleChanged);
        }
    } else {
        res.status(403).send({ error: "Запрещено изменять роль" });
    }
}));

export default router;