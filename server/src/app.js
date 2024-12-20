import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import userRouter from './routes/user.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // to allow cookies
}))

app.use(express.json({ limit: '16kb' })); // // it means max 16kb data of json can be sent //parses json data/bodies

app.use(express.urlencoded({ extended: true })); // extended means that the object can be of any type (true) or just a string (false), objects can be nested

app.use(express.static('public')); // to serve/store static files like pdf images etc.

app.use(cookieParser()); // to set and access the cookies of the client in the browser

// Session middleware setup
app.use(session({
    secret: 'process.env.SESSION_SECRET', // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if you're using HTTPS
}));

// Routes
app.use("/api/v1/user", userRouter);  


export default app;