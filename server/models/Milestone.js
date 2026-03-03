import mongoose from 'mongoose';
const {Schema, model } = mongoose

const milestoneSchema = new Schema({

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
    goal_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        required: true,
        description: "reference to Goal"
    },
    description: {
        type: String,
    },
    target_date: {
        type: Date,
    },
    completed: {
        type: Boolean,
        default: false
    },
    order: { 
        type: Number,
        default: 0
    },
},
{
 timestamps: true,
});

export const Milestone = model('Milestone', milestoneSchema);