import React from 'react';
import { BrowserRouter } from "react-router-dom";
import AuthLayout from "./layout";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AuthLayout />
      </div>
    </BrowserRouter>
  );
}

export default App;
