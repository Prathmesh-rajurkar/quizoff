import React, { useState } from "react";
import Header from "./Header";
import { FaCheckCircle, FaEdit } from "react-icons/fa";

const Create = () => {
    const [questions, setQuestions] = useState([]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                text: "",
                options: ["", "", "", ""],
                correctIndex: null,
                saved: false, // <-- NEW: saved state per question
            },
        ]);
    };

    const updateQuestionText = (id, text) => {
        setQuestions(q =>
            q.map(item => (item.id === id ? { ...item, text } : item))
        );
    };

    const updateOption = (qid, index, text) => {
        setQuestions(q =>
            q.map(item => {
                if (item.id === qid) {
                    const newOpts = [...item.options];
                    newOpts[index] = text;
                    return { ...item, options: newOpts };
                }
                return item;
            })
        );
    };

    const addOption = (qid) => {
        setQuestions(q =>
            q.map(item =>
                item.id === qid && item.options.length < 5
                    ? { ...item, options: [...item.options, ""] }
                    : item
            )
        );
    };

    const removeOption = (qid) => {
        setQuestions(q =>
            q.map(item =>
                item.id === qid && item.options.length > 2
                    ? { ...item, options: item.options.slice(0, -1) }
                    : item
            )
        );
    };

    const setCorrect = (qid, index) => {
        setQuestions(q =>
            q.map(item =>
                item.id === qid ? { ...item, correctIndex: index } : item
            )
        );
    };

    const removeQuestion = (qid) => {
        setQuestions(questions.filter(q => q.id !== qid));
    };

    // SAVE ONLY THIS PROBLEM
    const saveProblem = (qid) => {
        setQuestions(q =>
            q.map(item =>
                item.id === qid
                    ? { ...item, saved: true }
                    : item
            )
        );
    };

    // EDIT ONLY THIS PROBLEM
    const editProblem = (qid) => {
        setQuestions(q =>
            q.map(item =>
                item.id === qid
                    ? { ...item, saved: false }
                    : item
            )
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="px-10 max-w-6xl mx-auto mt-20">
                <h1 className="text-4xl font-bold text-purple-600 mb-10">
                    Create Quiz
                </h1>

                {/* Add Question */}
                <button
                    onClick={addQuestion}
                    className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg font-semibold mb-10 transition"
                >
                    + Add Question
                </button>

                {/* Render Each Question */}
                <div className="space-y-10">
                    {questions.map((q, i) => (
                        <div
                            key={q.id}
                            className="border border-purple-700 rounded-xl p-6 bg-gray-900"
                        >

                            {/* EDIT MODE */}
                            {!q.saved && (
                                <>
                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-xl font-semibold text-purple-400">
                                            Problem {i + 1}
                                        </h2>
                                        <button
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => removeQuestion(q.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        value={q.text}
                                        onChange={(e) =>
                                            updateQuestionText(q.id, e.target.value)
                                        }
                                        placeholder="Enter your question..."
                                        className="w-full px-4 py-3 rounded-md bg-gray-800 border border-purple-700 mb-6"
                                    />

                                    <div className="space-y-4">
                                        {q.options.map((opt, index) => (
                                            <div key={index} className="flex gap-4 items-center">
                                                <input
                                                    type="radio"
                                                    name={`correct-${q.id}`}
                                                    checked={q.correctIndex === index}
                                                    onChange={() => setCorrect(q.id, index)}
                                                    className="w-5 h-5"
                                                />

                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) =>
                                                        updateOption(q.id, index, e.target.value)
                                                    }
                                                    placeholder={`Option ${index + 1}`}
                                                    className="flex-1 px-4 py-3 rounded-md bg-gray-800 border border-purple-700"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add/Remove Option */}
                                    <div className="flex gap-4 mt-6">
                                        <button
                                            disabled={q.options.length >= 5}
                                            onClick={() => addOption(q.id)}
                                            className={`px-4 py-2 rounded-lg ${
                                                q.options.length >= 5
                                                    ? "bg-gray-600 cursor-not-allowed"
                                                    : "bg-purple-700 hover:bg-purple-800"
                                            }`}
                                        >
                                            + Add Option
                                        </button>

                                        <button
                                            disabled={q.options.length <= 2}
                                            onClick={() => removeOption(q.id)}
                                            className={`px-4 py-2 rounded-lg ${
                                                q.options.length <= 2
                                                    ? "bg-gray-600 cursor-not-allowed"
                                                    : "bg-red-600 hover:bg-red-700"
                                            }`}
                                        >
                                            - Remove Option
                                        </button>
                                    </div>

                                    {/* SAVE BUTTON */}
                                    <button
                                        onClick={() => {
                                            if (q.text.trim() === "") return;
                                            saveProblem(q.id);
                                        }}
                                        disabled={q.text.trim() === ""}
                                        className={`mt-6 px-6 py-3 rounded-lg font-semibold transition ${
                                            q.text.trim() === ""
                                                ? "bg-gray-600 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"
                                        }`}
                                    >
                                        Save Problem
                                    </button>
                                </>
                            )}

                            {/* PREVIEW MODE */}
                            {q.saved && (
                                <div>
                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-xl font-semibold text-purple-400">
                                            Problem {i + 1}
                                        </h2>

                                        <button
                                            onClick={() => editProblem(q.id)}
                                            className="text-purple-400 hover:text-purple-500 text-xl flex items-center gap-2"
                                        >
                                            <FaEdit />
                                            Edit
                                        </button>
                                    </div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        {q.text}
                                    </h3>

                                    <div className="space-y-3">
                                        {q.options.map((opt, index) => {
                                            const isCorrect = index === q.correctIndex;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`px-4 py-3 rounded-lg border flex items-center gap-3 ${
                                                        isCorrect
                                                            ? "border-green-500 bg-green-900/30"
                                                            : "border-gray-700"
                                                    }`}
                                                >
                                                    <span>{opt}</span>
                                                    {isCorrect && (
                                                        <FaCheckCircle className="text-green-500 text-xl" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Create;
