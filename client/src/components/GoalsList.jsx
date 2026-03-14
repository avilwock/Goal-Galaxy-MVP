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
      <h1>Goals</h1>

      <div className="flex gap-4">
        {data.goals.map((goal) => {
          return (
            <button
              key={goal._id}
              onClick={() => navigate(`/goal/${goal._id}`)}
              className="flex flex-col p-4 border rounded-lg w-48"
            >

              {/* top row */}
              <div className="flex justify-between items-start w-full">
                <GoalIcon
                  name={goal.icon}
                  size="medium"
                  color={goal.icon_color}
                />

                <StatusIcon status={goal.status} />
              </div>

              {/* title */}
              <div className="text-center text-lg font-medium mt-2">
                {goal.goal_name || 'No Name'}
              </div>

              {/* progress */}
              <div className="mt-4 w-full">
                <ProgressBar milestones={goal.milestones} />
              </div>

            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsList;