import express, {response, Router} from 'express'
import asyncHandler from "express-async-handler"
import {CompanyModel} from "../models/company.model";
import {isAuthenticated} from "../middlewares/middlewares.middleware";
import passport from "passport";
import {UserModel} from "../models/user.model";
import mongoose from "mongoose";

const router = Router();

router.use(passport.initialize());
router.use(passport.session());

router.get("/allEmployees", (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {
    await CompanyModel.findOne({admin: req.user._id}).then((response) => {
        const employee = UserModel.find({ '_id': { $in: response?.employees } })
            .then(users => {
                console.log(users)
                res.send(users);
            })
            .catch(err => {
                return res.send(err);
            });
    });
}))

router.get("/findUserCompany", (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {
    const company = await CompanyModel.findOne({employees: req.user._id});
    res.send(company);
}))


router.post("/newCompany",  asyncHandler( async (req: express.Request, res: express.Response) => {
    console.log(req.body);
    const newCompany = await CompanyModel.create(req.body);
    res.send(newCompany);
}))


router.get("/companyByAdmin", (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {
    const companyInDb = await CompanyModel.findOne({admin: req.user._id});
    res.send(companyInDb);
}))


router.patch("/addNewEmployee",  (req, res, next) => isAuthenticated(req, res, next), asyncHandler(async (req: any, res: express.Response) => {
    const newEmployee = req.body.newEmployee;
    const admin = req.user._id;
    const adminsCompany = await CompanyModel.findOne({admin: admin});

    const isValidObjectId = mongoose.Types.ObjectId.isValid(newEmployee);

    if (!isValidObjectId) {
        res.status(400).send({ message: "Invalid employee ID" });
        return;
    }

    const isUserExists = await UserModel.findById(newEmployee);

    if (!isUserExists) {
        res.status(400).send({message: "user with this id doesn't exist"});
        return;
    }

    if (!adminsCompany) {
        res.status(403).send("user doesn't have the company");
        return;
    } else if (!newEmployee) {
        res.status(400).send("Provide a new employee");
        return;
    }
    const isEmployeeExists = adminsCompany?.employees.some(id => id === newEmployee);

    if (isEmployeeExists) {
        res.status(400).send("Employee already in your company")
        return;
    }

    const newCompany = await CompanyModel.updateOne(
        { _id: adminsCompany?._id },
        { $push: { employees: newEmployee } }
    );
    res.send(newCompany);
}))

export default router;