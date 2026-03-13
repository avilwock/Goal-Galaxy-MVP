import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { QUERY_GOAL } from "../utils/queries";
import GoalIcon from '../components/GoalIcon'
import { formatDate } from '../utils/date';

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
    <div>
      <div>
        <GoalIcon
            name = {goal.icon}
            size="large"
            color={goal.icon_color}
            >
        </GoalIcon>
        <h2>{goal.goal_name}</h2>
        <p>{goal.description}</p>
        <p>Target Date: {formatDate(goal.target_date)}</p>
        <p>Status: {goal.status}</p>
        <p>{goal.progress}</p>
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
            {formatDate(milestone.completed)}
            {milestone.order}
          </div>
        ))}
    </div>
    </div>
  );
};
export default GoalPage;