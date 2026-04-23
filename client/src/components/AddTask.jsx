import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';

import { ADD_TASK } from '../utils/mutations';
import { QUERY_GOALS, QUERY_MILESTONES, QUERY_GOAL } from '../utils/queries';

const AddTaskForm = ({
  setShowForm,
  goalContextId = null,
  milestoneContextId = null
}) => {

  /* ---------------- STATE ---------------- */

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

  const isGoalContext = !!goalContextId;
  const isMilestoneContext = !!milestoneContextId;

  /* ---------------- DATA ---------------- */

  const { data: goalsData } = useQuery(QUERY_GOALS);
  const goals = goalsData?.goals || [];

  const { data: milestonesData } = useQuery(QUERY_MILESTONES);
  const milestones = milestonesData?.milestones || [];

  /* ---------------- MUTATION ---------------- */

  const [addTask] = useMutation(ADD_TASK, {
  update(cache, { data: { addTask } }) {

    if (!goalContextId) return;

    cache.modify({
      id: cache.identify({
        __typename: "Goal",
        _id: goalContextId
      }),

      fields: {
        tasks(existingTaskRefs = [], { toReference }) {

          const taskRef = toReference(addTask, true);

          return [taskRef, ...existingTaskRefs];
        }
      }
    });

    }
    });

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) return;

    try {
      await addTask({
        variables: {
          TaskInput: {
            title,
            description,
            due_date: dueDate || null,
            due_time: dueTime || null,
            priority: priority || null,
            recurrence: recurrence || null,
            recurrence_days: recurrenceDays
              ? parseInt(recurrenceDays)
              : null,
            recurrence_end_date: recurrenceEndDate || null,
            completed,

            goal_id: goalContextId || goalId || null,
            milestone_id: milestoneContextId || milestoneId || null
          }
        }
      });

      /* ---------------- RESET ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded shadow-md max-w-md mx-auto my-4 relative"
    >

      {/* CLOSE BUTTON */}
      <button
        type="button"
        onClick={() => setShowForm(false)}
        className="absolute top-2 right-3 text-white text-xl"
      >
        ×
      </button>

      <h2 className="text-xl font-bold mb-4 text-center text-white">
        Add Task
      </h2>

      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full mb-2 p-2 border rounded"
      />

      {/* DESCRIPTION */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full mb-2 p-2 border rounded"
      />

      {/* DATE / TIME */}
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

      {/* GOAL SELECT (GLOBAL ONLY) */}
      {!isGoalContext && !isMilestoneContext && (
        <select
          value={goalId}
          onChange={(e) => {
            setGoalId(e.target.value);
            setMilestoneId('');
          }}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="">No Goal</option>
          {goals.map(goal => (
            <option key={goal._id} value={goal._id}>
              {goal.goal_name}
            </option>
          ))}
        </select>
      )}

      {/* MILESTONE SELECT */}
      {!isMilestoneContext && (
        <select
          value={milestoneId}
          onChange={(e) => setMilestoneId(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="">No Milestone</option>

          {milestones
            .filter(m => (goalContextId || goalId) ? m.goal_id === (goalContextId || goalId) : true)
            .map(m => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
        </select>
      )}

      {/* PRIORITY */}
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

      {/* RECURRENCE */}
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

      {/* COMPLETED */}
      <label className="flex items-center gap-2 mb-3 text-white">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>

      {/* SUBMIT */}
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