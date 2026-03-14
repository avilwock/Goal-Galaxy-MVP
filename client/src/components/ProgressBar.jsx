import React from 'react';

const ProgressBar = ({ milestones }) => {
  const total = milestones?.length || 0;
  const completed = milestones?.filter(m => m.completed).length || 0;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);


  return (
    <div
      style={{
        display: 'block',       // forces new line
        width: '100%',          // span full container
        marginTop: '8px',       // spacing from text above
      }}
    >
      {/* 2️⃣ The bar container */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden',
          height: '14px',
        }}
      >
        {/* 3️⃣ The filled progress */}
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: progress === 100 ? 'green' : '#4caf50',
            height: '100%',
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </div>

      {/* 4️⃣ Optional percentage text */}
      <div
        style={{
          fontSize: '0.8rem',
          marginTop: '2px',
          textAlign: 'right',
        }}
      >
        {/* {progress}% */}
      </div>
    </div>
  );
};

export default ProgressBar;