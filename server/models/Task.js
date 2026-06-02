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
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        due_date: {
            type: Date
        },
        due_time: {
            type: String
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: "medium"
        },
        recurrence_rule: {
            type: String,
            default: null,
            description: "RRULE string (e.g. FREQ=WEEKLY;BYDAY=MO,WE)",
        },
        recurrence_time: {
            type: String,
            description: "HH:MM format (e.g. 18:30)",
        },
        timezone: {
            type: String,
            default: "America/Los_Angeles"
        },
        recurrence_start: {
            type: Date,
        },
        recurrence_end: {
            type: Date,
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