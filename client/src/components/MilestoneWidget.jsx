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

import AddTaskForm from "./AddTask";
import EditTaskForm from "./EditTask";
import EditMilestone from "./EditMilestone";

import {
  DELETE_MILESTONE,
  EDIT_MILESTONE,
  DELETE_TASK,
} from "../utils/mutations";


const SortableItem = ({
  milestone,
  editingId,
  setEditingId,
  handleCompleteToggle,
  handleDelete,
  refetch,
}) => {
  const [showTasks, setShowTasks] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [deleteTask] = useMutation(DELETE_TASK);

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
  } = useSortable({
    id: milestone._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    await deleteTask({
      variables: {
        id: taskId,
      },
    });

    refetch();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border p-4 rounded mb-3"
    >

      <div
        {...attributes}
        {...listeners}
        className="bg-gray-900 p-3 rounded cursor-grab flex justify-between items-center"
      >
        <div>
          <h3 className="font-semibold">
            {milestone.title}
          </h3>

          <p className="text-sm">
            {milestone.tasks?.length || 0} Tasks
          </p>
        </div>

        <p className="text-sm">
          {milestone.target_date
            ? formatDate(new Date(milestone.target_date))
            : "No date"}
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
          {milestone.description && (
            <p className="mt-3">
              {milestone.description}
            </p>
          )}


          <div className="border-t mt-4 pt-3">

            <button
              onClick={() => setShowTasks(!showTasks)}
              className="bg-purple-500 text-white px-3 py-2 rounded"
            >
              {showTasks ? "Hide Tasks" : "Show Tasks"}
            </button>


            {showTasks && (
              <div className="mt-3">

                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="bg-blue-500 text-white px-3 py-2 rounded mb-3"
                >
                  {showTaskForm ? "Cancel" : "Add Task"}
                </button>


                {showTaskForm && (
                  <AddTaskForm
                    setShowForm={setShowTaskForm}
                    goalContextId={milestone.goal_id}
                    milestoneContextId={milestone._id}
                    onTaskAdded={refetch}
                  />
                )}


                {milestone.tasks?.length ? (
                  milestone.tasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex justify-between items-center bg-gray-700 rounded p-2 mb-2 group"
                    >
                      <span>
                        {task.title}
                      </span>

                      <div className="flex items-center gap-2">

                        <span>
                          {task.completed ? "✅" : "⬜"}
                        </span>

                        <div className="opacity-0 group-hover:opacity-100 transition flex gap-2">

                          <button
                            onClick={() => setEditingTask(task)}
                            className="text-white"
                            title="Edit"
                          >
                            ✎
                          </button>

                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-red-400"
                            title="Delete"
                          >
                            🗑
                          </button>

                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">
                    No tasks yet
                  </p>
                )}

              </div>
            )}

          </div>


          <div className="flex gap-2 mt-4">

            <button
              onClick={() => handleCompleteToggle(milestone)}
              className={`px-3 py-2 rounded text-white ${
                milestone.completed
                  ? "bg-gray-400"
                  : "bg-green-500"
              }`}
            >
              {milestone.completed ? "Completed" : "Complete"}
            </button>


            <button
              onClick={() => setEditingId(milestone._id)}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Edit
            </button>


            <button
              onClick={() => handleDelete(milestone._id)}
              className="bg-red-500 text-white px-3 py-2 rounded ml-auto"
            >
              Delete
            </button>

          </div>

        </>
      )}


      {editingTask && (
        <EditTaskForm
          task={editingTask}
          setShowForm={() => setEditingTask(null)}
          refetch={refetch}
        />
      )}

    </div>
  );
};



const MilestoneWidget = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);

  const {
    loading,
    error,
    data,
    refetch,
  } = useQuery(QUERY_GOAL, {
    variables: { id },
  });


  const [deleteMilestone] = useMutation(DELETE_MILESTONE, {
    onCompleted: () => {
      refetch();
      navigate(`/goal/${id}`, { replace: true });
    },
  });


  const [editMilestone] = useMutation(EDIT_MILESTONE, {
    onCompleted: refetch,
  });


  const milestones = data?.goal?.milestones
    ? [...data.goal.milestones].sort(
        (a, b) => a.order - b.order
      )
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

    deleteMilestone({
      variables: {
        id: milestoneId,
      },
    });
  };


  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = milestones.findIndex(
      (m) => m._id === active.id
    );

    const newIndex = milestones.findIndex(
      (m) => m._id === over.id
    );

    const reordered = arrayMove(
      milestones,
      oldIndex,
      newIndex
    );


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
    <div className="border rounded-xl p-6">

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >

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
              refetch={refetch}
            />
          ))}

        </SortableContext>

      </DndContext>

    </div>
  );
};

export default MilestoneWidget;