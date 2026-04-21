import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_TASK } from '../utils/mutations';

const AddTaskForm = ({ setShowForm, goalContextId = null, milestoneContextId = null }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [priority, setPriority] = useState('');
    const [recurrence, setRecurrence] = useState('');
    const [recurrenceDays, setRecurrenceDays] = useState('');
    const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
    const [completed, setCompleted] = useState(false);

    const [addTask] = useMutation(ADD_TASK);

    // SINGLE SOURCE OF TRUTH
    const goal_id = goalContextId || milestoneContextId || null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !goal_id) {
            console.error("Missing title or goal context");
            return;
        }

        await addTask({
            variables: {
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
                    goal_id: goalContextId || null,
                    milestone_id: milestoneContextId || null
                }
            },
            refetchQueries: ["goal"]
        });

        setTitle('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        setPriority('');
        setRecurrence('');
        setRecurrenceDays('');
        setRecurrenceEndDate('');
        setCompleted(false);

        setShowForm(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md max-w-md mx-auto my-4 relative">

            <button
                type="button"
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-gray-400"
            >
                X
            </button>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full mb-2 p-2 border rounded"
            />

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
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
                placeholder="Recurrence Days"
                className="w-full mb-2 p-2 border rounded"
            />

            <input
                type="date"
                value={recurrenceEndDate}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
            />

            <label className="flex items-center gap-2 mb-2">
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
                Add Task
            </button>
        </form>
    );
};

export default AddTaskForm;