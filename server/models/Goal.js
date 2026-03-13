import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const goalSchema = new Schema ({
    goal_name: {
        type: String,
        required: true,
        description: "goal title"
    },
    description: {
        type: String,
        description: "goal description"
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GoalCategory',
        description: "reference to goalCategory"
    },
    icon: {
        type: String,
        description: "Lucide icon name for calendar display"
    },
    icon_color: {
        type: String,
        description: "icon color"
    },
    target_date: {
        type: Date,
        description: "target completion date"
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
    max: 100,
    description: "progress percentage 0-100"
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
},
{ 
    timestamps: true 
});

export const Goal = model('Goal', goalSchema);