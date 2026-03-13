import React from 'react';

const StatusIcon = ({ status }) => {
    const normalized = status?.toLowerCase();
    let color = 'gray';
    let label = status || 'Unknown';

    if (normalized === 'active') color = 'green';
        else if (normalized === 'inactive') color = 'red';
        else if (normalized === 'paused') color = 'orange';

    return (
        <span
        style= {{
            color,
            fontWeight: 'bold',
            display: 'inline-block',
            padding: '2px 6px',
            border: `1px solid ${color}`,
            borderRadius: '4px',
            fontSize: '0.9rem'
        }}
        >
            {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
    )
}

export default StatusIcon;