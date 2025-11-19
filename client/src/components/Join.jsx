import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Join = () => {
    const [code, setCode] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const handleJoinQuiz = () => {
        setError("");
        if (code.trim() === "") {
            setError("Code cannot be empty");
            return;
        }
        if (code.length !== 6) {
            setError("Code must be 6 digits long");
            return;
        }

        navigate(`/quiz/${code}`);
    };
    return (
        <div className="h-screen bg-[#20002c] text-white box-border">
            <Header />

            <main className="px-10 max-w-6xl mx-auto my-36">
                <div className="my-10">
                    <h1 className="text-center text-6xl font-semibold my-2">
                        Join a Quiz
                    </h1>
                    <div className="flex items-center justify-center px-5 py-3 my-10 max-w-sm mx-auto border-2 rounded-xl">
                        <input
                            type="text"
                            placeholder="Enter Code"
                            className="w-full py-3 bg-[#20002c] text-2xl font-stretch-100% rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all"
                            value={code}
                            maxLength={6}
                            onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
                                setCode(numericValue);
                            }}
                        />
                        <button
                            className=" py-3 px-4 text-2xl bg-purple-600 rounded-xl font-semibold cursor-pointer active:scale-95 transition-transform hover:bg-purple-700 "
                            onClick={handleJoinQuiz}
                        >
                            Join
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </div>
            </main>
            <div className="absolute bottom-0 w-full">
                <Footer />
            </div>
        </div>
    );
};

export default Join;
