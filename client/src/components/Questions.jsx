import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Questions = () => {
    const questions = [
        {
            id: 1,
            text: "What is the capital of France?",
            options: [
                { id: 'A', text: "Berlin" },
                { id: 'B', text: "Madrid" },
                { id: 'C', text: "Paris" },
                { id: 'D', text: "Rome" }
            ],
            correctOptionId: 'C',
            time: 10
        },
        {
            id: 2,
            text: "Which planet is known as the Red Planet?",
            options: [
                { id: 'A', text: "Earth" },
                { id: 'B', text: "Mars" },
                { id: 'C', text: "Jupiter" },
                { id: 'D', text: "Saturn" }
            ],
            correctOptionId: 'B',
            time: 15
        }
    ];
    const navigate = useNavigate();
    const {id} = useParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(questions[0].time);

    const currentQuestion = questions[currentIndex];

    // --- TIMER ---
    useEffect(() => {
        if (selectedOption) return; // stop timer after answer

        if (timeLeft <= 0) {
            setSelectedOption("TIME_UP");

            setTimeout(() => {
                goToNextQuestion();
            }, 1000);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(t => t - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, selectedOption]);


    // --- ON ANSWER CLICK ---
    const handleAnswer = (optionId) => {
        if (selectedOption) return;

        setSelectedOption(optionId);

        setTimeout(() => {
            goToNextQuestion();
        }, 1000);
    };

    // --- Move to next question ---
    const goToNextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setTimeLeft(questions[currentIndex + 1].time);
        } else {
            navigate(`/quiz/${id}/leaderboard`);
        }
    };

    // --- Get border color ---
    const getBorderColor = (optId) => {
        if (!selectedOption) return "border-purple-600";

        // highlight correct in green for:
        // - correct click
        // - timeout
        if (optId === currentQuestion.correctOptionId) return "border-green-600";

        // user clicked wrong → mark selected red
        if (optId === selectedOption && optId !== currentQuestion.correctOptionId)
            return "border-red-600";

        return "border-purple-600";
    };

    return (
        <div className="h-screen bg-black text-white px-4">
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

                <div className="grid grid-cols-2 gap-2 h-96">
                    {currentQuestion.options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleAnswer(opt.id)}
                            className={`rounded border-4 p-4 text-left 
                                transition-all duration-300 ${getBorderColor(opt.id)}`}
                        >
                            {opt.id}. {opt.text}
                        </button>
                    ))}
                </div>

            </main>
        </div>
    );
};

export default Questions;
