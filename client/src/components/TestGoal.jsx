// src/components/TestGoal.jsx
import React, { useEffect, useState } from 'react';
import client from '../graphqlClient';
import { QUERY_GOAL } from '../utils/queries';

const TestGoal = ({ goalId }) => {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.request(QUERY_GOAL, { id: goalId })
      .then((data) => {
        setGoal(data.goal);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [goalId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!goal) return <p>No goal found</p>;

  return (
    <div>
      <h2>{goal.goal_name}</h2>
      <p>{goal.description}</p>
      <p>Status: {goal.status}</p>
      <p>Progress: {goal.progress}</p>

      <h3>Milestones</h3>
      {goal.milestones?.map((ms) => (
        <div key={ms._id}>
          <strong>{ms.title}</strong> - {ms.completed ? 'Done' : 'Pending'}
          <ul>
            {ms.tasks?.map((task) => (
              <li key={task._id}>{task.title} - {task.completed ? 'Done' : 'Pending'}</li>
            ))}
          </ul>
        </div>
      ))}

      <h3>Tasks</h3>
      {goal.tasks?.map((task) => (
        <div key={task._id}>
          {task.title} - {task.completed ? 'Done' : 'Pending'}
        </div>
      ))}
    </div>
  );
};

export default TestGoal;