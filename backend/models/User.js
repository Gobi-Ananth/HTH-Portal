import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    reg_no: {
        type: String,
        required: true
    },
    google_id: {
        type: String,
        unique: true,
        required: true
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team',
        default: null
    },
    role: {
        type: String,
        enum: ['leader', 'member'],
        default: 'leader'
    }
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);
