import { useState } from 'react'
import { useMutation } from '@apollo/client/react';
import { ADD_TASK } from '../utils/mutations';
import { QUERY_GOALS } from '../utils/queries';

const AddTaskForm = ({ setShowForm }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [dueTime, setDueTime] = useState('')
    const [priority, setPriority] = useState('')
    const [recurrence, setRecurrence] = useState('')
    const [recurrenceDays, setRecurrenceDays] = useState('')
    const [recurrenceEndDate, setRecurrenceEndDate] = useState('')
    const [completed, SetCompleted] = useState(false)

    const [ addTask ] = useMutation(ADD_TASK, {
        update(cache, {data: { addTask }}) {
            const {tasks} = cache.readQuery({query:QUERY_GOALS }) || { goals: [] };
            cache.writeQuery({
                query: QUERY_GOALS,
                data: {goals: [addTask, ...tasks]}
            })
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title) return;

        try { 
            await addTask({
                variables: {
                    taskInput: {
                        title,
                        description,
                        due_date: dueDate,
                        due_time: dueTime,
                        priority,
                        recurrence,
                        recurrence_days: recurrenceDays,
                        recurrence_end_date: recurrenceEndDate,
                        completed
                    }
                }
            });

            setTitle('');
            setDescription('')
            setDueDate('')
            setDueTime('')
            setPriority('')
            setRecurrence('')
            setRecurrenceDays('')
            setRecurrenceEndDate('')
            SetCompleted('')
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form onSubmit={handleSubmit} className = "bg-gray-100 p-6 rounded shadow-md max-w-md mx-auto my-4">
            <button
            type="button"
            onClick={() => setShowForm(false)}
            className="aboslute top-2 right-2 text-gray-600 text-xl"
            >
                X
            </button>
        </form>
    )

}

export default AddTaskForm;