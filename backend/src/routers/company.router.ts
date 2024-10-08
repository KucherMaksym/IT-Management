import express, {response, Router} from 'express'
import asyncHandler from "express-async-handler"
import {CompanyModel} from "../models/company.model";
import {authenticateJWT, isAdmin} from "../middlewares/middlewares.middleware";
import passport from "passport";
import {Roles, User, UserModel} from "../models/user.model";
import mongoose from "mongoose";
import {Octokit} from "@octokit/rest";

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

        res.send(employees.map(employee => employee.toClient?.()));
    } catch (err) {
        console.error("Error ", err);
        res.status(500).send("Internal server error");
    }
}));

router.get("/allContributors", authenticateJWT,  isAdmin, asyncHandler(async (req: any, res: express.Response) => {
    const user = req.user as User;
    const userDb = await UserModel.findById(user._id);
    const companyDb = await CompanyModel.findOne({admin: user._id});

    if (!userDb || !companyDb) {
        res.status(404).send("User or company is not found");
        return;
    }
console.log(userDb.accessToken)
    const octokit = new Octokit({auth: userDb.accessToken});
    const ownerAndRepoName = companyDb?.repository.split("/");
    console.log(ownerAndRepoName[0])
    console.log(ownerAndRepoName[1])
    const {data: collaborators} = await octokit.rest.repos.listCollaborators({
        owner: ownerAndRepoName[0],
        repo: ownerAndRepoName[1],
    })
    const onlyLogin = collaborators.map(collaborator => collaborator.login);
    res.status(200).send(onlyLogin);
}))

router.patch("/makeACollaborator", authenticateJWT, isAdmin, asyncHandler(async (req: any, res: express.Response) => {
    const user = req.user as User;

    const companyDb = await CompanyModel.findOne({admin: user._id});
    const userDb = await UserModel.findById(user._id);
    if (!companyDb || !userDb) {
        res.status(404).send("Company is not found");
        return;
    }

    const ownerAndRepoName = companyDb.repository.split("/")
    const octokit = new Octokit({auth: userDb.accessToken});

    const response = await octokit.rest.repos.addCollaborator({
        owner: ownerAndRepoName[0],
        repo: ownerAndRepoName[1],
        username: req.body.newCollaborator,
    })

    res.status(200).send(response.data);
}))


router.get("/findUserCompany", authenticateJWT, asyncHandler(async (req: any, res: express.Response) => {
    const company = await CompanyModel.findOne({employees: req.user._id});
    res.send(company);
}))


router.post("/newCompany", asyncHandler(async (req: express.Request, res: express.Response) => {
    const newCompany = await CompanyModel.create(req.body);
    const user = req.user as User;
    await UserModel.findOneAndUpdate({_id: user._id}, {role: Roles.ADMIN})
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
    console.log(updatedCompany)
    res.status(200).send(true);

}))

router.get("/allMyRepos", authenticateJWT, asyncHandler(async (req: express.Request, res: express.Response) => {
    const user = req.user as User;
    const userDB = await UserModel.findById(user._id);

    if (!userDB)
        res.status(404).send("User not found");
    const octokit = new Octokit({auth: userDB?.accessToken});

    const {data: repos} = await octokit.repos.listForAuthenticatedUser()
    res.status(200).send(repos)

}))

router.patch("/setMainRepo", authenticateJWT, isAdmin, asyncHandler(async (req: express.Request, res: express.Response) => {
    const user = req.user as User;

    const newCompany = await CompanyModel.findOneAndUpdate({admin: user._id},{repository: req.body.repository}, {new: true});
    if(!newCompany) res.status(500).send({message: "error while setting the main repository"});
    console.log(newCompany)
    res.status(200).send({message: "successfully set main repo"});
}))

export default router;