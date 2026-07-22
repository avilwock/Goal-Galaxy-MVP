import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client/react";
import { QUERY_TASKS } from "../utils/queries";

const Calendar=() => {
    const navigate=useNavigate();
    
    const {loading, error, data } = useQuery(QUERY_TASKS);

    if (loading) return <p>Loading calendar...</p>;
    if (error) return <p>{error.message}</p>

    const events = (data?.tasks || [])
        .filter(task=> task.due_date)
        .map(task => ({
            id: task._id,
            title: task.title,
            start: task.due_date.split("T")[0],
            extendedProps: {
                goalIcon: task.goal?.icon,
                goalColor:task.goal?.icon_color,
                goalName:task.goal?.goal_name
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
            dayMaxEventRows={4}
            moreLinkClick="day"
            contentHeight={700}
            dateClick={(info) => {
            navigate(`/tasks/date/${info.dateStr}`);
            }}
            eventContent={(eventInfo) => {
                const iconName = eventInfo.event.extendedProps.goalIcon;

                const Icon = Icons[
                iconName
                    ?.split("-")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join("")
                ];

                return (
                <div className="flex items-center gap-1">
                    {Icon && (
                    <Icon
                        size={14}
                        color={eventInfo.event.extendedProps.goalColor}
                    />
                    )}

                    <span>
                    {eventInfo.event.title}
                    </span>
                </div>
                );
            }}
            />
    )
}

export default Calendar;