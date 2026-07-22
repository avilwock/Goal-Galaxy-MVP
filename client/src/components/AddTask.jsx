import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { ADD_TASK } from "../utils/mutations";
import { QUERY_GOALS, QUERY_MILESTONES, QUERY_TASKS } from "../utils/queries";
import { buildRRule } from "../utils/recurrence";

const AddTaskForm = ({
  setShowForm,
  goalContextId = null,
  milestoneContextId = null,
  onTaskAdded
}) => {
  /* ---------------- CORE FIELDS ---------------- */

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const [priority, setPriority] = useState("");

  /* ---------------- RECURRENCE ---------------- */

  const [recurrenceRule, setRecurrenceRule] = useState(""); // daily/weekly/monthly
  const [recurrenceDays, setRecurrenceDays] = useState([]);
  const [recurrenceStart, setRecurrenceStart] = useState("");
  const [recurrenceEnd, setRecurrenceEnd] = useState("");

  /* THIS is the correct monthly control */
  const [monthlyDate, setMonthlyDate] = useState("");

  const [recurrenceTime, setRecurrenceTime] = useState("");

  /* ---------------- RELATIONSHIPS ---------------- */

  const [goalId, setGoalId] = useState(goalContextId || "");
  const [milestoneId, setMilestoneId] = useState(milestoneContextId || "");

  const isGoalContext = !!goalContextId;
  const isMilestoneContext = !!milestoneContextId;

  /* ---------------- DATA ---------------- */

  const { data: goalsData } = useQuery(QUERY_GOALS);
  const { data: milestonesData } = useQuery(QUERY_MILESTONES);

  const goals = goalsData?.goals || [];
  const milestones = milestonesData?.milestones || [];

  /* ---------------- MUTATION ---------------- */

 const [addTask] = useMutation(ADD_TASK, {
  refetchQueries: goalContextId
    ? [
        {
          query: QUERY_GOALS,
          variables: { id: goalContextId },
        },
      ]
    : [{ query: QUERY_TASKS }],
  awaitRefetchQueries: true,
});
  /* ---------------- WEEKDAY TOGGLE ---------------- */

  const toggleDay = (day) => {
    setRecurrenceDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const days = [
    "monday","tuesday","wednesday","thursday",
    "friday","saturday","sunday"
  ];

  /* ---------------- TIME DISPLAY ONLY ---------------- */

  const format12Hour = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    let hour = Number(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    await addTask({
      variables: {
        TaskInput: {
          title,
          description,
          due_date: dueDate
            ? `${dueDate}T12:00:00`
            : null,
          due_time: dueTime || null,
          priority: priority || null,

          recurrence_rule: buildRRule({
            recurrenceRule,
            recurrenceDays,
            recurrenceStart,
            recurrenceEnd,
            monthlyDate
          }),

          recurrence_start: recurrenceStart || null,
          recurrence_end: recurrenceEnd || null,
          recurrence_time: recurrenceTime || null,

          goal_id: goalContextId || goalId || null,
          milestone_id: milestoneContextId || milestoneId || null
        }
      }
    });
    if(onTaskAdded) {
      await onTaskAdded();
    }

    /* RESET */
    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setPriority("");

    setRecurrenceRule("");
    setRecurrenceDays([]);
    setRecurrenceStart("");
    setRecurrenceEnd("");
    setRecurrenceTime("");
    setMonthlyDate("");

    setGoalId(goalContextId || "");
    setMilestoneId(milestoneContextId || "");

    setShowForm(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 text-white rounded">

      <h2>Add Task</h2>

      {/* BASIC */}
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} />

      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />

      <div>
        <input
          type="time"
          value={dueTime}
          onChange={e => setDueTime(e.target.value)}
        />
        <span>{format12Hour(dueTime)}</span>
      </div>

      {/* GOALS */}
      {!isGoalContext && (
        <select value={goalId} onChange={e => setGoalId(e.target.value)}>
          <option value="">No Goal</option>
          {goals.map(g => (
            <option key={g._id} value={g._id}>{g.goal_name}</option>
          ))}
        </select>
      )}

      {/* MILESTONES */}
      {!isMilestoneContext && (
        <select value={milestoneId} onChange={e => setMilestoneId(e.target.value)}>
          <option value="">No Milestone</option>
          {milestones.map(m => (
            <option key={m._id} value={m._id}>{m.title}</option>
          ))}
        </select>
      )}

      {/* PRIORITY */}
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="">Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* RECURRENCE TYPE */}
      <select value={recurrenceRule} onChange={e => setRecurrenceRule(e.target.value)}>
        <option value="">None</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      {/* WEEKLY DAYS */}
      {recurrenceRule === "weekly" && (
        <div>
          {days.map(d => (
            <button type="button" key={d} onClick={() => toggleDay(d)}>
              {d}
            </button>
          ))}
        </div>
      )}

      {/* MONTHLY FIX — REAL DATE PICKER */}
      {recurrenceRule === "monthly" && (
        <input
          type="date"
          value={monthlyDate}
          onChange={e => setMonthlyDate(e.target.value)}
        />
      )}

      {/* RECURRENCE RANGE */}
      <input type="date" value={recurrenceStart} onChange={e => setRecurrenceStart(e.target.value)} />
      <input type="date" value={recurrenceEnd} onChange={e => setRecurrenceEnd(e.target.value)} />

      {/* TIME */}
      <input type="time" value={recurrenceTime} onChange={e => setRecurrenceTime(e.target.value)} />

      <button type="submit">Save Task</button>
    </form>
  );
};

export default AddTaskForm;