import React, { useState } from "react";
import Calendar from "react-calendar";
import "./CalendarComponent.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

const CalendarComponent = () => {
  useEffect(() => {
    if (localStorage.getItem("isLogin") !== "true") {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [value, setValue] = useState(new Date());
  const navigate = useNavigate();
  const [tileContent, setTileContent] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    const tiles = [];
    const startOfMonth = new Date(value.getFullYear(), value.getMonth(), 1);
    for (let i = 0; i < 31; i++) {
      tiles.push({ date: addDays(startOfMonth, i), view: "month" });
    }
    Promise.all(
      tiles.map((tile) =>
        renderTileContent(tile).then((content) => ({
          ...tile,
          content,
        }))
      )
    ).then(setTileContent);
  }, [value]);

  const handleType = (e) => {
    setType(e.target.value);
  };

  const getType = (e) => {
    console.log(type);
  };
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
          navigate(`/diary/${dateString}`);
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
        <div style={{border : "1px solid #d0d7de" , width : "100%"}}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Programs</InputLabel>
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
              <MenuItem value={1}>Candito 6 Week Strength</MenuItem>
              <MenuItem value={2}>PHUL</MenuItem>
              <MenuItem value={3}>PHAT</MenuItem>
              <MenuItem value={4}>HST</MenuItem>
              <MenuItem value={5}>why do not 5x5?</MenuItem>
            </Select>
          </FormControl>
          <div style={{float: "right" , paddingTop : "20px"}}>
            <Button variant="text"  sx={{ color: 'grey' }} onClick={getType}>
              select
            </Button>
          </div>
          
        </div>
      </div>
      <div className="bg_right">
        <div>
          <h5 className="font_content">
            You've been stronger for 10 days, and go to the gym again today
          </h5>
        </div>
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
