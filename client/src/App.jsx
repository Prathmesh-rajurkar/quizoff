import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Quiz from './components/Quiz';
import Join from './components/Join';
import Leaderboard from './components/Leaderboard';
import Create from './components/Create';
import Dashboard from './components/Dashboard';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Library from './components/Library';
import Sessions from './components/Sessions';
import Pricing from './components/Pricing';

const router = createBrowserRouter([
  { path:'/', element: <Home /> },
  { path: "login", element:<LoginPage/>  },
  { path: "register", element:<RegisterPage/>  },
  { path: "join", element: <Join /> },
  { path: "create", element: <Create />},
  { path: "dashboard", element: <Dashboard />},
  { path: "dashboard/library", element: <Library/>},
  { path: "dashboard/sessions", element: <Sessions/>},
  { path: "pricing", element: <Pricing/>},
  { path: "quiz/:id", element: <Quiz /> },
  { path: "quiz/:id/leaderboard", element: <Leaderboard /> },
]);

export default function App() {
  return (
    <>
      {/* Toast Container must be rendered here */}
      <ToastContainer 
        position="top-right"
        theme="colored"
        autoClose={2000}
      />

      <RouterProvider router={router} />
    </>
  );
}
