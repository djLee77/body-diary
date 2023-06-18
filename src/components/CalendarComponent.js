import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./CalendarComponent.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Explain1 from "./explains/explain1";
import Explain2 from "./explains/explain2";
import Explain3 from "./explains/explain3";
import Explain4 from "./explains/explain4";
import Explain5 from "./explains/explain5";

const CalendarComponent = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("isLogin") !== "true") {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [value, setValue] = useState(new Date());
  const [tileContent, setTileContent] = useState([]);
  const [type, setType] = useState("");
  const [programSchedule, setProgramSchedule] = useState({});
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    const tiles = [];
    const startOfYear = new Date(value.getFullYear(), 0, 1);
    const endOfYear = new Date(value.getFullYear(), 11, 31);

    let day = startOfYear;

    while (day <= endOfYear) {
        tiles.push({ date: new Date(day), view: "month" });
        day = addDays(day, 1);
    }

    Promise.all(
      tiles.map((tile) =>
        renderTileContent(tile).then((content) => ({
          ...tile,
          content,
        }))
      )
    ).then(setTileContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [value, programSchedule]);

  //db에서 프로그램 가져오는 로직
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:3001/get_program", {
          userid: localStorage.getItem("userid"),
        });

        setStartDate(response.data.date);
        const schedule = createProgramSchedule(response.data.schedule);
        setProgramSchedule(schedule);
      } catch (error) {
        console.error("Error fetching diary data:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, programSchedule]);

  const handleType = (e) => {
    setType(e.target.value);
  };

  const saveProgramSchedule = async (type) => {
    try {
      console.log(type);
      const response = await axios.post(
        "http://localhost:3001/insert_program",
        {
          userid: localStorage.getItem("userid"),
          schedule: type,
          date: toLocalDateString(new Date()),
        }
      );
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  const getType = (e) => {
    alert("프로그램 일정이 내일부터 시작됩니다.");
    saveProgramSchedule(type);
  };
  const createProgramSchedule = (type) => {
    const schedule = {};
    const parsedStartDate = new Date(startDate);

    for (let i = 1; i <= 42; i++) {
      const date = addDays(parsedStartDate, i);
      schedule[toLocalDateString(date)] = `${type}${i}`;
    }

    return schedule;
  };

  const handleDelete = (e) => {
    try {
      alert("프로그램 일정이 초기화 되었습니다.");
      axios.post(
        "http://localhost:3001/delete_program",
        {
          userid: localStorage.getItem("userid"),
        }
      );
      
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  }

  const onChange = (nextValue) => {
    setValue(nextValue);
    const dateString = toLocalDateString(nextValue);
    const data = {
      userid: localStorage.getItem("userid"),
      date: dateString,
    };
    axios
      .post("http://localhost:3001/diary_url", data)
      .then((response) => {
        if (response.data.exist === true) {
          navigate(`/diary_view/${dateString}`);
        } else {
          navigate(`/diary/${dateString}`, {
            state: { programTodo: programSchedule[dateString] },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        // 에러가 발생했을 때 처리할 코드
      });
  };

  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const dateString = toLocalDateString(date);
      const data = {
        userid: localStorage.getItem("userid"),
        date: dateString,
      };
      return axios
        .post("http://localhost:3001/diary_url", data)
        .then((response) => {
          if (response.data.exist === true) {
            return <div className="customTitle">{response.data.title}</div>;
          } else if (programSchedule[dateString]) {
            return (
              <div className="customTitle">{programSchedule[dateString]}</div>
            );
          } else {
            return null;
          }
        })
        .catch((error) => {
          console.log(error);
          return null;
        });
    }
    return null;
  };

  return (
    <div className="background">
      <div className="bg_left">
        <div style={{ borderBottom: "1px solid #d0d7de", width: "500px" }}>
          <div style={{ float: "left" }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Programs
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={type}
                onChange={handleType}
                label="Programs"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Candito"}>Candito 6 Week Strength</MenuItem>
                <MenuItem value={"PHUL"}>PHUL</MenuItem>
                <MenuItem value={"PHAT"}>PHAT</MenuItem>
                <MenuItem value={"HST"}>HST</MenuItem>
                <MenuItem value={"5x5"}>why do not 5x5?</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ paddingTop: "20px" }}>
            <Button variant="text" sx={{ color: "grey" }} onClick={getType}>
              start
            </Button>
            <Button variant="text" sx={{ color: "grey" }} onClick={handleDelete}>
              delete
            </Button>
          </div>
        </div>
        <div className="bg_right_bottom">
          {type === "Candito" && <Explain1></Explain1>}
          {type === "PHUL" && <Explain2></Explain2>}
          {type === "PHAT" && <Explain3></Explain3>}
          {type === "HST" && <Explain4></Explain4>}
          {type === "5x5" && <Explain5></Explain5>}
        </div>
      </div>
      <div className="bg_right">
        <div>
          <h5 className="font_content">
            You've been stronger for 10 days, and go to the gym again today
          </h5>
        </div>
        <div className="Calendar_box">
          <Calendar
            locale="en-GB"
            onChange={onChange}
            value={value}
            tileContent={({ date, view }) => {
              const tile = tileContent.find(
                (t) =>
                  isSameDay(t.date, date) &&
                  (view === "month" || view === "year") &&
                  t.content !== null
              );
              return tile?.content ?? null;
            }}
          />
        </div>
      </div>
    </div>
  );
};

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default CalendarComponent;
