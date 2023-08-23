import React, { useState, useEffect } from 'react';

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => (prevProgress >= 100 ? 0 : prevProgress + 1));
    }, 50);

    return () => clearInterval(timer);
    
  }, []);

  useEffect(() => {
    axios
      .post("http://localhost:3001/countDiaries", data)
      .then((response) => {
        localStorage.setItem("isLogin", response.data.success);
        console.log(
          "is Login in localstorage : " + localStorage.getItem("isLogin")
        );

        if (localStorage.getItem("isLogin") === "true") {
          console.log("Login success");
          localStorage.setItem("userid", inputId);
          navigate("/calendar");
        } else {
          alert("ID 혹은 Password를 확인해주세요.");
        }
      })
      .catch((error) => {
        console.log(error);
        // 에러가 발생했을 때 처리할 코드
      });
  })
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
