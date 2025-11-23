const express = require('express');
const Quiz = require('../models/Quiz');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/quiz/create
// @desc    Create a new quiz
// @access  Private
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, questions } = req.body;

        if (!title || !questions || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Title and at least one question are required'
            });
        }

        // Validate questions
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.text || !q.options || q.options.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: `Question ${i + 1} is invalid`
                });
            }
            if (q.correctIndex === null || q.correctIndex === undefined) {
                return res.status(400).json({
                    success: false,
                    message: `Question ${i + 1} must have a correct answer`
                });
            }
        }

        const quiz = await Quiz.create({
            title,
            questions,
            creator: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating quiz'
        });
    }
});

// @route   GET /api/quiz/:code
// @desc    Get quiz by code
// @access  Public
router.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        
        const quiz = await Quiz.findOne({ code: code.toUpperCase() })
            .populate('creator', 'email username')
            .select('-questions.correctIndex'); // Don't send correct answers

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        res.json({
            success: true,
            quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching quiz'
        });
    }
});

// @route   GET /api/quiz/library
// @desc    Get user's quizzes
// @access  Private
router.get('/library', authMiddleware, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ creator: req.user._id })
            .select('-questions')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: quizzes.length,
            quizzes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching quizzes'
        });
    }
});

// @route   DELETE /api/quiz/:id
// @desc    Delete a quiz
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Check if user is the creator
        if (quiz.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this quiz'
            });
        }

        await Quiz.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Quiz deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting quiz'
        });
    }
});

// @route   GET /api/quiz/:code/leaderboard
// @desc    Get leaderboard for a quiz session
// @access  Public
router.get('/:code/leaderboard', async (req, res) => {
    try {
        const { code } = req.params;
        
        const session = await Session.findOne({ code: code.toUpperCase() })
            .populate('participants.userId', 'email username');

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Sort participants by score
        const leaderboard = session.participants
            .sort((a, b) => b.score - a.score)
            .map((p, index) => ({
                rank: index + 1,
                username: p.username,
                score: p.score,
                userId: p.userId
            }));

        res.json({
            success: true,
            leaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching leaderboard'
        });
    }
});

module.exports = router;

