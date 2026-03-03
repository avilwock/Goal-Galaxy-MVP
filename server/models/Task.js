import mongoose from 'mongoose';
const { Schema, model } = mongoose

const taskSchema = new Schema({

        title: {
            type: String,
            required: true,
            validate: {
                //a function that takes the value description field v
                validator: function (v) {
                    //checks that v exists, the length is greater than 0 after the white space it trimmed
                    return v && v.trim().length > 0;
                },
                message: 'Title cannot be empty',
            },
            description: "Task Name"
        },
        description: {
            type: String,
        },
        goal_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Goal',
            description: "Reference to Goal (optional)"
        },
        milestone_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Milestone',
            description: "Reference to Milestone (optional)"
        },
        due_date: {
            type: Date
        },
        due_time: {
            type: String,
            description: "Time in HH:MM format"
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: "medium"
        },
        recurrence: {
            type: String,
            enum: [ 'none', 'daily', 'monthly', 'weekly'],
            default: 'none',
            description: "How often the task repeats"
        },
        recurrence_days: {
            type: [Number],
            description:
                "For weekly recurrence: days of week (0=Sun, 1=Mon, ..., 6=Sat)",
        },
        recurrence_end_date: {
            type: Date,
            description: "When the recurrence ends (optional)"
        },
        completed: {
            type: Boolean,
            default: false
        },
    }, 
    { 
        timestamps: true
    });

export const Task = model('Task', taskSchema);