import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { EDIT_MILESTONE } from '../utils/mutations';

const EditMilestone = ({ milestoneId, milestoneData, onCancel }) => {
  // Initialize state from the passed milestone data
  const [title, setTitle] = useState(milestoneData.title || '');
  const [description, setDescription] = useState(milestoneData.description || '');
  const [target_date, setTargetDate] = useState(
    milestoneData.target_date ? milestoneData.target_date.slice(0,10): '' 
  );
  const [completed, setCompleted] = useState(milestoneData.completed || false);
  const [order, setOrder] = useState(milestoneData.order || '');

  const [editMilestone] = useMutation(EDIT_MILESTONE, {
    onCompleted: () => onCancel(), // Close form after successful update
    onError: (err) => console.error('Failed to update milestone:', err),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    editMilestone({
      variables: {
        id: milestoneId,
        MilestoneInput: { goal_id: milestoneData.goal_id, title, description, target_date, completed, order },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <input
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Milestone name"
      />

      <textarea
        className="border p-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <input
        type="date"
        className="border p-2"
        value={target_date}
        onChange={(e) => setTargetDate(e.target.value)}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="border p-2"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>

      <input
        type="number"
        className="border p-2"
        value={order}
        onChange={(e) => setOrder(parseInt(e.target.value))}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-300 text-black px-4 py-2 rounded"
      >
        Cancel
      </button>
    </form>

   
  );
};

export default EditMilestone;