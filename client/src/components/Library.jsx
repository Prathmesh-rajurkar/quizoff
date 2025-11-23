import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { quizAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const Library = () => {
  const [open, setOpen] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const response = await quizAPI.getLibrary();
        if (response.success) {
          setQuizzes(response.quizzes || []);
        }
      } catch (error) {
        toast.error("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [isAuthenticated, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      const response = await quizAPI.delete(id);
      if (response.success) {
        toast.success("Quiz deleted successfully");
        setQuizzes(quizzes.filter(q => q._id !== id));
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete quiz");
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
        <h1 className="text-2xl text-center mb-5">My Quiz Library</h1>
        
        <div className="flex items-center justify-end px-3 mb-5">
          <button 
            onClick={() => navigate("/create")}
            className="px-3 py-2 bg-green-600 rounded font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Create New Quiz
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : quizzes.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-400 text-xl mb-5">No quizzes yet. Create your first quiz!</p>
            <button 
              onClick={() => navigate("/create")}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-[#2D0041] border border-purple-700 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-purple-300">{quiz.title}</h2>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
                <p className="text-gray-400 mb-2">Code: <span className="text-purple-400 font-mono">{quiz.code}</span></p>
                <p className="text-gray-400 mb-4">Questions: {quiz.questions?.length || 0}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => navigate(`/quiz/${quiz.code}`)}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 rounded-lg py-2 transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;