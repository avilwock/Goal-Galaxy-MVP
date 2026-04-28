import { useParams } from "react-router-dom";
import { QUERY_TASKS } from "../utils/queries";
import { formatDate } from "../utils/date";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import AddTaskForm from "./AddTask.jsx";
import { DELETE_TASK } from "../utils/mutations.js";

const TaskWidget = () => {
  const { id } = useParams();
  const [showTask, setShowTask] = useState(false);

  const { loading, error, data } = useQuery(QUERY_TASKS, {
    variables: { id },
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: QUERY_TASKS, variables: { id } }],
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

  const tasks = data?.tasks || [];

  return (
    <div className="flex flex-col border rounded-xl p-4">
      <div className="mb-4">
        <button
          onClick={() => setShowTask(true)}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>

      {showTask && <AddTaskForm setShowForm={setShowTask} />}

      {/* Header */}
      <div className="flex font-semibold border-b pb-2 mb-2">
        <div className="flex-1">Task</div>
        <div className="flex-1">Description</div>
        <div className="flex-1">Due Date</div>
        <div className="flex-1">Priority</div>
        <div className="flex-1">Status</div>
        <div className="w-12"></div>
      </div>

      {/* Rows */}
      {tasks.map((task) => (
        <div
          key={task._id}
          className="flex items-center border-b last:border-b-0 p-2"
        >
          <div className="flex-1">{task.title}</div>
          <div className="flex-1">{task.description}</div>
          <div className="flex-1">
            {task.due_date ? formatDate(task.due_date) : ""}
          </div>
          <div className="flex-1">{task.priority}</div>
          <div className="flex-1">
            {task.completed ? "Done" : "Active"}
          </div>

          <div className="w-12 flex justify-end">
            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskWidget;