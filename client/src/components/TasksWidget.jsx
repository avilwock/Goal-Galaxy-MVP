import { useParams } from "react-router-dom";
import { QUERY_GOAL } from '../utils/queries';
import { formatDate } from '../utils/date';
import { useQuery } from "@apollo/client/react";

const TaskWidget = () => {

  const { id } = useParams();

  const { loading, error, data } = useQuery(QUERY_GOAL,  {
    variables: { id }
  });

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data?.goal ?? {};

return (
<div className ='flex flex-wrap gap-1 border rounded-xl p-8 m-4'>
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
)}

export default TaskWidget;