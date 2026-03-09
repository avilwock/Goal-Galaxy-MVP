import { gql } from 'apollo/client';
import { TASK_FIELDS, MILESTONE_FIELDS, GOAL_FIELDS } from './queries.js';

export const ADD_GOAL = gql`
${GOAL_FIELDS}
    mutation addGoal($input: GoalInput!) {
        addGoal( input: $input) {
            ...GoalFields
        }
    }`

export const EDIT_GOAL = gql`
${GOAL_FIELDS}
    mutation editGoal($id: ID!, input: GoalInput!) {
        updatedGoal(id: $id, input: $input){
            ...GoalFields
        }
    }`

export const DELETE_GOAL = gql`
${GOAL_FIELDS}
    mutation deleteGoal($id: ID!) {
        deleteGoal(id: $id)
    }`

export const ADD_TASK = gql`
${TASK_FIELDS} 
    mutation addTask($input: TaskInput!) {
        addTask( input: $input) {
            ...TaskFields
        }
    }`

export const EDIT_TASK = gql`
${TASK_FIELDS}
    mutation editTask($id: ID!, $input: TaskInput) {
        updatedTask(id: $id, input: $input) {
            ...TaskFields
        }
    }`

export const DELETE_TASK = gql`
${TASK_FIELDS}
    mutation deleteTask($id: ID!) {
        deleteTask(id: $id)
    }
    `

export const ADD_MILESTONE = gql`
${MILESTONE_FIELDS}
    mutation addMilestone($input: MilestoneInput!) {
        addMilestone (input: $input) {
            ...MilestoneFields
        }
    }`

export const EDIT_MILESTONE = gql`
${MILESTONE_FIELDS}
    mutation editMilestone($id: ID!, $input: MilestoneInput) {
        updatedMilestone(id: $id, input: $input){
            ...MilestoneFields
        }
    }`

export const DELETE_MILESTONE = gql`
${MILESTONE_FIELDS}
    mutation deleteMilestone($id: ID!) {
        deleteMilestone(id: $id)
    }`
