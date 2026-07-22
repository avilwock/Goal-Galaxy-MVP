import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useQuery } from "@apollo/client/react";
import { QUERY_TASKS } from "../utils/queries";

const Calendar=() => {

    const {loading, error, data } = useQuery(QUERY_TASKS);

    if (loading) return <p>Loading calendar...</p>;
    if (error) return <p>{error.message}</p>

    const events = (data?.tasks || [])
        .filter(task=> task.due_date)
        .map(task => ({
            id: task._id,
            title: task.title,
            start: task.due_date,
            extendedProps: {
                description: task.description,
                priority: task.priority,
                completed: task.completed
            }
        }));

    return( 
        <FullCalendar
        plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin
        ]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        />
    )
}

export default Calendar;