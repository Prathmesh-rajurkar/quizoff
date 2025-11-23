const express = require('express');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching profile'
        });
    }
});

// @route   GET /api/user/sessions
// @desc    Get user's quiz sessions
// @access  Private
router.get('/sessions', authMiddleware, async (req, res) => {
    try {
        // Get all quizzes created by user
        const quizzes = await Quiz.find({ creator: req.user._id }).select('_id');
        const quizIds = quizzes.map(q => q._id);

        // Get all sessions for these quizzes
        const sessions = await Session.find({ quizId: { $in: quizIds } })
            .populate('quizId', 'title code')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: sessions.length,
            sessions: sessions.map(session => ({
                id: session._id,
                code: session.code,
                quizTitle: session.quizId.title,
                status: session.status,
                participantsCount: session.participants.length,
                createdAt: session.createdAt,
                startedAt: session.startedAt,
                finishedAt: session.finishedAt
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching sessions'
        });
    }
});

module.exports = router;

