import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Input, Checkbox, Button } from "@mui/material";
import "./DiaryPage.css";

const DiaryPage = () => {
  const location = useLocation();
  const programTodo = location.state?.programTodo;

  const { date } = useParams();
  const [title, setTitle] = useState("");
  const [maxWeight, setMaxWeight] = useState(0);
  const [programData, setProgramData] = useState(null);
  const [exerciseData, setExerciseData] = useState({
    exercise1: { name: "", content: "", isChecked: false },
    exercise2: { name: "", content: "", isChecked: false },
    exercise3: { name: "", content: "", isChecked: false },
    exercise4: { name: "", content: "", isChecked: false },
    exercise5: { name: "", content: "", isChecked: false },
    exercise6: { name: "", content: "", isChecked: false },
  });

  const handleTitle = (e) => setTitle(e.target.value);
  const handleMaxWeight = (e) => setMaxWeight(e.target.value);

  const handleChange = (e, exerciseKey) => {
    const { name, value } = e.target;
    setExerciseData({
      ...exerciseData,
      [exerciseKey]: { ...exerciseData[exerciseKey], [name]: value },
    });
  };

  const handleCheckbox = (e, exerciseKey) => {
    const { checked } = e.target;
    setExerciseData({
      ...exerciseData,
      [exerciseKey]: {
        ...exerciseData[exerciseKey],
        isChecked: checked,
        name: checked
          ? programData.programs[exerciseKey.slice(-1) - 1]?.title
          : "",
        content: checked
          ? programData.programs[exerciseKey.slice(-1) - 1]?.content
          : "",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/exercises", {
        userid: localStorage.getItem("userid"),
        date: date,
        title: title,
        maxWeight: maxWeight,
        ...exerciseData,
      });
      console.log("Server response:", response.data);
      alert("저장되었습니다.");
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/program_data",
          { name: programTodo }
        );
        setProgramData(response.data);
      } catch (error) {
        console.error("Error fetching diary data:", error);
      }
    };
    fetchData();
  }, [programTodo]);

  return (
    <div>
      <div className="container">
        <div className="box">
          <p>제목</p>
          <Input onChange={handleTitle}></Input>
          <form className="diary" onSubmit={handleSubmit}>
            <Button type="submit">저장</Button>
            {Object.keys(exerciseData).map((exerciseKey, index) => (
              <div style={{ width: "600px" }} key={exerciseKey}>
                <Input
                  style={{ marginRight: "10px" }}
                  type="text"
                  name="name"
                  placeholder={
                    (programData && programData.programs[index]?.title) ||
                    "content"
                  }
                  value={exerciseData[exerciseKey].name}
                  onChange={(e) => handleChange(e, exerciseKey)}
                />
                <Input
                  type="text"
                  name="content"
                  placeholder={
                    (programData && programData.programs[index]?.content) ||
                    "set/lap/weight"
                  }
                  value={exerciseData[exerciseKey].content}
                  onChange={(e) => handleChange(e, exerciseKey)}
                />
                {programData && programData.programs[index] && (
                  <Checkbox
                    checked={exerciseData[exerciseKey].isChecked}
                    onChange={(e) => handleCheckbox(e, exerciseKey)}
                  />
                )}
              </div>
            ))}
          </form>
        </div>
      </div>
      <div className="box-right">
        <div style={{ float: "top" }}>
          <p>1RM</p>
          <Input type="text" onChange={handleMaxWeight}></Input>
        </div>
        <div style={{ float: ""}}>
          <h1>{date}</h1>
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
