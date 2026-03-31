import { useParams } from "react-router-dom";
import { useState } from 'react';
import { QUERY_GOAL } from '../utils/queries';
import { formatDate } from '../utils/date';
import { useQuery } from "@apollo/client/react";
import AddMilestoneForm from './AddMilestone';
import EditMilestone from './EditMilestone';

const MilestoneWidget = () => {
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { loading, error, data } = useQuery(QUERY_GOAL, { variables: { id } });

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data?.goal ?? {};

  return (
    <div className='flex flex-wrap gap-1 border rounded-xl p-8'>
      {/* Add Milestone Form */}
      {showForm && <AddMilestoneForm setShowForm={setShowForm} goalId={goal._id} />}

      {goal.milestones?.map((milestone) => (
        <div key={milestone._id} className="border p-2 rounded w-full mb-2">
          {editingId === milestone._id ? (
            <EditMilestone
              milestoneId={milestone._id}
              milestoneData={milestone} // Pass the existing milestone
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
                onClick={() => {
                  if (editingId !== milestone._id) setEditingId(milestone._id);
                }}
              >
                Edit
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MilestoneWidget;