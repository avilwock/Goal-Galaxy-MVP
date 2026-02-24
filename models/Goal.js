const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const goalSchema = new Schema ({
    goal_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category_id: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    target_date: {
        type: Date,
    },
    status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
},
{ 
    timestamps: true 
});

module.exports = model('Goal', goalSchema);