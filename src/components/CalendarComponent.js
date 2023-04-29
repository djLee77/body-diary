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
          console.log("exist");                                     //
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


//------페이지 구성--------------------------------------------------//
  return (                                                          //
    <div>                                                            
      <button onClick={onClickLogout}>로그아웃</button>           
      <Calendar 
      onChange={onChange} 
      value={value}
      // tileContent={renderTileContent} 
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
