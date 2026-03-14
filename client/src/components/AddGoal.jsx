import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_GOAL } from '../utils/mutations';
import { QUERY_GOALS } from '../utils/queries';

const AddGoalForm = () => {
  const [goal_name, setGoalName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [iconColor, setIconColor] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const [addGoal ] = useMutation(ADD_GOAL, {
    update(cache, { data: { addGoal } }) {
      const { goals } = cache.readQuery({ query: QUERY_GOALS }) || { goals: [] };
      cache.writeQuery({
        query: QUERY_GOALS,
        data: { goals: [addGoal, ...goals] },
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal_name) return;

    try {
      await addGoal({
        variables: {
          goalInput: {
          goal_name,
          description,
          icon,
          icon_color: iconColor,
          target_date: targetDate,
          }
        },
      });

      // Reset form
      setGoalName('');
      setDescription('');
      setIcon('');
      setIconColor('');
      setTargetDate('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow-md max-w-md mx-auto my-4">
  <h2 className="text-2xl font-bold mb-4 text-gray-800">Add a New Goal</h2>

  <div className="mb-4">
    <label htmlFor="goal-name" className="block font-semibold mb-1 text-gray-700">
      Goal Name
    </label>
    <input
      id="goal-name"
      type="text"
      placeholder="Enter your goal title"
      value={goal_name}
      onChange={(e) => setGoalName(e.target.value)}
      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div className="mb-4">
    <label htmlFor="description" className="block font-semibold mb-1 text-gray-700">
      Description
    </label>
    <textarea
      id="description"
      placeholder="Optional description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="icon" className="block font-semibold mb-1 text-gray-700">
      Icon Name
    </label>
    <input
      id="icon"
      type="text"
      placeholder="e.g., star, trophy"
      value={icon}
      onChange={(e) => setIcon(e.target.value)}
      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="icon-color" className="block font-semibold mb-1 text-gray-700">
      Icon Color
    </label>
    <input
      id="icon-color"
      type="text"
      placeholder="e.g., red, blue"
      value={iconColor}
      onChange={(e) => setIconColor(e.target.value)}
      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="target-date" className="block font-semibold mb-1 text-gray-700">
      Target Date
    </label>
    <input
      id="target-date"
      type="date"
      value={targetDate}
      onChange={(e) => setTargetDate(e.target.value)}
      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <button
    type="submit"
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Add Goal
  </button>
</form>

  );
};

export default AddGoalForm;
