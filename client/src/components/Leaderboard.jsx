import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    FaUser,
    FaUserCircle,
    FaUserAstronaut,
    FaUserNinja,
    FaUserSecret,
    FaUserTie
} from "react-icons/fa";
import { quizAPI } from "../utils/api";
import { toast } from "react-toastify";

const Leaderboard = () => {
    const { id: code } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await quizAPI.getLeaderboard(code);
                if (response.success) {
                    setLeaderboard(response.leaderboard || []);
                }
            } catch (error) {
                toast.error(error.message || "Failed to load leaderboard");
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            fetchLeaderboard();
        }
    }, [code]);

    const iconOptions = ['FaUser', 'FaUserCircle', 'FaUserAstronaut', 'FaUserNinja', 'FaUserSecret', 'FaUserTie'];
    
    const getPlayerIcon = (index) => {
        return iconOptions[index % iconOptions.length];
    };

    const getIconComponent = (iconName, size = "text-5xl text-purple-600") => {
        const iconMap = {
            FaUser: <FaUser className={size} />,
            FaUserCircle: <FaUserCircle className={size} />,
            FaUserAstronaut: <FaUserAstronaut className={size} />,
            FaUserNinja: <FaUserNinja className={size} />,
            FaUserSecret: <FaUserSecret className={size} />,
            FaUserTie: <FaUserTie className={size} />,
        };
        return iconMap[iconName] || iconMap["FaUser"];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#20002c] text-white flex items-center justify-center">
                <p className="text-2xl">Loading leaderboard...</p>
            </div>
        );
    }

    if (leaderboard.length === 0) {
        return (
            <div className="min-h-screen bg-[#20002c] text-white flex items-center justify-center">
                <p className="text-2xl text-gray-400">No leaderboard data available</p>
            </div>
        );
    }

    // top 3
    const [first, second, third] = leaderboard;

    // remaining list
    const rest = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-[#20002c] text-white">
            <main className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-5xl font-bold text-purple-600 text-center mb-12">
                    Leaderboard
                </h1>

                {/* 🥇🥈🥉 TOP 3 PODIUM */}
                <div className="flex justify-center items-end gap-10 mt-10 mb-16">

                    {/* 🥈 2nd Place */}
                    {second && (
                        <div className="flex flex-col items-center">
                            {getIconComponent(getPlayerIcon(1))}
                            <p className="text-lg mt-2 text-purple-600">{second.username}</p>
                            <div className="w-28 h-32 bg-[#C0C0C0] rounded-t-xl mt-3 flex items-center justify-center text-purple-600 text-3xl font-bold">
                                2
                            </div>
                            <p className="text-xl font-semibold text-yellow-400">{second.score} pts</p>
                        </div>
                    )}

                    {/* 🥇 1st Place */}
                    {first && (
                        <div className="flex flex-col items-center">
                            {getIconComponent(getPlayerIcon(0))}
                            <p className="text-lg mt-2 text-purple-600">{first.username}</p>
                            <div className="w-32 h-40 bg-[#FFD700] rounded-t-xl mt-3 flex items-center justify-center text-purple-600 text-4xl font-bold">
                                1
                            </div>
                            <p className="text-xl font-semibold text-yellow-400">{first.score} pts</p>
                        </div>
                    )}

                    {/* 🥉 3rd Place */}
                    {third && (
                        <div className="flex flex-col items-center">
                            {getIconComponent(getPlayerIcon(2))}
                            <p className="text-lg mt-2 text-purple-600">{third.username}</p>
                            <div className="w-28 h-28 bg-[#CD7F32] rounded-t-xl mt-3 flex items-center justify-center text-purple-600 text-3xl font-bold">
                                3
                            </div>
                            <p className="text-xl font-semibold text-yellow-400">{third.score} pts</p>
                        </div>
                    )}

                </div>

                {/* 📜 Remaining Players List */}
                <div className="bg-gray-900 max-w-3xl mx-auto rounded-lg overflow-hidden shadow-xl">
                    {rest.map((player, index) => (
                        <div
                            key={player.userId || index}
                            className="flex items-center justify-between px-6 py-4 border-b border-gray-800"
                        >
                            {/* Icon + Name */}
                            <div className="flex items-center gap-3 w-60">
                                {/* Rank */}
                                <p className="text-3xl font-bold text-purple-500 w-10 mr-4">
                                    #{player.rank}
                                </p>
                                {getIconComponent(getPlayerIcon(index + 3), "text-3xl text-purple-600")}
                                <p className="text-lg">{player.username}</p>
                            </div>

                            {/* Score */}
                            <p className="text-xl font-semibold text-yellow-400">
                                {player.score} pts
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Leaderboard;
