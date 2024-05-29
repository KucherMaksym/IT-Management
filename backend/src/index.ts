import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import cors from 'cors';
import {dbConnection} from "./dbConnection";
import {Roles, UserModel} from "./models/user.model";
import companyRouter from "./routers/company.router";
import dotenv from 'dotenv'
import {isAuthenticated} from "./middlewares/middlewares.middleware"
import asyncHandler from "express-async-handler";
import {CompanyModel} from "./models/company.model";
import userRouter from "./routers/user.router";


const app = express();
app.use(express.json());

dbConnection();
dotenv.config();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use("/api/companies", companyRouter);
app.use("/api/users", userRouter);

passport.use(new GitHubStrategy({
        clientID: `${process.env.GITHUB_CLIENT_ID}`,
        clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
        callbackURL: 'http://localhost:8000/callback'
    },
    async function(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void)  {

    let user = await UserModel.findOne({username: profile.username});

    let newUser;
    if (!user) {
        const createUser = await UserModel.create({
            username: profile.username,
            role: Roles.OTHER,
            avatar: profile.photos?.[0]?.value ?? "default-logo.png"
        }).then((res) => {
            newUser = res;
            return done(null, newUser);
        })
    }

    // const user = {
    //     id: profile.id,
    //     username: profile.username,
    //     displayName: profile.displayName,
    //     avatar: profile.photos?.[0]?.value ?? "default-logo.png"
    // };
    return done(null, user);
    }
));

passport.serializeUser(function(user: any, done: (error: any, id?: any) => void) {
    done(null, user);
});

passport.deserializeUser(function(obj: any, done: (error: any, user?: any) => void) {
    done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/github', passport.authenticate('github'));


app.get('/callback',
    passport.authenticate('github', { failureRedirect: '/error' }),
    function(req: express.Request, res: express.Response) {
        res.redirect('http://localhost:3000');
    });


//позжн разобрать более подробно как работает (req, res, next) => isAuthenticated(req, res, next)
app.get('/profile', (req, res, next) => isAuthenticated(req, res, next), (req: express.Request, res: express.Response) => {
    res.send(req.user);
});


app.get('/logout', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.clearCookie('connect.sid');
    req.logout(function(err:any) {
        console.log(err)
        req.session.destroy(function (err:any) { // destroys the session
            res.send();
        });
    });
});

app.get('/protected', (req, res, next) => isAuthenticated(req, res, next), (req, res) => {
    res.send('Protected route');
});

app.get('/error', (req: express.Request, res: express.Response) => {
    res.send('Error. Try again');
});


app.listen(8000, () => {
    console.log('http://localhost:8000');
});
