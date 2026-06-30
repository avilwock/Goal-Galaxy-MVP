import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";


import { QUERY_GOAL } from "../utils/queries";
import { DELETE_GOAL, EDIT_GOAL } from "../utils/mutations";

import GoalIcon from "../components/GoalIcon";
import StatusIcon from "../components/StatusIcon";
import ProgressBar from "../components/ProgressBar";
import GoalTaskWidget from "../components/GoalTaskWidget";
import MilestoneWidget from "../components/MilestoneWidget";
import AddMilestoneForm from "../components/AddMilestone";
import AddTaskForm from "../components/AddTask";
import Login from '../components/Login';

/* ---------------- EDIT GOAL FORM ---------------- */

const EditGoalForm = ({ goal, onClose }) => {
  const [goal_name, setGoalName] = useState(goal.goal_name);
  const [description, setDescription] = useState(goal.description);
  const [target_date, setTargetDate] = useState(
    goal.target_date ? goal.target_date.slice(0, 10) : ""
  );

  const [updateGoal] = useMutation(EDIT_GOAL);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateGoal({
      variables: {
        id: goal._id,
        goalInput: {
          goal_name,
          description,
          target_date,
        },
      },
    });

    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-3 border rounded bg-gray-800 mt-4"
    >
      <input
        className="border p-2 w-full"
        value={goal_name}
        onChange={(e) => setGoalName(e.target.value)}
        placeholder="Goal name"
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

      <div className="flex gap-2 justify-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>

        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

/* ---------------- GOAL PAGE ---------------- */

const GoalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(QUERY_GOAL, {
    variables: { id },
  });

  const [deleteGoal] = useMutation(DELETE_GOAL);

  const [activeTab, setActiveTab] = useState("tasks");
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data.goal;

  const handleDelete = async () => {
    if (!window.confirm("Delete this goal?")) return;

    await deleteGoal({ variables: { id } });

    navigate("/", { replace: true });
  };

  return (
    <div className="place-self-center w-full max-w-6xl mx-auto p-4">

      {/* HEADER */}
      <div className="flex items-start justify-between mt-5">
        <GoalIcon name={goal.icon} size="xlarge" color={goal.icon_color} />

        <div className="flex flex-col gap-2 items-center">
          <StatusIcon status={goal.status} />

          <button
            onClick={() => setShowEditGoal((p) => !p)}
            className="px-3 py-2 rounded bg-blue-500 hover:bg-gray-300"
          >
            {showEditGoal ? "Cancel Edit" : "Edit Goal"}
          </button>
        </div>

        <button
          onClick={handleDelete}
          className="px-3 py-2 rounded bg-red-500 text-white"
        >
          Delete
        </button>
      </div>

      {/* EDIT FORM */}
      {showEditGoal && (
        <EditGoalForm
          goal={goal}
          onClose={() => setShowEditGoal(false)}
        />
      )}

      {/* TITLE */}
      <div className="flex flex-col items-center mt-4">
        <h2 className="text-6xl font-bold">{goal.goal_name}</h2>

        <p className="text-gray-600 mt-1">
          Target Date:{" "}
          {goal.target_date &&
            new Date(goal.target_date).toLocaleDateString()}
        </p>
      </div>

      {/* DESCRIPTION + PROGRESS */}
      <div className="flex flex-col items-center border rounded-xl p-6 mt-4">
        <h3 className="text-xl font-semibold mb-2">My Goal Objectives</h3>

        <p className="text-center max-w-2xl">{goal.description}</p>

        <div className="flex flex-col mt-4 w-full">
          <ProgressBar milestones={goal.milestones} />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mt-6 justify-center">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "tasks"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks
        </button>

        <button
          className={`px-4 py-2 rounded ${
            activeTab === "milestones"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("milestones")}
        >
          Milestones
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-4 min-h-[300px]">

        {/* TASKS TAB */}
        {activeTab === "tasks" && (
          <div>

            <button
              onClick={() => setShowTaskForm(true)}
              className="mb-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Task
            </button>

            {showTaskForm && (
              <AddTaskForm
                setShowForm={setShowTaskForm}
                goalContextId={goal._id}
              />
            )}

            <GoalTaskWidget />

          </div>
        )}

        {/* MILESTONES TAB */}
        {activeTab === "milestones" && (
          <div>
            {!showMilestoneForm && (
              <button
                onClick={() => setShowMilestoneForm(true)}
                className="mb-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Add Milestone
              </button>
            )}

            {showMilestoneForm && (
              <AddMilestoneForm
                goalId={goal._id}
                setShowForm={setShowMilestoneForm}
              />
            )}

            <MilestoneWidget />
          </div>
        )}

      </div>
    </div>
  );
};

export default GoalPage;