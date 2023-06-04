import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import axios from "axios";
import { Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import "./ChartPage.css";
import { useNavigate } from "react-router-dom";

const ChartPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [event, setEvent] = useState("");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("isLogin") !== "true") {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:3001/chart_data", {
      params: {
        event,
        startDate,
        endDate,
      },
    });
    setChartData(response.data);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="demo-simple-select-autowidth-label">
                1RM
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
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
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <Button variant="text" sx={{ color: "grey" }} onClick={fetchData}>
        Load Chart
      </Button>
      <LineChart width={500} height={300} data={chartData}>
        <Line type="monotone" dataKey="max" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="url" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default ChartPage;
