import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { ADD_TASK } from '../utils/mutations';
import { QUERY_GOALS, QUERY_MILESTONES, QUERY_TASKS } from '../utils/queries';

const AddTaskForm = ({
    setShowForm,
    goalContextId = null,
    milestoneContextId = null
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [priority, setPriority] = useState('');
    const [recurrence, setRecurrence] = useState('');
    const [recurrenceDays, setRecurrenceDays] = useState('');
    const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
    const [completed, setCompleted] = useState(false);

    const [goalId, setGoalId] = useState(goalContextId || '');
    const [milestoneId, setMilestoneId] = useState(milestoneContextId || '');

    const { data: goalData } = useQuery(QUERY_GOALS);
    const goals = goalData?.goals || [];

    const { data: milestoneData } = useQuery(QUERY_MILESTONES);
    const milestones = milestoneData?.milestones || [];

    const [addTask] = useMutation(ADD_TASK, {
        update(cache, { data: { addTask } }) {
            try {
                const existing = cache.readQuery({ query: QUERY_TASKS }) || { tasks: [] };

                cache.writeQuery({
                    query: QUERY_TASKS,
                    data: {
                        tasks: [addTask, ...existing.tasks]
                    }
                });
            } catch (err) {
                console.error(err);
            }
        }
    });

    const selectedMilestone = milestones.find(m => m._id === milestoneId);
    const derivedGoalId = selectedMilestone?.goalId || goalId;

    const isMilestoneLocked = !!milestoneContextId;
    const isGoalLocked = !!milestoneContextId;

    const handleGoalChange = (e) => {
        if (isGoalLocked) return;
        setGoalId(e.target.value);
        setMilestoneId('');
    };

    const handleMilestoneChange = (e) => {
        if (isMilestoneLocked) return;

        const value = e.target.value;
        setMilestoneId(value);

        const ms = milestones.find(m => m._id === value);
        if (ms?.goalId) {
            setGoalId(ms.goalId);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) return;

        try {
            await addTask({
                variables: {
                    taskInput: {
                        title,
                        description,
                        due_date: dueDate,
                        due_time: dueTime,
                        priority,
                        recurrence,
                        recurrence_days: recurrenceDays,
                        recurrence_end_date: recurrenceEndDate,
                        completed,
                        goalId: derivedGoalId || null,
                        milestoneId: milestoneId || milestoneContextId || null
                    }
                }
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

            setGoalId(goalContextId || '');
            setMilestoneId(milestoneContextId || '');

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
                className="absolute top-2 right-2 text-gray-600 text-xl"
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
                value={goalId}
                onChange={handleGoalChange}
                disabled={isGoalLocked}
                className="w-full mb-2 p-2 border rounded"
            >
                <option value="">No Goal</option>
                {goals.map(goal => (
                    <option key={goal._id} value={goal._id}>
                        {goal.title}
                    </option>
                ))}
            </select>

            <select
                value={milestoneId}
                onChange={handleMilestoneChange}
                disabled={isMilestoneLocked || !goalId}
                className="w-full mb-2 p-2 border rounded"
            >
                <option value="">No Milestone</option>
                {milestones
                    .filter(m => m.goalId === goalId)
                    .map(m => (
                        <option key={m._id} value={m._id}>
                            {m.title}
                        </option>
                    ))}
            </select>

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