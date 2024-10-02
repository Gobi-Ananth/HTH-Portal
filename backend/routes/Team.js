import express from 'express';
import { createTeam, getTeamData, joinTeam, submitIdea } from '../controller/Team.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

router.post('/team/create-team', isAuth, createTeam);
router.post('/team/join-team', isAuth, joinTeam);
router.post('/team/submit-idea', isAuth, submitIdea);
router.get('/team/get-data', isAuth, getTeamData);

export default router;