import express from 'express';
import session from 'express-session';
import passport from 'passport';
import {Strategy as GitHubStrategy, Profile} from 'passport-github2';
import cors from 'cors';
import {dbConnection} from "./dbConnection";
import {Roles, User, UserModel} from "./models/user.model";
import companyRouter from "./routers/company.router";
import dotenv from 'dotenv'
import {authenticateJWT} from "./middlewares/middlewares.middleware"
import userRouter from "./routers/user.router";
import taskRouter from "./routers/task.router";
import {Server} from "socket.io";
import {createServer} from "http";
import {socketHandler} from "./socket";
import chatRouter from "./routers/chat.router";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import {Octokit} from "@octokit/rest";


const app = express();
app.use(express.json());
app.use(cookieParser())

const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: ['http://192.168.0.168:3000', 'http://localhost:3000'],
        credentials: true
    }
});
socketHandler(io)

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
    cookie: {secure: false}
}));

app.use("/api/companies", companyRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/chat", chatRouter);

passport.use(new GitHubStrategy({
        clientID: `${process.env.GITHUB_CLIENT_ID}`,
        clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
        callbackURL: 'http://localhost:8000/callback'
    },
    async function (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) {

        let user = await UserModel.findOne({username: profile.username});

        let newUser;
        if (!user) {
            const createUser = await UserModel.create({
                username: profile.username,
                role: Roles.OTHER,
                avatar: profile.photos?.[0]?.value ?? "default-logo.png",
                accessToken: accessToken
            }).then((res) => {
                newUser = res;
                return done(null, newUser);
            })
        }

        return done(null, user);
    }
));

passport.serializeUser(function (user: any, done: (error: any, id?: any) => void) {
    done(null, user);
});

passport.deserializeUser(function (obj: any, done: (error: any, user?: any) => void) {
    done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/github', passport.authenticate('github'));


app.get('/callback', passport.authenticate('github', {failureRedirect: '/error'}),
    function (req: express.Request, res: express.Response) {
        if (req.user && process.env.JWT_SECRET_KEY) {
            const user = req.user as User;
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'}); // Сохранить только id в JWT
            res.cookie('jwt', token, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000});
            res.redirect('http://localhost:3000');
        } else {
            res.redirect('/auth/github');
        }
    }
);


app.get('/profile', authenticateJWT, async (req: express.Request, res: express.Response) => {
    const user = req.user as User;
    res.send(user.toClient?.());
});


app.get('/logout', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.clearCookie('jwt');
    req.logout(function (err: any) {
        req.session.destroy(function (err: any) { // destroys the session
            res.send();
        });
    });
});

app.get('/protected', authenticateJWT, (req, res) => {
    res.send('Protected route');
});

app.get('/error', (req: express.Request, res: express.Response) => {
    res.send('Error. Try again');
});

httpServer.listen(8000, () => {
    console.log('http://localhost:8000');
});
