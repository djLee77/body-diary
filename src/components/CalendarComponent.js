import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const CalendarComponent = () => {

//---렌더링 될때마다 실행시킬 함수-----------------------------------//  
  useEffect(                                                        //
    () => {                                                         //
      if (localStorage.getItem("isLogin") !== "true") {             //
        navigate("/login");                                         //
      }                                                             //
    }                                                               //
    // 페이지 호출 후 처음 한번만 호출될 수 있도록 [] 추가            //
  );                                                                //
//------------------------------------------------------------------//


//----useState 변수들-----------------------------------------------//
  const [value, setValue] = useState(new Date());                   //
//------------------------------------------------------------------//  
  
  const navigate = useNavigate();                                   


//----로그아웃 함수--------------------------------------------------//
  const onClickLogout = () => {                                     //
    localStorage.setItem("isLogin", "false");                       //
    navigate("/login");                                             //
  };                                                                //
//------------------------------------------------------------------//


//-----날짝 클릭시 실행 함수-----------------------------------------//
  const onChange = (nextValue) => {                                 //
    setValue(nextValue);                                            //
    const dateString = toLocalDateString(nextValue);                //  
    const data = {                                                  //
      userid: localStorage.getItem("userid"),                       //
      date: dateString                                              //
    }                                                               //
                                                                    //
    axios.post("http://localhost:3001/diary_url", data)             //
      .then((response) => {                                         //
        console.log(response.data.exist)                            //
        if(response.data.exist === true){                           //
          navigate(`/diary_view/${dateString}`)                     //
        }else{                                                      //
          navigate(`/diary/${dateString}`);                         //
        }                                                           //
      })                                                            //
      .catch((error) => {                                           //
        console.log(error);                                         //
        // 에러가 발생했을 때 처리할 코드                            //
      });                                                           //
  };                                                                //
//------------------------------------------------------------------//

//------------------문자열 -> 날짜-----------------------------------//
const parseDateString = (dateString) => {                           // 
  const [year, month, day] = dateString.split("-").map(Number);     //
  return new Date(year, month - 1, day);                            //
};                                                                  //
//------------------------------------------------------------------//

//-----------------캘린더 날짜 타이틀 설정 함수----------------------------------------//
const renderTileContent = ({ date, view }) => {
  if (view === "month") {
    const customDates = [
      "2023-05-05", // 2023년 5월 5일
      "2023-05-10", // 2023년 5월 10일
    ];

    const isCustomDate = customDates.some((customDateString) => {
      const customDate = parseDateString(customDateString);
      return (
        customDate.getDate() === date.getDate() &&
        customDate.getMonth() === date.getMonth() &&
        customDate.getFullYear() === date.getFullYear()
      );
    });

    if (isCustomDate) {
      return (
          <div className="customTitle">어깨</div>
      );
    } else {
      return null;
    }
  }
  return null;
};                                                          //
//------------------------------------------------------------------------------------//


//------페이지 구성--------------------------------------------------//
  return (                                                          //
    <div>                                                            
      <button onClick={onClickLogout}>로그아웃</button>           
      <Calendar 
      onChange={onChange} 
      value={value}
      tileContent={renderTileContent} 
      />
      
    </div>
  );
};                                                                  //
//------------------------------------------------------------------//


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
