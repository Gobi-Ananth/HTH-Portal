import express from 'express';
import dotenv from 'dotenv';
import ConnectDb from './database/db.js';
import './config/Auth.js';
import passport from 'passport';
import sessionMiddleware from './middleware/sessionMiddleware.js';
import { isAuth } from './middleware/isAuth.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(express.json()); 

app.use(sessionMiddleware); 
app.use(passport.initialize()); 
app.use(passport.session()); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, './../frontend')));

// Import Router
import userRouter from './routes/User.js';
import teamRouter from './routes/Team.js';

app.use('/api/', userRouter);
app.use('/api/', teamRouter);

//Login Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './../frontend/index.html'));
});

app.listen(port, () => {
    console.log(`Server running in Port ${port}`);
    ConnectDb();
});