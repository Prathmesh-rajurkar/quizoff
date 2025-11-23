const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    }
}, { _id: false });

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Question text is required']
    },
    options: {
        type: [optionSchema],
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 2 && v.length <= 5;
            },
            message: 'Question must have between 2 and 5 options'
        }
    },
    correctIndex: {
        type: Number,
        required: [true, 'Correct answer index is required'],
        validate: {
            validator: function(v) {
                return v >= 0 && this.options && v < this.options.length;
            },
            message: 'Correct index must be within options range'
        }
    },
    time: {
        type: Number,
        default: 30,
        min: [5, 'Time must be at least 5 seconds'],
        max: [300, 'Time must be at most 300 seconds']
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Quiz title is required'],
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        length: 6,
        uppercase: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: {
        type: [questionSchema],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'Quiz must have at least one question'
        }
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate unique 6-digit code before saving
quizSchema.pre('save', async function(next) {
    if (!this.code) {
        let code;
        let isUnique = false;
        
        while (!isUnique) {
            code = Math.floor(100000 + Math.random() * 900000).toString();
            const existingQuiz = await mongoose.model('Quiz').findOne({ code });
            if (!existingQuiz) {
                isUnique = true;
            }
        }
        
        this.code = code;
    }
    next();
});

module.exports = mongoose.model('Quiz', quizSchema);

