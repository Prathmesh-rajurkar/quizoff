import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaUserCircle, FaUserAstronaut, FaUserNinja, FaUserSecret, FaUserTie } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createWebSocket } from '../utils/api';
import { quizAPI } from '../utils/api';

const WaitingRoom = ({ onStartQuiz }) => {
    const { id: code } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [scheduleTime, setScheduleTime] = useState(15);
    const [countdown, setCountdown] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [participantsCount, setParticipantsCount] = useState(0);
    const wsRef = useRef(null);

    const [playersJoined, setPlayersJoined] = useState(0);

    useEffect(() => {
        // Check if user is admin (creator of the quiz)
        const checkAdmin = async () => {
            try {
                const response = await quizAPI.getByCode(code);
                if (response.success && response.quiz.creator) {
                    // Check if current user is the creator
                    const userId = user?.id || localStorage.getItem('userId');
                    if (response.quiz.creator._id === userId || response.quiz.creator === userId) {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error('Error checking admin:', error);
            }
        };

        if (isAuthenticated && user) {
            checkAdmin();
        }

        // Connect to WebSocket
        const username = user?.username || 'Anonymous';
        const userId = user?.id || null;
        const ws = createWebSocket(code, userId, username);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'JOINED_QUIZ':
                    setParticipants(data.payload.participants || []);
                    setPlayersJoined(data.payload.participants?.length || 0);
                    break;
                case 'PARTICIPANT_JOINED':
                    setParticipantsCount(data.payload.participantsCount || 0);
                    setPlayersJoined(data.payload.participantsCount || 0);
                    break;
                case 'QUIZ_STARTED':
                    onStartQuiz(true);
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
    }, [code, user, isAuthenticated, onStartQuiz]);

    function handleStart(time) {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.error('WebSocket not connected');
            return;
        }

        // If time is 0 → Start Now
        if (time === 0) {
            wsRef.current.send(JSON.stringify({
                type: 'START_QUIZ',
                payload: { code }
            }));
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
            wsRef.current.send(JSON.stringify({
                type: 'START_QUIZ',
                payload: { code }
            }));
        }, time * 1000);
    }


    return (
        <div className="min-h-screen bg-[#20002c] text-white box-border flex flex-col justify-between">

            <main className="max-w-6xl mx-auto py-10">
                <div className="text-center">
                    <h1 className="text-6xl font-semibold my-10 text-purple-600">Waiting Room</h1>

                    {/* Quiz Code */}
                    <p className="text-2xl mb-2 text-purple-400">Quiz Code: {code}</p>
                    
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
                    {participants.length > 0 ? (
                        participants.map((participant, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-1 m-2 border py-1 px-2 rounded-2xl"
                            >
                                {getIconComponent(playerInfo[index % playerInfo.length]?.image || 'FaUser')}
                                <p className="text-lg">{participant.username || 'Anonymous'}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No participants yet...</p>
                    )}
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