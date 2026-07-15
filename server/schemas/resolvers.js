import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Goal, GoalCategory, Milestone, Task, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

const resolvers = {
  Query: {

    me: async (_, args, context) => {
      console.log("CONTEXT USER:", context.user);

      if (!context.user) {
        throw new AuthenticationError('Could not authenticate user');
      }

      try {
        const userData = await User.findById(context.user.id || context.user._id);

        return userData;
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Internal server error');
      }
    },
    goals: async (_, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in");
      }

      try {
        return await Goal.find({
          user: context.user.id
        }); //add back with .populate('category_id')
      } catch (err) {
        console.error(err);
        throw new Error('Error fetching goals');
      }
    },

    goal: async (_, { id }, context) => {
  if (!context.user) {
    throw new AuthenticationError("Not logged in");
  }

  try {
    const goal = await Goal.findOne({
      _id: id,
      user: context.user.id
    });

    if (!goal) {
      throw new Error("Goal not found");
    }

    const tasks = await Task.find({ goal_id: id });

    return {
      ...goal.toObject(),
      tasks
    };

  } catch (err) {
    console.error(err);
    throw new Error("Goal not found");
  }
},
    milestones: async (_, args, context) => {
  if (!context.user) {
    throw new AuthenticationError("Not logged in");
  }

  try {
    const userGoals = await Goal.find({
      user: context.user.id
    }).select("_id");

    const goalIds = userGoals.map((goal) => goal._id);

    return await Milestone.find({
      goal_id: { $in: goalIds }
    });

  } catch (err) {
    console.error(err);
    throw new Error("Error fetching Milestones");
  }
},
 milestone: async (_, { id }, context) => {
  if (!context.user) {
    throw new AuthenticationError("Not logged in");
  }

  try {
    const milestone = await Milestone.findById(id).populate("goal_id");

    if (!milestone) {
      throw new Error("Milestone not found");
    }

    if (milestone.goal_id.user.toString() !== context.user.id) {
      throw new AuthenticationError("Not authorized");
    }

    return milestone;

  } catch (err) {
    console.error(err);
    throw new Error("Milestone not found");
  }
},
   tasks: async (_, args, context) => {
  if (!context.user) {
    throw new AuthenticationError("Not logged in");
  }

  try {
    return await Task.find({
      user_id: context.user.id
    });

  } catch (err) {
    console.error(err);
    throw new Error("Error fetching Tasks");
  }
},
   task: async (_, { id }, context) => {
  if (!context.user) {
    throw new AuthenticationError("Not logged in");
  }

  try {
    const task = await Task.findById(id).populate("goal_id");

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.user_id.toString() !== context.user.id) {
      throw new AuthenticationError("Not authorized");
    }

    return task;
  } catch (err) {
    console.error(err);
    throw new Error("Task not found");
  }
},

 
  },

  Mutation: {

    addUser: async(parent, {userInput}) => {
      console.log("received arguments:", userInput);
      try {
        const user = await User.create(userInput);
        const token = signToken(user);
        return{
          token, 
          user
        };
      }
     catch (error) {
        console.error('Error creating user:', error);
        throw new Error(error.message);
      }
    },
    login: async (parent, {email, password}) => {
      const user = await User.findOne({ email }).select('+password');

      if(!user) {
        throw new AuthenticationError('Not a valid user');
      }

      const correctPw = await user.isCorrectPassword(password);

      if(!correctPw) {
        throw new AuthenticationError('Incorrect password'); 
      }

      const token = signToken(user);
      return {
        token,
        user
      };
    },
   editUser: async (parent, { id, userInput }, context) => {
      if (
        context.user.id !== id &&
        context.user.role !== 'admin'
      ) {
        throw new AuthenticationError('Not allowed');
      }

      try {
        const user = await User.findById(id).select('+password');

        if (!user) {
          throw new Error('User not found');
        }

        Object.assign(user, userInput);

        await user.save();

        return user;
      } catch (error) {
        console.error('Error editing user:', error);
        throw new Error('Failed to edit user');
      }
    },

   addGoal: async (_, { goalInput }, context) => {
    console.log("USER IN CONTEXT:", context.user);
      try {
        if (!context.user) {
          throw new AuthenticationError('Not logged in');
        }

        const newGoal = await Goal.create({
          ...goalInput,
          user: context.user.id
        });

        return newGoal;
      } catch (err) {
        console.error('Mongoose create goal failed:', err);
        throw err;
      }
    },

    editGoal: async (_, { id, goalInput }) => {
      try {
        const updatedGoal = await Goal.findByIdAndUpdate(
          id,
          {...goalInput },
          { new: true, runValidators:true }
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
            
            const newMilestone = await Milestone.create(MilestoneInput);
            return newMilestone;
        } catch (err) {
            console.error('Mongoose error:', err);
            throw new Error('Error creating Milestone');
        }
    },
    editMilestone: async(_, {id, MilestoneInput}) => {
        try {

            const updatedMilestone = await Milestone.findByIdAndUpdate(
                id,
                {...MilestoneInput},
                { new: true, runValidators: true }
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
  addTask: async (_, { TaskInput }, context) => {
      try {
          if (!context.user) {
              throw new Error("Not logged in");
          }

          const newTask = await Task.create({
              ...TaskInput,
              user_id: context.user.id,
          });

          return newTask;
      } catch (err) {
          console.error("Mongoose error:", err);
          throw new Error("Error creating Task");
      }
  },
  editTask: async(_, {id, TaskInput}) => {
        try {
            const updatedTask = await Task.findByIdAndUpdate(
                id,
                {...TaskInput},
                { new: true, runValidators: true }
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
    },
  },
  Goal: {
    
    milestones: async(parent) => {
      return await Milestone.find({goal_id: parent._id})
    },
    tasks: async(parent) => {
      return await Task.find({goal_id: parent._id})
    },
    user: async(parent) => {
      return await User.findById(parent.user);
    }
  },

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