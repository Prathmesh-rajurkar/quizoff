import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { FaCheck, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { quizAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Create = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Please login to create a quiz");
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                text: "",
                options: ["", "", "", ""],
                correctIndex: null,
                saved: false,
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

    const removeOption = (qid, index) => {
        setQuestions(q =>
            q.map(item => {
                if (item.id === qid) {
                    const newOpts = item.options.filter((_, i) => i !== index);
                    return { ...item, options: newOpts };
                }
                return item;
            })
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

    const saveProblem = (qid) => {
        setQuestions(q =>
            q.map(item =>
                item.id === qid ? { ...item, saved: true } : item
            )
        );
    };

    const editProblem = (qid) => {
        setQuestions(q =>
            q.map(item =>
                item.id === qid ? { ...item, saved: false } : item
            )
        );
    };

    const handleSaveQuiz = async () => {
        if (!title.trim()) {
            toast.error("Please enter a quiz title");
            return;
        }

        if (questions.some(q => !q.saved)) {
            toast.error("Please save all questions before saving the quiz");
            return;
        }

        setLoading(true);
        try {
            // Transform questions to match backend format
            const formattedQuestions = questions.map(q => ({
                text: q.text,
                options: q.options.map(opt => ({ text: opt })),
                correctIndex: q.correctIndex,
                time: 30 // Default time, can be made configurable
            }));

            const response = await quizAPI.create(title, formattedQuestions);
            
            if (response.success) {
                toast.success("Quiz created successfully!");
                navigate(`/dashboard/library`);
            }
        } catch (error) {
            toast.error(error.message || "Failed to create quiz");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#20002c] text-white">
            <Header />

            <main className="px-10 max-w-7xl mx-auto mt-20 pb-10">

                {/* Top Add Button */}

                <button
                    onClick={addQuestion}
                    className="px-3 py-2 bg-gray-950 hover:bg-purple-600 border-2 border-purple-600 text-purple-600 cursor-pointer rounded text-lg fixed right-6 hover:text-white transition-all duration-300  active:scale-95 hover:scale-105"
                >
                    Add
                </button>


                {questions.length === 0 && (
                    <div className="bg-purple-900/30 border border-purple-700 py-10 text-center rounded-xl text-xl">
                        No Questions. Click on <span className="font-bold">Add</span> to begin.
                    </div>
                )}

                {/* Render Questions */}
                <div className="space-y-14">
                    {questions.map((q, i) => (
                        <div
                            key={q.id}
                            className="bg-[#2D0041] border border-purple-700 p-8 rounded-xl"
                        >

                            {/* ============== EDIT MODE ============== */}
                            {!q.saved && (
                                <>
                                    {/* HEADER */}
                                    <div className="flex justify-between mb-4">
                                        <h2 className="text-2xl font-semibold text-purple-300">
                                            Problem {i + 1}
                                        </h2>
                                        <button
                                            onClick={() => removeQuestion(q.id)}
                                            className="text-red-400 hover:text-red-500"
                                        >
                                            <FaTrash size={22} />
                                        </button>
                                    </div>

                                    {/* QUESTION BOX */}
                                    <textarea
                                        value={q.text}
                                        onChange={(e) =>
                                            updateQuestionText(q.id, e.target.value)
                                        }
                                        placeholder="Type question here"
                                        className="w-full p-6 h-32 text-lg rounded-xl bg-[#16001f] border border-purple-700 outline-none"
                                    />

                                    {/* OPTIONS GRID */}
                                    <div className="lg:flex items-center justify-center w-full gap-2">


                                        <div className="flex flex-col lg:flex-row w-full justify-center items-center gap-6 mt-6">
                                            {q.options.map((opt, index) => {
                                                const colors = [
                                                    "bg-blue-600",
                                                    "bg-teal-600",
                                                    "bg-yellow-500",
                                                    "bg-pink-600",
                                                    "bg-purple-600"
                                                ];

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`p-5 rounded-xl w-full text-lg relative ${colors[index % 5]}`}
                                                    >
                                                        {/* Remove option */}
                                                        {q.options.length > 2 && (
                                                            <button
                                                                onClick={() => removeOption(q.id, index)}
                                                                className="absolute top-3 left-3 bg-white/20 hover:bg-white/30 p-1 rounded"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        )}


                                                        {/* Correct Marker */}
                                                        <button
                                                            onClick={() => setCorrect(q.id, index)}
                                                            className={`absolute top-3 right-3 p-1 rounded-full border-2 
                                                            ${q.correctIndex === index
                                                                    ? "border-white bg-white/40"
                                                                    : "border-white/40"
                                                                }`}
                                                        >
                                                            {q.correctIndex === index && (
                                                                <FaCheck size={14} />
                                                            )}
                                                        </button>

                                                        <input
                                                            value={opt}
                                                            onChange={(e) =>
                                                                updateOption(q.id, index, e.target.value)
                                                            }
                                                            placeholder="Type answer option here"
                                                            className="w-full h-32 mt-6 text-xl bg-transparent outline-none text-white"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* ADD OPTION */}
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={() => addOption(q.id)}
                                                disabled={q.options.length >= 5}
                                                className="p-3 bg-purple-700 hover:bg-purple-800 rounded-lg disabled:bg-gray-600"
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </div>
                                    {/* SAVE BUTTON */}
                                    <button
                                        onClick={() => {
                                            if (q.text.trim() === "") {
                                                toast.error("Question can't be empty")
                                                return;
                                            };
                                            if (q.options.some(opt => opt.trim() === "")) {
                                                toast.error("All options must be filled");
                                                return;
                                            }
                                            if (q.correctIndex === null) {
                                                toast.error("Select Correct Answer")
                                                return;
                                            }

                                            saveProblem(q.id);
                                        }}
                                        className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg"
                                    >
                                        Save
                                    </button>
                                </>
                            )}

                            {/* ============== PREVIEW MODE ============== */}
                            {q.saved && (
                                <>
                                    <div className="flex justify-between mb-6">
                                        <h2 className="text-2xl font-semibold text-purple-300">
                                            Problem {i + 1}
                                        </h2>

                                        <button
                                            onClick={() => editProblem(q.id)}
                                            className="text-purple-300 hover:text-purple-400 flex items-center gap-2"
                                        >
                                            <FaEdit />
                                            Edit
                                        </button>
                                    </div>

                                    <div className="text-xl mb-6">{q.text}</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {q.options.map((opt, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 border rounded-xl mb-3 flex justify-between items-center
                                                ${index === q.correctIndex
                                                        ? "border-green-500 bg-green-900/30"
                                                        : "border-gray-600"
                                                    }`}
                                            >
                                                {opt}

                                                {index === q.correctIndex && (
                                                    <FaCheck className="text-green-500" />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                </>
                            )}
                            
                        </div>
                    ))}

                    {questions.length !== 0 && (
                    <div className="flex flex-col items-center justify-center mt-10 gap-4">
                        <input
                            type="text"
                            placeholder="Enter Quiz Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full max-w-md p-3 bg-[#16001f] border border-purple-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button 
                            onClick={handleSaveQuiz}
                            disabled={loading || !title.trim() || questions.some(q => !q.saved)}
                            className="bg-gray-950 border-2 border-green-600 rounded px-3 py-2 text-green-600 font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Save Quiz"}
                        </button>
                    </div>
                )}
                </div>
            </main>
        </div>
    );
};

export default Create;
