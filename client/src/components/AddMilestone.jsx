import { useState} from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_MILESTONE } from '../utils/mutations';
import { QUERY_GOALS } from '../utils/queries';

const AddMilestoneForm = ({setShowForm, goalId}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const[target_date, setTargetDate] = useState('')
    const [completed, setCompleted] = useState(false)
    const [order, setOrder] = useState('')

    const [ addMilestone ] = useMutation(ADD_MILESTONE, {
        update(cache, { data: { addMilestone }}) {
            const existingGoals = cache.readQuery({ query: QUERY_GOALS });
            if(existingGoals) {
                const newGoals = existingGoals.goals.map(goal => {
                    if(goal.id === goalId) {
                        return {
                            ...goal,
                            milestones: [addMilestone, ...(goal.milestones || [])],
                        };
                    }
                    return goal;
                });
                cache.writeQuery({
                data: {goals:newGoals}
                })
            }
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) return;

        try {
            await addMilestone({
                variables: {
                    MilestoneInput: {
                        goal_id: goalId,
                        title,
                        description,
                        target_date: target_date || null,
                        completed: !!completed,
                        order: order ? parseInt(order): null
                    }
                },
                refetchQueries: [{query: QUERY_GOALS }],
                awaitRefetchQueries: true
            })
            setTitle('');
            setDescription('');
            setTargetDate('');
            setCompleted(false);
            setOrder('');
            setShowForm(false);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form onSubmit = {handleSubmit}>
            <button
            type="button"
            onClick={() => setShowForm(false)}
        >
        ✕
        </button>
        <h2>Milestones</h2>
        <div>
            <label>
                Title
            </label>
            <input
                id = "milestone-title"
                type= "text"
                placeholder = "Enter your milestone title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
        </div>
        <div>
            <label>
                Description
            </label>
            <textarea
                id="description"
                type = "text"
                placeholder="optional description"
                value={description}
                onChange ={(e) => setDescription(e.target.value)}
            />
        </div>
        <div>
            <label>
                Target Date:
            </label>
            <input
                type = "date"
                value = {target_date}
                onChange = {(e) => setTargetDate(e.target.value)}
            />
        </div>

        <div>
            <label>
                Completed
            </label>
            <input
                id="completed"
                type = "checkbox"
                checked= {completed}
                onChange = {(e) => setCompleted(e.target.checked)}
            />
        </div>
        <div>
            <label>
                Order
            </label>
            <input
                type="number"
                value = {order}
                onChange = {(e) => setOrder(e.target.value)}
            />
        </div>
        <div className = "border rounded-lg bg-blue-500 hover:bg-blue-600">
            <button type = "submit">Add Milestone</button>
        </div>
        </form>
    )
}

export default AddMilestoneForm