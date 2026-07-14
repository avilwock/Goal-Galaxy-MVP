import React, {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import GoalsList from './components/GoalsList';
// import TestGoal from './components/TestGoal';
import GoalPage from './pages/GoalPage'
import Header from './components/Header'
import Login from "./components/Login"
import Signup from "./pages/Signup"
import TasksWidget from "./components/TasksWidget"


function App() {

  const [, setUser] = useState(null);
  return (
    <>
    <Header setUser={setUser} />
    <Routes>
      <Route path="/" element={<GoalsList />} />
      <Route path ="/login" element={<Login />}/>
      <Route path ="/signup" element={<Signup />}/>
      <Route path ="/tasks" element={<TasksWidget />}/>
      <Route path="/goal/:id" element={<GoalPage />} />
    </Routes>
    </>
  );
}

export default App;