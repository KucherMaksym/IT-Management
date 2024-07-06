import express, {response, Router} from 'express'
import asyncHandler from "express-async-handler"
import {CompanyModel} from "../models/company.model";
import {authenticateJWT} from "../middlewares/middlewares.middleware";
import passport from "passport";
import {UserModel} from "../models/user.model";
import mongoose from "mongoose";

const router = Router();

router.use(passport.initialize());
router.use(passport.session());

router.get("/allEmployees", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    try {
        let company = await CompanyModel.findOne({admin: req.user._id});

        if (!company) {
            company = await CompanyModel.findOne({employees: req.user._id});
        }
        if (!company) {
            res.status(404).send("Company is not found");
            return;
        }
        const employees = await UserModel.find({'_id': {$in: company.employees}});

        res.send(employees);
    } catch (err) {
        console.error("Error ", err);
        res.status(500).send("Internal server error");
    }
}));
router.get("/findUserCompany", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    const company = await CompanyModel.findOne({employees: req.user._id});
    res.send(company);
}))


router.post("/newCompany", asyncHandler(async (req: express.Request, res: express.Response) => {
    const newCompany = await CompanyModel.create(req.body);
    res.send(newCompany);
}))


router.get("/companyByAdmin", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    const companyInDb = await CompanyModel.findOne({admin: req.user._id});
    res.send(companyInDb);
}))


router.patch("/addNewEmployee", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    const newEmployee = req.body.newEmployee;
    const admin = req.user._id;
    const adminsCompany = await CompanyModel.findOne({admin: admin});

    const isValidObjectId = mongoose.Types.ObjectId.isValid(newEmployee);

    if (!isValidObjectId) {
        res.status(400).send({message: "Invalid employee ID"});
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
        {_id: adminsCompany?._id},
        {$push: {employees: newEmployee}}
    );
    res.send(newCompany);
}))

router.patch("/dismiss/:employeeId", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {

    const employeeId = req.params.employeeId;
    console.log(employeeId);

    const updatedCompany = await CompanyModel.findOneAndUpdate({employees: employeeId}, {$pull: {employees: employeeId}}, {new: true})
    console.log("opa")
    console.log(updatedCompany)
    res.status(200).send(true);

}))

export default router;