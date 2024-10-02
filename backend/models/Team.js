import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    team_name: {
        type: String,
        unique: true,
        required: true
    },
    team_id: {
        type: String,
        unique: true,
        required: true
    },
    leader_id: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    idea: {
        type: String,
        default: null
    },
    submission_time: {
        type: Date
    },
    submission_status: {
        type: String,
        enum: ['pending', 'submitted'],
        default: 'pending'
    },
    is_editable: {
        type: Boolean,
        default: true
    },
    rank: {
        type: Number,
        default: -1
    }
}, {
    timestamps: true
});

export const Team = mongoose.model('Team', teamSchema);
