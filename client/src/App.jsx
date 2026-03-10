// import React, { useState } from 'react';
import TestGoal from './components/TestGoal';

function App() {
  const testGoalId = '69a8f056ad9314780b8d40e0';

  return (
    <div className="App">
      <h1>Goal Test</h1>
      <TestGoal goalId={testGoalId} />
    </div>
  );
}

export default App;