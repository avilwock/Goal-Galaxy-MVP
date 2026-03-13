import { useQuery } from '@apollo/client/react';
import { QUERY_GOALS } from '../utils/queries';
import { useNavigate } from 'react-router-dom';
import GoalIcon from '../components/GoalIcon';
import StatusIcon from '../components/StatusIcon';
import ProgressBar from '../components/ProgressBar'

// Frontend mapping: backend strings → Lucide components


const GoalsList = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(QUERY_GOALS);

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Goals</h1>

      {data.goals.map((goal) => {
        // Normalize backend string
        
        return (
                
          <button
            key={goal._id}
            onClick={() => navigate(`/goal/${goal._id}`)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}
          >
            <GoalIcon
            name = {goal.icon}
            size="medium"
            color={goal.icon_color}
            >
            
          </GoalIcon>
          
          <p>Status: <StatusIcon status={goal.status} />
            </p>
            {goal.goal_name || 'No Name'}
          
          <ProgressBar milestones = {goal.milestones}/>
           <div className="flex items-center justify-center min-h-screen bg-gray-800">
    </div>
          
          </button>
        );
      })}
    </div>
  );
};

export default GoalsList;