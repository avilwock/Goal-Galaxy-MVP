import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { EDIT_TASK } from '../utils/mutations';

const EditTaskForm = ({ task, setShowForm }) => {

  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.due_date?.slice(0, 10) || '');
  const [dueTime, setDueTime] = useState(task.due_time || '');
  const [priority, setPriority] = useState(task.priority || '');
  const [recurrence, setRecurrence] = useState(task.recurrence || '');
  const [recurrenceDays, setRecurrenceDays] = useState(task.recurrence_days || '');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(task.recurrence_end_date?.slice(0, 10) || '');
  const [completed, setCompleted] = useState(task.completed || false);

  const [editTask] = useMutation(EDIT_TASK);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await editTask({
        variables: {
          id: task._id,
          TaskInput: {
            title,
            description,
            due_date: dueDate || null,
            due_time: dueTime || null,
            priority: priority || null,
            recurrence: recurrence || null,
            recurrence_days: recurrenceDays ? parseInt(recurrenceDays) : null,
            recurrence_end_date: recurrenceEndDate || null,
            completed,
            goal_id: task.goal_id || null,
            milestone_id: task.milestone_id || null
          }
        }
      });

      setShowForm(false);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded shadow-md max-w-md mx-auto my-4 relative"
    >

      <button
        type="button"
        onClick={() => setShowForm(false)}
        className="absolute top-2 right-3 text-white text-xl"
      >
        ×
      </button>

      <h2 className="text-xl font-bold mb-4 text-center text-white">
        Edit Task
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      >
        <option value="">Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={recurrence}
        onChange={(e) => setRecurrence(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      >
        <option value="">No Recurrence</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      <input
        type="number"
        value={recurrenceDays}
        onChange={(e) => setRecurrenceDays(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        type="date"
        value={recurrenceEndDate}
        onChange={(e) => setRecurrenceEndDate(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <label className="flex items-center gap-2 mb-3 text-white">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Save Changes
      </button>

    </form>
  );
};

export default EditTaskForm;