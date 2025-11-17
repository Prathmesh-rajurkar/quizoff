import React, { useState, useEffect } from "react";
import {
    FaUser,
    FaUserCircle,
    FaUserAstronaut,
    FaUserNinja,
    FaUserSecret,
    FaUserTie
} from "react-icons/fa";

const Leaderboard = () => {
    const [playerInfo] = useState([
        { id: 1, name: 'Aarav Sharma', image: 'FaUser' },
        { id: 2, name: 'Priya Patel', image: 'FaUserCircle' },
        { id: 3, name: 'Rohan Singh', image: 'FaUserAstronaut' },
        { id: 4, name: 'Neha Gupta', image: 'FaUserNinja' },
        { id: 5, name: 'Vikram Desai', image: 'FaUserSecret' },
        { id: 6, name: 'Anjali Mehta', image: 'FaUserTie' },
        { id: 7, name: 'Karan Malhotra', image: 'FaUser' },
        { id: 8, name: 'Sneha Kapoor', image: 'FaUserCircle' },
        { id: 9, name: 'Arjun Reddy', image: 'FaUserAstronaut' },
        { id: 10, name: 'Divya Iyer', image: 'FaUserNinja' },
        { id: 11, name: 'Siddharth Rao', image: 'FaUserSecret' },
        { id: 12, name: 'Ishita Banerjee', image: 'FaUserTie' },
        { id: 13, name: 'Rahul Verma', image: 'FaUser' },
        { id: 14, name: 'Pooja Nair', image: 'FaUserCircle' },
        { id: 15, name: 'Aditya Joshi', image: 'FaUserAstronaut' },
        { id: 16, name: 'Shreya Menon', image: 'FaUserNinja' },
        { id: 17, name: 'Kunal Shah', image: 'FaUserSecret' },
        { id: 18, name: 'Tanya Agarwal', image: 'FaUserTie' },
        { id: 19, name: 'Nikhil Kumar', image: 'FaUser' },
        { id: 20, name: 'Riya Chatterjee', image: 'FaUserCircle' },
        { id: 21, name: 'Amitabh Roy', image: 'FaUserAstronaut' },
        { id: 22, name: 'Meera Thakur', image: 'FaUserNinja' },
        { id: 23, name: 'Suresh Pillai', image: 'FaUserSecret' },
        { id: 24, name: 'Lakshmi Das', image: 'FaUserTie' },
        { id: 25, name: 'Harish Yadav', image: 'FaUser' },
        { id: 26, name: 'Anita Bose', image: 'FaUserCircle' },
        { id: 27, name: 'Vivek Pandey', image: 'FaUserAstronaut' },
    ]);

    const [sortedPlayers, setSortedPlayers] = useState([]);

    useEffect(() => {
        // Assign random scores
        const playersWithScores = playerInfo.map(player => ({
            ...player,
            score: Math.floor(Math.random() * 101) // 0–100
        }));

        // Sort by score (desc)
        playersWithScores.sort((a, b) => b.score - a.score);

        setSortedPlayers(playersWithScores);
    }, [playerInfo]);

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

    if (sortedPlayers.length === 0) return null;

    // top 3
    const [first, second, third] = sortedPlayers;

    // remaining list
    const rest = sortedPlayers.slice(3);

    return (
        <div className="min-h-screen bg-black text-white">
            <main className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-5xl font-bold text-purple-600 text-center mb-12">
                    Leaderboard
                </h1>

                {/* 🥇🥈🥉 TOP 3 PODIUM */}
                <div className="flex justify-center items-end gap-10 mt-10 mb-16">

                    {/* 🥈 2nd Place */}
                    <div className="flex flex-col items-center">
                        {getIconComponent(second.image)}
                        <p className="text-lg mt-2 text-purple-600">{second.name}</p>
                        <div className="w-28 h-32 bg-[#C0C0C0] rounded-t-xl mt-3 flex items-center justify-center text-purple-600 text-3xl font-bold">
                            2
                        </div>
                        <p className="text-xl font-semibold text-yellow-400">{second.score} pts</p>
                    </div>

                    {/* 🥇 1st Place */}
                    <div className="flex flex-col items-center">
                        {getIconComponent(first.image)}
                        <p className="text-lg mt-2 text-purple-600">{first.name}</p>
                        <div className="w-32 h-40 bg-[#FFD700] rounded-t-xl mt-3 flex items-center justify-center text-purple-600 text-4xl font-bold">
                            1
                        </div>
                        <p className="text-xl font-semibold text-yellow-400">{first.score} pts</p>
                    </div>

                    {/* 🥉 3rd Place */}
                    <div className="flex flex-col items-center">
                        {getIconComponent(third.image)}
                        <p className="text-lg mt-2 text-purple-600">{third.name}</p>
                        <div className="w-28 h-28 bg-[#CD7F32] rounded-t-xl mt-3 flex items-center justify-center text-purple-600 text-3xl font-bold">
                            3
                        </div>
                        <p className="text-xl font-semibold text-yellow-400">{third.score} pts</p>
                    </div>

                </div>

                {/* 📜 Remaining Players List */}
                <div className="bg-gray-900 max-w-3xl mx-auto rounded-lg overflow-hidden shadow-xl">
                    {rest.map((player, index) => (
                        <div
                            key={player.id}
                            className="flex items-center justify-between px-6 py-4 border-b border-gray-800"
                        >
                            

                            {/* Icon + Name */}
                            <div className="flex items-center gap-3 w-60">
                                {/* Rank */}
                            <p className="text-3xl font-bold text-purple-500 w-10 mr-4">
                                #{index + 4}
                            </p>
                                {getIconComponent(player.image, "text-3xl text-purple-600")}
                                <p className="text-lg">{player.name}</p>
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
