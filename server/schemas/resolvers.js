import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Goal, GoalCategory, Milestone, Task } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

const resolvers = {
  Query: {
    goals: async () => {
      try {
        return await Goal.find().populate('category_id');
      } catch (err) {
        console.error(err);
        throw new Error('Error fetching goals');
      }
    },

    goal: async (_, { id }) => {
      try {
        return await Goal.findById(id).populate('category_id');
      } catch (err) {
        console.error(err);
        throw new Error('Goal not found');
      }
    },

    goalCategories: async() => {
        try {
            return await GoalCategory.find();
        } catch (err) {
            console.error(err);
            throw new Error('Error fetching goal categories');
        }
    },

    goalCategory: async (_, { id }) => {
        try {
            return await GoalCategory.findById(id).populate('goalCategory_id');
        } catch (err) {
            throw new Error('Goal Category not Found')
        }
    }
  },

  Mutation: {

    addGoalCategory: async(_, { goalCategoryInput }) => {
         const { category_name, icon, color } = goalCategoryInput;
        try {
           const newGoalCategory = await GoalCategory.create({
                category_name,
                icon,
                color
            });
            return newGoalCategory;
        } catch (err) {
            console.error(err);
            throw new Error('Error creating Goal Category');
        }
    },
    editGoalCategory: async(_, { goalCategoryId, goalCategoryInput }) => {
        const { category_name, icon, color } = goalCategoryInput;
        try {
            const updatedGoalCategory = await GoalCategory.findByIdAndUpdate(
                goalCategoryId, 
                {
                    goal_name,
                    icon,
                    color
                },
                {new: true}
            );
            if (!updatedGoalCategory) throw new Error('GoalCategory not Found');
            return updatedGoalCategory;
        } catch (err) {
            console.error(err);
            throw new Error('Error updating Goal Category');
        }
    },
    deleteGoalCategory: async(_, { goalCategoryId }) => {
        try {
            const deletedGoalCategory = await GoalCategory.findByIdAndDelete(goalCategoryId);
            if(!deletedGoalCategory) throw new Error('GoalCategory not Found');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },
    addGoal: async (_, { goalInput }) => {
      try {
        const { goal_name, description, category, icon, icon_color, target_date, status, progress } = goalInput;
        const newGoal = await Goal.create({
          goal_name,
          description,
          category_id: category,
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

    editGoal: async (_, { goalId, goal_name, description, category, icon, icon_color, target_date, status, progress }) => {
      try {
        const updatedGoal = await Goal.findByIdAndUpdate(
          goalId,
          {
            goal_name,
            description,
            category_id: category,
            icon,
            icon_color,
            target_date,
            status,
            progress,
          },
          { new: true }
        );
        if (!updatedGoal) throw new Error('Goal not found');
        return updatedGoal;
      } catch (err) {
        console.error(err);
        throw new Error('Error updating Goal');
      }
    },

    deleteGoal: async (_, { goalId }) => {
      try {
        const deletedGoal = await Goal.findByIdAndDelete(goalId);
        if (!deletedGoal) throw new Error('Goal not found');
        return deletedGoal;
      } catch (err) {
        console.error(err);
        throw new Error('Error deleting Goal');
      }
    },
  },

  // Optional: if you want nested Goal.category field resolution
  Goal: {
    category: async (parent) => {
      if (!parent.category_id) return null;
      return await GoalCategory.findById(parent.category_id);
    },
  },
};

export default resolvers;