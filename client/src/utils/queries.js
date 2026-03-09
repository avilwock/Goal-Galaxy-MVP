import { gql } from '@apollo/client';

export const TASK_FIELDS = gql`
    fragment TaskFields on Task {
        _id
        completed
        description
        due_date
        recurrence_pattern
        title
    }`


export const MILESTONE_FIELDS = gql`
    fragment MilestoneFields on Milestone {
        _id
        title
        description
        target_date
        completed
        order
        tasks {
            ...TaskFields
        }
    }`

export const GOAL_FIELDS = gql`
    fragment GoalFields on Goal {
    _id
    goal_name
    description
    icon
    icon_color
    target_date
    status
    progress
    milestones {
        ...MilestoneFields
    }
    tasks {
        ...TaskFields
    }
}`

export const QUERY_GOAL = gql`
${TASK_FIELDS}
${MILESTONE_FIELDS}

query goal($id: ID!) {
    goal(id: $id) {
    _id
    goal_name
    description
    icon
    icon_color
    target_date
    status
    progress
    milestones {
        ...MilestoneFields
    }
    tasks {
    ...TaskFields
    }
    }
}`