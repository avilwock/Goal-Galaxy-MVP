import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { QUERY_GOAL } from "../utils/queries";
import GoalIcon from '../components/GoalIcon'
import { formatDate } from '../utils/date';
import StatusIcon from '../components/StatusIcon';
import ProgressBar from '../components/ProgressBar';

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
      <div className = "flex items-start gap-4 place-self-start absolute top-0 left-120">
        <GoalIcon
            name = {goal.icon}
            size="xlarge"
            color={goal.icon_color}
            >
        </GoalIcon>
        <div className = "ml-auto m-4">
        <StatusIcon status={goal.status} />
        </div>
      </div>
        <h2 className = "text-9xl flex gap-4 place-self-center mb-4">{goal.goal_name}</h2>
        <div className = "flex flex-col gap-1 border rounded-xl w-3xl p-8">
          <p>Description: {goal.description}</p>
          <p>Target Date: {formatDate(goal.target_date)}</p>
          <div className="flex flex-col mt-2">
          <ProgressBar milestones={goal.milestones} />
          <div className="text-xs text-gray-400 mt-1"></div>
          </div>
        </div>
      </div>
      <div style= {{border: '2px solid black'}}>
      {goal.tasks?.map(task => (
        <div key={task._id}>
          {task.title}
          {task.description}
          {formatDate(task.due_date)}
          {task.due_time}
          {task.priority}
          {task.recurrence}
          {task.recurrence_days}
          {task.recurrence_end_date}
          {task.completed}
        </div>    
      ))}
      </div>
        <div style ={{border: '2px solid black'}}>
        {goal.milestones?.map(milestone => (
          <div key={milestone._id}>
            {milestone.title}
            {milestone.description}
            {milestone.target_date}
            <p>Target Date: {formatDate(milestone.target_date)}</p>
            {formatDate(milestone.completed)}
            {milestone.order}
          </div>
        ))}
    </div>
    </div>
  );
};
export default GoalPage;