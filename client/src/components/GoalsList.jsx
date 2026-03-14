import { useQuery } from '@apollo/client/react';
import { useState} from 'react'
import { QUERY_GOALS } from '../utils/queries';
import { useNavigate } from 'react-router-dom';
import GoalIcon from '../components/GoalIcon';
import StatusIcon from '../components/StatusIcon';
import ProgressBar from '../components/ProgressBar';
import AddGoal from './AddGoal'

const GoalsList = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const { loading, error, data } = useQuery(QUERY_GOALS);

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-6xl m-8 place-self-center">Goals</h1>

      <div className="flex flex-wrap gap-6">
        Add Goal button
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        {showForm ? 'Cancel' : 'Add New Goal'}
      </button>

      {/* Form appears when showForm is true */}
      {showForm && <AddGoal/>}

      {/* Your existing goals list rendering */}
      <div className="mt-4">
        {/* Example: */}
        {/* {goals.map(goal => <GoalCard key={goal._id} goal={goal} />)} */}
      </div>
        {data.goals.map((goal) => {
          return (
            <button
              key={goal._id}
              onClick={() => navigate(`/goal/${goal._id}`)}
              className="flex flex-col justify-between p-4 border rounded-lg w-64 bg-gray-900 text-white"
            >

              {/* Top row: icon + status */}
              <div className="flex justify-between items-start">
                <div className="p-2 bg-gray-950 rounded">
                  <GoalIcon name={goal.icon} size="medium" color={goal.icon_color} />
                </div>
                <StatusIcon status={goal.status} />
              </div>

              {/* Title row */}
              <div className="text-left font-semibold text-lg mb-18 place-self-center top-">
                {goal.goal_name || 'No Name'}
              </div>

              {/* Progress bar row */}
              <div className="flex flex-col">
                <div className="w-full mb-1"></div>
                <ProgressBar milestones={goal.milestones} />
                {/* Optional: metadata like "0/1 tasks" */}
                <div className="text-xs text-gray-400 mt-1">0/0 tasks</div>
              </div>

            </button> 
          );
        })}
      </div>
    </div>
  );
};

export default GoalsList;