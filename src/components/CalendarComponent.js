import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CalendarComponent = () => {
  useEffect(
    () => {
      if (localStorage.getItem("isLogin") !== "true") {
        navigate("/login");
      }
    }
    // 페이지 호출 후 처음 한번만 호출될 수 있도록 [] 추가
  );

  const [value, setValue] = useState(new Date());
  const navigate = useNavigate();

  const onClickLogout = () => {
    localStorage.setItem("isLogin", "false");
    navigate("/login");
  };

  const onChange = (nextValue) => {
    setValue(nextValue);
    const dateString = toLocalDateString(nextValue);
    navigate(`/diary/${dateString}`);
  };

  return (
    <div>
      <button onClick={onClickLogout}>로그아웃</button>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

//------------------날짜 설정 함수---------------------------------------//
function toLocalDateString(date) {                                      //
                                                                        //
  const year = date.getFullYear();                                      //
  const month = String(date.getMonth() + 1).padStart(2, "0");           //
  const day = String(date.getDate()).padStart(2, "0");                  //
                                                                        //
  return `${year}-${month}-${day}`;                                     //
}                                                                       //
export default CalendarComponent;                                       //
//------------------------------------------------------------------------
