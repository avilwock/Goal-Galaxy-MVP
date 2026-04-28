import { useParams } from "react-router-dom";
import { QUERY_GOAL } from "../utils/queries";
import { formatDate } from "../utils/date";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import EditTaskForm from "./EditTask";
import { DELETE_TASK } from "../utils/mutations";
import { Trash2 } from "lucide-react";

const GoalTaskWidget = () => {
  const { id } = useParams();

  const { loading, error, data } = useQuery(QUERY_GOAL, {
    variables: { id },
  });

  const [editingTask, setEditingTask] = useState(null);

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: QUERY_GOAL, variables: { id } }],
  });

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTask({
        variables: { id: taskId },
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data?.goal ?? {};

  return (
    <div className="flex flex-col border rounded-xl p-4 relative">

      {/* HEADER */}
      <div className="flex font-semibold border-b pb-2 mb-2">
        <div className="w-1/4">Task</div>
        <div className="w-1/4">Description</div>
        <div className="w-1/6">Due Date</div>
        <div className="w-1/6">Priority</div>
        <div className="w-1/6">Status</div>
        <div className="w-12"></div>
      </div>

      {/* TASK ROWS */}
      {goal.tasks?.map((task) => (
        <div
          key={task._id}
          className="flex items-center border-b last:border-b-0 p-2 group"
        >
          <div className="w-1/4">{task.title}</div>
          <div className="w-1/4">{task.description}</div>
          <div className="w-1/6">
            {task.due_date ? formatDate(task.due_date) : ""}
          </div>
          <div className="w-1/6">{task.priority}</div>
          <div className="w-1/6">
            {task.completed ? "Done" : "Active"}
          </div>

          {/* ACTIONS */}
          <div className="w-12 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
            
            {/* EDIT */}
            <button
              onClick={() => setEditingTask(task)}
              className="text-gray-400 hover:text-black"
              title="Edit Task"
            >
              ✎
            </button>

            {/* DELETE */}
            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-500 hover:text-red-700"
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>

          </div>
        </div>
      ))}

      {/* EDIT MODAL */}
      {editingTask && (
        <EditTaskForm
          task={editingTask}
          setShowForm={() => setEditingTask(null)}
        />
      )}

    </div>
  );
};

export default GoalTaskWidget;