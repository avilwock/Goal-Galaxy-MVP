import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Goal, GoalCategory, Milestone, Task } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

const resolvers = {
  Query: {
    goals: async () => {
      try {
        return await Goal.find(); //add back with .populate('category_id')
      } catch (err) {
        console.error(err);
        throw new Error('Error fetching goals');
      }
    },

    goal: async (_, { id }) => {
      try {
        const goal = await Goal.findById(id);

        const tasks = await Task.find({ goal_id: id });

        return {
          ...goal.toObject(),
          tasks
        };
      } catch (err) {
        console.error(err);
        throw new Error('Goal not found');
      }
    },
    milestones: async() => {
      try {
        return await Milestone.find();
      } catch (err) {
        console.error(err);
        throw new Error ('Error fetching Milestones')
      }
    },
    milestone: async(_, { id }) => {
      try {
        return await Milestone.findById(id);
      } catch (err) {
        console.error(err);
        throw new Error('Milestone not found')
      }
    },
    tasks: async() => {
      try {
        return await Task.find();
      } catch (err) {
        throw new Error('Error fetching Tasks')
      }
    },
    task: async(_, { id }) => {
      try {
        return await Task.findById(id);
      } catch (err) {
        console.error(err);
        throw new Error('Task no found')
      }
    }

 
  },

  Mutation: {

    addGoal: async (_, { goalInput }) => {
      try {
        const { goal_name, description, category, icon, icon_color, target_date, status, progress } = goalInput;
        const newGoal = await Goal.create({
          goal_name,
          description,
        //   category_id: category,
          icon,
          icon_color,
          target_date,
          status,
          progress,
        });
        return newGoal;
      } catch (err) {
        console.error('Mongoose Error:', err);
        throw new Error('Error creating Goal');
      }
    },

    editGoal: async (_, { id, goalInput }) => {
      try {
        const { goal_name, description, category, icon, icon_color, target_date, status, progress} = goalInput;
        const updatedGoal = await Goal.findByIdAndUpdate(
          id,
          {
            goal_name,
            description,
            // category_id: category,
            icon,
            icon_color,
            target_date,
            status,
            progress,
          },
          { returnDocument: 'after' }
        );
        if (!updatedGoal) throw new Error('Goal not found');
        return updatedGoal;
      } catch (err) {
        console.error(err);
        throw new Error('Error updating Goal');
      }
    },

    deleteGoal: async (_, { id }) => {
      try {
        const deletedGoal = await Goal.findByIdAndDelete(id);
        if (!deletedGoal) throw new Error('Goal not found');
        return true;
      } catch (err) {
        console.error(err);
        throw new Error('Error deleting Goal');
      }
    },

    addMilestone: async(_, { MilestoneInput }) => {
        try {
            const { title, goal_id, description, target_date, completed, order } = MilestoneInput;
            const newMilestone = await Milestone.create({
                title,
                goal_id, 
                description,
                target_date,
                completed,
                order
            });
            return newMilestone;
        } catch (err) {
            console.error('Mongoose error:', err);
            throw new Error('Error creating Milestone');
        }
    },
    editMilestone: async(_, {id, MilestoneInput}) => {
        try {
            const { title, goal, description, target_date, completed, order} = MilestoneInput
            const updatedMilestone = await Milestone.findByIdAndUpdate(
                id,
                {
                    title,
                    goal_id: goal,
                    description,
                    target_date, 
                    completed, 
                    order
                },
                { new: true }
            );
            if (!updatedMilestone) throw new Error('Milestone not found');
            return updatedMilestone;
        } catch (err) {
            console.error(err);
            throw new Error('Error updating Milestone')
        }
    },
   deleteMilestone: async(_, { id }) => {
    try {
    const deletedMilestone = await Milestone.findByIdAndDelete(id);
    if (!deletedMilestone) throw new Error('Milestone not found');
    return true;
    } catch (err) {
      console.error("Delete milestone error:", err);
      throw new Error('Error deleting Milestone');
    }
  },
  addTask: async(_, { TaskInput }) => {
        try {
            const { title, description, goal_id, milestone_id, due_date, due_time, priority, recurrence_start, recurrence_rule, recurrence_time, timezone, recurrence_end, completed } = TaskInput;
            const newTask = await Task.create({
                title, 
                description, 
                goal_id, 
                milestone_id, 
                due_date,  
                due_time,
                priority, 
                recurrence_rule,
                recurrence_start,
                timezone, 
                recurrence_start, 
                recurrence_end, 
                completed
            });
            return newTask;
        } catch (err) {
            console.error('Mongoose error:', err);
            throw new Error('Error creating Task');
        }
    },
  editTask: async(_, {id, TaskInput}) => {
        try {
            const { title, description, goal, milestone, due_date, due_time, priority, recurrence_rule, recurrence_time, timezone, recurrence_start,recurrence_end, completed} = TaskInput
            const updatedTask = await Task.findByIdAndUpdate(
                id,
                {
                    title,
                    description,
                    milestone_id: milestone,
                    goal_id: goal,
                    due_date,
                    due_time,
                    priority,
                    recurrence_rule,
                    recurrence_time,
                    timezone,
                    recurrence_start,
                    recurrence_end,
                    completed
                },
                { new: true }
            );
            if (!updatedTask) throw new Error('Task not found');
            return updatedTask;
        } catch (err) {
            console.error(err);
            throw new Error('Error updating Task')
        }
    },
   deleteTask: async(_, { id }) => {
    try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) throw new Error('Task not found');
    return true;
    } catch (err) {
      console.error("Delete Task error:", err);
      throw new Error('Error deleting Task');
    }
  },  
},
  Milestone: {
    goal: async(parent) => {
      if(!parent.goal_id) return null;
      return await Goal.findById(parent.goal_id);
    },
    tasks: async(parent) => {
      return await Task.find({milestone_id: parent._id});
    }
  },
  Goal: {
    milestones: async(parent) => {
      return await Milestone.find({goal_id: parent._id})
    },
    tasks: async(parent) => {
      return await Task.find({goal_id: parent._id})
    } 
  }

};



export default resolvers;

   // goalCategories: async() => {
    //     try {
    //         return await GoalCategory.find();
    //     } catch (err) {
    //         console.error(err);
    //         throw new Error('Error fetching goal categories');
    //     }
    // },

    // goalCategory: async (_, { id }) => {
    //     try {
    //         return await GoalCategory.findById(id).populate('goalCategory_id');
    //     } catch (err) {
    //         throw new Error('Goal Category not Found')
    //     }
    // }

    // addGoalCategory: async(_, { goalCategoryInput }) => {
    //      const { category_name, icon, color } = goalCategoryInput;
    //     try {
    //        const newGoalCategory = await GoalCategory.create({
    //             category_name,
    //             icon,
    //             color
    //         });
    //         return newGoalCategory;
    //     } catch (err) {
    //         console.error(err);
    //         throw new Error('Error creating Goal Category');
    //     }
    // },
    // editGoalCategory: async(_, { goalCategoryId, goalCategoryInput }) => {
    //     const { category_name, icon, color } = goalCategoryInput;
    //     try {
    //         const updatedGoalCategory = await GoalCategory.findByIdAndUpdate(
    //             goalCategoryId, 
    //             {
    //                 goal_name,
    //                 icon,
    //                 color
    //             },
    //             {new: true}
    //         );
    //         if (!updatedGoalCategory) throw new Error('GoalCategory not Found');
    //         return updatedGoalCategory;
    //     } catch (err) {
    //         console.error(err);
    //         throw new Error('Error updating Goal Category');
    //     }
    // },
    // deleteGoalCategory: async(_, { goalCategoryId }) => {
    //     try {
    //         const deletedGoalCategory = await GoalCategory.findByIdAndDelete(goalCategoryId);
    //         if(!deletedGoalCategory) throw new Error('GoalCategory not Found');
    //         return true;
    //     } catch (err) {
    //         console.error(err);
    //         return false;
    //     }
    // },