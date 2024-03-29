import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

// axios.defaults.baseURL = "https://netflix-clone-thtc.onrender.com"
// axios.defaults.baseURL = "http://localhost:5000"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
  </Router>
);

