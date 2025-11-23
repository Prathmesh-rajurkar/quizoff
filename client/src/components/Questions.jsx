import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createWebSocket } from "../utils/api";

const Questions = ({ code }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [score, setScore] = useState(0);
    const wsRef = useRef(null);
    const questionStartTimeRef = useRef(Date.now());

    // Connect to WebSocket and receive questions
    useEffect(() => {
        const username = user?.username || 'Anonymous';
        const userId = user?.id || null;
        const ws = createWebSocket(code, userId, username);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'QUIZ_STARTED':
                    const question = data.payload.question;
                    setQuestions([question]);
                    setCurrentIndex(0);
                    setTimeLeft(question.time || 30);
                    setTotalQuestions(data.payload.totalQuestions);
                    questionStartTimeRef.current = Date.now();
                    break;
                case 'NEXT_QUESTION':
                    const nextQuestion = data.payload.question;
                    setQuestions(prev => [...prev, nextQuestion]);
                    setCurrentIndex(data.payload.question.questionIndex);
                    setTimeLeft(nextQuestion.time || 30);
                    setSelectedOption(null);
                    questionStartTimeRef.current = Date.now();
                    break;
                case 'ANSWER_SUBMITTED':
                    if (data.payload.isCorrect) {
                        setScore(data.payload.score);
                    }
                    break;
                case 'QUIZ_FINISHED':
                    navigate(`/quiz/${code}/leaderboard`);
                    break;
                case 'ERROR':
                    console.error('WebSocket error:', data.payload.message);
                    break;
                default:
                    break;
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [code, user, navigate]);

    const currentQuestion = questions[currentIndex];

    // --- TIMER ---
    useEffect(() => {
        if (!currentQuestion || selectedOption) return; // stop timer after answer

        if (timeLeft <= 0) {
            setSelectedOption("TIME_UP");
            handleAnswer(null); // Submit with no answer
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(t => t - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, selectedOption, currentQuestion]);


    // --- ON ANSWER CLICK ---
    const handleAnswer = (optionIndex) => {
        if (selectedOption !== null || !currentQuestion) return;

        const timeTaken = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
        setSelectedOption(optionIndex);

        // Send answer to server
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'SUBMIT_ANSWER',
                payload: {
                    code,
                    questionIndex: currentIndex,
                    selectedIndex: optionIndex,
                    timeTaken
                }
            }));
        }

        // Wait a bit before moving to next question
        setTimeout(() => {
            // Server will send NEXT_QUESTION or QUIZ_FINISHED
            // But we can also request it if needed
            if (currentIndex < totalQuestions - 1) {
                if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                        type: 'NEXT_QUESTION',
                        payload: { code }
                    }));
                }
            }
        }, 2000);
    };

    // --- Get border color ---
    const getBorderColor = (optIndex) => {
        if (selectedOption === null) return "border-purple-600";
        // Note: We don't know the correct answer until server responds
        // For now, just highlight selected
        if (optIndex === selectedOption) return "border-yellow-600";
        return "border-purple-600";
    };

    if (!currentQuestion) {
        return (
            <div className="h-screen bg-[#20002c] text-white flex items-center justify-center">
                <p className="text-2xl">Waiting for quiz to start...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#20002c] text-white px-4">
            <main className="max-w-6xl mx-auto py-10">

                {/* Timer */}
                <div className="absolute top-6 right-6 flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            className="stroke-gray-700"
                            strokeWidth="4"
                            fill="transparent"
                        />
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            strokeWidth="4"
                            fill="transparent"
                            className={`${timeLeft <= 3 ? "stroke-red-500" : "stroke-yellow-400"} transition-all duration-300`}
                            strokeDasharray={2 * Math.PI * 28}
                            strokeDashoffset={(2 * Math.PI * 28) * (1 - timeLeft / currentQuestion.time)}
                        />
                    </svg>

                    <span className="absolute text-white text-lg font-bold">
                        {timeLeft}
                    </span>
                </div>


                <div className="px-4 py-3 text-3xl bg-purple-700 rounded-md mb-6">
                    <h1>{currentQuestion.text}</h1>
                </div>

                <div className="mb-4 text-center">
                    <p className="text-xl">Question {currentIndex + 1} of {totalQuestions}</p>
                    <p className="text-lg text-purple-400">Score: {score}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 h-96">
                    {currentQuestion.options.map((opt, index) => {
                        const optionText = typeof opt === 'object' ? opt.text : opt;
                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={selectedOption !== null}
                                className={`rounded border-4 p-4 text-left 
                                    transition-all duration-300 ${getBorderColor(index)}
                                    disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {String.fromCharCode(65 + index)}. {optionText}
                            </button>
                        );
                    })}
                </div>

            </main>
        </div>
    );
};

export default Questions;
