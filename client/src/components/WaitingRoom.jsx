import React, { useState } from 'react';
import { FaUser, FaUserCircle, FaUserAstronaut, FaUserNinja, FaUserSecret, FaUserTie } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const WaitingRoom = ({ onStartQuiz }) => {
    const [isAdmin, setIsAdmin] = useState(true);
    const [scheduleTime, setScheduleTime] = useState(15);
    const [countdown, setCountdown] = useState(null);
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
    const [playersJoined, setPlayersJoined] = useState(playerInfo.length || 0);
    function handleStart(time) {

        // If time is 0 → Start Now
        if (time === 0) {
            onStartQuiz(true);
            return;
        }

        // Start countdown
        setCountdown(time);

        // Interval for reverse counting
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev === 1) {
                    clearInterval(interval);
                }
                return prev - 1;
            });
        }, 1000);

        // Timeout to trigger quiz start AT the end
        setTimeout(() => {
            onStartQuiz(true);
        }, time * 1000);
    }


    return (
        <div className="min-h-screen bg-[#20002c] text-white box-border flex flex-col justify-between">

            <main className="max-w-6xl mx-auto py-10">
                <div className="text-center">
                    <h1 className="text-6xl font-semibold my-10 text-purple-600">Waiting Room</h1>

                    {/* Players Joined */}
                    <p className="text-2xl mb-4">Players Joined: {playersJoined}</p>

                    {/* Player Info */}

                    {/* Admin or Non-Admin Action */}
                    <div className="mt-10">
                        {isAdmin ? (
                            <div className='flex gap-3 items-center justify-center'>
                                <button
                                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                    onClick={() => handleStart(0)}
                                >
                                    Start Now
                                </button>

                                {/* Schedule Dropdown */}
                                <select
                                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg cursor-pointer"
                                    value={scheduleTime}
                                    onChange={(e) => setScheduleTime(Number(e.target.value))}
                                >
                                    <option value={15}>15 sec</option>
                                    <option value={30}>30 sec</option>
                                    <option value={60}>1 min</option>
                                </select>

                                {/* Schedule Button */}
                                <button
                                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                    onClick={() => handleStart(scheduleTime)}
                                >
                                    Schedule
                                </button>
                            </div>


                        ) : (
                            <p className="text-sm text-gray-400">Waiting for Admin to Start...</p>
                        )}
                    </div>
                    {countdown !== null && countdown > 0 && (
                        <p className="text-yellow-400 text-xl font-semibold mb-4">
                            Quiz starting in: {countdown}s
                        </p>
                    )}

                </div>

                <div className="mt-10 flex flex-wrap items-center justify-around gap-x-5 gap-y-2 max-w-8xl mx-auto">
                    {playerInfo.map((player) => (
                        <div
                            key={player.id}
                            className="flex items-center justify-between gap-1 m-2 border py-1 px-2 rounded-2xl"
                        >
                            {getIconComponent(player.image)}
                            <p className="text-lg">{player.name}</p>
                        </div>
                    ))}
                </div>

            </main>

        </div>
    );
};

const getIconComponent = (iconName) => {
    const iconMap = {
        FaUser: <FaUser className="text-purple-700" />,
        FaUserCircle: <FaUserCircle className="text-purple-700" />,
        FaUserAstronaut: <FaUserAstronaut className="text-purple-700" />,
        FaUserNinja: <FaUserNinja className="text-purple-700" />,
        FaUserSecret: <FaUserSecret className="text-purple-700" />,
        FaUserTie: <FaUserTie className="text-purple-700" />,
    };
    // Randomly select an icon if not explicitly set or to add variety
    const randomIcon = Object.keys(iconMap)[Math.floor(Math.random() * Object.keys(iconMap).length)];
    return iconMap[iconName] || iconMap[randomIcon];
};
export default WaitingRoom;