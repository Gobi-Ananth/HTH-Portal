import express from 'express';
import dotenv from 'dotenv';
import ConnectDb from './database/db.js';
import './config/Auth.js';
import passport from 'passport';
import sessionMiddleware from './middleware/sessionMiddleware.js';
import { isAuth } from './middleware/isAuth.js';

const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(express.json()); 

app.use(sessionMiddleware); 
app.use(passport.initialize()); 
app.use(passport.session()); 

// Import Router
import userRouter from './routes/User.js';
import teamRouter from './routes/Team.js';

app.use('/api/', userRouter);
app.use('/api/', teamRouter);

//Login Page
app.get('/', (req, res) => {
    res.send('HTH-Portal');
});

app.listen(port, () => {
    console.log(`Server running in Port ${port}`);
    ConnectDb();
});