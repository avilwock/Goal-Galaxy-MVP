import { useParams, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { QUERY_GOAL } from '../utils/queries';
import { formatDate } from '../utils/date';
import { useQuery, useMutation } from "@apollo/client/react";
import AddMilestoneForm from './AddMilestone';
import EditMilestone from './EditMilestone';
import { DELETE_MILESTONE, EDIT_MILESTONE } from '../utils/mutations';

const MilestoneWidget = () => {
  const { id } = useParams(); // goal ID
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(QUERY_GOAL, { variables: { id } });

  const [deleteMilestone] = useMutation(DELETE_MILESTONE, {
    onCompleted: () => {
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
  const sortedMilestones = goal.milestones ? [...goal.milestones].sort((a, b) => a.order - b.order) : [];

  const handleDelete = (milestoneId) => {
    if (!window.confirm("Delete this Milestone?")) return;
    deleteMilestone({
      variables: { id: milestoneId }
    });
  };

  return (
    <div className='flex flex-wrap gap-1 border rounded-xl p-8'>
      {showForm && <AddMilestoneForm setShowForm={setShowForm} goalId={goal._id} />}

      {sortedMilestones.map((milestone) => (
        <div key={milestone._id} className="border p-2 rounded w-full mb-2">
          {editingId === milestone._id ? (
            <EditMilestone
              milestoneId={milestone._id}
              milestoneData={milestone}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              {/* Top line: title | due date | completed */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{milestone.title}</h3>
                <p className="text-sm text-gray-600">Due: {formatDate(milestone.target_date)}</p>
                {/* <p className="text-sm">{milestone.completed ? '✅ Completed' : '❌ Not done'}</p> */}
              </div>

              {/* Description & order underneath */}
              <div className="mb-2">
                <p>{milestone.description}</p>
                <p className="text-sm text-gray-500">Order: {milestone.order}</p>
              </div>

              {/* Buttons row */}
              <div className="flex items-center w-full mt-2">
                {/* Complete button on the left */}
                <button
                  onClick={() => handleCompleteToggle(milestone)}
                  className={`px-3 py-2 rounded text-white ${
                    milestone.completed ? 'bg-gray-400' : 'bg-green-500'
                  }`}
                >
                  {milestone.completed ? 'Completed' : 'Complete'}
                </button>

                {/* Center Edit button */}
                <div className="flex-1 flex justify-center">
                  <button
                    onClick={() => setEditingId(milestone._id)}
                    className="px-3 py-2 rounded text-white bg-blue-500"
                  >
                    Edit
                  </button>
                </div>

                {/* Delete button on the right */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(milestone._id)}
                    className="px-3 py-2 rounded bg-red-500 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MilestoneWidget;