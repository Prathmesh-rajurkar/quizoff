import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { userAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Sessions = () => {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchSessions = async () => {
      try {
        const response = await userAPI.getSessions();
        if (response.success) {
          setSessions(response.sessions || []);
        }
      } catch (error) {
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [isAuthenticated, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'finished':
        return 'text-gray-400';
      case 'waiting':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex relative bg-[#20002c] text-white min-h-screen">
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-md"
        onClick={() => setOpen(true)}
      >
        <Menu size={26} />
      </button>

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl text-center mb-5">Quiz Sessions</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : sessions.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-400 text-xl">No sessions yet. Create a quiz to start a session!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-[#2D0041] border border-purple-700 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-purple-300 mb-2">{session.quizTitle}</h2>
                    <p className="text-gray-400">Code: <span className="text-purple-400 font-mono">{session.code}</span></p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Participants</p>
                    <p className="text-white">{session.participantsCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="text-white">{new Date(session.createdAt).toLocaleDateString()}</p>
                  </div>
                  {session.startedAt && (
                    <div>
                      <p className="text-gray-500">Started</p>
                      <p className="text-white">{new Date(session.startedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  {session.finishedAt && (
                    <div>
                      <p className="text-gray-500">Finished</p>
                      <p className="text-white">{new Date(session.finishedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                {session.status === 'finished' && (
                  <button
                    onClick={() => navigate(`/quiz/${session.code}/leaderboard`)}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 rounded-lg py-2 px-4 transition-colors"
                  >
                    View Leaderboard
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sessions;