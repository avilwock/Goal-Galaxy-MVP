import { gql } from '@apollo/client';

export const TASK_FIELDS = gql`
    fragment TaskFields on Task {
        _id
        title
        description
        due_date
        due_time
        priority
        recurrence
        recurrence_days
        recurrence_end_date
        completed
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

export const MILESTONE_CREATE_FIELDS = gql`
  fragment MilestoneCreateFields on Milestone {
    _id
    title
    description
    target_date
    completed
    order
  }
`;

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
${GOAL_FIELDS}
query goal($id: ID!) {
    goal(id: $id) {
        ...GoalFields
    }
}`

export const QUERY_GOALS = gql`
${TASK_FIELDS}
${MILESTONE_FIELDS}
${GOAL_FIELDS}
query goals {
    goals {
        ...GoalFields
    }
}`

export const QUERY_MILESTONE = gql`
${TASK_FIELDS}
${MILESTONE_FIELDS}
query milestone($id: ID!) {
    milestone(id:$id) {
        ...MilestoneFields
    }
}`

export const QUERY_MILESTONES = gql`
${TASK_FIELDS}
${MILESTONE_FIELDS}
query milestones {
    milestones {
        ...MilestoneFields
    }
}`

export const QUERY_TASK = gql`
${TASK_FIELDS}
query task($id: ID!) {
    task(id:$id) {
        ...TaskFields
    }
}`

export const QUERY_TASKS = gql`
${TASK_FIELDS}
query tasks {
    tasks {
        ...TaskFields
    }
}`