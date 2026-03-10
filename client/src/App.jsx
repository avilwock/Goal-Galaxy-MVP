import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GoalsList from './components/GoalsList';
// import TestGoal from './components/TestGoal';
import GoalPage from './pages/GoalPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<GoalsList />} />
      <Route path="/goal/:id" element={<GoalPage />}/>
    </Routes>
  );
}

export default App;