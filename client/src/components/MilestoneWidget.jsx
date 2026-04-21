import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { QUERY_GOAL } from "../utils/queries";
import { formatDate } from "../utils/date";
import AddMilestoneForm from "./AddMilestone";
import EditMilestone from "./EditMilestone";
import { DELETE_MILESTONE, EDIT_MILESTONE } from "../utils/mutations";

const SortableItem = ({
  milestone,
  editingId,
  setEditingId,
  handleCompleteToggle,
  handleDelete,
}) => {
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({ id: milestone._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} className="border p-2 rounded w-full mb-2">
      {/* DRAG HANDLE */}
      <div
      {...attributes}
      {...listeners}
      className="bg-gray-900 p-2 rounded mb-2 cursor-grab flex justify-between items-center"
    >
      <h3 className="font-semibold">{milestone.title}</h3>
      <p className="text-sm text-white-100">
        {milestone.target_date ? formatDate(new Date(milestone.target_date)) : "No date"}
      </p>
    </div>

      {editingId === milestone._id ? (
        <EditMilestone
          milestoneId={milestone._id}
          milestoneData={milestone}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <>
          {milestone.description && <p className="mb-2">{milestone.description}</p>}

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => handleCompleteToggle(milestone)}
              className={`px-3 py-2 rounded text-white ${
                milestone.completed ? "bg-gray-400" : "bg-green-500"
              }`}
            >
              {milestone.completed ? "Completed" : "Complete"}
            </button>

            <button
              onClick={() => setEditingId(milestone._id)}
              className="px-3 py-2 rounded text-white bg-blue-500"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(milestone._id)}
              className="px-3 py-2 rounded text-white bg-red-500 ml-auto"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const MilestoneWidget = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { loading, error, data, refetch } = useQuery(QUERY_GOAL, { variables: { id } });

  const [deleteMilestone] = useMutation(DELETE_MILESTONE, {
    onCompleted: () => {
      refetch();
      navigate(`/goal/${id}`, { replace: true });
    },
  });

  const [editMilestone] = useMutation(EDIT_MILESTONE, { onCompleted: () => refetch() });

  const milestones = data?.goal?.milestones
    ? [...data.goal.milestones].sort((a, b) => a.order - b.order)
    : [];

  const handleCompleteToggle = (milestone) => {
    editMilestone({
      variables: {
        id: milestone._id,
        MilestoneInput: {
          goal_id: milestone.goal_id,
          title: milestone.title,
          description: milestone.description,
          target_date: milestone.target_date,
          order: milestone.order,
          completed: !milestone.completed,
        },
      },
    });
  };

  const handleDelete = (milestoneId) => {
    if (!window.confirm("Delete this milestone?")) return;
    deleteMilestone({ variables: { id: milestoneId } });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = milestones.findIndex((m) => m._id === active.id);
    const newIndex = milestones.findIndex((m) => m._id === over.id);

    const reordered = arrayMove(milestones, oldIndex, newIndex);

    reordered.forEach((milestone, index) => {
      const newOrder = index + 1;
      if (milestone.order !== newOrder) {
        editMilestone({
          variables: {
            id: milestone._id,
            MilestoneInput: {
              goal_id: milestone.goal_id,
              title: milestone.title,
              description: milestone.description,
              target_date: milestone.target_date,
              completed: milestone.completed,
              order: newOrder,
            },
          },
        });
      }
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading milestones</p>;

  return (
    <div className="border rounded-xl p-6 space-y-2">
      {/* <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Add Milestone
      </button> */}

      {showForm && <AddMilestoneForm setShowForm={setShowForm} goalId={data.goal._id} />}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={milestones.map((m) => m._id)}
          strategy={verticalListSortingStrategy}
        >
          {milestones.map((milestone) => (
            <SortableItem
              key={milestone._id}
              milestone={milestone}
              editingId={editingId}
              setEditingId={setEditingId}
              handleCompleteToggle={handleCompleteToggle}
              handleDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default MilestoneWidget;