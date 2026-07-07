import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GoalsList from './components/GoalsList';
// import TestGoal from './components/TestGoal';
import GoalPage from './pages/GoalPage'
import Header from './components/Header'
import Login from "./components/Login"
import Signup from "./pages/Signup"
import TasksWidget from "./components/TasksWidget"
import Goals from "./pages/GoalPage"

function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<GoalsList />} />
      <Route path="/goal/:id" element={<GoalPage />}/>
      <Route path ="/login" element={<Login />}/>
      <Route path ="/signup" element={<Signup />}/>
      <Route path ="/tasks" element={<TasksWidget />}/>
      <Route path ="/goals" element={<Goals />}/>
    </Routes>
    </>
  );
}

export default App;