import React, { useState, useEffect } from 'react';

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => (prevProgress >= 100 ? 0 : prevProgress + 1));
    }, 50);

    return () => clearInterval(timer);

    // Todo : server에서 작성된 다이어리 개수를 가져옴
  }, []);

  return (
    <div style={{ width: '100%', margin: '10px' }}>
      <div
        style={{
          width: '100%',
          height: '10px',
          borderRadius: '5px',
          background: '#f3f3f3',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '10px',
            borderRadius: '5px',
            background: '#4caf50',
          }}
        ></div>
      </div>
      <p>{progress}%</p>
    </div>
  );
}

export default ProgressBar;
