import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DashBoard from './components/DashBoard/DashBoard';
import GraphsPanel from './components/GraphsPanel/GraphsPanel';
import Login from './components/Login';
import Home from "./components/Home"
import Signup from "./components/Signup"
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <div >
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="dashboard" element={<DashBoard/>} />
          <Route path="graphsPanel" element={<GraphsPanel />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


