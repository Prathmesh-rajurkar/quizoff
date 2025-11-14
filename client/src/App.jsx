import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

const router = createBrowserRouter([
  { path:'/', element: <Home /> },
  { path: "login", element:<LoginPage/>  },
  { path: "register", element:<RegisterPage/>  },
  // { path: "contact", element: <Contact /> },
]);

export default function App() {
  return <RouterProvider router={router}/>;
}
