import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Input,
  Checkbox,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import "./DiaryPage.css";
import { useNavigate } from "react-router-dom";

const DiaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const programTodo = location.state?.programTodo;

  const { date } = useParams();
  const [event, setEvent] = useState("");
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
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

  const handleEvent = (e) => {
    setEvent(e.target.value);
  };

  const handleMemo = (e) => setMemo(e.target.value);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3001/exercises", { // eslint-disable-line no-unused-vars
        userid: localStorage.getItem("userid"),
        date: date,
        title: title,
        maxWeight: maxWeight,
        event: event,
        memo: memo,
        ...exerciseData,
      });
      alert("저장되었습니다.");
      navigate("/");
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
        <div className="box-left">
          <TextField
            helperText="Enter the Title"
            label="Title"
            onChange={handleTitle}
          ></TextField>
          <div style={{ float: "right" }}>
            <div
              style={{
                float: "left",
                margin: "4px",
                paddingRight: "10px",
                color: "#656D76",
              }}
            >
              <h1>{date}</h1>
            </div>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </div>
          <div style={{ float: "right" }}></div>
          <form className="diary" style={{ backgroundColor: "white" }}>
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
          <div>
            <div style={{ float: "left" }}>
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  1RM
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={event}
                  onChange={handleEvent}
                  autoWidth
                  label="Event"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"Benchpress"}>Benchpress</MenuItem>
                  <MenuItem value={"Deadlift"}>Deadlift</MenuItem>
                  <MenuItem value={"Squat"}>Squat</MenuItem>
                  <MenuItem value={"O.H.P"}>O.H.P</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div style={{ paddingTop: "8px" }}>
              <TextField
                label="1RM-WEIGHT"
                type="text"
                onChange={handleMaxWeight}
              ></TextField>
            </div>
          </div>
        </div>
      </div>
      <div className="box-right">
        <div className="header">
          <div className="memo-box">
            <div style={{float : "right", color : "#656D76", padding : "7px"}}>
              <h3>Memo</h3>
            </div>
            <TextField
              fullWidth
              id="filled-multiline-static"
              label="How was your workout today?"
              multiline
              rows={16}
              variant="filled"
              onChange={handleMemo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
