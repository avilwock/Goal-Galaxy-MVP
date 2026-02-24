const mongoose = require('mongoose');
const { Schema, model } = mongoose

const taskSchema = new Schema({

        title: {
            type: String,
            required: true,
            validate: {
                //a function that takes the value description field v
                validator: function (v) {
                    //checks that v exists, the lenght is greather than 0 after the white space it trimmed
                    return v && v.trim().length > 0;
                },
                message: 'Title cannot be empty',
            },
        },
        description: {
            type: String,
        },
        due_date: {
            type: Date,
        },
        recurrence_pattern: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'custom'],
        },
        completed: {
            type: Boolean,
            default: false
        },
        activity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }, 
    }, 
    { 
        timestamps: true
    });

const Task = model('Task', taskSchema);
module.exports = Task;