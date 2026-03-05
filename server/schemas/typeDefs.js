const typeDefs = `
  scalar Date

  type Query {
    goalCategories: [GoalCategory]
    goalCategory(id:ID!): GoalCategory
    goals: [Goal]
    milestones: [Milestone]
    tasks: [Task]
    goal(id: ID!): Goal
    milestone(id: ID!): Milestone
    task(id: ID!): Task
  }

  type Goal {
    _id: ID!
    goal_name: String!
    description: String
    milestones: [Milestone]
    tasks: [Task]
    # category: GoalCategory
    icon: String
    icon_color: String
    target_date: Date
    status: String
    progress: Int
  }

  type GoalCategory {
    _id: ID!
    category_name: String!
    icon: String!
    color: String
    createdAt: Date
    updatedAt: Date
  }

  type Milestone {
    _id: ID!
    title: String!
    goal_id: ID!
    goal: Goal
    description: String
    target_date: Date
    completed: Boolean
    tasks: [Task]
    order: Int
    createdAt: Date
    updatedAt: Date
  }

  type Task {
    _id: ID!
    title: String!
    description: String
    goal: Goal
    milestone: Milestone
    due_date: Date
    due_time: String
    priority: String
    recurrence: String
    recurrence_days: [Int]
    recurrence_end_date: Date
    completed: Boolean
    createdAt: Date
    updatedAt: Date
  }

  input GoalCategoryInput {
    category_name: String!
    icon: String!
    color: String
  }

  input GoalInput {
    goal_name: String!
    description: String
    # category_id: ID!
    icon: String
    icon_color: String
    target_date: Date
    status: String
    progress: Int
  }

  input MilestoneInput {
    title: String!
    goal_id: ID!
    description: String
    target_date: Date
    completed: Boolean
    order: Int
  }

  input TaskInput {
    title: String!
    description: String
    goal_id: ID
    milestone_id: ID
    due_date: Date
    due_time: String
    priority: String
    recurrence: String
    recurrence_days: [Int]
    recurrence_end_date: Date
    completed: Boolean
  }

  type Mutation {
    addGoal(goalInput: GoalInput!): Goal
    editGoal(id: ID!, goalInput: GoalInput!): Goal
    deleteGoal(id: ID!): Boolean

    addGoalCategory(goalCategoryInput: GoalCategoryInput!): GoalCategory
    editGoalCategory(goalCategoryId: ID!, goalCategoryInput: GoalCategoryInput!): GoalCategory
    deleteGoalCategory(id: ID!): Boolean

    addMilestone(MilestoneInput: MilestoneInput!): Milestone
    editMilestone(id: ID!, MilestoneInput: MilestoneInput!): Milestone
    deleteMilestone(id: ID!): Boolean

    addTask(TaskInput: TaskInput!): Task
    editTask(id: ID!, TaskInput: TaskInput!): Task
    deleteTask(id: ID!): Boolean
  }
`;

export default typeDefs;