import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { QUERY_GOAL } from "../utils/queries";
import GoalIcon from '../components/GoalIcon';
import { formatDate } from '../utils/date';
import StatusIcon from '../components/StatusIcon';
import ProgressBar from '../components/ProgressBar';
import TaskWidget from "../components/TasksWidget";
import MilestoneWidget from "../components/MilestoneWidget";
import { useState } from 'react';

const GoalPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(QUERY_GOAL, { variables: { id } });
  const [activeTab, setActiveTab] = useState("tasks");

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data.goal;

  return (
    <div className="place-self-center">
      <div className="place-self-center">
        {/* Goal icon and status */}
        <div className="flex items-start justify-between w-full m-5">
          <GoalIcon name={goal.icon} size="xlarge" color={goal.icon_color} />
          <div>
            <StatusIcon status={goal.status} />
          </div>
        </div>

        {/* Goal name */}
        <h2 className="text-9xl flex gap-4 place-self-center mb-4">{goal.goal_name}</h2>

        {/* Description and progress */}
        <div className="flex flex-wrap gap-1 border rounded-xl w-6xl p-8">
          <p>Description: {goal.description}</p>
          <p>Target Date: {formatDate(goal.target_date)}</p>
          <div className="flex flex-col mt-2">
            <ProgressBar milestones={goal.milestones} />
            <div className="text-xs text-gray-400 mt-1"></div>
          </div>
        </div>
      </div>

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