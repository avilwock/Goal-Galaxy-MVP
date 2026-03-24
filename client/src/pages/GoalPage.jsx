import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { QUERY_GOAL } from "../utils/queries";
import GoalIcon from '../components/GoalIcon'
import { formatDate } from '../utils/date';
import StatusIcon from '../components/StatusIcon';
import ProgressBar from '../components/ProgressBar';
import TaskWidget from "../components/TasksWidget";
import MilestoneWidget from "../components/MilestoneWidget";

const GoalPage = () => {
  const { id } = useParams();

  const { loading, error, data } = useQuery(QUERY_GOAL,  {
    variables: { id }
  });

  console.log("Query data:", data);

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data.goal;

  return (
    <div className = "place-self-center">
      <div  className = "place-self-center">
        <div className="flex items-start justify-between w-full m-5">
          <GoalIcon
            name={goal.icon}
            size="xlarge"
            color={goal.icon_color}
          />
        <div className = 'm-5'>
          <StatusIcon status={goal.status} />
        </div>
        </div>
        <h2 className = "text-9xl flex gap-4 place-self-center mb-4">{goal.goal_name}</h2>
        <div className = "flex flex-wrap gap-1 border rounded-xl w-6xl p-8">
          <p>Description: {goal.description}</p>
          <p>Target Date: {formatDate(goal.target_date)}</p>
          <div className="flex flex-col mt-2">
          <ProgressBar milestones={goal.milestones} />
          <div className="text-xs text-gray-400 mt-1"></div>
          </div>
        </div>
      </div>
    <div className = 'flex gap-6'>
        <TaskWidget />
        <MilestoneWidget />
    </div>
    </div>
  );
};
export default GoalPage;