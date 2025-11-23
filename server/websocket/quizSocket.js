const Session = require('../models/Session');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

class QuizSocketHandler {
    constructor(wss) {
        this.wss = wss;
        this.sessions = new Map(); // code -> Set of WebSocket connections
        this.connections = new Map(); // ws -> { userId, code, username }
    }

    initialize() {
        this.wss.on('connection', (ws, req) => {
            console.log('New WebSocket connection');

            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    await this.handleMessage(ws, data);
                } catch (error) {
                    console.error('Error handling message:', error);
                    this.sendError(ws, 'Invalid message format');
                }
            });

            ws.on('close', () => {
                this.handleDisconnect(ws);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });
    }

    async handleMessage(ws, data) {
        const { type, payload } = data;

        switch (type) {
            case 'JOIN_QUIZ':
                await this.handleJoinQuiz(ws, payload);
                break;
            case 'START_QUIZ':
                await this.handleStartQuiz(ws, payload);
                break;
            case 'SUBMIT_ANSWER':
                await this.handleSubmitAnswer(ws, payload);
                break;
            case 'NEXT_QUESTION':
                await this.handleNextQuestion(ws, payload);
                break;
            case 'END_QUIZ':
                await this.handleEndQuiz(ws, payload);
                break;
            default:
                this.sendError(ws, 'Unknown message type');
        }
    }

    async handleJoinQuiz(ws, payload) {
        try {
            const { code, userId, username } = payload;

            if (!code) {
                return this.sendError(ws, 'Quiz code is required');
            }

            // Find or create session
            let session = await Session.findOne({ code: code.toUpperCase() });
            
            if (!session) {
                // Find quiz
                const quiz = await Quiz.findOne({ code: code.toUpperCase() });
                if (!quiz) {
                    return this.sendError(ws, 'Quiz not found');
                }

                // Create new session
                session = await Session.create({
                    quizId: quiz._id,
                    code: code.toUpperCase(),
                    status: 'waiting'
                });
            }

            // Add participant if not already added
            const existingParticipant = userId 
                ? session.participants.find(p => p.userId && p.userId.toString() === userId)
                : session.participants.find(p => !p.userId && p.username === (username || 'Anonymous'));

            if (!existingParticipant) {
                session.participants.push({
                    userId: userId || null,
                    username: username || 'Anonymous',
                    score: 0,
                    answers: []
                });
                await session.save();
            }

            // Store connection info
            this.connections.set(ws, { userId, code: code.toUpperCase(), username });

            // Add to sessions map
            if (!this.sessions.has(code.toUpperCase())) {
                this.sessions.set(code.toUpperCase(), new Set());
            }
            this.sessions.get(code.toUpperCase()).add(ws);

            // Send confirmation
            ws.send(JSON.stringify({
                type: 'JOINED_QUIZ',
                payload: {
                    code: session.code,
                    participants: session.participants.map(p => ({
                        username: p.username,
                        score: p.score
                    })),
                    status: session.status
                }
            }));

            // Broadcast to other participants
            this.broadcastToSession(code.toUpperCase(), {
                type: 'PARTICIPANT_JOINED',
                payload: {
                    username: username || 'Anonymous',
                    participantsCount: session.participants.length
                }
            }, ws);

        } catch (error) {
            console.error('Error joining quiz:', error);
            this.sendError(ws, error.message);
        }
    }

    async handleStartQuiz(ws, payload) {
        try {
            const { code } = payload;
            const connection = this.connections.get(ws);

            if (!connection || connection.code !== code.toUpperCase()) {
                return this.sendError(ws, 'Not connected to this quiz');
            }

            const session = await Session.findOne({ code: code.toUpperCase() });
            if (!session) {
                return this.sendError(ws, 'Session not found');
            }

            // Verify user is creator (optional - add auth check)
            session.status = 'active';
            session.currentQuestionIndex = 0;
            session.startedAt = new Date();
            await session.save();

            // Get quiz with questions
            const quiz = await Quiz.findById(session.quizId);
            if (!quiz || quiz.questions.length === 0) {
                return this.sendError(ws, 'Quiz has no questions');
            }

            // Send first question to all participants
            const firstQuestion = quiz.questions[0];
            this.broadcastToSession(code.toUpperCase(), {
                type: 'QUIZ_STARTED',
                payload: {
                    question: {
                        text: firstQuestion.text,
                        options: firstQuestion.options,
                        time: firstQuestion.time,
                        questionIndex: 0
                    },
                    totalQuestions: quiz.questions.length
                }
            });

        } catch (error) {
            console.error('Error starting quiz:', error);
            this.sendError(ws, error.message);
        }
    }

    async handleSubmitAnswer(ws, payload) {
        try {
            const { code, questionIndex, selectedIndex, timeTaken } = payload;
            const connection = this.connections.get(ws);

            if (!connection || connection.code !== code.toUpperCase()) {
                return this.sendError(ws, 'Not connected to this quiz');
            }

            const session = await Session.findOne({ code: code.toUpperCase() });
            if (!session || session.status !== 'active') {
                return this.sendError(ws, 'Quiz is not active');
            }

            const quiz = await Quiz.findById(session.quizId);
            if (!quiz) {
                return this.sendError(ws, 'Quiz not found');
            }

            const question = quiz.questions[questionIndex];
            if (!question) {
                return this.sendError(ws, 'Question not found');
            }

            const isCorrect = question.correctIndex === selectedIndex;
            const points = isCorrect ? 10 : 0; // You can adjust scoring logic

            // Update participant's answer and score
            const participant = connection.userId
                ? session.participants.find(p => p.userId && p.userId.toString() === connection.userId)
                : session.participants.find(p => !p.userId && p.username === connection.username);

            if (participant) {
                participant.answers.push({
                    questionIndex,
                    selectedIndex,
                    isCorrect,
                    timeTaken
                });

                if (isCorrect) {
                    participant.score += points;
                }

                await session.save();
            }

            // Send confirmation to user
            ws.send(JSON.stringify({
                type: 'ANSWER_SUBMITTED',
                payload: {
                    isCorrect,
                    correctIndex: question.correctIndex,
                    score: participant ? participant.score : 0
                }
            }));

        } catch (error) {
            console.error('Error submitting answer:', error);
            this.sendError(ws, error.message);
        }
    }

    async handleNextQuestion(ws, payload) {
        try {
            const { code } = payload;
            const connection = this.connections.get(ws);

            if (!connection || connection.code !== code.toUpperCase()) {
                return this.sendError(ws, 'Not connected to this quiz');
            }

            const session = await Session.findOne({ code: code.toUpperCase() });
            if (!session || session.status !== 'active') {
                return this.sendError(ws, 'Quiz is not active');
            }

            const quiz = await Quiz.findById(session.quizId);
            if (!quiz) {
                return this.sendError(ws, 'Quiz not found');
            }

            session.currentQuestionIndex += 1;

            if (session.currentQuestionIndex >= quiz.questions.length) {
                // Quiz finished
                session.status = 'finished';
                session.finishedAt = new Date();
                await session.save();

                // Send leaderboard
                const leaderboard = session.participants
                    .sort((a, b) => b.score - a.score)
                    .map((p, index) => ({
                        rank: index + 1,
                        username: p.username,
                        score: p.score
                    }));

                this.broadcastToSession(code.toUpperCase(), {
                    type: 'QUIZ_FINISHED',
                    payload: { leaderboard }
                });
            } else {
                // Send next question
                const nextQuestion = quiz.questions[session.currentQuestionIndex];
                await session.save();

                this.broadcastToSession(code.toUpperCase(), {
                    type: 'NEXT_QUESTION',
                    payload: {
                        question: {
                            text: nextQuestion.text,
                            options: nextQuestion.options,
                            time: nextQuestion.time,
                            questionIndex: session.currentQuestionIndex
                        },
                        totalQuestions: quiz.questions.length
                    }
                });
            }

        } catch (error) {
            console.error('Error moving to next question:', error);
            this.sendError(ws, error.message);
        }
    }

    async handleEndQuiz(ws, payload) {
        try {
            const { code } = payload;
            const connection = this.connections.get(ws);

            if (!connection || connection.code !== code.toUpperCase()) {
                return this.sendError(ws, 'Not connected to this quiz');
            }

            const session = await Session.findOne({ code: code.toUpperCase() });
            if (!session) {
                return this.sendError(ws, 'Session not found');
            }

            session.status = 'finished';
            session.finishedAt = new Date();
            await session.save();

            // Send leaderboard
            const leaderboard = session.participants
                .sort((a, b) => b.score - a.score)
                .map((p, index) => ({
                    rank: index + 1,
                    username: p.username,
                    score: p.score
                }));

            this.broadcastToSession(code.toUpperCase(), {
                type: 'QUIZ_FINISHED',
                payload: { leaderboard }
            });

        } catch (error) {
            console.error('Error ending quiz:', error);
            this.sendError(ws, error.message);
        }
    }

    handleDisconnect(ws) {
        const connection = this.connections.get(ws);
        if (connection) {
            const { code, username } = connection;
            
            // Remove from sessions map
            if (this.sessions.has(code)) {
                this.sessions.get(code).delete(ws);
                if (this.sessions.get(code).size === 0) {
                    this.sessions.delete(code);
                }
            }

            // Broadcast participant left
            this.broadcastToSession(code, {
                type: 'PARTICIPANT_LEFT',
                payload: { username: username || 'Anonymous' }
            }, ws);

            this.connections.delete(ws);
        }
    }

    broadcastToSession(code, message, excludeWs = null) {
        const session = this.sessions.get(code.toUpperCase());
        if (session) {
            session.forEach(ws => {
                if (ws !== excludeWs && ws.readyState === 1) { // 1 = OPEN
                    ws.send(JSON.stringify(message));
                }
            });
        }
    }

    sendError(ws, message) {
        ws.send(JSON.stringify({
            type: 'ERROR',
            payload: { message }
        }));
    }
}

module.exports = QuizSocketHandler;

