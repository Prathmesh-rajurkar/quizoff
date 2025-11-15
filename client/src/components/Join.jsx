import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Join = () => {
    const [code, setCode] = useState("");
    const navigate = useNavigate();
    const handleJoinQuiz = () => {
        navigate(`/quiz/${code}`);
    };
    return (
        <div className="h-screen bg-black text-white box-border">
            <Header />

            <main className="max-w-6xl mx-auto my-36">
                <div className="my-10">
                    <h1 className="text-center text-4xl font-semibold my-2">
                        Join a Quiz
                    </h1>
                    <div className="flex items-center justify-center gap-10 my-10 max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Enter Code"
                            className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button
                            className="px-5 py-3 bg-purple-600 rounded-xl font-semibold cursor-pointer active:scale-95 transition-transform hover:bg-purple-500"
                            onClick={handleJoinQuiz}
                        >
                            Join Quiz
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Join;
