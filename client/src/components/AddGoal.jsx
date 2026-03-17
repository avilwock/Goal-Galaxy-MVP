import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_GOAL } from '../utils/mutations';
import { QUERY_GOALS } from '../utils/queries';
import GoalIcon, { ICON_KEYS} from './GoalIcon';
import ICON_COLORS  from './IconColors';

const AddGoalForm = () => {
  const [goal_name, setGoalName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [iconColor, setIconColor] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef=useRef();

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow-md max-w-md mx-auto my-4">
  <h2 className="text-2xl font-bold mb-4 text-gray-800 place-self-center">Add a New Goal</h2>

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
      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
    />
  </div>
  <div className="mb-4">
  <label className="block font-semibold mb-2 text-gray-700">Preview</label>
  <div className="w-16 h-16 flex items-center justify-center rounded-lg shadow-inner bg-gray-100">
    <GoalIcon name={icon} color={iconColor} size="large" />
  </div>
</div>
<div className="mb-4 relative" ref={containerRef}>
        <label className="block font-semibold mb-2 text-gray-700">Icon</label>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full h-10 border rounded flex items-center justify-center bg-white"
        >
          {icon ? <GoalIcon name={icon} size="medium" /> : 'Select Icon'}
        </button>

        {open && (
          <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto border rounded bg-white grid grid-cols-4 gap-2 p-2">
            {ICON_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setIcon(key);
                  setOpen(false);
                }}
                className={`p-2 rounded hover:bg-gray-100 flex justify-center items-center ${
                  icon === key ? 'bg-blue-100 border-blue-500' : ''
                }`}
              >
                <GoalIcon name={key} size="medium" />
              </button>
            ))}
          </div>
        )}
      </div>
  <div className="mb-4">
    <label htmlFor="icon-color" className="block font-semibold mb-1 text-gray-700">
      Icon Color
    </label>
    <div className="flex flex-wrap gap-3">
  {Object.entries(ICON_COLORS).map(([name, hex]) => (
    <button
      key={name}
      type="button"
      onClick={() => setIconColor(hex)}
      title={name}
      aria-label={name}
      className={`w-8 h-8 rounded-full border-2 ${
        iconColor === hex ? 'border-black scale-110' : 'border-transparent'
      }`}
      style={{ backgroundColor: hex }}
    />
  ))}
</div>
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
      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
