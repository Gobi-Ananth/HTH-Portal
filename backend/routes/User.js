import express from 'express';
import { authUser, callback, failure, getUserData, logoutUser } from '../controller/User.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

router.get('/user/auth/google', authUser);
router.get('/user/auth/google/callback', callback);
router.get('/user/auth/failure', failure);
router.get('/user/auth/logout', isAuth, logoutUser);
router.get('/user/get-data', isAuth, getUserData);

export default router;
