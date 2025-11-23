import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { userAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Dashboard = () => {
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
        <h1 className="text-2xl text-center">
          Dashboard
        </h1>
        <div className="mt-5">
          <h3 className="text-xl underline-offset-4 underline decoration-dashed">
            Past Quiz Sessions
          </h3>

          <div className="my-10">
            <div className="flex items-center justify-end px-3">
              <button 
                onClick={() => navigate("/create")}
                className="px-3 py-2 bg-green-600 mb-3 rounded font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Create Quiz
              </button>
            </div>
            {loading ? (
              <p className="text-center text-gray-400">Loading...</p>
            ) : sessions.length === 0 ? (
              <p className="text-center text-gray-400">No sessions yet. Create a quiz to get started!</p>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="flex items-center bg-white text-purple-600 justify-between px-3 py-2 border border-gray-200/50 m-3 rounded-lg">
                  <p>Date: {new Date(session.createdAt).toLocaleDateString()}</p>
                  <h2 className="text-lg font-semibold">{session.quizTitle}</h2>
                  <p>Participants: {session.participantsCount}</p>
                  <p className="text-sm">Code: {session.code}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
