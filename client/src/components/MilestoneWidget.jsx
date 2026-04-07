import { useParams, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { QUERY_GOAL } from '../utils/queries';
import { formatDate } from '../utils/date';
import { useQuery, useMutation } from "@apollo/client/react";
import AddMilestoneForm from './AddMilestone';
import EditMilestone from './EditMilestone';
import { DELETE_MILESTONE } from '../utils/mutations';
import { EDIT_MILESTONE } from '../utils/mutations';

const MilestoneWidget = () => {
  const { id } = useParams(); // goal ID
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(QUERY_GOAL, { variables: { id } });
  const [deleteMilestone] = useMutation(DELETE_MILESTONE, {
    onCompleted: () => {
      // refetch the goal to update the UI OR navigate
      refetch();
      navigate(`/goal/${id}`, { replace: true });
    },
    onError: (err) => console.error('Failed to delete milestone:', err),
  });

  const [editMilestone] = useMutation(EDIT_MILESTONE, {
  onCompleted: () => refetch(),
  onError: (err) => console.error('Failed to update milestone:', err),
});

const handleCompleteToggle = (milestone) => {
  editMilestone({
    variables: {
      id: milestone._id,
      MilestoneInput: {
        goal_id: milestone.goal_id,
        title: milestone.title,
        completed: !milestone.completed
      }
    }
  });
};

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data?.goal ?? {};

  const handleDelete = (milestoneId) => {
    if (!window.confirm("Delete this Milestone?")) return;
    deleteMilestone({
      variables: { id: milestoneId } // pass milestone _id, not goal _id
    });
  }

  return (
    <div className='flex flex-wrap gap-1 border rounded-xl p-8'>
      {showForm && <AddMilestoneForm setShowForm={setShowForm} goalId={goal._id} />}

      {goal.milestones?.map((milestone) => (
        <div key={milestone._id} className="border p-2 rounded w-full mb-2">
          {editingId === milestone._id ? (
            <EditMilestone
              milestoneId={milestone._id}
              milestoneData={milestone}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <h3>{milestone.title}</h3>
              <p>{milestone.description}</p>
              <p>Target Date: {formatDate(milestone.target_date)}</p>
              <p>Completed: {milestone.completed ? '✅' : '❌'}</p>
              <p>Order: {milestone.order}</p>
              <button
                onClick={() => setEditingId(milestone._id)}
              >
                Edit
              </button>

              <button
                onClick={() => handleCompleteToggle(milestone)}
                className={`px-3 py-2 rounded text-white ${
                  milestone.completed ? 'bg-gray-400' : 'bg-green-500'
                }`}
              >
                {milestone.completed ? 'Completed' : 'Complete'}
              </button>

              <button
                onClick={() => handleDelete(milestone._id)}
                className="px-3 py-2 rounded bg-red-500 text-white"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MilestoneWidget;