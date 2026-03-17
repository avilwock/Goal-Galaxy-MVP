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
    <div className="m-8 max-w-5xl mx-auto">
  {/* Title */}
  <h1 className="text-6xl font-bold mb-4 text-center">Goals</h1>

  {/* Add Goal button, offset from right */}
  <div className="flex justify-center mb-6"> {/* pr-16 pushes it in from the right ~10-15% */}
    <button
      onClick={() => setShowForm(true)}
      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
    >
      Add New Goal
    </button>
  </div>

  {/* Goals grid */}
  <div className="flex flex-wrap justify-center gap-6">
    {data.goals.map((goal) => (
      <button
        key={goal._id}
        onClick={() => navigate(`/goal/${goal._id}`)}
        className="flex flex-col justify-between p-4 border rounded-lg w-64 bg-gray-900 text-white"
      >
        <div className="flex justify-between items-start">
          <div className="p-2 bg-gray-950 rounded">
            <GoalIcon name={goal.icon} size="medium" color={goal.icon_color} />
          </div>
          <StatusIcon status={goal.status} />
        </div>
        <div className="text-center font-semibold text-lg mt-2 mb-18">
          {goal.goal_name || 'No Name'}
        </div>
        <div className="flex flex-col mt-2">
          <ProgressBar milestones={goal.milestones} />
          <div className="text-xs text-gray-400 mt-1">0/0 tasks</div>
        </div>
      </button>
    ))}
  </div>

  {/* Modal overlay */}
  {showForm && (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative bg-gray-100 p-6 rounded shadow-md max-w-md w-full">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="absolute top-2 right-2 text-gray-600 text-xl font-bold"
          >
            ✕
          </button>
          <AddGoal setShowForm={setShowForm} />
        </div>
      </div>
    </>
  )}
</div>
  );
};

export default GoalsList;