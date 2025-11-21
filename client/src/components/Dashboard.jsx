import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
const pastQuizs = [{
  id: 1,
  title: "Sample Quiz 1",
  date: "2024-06-01",
  participants: 25,

}, {
  id: 2,
  title: "Sample Quiz 2",
  date: "2024-06-05",
  participants: 30,
}]
const Dashboard = () => {
  const [open, setOpen] = useState(false);

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
            Past Quizzes
          </h3>

          <div className="my-10">
            <div className="flex items-center justify-end px-3">
              <button className="px-3 py-2 bg-green-600 mb-3 rounded font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200">Create Quiz</button>
            </div>
            {pastQuizs.map((quiz) => (
              <div key={quiz.id} className="flex items-center bg-white text-purple-600 justify-between px-3 py-2 border border-gray-200/50 m-3 rounded-lg">
                <p>Date: {quiz.date}</p>
                <h2 className="text-lg font-semibold">{quiz.title}</h2>
                <p>Participants: {quiz.participants}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
