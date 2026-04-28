import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";

import { QUERY_GOAL } from "../utils/queries";
import { DELETE_TASK } from "../utils/mutations";
import { formatDate } from "../utils/date";
import EditTaskForm from "./EditTask";
import { Trash2 } from "lucide-react";

/* ---------------- TIME FORMATTER ---------------- */

const format12Hour = (time24) => {
  if (!time24) return "";

  const [h, m] = time24.split(":");
  let hour = Number(h);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${m} ${ampm}`;
};

const GoalTaskWidget = () => {
  const { id } = useParams();

  const { loading, error, data } = useQuery(QUERY_GOAL, {
    variables: { id }
  });

  const [editingTask, setEditingTask] = useState(null);

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: QUERY_GOAL, variables: { id } }]
  });

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    await deleteTask({
      variables: { id: taskId }
    });
  };

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error loading goal.</p>;

  const goal = data?.goal;

  return (
    <div className="flex flex-col border rounded-xl p-4">

      {/* HEADER */}
      <div className="flex font-semibold border-b pb-2 mb-2">
        <div className="w-1/4">Task</div>
        <div className="w-1/4">Description</div>
        <div className="w-1/6">Due Date</div>
        <div className="w-1/6">Priority</div>
        <div className="w-1/6">Status</div>
        <div className="w-1/6">Time</div>
        <div className="w-12"></div>
      </div>

      {/* TASK LIST */}
      {goal?.tasks?.map((task) => (
        <div
          key={task._id}
          className="flex items-center border-b p-2 group"
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

          <div className="w-1/6">
            {task.due_time ? format12Hour(task.due_time) : ""}
          </div>

          {/* ACTIONS */}
          <div className="w-12 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">

            <button
              onClick={() => setEditingTask(task)}
              title="Edit"
              className="text-gray-500 hover:text-black"
            >
              ✎
            </button>

            <button
              onClick={() => handleDelete(task._id)}
              title="Delete"
              className="text-red-500 hover:text-red-700"
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