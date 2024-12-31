import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LaunchList from './components/LaunchList';
import LaunchDetail from './components/LaunchDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Space Launch Calendar</h1>
        <Routes>
          <Route path="/" element={<LaunchList />} />
          <Route path="/launch/:id" element={<LaunchDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;