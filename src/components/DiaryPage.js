import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Candito1 from "./programs/Candito1";
import Candito2 from "./programs/Candito2";
import Candito3 from "./programs/Candito3";

const programComponents = {
  Candito1: Candito1,
  Candito2: Candito2,
  Candito3: Candito3,
};

const DiaryPage = () => {
  const location = useLocation();
  const programTodo = location.state?.programTodo;

  //--------페이지 데이터 변수들------------------------------//
  const { date } = useParams(); //
  const [title, setTitle] = useState(""); //
  const [maxWeight, setMaxWeight ] = useState(0);
  const [exerciseData, setExerciseData] = useState({
    //
    exercise1: { name: "", content: "" }, //
    exercise2: { name: "", content: "" }, //
    exercise3: { name: "", content: "" }, //
    exercise4: { name: "", content: "" }, //
    exercise5: { name: "", content: "" }, //
    exercise6: { name: "", content: "" }, //
  });

  const SelectedProgram = programComponents[programTodo];
  //---------------------------------------------------------//

  const handleTitle = (e) => {
    setTitle(e.target.value); //
  };

  const handleMaxWeight = (e) => {
    setMaxWeight(e.target.value); //
  };

  //--------운동 종목, 운동내용 input값----------------------------------------------------------------------//
  const handleChange = (e, exerciseKey) => {
    //
    const { name, value } = e.target; //
    setExerciseData({
      //
      ...exerciseData, //
      [exerciseKey]: { ...exerciseData[exerciseKey], [name]: value }, //
    }); //
  }; //
  //--------------------------------------------------------------------------------------------------------//

  //-----------저장버튼 클릭시 실행 함수---------------------------------------------------------------------//
  const handleSubmit = async (e) => {
    //
    e.preventDefault(); //
    try {
      //
      const response = await axios.post("http://localhost:3001/exercises", {
        //
        userid: localStorage.getItem("userid"), //
        date: date,
        title: title, //
        maxWeight: maxWeight,
        ...exerciseData, //
      }); //
      console.log("Server response:", response.data); //
      alert("저장되었습니다."); //
    } catch (error) {
      //
      console.error("Error sending data to server:", error); //
    } //
  }; //
  //--------------------------------------------------------------------------------------------------------//

  //---------useEffect-------------------------------------//
  useEffect(
    //
    () => {
      //
      console.log(date); //
    } //
    // 페이지 호출 후 처음 한번만 호출될 수 있도록 [] 추가   //
  ); //
  //-------------------------------------------------------//

  //-----------페이지 구성--------------------------------------------//
  return (
    //
    <div>
      <div style={{ float: "right", marginRight: "50%" }}>
        <h2>{date}</h2>
        <h1>운동 다이어리</h1>
        <div>
          <p>제목</p>
          <input onChange={handleTitle}></input>
        </div>
        <form onSubmit={handleSubmit}>
          {Object.keys(exerciseData).map((exerciseKey) => (
            <div key={exerciseKey}>
              <input
                type="text"
                name="name"
                placeholder="운동 종목명"
                value={exerciseData[exerciseKey].name}
                onChange={(e) => handleChange(e, exerciseKey)}
              />
              <input
                type="text"
                name="content"
                placeholder="운동 수행 내용"
                value={exerciseData[exerciseKey].content}
                onChange={(e) => handleChange(e, exerciseKey)}
              />
            </div>
          ))}

          <div>
            <p>1RM</p>
            <input type="text" onChange={handleMaxWeight}></input>
          </div>
          <button type="submit">저장</button>
        </form>
      </div>
      <div style={{ float: "left" }}>
        {SelectedProgram && <SelectedProgram />}
      </div>
    </div>
  ); //
}; //
//-----------------------------------------------------------------//

export default DiaryPage;
