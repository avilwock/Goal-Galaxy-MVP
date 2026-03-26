import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { QUERY_GOAL } from "../utils/queries";
import GoalIcon from '../components/GoalIcon';
import { formatDate } from '../utils/date';
import StatusIcon from '../components/StatusIcon';
import ProgressBar from '../components/ProgressBar';
import TaskWidget from "../components/TasksWidget";
import MilestoneWidget from "../components/MilestoneWidget";
import { useState } from 'react';
import { Link } from 'react-router-dom'
import { DELETE_GOAL } from "../utils/mutations";

const GoalPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(QUERY_GOAL, { variables: { id } });
  const [activeTab, setActiveTab] = useState("tasks");

  const navigate=useNavigate();

  const [deleteGoal] = useMutation(DELETE_GOAL);

  const handleDelete= () => {
    if(!window.confirm("Delete this goal?")) return;
    deleteGoal({
      variables: {id}
    });

    navigate("/", {replace: true});
  }

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data.goal;

  return (
    <div className="place-self-center">
      <div className="place-self-center">
        {/* Goal icon and status */}
        <div className="flex items-start justify-between w-full mt-5">
          <GoalIcon name={goal.icon} size="xlarge" color={goal.icon_color} />
          <div>
          <div className = "flex gap-2 flex-col">
            <StatusIcon status={goal.status} />
            <Link
            to={`goal/${goal._id}/edit`}
            className = "px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Edit
            </Link>
          </div>
          </div>
          <button
          onClick={handleDelete}
          className = "px-3 px-2 rounded bg-red-500 text-white"
          >
            Delete
          </button>
        </div>

        {/* Goal name */}
        <h2 className="text-9xl flex gap-4 place-self-center mb-4">{goal.goal_name}</h2>

        {/* Description and progress */}
        <div className="flex flex-col items-center border rounded-xl w-6xl p-8">

  <h3 className="text-xl font-semibold mb-2">
    My Goal Objectives
  </h3>

  <p className="text-center max-w-2xl">
    {goal.description}
  </p>

  <div className="flex flex-col mt-4 w-full">
    <ProgressBar milestones={goal.milestones} />
  </div>

</div>
      </div>
      <p>Target Date: {formatDate(goal.target_date)}</p>
      {/* Tab buttons */}
      <div className="flex gap-2 mt-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "milestones" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("milestones")}
        >
          Milestones
        </button>

        <button
          className={`px-4 py-2 rounded ${activeTab === "tasks" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks
        </button>

        
      </div>

      {/* Active widget */}
      <div className="mt-4 min-h-[300px]">
        {activeTab === "tasks" && <TaskWidget />}
        {activeTab === "milestones" && <MilestoneWidget />}
      </div>
    </div>
  );
};

export default GoalPage;