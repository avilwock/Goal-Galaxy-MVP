import { useParams } from "react-router-dom";
import { QUERY_GOAL } from '../utils/queries';
import { formatDate } from '../utils/date';
import { useQuery } from "@apollo/client/react";


const MilestoneWidget = () => {

  const { id } = useParams();

  const { loading, error, data } = useQuery(QUERY_GOAL,  {
    variables: { id }
  });

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data?.goal ?? {};

return (
    <div className = 'flex flex-wrap gap-1 border rounded-xl p-8'>
        {goal.milestones?.map(milestone => (
          <div key={milestone._id}>
            {milestone.title}
            {milestone.description}
            <p>Target Date: {formatDate(milestone.target_date)}</p>
            {formatDate(milestone.completed)}
            {milestone.order}
          </div>
        ))}
    </div>
)}

export default MilestoneWidget;
