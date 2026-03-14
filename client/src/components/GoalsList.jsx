import { useQuery } from '@apollo/client/react';
import { QUERY_GOALS } from '../utils/queries';
import { useNavigate } from 'react-router-dom';
import GoalIcon from '../components/GoalIcon';
import StatusIcon from '../components/StatusIcon';
import ProgressBar from '../components/ProgressBar';

const GoalsList = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(QUERY_GOALS);

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-6xl m-8 place-self-center">Goals</h1>

      <div className="flex flex-wrap gap-6">
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