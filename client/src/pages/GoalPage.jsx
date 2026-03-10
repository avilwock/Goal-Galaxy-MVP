import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { QUERY_GOAL } from "../utils/queries";

const GoalPage = () => {
  const { id } = useParams();

  const { loading, error, data } = useQuery(QUERY_GOAL, {
    variables: { id }
  });

  if (loading) return <p>Loading goal...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const goal = data.goal;

  return (
    <div>
      <h2>{goal.goal_name}</h2>
      <p>{goal.description}</p>
    </div>
  );
};

export default GoalPage;