const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    answers: [{
        questionIndex: Number,
        selectedIndex: Number,
        isCorrect: Boolean,
        timeTaken: Number
    }],
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const sessionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    code: {
        type: String,
        required: true,
        length: 6,
        uppercase: true
    },
    status: {
        type: String,
        enum: ['waiting', 'active', 'finished'],
        default: 'waiting'
    },
    participants: {
        type: [participantSchema],
        default: []
    },
    currentQuestionIndex: {
        type: Number,
        default: -1
    },
    startedAt: {
        type: Date
    },
    finishedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster lookups
sessionSchema.index({ code: 1 });
sessionSchema.index({ quizId: 1 });

module.exports = mongoose.model('Session', sessionSchema);

