import { useParams } from "react-router-dom";
import { QUERY_GOAL } from '../utils/queries';
import { formatDate } from '../utils/date';
import { useQuery } from "@apollo/client/react";

const GoalTaskWidget = () => {

  const { id } = useParams();

  const { loading, error, data } = useQuery(QUERY_GOAL,  {
    variables: { id }
  });
  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data?.goal ?? {};

  console.log(data)

return (
<div className="flex flex-col border rounded-xl p-4">
  {/* Header row */}
  <div className="flex font-semibold border-b pb-2 mb-2">
    <div className="w-1/4">Task</div>
    <div className="w-1/4">Description</div>
    <div className="w-1/6">Due Date</div>
    <div className="w-1/6">Priority</div>
    <div className="w-1/6">Status</div>
  </div>

  {/* Task rows */}
  {goal.tasks?.map(task => (
    <div
      key={task._id}
      className="flex gap-2 items-center border-b last:border-b-0 p-2"
    >
      <div className="w-1/4">{task.title}</div>
      <div className="w-1/4">{task.description}</div>
      <div className="w-1/6">
        {task.due_date ? formatDate(task.due_date) : ""}
      </div>
      <div className="w-1/6">{task.priority}</div>
      <div className="w-1/6">{task.completed ? "Done" : "Active"}</div>
    </div>
  ))}
</div>
)}

export default GoalTaskWidget;