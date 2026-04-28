import { gql } from '@apollo/client';
import { TASK_FIELDS, MILESTONE_CREATE_FIELDS, GOAL_FIELDS, MILESTONE_FIELDS } from './queries.js';

export const ADD_GOAL = gql`
  mutation addGoal($goalInput: GoalInput!) {
    addGoal(goalInput: $goalInput) {
      _id
      goal_name
      description
      icon
      icon_color
      target_date
      status
      progress
      milestones {
        _id
        }
      tasks {
        _id
      }
    }
  }
`;

export const EDIT_GOAL = gql`
${GOAL_FIELDS}
${TASK_FIELDS}
${MILESTONE_FIELDS}
    mutation editGoal($id: ID!, $goalInput: GoalInput!) {
        editGoal(id: $id, goalInput: $goalInput){
            ...GoalFields
        }
    }`

export const DELETE_GOAL = gql`
    mutation deleteGoal($id: ID!) {
        deleteGoal(id: $id)
    }`

export const ADD_TASK = gql`
${TASK_FIELDS} 
    mutation addTask($TaskInput: TaskInput!) {
        addTask(TaskInput: $TaskInput) {
            ...TaskFields
        }
    }`

export const EDIT_TASK = gql`
${TASK_FIELDS}
    mutation editTask($id: ID!, $TaskInput: TaskInput!) {
        editTask(id: $id, TaskInput: $TaskInput) {
            ...TaskFields
        }
    }`

export const DELETE_TASK = gql`
    mutation deleteTask($id: ID!) {
        deleteTask(id: $id)
    }
    `

export const ADD_MILESTONE = gql`
${MILESTONE_CREATE_FIELDS}
    mutation addMilestone($MilestoneInput: MilestoneInput!) {
        addMilestone (MilestoneInput: $MilestoneInput) {
            ...MilestoneCreateFields
        }
    }`

export const EDIT_MILESTONE = gql`
${MILESTONE_CREATE_FIELDS}
    mutation editMilestone($id: ID!, $MilestoneInput: MilestoneInput!) {
        editMilestone(id: $id, MilestoneInput: $MilestoneInput){
            ...MilestoneCreateFields
        }
    }`

export const DELETE_MILESTONE = gql`
    mutation deleteMilestone($id: ID!) {
        deleteMilestone(id: $id)
    }`
