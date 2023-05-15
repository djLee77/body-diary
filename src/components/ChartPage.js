import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import axios from "axios";
import { Button } from "@mui/material";
import "./ChartPage.css";

const ChartPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:3001/diary_data", {
      params: {
        title,
        startDate,
        endDate,
      },
    });
    setChartData(response.data);
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
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
