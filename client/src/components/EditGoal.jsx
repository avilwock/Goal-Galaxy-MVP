import { useParams } from 'react-router-dom'
import {useQuery, useMutation} from '@apollo/client/react'
import { useState, useEffect } from '@apollo/client/react'
import { QUERY_GOAL } from '../utils/queries'
import { EDIT_GOAL } from '../utils/mutations'

const EditGoal = () => {
    const { id } =useParams();

    const {loading, error, data} = useQuery(QUERY_GOAL, {
        variables: {id}
    });

    const [updateGoal] = useMutation(EDIT_GOAL);

    const[goal_name, setGoalName] = useState('')
    const [description, setDescription] = useState('')
    const [target_date, setTargetDate] = useState('')

    useEffect(() => {
        if (data?.goal) {
            setGoalName(data.goal.goal_name || '');
            setDescription(data.goal.description || '');
            setTargetDate(data.goal.target_date || '');
        }
    },
    [data]);

    if(loading) return <p> Loading... </p>;
    if (error) return <p>Error</p>

    // const goal = data.goal;

    const handleSubmit = (e) => {
        e.preventDefault();

        updateGoal({
            variables: {
                id,
                goal_name,
                description,
                target_date
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-3">

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

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Changes
      </button>

    </form>
    )
}

export default EditGoal;
