import { useQuery } from '@apollo/client/react';
import { QUERY_GOALS } from '../utils/queries';
import { useNavigate } from 'react-router-dom';

const GoalsList = () => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(QUERY_GOALS);

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Goals</h1>

      {data.goals.map((goal) => (
        <button
          key={goal._id}
          onClick={() => navigate(`/goal/${goal._id}`)}
        >
          {goal.goal_name}
        </button>
      ))}

    </div>
  );
};

export default GoalsList;