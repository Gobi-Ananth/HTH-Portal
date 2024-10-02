import { Team } from '../models/Team.js';
import { User } from '../models/User.js';
import crypto from 'crypto';

// createTeam
export const createTeam = async (req, res) => {
    try {
        const { team_name } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (team_name.trim() == '') {
            return res.status(403).json({message: "Team name cannot be empty."});
        }
        if (user.team_id) {
            return res.status(400).json({message: "You are already part of a team."});
        }
        const existingTeam = await Team.findOne({ team_name });
        if (existingTeam) {
            return res.status(400).json({message: "Team name already exists."});
        }
        const team_id = crypto.randomBytes(3).toString('hex').toUpperCase(); 
        const newTeam = new Team({
            team_name,
            team_id,
            leader_id: userId,
            members: [userId] 
        });
        const savedTeam = await newTeam.save();
        user.team_id = savedTeam._id;
        user.role = 'leader';
        await user.save();

        res.status(201).json({message: "Team created successfully.", team: savedTeam});
    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({message: "Server error"});
    }
};

// joinTeam
export const joinTeam = async (req, res) => {
    try {
        const { team_id } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (team_id.trim() == '') {
            return res.status(403).json({message: "Team Code cannot be empty."});
        }
        if (user.team_id) {
            return res.status(400).json({message: "You are already in a team."});
        }
        const team = await Team.findOne({ team_id });
        if (!team) {
            return res.status(404).json({message: "Team not found."});
        }
        if (team.members.length >= 6) {
            return res.status(400).json({message: "Team is full. Maximum 6 members allowed."});
        }
        team.members.push(userId);
        await team.save();
        user.team_id = team._id;
        user.role = 'member'; 
        await user.save();
        res.status(200).json({message: "Successfully joined the team.", team});
    } catch (error) {
        console.error("Error joining team:", error);
        res.status(500).json({message: "Server error"});
    }
};

// submitIdea
export const submitIdea = async (req, res) => {
    try {
        const { idea } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId).populate('team_id');
        if (idea.trim() == '') {
            return res.status(403).json({message: "Idea cannot be empty."});
        }
        if (!user || !user.team_id) {
            return res.status(404).json({message: "User not part of any team."});
        }
        const team = user.team_id;
        if (team.leader_id.toString() !== userId) {
            return res.status(403).json({message: "Only the team leader can submit the idea."});
        }
        if (!team.is_editable) {
            return res.status(403).json({message: "Idea submission is no longer editable."});
        }
        team.idea = idea;
        team.submission_time = new Date();
        team.submission_status = 'submitted';
        team.is_editable = false;
        await team.save();
        return res.status(200).json({message: "Idea submitted successfully.", team});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// getTeamData
export const getTeamData = async (req, res) => {
    try {
        const teamId = req.user.team_id;
        if (!teamId) {
            return res.status(400).json({message: "User is not part of any team"});
        }
        const team = await Team.findById(teamId)
            .populate({
                path: 'members',  
                select: 'name reg_no email role'  
            });
        if (!team) {
            return res.status(404).json({message: "Team not found"});
        }
        const teamDetails = {
            team_name: team.team_name,
            team_id: team.team_id,
            idea: team.idea,
            members: team.members.map(member => ({
                name: member.name,
                reg_no: member.reg_no,
                email: member.email,
                role: member.role
            }))
        };
        return res.status(200).json({message: "Data recieved Successfully", teamDetails});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};




