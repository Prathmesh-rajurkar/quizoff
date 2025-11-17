import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Quiz from './components/Quiz';
import Join from './components/Join';
import Leaderboard from './components/Leaderboard';

const router = createBrowserRouter([
  { path:'/', element: <Home /> },
  { path: "login", element:<LoginPage/>  },
  { path: "register", element:<RegisterPage/>  },
  { path: "join", element: <Join /> },
  { path: "quiz/:id", element: <Quiz /> },
  { path: "quiz/:id/leaderboard", element: <Leaderboard /> },

]);

export default function App() {
  return <RouterProvider router={router}/>;
}
